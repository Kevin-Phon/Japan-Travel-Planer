import React from 'react';
import { ItineraryItem } from '../../types';
import { ItineraryCard } from './ItineraryCard';
import { PlusCircle } from 'lucide-react';

interface ItineraryListProps {
  phase: string;
  items: ItineraryItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (item: ItineraryItem) => void;
  onAddNew: () => void;
  title: string;
  subtitle: string;
  stats: Array<{ label: string; value: string; color: string }>;
}

export const ItineraryList: React.FC<ItineraryListProps> = ({ 
  phase, 
  items, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onAddNew,
  title, 
  subtitle,
  stats 
}) => {
  return (
    <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 font-serif">{title}</h2>
                    <p className="text-gray-600">{subtitle}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border bg-${stat.color}-50 border-${stat.color}-100`}>
                        <h3 className={`font-bold text-${stat.color}-800 text-sm uppercase mb-1`}>{stat.label}</h3>
                        <p className="text-gray-700">{stat.value}</p>
                    </div>
                ))}
            </div>

            <button 
                onClick={onAddNew}
                className="w-full mb-8 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition flex items-center justify-center gap-2 font-semibold"
            >
                <PlusCircle className="w-5 h-5" /> Add New Activity to {phase}
            </button>

            <div className="relative space-y-8 pl-4">
                <div className="absolute left-5 top-0 bottom-0 width-[2px] w-0.5 bg-gray-200 z-0"></div>
                {items.map((item) => (
                    <ItineraryCard 
                        key={item.id} 
                        item={item} 
                        onEdit={() => onEdit(item.id)}
                        onDelete={() => onDelete(item.id)}
                        onClick={() => onViewDetails(item)}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};
