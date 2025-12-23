import React, { useState } from 'react';
import { Clock, Ticket, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface ItineraryCardProps {
    item: ItineraryItem;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ item, onEdit, onDelete, onClick }) => {
    const [mapKey, setMapKey] = useState(0);
    const mapSrc = `https://maps.google.com/maps?q=${item.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    const handleResetMap = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMapKey(prev => prev + 1);
    };

    return (
        <div className="relative z-10 flex gap-4 group">
            <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md shrink-0 text-sm">
                {item.day}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full hover:-translate-y-[2px] hover:shadow-lg transition duration-300 overflow-hidden relative">

                {/* Actions */}
                <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 cursor-pointer" onClick={onClick}>
                    {/* Content Side */}
                    <div>
                        <div className="relative h-48 group-hover:opacity-95 transition">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                                <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full text-sm">View Details</span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-col mb-2">
                                <h3 className="font-bold text-lg group-hover:text-red-600 transition">{item.title}</h3>
                                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.time}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded w-fit">
                                <Ticket className="w-4 h-4 text-red-600" />
                                <span className="font-medium">{item.cost}</span>
                            </div>
                        </div>
                    </div>
                    {/* Map Side */}
                    <div className="relative min-h-[300px] h-full bg-gray-100 border-t lg:border-t-0 lg:border-l border-gray-200">
                        <iframe
                            key={mapKey}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            scrolling="no"
                            src={mapSrc}
                            title="Map"
                        ></iframe>
                        <button
                            onClick={handleResetMap}
                            className="absolute top-2 right-2 bg-white/90 p-2 rounded-md shadow-md hover:bg-white text-gray-600 hover:text-red-600 transition z-10"
                            title="Reset Map View"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
