export interface ItineraryItem {
  id: string;
  day: string;
  title: string;
  time: string;
  description: string;
  image: string;
  cost: string;
  mapQuery: string;
  hiddenGemId: string;
  details?: {
    overview: string;
    food: {
      title: string;
      desc: string;
      img: string;
    };
    activity: {
      title: string;
      desc: string;
      img: string;
    };
    mustDos: string[];
  };
}

export interface BudgetConfig {
  days: number;
  accommodation: number;
  food: number;
  transport: number;
  misc: number;
}

export interface Tip {
  id: string;
  icon: string;
  title: string;
  text: string;
}

export type TabType = 'kyoto' | 'fukuoka' | 'details';

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}
