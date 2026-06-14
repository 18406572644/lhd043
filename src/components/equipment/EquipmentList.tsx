import { Card, Text, Group, Box, SimpleGrid, ScrollArea, SegmentedControl, Skeleton } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Calculator } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { EquipmentCard } from './EquipmentCard';
import { NeonText } from '../effects/NeonText';
import { formatCurrency } from '../../utils/calculations';
import { useState } from 'react';
import { staggerContainer } from '../../utils/animations';

export const EquipmentList = () => {
  const { equipment, loading, selectedEquipment, toggleEquipment, destination } = useTravelStore();
  const [filter, setFilter] = useState<string>('all');

  const selectedItems = equipment.filter(e => selectedEquipment.includes(e.id));
  const totalEquipmentCost = selectedItems.reduce((sum, e) => sum + e.price, 0);
  const totalWeight = selectedItems.reduce((sum, e) => sum + e.weight, 0);

  const filteredEquipment = equipment.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'required') return e.required;
    if (filter === 'recommended') return !e.required && destination && e.recommendedPlanets.includes(destination.id);
    return e.category === filter;
  });

  return (
    <Card p="lg" radius="lg">
      <Group justify="space-between" mb="lg" wrap="wrap" gap="md">
        <Group gap="md">
          <NeonText color="#00f5d4" size="20px">
            装备推荐
          </NeonText>
          <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            EQUIPMENT RECOMMENDATIONS
          </Text>
        </Group>

        <Group gap="md" wrap="nowrap">
          <Box style={{ textAlign: 'center' }}>
            <Text size="xs" c="silverGray.5">已选装备</Text>
            <Text fw={700} c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {selectedItems.length} 件
            </Text>
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Text size="xs" c="silverGray.5">总重量</Text>
            <Text fw={700} c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {totalWeight} kg
            </Text>
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Text size="xs" c="silverGray.5">装备费用</Text>
            <Text fw={700} c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {formatCurrency(totalEquipmentCost)}
            </Text>
          </Box>
        </Group>
      </Group>

      {destination ? (
        <>
          <Group justify="space-between" mb="md" wrap="wrap" gap="md">
            <SegmentedControl
              value={filter}
              onChange={setFilter}
              data={[
                { label: '全部', value: 'all' },
                { label: '必需', value: 'required' },
                { label: '推荐', value: 'recommended' },
                { label: '太空服', value: 'suit' },
                { label: '工具', value: 'tool' },
                { label: '医疗', value: 'medical' }
              ]}
              data-equipment-filter="true"
              styles={{
                root: {
                  backgroundColor: 'rgba(10, 22, 40, 0.6)',
                  border: '1px solid rgba(0, 245, 212, 0.3)'
                },
                control: {
                  color: '#c0c5ce'
                },
                label: {
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '11px'
                }
              }}
            />

            <Group gap="sm">
              <Calculator size={16} color="#9d4edd" />
              <Text size="xs" c="silverGray.5">
                点击复选框添加或移除装备
              </Text>
            </Group>
          </Group>

          <AnimatePresence mode="wait">
            {loading.equipment ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} height={160} radius="md" animate />
                  ))}
                </SimpleGrid>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <ScrollArea h={400} type="auto" scrollbarSize={6}>
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                    {filteredEquipment.map((item) => (
                      <EquipmentCard
                        key={item.id}
                        equipment={item}
                        selected={selectedEquipment.includes(item.id)}
                        onToggle={() => toggleEquipment(item.id)}
                      />
                    ))}
                  </SimpleGrid>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Box style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield size={48} color="#00f5d4" strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            选择目的地后显示装备推荐
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            系统将根据目的地环境智能推荐所需装备
          </Text>
        </Box>
      )}
    </Card>
  );
};
