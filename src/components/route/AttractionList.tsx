import { Card, Text, Group, Box, SimpleGrid, ScrollArea, Skeleton } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { AttractionCard } from './AttractionCard';
import { staggerContainer } from '../../utils/animations';

export const AttractionList = () => {
  const { attractions, loading, destination } = useTravelStore();

  return (
    <Card p="lg" radius="lg">
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="md">
          <NeonText color="#ffbe0b" size="20px">
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
          ) : attractions.length > 0 ? (
            <motion.div
              key="content"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <ScrollArea h={400} type="auto" scrollbarSize={6}>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {attractions.map((attraction, index) => (
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
                暂无景点数据
              </Text>
            </Box>
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
            <MapPin size={48} color="#ffbe0b" strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            选择目的地后查看景点
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            每个星球都有独特的太空景点等待探索
          </Text>
        </Box>
      )}
    </Card>
  );
};
