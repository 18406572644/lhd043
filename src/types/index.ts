export interface Planet {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  distance: number;
  travelDays: number;
  gravity: number;
  temperature: string;
  atmosphere: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  image: string;
  attractions: string[];
  baseCost: number;
  color: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'suit' | 'tool' | 'medical' | 'survival' | 'luxury';
  description: string;
  price: number;
  weight: number;
  required: boolean;
  recommendedPlanets: string[];
  icon: string;
  specifications: { label: string; value: string }[];
  usageInstructions: string;
  precautions: string[];
  manufacturer: string;
  warranty: string;
}

export interface Attraction {
  id: string;
  name: string;
  planetId: string;
  description: string;
  highlights: string[];
  bestTime: string;
  duration: number;
  image: string;
}

export interface Supply {
  id: string;
  name: string;
  category: 'food' | 'water' | 'oxygen' | 'medical' | 'other';
  unit: string;
  perPersonPerDay: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  icon: string;
}

export interface SupplyItem extends Supply {
  totalAmount: number;
}

export interface BudgetDetail {
  baseCost: number;
  transportCost: number;
  accommodationCost: number;
  equipmentCost: number;
  foodCost: number;
  attractionCost: number;
  insuranceCost: number;
  emergencyFund: number;
  total: number;
}

export interface TravelState {
  destination: Planet | null;
  startDate: Date | null;
  durationDays: number;
  travelers: number;
  planets: Planet[];
  equipment: Equipment[];
  attractions: Attraction[];
  loading: { planets: boolean; equipment: boolean; attractions: boolean };
  selectedEquipment: string[];
  favoriteEquipment: string[];
  equipmentSearchQuery: string;
  supplies: SupplyItem[];
  totalBudget: BudgetDetail;
  setDestination: (planet: Planet | null) => void;
  setDuration: (days: number) => void;
  setTravelers: (count: number) => void;
  setStartDate: (date: Date | null) => void;
  toggleEquipment: (id: string) => void;
  toggleFavoriteEquipment: (id: string) => void;
  setEquipmentSearchQuery: (query: string) => void;
  loadPlanets: () => Promise<void>;
  loadEquipment: (planetId?: string) => Promise<void>;
  loadAttractions: (planetId: string) => Promise<void>;
  calculateSupplies: () => void;
  calculateBudget: () => void;
}
