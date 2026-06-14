import type { Supply } from '../types';

export const suppliesData: Supply[] = [
  {
    id: 'food-rations',
    name: '太空口粮',
    category: 'food',
    unit: '份',
    perPersonPerDay: 3,
    importance: 'critical',
    icon: 'UtensilsCrossed'
  },
  {
    id: 'water',
    name: '饮用水',
    category: 'water',
    unit: '升',
    perPersonPerDay: 4,
    importance: 'critical',
    icon: 'Droplets'
  },
  {
    id: 'oxygen',
    name: '氧气',
    category: 'oxygen',
    unit: '立方米',
    perPersonPerDay: 2,
    importance: 'critical',
    icon: 'Wind'
  },
  {
    id: 'vitamins',
    name: '维生素补充剂',
    category: 'medical',
    unit: '片',
    perPersonPerDay: 2,
    importance: 'high',
    icon: 'Pill'
  },
  {
    id: 'painkillers',
    name: '止痛药',
    category: 'medical',
    unit: '片',
    perPersonPerDay: 1,
    importance: 'high',
    icon: 'Tablets'
  },
  {
    id: 'first-aid',
    name: '急救包',
    category: 'medical',
    unit: '个',
    perPersonPerDay: 0.1,
    importance: 'high',
    icon: 'Heart'
  },
  {
    id: 'snacks',
    name: '零食',
    category: 'food',
    unit: '份',
    perPersonPerDay: 2,
    importance: 'low',
    icon: 'Cookie'
  },
  {
    id: 'coffee',
    name: '咖啡',
    category: 'other',
    unit: '杯',
    perPersonPerDay: 2,
    importance: 'medium',
    icon: 'Coffee'
  },
  {
    id: 'hygiene-kit',
    name: '卫生用品',
    category: 'other',
    unit: '套',
    perPersonPerDay: 1,
    importance: 'medium',
    icon: 'Sparkles'
  },
  {
    id: 'entertainment',
    name: '娱乐设备',
    category: 'other',
    unit: '台',
    perPersonPerDay: 0.05,
    importance: 'low',
    icon: 'Gamepad2'
  }
];
