import React from 'react';
import { Landmark, Utensils, Wallet, Backpack } from 'lucide-react';
import { TabType } from '../../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const getTabClass = (tab: TabType) => {
    const baseClass = "py-4 px-2 md:px-6 transition-colors flex items-center gap-2 outline-none";
    if (activeTab === tab) {
      return `${baseClass} border-b-2 border-[#b91c1c] text-[#b91c1c] font-bold`;
    }
    return `${baseClass} text-gray-500 hover:text-red-700`;
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex justify-around md:justify-center md:gap-12">
        <button onClick={() => setActiveTab('kyoto')} className={getTabClass('kyoto')}>
          <Landmark className="w-5 h-5" />
          <span>Kyoto (Days 1-15)</span>
        </button>
        <button onClick={() => setActiveTab('fukuoka')} className={getTabClass('fukuoka')}>
          <Utensils className="w-5 h-5" />
          <span>Fukuoka (Days 16-30)</span>
        </button>
        <button onClick={() => setActiveTab('details')} className={getTabClass('details')}>
          <Wallet className="w-5 h-5" />
          <span>Budget & Tips</span>
        </button>
        <button onClick={() => setActiveTab('checklist')} className={getTabClass('checklist')}>
          <Backpack className="w-5 h-5" />
          <span>Checklist</span>
        </button>
      </div>
    </nav>
  );
};
