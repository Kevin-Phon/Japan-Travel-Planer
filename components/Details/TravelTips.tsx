import React, { useState } from 'react';
import { Lightbulb, Plus, Trash2, Pencil, Wifi, CreditCard, Footprints } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Tip } from '../../types';

export const TravelTips: React.FC = () => {
    const [tips, setTips] = useLocalStorage<Tip[]>('travel-tips', [
        { id: '1', icon: 'wifi', title: 'Internet', text: 'Download an eSIM app like Ubigi or Airalo before you fly.' },
        { id: '2', icon: 'credit-card', title: 'Transport', text: 'Buy an IC Card (ICOCA or SUICA) immediately at the airport.' },
        { id: '3', icon: 'footprints', title: 'Etiquette', text: "Don't eat while walking. Wear slip-on shoes for easy temple access." }
    ]);
    const [newTip, setNewTip] = useState('');

    const getIcon = (name: string) => {
        switch (name) {
            case 'wifi': return <Wifi className="w-4 h-4" />;
            case 'credit-card': return <CreditCard className="w-4 h-4" />;
            case 'footprints': return <Footprints className="w-4 h-4" />;
            default: return <Pencil className="w-4 h-4" />;
        }
    };

    const handleAdd = () => {
        if (!newTip.trim()) return;
        setTips([...tips, { id: Date.now().toString(), icon: 'pencil', title: 'Note', text: newTip }]);
        setNewTip('');
    };

    const handleDelete = (id: string) => {
        setTips(tips.filter(t => t.id !== id));
    };

    const handleUpdate = (id: string, field: 'title' | 'text', value: string) => {
        setTips(tips.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-700 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> Travel Tips & Notes
                </h2>
                <span className="text-xs bg-red-800 px-2 py-1 rounded border border-red-600">Editable</span>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTip}
                            onChange={(e) => setNewTip(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            placeholder="Add a new note..."
                            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 text-sm"
                        />
                        <button onClick={handleAdd} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {tips.map((tip) => (
                        <div key={tip.id} className="flex gap-3 items-start group bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
                            <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1 shrink-0">
                                {getIcon(tip.icon)}
                            </div>
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={tip.title}
                                    onChange={(e) => handleUpdate(tip.id, 'title', e.target.value)}
                                    className="font-bold text-gray-800 bg-transparent w-full focus:outline-none focus:underline mb-1"
                                />
                                <textarea
                                    value={tip.text}
                                    onChange={(e) => handleUpdate(tip.id, 'text', e.target.value)}
                                    className="text-sm text-gray-600 bg-transparent w-full resize-none focus:outline-none focus:underline"
                                    rows={2}
                                />
                            </div>
                            <button onClick={() => handleDelete(tip.id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
