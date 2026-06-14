import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, SimpleGrid, Skeleton, Group, Input, ActionIcon, Tooltip, Text } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Rocket, Calendar, Wallet, Thermometer, Globe2, Sparkles, MapPin, Settings2 } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { PlanetCard } from './PlanetCard';
import { NeonText } from '../effects/NeonText';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import {
  FilterDashboard,
  FilterSection,
  NeonRangeSlider,
  MultiTagCheckbox,
  LogicToggle,
  FilterChipsBar,
  FilterPresetsPanel,
  FilterChip,
  FilterPreset,
  PlanetFilters,
  DEFAULT_PLANET_FILTERS,
  DIFFICULTY_OPTIONS,
  PLANET_TYPE_OPTIONS,
  FilterLogic,
  formatCurrency as fc
} from '../filter';

const formatCurrency = fc;

const ACCENT_COLOR = '#9d4edd';
const STORAGE_KEY = 'planet_filter_presets';

function getDistanceLabel(ly: number): string {
  if (ly < 0.0001) return `${(ly * 1000000).toFixed(0)}km`;
  if (ly < 0.01) return `${(ly * 1000).toFixed(2)}光秒`;
  if (ly < 1) return `${(ly * 1000).toFixed(0)}光秒`;
  return `${ly.toFixed(1)}光年`;
}

