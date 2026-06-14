import { Group, Text, Box, ActionIcon, Tooltip } from '@mantine/core';
import { motion } from 'framer-motion';
import { Rocket, Settings, HelpCircle, Download, RotateCcw } from 'lucide-react';
import { NeonText } from '../effects/NeonText';
import { useTravelStore } from '../../store/useTravelStore';

export const DashboardHeader = () => {
  const { setDestination, setDuration, setTravelers, setStartDate } = useTravelStore();

  const handleReset = () => {
    setDestination(null);
    setDuration(7);
    setTravelers(2);
    setStartDate(null);
  };

  const handleExport = () => {
    const data = useTravelStore.getState();
    const exportData = {
      destination: data.destination?.name,
      startDate: data.startDate?.toISOString(),
      durationDays: data.durationDays,
      travelers: data.travelers,
      selectedEquipment: data.selectedEquipment,
      totalBudget: data.totalBudget
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'space-travel-plan.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(157, 78, 221, 0.3)',
        background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.9) 0%, transparent 100%)'
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="lg" align="center">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -3, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Rocket size={40} color="#9d4edd" strokeWidth={1.5} />
          </motion.div>
          <Box>
            <Group gap="md" align="center">
              <NeonText color="#9d4edd" size="28px">
                星际旅行
              </NeonText>
              <NeonText color="#00f5d4" size="28px">
                控制中心
              </NeonText>
            </Group>
            <Text size="sm" c="silverGray.5" mt={4}>
              INTERSTELLAR TRAVEL CONTROL CENTER v2.0.7
            </Text>
          </Box>
        </Group>

        <Group gap="md">
          <Tooltip label="重置计划" position="bottom">
            <ActionIcon 
              size="lg" 
              variant="outline" 
              color="neonPurple"
              onClick={handleReset}
              style={{ borderColor: 'rgba(157, 78, 221, 0.5)' }}
            >
              <RotateCcw size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="导出方案" position="bottom">
            <ActionIcon 
              size="lg" 
              variant="outline" 
              color="neonCyan"
              onClick={handleExport}
              style={{ borderColor: 'rgba(0, 245, 212, 0.5)' }}
            >
              <Download size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="帮助" position="bottom">
            <ActionIcon 
              size="lg" 
              variant="outline" 
              color="energyYellow"
              style={{ borderColor: 'rgba(255, 190, 11, 0.5)' }}
            >
              <HelpCircle size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="设置" position="bottom">
            <ActionIcon 
              size="lg" 
              variant="outline" 
              color="silverGray"
              style={{ borderColor: 'rgba(192, 197, 206, 0.5)' }}
            >
              <Settings size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Box>
  );
};
