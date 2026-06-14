import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, Text, Group, Box, SimpleGrid, ScrollArea, Skeleton, Input, ActionIcon, Tooltip } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Clock, Sun, Users2, Sparkles, Settings2 } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { AttractionCard } from './AttractionCard';
import { staggerContainer } from '../../utils/animations';
import {
  FilterDashboard,
  FilterSection,
  NeonRangeSlider,
  MultiTagCheckbox,
  FilterChipsBar,
  FilterPresetsPanel,
  FilterChip,
  FilterPreset,
  AttractionFilters,
  DEFAULT_ATTRACTION_FILTERS,
  BEST_TIME_OPTIONS,
  CROWD_LEVEL_OPTIONS,
  ATTRACTION_TYPE_OPTIONS
} from '../filter';

const ACCENT_COLOR = '#ffbe0b';
const STORAGE_KEY = 'attraction_filter_presets';

export const AttractionList = () => {
  const { attractions, loading, destination } = useTravelStore();
  const [filters, setFilters] = useState<AttractionFilters>(DEFAULT_ATTRACTION_FILTERS);
  const [presets, setPresets] = useState<FilterPreset<AttractionFilters>[]>([]);
  const [presetsModalOpen, setPresetsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setPresets(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const updateFilter = useCallback(<K extends keyof AttractionFilters>(key: K, value: AttractionFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ATTRACTION_FILTERS);
  }, []);

  const removeChip = useCallback((chipId: string) => {
    if (chipId.startsWith('time_')) {
      const v = chipId.replace('time_', '');
      setFilters(prev => ({ ...prev, bestTimeSlots: prev.bestTimeSlots.filter(t => t !== v) }));
    } else if (chipId.startsWith('crowd_')) {
      const v = chipId.replace('crowd_', '');
      setFilters(prev => ({ ...prev, crowdLevels: prev.crowdLevels.filter(c => c !== v) }));
    } else if (chipId.startsWith('type_')) {
      const v = chipId.replace('type_', '');
      setFilters(prev => ({ ...prev, attractionTypes: prev.attractionTypes.filter(t => t !== v) }));
    } else if (chipId === 'range_duration') {
      setFilters(prev => ({ ...prev, duration: DEFAULT_ATTRACTION_FILTERS.duration }));
    } else if (chipId === 'search') {
      setFilters(prev => ({ ...prev, searchQuery: '' }));
    }
  }, []);

  const activeChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    if (filters.searchQuery) {
      chips.push({ id: 'search', label: filters.searchQuery, group: '搜索', color: '#00f5d4' });
    }

    const defaults = DEFAULT_ATTRACTION_FILTERS;
    if (filters.duration.min !== defaults.duration.min || filters.duration.max !== defaults.duration.max) {
      chips.push({
        id: 'range_duration',
        label: `${filters.duration.min}-${filters.duration.max}小时`,
        group: '时长',
        color: ACCENT_COLOR
      });
    }

    filters.bestTimeSlots.forEach(t => {
      const opt = BEST_TIME_OPTIONS.find(o => o.value === t);
      if (opt) chips.push({ id: `time_${t}`, label: opt.label, group: '时段', color: opt.color });
    });

    filters.crowdLevels.forEach(c => {
      const opt = CROWD_LEVEL_OPTIONS.find(o => o.value === c);
      if (opt) chips.push({ id: `crowd_${c}`, label: opt.label, group: '人流', color: opt.color });
    });

    filters.attractionTypes.forEach(t => {
      const opt = ATTRACTION_TYPE_OPTIONS.find(o => o.value === t);
      if (opt) chips.push({ id: `type_${t}`, label: opt.label, group: '类型', color: opt.color });
    });

    return chips;
  }, [filters]);

  const filteredAttractions = useMemo(() => {
    return attractions.filter(a => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (
          !a.name.toLowerCase().includes(q) &&
          !a.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (a.duration < filters.duration.min || a.duration > filters.duration.max) return false;

      if (filters.bestTimeSlots.length > 0) {
        if (!filters.bestTimeSlots.includes(a.bestTimeSlot)) return false;
      }

      if (filters.crowdLevels.length > 0) {
        if (!filters.crowdLevels.includes(a.crowdLevel)) return false;
      }

      if (filters.attractionTypes.length > 0) {
        if (!filters.attractionTypes.includes(a.type)) return false;
      }

      return true;
    });
  }, [attractions, filters]);

  const savePreset = useCallback((name: string) => {
    const newPreset: FilterPreset<AttractionFilters> = {
      id: `preset_${Date.now()}`,
      name,
      filters: JSON.parse(JSON.stringify(filters)),
      createdAt: Date.now()
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [presets, filters]);

  const deletePreset = useCallback((id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [presets]);

  const applyPreset = useCallback((preset: FilterPreset<AttractionFilters>) => {
    setFilters(preset.filters);
  }, []);

  return (
    <Card p="lg" radius="lg">
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="md">
          <NeonText color={ACCENT_COLOR} size="20px">
            太空景点
          </NeonText>
          <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            SPACE ATTRACTIONS
          </Text>
        </Group>
        {destination && (
          <Text size="sm" c="silverGray.4">
            {destination.name} 精选景点
          </Text>
        )}
      </Group>

      {destination ? (
        <AnimatePresence mode="wait">
          {loading.attractions ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} height={320} radius="lg" animate />
                ))}
              </SimpleGrid>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Group justify="space-between" mb="md" wrap="wrap" gap="md" align="flex-start">
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Group justify="space-between" mb="md" wrap="wrap" gap="md">
                    <Group gap="xs">
                      <Input
                        placeholder="搜索景点名称、描述..."
                        leftSection={<Search size={16} color={ACCENT_COLOR} />}
                        value={filters.searchQuery}
                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                        style={{ width: '260px' }}
                      />
                      <Tooltip label={showFilter ? '隐藏筛选器' : '显示筛选器'} position="left">
                        <ActionIcon
                          variant="outline"
                          onClick={() => setShowFilter(!showFilter)}
                          style={{
                            borderColor: showFilter ? ACCENT_COLOR + '88' : 'rgba(255, 190, 11, 0.3)',
                            color: showFilter ? ACCENT_COLOR : '#6c757d',
                            background: showFilter ? ACCENT_COLOR + '15' : 'rgba(10, 22, 40, 0.6)'
                          }}
                        >
                          <Settings2 size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>

                  <FilterChipsBar
                    chips={activeChips}
                    onRemove={removeChip}
                    onClearAll={resetFilters}
                    resultCount={filteredAttractions.length}
                    totalCount={attractions.length}
                    accentColor={ACCENT_COLOR}
                    onSavePreset={() => setPresetsModalOpen(true)}
                    presetCount={presets.length}
                  />
                </Box>
              </Group>

              <Group align="flex-start" gap="lg" wrap="wrap">
                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                      style={{ flexShrink: 0 }}
                    >
                      <FilterDashboard
                        title="景点筛选控制台"
                        subtitle="ATTRACTION FILTER CONSOLE"
                        accentColor={ACCENT_COLOR}
                        width={340}
                        maxHeight={600}
                      >
                        <FilterSection
                          title="游览时长"
                          icon={<Clock size={12} />}
                          accentColor={ACCENT_COLOR}
                        >
                          <NeonRangeSlider
                            label="时长范围（小时）"
                            value={filters.duration}
                            min={0}
                            max={80}
                            step={1}
                            onChange={(v) => updateFilter('duration', v)}
                            unit="h"
                            accentColor={ACCENT_COLOR}
                            glowColor="rgba(255, 190, 11, 0.6)"
                          />
                        </FilterSection>

                        <FilterSection
                          title="最佳时段"
                          icon={<Sun size={12} />}
                          accentColor="#fb5607"
                          badge={filters.bestTimeSlots.length}
                        >
                          <MultiTagCheckbox
                            options={BEST_TIME_OPTIONS}
                            value={filters.bestTimeSlots}
                            onChange={(v) => updateFilter('bestTimeSlots', v)}
                            accentColor="#fb5607"
                          />
                        </FilterSection>

                        <FilterSection
                          title="人流量预估"
                          icon={<Users2 size={12} />}
                          accentColor="#00f5d4"
                          badge={filters.crowdLevels.length}
                        >
                          <MultiTagCheckbox
                            options={CROWD_LEVEL_OPTIONS}
                            value={filters.crowdLevels}
                            onChange={(v) => updateFilter('crowdLevels', v)}
                            accentColor="#00f5d4"
                          />
                        </FilterSection>

                        <FilterSection
                          title="景点类型"
                          icon={<Sparkles size={12} />}
                          accentColor="#9d4edd"
                          badge={filters.attractionTypes.length}
                        >
                          <MultiTagCheckbox
                            options={ATTRACTION_TYPE_OPTIONS}
                            value={filters.attractionTypes}
                            onChange={(v) => updateFilter('attractionTypes', v)}
                            accentColor="#9d4edd"
                          />
                        </FilterSection>
                      </FilterDashboard>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box style={{ flex: 1, minWidth: 0 }}>
                  {filteredAttractions.length > 0 ? (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <ScrollArea h={400} type="auto" scrollbarSize={6}>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                          {filteredAttractions.map((attraction, index) => (
                            <AttractionCard
                              key={attraction.id}
                              attraction={attraction}
                              index={index}
                            />
                          ))}
                        </SimpleGrid>
                      </ScrollArea>
                    </motion.div>
                  ) : (
                    <Box style={{ padding: '40px', textAlign: 'center' }}>
                      <Text size="lg" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {attractions.length > 0 ? '暂无匹配的景点' : '暂无景点数据'}
                      </Text>
                      {attractions.length > 0 && (
                        <Text size="sm" c="silverGray.6" mt="xs">
                          请调整筛选条件后重试
                        </Text>
                      )}
                    </Box>
                  )}
                </Box>
              </Group>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Box style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{
              y: [0, -5, 0],
              x: [0, 5, 0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin size={48} color={ACCENT_COLOR} strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            选择目的地后查看景点
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            每个星球都有独特的太空景点等待探索
          </Text>
        </Box>
      )}

      <FilterPresetsPanel<AttractionFilters>
        opened={presetsModalOpen}
        onClose={() => setPresetsModalOpen(false)}
        presets={presets}
        onApply={applyPreset}
        onDelete={deletePreset}
        onSave={savePreset}
        accentColor={ACCENT_COLOR}
      />
    </Card>
  );
};
