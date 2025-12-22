import React, { useState } from 'react';
import { X, Pencil, Save, Clock, Ticket } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItineraryItem | null;
  onUpdate: (updatedItem: ItineraryItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  // We keep local state for the edit form inside the modal
  const [editForm, setEditForm] = useState<ItineraryItem | null>(null);

  // When modal opens or item changes, reset local edit state
  React.useEffect(() => {
    if (item) {
        setEditForm(JSON.parse(JSON.stringify(item))); // Deep copy
    }
  }, [item, isOpen]);

  if (!isOpen || !item || !editForm) return null;

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const updateDetail = (path: string[], value: string | string[]) => {
    const newData = { ...editForm };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setEditForm(newData);
  };

  // Helper to render view or edit inputs
  const details = item.details || { overview: item.description, food: { title: '', desc: '', img: ''}, activity: { title: '', desc: '', img: ''}, mustDos: []};
  const editDetails = editForm.details || { overview: editForm.description, food: { title: '', desc: '', img: ''}, activity: { title: '', desc: '', img: ''}, mustDos: []};

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Controls */}
            <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                <X className="w-6 h-6" />
            </button>
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                className={`absolute top-4 right-16 z-20 px-4 py-2 rounded-full font-bold shadow-lg transition flex items-center gap-2 ${isEditing ? 'bg-green-600 text-white' : 'bg-white/90 text-gray-800'}`}
            >
                {isEditing ? <><Save className="w-4 h-4"/> Save</> : <><Pencil className="w-4 h-4"/> Edit</>}
            </button>

            {/* Content Container */}
            <div className="flex flex-col md:flex-row w-full h-full">
                
                {/* Left: Images */}
                <div className="w-full md:w-1/2 h-1/3 md:h-full bg-gray-100 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {isEditing ? (
                         <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Main Image</label>
                                <input className="w-full p-2 border rounded text-sm mb-2" value={editForm.image} onChange={(e) => updateDetail(['image'], e.target.value)} />
                                <img src={editForm.image} className="w-full h-32 object-cover rounded opacity-50" alt="preview" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Food Image</label>
                                <input className="w-full p-2 border rounded text-sm mb-2" value={editDetails.food?.img || ''} onChange={(e) => updateDetail(['details', 'food', 'img'], e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Activity Image</label>
                                <input className="w-full p-2 border rounded text-sm mb-2" value={editDetails.activity?.img || ''} onChange={(e) => updateDetail(['details', 'activity', 'img'], e.target.value)} />
                            </div>
                         </div>
                    ) : (
                        <>
                            <div className="relative group">
                                <img src={item.image} className="w-full rounded-xl shadow-lg object-cover min-h-[300px]" alt="Main" />
                                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">📍 Main Attraction</div>
                            </div>
                            <div className="relative group">
                                <img src={details.food?.img || 'https://placehold.co/600x400'} className="w-full rounded-xl shadow-lg object-cover min-h-[300px]" alt="Food" />
                                <div className="absolute bottom-4 left-4 bg-orange-600/80 text-white px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">🍜 Local Food</div>
                            </div>
                            <div className="relative group">
                                <img src={details.activity?.img || 'https://placehold.co/600x400'} className="w-full rounded-xl shadow-lg object-cover min-h-[300px]" alt="Activity" />
                                <div className="absolute bottom-4 left-4 bg-blue-600/80 text-white px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">✨ Activity</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Text */}
                <div className="w-full md:w-1/2 h-2/3 md:h-full overflow-y-auto bg-white p-6 md:p-10 no-scrollbar">
                    {isEditing ? (
                         <div className="space-y-6">
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <input className="w-full p-2 border rounded font-bold text-lg mb-2" value={editForm.title} onChange={(e) => updateDetail(['title'], e.target.value)} />
                                <div className="flex gap-2">
                                    <input className="w-1/2 p-2 border rounded text-sm" value={editForm.time} onChange={(e) => updateDetail(['time'], e.target.value)} />
                                    <input className="w-1/2 p-2 border rounded text-sm" value={editForm.cost} onChange={(e) => updateDetail(['cost'], e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block font-bold text-gray-700">Overview</label>
                                <textarea rows={4} className="w-full p-2 border rounded text-sm" value={editDetails.overview} onChange={(e) => updateDetail(['details', 'overview'], e.target.value)} />
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                <input className="w-full p-2 border rounded text-sm font-bold mb-2" value={editDetails.food?.title} onChange={(e) => updateDetail(['details', 'food', 'title'], e.target.value)} placeholder="Food Title" />
                                <textarea rows={2} className="w-full p-2 border rounded text-sm" value={editDetails.food?.desc} onChange={(e) => updateDetail(['details', 'food', 'desc'], e.target.value)} placeholder="Food Desc" />
                            </div>
                         </div>
                    ) : (
                        <>
                            <div className="mb-8 border-b border-gray-100 pb-6">
                                <h2 className="text-4xl font-bold text-gray-800 mb-2 font-serif">{item.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium"><Clock className="w-4 h-4" /> {item.time}</span>
                                    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium"><Ticket className="w-4 h-4" /> {item.cost}</span>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-l-4 border-black pl-3">Overview</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{details.overview || item.description}</p>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-l-4 border-orange-500 pl-3">Local Food</h3>
                                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                                    <h4 className="font-bold text-orange-800 mb-2">{details.food?.title}</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{details.food?.desc}</p>
                                </div>
                            </div>

                             <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-l-4 border-blue-500 pl-3">Activities</h3>
                                <div className="mb-4">
                                    <h4 className="font-bold text-blue-900 mb-1">{details.activity?.title}</h4>
                                    <p className="text-gray-600 text-sm mb-3">{details.activity?.desc}</p>
                                </div>
                                <ul className="space-y-3">
                                    {(details.mustDos || []).map((todo, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                                            <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                                            <span className="text-gray-700 text-sm">{todo}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
