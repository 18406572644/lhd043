import type { Planet, Equipment, SupplyItem, BudgetDetail } from '../types';
import { suppliesData } from '../data/supplies';

const difficultyMultiplier: Record<string, number> = {
  easy: 1.0,
  medium: 1.3,
  hard: 1.6,
  extreme: 2.0
};

export const calculateSupplies = (
  durationDays: number,
  travelers: number
): SupplyItem[] => {
  return suppliesData.map(supply => ({
    ...supply,
    totalAmount: Math.ceil(supply.perPersonPerDay * durationDays * travelers)
  }));
};

export const calculateBudget = (
  destination: Planet | null,
  durationDays: number,
  travelers: number,
  equipmentList: Equipment[],
  selectedEquipmentIds: string[],
  attractionsCount: number
): BudgetDetail => {
  if (!destination) {
    return {
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
  }

  const difficultyMul = difficultyMultiplier[destination.difficulty] || 1.0;
  const baseCost = Math.round(destination.baseCost * travelers * difficultyMul);
  const transportCost = Math.round(destination.distance * 10000 * travelers * 1000);
  const accommodationCost = Math.round(destination.baseCost * 0.3 * durationDays * travelers);
  
  const selectedEquipment = equipmentList.filter(e => selectedEquipmentIds.includes(e.id));
  const equipmentCost = selectedEquipment.reduce((sum, e) => sum + e.price, 0);
  
  const foodCost = travelers * durationDays * 500;
  const attractionCost = attractionsCount * travelers * 300;
  
  const subtotal = baseCost + transportCost + accommodationCost + equipmentCost + foodCost + attractionCost;
  const insuranceCost = Math.round(baseCost * 0.15);
  const emergencyFund = Math.round(subtotal * 0.1);
  const total = subtotal + insuranceCost + emergencyFund;

  return {
    baseCost,
    transportCost,
    accommodationCost,
    equipmentCost,
    foodCost,
    attractionCost,
    insuranceCost,
    emergencyFund,
    total
  };
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 100000000) {
    return `¥${(amount / 100000000).toFixed(2)}亿`;
  } else if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(2)}万`;
  }
  return `¥${amount.toLocaleString()}`;
};

export const formatDistance = (distance: number): string => {
  if (distance < 0.001) {
    return `${(distance * 149597870.7).toFixed(2)} 万公里`;
  }
  return `${distance.toFixed(4)} 光年`;
};

export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    easy: '#00f5d4',
    medium: '#ffbe0b',
    hard: '#fb5607',
    extreme: '#ff006e'
  };
  return colors[difficulty] || '#c0c5ce';
};

export const getDifficultyLabel = (difficulty: string): string => {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    extreme: '极限'
  };
  return labels[difficulty] || difficulty;
};

export const getImportanceColor = (importance: string): string => {
  const colors: Record<string, string> = {
    critical: '#ff006e',
    high: '#ffbe0b',
    medium: '#00f5d4',
    low: '#9d4edd'
  };
  return colors[importance] || '#c0c5ce';
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    suit: '太空服',
    tool: '工具设备',
    medical: '医疗用品',
    survival: '生存装备',
    luxury: '奢侈品',
    food: '食品',
    water: '水资源',
    oxygen: '氧气',
    other: '其他'
  };
  return labels[category] || category;
};
