import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { ItineraryList } from './components/Itinerary/ItineraryList';
import { BudgetPlanner } from './components/Details/BudgetPlanner';
import { TravelTips } from './components/Details/TravelTips';
import { PackingList } from './components/Details/PackingList';
import { TripSchedule } from './components/Details/TripSchedule';
import { DetailModal } from './components/Modals/DetailModal';
import { ActivityModal } from './components/Modals/ActivityModal';
import { AiAssistant } from './components/AiAssistant/AiAssistant';
import { initialKyotoData, initialFukuokaData } from './data/initialData';
import { ItineraryItem, TabType } from './types';
import { Plane, Calendar, MapPin, MessageCircle, Wallet, Backpack } from 'lucide-react';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('kyoto');
    const [kyotoItems, setKyotoItems] = useLocalStorage<ItineraryItem[]>('kyoto-items', initialKyotoData);
    const [fukuokaItems, setFukuokaItems] = useLocalStorage<ItineraryItem[]>('fukuoka-items', initialFukuokaData);

    // Modal States
    const [detailItem, setDetailItem] = useState<ItineraryItem | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ItineraryItem | undefined>(undefined);
    const [editPhase, setEditPhase] = useState<'kyoto' | 'fukuoka'>('kyoto');

    // Logic to handle deleting items
    const handleDelete = (id: string, phase: 'kyoto' | 'fukuoka') => {
        if (phase === 'kyoto') {
            setKyotoItems(prev => prev.filter(i => i.id !== id));
        } else {
            setFukuokaItems(prev => prev.filter(i => i.id !== id));
        }
    };

    // Logic to handle opening edit modal
    const handleOpenEdit = (phase: 'kyoto' | 'fukuoka', id?: string) => {
        setEditPhase(phase);
        if (id) {
            const item = phase === 'kyoto' ? kyotoItems.find(i => i.id === id) : fukuokaItems.find(i => i.id === id);
            setEditItem(item);
        } else {
            setEditItem(undefined);
        }
        setIsEditModalOpen(true);
    };

    // Logic to save (add/edit) item
    const handleSaveActivity = (itemData: Partial<ItineraryItem>) => {
        const listSetter = editPhase === 'kyoto' ? setKyotoItems : setFukuokaItems;

        listSetter(prev => {
            if (editItem) {
                // Update existing
                return prev.map(i => i.id === editItem.id ? { ...i, ...itemData } as ItineraryItem : i);
            } else {
                // Add new
                const newItem = {
                    ...itemData,
                    id: Date.now().toString(),
                    hiddenGemId: `gem - ${Date.now()} `
                } as ItineraryItem;
                // Simple sort by day if possible (naive check)
                const newList = [...prev, newItem];
                return newList.sort((a, b) => parseInt(a.day) - parseInt(b.day));
            }
        });
    };

    // Logic to update details from detailed view
    const handleDetailUpdate = (updatedItem: ItineraryItem) => {
        // Update in the main lists
        const updater = (list: ItineraryItem[]) => list.map(i => i.id === updatedItem.id ? updatedItem : i);
        setKyotoItems(updater);
        setFukuokaItems(updater);
        setDetailItem(updatedItem); // Update the currently open modal data
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fdfbf7] font-sans text-gray-800">
            <Header />
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-grow max-w-5xl mx-auto w-full p-6 pb-20">
                {activeTab === 'kyoto' && (
                    <ItineraryList
                        phase="Kyoto"
                        title="Phase 1: The Ancient Capital"
                        subtitle="Experience the heart of traditional Japan. Temples, nature, and history."
                        items={kyotoItems}
                        onEdit={(id) => handleOpenEdit('kyoto', id)}
                        onDelete={(id) => handleDelete(id, 'kyoto')}
                        onViewDetails={setDetailItem}
                        onAddNew={() => handleOpenEdit('kyoto')}
                        stats={[
                            { label: 'Stay', value: 'Gion or Kawaramachi', color: 'red' },
                            { label: 'Must Eat', value: 'Kaiseki, Yudofu, Matcha', color: 'orange' },
                            { label: 'Transport', value: 'Bus & Walking', color: 'blue' }
                        ]}
                    />
                )}

                {activeTab === 'fukuoka' && (
                    <ItineraryList
                        phase="Fukuoka"
                        title="Phase 2: The Gateway to Asia"
                        subtitle="Culinary capital, modern cityscapes, and Kyushu adventures."
                        items={fukuokaItems}
                        onEdit={(id) => handleOpenEdit('fukuoka', id)}
                        onDelete={(id) => handleDelete(id, 'fukuoka')}
                        onViewDetails={setDetailItem}
                        onAddNew={() => handleOpenEdit('fukuoka')}
                        stats={[
                            { label: 'Stay', value: 'Hakata or Tenjin', color: 'red' },
                            { label: 'Must Eat', value: 'Tonkotsu Ramen, Motsunabe', color: 'orange' },
                            { label: 'Transport', value: 'Subway & Train', color: 'blue' }
                        ]}
                    />
                )}

                {activeTab === 'details' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BudgetPlanner />
                            <TravelTips />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-lg mb-4">Quick Map Links</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: 'Fushimi Inari', query: 'Fushimi+Inari+Taisha+Kyoto' },
                                    { name: 'Kiyomizu-dera', query: 'Kiyomizu-dera+Kyoto' },
                                    { name: 'Nakasu Yatai', query: 'Nakasu+Yatai' },
                                    { name: 'Dazaifu Tenmangu', query: 'Dazaifu+Tenmangu' }
                                ].map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={`https://www.google.com/maps/search/?api=1&query=${link.query}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                                    >
                                        <MapPin className="w-4 h-4" /> {link.name}
                                    </a>
                                ))}
                            </div >
                        </div >
                    </div >
                )}

                {activeTab === 'checklist' && (
                    <PackingList />
                )}

                {activeTab === 'schedule' && (
                    <TripSchedule />
                )}
            </main >

            <footer className="bg-gray-800 text-gray-400 py-8 text-center mt-auto">
                <p className="mb-2">Japan Trip Planner • Kyoto & Fukuoka</p>
                <p className="text-xs opacity-50">Refactored to React + Vite</p>
            </footer>

            {/* Modals */}
            <DetailModal
                isOpen={!!detailItem}
                item={detailItem}
                onClose={() => setDetailItem(null)}
                onUpdate={handleDetailUpdate}
            />

            <ActivityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveActivity}
                initialData={editItem}
                phase={editPhase}
            />

            <AiAssistant />
        </div >
    );
};

export default App;
