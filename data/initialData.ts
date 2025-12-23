import { ItineraryItem } from '../types';

export const initialKyotoData: ItineraryItem[] = [
  {
    id: 'k1',
    day: '1',
    title: "Arrival & Gion Exploration",
    time: "17:00 - 20:00",
    description: "Check into your hotel and walk through the historic Geisha district.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    cost: "Free (Walking)",
    mapQuery: "Gion+District+Kyoto",
    hiddenGemId: "extra-day1",
    details: {
      overview: "Gion is Kyoto's most famous geisha district, located around Shijo Avenue between the Kamo River in the west and Yasaka Shrine in the east. It is filled with shops, restaurants, and ochaya (teahouses).",
      food: {
        title: "Matcha Parfaits & Kaiseki",
        desc: "Visit Tsujiri for their famous Matcha desserts. For dinner, try a traditional Kaiseki Ryori.",
        img: "https://images.unsplash.com/photo-1542358896-146313b35541?auto=format&fit=crop&w=600&q=80"
      },
      activity: {
        title: "Spotting Geiko & Maiko",
        desc: "Walk along Hanamikoji Street at dusk. Be respectful and do not block their path.",
        img: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80"
      },
      mustDos: [
        "Walk across the Shijo Bridge at sunset.",
        "Visit Yasaka Shrine nearby which is beautifully lit at night.",
        "Explore the Shirakawa Area along the canal."
      ]
    }
  },
  {
    id: 'k2',
    day: '2',
    title: "Northern Kyoto Highlights",
    time: "09:00 - 15:00",
    description: "Visit the iconic Golden Pavilion followed by the Bamboo Grove.",
    image: "https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?auto=format&fit=crop&w=800&q=80",
    cost: "Kinkaku-ji: ¥500",
    mapQuery: "Kinkakuji+Kyoto",
    hiddenGemId: "extra-day2",
    details: {
      overview: "Kinkaku-ji, the Golden Pavilion, is a Zen temple in northern Kyoto whose top two floors are completely covered in gold leaf.",
      food: {
        title: "Gold Leaf Ice Cream",
        desc: "Just outside the exit of Kinkaku-ji, look for vendors selling soft-serve ice cream wrapped in real edible gold leaf.",
        img: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80"
      },
      activity: {
        title: "Zen Meditation at Ryoan-ji",
        desc: "A short bus ride away is Ryoan-ji, famous for its rock garden.",
        img: "https://images.unsplash.com/photo-1589994684942-d66872d82e11?auto=format&fit=crop&w=600&q=80"
      },
      mustDos: [
        "Capture the reflection of the Golden Pavilion in Kyoko-chi pond.",
        "Listen to the rustling sounds in the Arashiyama Bamboo Grove.",
        "Visit the Tenryu-ji temple gardens."
      ]
    }
  },
  {
    id: 'k3',
    day: '3',
    title: "Fushimi Inari & Nara",
    time: "08:00 - 17:00",
    description: "Early morning hike through torii gates, then a train ride to feed deer.",
    image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
    cost: "Inari: Free | Nara: ¥600",
    mapQuery: "Fushimi+Inari+Taisha",
    hiddenGemId: "extra-day3",
    details: {
      overview: "Fushimi Inari is famous for its thousands of vermilion torii gates. Nara Park is home to hundreds of freely roaming deer.",
      food: {
        title: "Inari Sushi",
        desc: "Sushi rice in fried tofu, said to be the favorite food of the fox spirits.",
        img: "https://images.unsplash.com/photo-1615887023516-9b6c4ad3c178?auto=format&fit=crop&w=600&q=80"
      },
      activity: {
        title: "Hiking Mt. Inari",
        desc: "The full hike to the summit takes 2-3 hours. The crowds thin out after Yotsutsuji.",
        img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
      },
      mustDos: [
        "Walk through the Senbon Torii.",
        "Feed the bowing deer in Nara Park.",
        "See the Great Buddha (Daibutsu) at Todai-ji Temple."
      ]
    }
  },
  {
    id: "1766452188178",
    day: "4 - 7",
    time: "8:00 - 17:00",
    title: "Beginning of Osaka",
    description: "Walk around the city and  famous places",
    image: "https://cdn.cheapoguides.com/wp-content/uploads/sites/3/2020/06/osaka-dotonbori-iStock-1138049211-1024x683.jpg",
    cost: "Various",
    mapQuery: "Osaka",
    hiddenGemId: "gem-1766452188178",
    details: {
      overview: "Osaka is known for its modern architecture, nightlife and hearty street food.",
      food: {
        title: "Osaka Street Food",
        desc: "Try Takoyaki and Okonomiyaki.",
        img: "https://photos.smugmug.com/Osaka/Osaka-Categories/i-zqxSZHf/0/L/Osaka_Restaurants-L.jpg"
      },
      activity: {
        title: "City Exploration",
        desc: "Visit Dotonbori and Osaka Castle.",
        img: "https://viva-holidays.co.uk/_next/image/?url=https%3A%2F%2Fapi.viva-holidays.co.uk%2Fimages%2F_tok_oas.png&w=3840&q=75"
      },
      mustDos: []
    }
  }
];

export const initialFukuokaData: ItineraryItem[] = [
  {
    id: 'f1',
    day: '16',
    title: "Arrival & Ramen Hunting",
    time: "18:00 - 22:00",
    description: "Settle in and visit the famous river-side food stalls.",
    image: "https://images.unsplash.com/photo-1588647548777-6e6a7183eb42?auto=format&fit=crop&w=800&q=80",
    cost: "Ramen Dinner: ~¥2000",
    mapQuery: "Nakasu+Yatai",
    hiddenGemId: "extra-day16",
    details: {
      overview: "Fukuoka is famous for its open-air food stands (Yatai). The best concentration is on the southern end of Nakasu Island.",
      food: {
        title: "Hakata Tonkotsu Ramen",
        desc: "Creamy pork bone broth with thin, straight noodles.",
        img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=600&q=80"
      },
      activity: {
        title: "Yatai Hopping",
        desc: "Have a drink and some gyoza at one stall, then move to another for ramen.",
        img: "https://images.unsplash.com/photo-1517436075179-88741aa2c943?auto=format&fit=crop&w=600&q=80"
      },
      mustDos: [
        "Walk through Canal City Hakata.",
        "Visit Kushida Shrine.",
        "Try Motsunabe (offal hot pot)."
      ]
    }
  },
  {
    id: 'f2',
    day: '17',
    title: "City Highlights & Seaside",
    time: "10:00 - 17:00",
    description: "Walk around Ohori Park lake and see the sunset from the tower.",
    image: "https://images.unsplash.com/photo-1634547434316-24237d6dd033?auto=format&fit=crop&w=800&q=80",
    cost: "Tower: ¥800",
    mapQuery: "Fukuoka+Tower",
    hiddenGemId: "extra-day17",
    details: {
      overview: "Momochi Seaside Park is a futuristic waterfront area with a man-made beach and the iconic Fukuoka Tower.",
      food: {
        title: "Mentaiko (Spicy Cod Roe)",
        desc: "Try it on pasta or with rice. A local specialty.",
        img: "https://images.unsplash.com/photo-1549203649-5f2b847842ba?auto=format&fit=crop&w=600&q=80"
      },
      activity: {
        title: "Beach Walk at Momochi",
        desc: "Enjoy a relaxing walk on the artificial beach.",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      },
      mustDos: [
        "Go to the observation deck of Fukuoka Tower.",
        "Rent a swan boat in Ohori Park.",
        "Visit the ruins of Fukuoka Castle."
      ]
    }
  }
];
