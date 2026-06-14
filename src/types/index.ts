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

export interface DiaryImage {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: string;
  planetId?: string;
  attractionId?: string;
  images: DiaryImage[];
  mood?: 'excited' | 'peaceful' | 'adventurous' | 'tired' | 'amazed';
  weather?: string;
  crewLogNumber: number;
}

export interface CheckInRecord {
  id: string;
  attractionId: string;
  planetId: string;
  checkInTime: string;
  notes?: string;
  diaryEntryId?: string;
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
  diaryEntries: DiaryEntry[];
  checkInRecords: CheckInRecord[];
  nextCrewLogNumber: number;
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
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'timestamp' | 'crewLogNumber'>) => void;
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => void;
  deleteDiaryEntry: (id: string) => void;
  addCheckIn: (record: Omit<CheckInRecord, 'id' | 'checkInTime'>) => void;
  removeCheckIn: (id: string) => void;
  isAttractionCheckedIn: (attractionId: string) => boolean;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

export type MessagePriority = 'normal' | 'urgent';
export type MessageStatus = 'sending' | 'transmitting' | 'delivered' | 'received' | 'failed';
export type MessageType = 'text' | 'voice';

export interface CommMessage {
  id: string;
  type: MessageType;
  direction: 'sent' | 'received';
  contactId: string;
  content: string;
  priority: MessagePriority;
  status: MessageStatus;
  timestamp: string;
  delaySeconds: number;
  signalStrength: number;
  hasInterference: boolean;
  voiceData?: {
    duration: number;
    noiseLevel: number;
  };
}

export interface SignalStatus {
  strength: number;
  frequency: number;
  bandwidth: number;
  interferenceLevel: number;
  solarStormActive: boolean;
}

export interface InterferenceEvent {
  id: string;
  type: 'solar_storm' | 'cosmic_rays' | 'atmospheric' | 'equipment';
  severity: 'mild' | 'moderate' | 'severe';
  startTime: string;
  duration: number;
  affectedFrequencies: [number, number];
  description: string;
}

export interface CommState {
  messages: CommMessage[];
  contacts: Contact[];
  selectedContact: Contact | null;
  signalStatus: SignalStatus;
  activeInterference: InterferenceEvent | null;
  isTransmitting: boolean;
  currentTransmission: {
    messageId: string;
    progress: number;
    startTime: number;
  } | null;
  autoReplyTemplates: string[];
  setSelectedContact: (contact: Contact | null) => void;
  sendMessage: (content: string, type: MessageType, priority: MessagePriority) => void;
  adjustFrequency: (frequency: number) => void;
  acknowledgeInterference: () => void;
  clearMessages: () => void;
  simulateInterference: () => void;
}

export const LIGHT_SPEED = 299792.458;
export const EARTH_COMMUNICATION_DELAY_BASE = 2.6;

