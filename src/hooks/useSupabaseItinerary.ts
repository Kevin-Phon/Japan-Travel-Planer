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
                .eq('metadata->>category', category); // Filter by category stored in metadata

            if (error) {
                console.error('Error fetching items:', error);
            } else if (data && data.length > 0) {
                // Map DB structure back to frontend ItineraryItem if needed
                // Our schema mostly matches, but we need to ensure 'id' and 'metadata' are handled correctly
                const mappedItems: ItineraryItem[] = data.map(row => ({
                    ...row,
                    // If row has extra DB fields, they are fine.
                    // Use metadata to fill in complex objects if mapped there.
                    // For now, let's assume flat mapping + metadata reconstruction if needed.
                    ...row.metadata // Spread metadata back into the object for detail fields if any
                }));
                setItems(mappedItems);
            } else {
                // If DB is empty for this category, keep initial data (or maybe we should upload initial data?)
                // For now, let's just respect the empty DB state to avoid overwriting user deletions.
                // But initially, the DB IS empty. We might want to seed it.
                if (initialData.length > 0) {
                    // Initial Seed Logic (Optional: triggers only if truly empty)
                    // setItems(initialData); 
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
        // Clean up fields that might strictly not belong to columns if strict checking is on
        // But we are using a JS client.

        // Prepare payload
        const payload = {
            id: item.id,
            title: item.title,
            date: item.date,
            end_date: item.endDate,
            day: item.day,
            time: item.time,
            cost: item.cost,
            location_name: item.mapQuery,
            image_url: item.image,
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
