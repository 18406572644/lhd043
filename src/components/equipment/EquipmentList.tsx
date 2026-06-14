import { Card, Text, Group, Box, SimpleGrid, ScrollArea, Skeleton, TextInput, Stack } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Star, X, Package, Coins, Thermometer, AlertTriangle, PackageCheck, Sparkles } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { EquipmentCard } from './EquipmentCard';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { NeonText } from '../effects/NeonText';
import { useState, useEffect, useMemo } from 'react';
import { staggerContainer } from '../../utils/animations';
import { Equipment } from '../../types';
import {
  FilterDashboard,
  FilterSection,
  NeonRangeSlider,
  MultiTagCheckbox,
  ToggleSwitch,
  FilterChipsBar,
  FilterPresetsPanel,
  EquipmentFilters,
  DEFAULT_EQUIPMENT_FILTERS,
  IMPORTANCE_OPTIONS,
  formatCurrency,
  FilterPreset
} from '../filter';

const ACCENT_COLOR = '#00f5d4';
const WEIGHT_COLOR = '#00f5d4';
const PRICE_COLOR = '#9d4edd';
const TEMP_COLOR = '#fb5607';
const STORAGE_KEY = 'equipment_filter_presets';

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

  const [filters, setFilters] = useState<EquipmentFilters>(DEFAULT_EQUIPMENT_FILTERS);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] = useState<Equipment | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [presetsModalOpened, setPresetsModalOpened] = useState(false);
  const [presets, setPresets] = useState<FilterPreset<EquipmentFilters>[]>([]);
  const [animatedResultCount, setAnimatedResultCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPresets(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load presets:', e);
    }
  }, []);

  const savePresets = (newPresets: FilterPreset<EquipmentFilters>[]) => {
    setPresets(newPresets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
    } catch (e) {
      console.error('Failed to save presets:', e);
    }
  };

  useEffect(() => {
    if (equipmentSearchQuery !== filters.searchQuery) {
      setFilters(prev => ({ ...prev, searchQuery: equipmentSearchQuery }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentSearchQuery]);

  useEffect(() => {
    if (filters.searchQuery !== equipmentSearchQuery) {
      setEquipmentSearchQuery(filters.searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchQuery]);

  const selectedItems = equipment.filter(e => selectedEquipment.includes(e.id));
  const totalEquipmentCost = selectedItems.reduce((sum, e) => sum + e.price, 0);
  const totalWeight = selectedItems.reduce((sum, e) => sum + e.weight, 0);

  const filteredEquipment = useMemo(() => {
    return equipment.filter(e => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query) ||
          e.manufacturer?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (showFavoritesOnly && !favoriteEquipment.includes(e.id)) return false;

      if (e.weight < filters.weight.min || e.weight > filters.weight.max) return false;

      if (e.price < filters.price.min || e.price > filters.price.max) return false;

      if (e.minTemp > filters.temperature.max || e.maxTemp < filters.temperature.min) return false;

      if (filters.importance.length > 0) {
        if (!filters.importance.includes(e.importance)) return false;
      }

      if (filters.inStockOnly && !e.inStock) return false;

      if (filters.newOnly && !e.isNew) return false;

      return true;
    });
  }, [equipment, filters, showFavoritesOnly, favoriteEquipment]);

  useEffect(() => {
    const target = filteredEquipment.length;
    const start = animatedResultCount;
    const duration = 300;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedResultCount(Math.round(start + (target - start) * easeProgress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEquipment.length]);

  const filterChips = useMemo(() => {
    const chips: { id: string; label: string; group: string; color: string }[] = [];

    if (filters.weight.min !== DEFAULT_EQUIPMENT_FILTERS.weight.min || filters.weight.max !== DEFAULT_EQUIPMENT_FILTERS.weight.max) {
      chips.push({
        id: 'weight',
        label: `${filters.weight.min}-${filters.weight.max}kg`,
        group: '重量',
        color: WEIGHT_COLOR
      });
    }

    if (filters.price.min !== DEFAULT_EQUIPMENT_FILTERS.price.min || filters.price.max !== DEFAULT_EQUIPMENT_FILTERS.price.max) {
      chips.push({
        id: 'price',
        label: `${formatCurrency(filters.price.min)}-${formatCurrency(filters.price.max)}`,
        group: '价格',
        color: PRICE_COLOR
      });
    }

    if (filters.temperature.min !== DEFAULT_EQUIPMENT_FILTERS.temperature.min || filters.temperature.max !== DEFAULT_EQUIPMENT_FILTERS.temperature.max) {
      chips.push({
        id: 'temperature',
        label: `${filters.temperature.min}°C~${filters.temperature.max}°C`,
        group: '温度',
        color: TEMP_COLOR
      });
    }

    filters.importance.forEach(imp => {
      const opt = IMPORTANCE_OPTIONS.find(o => o.value === imp);
      if (opt) {
        chips.push({
          id: `importance-${imp}`,
          label: opt.label,
          group: '重要度',
          color: opt.color
        });
      }
    });

    if (filters.inStockOnly) {
      chips.push({
        id: 'inStock',
        label: '有库存',
        group: '状态',
        color: ACCENT_COLOR
      });
    }

    if (filters.newOnly) {
      chips.push({
        id: 'newOnly',
        label: '新品',
        group: '状态',
        color: '#ffbe0b'
      });
    }

    if (filters.searchQuery) {
      chips.push({
        id: 'search',
        label: `"${filters.searchQuery}"`,
        group: '搜索',
        color: '#c0c5ce'
      });
    }

    return chips;
  }, [filters]);

  const handleRemoveChip = (id: string) => {
    if (id === 'weight') {
      setFilters(prev => ({ ...prev, weight: DEFAULT_EQUIPMENT_FILTERS.weight }));
    } else if (id === 'price') {
      setFilters(prev => ({ ...prev, price: DEFAULT_EQUIPMENT_FILTERS.price }));
    } else if (id === 'temperature') {
      setFilters(prev => ({ ...prev, temperature: DEFAULT_EQUIPMENT_FILTERS.temperature }));
    } else if (id.startsWith('importance-')) {
      const imp = id.replace('importance-', '');
      setFilters(prev => ({ ...prev, importance: prev.importance.filter(i => i !== imp) }));
    } else if (id === 'inStock') {
      setFilters(prev => ({ ...prev, inStockOnly: false }));
    } else if (id === 'newOnly') {
      setFilters(prev => ({ ...prev, newOnly: false }));
    } else if (id === 'search') {
      setFilters(prev => ({ ...prev, searchQuery: '' }));
    }
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_EQUIPMENT_FILTERS);
    setShowFavoritesOnly(false);
  };

  const handleSavePreset = (name: string) => {
    const newPreset: FilterPreset<EquipmentFilters> = {
      id: Date.now().toString(),
      name,
      filters: JSON.parse(JSON.stringify(filters)),
      createdAt: Date.now()
    };
    savePresets([...presets, newPreset]);
  };

  const handleApplyPreset = (preset: FilterPreset<EquipmentFilters>) => {
    setFilters(preset.filters);
  };

  const handleDeletePreset = (id: string) => {
    savePresets(presets.filter(p => p.id !== id));
  };

  const handleViewDetails = (item: Equipment) => {
    setSelectedEquipmentDetail(item);
    setModalOpened(true);
  };

  return (
    <>
      <Card p="lg" radius="lg">
        <Group justify="space-between" mb="lg" wrap="wrap" gap="md">
          <Group gap="md">
            <NeonText color={ACCENT_COLOR} size="20px">
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
          <Group align="flex-start" gap="md" wrap="nowrap">
            <FilterDashboard
              title="装备筛选中心"
              subtitle="EQUIPMENT FILTER"
              accentColor={ACCENT_COLOR}
              width={340}
              collapsible
            >
              <FilterSection
                title="搜索装备"
                icon={<Search size={14} />}
                accentColor={ACCENT_COLOR}
                defaultOpen
              >
                <TextInput
                  placeholder="关键词搜索..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  leftSection={<Search size={14} color={PRICE_COLOR} />}
                  rightSection={
                    filters.searchQuery ? (
                      <Box
                        onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                        style={{ cursor: 'pointer', padding: '0 8px' }}
                      >
                        <X size={14} color="#6c757d" />
                      </Box>
                    ) : null
                  }
                  size="xs"
                  styles={{
                    input: {
                      backgroundColor: 'rgba(10, 22, 40, 0.6)',
                      border: `1px solid ${PRICE_COLOR}33`,
                      color: '#c0c5ce',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '11px',
                      '&:focus': {
                        borderColor: PRICE_COLOR
                      }
                    }
                  }}
                />
              </FilterSection>

              <FilterSection
                title="重量范围"
                icon={<Package size={14} />}
                accentColor={WEIGHT_COLOR}
                badge={`${filters.weight.min}-${filters.weight.max}`}
                defaultOpen
              >
                <NeonRangeSlider
                  label=""
                  value={filters.weight}
                  min={0}
                  max={350}
                  step={1}
                  onChange={(v) => setFilters(prev => ({ ...prev, weight: v }))}
                  accentColor={WEIGHT_COLOR}
                  glowColor="rgba(0, 245, 212, 0.6)"
                  unit="kg"
                />
              </FilterSection>

              <FilterSection
                title="价格范围"
                icon={<Coins size={14} />}
                accentColor={PRICE_COLOR}
                badge={`${formatCurrency(filters.price.min)}-${formatCurrency(filters.price.max)}`}
                defaultOpen
              >
                <NeonRangeSlider
                  label=""
                  value={filters.price}
                  min={0}
                  max={130000}
                  step={1000}
                  onChange={(v) => setFilters(prev => ({ ...prev, price: v }))}
                  formatMin={(v) => formatCurrency(v)}
                  formatMax={(v) => formatCurrency(v)}
                  accentColor={PRICE_COLOR}
                  glowColor="rgba(157, 78, 221, 0.6)"
                />
              </FilterSection>

              <FilterSection
                title="适用温度"
                icon={<Thermometer size={14} />}
                accentColor={TEMP_COLOR}
                badge={`${filters.temperature.min}~${filters.temperature.max}°C`}
                defaultOpen
              >
                <NeonRangeSlider
                  label=""
                  value={filters.temperature}
                  min={-300}
                  max={700}
                  step={10}
                  onChange={(v) => setFilters(prev => ({ ...prev, temperature: v }))}
                  unit="°C"
                  accentColor={TEMP_COLOR}
                  glowColor="rgba(251, 86, 7, 0.6)"
                />
              </FilterSection>

              <FilterSection
                title="重要程度"
                icon={<AlertTriangle size={14} />}
                accentColor={ACCENT_COLOR}
                badge={filters.importance.length > 0 ? filters.importance.length : undefined}
                defaultOpen
              >
                <MultiTagCheckbox
                  options={IMPORTANCE_OPTIONS}
                  value={filters.importance}
                  onChange={(v) => setFilters(prev => ({ ...prev, importance: v }))}
                  accentColor={ACCENT_COLOR}
                />
              </FilterSection>

              <FilterSection
                title="快速筛选"
                icon={<PackageCheck size={14} />}
                accentColor={ACCENT_COLOR}
                defaultOpen
              >
                <Stack gap="xs">
                  <ToggleSwitch
                    label="仅显示有库存"
                    icon={<PackageCheck size={14} />}
                    checked={filters.inStockOnly}
                    onChange={(v) => setFilters(prev => ({ ...prev, inStockOnly: v }))}
                    accentColor={ACCENT_COLOR}
                  />
                  <ToggleSwitch
                    label="仅显示新品"
                    icon={<Sparkles size={14} />}
                    checked={filters.newOnly}
                    onChange={(v) => setFilters(prev => ({ ...prev, newOnly: v }))}
                    accentColor="#ffbe0b"
                  />
                  <ToggleSwitch
                    label="仅显示收藏"
                    icon={<Star size={14} />}
                    checked={showFavoritesOnly}
                    onChange={setShowFavoritesOnly}
                    accentColor="#ffbe0b"
                  />
                </Stack>
              </FilterSection>
            </FilterDashboard>

            <Box style={{ flex: 1, minWidth: 0 }}>
              <FilterChipsBar
                chips={filterChips}
                onRemove={handleRemoveChip}
                onClearAll={handleClearAll}
                resultCount={animatedResultCount}
                totalCount={equipment.length}
                accentColor={ACCENT_COLOR}
                onSavePreset={() => setPresetsModalOpened(true)}
                presetCount={presets.length}
              />

              <Group justify="space-between" mb="md" wrap="wrap" gap="md">
                <Group gap="sm">
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

                <Group gap="sm">
                  <Search size={16} color={PRICE_COLOR} />
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
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="md">
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
                    <ScrollArea h={520} type="auto" scrollbarSize={6}>
                      <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="md">
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
                    style={{
                      padding: '60px 40px',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.4) 0%, rgba(4, 9, 18, 0.6) 100%)',
                      borderRadius: '16px',
                      border: '1px solid rgba(0, 245, 212, 0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}66, transparent)`
                      }}
                    />
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${PRICE_COLOR}66, transparent)`
                      }}
                    />

                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        rotate: [0, 3, -3, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ position: 'relative', display: 'inline-block' }}
                    >
                      <Box
                        style={{
                          position: 'absolute',
                          inset: '-20px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${ACCENT_COLOR}22 0%, transparent 70%)`,
                          filter: 'blur(10px)'
                        }}
                      />
                      <motion.div
                        animate={{
                          boxShadow: [
                            `0 0 20px ${ACCENT_COLOR}33`,
                            `0 0 40px ${ACCENT_COLOR}55`,
                            `0 0 20px ${ACCENT_COLOR}33`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ borderRadius: '50%', padding: '8px' }}
                      >
                        <Search size={56} color={ACCENT_COLOR} strokeWidth={1} />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <NeonText color={ACCENT_COLOR} size="18px" style={{ marginTop: '16px' }}>
                        {showFavoritesOnly ? 'EMPTY ARCHIVE' : 'NO MATCH FOUND'}
                      </NeonText>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text
                        size="md"
                        c="silverGray.4"
                        mt="sm"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                      >
                        {showFavoritesOnly ? '暂无收藏的装备' : '没有找到匹配的装备'}
                      </Text>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Text size="sm" c="silverGray.6" mt="xs">
                        {showFavoritesOnly
                          ? '点击装备卡片上的星标按钮添加收藏'
                          : '尝试调整筛选条件或清除部分过滤器'}
                      </Text>
                    </motion.div>

                    <Group justify="center" gap="md" mt="xl">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: ACCENT_COLOR,
                            boxShadow: `0 0 10px ${ACCENT_COLOR}`
                          }}
                        />
                      ))}
                    </Group>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Group>
        ) : (
          <Box style={{ padding: '40px', textAlign: 'center' }}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield size={48} color={ACCENT_COLOR} strokeWidth={1} />
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

      <FilterPresetsPanel<EquipmentFilters>
        opened={presetsModalOpened}
        onClose={() => setPresetsModalOpened(false)}
        presets={presets}
        onApply={handleApplyPreset}
        onDelete={handleDeletePreset}
        onSave={handleSavePreset}
        accentColor={ACCENT_COLOR}
      />
    </>
  );
};
