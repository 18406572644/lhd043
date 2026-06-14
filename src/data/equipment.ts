import type { Equipment } from '../types';

export const equipmentData: Equipment[] = [
  {
    id: 'standard-spacesuit',
    name: '标准太空服',
    category: 'suit',
    description: '基础型太空服，提供氧气、温度调节和微流星防护。适合近地轨道和月球任务。',
    price: 15000,
    weight: 120,
    required: true,
    recommendedPlanets: ['moon', 'mars'],
    icon: 'HardHat'
  },
  {
    id: 'advanced-spacesuit',
    name: '高级行星探索服',
    category: 'suit',
    description: '增强型太空服，具备更强的辐射防护和温度耐受能力，支持长时间舱外活动。',
    price: 45000,
    weight: 180,
    required: false,
    recommendedPlanets: ['mars', 'europa', 'titan', 'venus'],
    icon: 'Shield'
  },
  {
    id: 'thermal-suit',
    name: '极端环境温控服',
    category: 'suit',
    description: '专为极端温度环境设计，可承受-200°C至500°C的温度变化。',
    price: 80000,
    weight: 200,
    required: false,
    recommendedPlanets: ['venus', 'europa', 'titan'],
    icon: 'Thermometer'
  },
  {
    id: 'oxygen-tank',
    name: '便携式氧气系统',
    category: 'survival',
    description: '高效氧气循环系统，可持续供氧72小时，配备应急备用罐。',
    price: 8000,
    weight: 45,
    required: true,
    recommendedPlanets: ['moon', 'mars', 'europa', 'titan', 'venus', 'kepler-442b'],
    icon: 'Wind'
  },
  {
    id: 'jetpack',
    name: '个人推进器',
    category: 'tool',
    description: '微型喷气背包，可实现在低重力环境下的自由飞行和快速移动。',
    price: 25000,
    weight: 60,
    required: false,
    recommendedPlanets: ['moon', 'mars', 'europa', 'titan'],
    icon: 'Rocket'
  },
  {
    id: 'terrain-scanner',
    name: '地形扫描仪',
    category: 'tool',
    description: '3D激光扫描设备，可实时绘制周围地形图，探测地下结构和矿产资源。',
    price: 12000,
    weight: 15,
    required: false,
    recommendedPlanets: ['mars', 'europa', 'titan', 'kepler-442b'],
    icon: 'Radar'
  },
  {
    id: 'med-kit',
    name: '太空医疗包',
    category: 'medical',
    description: '完整的太空医疗急救包，包含抗辐射药物、骨再生设备和生命支持系统。',
    price: 18000,
    weight: 25,
    required: true,
    recommendedPlanets: ['moon', 'mars', 'europa', 'titan', 'venus', 'kepler-442b'],
    icon: 'Heart'
  },
  {
    id: 'radiation-detector',
    name: '辐射监测仪',
    category: 'tool',
    description: '高精度辐射探测器，实时监测环境辐射水平，提供安全警报。',
    price: 6000,
    weight: 3,
    required: true,
    recommendedPlanets: ['mars', 'europa', 'titan', 'venus', 'kepler-442b'],
    icon: 'Activity'
  },
  {
    id: 'food-replicator',
    name: '食物合成器',
    category: 'luxury',
    description: '高级分子食物合成设备，可根据口味偏好合成各种美食。',
    price: 35000,
    weight: 80,
    required: false,
    recommendedPlanets: ['mars', 'europa', 'titan', 'kepler-442b'],
    icon: 'UtensilsCrossed'
  },
  {
    id: 'hover-bike',
    name: '悬浮摩托',
    category: 'tool',
    description: '反重力单人交通工具，可在各种地形上高速行驶，续航里程500公里。',
    price: 120000,
    weight: 300,
    required: false,
    recommendedPlanets: ['mars', 'titan', 'kepler-442b'],
    icon: 'Bike'
  },
  {
    id: 'communication-array',
    name: '深空通讯阵列',
    category: 'tool',
    description: '便携式量子通讯设备，可实现跨星系实时通讯，不受距离限制。',
    price: 55000,
    weight: 40,
    required: false,
    recommendedPlanets: ['europa', 'titan', 'kepler-442b'],
    icon: 'Radio'
  },
  {
    id: 'zero-g-hammock',
    name: '零重力睡眠舱',
    category: 'luxury',
    description: '专为零重力环境设计的睡眠系统，提供逼真的重力模拟和白噪音助眠。',
    price: 22000,
    weight: 35,
    required: false,
    recommendedPlanets: ['moon', 'mars', 'europa', 'titan', 'venus', 'kepler-442b'],
    icon: 'Moon'
  }
];
