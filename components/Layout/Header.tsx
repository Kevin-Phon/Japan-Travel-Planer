import React from 'react';
import { Plane, Calendar, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="relative text-white py-16 px-6 text-center shadow-lg overflow-hidden bg-[#b91c1c]">
            {/* SVG Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <button
                    onClick={() => {
                        const kyoto = localStorage.getItem('kyoto-items');
                        const fukuoka = localStorage.getItem('fukuoka-items');
                        const exportData = `Kyoto:\n${kyoto}\n\nFukuoka:\n${fukuoka}`;
                        navigator.clipboard.writeText(exportData);
                        alert("Data copied to clipboard! Please paste it into the chat.");
                    }}
                    className="absolute top-0 right-0 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm transition"
                >
                    Export Data
                </button>
                <div className="flex justify-center mb-4">
                    <Plane className="w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide font-serif">JAPAN ADVENTURE</h1>
                <p className="text-xl md:text-2xl font-light opacity-90">1 Month: Ancient Kyoto & Vibrant Fukuoka</p>
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
