import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Backpack } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface PackingItem {
    id: string;
    text: string;
    checked: boolean;
}

const DEFAULT_ITEMS: PackingItem[] = [
    { id: '1', text: 'Passport', checked: false },
    { id: '2', text: 'JR Pass Exchange Order', checked: false },
    { id: '3', text: 'Pocket Wi-Fi / E-SIM', checked: false },
    { id: '4', text: 'Power Bank', checked: false },
    { id: '5', text: 'Cash (Yen)', checked: false },
    { id: '6', text: 'Comfortable Walking Shoes', checked: false },
];

export const PackingList: React.FC = () => {
    const [items, setItems] = useLocalStorage<PackingItem[]>('packing-list', DEFAULT_ITEMS);
    const [newItem, setNewItem] = useState('');

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const item: PackingItem = {
            id: Date.now().toString(),
            text: newItem.trim(),
            checked: false
        };

        setItems(prev => [...prev, item]);
        setNewItem('');
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100) || 0;

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in text-left">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Backpack className="w-8 h-8" />
                        <div>
                            <h2 className="text-2xl font-bold">Travel Checklist</h2>
                            <p className="text-red-100 text-sm">Don't forget the essentials!</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{progress}%</div>
                        <div className="text-xs opacity-80">Ready</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 w-full">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-6">
                    {/* Add Item Form */}
                    <form onSubmit={addItem} className="flex gap-2 mb-8">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Add new item..."
                            className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                        />
                        <button
                            type="submit"
                            disabled={!newItem.trim()}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl font-bold disabled:opacity-50 transition flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add
                        </button>
                    </form>

                    {/* List */}
                    {/* List */}
                    {/* List Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Column 1: Active Items */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                To Pack
                            </h3>

                            {items.length === 0 && (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                    Your bag is empty! Add items above.
                                </div>
                            )}

                            <div className="space-y-3">
                                {items.filter(i => !i.checked).map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-red-200 hover:shadow-sm transition group"
                                    >
                                        <div
                                            onClick={() => toggleItem(item.id)}
                                            className="flex items-center gap-4 cursor-pointer flex-grow"
                                        >
                                            <div className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center transition hover:border-red-400">
                                            </div>
                                            <span className="font-medium text-gray-700">
                                                {item.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {items.filter(i => !i.checked).length === 0 && items.length > 0 && (
                                    <div className="text-center py-8 text-gray-400 italic">
                                        All items packed! 🎉
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Completed Items */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Packed & Ready
                            </h3>

                            <div className="space-y-2 opacity-80">
                                {items.filter(i => i.checked).length === 0 && (
                                    <div className="text-center py-8 text-gray-300 border-2 border-dashed border-gray-50 rounded-xl">
                                        Nothing packed yet.
                                    </div>
                                )}
                                {items.filter(i => i.checked).map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-xl border border-green-100 bg-green-50 transition"
                                    >
                                        <div
                                            onClick={() => toggleItem(item.id)}
                                            className="flex items-center gap-4 cursor-pointer flex-grow"
                                        >
                                            <div className="w-6 h-6 rounded border-2 bg-green-500 border-green-500 flex items-center justify-center text-white">
                                                <CheckSquare className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-green-800 line-through">
                                                {item.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 transition"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
