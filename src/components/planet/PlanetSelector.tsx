import { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Group, SegmentedControl, Input, Skeleton } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { PlanetCard } from './PlanetCard';
import { NeonText } from '../effects/NeonText';
import { staggerContainer, fadeInUp } from '../../utils/animations';

export const PlanetSelector = () => {
  const { planets, loading, destination, setDestination, loadPlanets } = useTravelStore();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPlanets();
  }, [loadPlanets]);

  const filteredPlanets = planets.filter(planet => {
    const matchesFilter = filter === 'all' || planet.difficulty === filter;
    const matchesSearch = planet.name.toLowerCase().includes(search.toLowerCase()) ||
                         planet.nameEn.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Box p="lg">
      <Group justify="space-between" mb="lg" wrap="wrap" gap="md">
        <Group gap="md" align="center">
          <NeonText color="#9d4edd" size="22px">
            选择目的地
          </NeonText>
          <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            DESTINATION SELECTION
          </Text>
        </Group>

        <Group gap="md" wrap="wrap">
          <Input
            placeholder="搜索星球..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px' }}
          />
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            data={[
              { label: '全部', value: 'all' },
              { label: '简单', value: 'easy' },
              { label: '中等', value: 'medium' },
              { label: '困难', value: 'hard' },
              { label: '极限', value: 'extreme' }
            ]}
            styles={{
              root: {
                backgroundColor: 'rgba(10, 22, 40, 0.6)',
                border: '1px solid rgba(157, 78, 221, 0.3)'
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
        </Group>
      </Group>

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
        ) : (
          <motion.div
            key="content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
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
        )}
      </AnimatePresence>
    </Box>
  );
};
