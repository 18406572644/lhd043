import { useState, useMemo } from 'react';
import { Card, Text, Group, Box, Button, Badge, Select, SimpleGrid, ActionIcon, Tooltip, SegmentedControl } from '@mantine/core';
import { motion } from 'framer-motion';
import { BookOpen, Plus, MapPin, Star, Calendar, Filter, Globe, CheckCircle2, Rocket } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { DiaryTimeline } from './DiaryTimeline';
import { DiaryEditor } from './DiaryEditor';
import { NeonText } from '../effects/NeonText';
import { DiaryEntry, Planet, Attraction } from '../../types';

export const DiaryManager = () => {
  const { 
    diaryEntries, 
    planets, 
    attractions, 
    checkInRecords,
    isAttractionCheckedIn 
  } = useTravelStore();

  const [editorOpened, setEditorOpened] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [filterPlanet, setFilterPlanet] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'timeline' | 'checkins'>('all');
  const [sortMode, setSortMode] = useState<'date-desc' | 'date-asc' | 'planet'>('date-desc');

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setEditorOpened(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setEditorOpened(true);
  };

  const handleCloseEditor = () => {
    setEditorOpened(false);
    setEditingEntry(null);
  };

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...diaryEntries];

    if (filterPlanet) {
      result = result.filter(e => e.planetId === filterPlanet);
    }

    if (filterMode === 'checkins') {
      result = result.filter(e => {
        const hasCheckIns = checkInRecords.some(r => r.diaryEntryId === e.id);
        return hasCheckIns || e.attractionId;
      });
    }

    switch (sortMode) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'planet':
        result.sort((a, b) => {
          const planetA = planets.find(p => p.id === a.planetId)?.name || '';
          const planetB = planets.find(p => p.id === b.planetId)?.name || '';
          return planetA.localeCompare(planetB, 'zh-CN');
        });
        break;
    }

    return result;
  }, [diaryEntries, filterPlanet, filterMode, sortMode, checkInRecords, planets]);

  const checkInStats = useMemo(() => {
    const uniquePlanets = new Set<string>();
    const uniqueAttractions = new Set<string>();
    
    checkInRecords.forEach(record => {
      uniquePlanets.add(record.planetId);
      uniqueAttractions.add(record.attractionId);
    });

    diaryEntries.forEach(entry => {
      if (entry.planetId) uniquePlanets.add(entry.planetId);
      if (entry.attractionId) uniqueAttractions.add(entry.attractionId);
    });

    return {
      totalEntries: diaryEntries.length,
      visitedPlanets: uniquePlanets.size,
      checkedInAttractions: uniqueAttractions.size,
      totalCheckIns: checkInRecords.length
    };
  }, [diaryEntries, checkInRecords]);

  const planetCheckInProgress = useMemo(() => {
    return planets.map(planet => {
      const planetAttractions = attractions.filter(a => a.planetId === planet.id);
      const checkedInCount = planetAttractions.filter(a => isAttractionCheckedIn(a.id)).length;
      const entriesForPlanet = diaryEntries.filter(e => e.planetId === planet.id);
      
      return {
        planet,
        totalAttractions: planetAttractions.length,
        checkedInCount,
        entryCount: entriesForPlanet.length,
        progress: planetAttractions.length > 0 
          ? Math.round((checkedInCount / planetAttractions.length) * 100) 
          : 0
      };
    }).filter(p => p.entryCount > 0 || p.checkedInCount > 0);
  }, [planets, attractions, diaryEntries, isAttractionCheckedIn]);

  return (
    <Box>
      <Group justify="space-between" mb="lg" wrap="wrap" gap="md">
        <Group gap="md" wrap="wrap">
          <Group gap="xs" wrap="nowrap">
            <BookOpen size={24} color="#9d4edd" />
            <div>
              <NeonText color="#9d4edd" size="22px">
                船员日志
              </NeonText>
              <Text size="xs" c="silverGray.6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                CREW LOG ARCHIVE
              </Text>
            </div>
          </Group>
        </Group>

        <Button
          leftSection={<Plus size={18} />}
          color="neonPurple"
          size="md"
          onClick={handleNewEntry}
        >
          记录日志
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="lg">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card p="md" radius="lg" style={{ textAlign: 'center' }}>
            <Group justify="center" mb="xs" wrap="nowrap">
              <BookOpen size={18} color="#9d4edd" />
              <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                日志总数
              </Text>
            </Group>
            <Text fw={700} size="28px" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {checkInStats.totalEntries}
            </Text>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card p="md" radius="lg" style={{ textAlign: 'center' }}>
            <Group justify="center" mb="xs" wrap="nowrap">
              <Globe size={18} color="#00f5d4" />
              <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                登陆星球
              </Text>
            </Group>
            <Text fw={700} size="28px" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {checkInStats.visitedPlanets}
            </Text>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card p="md" radius="lg" style={{ textAlign: 'center' }}>
            <Group justify="center" mb="xs" wrap="nowrap">
              <Star size={18} color="#ffbe0b" />
              <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                打卡景点
              </Text>
            </Group>
            <Text fw={700} size="28px" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {checkInStats.checkedInAttractions}
            </Text>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card p="md" radius="lg" style={{ textAlign: 'center' }}>
            <Group justify="center" mb="xs" wrap="nowrap">
              <CheckCircle2 size={18} color="#ff006e" />
              <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                打卡次数
              </Text>
            </Group>
            <Text fw={700} size="28px" c="neonPink.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {checkInStats.totalCheckIns}
            </Text>
          </Card>
        </motion.div>
      </SimpleGrid>

      {planetCheckInProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card p="md" radius="lg" mb="lg">
            <Group gap="xs" mb="md" wrap="nowrap">
              <Rocket size={16} color="#9d4edd" />
              <Text size="sm" fw={600} c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                星球探索进度
              </Text>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              {planetCheckInProgress.map(({ planet, totalAttractions, checkedInCount, entryCount, progress }) => (
                <Box
                  key={planet.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: `${planet.color}10`,
                    border: `1px solid ${planet.color}30`
                  }}
                >
                  <Group justify="space-between" mb="xs" wrap="wrap" gap="xs">
                    <Group gap="xs" wrap="nowrap">
                      <Box
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: planet.color,
                          boxShadow: `0 0 8px ${planet.color}`
                        }}
                      />
                      <Text size="sm" fw={600} style={{ color: planet.color }}>
                        {planet.name}
                      </Text>
                    </Group>
                    <Badge size="xs" variant="outline" style={{ color: planet.color, borderColor: `${planet.color}50` }}>
                      {progress}%
                    </Badge>
                  </Group>
                  
                  <Box
                    style={{
                      height: '6px',
                      borderRadius: '3px',
                      background: 'rgba(255,255,255,0.05)',
                      marginBottom: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${planet.color}, ${planet.color}88)`,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </Box>

                  <Group gap="sm" wrap="wrap">
                    <Group gap="xs" wrap="nowrap">
                      <Star size={12} color="#ffbe0b" />
                      <Text size="xs" c="silverGray.5">
                        {checkedInCount}/{totalAttractions} 景点
                      </Text>
                    </Group>
                    <Group gap="xs" wrap="nowrap">
                      <BookOpen size={12} color="#00f5d4" />
                      <Text size="xs" c="silverGray.5">
                        {entryCount} 篇日志
                      </Text>
                    </Group>
                  </Group>
                </Box>
              ))}
            </SimpleGrid>
          </Card>
        </motion.div>
      )}

      <Card p="md" radius="lg" mb="lg">
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="md" wrap="wrap">
            <Group gap="xs" wrap="nowrap">
              <Filter size={14} color="#6c757d" />
              <SegmentedControl
                value={filterMode}
                onChange={(v) => setFilterMode(v as typeof filterMode)}
                data={[
                  { label: '全部', value: 'all' },
                  { label: '按日期', value: 'timeline' },
                  { label: '含打卡', value: 'checkins' }
                ]}
                styles={{
                  root: {
                    backgroundColor: 'rgba(10, 22, 40, 0.6)',
                    border: '1px solid rgba(157, 78, 221, 0.3)'
                  },
                  label: {
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '11px'
                  }
                }}
              />
            </Group>

            <Select
              placeholder="筛选星球"
              value={filterPlanet}
              onChange={setFilterPlanet}
              data={planets.map(p => ({ value: p.id, label: p.name }))}
              clearable
              leftSection={<Globe size={14} />}
              size="sm"
              style={{ width: '160px' }}
            />
          </Group>

          <Select
            placeholder="排序方式"
            value={sortMode}
            onChange={(v) => setSortMode(v as typeof sortMode)}
            data={[
              { value: 'date-desc', label: '最新优先' },
              { value: 'date-asc', label: '最早优先' },
              { value: 'planet', label: '按星球' }
            ]}
            leftSection={<Calendar size={14} />}
            size="sm"
            style={{ width: '140px' }}
          />
        </Group>

        {filterMode !== 'all' || filterPlanet || sortMode !== 'date-desc' ? (
          <Group mt="sm" gap="xs" wrap="wrap">
            <Text size="xs" c="silverGray.6">
              当前筛选结果：
            </Text>
            <Badge size="sm" variant="outline" color="neonCyan">
              {filteredAndSortedEntries.length} 条日志
            </Badge>
            {filterPlanet && (
              <Badge size="sm" variant="outline" color="neonPurple">
                星球：{planets.find(p => p.id === filterPlanet)?.name}
              </Badge>
            )}
          </Group>
        ) : null}
      </Card>

      <DiaryTimeline
        entries={filteredAndSortedEntries}
        planets={planets}
        attractions={attractions}
        onEdit={handleEdit}
      />

      <DiaryEditor
        opened={editorOpened}
        onClose={handleCloseEditor}
        editingEntry={editingEntry}
        planets={planets}
        attractions={attractions}
      />
    </Box>
  );
};
