import { Card, Text, Badge, Group, Box, RingProgress } from '@mantine/core';
import { motion } from 'framer-motion';
import { Planet } from '../../types';
import { getDifficultyColor, getDifficultyLabel, formatDistance } from '../../utils/calculations';
import { Thermometer, Gauge, Wind, Calendar } from 'lucide-react';

interface PlanetCardProps {
  planet: Planet;
  selected: boolean;
  onClick: () => void;
}

const InfoItem = ({ icon: Icon, label, value, color = '#c0c5ce' }: { icon: any; label: string; value: string; color?: string }) => (
  <Group gap="xs" wrap="nowrap">
    <Icon size={14} color={color} />
    <Text size="xs" c="silverGray.5">{label}:</Text>
    <Text size="xs" fw={600} style={{ color, fontFamily: "'Orbitron', sans-serif" }}>{value}</Text>
  </Group>
);

export const PlanetCard = ({ planet, selected, onClick }: PlanetCardProps) => {
  const difficultyColor = getDifficultyColor(planet.difficulty);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        p="lg"
        radius="lg"
        onClick={onClick}
        style={{
          cursor: 'pointer',
          border: selected 
            ? `2px solid ${planet.color}` 
            : '1px solid rgba(157, 78, 221, 0.3)',
          boxShadow: selected 
            ? `0 0 40px ${planet.color}44, inset 0 0 20px ${planet.color}22` 
            : 'none',
          position: 'relative',
          overflow: 'hidden',
          height: '100%'
        }}
      >
        {selected && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, transparent, ${planet.color}, transparent)`
            }}
            animate={{
              backgroundPosition: ['-100% 0', '100% 0']
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <Group justify="space-between" mb="md" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            <motion.div
              animate={{ 
                rotate: selected ? 360 : 0,
                scale: selected ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}88, #0a1628)`,
                boxShadow: `0 0 30px ${planet.color}66`,
                flexShrink: 0
              }}
            />
            <Box>
              <Text fw={700} size="xl" style={{ color: planet.color, fontFamily: "'Orbitron', sans-serif" }}>
                {planet.name}
              </Text>
              <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {planet.nameEn}
              </Text>
            </Box>
          </Group>

          <Badge
            style={{
              backgroundColor: `${difficultyColor}22`,
              color: difficultyColor,
              border: `1px solid ${difficultyColor}`,
              fontFamily: "'Orbitron', sans-serif"
            }}
          >
            {getDifficultyLabel(planet.difficulty)}
          </Badge>
        </Group>

        <Text size="sm" c="silverGray.4" mb="md" lineClamp={2}>
          {planet.description}
        </Text>

        <Box style={{ marginBottom: '12px' }}>
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="silverGray.5">航线规划进度</Text>
            <Text size="xs" fw={600} c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {selected ? '100%' : '0%'}
            </Text>
          </Group>
          <RingProgress
            size={60}
            thickness={4}
            roundCaps
            sections={[{ value: selected ? 100 : 0, color: planet.color }]}
            style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.3 }}
          />
        </Box>

        <Group grow gap="xs">
          <InfoItem icon={Gauge} label="重力" value={`${planet.gravity}G`} color={planet.color} />
          <InfoItem icon={Thermometer} label="温度" value={planet.temperature.split(' ')[0]} color="#ffbe0b" />
        </Group>
        <Group grow gap="xs" mt="xs">
          <InfoItem icon={Wind} label="大气" value={planet.atmosphere.substring(0, 4)} color="#00f5d4" />
          <InfoItem icon={Calendar} label="距离" value={formatDistance(planet.distance)} color="#9d4edd" />
        </Group>
      </Card>
    </motion.div>
  );
};
