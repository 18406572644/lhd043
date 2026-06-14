import { create } from 'zustand';
import type { TravelState, Planet, BudgetDetail, DiaryEntry, CheckInRecord } from '../types';
import { mockApi } from '../data/mockApi';
import { calculateSupplies, calculateBudget } from '../utils/calculations';

const initialBudget: BudgetDetail = {
  baseCost: 0,
  transportCost: 0,
  accommodationCost: 0,
  equipmentCost: 0,
  foodCost: 0,
  attractionCost: 0,
  insuranceCost: 0,
  emergencyFund: 0,
  total: 0
};

const loadFavoriteEquipment = (): string[] => {
  try {
    const stored = localStorage.getItem('favoriteEquipment');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load favorites:', e);
  }
  return [];
};

const loadDiaryEntries = (): DiaryEntry[] => {
  try {
    const stored = localStorage.getItem('diaryEntries');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load diary entries:', e);
  }
  return [];
};

const loadCheckInRecords = (): CheckInRecord[] => {
  try {
    const stored = localStorage.getItem('checkInRecords');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load check-in records:', e);
  }
  return [];
};

const loadNextCrewLogNumber = (): number => {
  try {
    const stored = localStorage.getItem('nextCrewLogNumber');
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch (e) {
    console.error('Failed to load crew log number:', e);
  }
  return 1;
};

export const useTravelStore = create<TravelState>((set, get) => ({
  destination: null,
  startDate: null,
  durationDays: 7,
  travelers: 2,
  planets: [],
  equipment: [],
  attractions: [],
  loading: { planets: false, equipment: false, attractions: false },
  selectedEquipment: [],
  favoriteEquipment: loadFavoriteEquipment(),
  equipmentSearchQuery: '',
  supplies: [],
  totalBudget: initialBudget,
  diaryEntries: loadDiaryEntries(),
  checkInRecords: loadCheckInRecords(),
  nextCrewLogNumber: loadNextCrewLogNumber(),

  setDestination: (planet: Planet | null) => {
    set({ destination: planet });
    if (planet) {
      set({ durationDays: planet.travelDays });
      get().loadEquipment(planet.id);
      get().loadAttractions(planet.id);
    }
    get().calculateSupplies();
    get().calculateBudget();
  },

  setDuration: (days: number) => {
    set({ durationDays: Math.max(1, Math.min(365, days)) });
    get().calculateSupplies();
    get().calculateBudget();
  },

  setTravelers: (count: number) => {
    set({ travelers: Math.max(1, Math.min(100, count)) });
    get().calculateSupplies();
    get().calculateBudget();
  },

  setStartDate: (date: Date | null) => {
    set({ startDate: date });
  },

  toggleEquipment: (id: string) => {
    const { selectedEquipment, equipment } = get();
    const item = equipment.find(e => e.id === id);
    
    let newSelected: string[];
    if (selectedEquipment.includes(id)) {
      if (item?.required) return;
      newSelected = selectedEquipment.filter(eid => eid !== id);
    } else {
      newSelected = [...selectedEquipment, id];
    }
    
    set({ selectedEquipment: newSelected });
    get().calculateBudget();
  },

  toggleFavoriteEquipment: (id: string) => {
    const { favoriteEquipment } = get();
    let newFavorites: string[];
    if (favoriteEquipment.includes(id)) {
      newFavorites = favoriteEquipment.filter(fid => fid !== id);
    } else {
      newFavorites = [...favoriteEquipment, id];
    }
    set({ favoriteEquipment: newFavorites });
    try {
      localStorage.setItem('favoriteEquipment', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  },

  setEquipmentSearchQuery: (query: string) => {
    set({ equipmentSearchQuery: query });
  },

  loadPlanets: async () => {
    set({ loading: { ...get().loading, planets: true } });
    try {
      const planets = await mockApi.getPlanets();
      set({ planets });
    } finally {
      set({ loading: { ...get().loading, planets: false } });
    }
  },

  loadEquipment: async (planetId?: string) => {
    set({ loading: { ...get().loading, equipment: true } });
    try {
      const equipment = await mockApi.getEquipment(planetId);
      const { favoriteEquipment } = get();
      
      const requiredIds = equipment.filter(e => e.required).map(e => e.id);
      const favoriteIdsForPlanet = equipment
        .filter(e => favoriteEquipment.includes(e.id) && !e.required)
        .map(e => e.id);
      
      set({ 
        equipment, 
        selectedEquipment: [...requiredIds, ...favoriteIdsForPlanet] 
      });
      get().calculateBudget();
    } finally {
      set({ loading: { ...get().loading, equipment: false } });
    }
  },

  loadAttractions: async (planetId: string) => {
    set({ loading: { ...get().loading, attractions: true } });
    try {
      const attractions = await mockApi.getAttractions(planetId);
      set({ attractions });
      get().calculateBudget();
    } finally {
      set({ loading: { ...get().loading, attractions: false } });
    }
  },

  calculateSupplies: () => {
    const { durationDays, travelers } = get();
    const supplies = calculateSupplies(durationDays, travelers);
    set({ supplies });
  },

  calculateBudget: () => {
    const { destination, durationDays, travelers, equipment, selectedEquipment, attractions } = get();
    const budget = calculateBudget(
      destination,
      durationDays,
      travelers,
      equipment,
      selectedEquipment,
      attractions.length
    );
    set({ totalBudget: budget });
  },

  addDiaryEntry: (entry) => {
    const { diaryEntries, nextCrewLogNumber } = get();
    const newEntry: DiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      crewLogNumber: nextCrewLogNumber
    };
    const updatedEntries = [newEntry, ...diaryEntries];
    set({ diaryEntries: updatedEntries, nextCrewLogNumber: nextCrewLogNumber + 1 });
    try {
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      localStorage.setItem('nextCrewLogNumber', String(nextCrewLogNumber + 1));
    } catch (e) {
      console.error('Failed to save diary entry:', e);
    }
  },

  updateDiaryEntry: (id, updates) => {
    const { diaryEntries } = get();
    const updatedEntries = diaryEntries.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    );
    set({ diaryEntries: updatedEntries });
    try {
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    } catch (e) {
      console.error('Failed to update diary entry:', e);
    }
  },

  deleteDiaryEntry: (id) => {
    const { diaryEntries, checkInRecords } = get();
    const updatedEntries = diaryEntries.filter(entry => entry.id !== id);
    const updatedCheckIns = checkInRecords.filter(record => record.diaryEntryId !== id);
    set({ diaryEntries: updatedEntries, checkInRecords: updatedCheckIns });
    try {
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      localStorage.setItem('checkInRecords', JSON.stringify(updatedCheckIns));
    } catch (e) {
      console.error('Failed to delete diary entry:', e);
    }
  },

  addCheckIn: (record) => {
    const { checkInRecords } = get();
    const newRecord: CheckInRecord = {
      ...record,
      id: `checkin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      checkInTime: new Date().toISOString()
    };
    const updatedRecords = [newRecord, ...checkInRecords];
    set({ checkInRecords: updatedRecords });
    try {
      localStorage.setItem('checkInRecords', JSON.stringify(updatedRecords));
    } catch (e) {
      console.error('Failed to save check-in record:', e);
    }
  },

  removeCheckIn: (id) => {
    const { checkInRecords } = get();
    const updatedRecords = checkInRecords.filter(record => record.id !== id);
    set({ checkInRecords: updatedRecords });
    try {
      localStorage.setItem('checkInRecords', JSON.stringify(updatedRecords));
    } catch (e) {
      console.error('Failed to remove check-in record:', e);
    }
  },

  isAttractionCheckedIn: (attractionId) => {
    const { checkInRecords } = get();
    return checkInRecords.some(record => record.attractionId === attractionId);
  }
}));
