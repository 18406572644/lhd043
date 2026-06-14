import { Card, Text, Group, Box, Badge, ActionIcon, Tooltip, Image, SimpleGrid, ScrollArea } from '@mantine/core';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, Camera, Trash2, Edit3, Star, CloudRain, Sun, Wind, Snowflake, Zap } from 'lucide-react';
import { DiaryEntry, Planet, Attraction } from '../../types';
import { NeonText } from '../effects/NeonText';
import { useTravelStore } from '../../store/useTravelStore';

interface DiaryTimelineProps {
  entries: DiaryEntry[];
  planets: Planet[];
  attractions: Attraction[];
  onEdit: (entry: DiaryEntry) => void;
}

const moodConfig = {
  excited: { icon: '🚀', color: '#ffbe0b', label: '兴奋' },
  peaceful: { icon: '🌙', color: '#00f5d4', label: '平静' },
  adventurous: { icon: '⭐', color: '#9d4edd', label: '冒险' },
  tired: { icon: '💤', color: '#bdc3c7', label: '疲惫' },
  amazed: { icon: '✨', color: '#ff006e', label: '惊叹' }
};

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun size={14} />,
  rainy: <CloudRain size={14} />,
  windy: <Wind size={14} />,
  snowy: <Snowflake size={14} />,
  stormy: <Zap size={14} />
};

const formatStardate = (isoString: string, crewLogNumber: number) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return {
    stardate: `SD.${year}${month}${day}.${hours}${minutes}`,
    displayDate: `${year}-${month}-${day} ${hours}:${minutes}`,
    logNumber: String(crewLogNumber).padStart(4, '0')
  };
};

