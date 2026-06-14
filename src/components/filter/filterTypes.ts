export type FilterLogic = 'AND' | 'OR';

export interface RangeFilterValue {
  min: number;
  max: number;
}

export interface FilterChipItem {
  id: string;
  label: string;
  group: string;
  onRemove: () => void;
}

export interface FilterPreset<T> {
  id: string;
  name: string;
  filters: T;
  createdAt: number;
}

export interface FilterChip {
  id: string;
  label: string;
  group: string;
  color: string;
}

export type PlanetFilters = {
  distance: RangeFilterValue;
  travelDays: RangeFilterValue;
  budget: RangeFilterValue;
  gravity: RangeFilterValue;
  temperature: RangeFilterValue;
  difficulties: string[];
  planetTypes: string[];
  difficultyLogic: FilterLogic;
  typeLogic: FilterLogic;
  searchQuery: string;
};

export type EquipmentFilters = {
  weight: RangeFilterValue;
  price: RangeFilterValue;
  temperature: RangeFilterValue;
  importance: string[];
  inStockOnly: boolean;
  newOnly: boolean;
  searchQuery: string;
};

export type AttractionFilters = {
  duration: RangeFilterValue;
  bestTimeSlots: string[];
  crowdLevels: string[];
  attractionTypes: string[];
  searchQuery: string;
};

export const DEFAULT_PLANET_FILTERS: PlanetFilters = {
  distance: { min: 0, max: 1200 },
  travelDays: { min: 0, max: 100 },
  budget: { min: 0, max: 1100000 },
  gravity: { min: 0, max: 1.5 },
  temperature: { min: -300, max: 500 },
  difficulties: [],
  planetTypes: [],
  difficultyLogic: 'OR',
  typeLogic: 'OR',
  searchQuery: ''
};

export const DEFAULT_EQUIPMENT_FILTERS: EquipmentFilters = {
  weight: { min: 0, max: 350 },
  price: { min: 0, max: 130000 },
  temperature: { min: -300, max: 700 },
  importance: [],
  inStockOnly: false,
  newOnly: false,
  searchQuery: ''
};

export const DEFAULT_ATTRACTION_FILTERS: AttractionFilters = {
  duration: { min: 0, max: 80 },
  bestTimeSlots: [],
  crowdLevels: [],
  attractionTypes: [],
  searchQuery: ''
};

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '简单', color: '#00f5d4' },
  { value: 'medium', label: '中等', color: '#ffbe0b' },
  { value: 'hard', label: '困难', color: '#ff6b35' },
  { value: 'extreme', label: '极限', color: '#ff006e' }
];

export const PLANET_TYPE_OPTIONS = [
  { value: 'terrestrial', label: '类地行星', color: '#9d4edd' },
  { value: 'moon', label: '卫星', color: '#c0c5ce' },
  { value: 'ocean', label: '海洋型', color: '#3498db' },
  { value: 'volcanic', label: '火山型', color: '#e74c3c' },
  { value: 'gas_giant', label: '气态巨星', color: '#f39c12' },
  { value: 'ice_giant', label: '冰巨星', color: '#00bcd4' },
  { value: 'exoplanet', label: '系外行星', color: '#9b59b6' }
];

export const IMPORTANCE_OPTIONS = [
  { value: 'essential', label: '必需', color: '#ff006e' },
  { value: 'recommended', label: '推荐', color: '#00f5d4' },
  { value: 'optional', label: '可选', color: '#9d4edd' }
];

export const CROWD_LEVEL_OPTIONS = [
  { value: 'low', label: '人流量少', color: '#00f5d4' },
  { value: 'medium', label: '人流量适中', color: '#ffbe0b' },
  { value: 'high', label: '人流量大', color: '#ff006e' }
];

export const BEST_TIME_OPTIONS = [
  { value: 'morning', label: '清晨', color: '#ffbe0b' },
  { value: 'afternoon', label: '午后', color: '#fb5607' },
  { value: 'evening', label: '黄昏', color: '#ff006e' },
  { value: 'night', label: '夜晚', color: '#3a86ff' },
  { value: 'anytime', label: '随时', color: '#00f5d4' }
];

export const ATTRACTION_TYPE_OPTIONS = [
  { value: 'natural', label: '自然景观', color: '#00f5d4' },
  { value: 'cultural', label: '人文设施', color: '#9d4edd' },
  { value: 'extreme', label: '极限体验', color: '#ff006e' }
];

export function formatValue(value: number, unit?: string, decimals = 0): string {
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return unit ? `${formatted}${unit}` : formatted;
}

export function formatCurrency(value: number): string {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`;
  }
  return `¥${value.toLocaleString()}`;
}
