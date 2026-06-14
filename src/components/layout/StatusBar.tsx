import { Group, Text, Badge, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { Wifi, Battery, Activity, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTravelStore } from '../../store/useTravelStore';

const StatusIndicator = ({ icon: Icon, label, value, color = '#00f5d4' }: { icon: any; label: string; value: string; color?: string }) => (
  <Group gap="xs" align="center">
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Icon size={16} color={color} />
    </motion.div>
    <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
      {label}:
    </Text>
    <Text size="xs" fw={600} style={{ color, fontFamily: "'Orbitron', sans-serif" }}>
      {value}
    </Text>
  </Group>
);

export const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  const { destination, travelers, durationDays } = useTravelStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      style={{
        width: '100%',
        padding: '12px 24px',
        background: 'linear-gradient(90deg, rgba(10, 22, 40, 0.95) 0%, rgba(157, 78, 221, 0.2) 50%, rgba(10, 22, 40, 0.95) 100%)',
        borderBottom: '1px solid rgba(157, 78, 221, 0.5)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xl">
          <StatusIndicator 
            icon={Activity} 
            label="系统状态" 
            value="在线" 
            color="#00f5d4" 
          />
          <StatusIndicator 
            icon={Wifi} 
            label="通讯" 
            value="已连接" 
            color="#00f5d4" 
          />
          <StatusIndicator 
            icon={Battery} 
            label="能源" 
            value="98%" 
            color="#ffbe0b" 
          />
        </Group>

        <Group gap="xl">
          <StatusIndicator 
            icon={Clock} 
            label="任务时间" 
            value={time.toLocaleTimeString('zh-CN', { hour12: false })} 
            color="#9d4edd" 
          />
          <StatusIndicator 
            icon={Users} 
            label="乘员" 
            value={`${travelers}人`} 
            color="#00f5d4" 
          />
          {destination && (
            <Badge 
              variant="dot" 
              size="lg"
              style={{ 
                background: `linear-gradient(90deg, ${destination.color}33, transparent)`,
                border: `1px solid ${destination.color}66`,
                color: destination.color,
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              目的地: {destination.name} · {durationDays}天
            </Badge>
          )}
        </Group>
      </Group>
    </Box>
  );
};
