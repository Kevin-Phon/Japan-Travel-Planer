import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface TripScheduleProps {
    items?: ItineraryItem[];
}

export const TripSchedule: React.FC<TripScheduleProps> = ({ items = [] }) => {
    // Safe date parsing to avoid timezone issues (treats YYYY-MM-DD as local wall-clock time)
    const parseLocalYMD = (dateStr: string) => {
        if (!dateStr) return new Date();
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    // Initialize calendar to start date based on the earliest item, otherwise today
    const [currentMonth, setCurrentMonth] = useState(() => {
        const datedItems = items.filter(i => i.date).sort((a, b) => {
            // Simple string compare works for YYYY-MM-DD
            return (a.date || '').localeCompare(b.date || '');
        });

        if (datedItems.length > 0 && datedItems[0].date) {
            return parseLocalYMD(datedItems[0].date);
        }
        return new Date();
    });

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const getItemsForDay = (day: number) => {
        const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Create date string manually to avoid timezone shifting issues
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const loopDateStr = `${year}-${month}-${dayStr}`;

        return items.filter(item => {
            if (!item.date) return false;

            // If single date
            if (!item.endDate) {
                return item.date === loopDateStr;
            }

            // If range
            return loopDateStr >= item.date && loopDateStr <= item.endDate;
        });
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentMonth);
        const startDay = firstDayOfMonth(currentMonth);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-4" />);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const dayItems = getItemsForDay(day);

            let bgClass = "bg-white hover:bg-gray-50 border-gray-100";
            let textClass = "text-gray-700";

            // Highlight today
            const today = new Date();
            const isToday = today.getDate() === day &&
                today.getMonth() === currentMonth.getMonth() &&
                today.getFullYear() === currentMonth.getFullYear();

            if (isToday) {
                bgClass = "bg-red-50 border-red-100";
                textClass = "text-red-700 font-bold";
            }

            days.push(
                <div
                    key={day}
                    className={`relative p-2 h-auto min-h-[8rem] md:min-h-[10rem] border transition-all duration-200 flex flex-col items-start justify-start group rounded-xl overflow-hidden ${bgClass}`}
                >
                    <span className={`text-sm md:text-lg font-medium mb-1 ${textClass}`}>{day}</span>

                    {/* Items Indicators */}
                    <div className="w-full flex flex-col gap-1 z-20">
                        {dayItems.map((item, idx) => (
                            <div key={idx} className="text-xs text-left w-full px-1.5 py-1 rounded leading-tight bg-red-100 text-red-900 font-medium hover:bg-red-200 transition-colors">
                                {(item.time && typeof item.time === 'string') ? <span className="block opacity-75 text-[10px] mb-0.5">{item.time.split(' ')[0]}</span> : null}
                                {item.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header / Stats */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-red-600" />
                        Trip Schedule
                    </h2>
                    <p className="text-gray-500 mt-1"> Overview of all your scheduled activities.</p>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold text-gray-800">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 bg-white">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
};
