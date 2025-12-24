import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

interface WeatherData {
    city: string;
    temp: number;
    condition: 'Clear' | 'Cloudy' | 'Rain' | 'Unknown';
}

export const WeatherWidget: React.FC = () => {
    const [kyotoWeather, setKyotoWeather] = useState<WeatherData | null>(null);
    const [fukuokaWeather, setFukuokaWeather] = useState<WeatherData | null>(null);

    // Helper to fetch weather
    const fetchWeather = async (lat: number, lon: number, city: string) => {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await res.json();
            const code = data.current_weather.weathercode;

            // Map WMO codes to simple conditions
            let condition: WeatherData['condition'] = 'Unknown';
            if (code <= 3) condition = 'Clear';
            else if (code <= 48) condition = 'Cloudy';
            else condition = 'Rain';

            return {
                city,
                temp: Math.round(data.current_weather.temperature),
                condition
            } as WeatherData;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
        const loadWeather = async () => {
            const k = await fetchWeather(35.0116, 135.7681, 'Kyoto');
            const f = await fetchWeather(33.5902, 130.4017, 'Fukuoka');
            setKyotoWeather(k);
            setFukuokaWeather(f);
        };
        loadWeather();
        // Refresh every 15 mins
        const interval = setInterval(loadWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const WeatherIcon = ({ condition }: { condition: string }) => {
        if (condition === 'Clear') return <Sun className="w-4 h-4 text-yellow-500" />;
        if (condition === 'Rain') return <CloudRain className="w-4 h-4 text-blue-400" />;
        return <Cloud className="w-4 h-4 text-gray-400" />;
    };

    if (!kyotoWeather || !fukuokaWeather) return null;

    return (
        <div className="flex gap-4 text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/20 shadow-sm">
            <div className="flex items-center gap-1.5">
                <WeatherIcon condition={kyotoWeather.condition} />
                <span>Kyoto {kyotoWeather.temp}°C</span>
            </div>
            <div className="w-px bg-white/30 h-4"></div>
            <div className="flex items-center gap-1.5">
                <WeatherIcon condition={fukuokaWeather.condition} />
                <span>Fukuoka {fukuokaWeather.temp}°C</span>
            </div>
        </div>
    );
};
