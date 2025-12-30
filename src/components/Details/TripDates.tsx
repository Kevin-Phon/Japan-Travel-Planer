import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Plane } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface TripDatesData {
    startDate: string;
    endDate: string;
}

export const TripDates: React.FC = () => {
    const [dates, setDates] = useLocalStorage<TripDatesData>('trip-dates', { startDate: '', endDate: '' });
    const [timeLeft, setTimeLeft] = useState<{ days: number; status: 'upcoming' | 'ongoing' | 'past' | 'none' }>({ days: 0, status: 'none' });

    useEffect(() => {
        if (!dates.startDate) {
            setTimeLeft({ days: 0, status: 'none' });
            return;
        }

        const start = new Date(dates.startDate);
        const end = dates.endDate ? new Date(dates.endDate) : null;
        const now = new Date();

        // Reset time part for pure date comparison
        start.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const diffTime = start.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            setTimeLeft({ days: diffDays, status: 'upcoming' });
        } else if (end && now <= end) {
            setTimeLeft({ days: 0, status: 'ongoing' });
        } else if (diffDays <= 0 && (!end || now > end)) {
            setTimeLeft({ days: Math.abs(diffDays), status: 'past' });
        }
    }, [dates]);

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        setDates(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                {/* Date Inputs */}
                <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">Trip Schedule</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
                            <input
                                type="date"
                                value={dates.startDate}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-gray-700 bg-gray-50 hover:bg-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Date</label>
                            <input
                                type="date"
                                value={dates.endDate}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-gray-700 bg-gray-50 hover:bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Countdown Display */}
                <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 flex items-center justify-center">
                    {dates.startDate ? (
                        <div className="text-center space-y-2">
                            {timeLeft.status === 'upcoming' && (
                                <>
                                    <div className="text-4xl md:text-5xl font-black text-blue-600 tracking-tight">
                                        {timeLeft.days}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Clock className="w-4 h-4" /> Days Until Japan
                                    </div>
                                </>
                            )}
                            {timeLeft.status === 'ongoing' && (
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-green-500 flex items-center justify-center gap-2">
                                        <Plane className="w-8 h-8 animate-pulse" />
                                        On Trip!
                                    </div>
                                    <p className="text-gray-400 text-sm">Have a wonderful time in Japan!</p>
                                </div>
                            )}
                            {timeLeft.status === 'past' && (
                                <div className="text-gray-400">
                                    <div className="font-bold text-xl">Trip Completed</div>
                                    <div className="text-sm">Hope you had a great journey!</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-4">
                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Set a start date to see countdown</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
