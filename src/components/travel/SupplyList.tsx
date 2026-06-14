import { Card, Text, Group, Box, Badge, SimpleGrid, ScrollArea } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { getImportanceColor, getCategoryLabel } from '../../utils/calculations';
import type { SupplyItem } from '../../types';

const SupplyItemCard = ({ supply }: { supply: SupplyItem }) => {
  const IconComponent = (Icons as any)[supply.icon] || Icons.Package;
  const importanceColor = getImportanceColor(supply.importance);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        p="md" 
        radius="md"
        style={{
          background: `linear-gradient(135deg, ${importanceColor}11, transparent)`,
          border: `1px solid ${importanceColor}33`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {supply.importance === 'critical' && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: importanceColor
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Box
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: `${importanceColor}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconComponent size={20} color={importanceColor} />
            </Box>
            <Box>
              <Text fw={600} size="sm" c="white">
                {supply.name}
              </Text>
              <Text size="xs" c="silverGray.5">
                {getCategoryLabel(supply.category)}
              </Text>
            </Box>
          </Group>
          <Box style={{ textAlign: 'right' }}>
            <Text fw={700} size="lg" style={{ color: importanceColor, fontFamily: "'Orbitron', sans-serif" }}>
              {supply.totalAmount.toLocaleString()}
            </Text>
            <Text size="xs" c="silverGray.5">
              {supply.unit}
            </Text>
          </Box>
        </Group>
        <Group gap="xs" mt="xs">
          <Badge
            size="sm"
            style={{
              backgroundColor: `${importanceColor}22`,
              color: importanceColor,
              border: `1px solid ${importanceColor}44`
            }}
          >
            {supply.importance === 'critical' ? '关键' : 
             supply.importance === 'high' ? '重要' : 
             supply.importance === 'medium' ? '一般' : '可选'}
          </Badge>
          <Text size="xs" c="silverGray.6">
            {supply.perPersonPerDay} {supply.unit}/人/天
          </Text>
        </Group>
      </Card>
    </motion.div>
  );
};

export const SupplyList = () => {
  const { supplies, destination, durationDays, travelers } = useTravelStore();

  const criticalCount = supplies.filter(s => s.importance === 'critical').length;
  const totalItems = supplies.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <Card p="lg" radius="lg">
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="md">
          <NeonText color="#ffbe0b" size="20px">
            物资清单
          </NeonText>
          <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            SUPPLY INVENTORY
          </Text>
        </Group>
        <Group gap="md">
          {criticalCount > 0 && (
            <Badge 
              variant="dot" 
              color="neonPink"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <AlertTriangle size={12} style={{ marginRight: '4px' }} />
              {criticalCount} 项关键物资
            </Badge>
          )}
          <Badge 
            variant="outline" 
            color="neonCyan"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            总计 {totalItems.toLocaleString()} 件
          </Badge>
        </Group>
      </Group>

      {destination ? (
        <>
          <Group mb="md" grow>
            <Card 
              p="sm" 
              radius="md"
              style={{
                background: 'rgba(0, 245, 212, 0.1)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                textAlign: 'center'
              }}
            >
              <Text size="xs" c="silverGray.5">旅行天数</Text>
              <Text fw={700} size="lg" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {durationDays} 天
              </Text>
            </Card>
            <Card 
              p="sm" 
              radius="md"
              style={{
                background: 'rgba(157, 78, 221, 0.1)',
                border: '1px solid rgba(157, 78, 221, 0.3)',
                textAlign: 'center'
              }}
            >
              <Text size="xs" c="silverGray.5">乘员人数</Text>
              <Text fw={700} size="lg" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {travelers} 人
              </Text>
            </Card>
            <Card 
              p="sm" 
              radius="md"
              style={{
                background: 'rgba(255, 190, 11, 0.1)',
                border: '1px solid rgba(255, 190, 11, 0.3)',
                textAlign: 'center'
              }}
            >
              <Text size="xs" c="silverGray.5">物资种类</Text>
              <Text fw={700} size="lg" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {supplies.length} 种
              </Text>
            </Card>
          </Group>

          <ScrollArea h={350} type="auto" scrollbarSize={6}>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <AnimatePresence>
                {supplies.map((supply) => (
                  <SupplyItemCard key={supply.id} supply={supply} />
                ))}
              </AnimatePresence>
            </SimpleGrid>
          </ScrollArea>
        </>
      ) : (
        <Box style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Package size={48} color="#ffbe0b" strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            选择目的地后生成物资清单
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            系统将根据旅行参数自动计算所需物资
          </Text>
        </Box>
      )}
    </Card>
  );
};
