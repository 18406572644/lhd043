import { create } from 'zustand';
import type { TravelState, Planet, BudgetDetail } from '../types';
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
  }
}));
