
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

import { ItineraryItem } from '../../types';

interface TripDatesData {
    startDate: string;
    endDate: string;
}

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

    const [dates, setDates] = useLocalStorage<TripDatesData>('trip-dates', { startDate: '', endDate: '' });

    // Initialize calendar to start date if exists, otherwise today
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (dates.startDate) return parseLocalYMD(dates.startDate);
        return new Date();
    });

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Adjust for timezone offset to ensure "YYYY-MM-DD" string matches selected day
        const dateString = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
            .toISOString().split('T')[0];

        if (!dates.startDate || (dates.startDate && dates.endDate)) {
            // Start new selection
            setDates({ startDate: dateString, endDate: '' });
        } else {
            // Complete selection
            const start = new Date(dates.startDate);
            const selected = new Date(dateString);

            if (selected < start) {
                // If clicked date is before start, make it the new start
                setDates({ startDate: dateString, endDate: '' });
            } else {
                setDates(prev => ({ ...prev, endDate: dateString }));
            }
        }
    };

    const isDateInRange = (day: number) => {
        if (!dates.startDate || !dates.endDate) return false;

        const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);

        // Normalize times
        current.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0); // Ensure end includes the full day

        return current >= start && current <= end;
    };

    const isStartDate = (day: number) => {
        if (!dates.startDate) return false;
        const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const start = new Date(dates.startDate);
        // Normalize times
        current.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        return current.getTime() === start.getTime();
    };

    const isEndDate = (day: number) => {
        if (!dates.endDate) return false;
        const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const end = new Date(dates.endDate);
        // Normalize times
        current.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return current.getTime() === end.getTime();
    };

    const getItemsForDay = (day: number) => {
        const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Create date string manually to avoid timezone shifting issues
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateString = `${year}-${month}-${dayStr}`;

        return items.filter(item => item.date === dateString);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Calculate duration
    let duration = 0;
    if (dates.startDate && dates.endDate) {
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
    }

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentMonth);
        const startDay = firstDayOfMonth(currentMonth);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty - ${i} `} className="p-4" />);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            const inRange = isDateInRange(day);
            const dayItems = getItemsForDay(day);

            let bgClass = "bg-white hover:bg-gray-50 border-gray-100";
            let textClass = "text-gray-700";

            if (isStart || isEnd) {
                bgClass = "bg-red-600 text-white shadow-md transform scale-105 z-10";
                textClass = "text-white font-bold";
            } else if (inRange) {
                bgClass = "bg-red-50 text-red-900";
            }

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`relative p - 2 md: p - 4 h - 24 md: h - 32 border transition - all duration - 200 flex flex - col items - start justify - start group rounded - xl overflow - hidden ${bgClass} `}
                >
                    <span className={`text - sm md: text - lg font - medium ${textClass} `}>{day}</span>

                    {/* Items Indicators */}
                    <div className="mt-1 w-full flex flex-col gap-1 overflow-hidden">
                        {dayItems.slice(0, 3).map((item, idx) => (
                            <div key={idx} className={`text - [10px] truncate w - full px - 1.5 py - 0.5 rounded ${isStart || isEnd ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'} `}>
                                {item.time ? `${item.time.split(' ')[0]} ` : ''}{item.title}
                            </div>
                        ))}
                        {dayItems.length > 3 && (
                            <div className={`text - [10px] px - 1 ${isStart || isEnd ? 'text-white/80' : 'text-gray-400'} `}>
                                +{dayItems.length - 3} more
                            </div>
                        )}
                    </div>

                    {isStart && <span className="mt-auto text-xs bg-white text-red-600 px-2 py-0.5 rounded-full font-bold shadow-sm self-end">Start</span>}
                    {isEnd && <span className="mt-auto text-xs bg-white text-red-600 px-2 py-0.5 rounded-full font-bold shadow-sm self-end">End</span>}
                </button>
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
                    <p className="text-gray-500 mt-1">Select your start and end dates to plan your adventure.</p>
                </div>

                {dates.startDate && dates.endDate && (
                    <div className="flex gap-4">
                        <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100 text-center">
                            <div className="text-xs text-red-400 uppercase font-bold tracking-wider">Duration</div>
                            <div className="text-2xl font-black text-red-600">{duration} Days</div>
                        </div>
                    </div>
                )}
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

            {/* Debug Section - To be removed after verification */}
            <div className="mt-8 p-6 bg-gray-100 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Scheduled Items List (Debug)</h3>
                <p className="text-sm text-gray-500 mb-4">If your item is here, it is saved. Check if the date matches the calendar month above.</p>
                <div className="space-y-2">
                    {items.filter(i => i.date).length === 0 ? (
                        <p className="text-gray-400 italic">No items have dates assigned yet.</p>
                    ) : (
                        items.filter(i => i.date).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-white p-2 rounded border border-gray-200 text-sm">
                                <span className="font-mono font-bold text-red-600">{item.date}</span>
                                <span className="font-medium text-gray-800">{item.title}</span>
                                <span className="text-gray-400 text-xs">Phase: {'day' in item ? 'Itinerary' : 'Unknown'}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
