import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ItineraryItem } from '../types';

export function useSupabaseItinerary(category: string, initialData: ItineraryItem[]) {
    const [items, setItems] = useState<ItineraryItem[]>(initialData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        fetchItems();
    }, [category]);

    const fetchItems = async () => {
        if (!supabase) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('itinerary_items')
                .select('*')
                .eq('metadata->>category', category)
                .order('date', { ascending: true }); // Sort by earliest date first

            if (error) {
                console.error('Error fetching items:', error);
            } else if (data && data.length > 0) {
            } else if (data && data.length > 0) {
                // Map DB structure back to frontend ItineraryItem
                const mappedItems: ItineraryItem[] = data.map(row => ({
                    // Spread metadata FIRST so that explicit columns overwrite it if conflicts exist
                    ...row.metadata,
                    ...row,
                    mapQuery: row.location_name || row.mapQuery || '', // Fallback to mapQuery if in row (legacy)
                    image: row.image_url || row.image || '',           // Fallback to image if in row (legacy)
                    title: row.title,
                    date: row.date,
                    endDate: row.end_date, // Map DB snake_case to Frontend camelCase
                }));

                // Client-side sort to ensure correct order regardless of DB state
                mappedItems.sort((a, b) => {
                    const dateA = a.date || '9999-99-99'; // Push null dates to end
                    const dateB = b.date || '9999-99-99';
                    if (dateA !== dateB) {
                        return dateA.localeCompare(dateB);
                    }
                    // Secondary sort by time if dates are equal
                    return (a.time || '').localeCompare(b.time || '');
                });

                setItems(mappedItems);
            } else {
                // DB is empty, auto-seed with initial data if available
                if (initialData.length > 0) {
                    console.log("Auto-seeding initial data for category:", category);
                    const itemsToInsert = initialData.map(item => ({
                        id: item.id.length > 30 ? item.id : crypto.randomUUID(),
                        title: item.title,
                        date: item.date,
                        end_date: item.endDate,
                        day: item.day,
                        time: item.time,
                        cost: item.cost,
                        location_name: item.mapQuery,
                        image_url: item.image,
                        description: item.description,
                        metadata: { category, ...item.details }
                    }));

                    const { error: insertError } = await supabase.from('itinerary_items').upsert(itemsToInsert);

                    if (insertError) {
                        console.error('Error auto-seeding data:', insertError);
                    } else {
                        // Use the inserted data to update local state immediately
                        const mappedItems: ItineraryItem[] = itemsToInsert.map(row => ({
                            ...row, // This row is from itemsToInsert, so it has location_name etc.
                            mapQuery: row.location_name,
                            image: row.image_url,
                            ...row.metadata
                        } as any));
                        setItems(mappedItems);
                    }
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Save (Upsert) item
    const saveItem = async (updatedItems: ItineraryItem[]) => {
        // Optimistic update
        setItems(updatedItems);
    };

    // Better Approach: Expose atomic methods
    const addItem = async (item: ItineraryItem) => {
        if (!supabase) {
            setItems(prev => [...prev, item]); // Local fallback
            return;
        }

        const newItem = { ...item, metadata: { ...item.details, category } };

        // Prepare payload
        const payload = {
            id: item.id,
            title: item.title,
            date: item.date,
            end_date: item.endDate,
            day: item.day,
            time: item.time,
            cost: item.cost,
            location_name: item.mapQuery, // Ensure mapQuery is saved to location_name
            image_url: item.image,        // Ensure image is saved to image_url
            description: item.description,
            metadata: { category, ...item.details } // Store details in metadata
        };

        const { error } = await supabase.from('itinerary_items').upsert(payload);
        if (error) console.error("Error adding:", error);

        fetchItems(); // Reload to get distinct IDs or triggers
    };

    const deleteItem = async (id: string) => {
        if (!supabase) {
            setItems(prev => prev.filter(i => i.id !== id)); // Local fallback
            return;
        }
        const { error } = await supabase.from('itinerary_items').delete().eq('id', id);
        if (error) console.error("Error deleting:", error);
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateItem = async (item: ItineraryItem) => {
        if (!supabase) {
            setItems(prev => prev.map(i => i.id === item.id ? item : i)); // Local fallback
            return;
        }
        await addItem(item); // Upsert works for update too
    };

    const seedData = async () => {
        if (!supabase) {
            alert("Supabase is not configured. Cannot seed data.");
            return;
        }
        setLoading(true);
        try {
            const itemsToInsert = initialData.map(item => ({
                id: item.id.length > 30 ? item.id : crypto.randomUUID(),
                title: item.title,
                date: item.date,
                end_date: item.endDate,
                day: item.day,
                time: item.time,
                cost: item.cost,
                location_name: item.mapQuery,
                image_url: item.image,
                description: item.description,
                metadata: { category, ...item.details }
            }));

            const { error } = await supabase.from('itinerary_items').upsert(itemsToInsert);
            if (error) throw error;

            await fetchItems();
        } catch (err) {
            console.error("Error seeding data:", err);
            alert("Failed to seed data. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        addItem,
        deleteItem,
        updateItem,
        seedData,
        loading
    };
}
