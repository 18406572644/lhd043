import { Card, Text, Group, Box, Badge, Image, ScrollArea } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Star, MapPin } from 'lucide-react';
import { Attraction } from '../../types';
import { formatCurrency } from '../../utils/calculations';
import { useTravelStore } from '../../store/useTravelStore';
import { useState } from 'react';

interface AttractionCardProps {
  attraction: Attraction;
  index: number;
}

export const AttractionCard = ({ attraction, index }: AttractionCardProps) => {
  const { destination } = useTravelStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        p={0}
        radius="lg"
        style={{
          overflow: 'hidden',
          background: 'rgba(10, 22, 40, 0.8)',
          border: '1px solid rgba(157, 78, 221, 0.3)',
          height: '100%',
          position: 'relative'
        }}
      >
        <Box style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
          <motion.div
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Image
              src={attraction.image}
              alt={attraction.name}
              height={180}
              fit="cover"
            />
          </motion.div>
          
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(10, 22, 40, 0.95) 100%)'
            }}
          />

          <Box
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '8px'
            }}
          >
            <Badge
              style={{
                background: destination?.color || '#9d4edd',
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              #{index + 1}
            </Badge>
          </Box>

          <Box
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px'
            }}
          >
            <Text fw={700} size="lg" c="white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {attraction.name}
            </Text>
          </Box>
        </Box>

        <Box p="md">
          <Group mb="md" gap="md">
            <Group gap="xs">
              <Clock size={14} color="#00f5d4" />
              <Text size="xs" c="silverGray.4">
                {attraction.duration} 小时
              </Text>
            </Group>
            <Group gap="xs">
              <Calendar size={14} color="#ffbe0b" />
              <Text size="xs" c="silverGray.4">
                {attraction.bestTime}
              </Text>
            </Group>
            <Group gap="xs">
              <Star size={14} color="#9d4edd" />
              <Text size="xs" c="silverGray.4">
                {formatCurrency(300)}/人
              </Text>
            </Group>
          </Group>

          <Text size="sm" c="silverGray.4" mb="md" lineClamp={2}>
            {attraction.description}
          </Text>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(157, 78, 221, 0.2)'
                  }}
                >
                  <Text size="xs" fw={600} c="neonCyan.5" mb="xs" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    景点亮点
                  </Text>
                  <Group gap="xs" wrap="wrap">
                    {attraction.highlights.map((highlight, i) => (
                      <Badge
                        key={i}
                        size="sm"
                        variant="outline"
                        style={{
                          borderColor: 'rgba(157, 78, 221, 0.4)',
                          color: '#c0c5ce',
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: '10px'
                        }}
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {!isHovered && (
            <Text size="xs" c="silverGray.6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              悬停查看详情 →
            </Text>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};
