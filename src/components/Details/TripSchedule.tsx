import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface TripScheduleProps {
    items?: ItineraryItem[];
}

export const TripSchedule: React.FC<TripScheduleProps> = ({ items = [] }) => {
    // Safe date parsing
    const parseLocalYMD = (dateStr: string) => {
        if (!dateStr) return new Date();
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const dateToYMD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Initialize calendar
    const [currentMonth, setCurrentMonth] = useState(() => {
        const datedItems = items.filter(i => i.date).sort((a, b) => {
            return (a.date || '').localeCompare(b.date || '');
        });

        if (datedItems.length > 0 && datedItems[0].date) {
            return parseLocalYMD(datedItems[0].date);
        }
        return new Date();
    });

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Layout Logic: Assign rows to overlapping items
    const monthLayout = useMemo(() => {
        const layout = new Map<string, number>(); // itemId -> rowIndex
        const occupied = new Set<string>(); // "row-YYYY-MM-DD"

        // Filter items visible in this month (or strictly speaking, valid items)
        const validItems = items.filter(i => i.date).sort((a, b) => {
            // Sort by start date, then duration (longer first usually packs better)
            if (a.date !== b.date) return (a.date || '').localeCompare(b.date || '');
            const durA = (a.endDate || a.date || '').localeCompare(a.date || '');
            const durB = (b.endDate || b.date || '').localeCompare(b.date || '');
            return durB - durA; // descending duration
        });

        validItems.forEach(item => {
            if (!item.date) return;
            const startDate = parseLocalYMD(item.date);
            const endDate = item.endDate ? parseLocalYMD(item.endDate) : startDate;

            // Generate list of date strings for this item
            const spanDates: string[] = [];
            const curr = new Date(startDate);
            while (curr <= endDate) {
                spanDates.push(dateToYMD(curr));
                curr.setDate(curr.getDate() + 1);
            }

            // Find first available row
            let rowIndex = 0;
            while (true) {
                let collision = false;
                for (const d of spanDates) {
                    if (occupied.has(`${rowIndex}-${d}`)) {
                        collision = true;
                        break;
                    }
                }
                if (!collision) break;
                rowIndex++;
            }

            // Assign and mark
            layout.set(item.id, rowIndex);
            for (const d of spanDates) {
                occupied.add(`${rowIndex}-${d}`);
            }
        });

        return layout;
    }, [items, currentMonth]); // Re-calc if items change

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
            days.push(<div key={`empty-${i}`} className="p-4 bg-gray-50/30" />);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const currentDayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateStr = dateToYMD(currentDayDate);
            const isWeekStart = currentDayDate.getDay() === 0;

            // Find items active on this day
            const activeItems = items.filter(item => {
                if (!item.date) return false;
                if (!item.endDate) return item.date === dateStr;
                return dateStr >= item.date && dateStr <= item.endDate;
            });

            // Determine max row index for this specific day
            const dayRows = activeItems.map(i => monthLayout.get(i.id) || 0);
            const maxRow = dayRows.length > 0 ? Math.max(...dayRows) : -1;

            // Highlight today
            const today = new Date();
            const isToday = today.getDate() === day &&
                today.getMonth() === currentMonth.getMonth() &&
                today.getFullYear() === currentMonth.getFullYear();

            const bgClass = isToday ? "bg-red-50/50" : "bg-white";
            const textClass = isToday ? "text-red-700 font-bold bg-red-100 w-7 h-7 flex items-center justify-center rounded-full mx-auto mb-1" : "text-gray-700 font-medium mb-1 ml-1";

            const renderSlots = [];
            // Render slots 0 to maxRow (at least)
            for (let r = 0; r <= Math.max(maxRow, 0); r++) {
                const item = activeItems.find(i => monthLayout.get(i.id) === r);

                if (item) {
                    const isStart = item.date === dateStr;
                    const isEnd = (item.endDate || item.date) === dateStr;

                    // Show title on Start date OR Sunday (if not end date, or if it is end date but not start date... basically show on Sunday unless it's a 1-day segment closing on Sunday? Nah, show on Sunday period if it flows through)
                    // Logic: Show if Start OR (WeekStart AND NOT (End==Start))
                    // Actually simple check: Is this the first segment displayed THIS week for this item?
                    // Yes, WeekStart is sufficient trigger.
                    const showTitle = isStart || (isWeekStart && !isEnd) || (isWeekStart && isEnd && item.date !== dateStr);

                    renderSlots.push(
                        <div
                            key={`slot-${r}`}
                            className={`
                                h-6 text-xs px-1.5 flex items-center overflow-hidden mb-1 relative
                                ${isStart ? 'rounded-l-md ml-1' : ''} 
                                ${isEnd ? 'rounded-r-md mr-1' : ''}
                                ${!isStart ? '-ml-[1px]' : ''} 
                                ${!isEnd ? '-mr-[1px] w-[calc(100%+2px)] z-10' : 'z-20'}
                                bg-red-100 text-red-900 border-red-200 border-y
                                ${isStart ? 'border-l' : ''} ${isEnd ? 'border-r' : ''}
                            `}
                        >
                            {showTitle && <span className="truncate font-medium w-full">{item.title}</span>}
                        </div>
                    );
                } else {
                    renderSlots.push(
                        <div key={`slot-${r}-empty`} className="h-6 mb-1"></div>
                    );
                }
            }

            days.push(
                <div
                    key={day}
                    className={`relative min-h-[8rem] border-b border-r border-gray-100 flex flex-col group overflow-hidden ${bgClass}`}
                >
                    <div className="pt-2">
                        <span className={textClass}>{day}</span>
                    </div>

                    {/* Items Indicators */}
                    <div className="flex-grow w-full flex flex-col mt-1">
                        {renderSlots}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-red-600" />
                        Trip Schedule
                    </h2>
                    <p className="text-gray-500 mt-1">Overview of all your scheduled activities.</p>
                </div>
            </div>

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

                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 bg-white">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
};