export const PlanetSelector = () => {
  const { planets, loading, destination, setDestination, loadPlanets } = useTravelStore();
  const [filters, setFilters] = useState<PlanetFilters>(DEFAULT_PLANET_FILTERS);
  const [presets, setPresets] = useState<FilterPreset<PlanetFilters>[]>([]);
  const [presetsModalOpen, setPresetsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    loadPlanets();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setPresets(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [loadPlanets]);

  const updateFilter = useCallback(<K extends keyof PlanetFilters>(key: K, value: PlanetFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_PLANET_FILTERS);
  }, []);

  const removeChip = useCallback((chipId: string) => {
    if (chipId.startsWith('diff_')) {
      const v = chipId.replace('diff_', '');
      setFilters(prev => ({ ...prev, difficulties: prev.difficulties.filter(d => d !== v) }));
    } else if (chipId.startsWith('type_')) {
      const v = chipId.replace('type_', '');
      setFilters(prev => ({ ...prev, planetTypes: prev.planetTypes.filter(t => t !== v) }));
    } else if (chipId.startsWith('range_')) {
      const rangeKey = chipId.replace('range_', '') as keyof typeof DEFAULT_PLANET_FILTERS;
      if (rangeKey in DEFAULT_PLANET_FILTERS) {
        setFilters(prev => ({ ...prev, [rangeKey]: DEFAULT_PLANET_FILTERS[rangeKey] }));
      }
    } else if (chipId === 'search') {
      setFilters(prev => ({ ...prev, searchQuery: '' }));
    }
  }, []);

  const activeChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    if (filters.searchQuery) {
      chips.push({ id: 'search', label: filters.searchQuery, group: '搜索', color: '#00f5d4' });
    }

    const defaults = DEFAULT_PLANET_FILTERS;
    (['distance', 'travelDays', 'budget', 'gravity', 'temperature'] as const).forEach(key => {
      const curr = filters[key];
      const def = defaults[key];
      if (curr.min !== def.min || curr.max !== def.max) {
        const groupMap: Record<string, string> = {
          distance: '距离',
          travelDays: '行程',
          budget: '预算',
          gravity: '重力',
          temperature: '温度'
        };
        let label = '';
        if (key === 'budget') {
          label = `${formatCurrency(curr.min)} - ${formatCurrency(curr.max)}`;
        } else if (key === 'distance') {
          label = `${getDistanceLabel(curr.min)} - ${getDistanceLabel(curr.max)}`;
        } else if (key === 'travelDays') {
          label = `${curr.min}-${curr.max}天`;
        } else if (key === 'gravity') {
          label = `${curr.min.toFixed(2)}G - ${curr.max.toFixed(2)}G`;
        } else {
          label = `${curr.min}°C - ${curr.max}°C`;
        }
        chips.push({ id: `range_${key}`, label, group: groupMap[key], color: ACCENT_COLOR });
      }
    });

    filters.difficulties.forEach(d => {
      const opt = DIFFICULTY_OPTIONS.find(o => o.value === d);
      if (opt) chips.push({ id: `diff_${d}`, label: opt.label, group: '难度', color: opt.color });
    });

    filters.planetTypes.forEach(t => {
      const opt = PLANET_TYPE_OPTIONS.find(o => o.value === t);
      if (opt) chips.push({ id: `type_${t}`, label: opt.label, group: '类型', color: opt.color });
    });

    return chips;
  }, [filters]);

  const filteredPlanets = useMemo(() => {
    return planets.filter(p => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.nameEn.toLowerCase().includes(q)) {
          return false;
        }
      }

      if (p.distance < filters.distance.min || p.distance > filters.distance.max) return false;
      if (p.travelDays < filters.travelDays.min || p.travelDays > filters.travelDays.max) return false;
      if (p.baseCost < filters.budget.min || p.baseCost > filters.budget.max) return false;
      if (p.gravity < filters.gravity.min || p.gravity > filters.gravity.max) return false;
      if (p.maxTemp < filters.temperature.min || p.minTemp > filters.temperature.max) return false;

      if (filters.difficulties.length > 0) {
        const match = filters.difficulties.includes(p.difficulty);
        const logic: FilterLogic = filters.difficultyLogic;
        if (logic === 'AND' && !match) return false;
        if (logic === 'OR' && !match) return false;
      }

      if (filters.planetTypes.length > 0) {
        const match = filters.planetTypes.includes(p.type);
        const logic: FilterLogic = filters.typeLogic;
        if (logic === 'AND' && !match) return false;
        if (logic === 'OR' && !match) return false;
      }

      return true;
    });
  }, [planets, filters]);

  const savePreset = useCallback((name: string) => {
    const newPreset: FilterPreset<PlanetFilters> = {
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

  const applyPreset = useCallback((preset: FilterPreset<PlanetFilters>) => {
    setFilters(preset.filters);
  }, []);

  return (
    <Box p="lg">
      <Group justify="space-between" mb="lg" wrap="wrap" gap="md" align="flex-start">
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" mb="md" wrap="wrap" gap="md">
            <Group gap="md" align="center">
              <NeonText color={ACCENT_COLOR} size="22px">
                选择目的地
              </NeonText>
              <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                DESTINATION SELECTION
              </Text>
            </Group>

            <Group gap="xs">
              <Input
                placeholder="搜索星球..."
                leftSection={<Search size={16} color={ACCENT_COLOR} />}
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                style={{ width: '220px' }}
              />
              <Tooltip label={showFilter ? '隐藏筛选器' : '显示筛选器'} position="left">
                <ActionIcon
                  variant="outline"
                  onClick={() => setShowFilter(!showFilter)}
                  style={{
                    borderColor: showFilter ? ACCENT_COLOR + '88' : 'rgba(157, 78, 221, 0.3)',
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
            resultCount={filteredPlanets.length}
            totalCount={planets.length}
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
                title="星球筛选控制台"
                subtitle="PLANET FILTER CONSOLE"
                accentColor={ACCENT_COLOR}
                width={340}
                maxHeight={600}
              >
                <FilterSection
                  title="距离与行程"
                  icon={<Rocket size={12} />}
                  accentColor={ACCENT_COLOR}
                >
                  <NeonRangeSlider
                    label="距离范围"
                    value={filters.distance}
                    min={0}
                    max={1200}
                    step={0.00001}
                    onChange={(v) => updateFilter('distance', v)}
                    formatMin={(v) => getDistanceLabel(v)}
                    formatMax={(v) => getDistanceLabel(v)}
                    accentColor={ACCENT_COLOR}
                    glowColor="rgba(157, 78, 221, 0.6)"
                    decimals={6}
                  />
                  <NeonRangeSlider
                    label="旅行时长（天）"
                    icon={<Calendar size={12} />}
                    value={filters.travelDays}
                    min={1}
                    max={100}
                    step={1}
                    onChange={(v) => updateFilter('travelDays', v)}
                    unit="天"
                    accentColor="#00f5d4"
                    glowColor="rgba(0, 245, 212, 0.6)"
                  />
                </FilterSection>

                <FilterSection
                  title="预算与环境"
                  icon={<Wallet size={12} />}
                  accentColor="#ffbe0b"
                >
                  <NeonRangeSlider
                    label="预算范围"
                    value={filters.budget}
                    min={0}
                    max={1100000}
                    step={10000}
                    onChange={(v) => updateFilter('budget', v)}
                    formatMin={(v) => formatCurrency(v)}
                    formatMax={(v) => formatCurrency(v)}
                    accentColor="#ffbe0b"
                    glowColor="rgba(255, 190, 11, 0.6)"
                  />
                  <NeonRangeSlider
                    label="重力范围"
                    icon={<Globe2 size={12} />}
                    value={filters.gravity}
                    min={0}
                    max={1.5}
                    step={0.01}
                    onChange={(v) => updateFilter('gravity', v)}
                    unit="G"
                    decimals={2}
                    accentColor="#3498db"
                    glowColor="rgba(52, 152, 219, 0.6)"
                  />
                  <NeonRangeSlider
                    label="温度范围"
                    icon={<Thermometer size={12} />}
                    value={filters.temperature}
                    min={-300}
                    max={500}
                    step={5}
                    onChange={(v) => updateFilter('temperature', v)}
                    unit="°C"
                    accentColor="#ff6b35"
                    glowColor="rgba(255, 107, 53, 0.6)"
                  />
                </FilterSection>

                <FilterSection
                  title="难度等级"
                  icon={<Sparkles size={12} />}
                  accentColor="#ff006e"
                  badge={filters.difficulties.length || undefined}
                >
                  <LogicToggle
                    value={filters.difficultyLogic}
                    onChange={(v) => updateFilter('difficultyLogic', v)}
                    accentColor="#ff006e"
                  />
                  <Box mt="sm">
                    <MultiTagCheckbox
                      options={DIFFICULTY_OPTIONS}
                      value={filters.difficulties}
                      onChange={(v) => updateFilter('difficulties', v)}
                      accentColor="#ff006e"
                    />
                  </Box>
                </FilterSection>

                <FilterSection
                  title="星球类型"
                  icon={<MapPin size={12} />}
                  accentColor="#00bcd4"
                  badge={filters.planetTypes.length || undefined}
                >
                  <LogicToggle
                    value={filters.typeLogic}
                    onChange={(v) => updateFilter('typeLogic', v)}
                    accentColor="#00bcd4"
                  />
                  <Box mt="sm">
                    <MultiTagCheckbox
                      options={PLANET_TYPE_OPTIONS}
                      value={filters.planetTypes}
                      onChange={(v) => updateFilter('planetTypes', v)}
                      accentColor="#00bcd4"
                    />
                  </Box>
                </FilterSection>
              </FilterDashboard>
            </motion.div>
          )}
        </AnimatePresence>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {loading.planets ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} height={280} radius="lg" animate />
                  ))}
                </SimpleGrid>
              </motion.div>
            ) : filteredPlanets.length > 0 ? (
              <motion.div
                key="content"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <SimpleGrid cols={{ base: 1, sm: 2, lg: filteredPlanets.length === 1 ? 1 : 3 }} spacing="lg">
                  <AnimatePresence>
                    {filteredPlanets.map((planet) => (
                      <motion.div key={planet.id} variants={fadeInUp} layout>
                        <PlanetCard
                          planet={planet}
                          selected={destination?.id === planet.id}
                          onClick={() => setDestination(planet)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SimpleGrid>
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
                  borderRadius: '12px',
                  background: 'rgba(10, 22, 40, 0.6)',
                  border: `1px dashed ${ACCENT_COLOR}44`
                }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Search size={48} color={ACCENT_COLOR} strokeWidth={1} />
                </motion.div>
                <Text size="lg" c="silverGray.4" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  没有找到匹配的星球
                </Text>
                <Text size="sm" c="silverGray.6" mt="xs">
                  尝试调整筛选条件或清除部分限制
                </Text>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Group>

      <FilterPresetsPanel
        opened={presetsModalOpen}
        onClose={() => setPresetsModalOpen(false)}
        presets={presets}
        onApply={applyPreset}
        onDelete={deletePreset}
        onSave={savePreset}
        accentColor={ACCENT_COLOR}
      />
    </Box>
  );
};
