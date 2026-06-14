import type { Attraction } from '../types';

export const attractionsData: Attraction[] = [
  {
    id: 'olympus-mons',
    name: '奥林匹斯山',
    planetId: 'mars',
    description: '太阳系最高的火山，高度达21.9公里。站在山顶可以俯瞰整个火星半球的壮丽景色。',
    highlights: ['太阳系最高峰', '火山口徒步', '云端观景台', '日出观赏点'],
    bestTime: '火星春季',
    duration: 8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=olympus%20mons%20mars%20volcano%20aerial%20view%20red%20planet%20landscape%20cinematic%20epic%20scifi&image_size=landscape_16_9'
  },
  {
    id: 'valles-marineris',
    name: '水手峡谷',
    planetId: 'mars',
    description: '太阳系最大的峡谷系统，长度超过4000公里。峡谷深处可能存在远古水流痕迹。',
    highlights: ['峡谷探险', '地质考察', '峡谷漂流', '星空营地'],
    bestTime: '火星夏季',
    duration: 12,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valles%20marineris%20canyon%20mars%20landscape%20deep%20gorge%20red%20rocks%20cinematic%20wide%20angle&image_size=landscape_16_9'
  },
  {
    id: 'polar-caps',
    name: '极地冰冠',
    planetId: 'mars',
    description: '火星南北极的水冰和干冰沉积层，呈现出美丽的层状结构。是火星水资源的主要存储地。',
    highlights: ['冰洞探险', '极光观测', '冰原徒步', '气候研究站'],
    bestTime: '火星冬季',
    duration: 6,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mars%20polar%20ice%20caps%20northern%20ice%20sheet%20space%20view%20cinematic%20blue%20white%20red%20contrast&image_size=landscape_16_9'
  },
  {
    id: 'sea-of-tranquility',
    name: '宁静之海',
    planetId: 'moon',
    description: '阿波罗11号登月地点，人类首次踏上外星球的历史地标。可以参观原始登月遗迹。',
    highlights: ['登月遗址', '低重力弹跳', '脚印保护区', '历史纪念碑'],
    bestTime: '月球白昼',
    duration: 4,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sea%20of%20tranquility%20moon%20landing%20site%20apollo%2011%20flag%20lunar%20module%20cinematic%20historical&image_size=landscape_16_9'
  },
  {
    id: 'earth-rise',
    name: '地出观景台',
    planetId: 'moon',
    description: '月球轨道上最壮观的景象，地球从月球地平线缓缓升起的震撼画面。',
    highlights: ['地球升起观测', '270度全景台', '摄影天堂', '浪漫晚餐'],
    bestTime: '月球日出时分',
    duration: 3,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=earth%20rise%20viewed%20from%20moon%20surface%20space%20stars%20blue%20planet%20cinematic%20breathtaking%20view&image_size=landscape_16_9'
  },
  {
    id: 'south-pole',
    name: '月球南极',
    planetId: 'moon',
    description: '月球南极地区，存在永久阴影坑和水冰沉积。是未来月球基地的理想选址。',
    highlights: ['冰矿开采', '永久阴影坑探险', '月球基地参观', '太阳峰观景点'],
    bestTime: '全年可访问',
    duration: 8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=moon%20south%20pole%20craters%20ice%20deposits%20permanent%20shadows%20space%20view%20cinematic%20mysterious&image_size=landscape_16_9'
  },
  {
    id: 'ice-caves',
    name: '冰洞系统',
    planetId: 'europa',
    description: '木卫二冰层中的天然洞穴系统，冰墙呈现出梦幻的蓝色光芒。',
    highlights: ['蓝冰洞穴', '冰攀体验', '水下声呐探测', '生命迹象搜索'],
    bestTime: '木卫二夏季',
    duration: 10,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=europa%20ice%20caves%20blue%20glacier%20cave%20crystalline%20structures%20subsurface%20ocean%20cinematic%20magical&image_size=landscape_16_9'
  },
  {
    id: 'subsurface-ocean',
    name: '地下海洋探索',
    planetId: 'europa',
    description: '穿过冰层进入木卫二的地下液态水海洋，可能发现外星生命的终极探险。',
    highlights: ['冰核钻探', '深海潜艇', '热液喷口', '生物探测'],
    bestTime: '木卫二轨道稳定期',
    duration: 24,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=europa%20subsurface%20ocean%20underwater%20alien%20world%20hydrothermal%20vents%20bioluminescence%20cinematic%20mysterious&image_size=landscape_16_9'
  },
  {
    id: 'jupiter-view',
    name: '木星观景台',
    planetId: 'europa',
    description: '木卫二轨道上的巨型观景平台，可以近距离欣赏木星大红斑和绚丽极光。',
    highlights: ['大红斑观测', '木星极光', '伽利略卫星合影', '太空漫步'],
    bestTime: '木星极光活跃期',
    duration: 6,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jupiter%20great%20red%20spot%20viewed%20from%20europa%20orbit%20giant%20planet%20atmosphere%20space%20station%20cinematic%20epic&image_size=landscape_16_9'
  },
  {
    id: 'methane-lakes',
    name: '甲烷湖泊群',
    planetId: 'titan',
    description: '土卫六表面的液态甲烷和乙烷湖泊，呈现出神秘的橙色光芒。',
    highlights: ['甲烷游艇', '湖岸露营', '油气开采', '岛屿探险'],
    bestTime: '土卫六夏季',
    duration: 8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=titan%20methane%20lakes%20orange%20atmosphere%20liquid%20hydrocarbon%20sea%20islands%20cinematic%20alien%20landscape&image_size=landscape_16_9'
  },
  {
    id: 'dune-fields',
    name: '沙丘之海',
    planetId: 'titan',
    description: '土卫六赤道地区的巨大沙丘群，由有机物质颗粒组成，高度可达数百米。',
    highlights: ['沙丘越野', '沙暴观测', '有机样本采集', '沙漠星空'],
    bestTime: '风季过后',
    duration: 6,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=titan%20dune%20fields%20orange%20sand%20dunes%20organic%20material%20exotic%20landscape%20cinematic%20atmospheric&image_size=landscape_16_9'
  },
  {
    id: 'saturn-rings-view',
    name: '土星光环观景台',
    planetId: 'titan',
    description: '悬浮在土卫六高层大气中的观景平台，可以近距离欣赏土星壮丽的光环系统。',
    highlights: ['光环全景', '卡西尼遗址', '光环穿越', '土星系统巡航'],
    bestTime: '光环倾角最佳期',
    duration: 5,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=saturn%20rings%20viewed%20from%20titan%20floating%20observation%20platform%20gas%20giant%20space%20cinematic%20majestic&image_size=landscape_16_9'
  },
  {
    id: 'floating-cities',
    name: '浮空城市',
    planetId: 'venus',
    description: '悬浮在金星大气层50公里高处的云端城市，这里的温度和压力与地球相似。',
    highlights: ['云端漫步', '硫酸云航行', '悬浮植物园', '高空跳伞'],
    bestTime: '金星大气稳定期',
    duration: 10,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=venus%20floating%20city%20above%20clouds%20steampunk%20aerial%20city%20yellow%20atmosphere%20cinematic%20futuristic&image_size=landscape_16_9'
  },
  {
    id: 'acid-clouds',
    name: '硫酸云海',
    planetId: 'venus',
    description: '金星上层大气中的硫酸云层，在阳光下呈现出绚丽的彩虹色。',
    highlights: ['云层航行', '彩虹观测', '大气取样', '闪电风暴'],
    bestTime: '金星白昼',
    duration: 4,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=venus%20acid%20clouds%20yellow%20atmosphere%20lightning%20storms%20aerial%20view%20dramatic%20cinematic&image_size=landscape_16_9'
  },
  {
    id: 'maxwell-montes',
    name: '麦克斯韦山脉',
    planetId: 'venus',
    description: '金星上最高的山脉，高度达11公里。山顶覆盖着神秘的"金星雪"。',
    highlights: ['雷达测绘', '耐高温探测器', '矿物考察', '极限登山'],
    bestTime: '需要特殊装备',
    duration: 12,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=venus%20maxwell%20montes%20radar%20image%20tallest%20mountain%20volcanic%20peaks%20super%20hot%20surface%20infrared%20view&image_size=landscape_16_9'
  },
  {
    id: 'alien-landscapes',
    name: '异星地貌',
    planetId: 'kepler-442b',
    description: '开普勒-442b上的未知地貌，可能存在外星生态系统和前所未见的自然景观。',
    highlights: ['未知生物探索', '双日景观', '外星植物', '神秘遗迹'],
    bestTime: '到达后评估',
    duration: 72,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=alien%20planet%20kepler%20442b%20exotic%20landscape%20two%20suns%20alien%20flora%20purple%20vegetation%20cinematic%20epic&image_size=landscape_16_9'
  },
  {
    id: 'binary-sunset',
    name: '双星日落',
    planetId: 'kepler-442b',
    description: '开普勒-442b围绕两颗恒星运行，可以欣赏到独一无二的双日落奇观。',
    highlights: ['双日摄影', '橙色紫色天空', '双星投影', '浪漫晚餐'],
    bestTime: '傍晚时分',
    duration: 3,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=binary%20sunset%20alien%20planet%20two%20suns%20orange%20purple%20sky%20silhouette%20mountains%20cinematic%20breathtaking&image_size=landscape_16_9'
  },
  {
    id: 'unknown-life',
    name: '生命探测站',
    planetId: 'kepler-442b',
    description: '人类在系外行星建立的首个生命探测基地，寻找外星生命的前沿哨站。',
    highlights: ['生物实验室', '样本分析', '接触协议', '首次接触纪念碑'],
    bestTime: '研究持续进行中',
    duration: 48,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=alien%20life%20research%20station%20exoplanet%20laboratory%20scientists%20microscope%20futuristic%20cinematic%20sci-fi&image_size=landscape_16_9'
  }
];