export const DiaryTimeline = ({ entries, planets, attractions, onEdit }: DiaryTimelineProps) => {
  const { deleteDiaryEntry, checkInRecords } = useTravelStore();

  const getPlanetById = (id?: string) => planets.find(p => p.id === id);
  const getAttractionById = (id?: string) => attractions.find(a => a.id === id);
  const getCheckInsForEntry = (entryId: string) => 
    checkInRecords.filter(r => r.diaryEntryId === entryId);

  if (entries.length === 0) {
    return (
      <Card p="xl" radius="lg" style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ 
            rotate: [0, 360],
            transition: { duration: 20, repeat: Infinity, ease: 'linear' }
          }}
          style={{ display: 'inline-block' }}
        >
          <Star size={48} color="#9d4edd" strokeWidth={1} />
        </motion.div>
        <NeonText color="#9d4edd" size="18px" style={{ marginTop: '16px' }}>
          暂无船员日志
        </NeonText>
        <Text size="sm" c="silverGray.6" mt="md">
          点击上方按钮开始记录你的星际旅行
        </Text>
        <Text size="xs" c="silverGray.7" mt="xs" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          NO LOGS RECORDED - SYSTEM READY
        </Text>
      </Card>
    );
  }

  return (
    <ScrollArea h="100%" type="auto" scrollbarSize={8} style={{ paddingRight: '8px' }}>
      <Box style={{ position: 'relative' }}>
        <Box
          style={{
            position: 'absolute',
            left: '24px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(180deg, #9d4edd 0%, #00f5d4 50%, #ffbe0b 100%)',
            opacity: 0.4
          }}
        />

        {entries.map((entry, index) => {
          const { stardate, displayDate, logNumber } = formatStardate(entry.timestamp, entry.crewLogNumber);
          const planet = getPlanetById(entry.planetId);
          const attraction = getAttractionById(entry.attractionId);
          const mood = entry.mood ? moodConfig[entry.mood] : null;
          const entryCheckIns = getCheckInsForEntry(entry.id);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ marginBottom: '24px', paddingLeft: '56px', position: 'relative' }}
            >
              <Box
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '20px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: planet?.color || '#9d4edd',
                  border: '3px solid #0a1628',
                  boxShadow: `0 0 15px ${planet?.color || '#9d4edd'}`,
                  zIndex: 1
                }}
              />

              <Card 
                radius="lg" 
                p="0"
                style={{
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(157, 78, 221, 0.05) 100%)'
                }}
              >
                <Box
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(157, 78, 221, 0.15)',
                    borderBottom: '1px solid rgba(157, 78, 221, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <Group gap="md" wrap="wrap">
                    <Group gap="xs" wrap="nowrap">
                      <Box
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          background: 'rgba(0, 245, 212, 0.15)',
                          border: '1px solid rgba(0, 245, 212, 0.3)'
                        }}
                      >
                        <Text size="xs" c="neonCyan.5" fw={700} style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          LOG #{logNumber}
                        </Text>
                      </Box>
                      <Text size="xs" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {stardate}
                      </Text>
                    </Group>
                  </Group>

                  <Group gap="xs" wrap="nowrap">
                    {mood && (
                      <Tooltip label={mood.label} position="top">
                        <Badge 
                          size="sm" 
                          style={{ 
                            background: `${mood.color}22`, 
                            color: mood.color,
                            border: `1px solid ${mood.color}44`
                          }}
                        >
                          <span style={{ marginRight: '4px' }}>{mood.icon}</span>
                          {mood.label}
                        </Badge>
                      </Tooltip>
                    )}
                    {entry.weather && weatherIcons[entry.weather] && (
                      <Tooltip label="天气" position="top">
                        <Badge size="sm" variant="outline" color="silverGray">
                          {weatherIcons[entry.weather]}
                        </Badge>
                      </Tooltip>
                    )}
                  </Group>
                </Box>

                <Box style={{ padding: '16px' }}>
                  <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
                    <Group gap="xs" wrap="wrap">
                      <Calendar size={14} color="#6c757d" />
                      <Text size="sm" c="silverGray.5">{displayDate}</Text>
                    </Group>

                    {(planet || attraction) && (
                      <Group gap="xs" wrap="wrap">
                        {planet && (
                          <Badge 
                            size="sm" 
                            variant="outline" 
                            style={{ 
                              color: planet.color, 
                              borderColor: `${planet.color}55`,
                              background: `${planet.color}11`
                            }}
                          >
                            <MapPin size={12} style={{ marginRight: '4px' }} />
                            {planet.name}
                          </Badge>
                        )}
                        {attraction && (
                          <Badge size="sm" variant="outline" color="energyYellow">
                            <Star size={12} style={{ marginRight: '4px' }} />
                            {attraction.name}
                          </Badge>
                        )}
                      </Group>
                    )}
                  </Group>

                  <NeonText color={planet?.color || '#9d4edd'} size="20px">
                    {entry.title}
                  </NeonText>

                  <Text 
                    size="md" 
                    c="silverGray.4" 
                    mt="sm" 
                    style={{ 
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '15px'
                    }}
                  >
                    {entry.content}
                  </Text>

                  {entryCheckIns.length > 0 && (
                    <Box mt="md" pt="md" style={{ borderTop: '1px solid rgba(157, 78, 221, 0.2)' }}>
                      <Group gap="xs" mb="sm" wrap="nowrap">
                        <MapPin size={14} color="#ffbe0b" />
                        <Text size="xs" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          本次打卡景点 ({entryCheckIns.length})
                        </Text>
                      </Group>
                      <Group gap="xs" wrap="wrap">
                        {entryCheckIns.map(checkIn => {
                          const checkInAttraction = getAttractionById(checkIn.attractionId);
                          const checkInPlanet = getPlanetById(checkIn.planetId);
                          return checkInAttraction ? (
                            <Badge 
                              key={checkIn.id} 
                              size="sm" 
                              style={{
                                background: 'rgba(255, 190, 11, 0.1)',
                                border: '1px solid rgba(255, 190, 11, 0.3)',
                                color: '#ffbe0b'
                              }}
                            >
                              ✓ {checkInPlanet?.name} · {checkInAttraction.name}
                            </Badge>
                          ) : null;
                        })}
                      </Group>
                    </Box>
                  )}

                  {entry.images.length > 0 && (
                    <Box mt="md" pt="md" style={{ borderTop: '1px solid rgba(157, 78, 221, 0.2)' }}>
                      <Group gap="xs" mb="sm" wrap="nowrap">
                        <Camera size={14} color="#00f5d4" />
                        <Text size="xs" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          影像记录 ({entry.images.length})
                        </Text>
                      </Group>
                      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
                        {entry.images.map(img => (
                          <Box 
                            key={img.id} 
                            style={{ 
                              borderRadius: '8px', 
                              overflow: 'hidden',
                              border: '1px solid rgba(0, 245, 212, 0.2)'
                            }}
                          >
                            <Image 
                              src={img.url} 
                              alt={img.caption || '旅行照片'}
                              height={140}
                            />
                            {img.caption && (
                              <Box 
                                style={{ 
                                  padding: '6px 10px', 
                                  background: 'rgba(10, 22, 40, 0.8)',
                                  borderTop: '1px solid rgba(0, 245, 212, 0.2)'
                                }}
                              >
                                <Text size="xs" c="silverGray.5">{img.caption}</Text>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}
                </Box>

                <Box
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderTop: '1px solid rgba(157, 78, 221, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Group gap="xs" wrap="nowrap">
                    <Clock size={12} color="#6c757d" />
                    <Text size="xs" c="silverGray.7" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      RECORDED: {stardate}
                    </Text>
                  </Group>

                  <Group gap="xs" wrap="nowrap">
                    <Tooltip label="编辑日志" position="top">
                      <ActionIcon 
                        size="sm" 
                        variant="light" 
                        color="neonCyan"
                        onClick={() => onEdit(entry)}
                      >
                        <Edit3 size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="删除日志" position="top">
                      <ActionIcon 
                        size="sm" 
                        variant="light" 
                        color="neonPink"
                        onClick={() => {
                          if (window.confirm('确定要删除这条船员日志吗？')) {
                            deleteDiaryEntry(entry.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>
    </ScrollArea>
  );
};
