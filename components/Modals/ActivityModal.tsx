import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Partial<ItineraryItem>) => void;
    initialData?: ItineraryItem;
    phase: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSave, initialData, phase }) => {
    const [formData, setFormData] = useState<Partial<ItineraryItem>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({});
        }
    }, [initialData, isOpen]);

    const handleChange = (key: keyof ItineraryItem, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        // Basic validation
        if (!formData.title || !formData.day) {
            alert("Please enter a title and day.");
            return;
        }

        const newItem: Partial<ItineraryItem> = {
            ...formData,
            description: formData.description || '',
            time: formData.time || '',
            cost: formData.cost || '',
            image: formData.image || 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80',
            mapQuery: formData.mapQuery || formData.title,
        };
        onSave(newItem);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{initialData ? 'Edit Activity' : `Add Activity to ${phase}`}</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Day(s)</label>
                                <input
                                    type="text"
                                    value={formData.day || ''}
                                    onChange={e => handleChange('day', e.target.value)}
                                    placeholder="e.g. 1"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.date || ''}
                                    onChange={e => handleChange('date', e.target.value)}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="text"
                                    value={formData.time || ''}
                                    onChange={e => handleChange('time', e.target.value)}
                                    placeholder="e.g. 17:00 - 20:00"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={e => handleChange('title', e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description || ''}
                                onChange={e => handleChange('description', e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                value={formData.image || ''}
                                onChange={e => handleChange('image', e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Details</label>
                                <input
                                    type="text"
                                    value={formData.cost || ''}
                                    onChange={e => handleChange('cost', e.target.value)}
                                    placeholder="e.g. Free or ¥500"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location for Map</label>
                                <input
                                    type="text"
                                    value={decodeURIComponent(formData.mapQuery || '').replace(/\+/g, ' ')}
                                    onChange={e => handleChange('mapQuery', encodeURIComponent(e.target.value))}
                                    placeholder="e.g. Gion District"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded font-bold">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
