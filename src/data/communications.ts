import type { Contact } from '../types';

export const contactsData: Contact[] = [
  {
    id: 'family-001',
    name: '李明华',
    relationship: '父亲',
    avatar: '👨‍💼',
    status: 'online',
    lastSeen: new Date().toISOString()
  },
  {
    id: 'family-002',
    name: '王秀兰',
    relationship: '母亲',
    avatar: '👩‍🍳',
    status: 'online',
    lastSeen: new Date().toISOString()
  },
  {
    id: 'family-003',
    name: '李小明',
    relationship: '弟弟',
    avatar: '👦',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'friend-001',
    name: '张伟',
    relationship: '好友',
    avatar: '👨‍🚀',
    status: 'online',
    lastSeen: new Date().toISOString()
  },
  {
    id: 'friend-002',
    name: '刘芳',
    relationship: '同事',
    avatar: '👩‍💻',
    status: 'busy',
    lastSeen: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'mission-001',
    name: '地面控制中心',
    relationship: '任务控制',
    avatar: '🎛️',
    status: 'online',
    lastSeen: new Date().toISOString()
  }
];

export const autoReplyTemplates: string[] = [
  '收到你的消息了，这里一切都好。你那边怎么样？太空旅行一定很神奇吧！',
  '哇，你发来的消息我们收到了！全家人都围在屏幕前看呢。记得多发些照片！',
  '你在那边还好吗？有没有看到什么特别的景象？我们都很想你。',
  '今天家里做了你最爱吃的菜，可惜你不在。等你回来我们再一起吃！',
  '弟弟/妹妹今天问起你了，说想跟你视频通话。信号怎么样？',
  '任务控制中心收到，通讯状态良好。请继续保持联系，注意安全。',
  '朋友，你真的上太空了！太厉害了！回来一定要跟我好好讲讲！',
  '这里天气很好，阳光明媚。不知道你那边能看到什么样的天空？',
  '你的消息延迟了几分钟才收到，感觉好神奇——我们真的在星际通讯！',
  '一切平安，勿念。你专心完成任务，我们等你凯旋归来！',
  '收到紧急信号！你那边没事吧？请尽快回复确认安全。',
  '刚刚看到新闻说有太阳风暴，你们的通讯不会受影响吧？注意调整频率！'
];

export const interferenceEvents = [
  {
    type: 'solar_storm' as const,
    severity: 'mild' as const,
    descriptions: [
      '检测到轻微太阳风暴活动，信号可能受到微弱干扰',
      '太阳风活动增强，建议调整通讯频率',
      '日冕物质抛射边缘扫过，信号质量略有下降'
    ]
  },
  {
    type: 'solar_storm' as const,
    severity: 'moderate' as const,
    descriptions: [
      '中等强度太阳风暴正在影响通讯，部分频率受阻',
      '太阳耀斑活动频繁，信号延迟增加',
      '电离层扰动加剧，建议切换到备用频率'
    ]
  },
  {
    type: 'solar_storm' as const,
    severity: 'severe' as const,
    descriptions: [
      '强烈太阳风暴警告！通讯可能随时中断',
      '日冕物质抛射直接命中，信号严重失真',
      '极端空间天气事件，紧急频道已启用'
    ]
  },
  {
    type: 'cosmic_rays' as const,
    severity: 'mild' as const,
    descriptions: [
      '宇宙射线背景水平略有升高',
      '检测到银河宇宙射线波动',
      '穿过星际尘埃云，信号微弱散射'
    ]
  },
  {
    type: 'cosmic_rays' as const,
    severity: 'moderate' as const,
    descriptions: [
      '宇宙射线暴正在通过，数据传输可能出错',
      '高能粒子流影响，需要增加纠错编码',
      '穿越辐射带，建议降低传输速率'
    ]
  },
  {
    type: 'atmospheric' as const,
    severity: 'mild' as const,
    descriptions: [
      '地球大气层电离层闪烁，信号轻微波动',
      '对流层天气影响，地面接收质量下降',
      '磁暴活动，长波通讯受影响'
    ]
  },
  {
    type: 'equipment' as const,
    severity: 'mild' as const,
    descriptions: [
      '舰载天线温度异常，正在自动校准',
      '信号处理器负载过高，传输效率下降',
      '冷却系统微调，通讯质量暂时受影响'
    ]
  }
];

export const getRandomAutoReply = (): string => {
  return autoReplyTemplates[Math.floor(Math.random() * autoReplyTemplates.length)];
};

export const getRandomInterference = () => {
  const event = interferenceEvents[Math.floor(Math.random() * interferenceEvents.length)];
  const description = event.descriptions[Math.floor(Math.random() * event.descriptions.length)];
  return {
    ...event,
    description,
    affectedFrequencies: [
      800 + Math.random() * 2000,
      2800 + Math.random() * 2000
    ] as [number, number],
    duration: 30000 + Math.random() * 120000
  };
};

export const calculateDelayFromDistance = (distanceInLightYears: number): number => {
  const oneWaySeconds = distanceInLightYears * 365.25 * 24 * 60 * 60;
  return oneWaySeconds;
};

export const formatDelayTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)} 秒`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes} 分 ${secs} 秒`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} 小时 ${minutes} 分`;
};

export const formatDistance = (distanceInLightYears: number): string => {
  if (distanceInLightYears < 0.0001) {
    const au = distanceInLightYears * 63241.077;
    if (au < 0.1) {
      const km = distanceInLightYears * 9.461e12;
      if (km < 10000) {
        return `${(km).toFixed(0)} 公里`;
      }
      return `${(km / 1000).toFixed(2)} 万公里`;
    }
    return `${au.toFixed(4)} 天文单位`;
  }
  if (distanceInLightYears < 1) {
    return `${(distanceInLightYears * 63241.077).toFixed(2)} 天文单位`;
  }
  return `${distanceInLightYears.toFixed(2)} 光年`;
};
