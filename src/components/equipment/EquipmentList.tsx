import { Card, Text, Group, Box, SimpleGrid, ScrollArea, SegmentedControl, Skeleton, TextInput } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Calculator, Search, Star, X } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { EquipmentCard } from './EquipmentCard';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { NeonText } from '../effects/NeonText';
import { formatCurrency } from '../../utils/calculations';
import { useState } from 'react';
import { staggerContainer } from '../../utils/animations';
import { Equipment } from '../../types';

export const EquipmentList = () => {
  const { 
    equipment, 
    loading, 
    selectedEquipment, 
    toggleEquipment, 
    destination,
    favoriteEquipment,
    toggleFavoriteEquipment,
    equipmentSearchQuery,
    setEquipmentSearchQuery
  } = useTravelStore();
  
  const [filter, setFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] = useState<Equipment | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const selectedItems = equipment.filter(e => selectedEquipment.includes(e.id));
  const totalEquipmentCost = selectedItems.reduce((sum, e) => sum + e.price, 0);
  const totalWeight = selectedItems.reduce((sum, e) => sum + e.weight, 0);

  const filteredEquipment = equipment.filter(e => {
    if (equipmentSearchQuery) {
      const query = equipmentSearchQuery.toLowerCase();
      const matchesSearch = e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.manufacturer?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (showFavoritesOnly && !favoriteEquipment.includes(e.id)) return false;

    if (filter === 'all') return true;
    if (filter === 'favorites') return favoriteEquipment.includes(e.id);
    if (filter === 'required') return e.required;
    if (filter === 'recommended') return !e.required && destination && e.recommendedPlanets.includes(destination.id);
    return e.category === filter;
  });

  const handleViewDetails = (item: Equipment) => {
    setSelectedEquipmentDetail(item);
    setModalOpened(true);
  };

  return (
    <>
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
              <Group gap="md" grow style={{ flex: 1, minWidth: '250px' }}>
                <TextInput
                  placeholder="搜索装备（如：太空服、医疗...）"
                  value={equipmentSearchQuery}
                  onChange={(e) => setEquipmentSearchQuery(e.target.value)}
                  leftSection={<Search size={16} color="#9d4edd" />}
                  rightSection={
                    equipmentSearchQuery ? (
                      <Box 
                        onClick={() => setEquipmentSearchQuery('')}
                        style={{ cursor: 'pointer', padding: '0 8px' }}
                      >
                        <X size={16} color="#6c757d" />
                      </Box>
                    ) : null
                  }
                  styles={{
                    root: {
                      flex: 1
                    },
                    input: {
                      backgroundColor: 'rgba(10, 22, 40, 0.6)',
                      border: '1px solid rgba(157, 78, 221, 0.3)',
                      color: '#c0c5ce',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '12px',
                      '&:focus': {
                        borderColor: '#9d4edd'
                      }
                    }
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: showFavoritesOnly 
                      ? 'rgba(255, 190, 11, 0.15)' 
                      : 'rgba(10, 22, 40, 0.6)',
                    border: showFavoritesOnly 
                      ? '1px solid rgba(255, 190, 11, 0.5)' 
                      : '1px solid rgba(157, 78, 221, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <Star 
                    size={16} 
                    color="#ffbe0b" 
                    fill={showFavoritesOnly ? '#ffbe0b' : 'none'} 
                  />
                  <Text 
                    size="xs" 
                    style={{ 
                      fontFamily: "'Orbitron', sans-serif",
                      color: showFavoritesOnly ? '#ffbe0b' : '#c0c5ce',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    收藏 ({favoriteEquipment.length})
                  </Text>
                </motion.div>
              </Group>
            </Group>

            <Group justify="space-between" mb="md" wrap="wrap" gap="md">
              <SegmentedControl
                value={filter}
                onChange={setFilter}
                data={[
                  { label: '全部', value: 'all' },
                  { label: '收藏', value: 'favorites' },
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
                  点击复选框添加或移除装备 · 点击卡片查看详情
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
              ) : filteredEquipment.length > 0 ? (
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
                          favorite={favoriteEquipment.includes(item.id)}
                          onToggle={() => toggleEquipment(item.id)}
                          onFavoriteToggle={() => toggleFavoriteEquipment(item.id)}
                          onViewDetails={() => handleViewDetails(item)}
                        />
                      ))}
                    </SimpleGrid>
                  </ScrollArea>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '40px', textAlign: 'center' }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Search size={48} color="#9d4edd" strokeWidth={1} />
                  </motion.div>
                  <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {showFavoritesOnly ? '暂无收藏的装备' : '没有找到匹配的装备'}
                  </Text>
                  <Text size="sm" c="silverGray.6" mt="xs">
                    {showFavoritesOnly 
                      ? '点击装备卡片上的星标按钮添加收藏' 
                      : '尝试使用其他关键词搜索'}
                  </Text>
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

      <EquipmentDetailModal
        equipment={selectedEquipmentDetail}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
};
