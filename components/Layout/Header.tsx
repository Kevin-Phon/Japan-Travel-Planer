import React from 'react';
import { Plane, Calendar, MapPin } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';

export const Header: React.FC = () => {
    return (
        <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden text-center text-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>

            {/* Content */}
            <div className="relative z-20 px-4 animate-fade-in-down w-full max-w-4xl mx-auto flex flex-col items-center">
                <div className="flex justify-center mb-4">
                    <Plane className="w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide font-serif">JAPAN ADVENTURE By Kevin</h1>
                <p className="text-xl md:text-2xl font-light opacity-90 mb-6">1 Month: Ancient Kyoto & Vibrant Fukuoka</p>

                <WeatherWidget />

                <div className="mt-8 flex justify-center gap-4 text-sm font-semibold">
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 30 Days
                    </span>
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Kansai & Kyushu
                    </span>
                </div>
            </div>
        </header>
    );
};
