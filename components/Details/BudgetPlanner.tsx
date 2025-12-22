import React, { useEffect, useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { BudgetConfig } from '../../types';

const EXCHANGE_RATE = 152;

export const BudgetPlanner: React.FC = () => {
  const [budget, setBudget] = useState<BudgetConfig>({
    days: 30,
    accommodation: 15000,
    food: 5000,
    transport: 1500,
    misc: 2000
  });

  const [totals, setTotals] = useState({ dailyJpy: 0, dailyUsd: 0, tripJpy: 0, tripUsd: 0 });

  useEffect(() => {
    const dailyJpy = budget.accommodation + budget.food + budget.transport + budget.misc;
    const tripJpy = dailyJpy * budget.days;
    const dailyUsd = dailyJpy / EXCHANGE_RATE;
    const tripUsd = tripJpy / EXCHANGE_RATE;
    setTotals({ dailyJpy, dailyUsd, tripJpy, tripUsd });
  }, [budget]);

  const handleChange = (key: keyof BudgetConfig, value: string) => {
    const num = parseFloat(value) || 0;
    setBudget(prev => ({ ...prev, [key]: num }));
  };

  const handleReset = () => {
    setBudget({ days: 30, accommodation: 15000, food: 5000, transport: 1500, misc: 2000 });
  };

  const fmt = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const fmtUsd = (num: number) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5" /> Budget Planner
            </h2>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded border border-gray-600">Editable</span>
        </div>
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500 italic">Rate: 1 USD ≈ {EXCHANGE_RATE} JPY</p>
                    <button onClick={handleReset} className="text-xs text-red-600 hover:text-red-800 font-medium transition flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Reset Default
                    </button>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <label className="text-sm font-semibold text-gray-700">Trip Duration (Days)</label>
                    <input 
                        type="number" 
                        value={budget.days} 
                        onChange={(e) => handleChange('days', e.target.value)}
                        className="w-24 text-right p-1.5 border border-gray-300 rounded bg-white focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Accommodation (¥)', key: 'accommodation' },
                        { label: 'Food / Day (¥)', key: 'food' },
                        { label: 'Transport / Day (¥)', key: 'transport' },
                        { label: 'Misc / Day (¥)', key: 'misc' }
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                            <input 
                                type="number" 
                                value={budget[field.key as keyof BudgetConfig]}
                                onChange={(e) => handleChange(field.key as keyof BudgetConfig, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 p-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">Daily Total</span>
                        <div className="text-right">
                            <span className="block font-bold text-gray-800">¥{fmt(totals.dailyJpy)}</span>
                            <span className="block text-xs text-gray-500">{fmtUsd(totals.dailyUsd)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-bold text-lg">Trip Total</span>
                        <div className="text-right">
                            <span className="block font-bold text-xl text-red-600">¥{fmt(totals.tripJpy)}</span>
                            <span className="block text-sm text-gray-500">{fmtUsd(totals.tripUsd)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
