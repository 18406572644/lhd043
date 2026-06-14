import { Modal, Text, Group, Box, Badge, ScrollArea, Image, Title, Divider } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Attraction } from '../../types';
import { formatCurrency } from '../../utils/calculations';
import { Clock, Calendar, Star, MapPin, Sparkles } from 'lucide-react';

interface AttractionDetailModalProps {
  attraction: Attraction | null;
  opened: boolean;
  onClose: () => void;
}

export const AttractionDetailModal = ({ attraction, opened, onClose }: AttractionDetailModalProps) => {
  if (!attraction) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="md" wrap="nowrap">
          <Box
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255, 190, 11, 0.3), rgba(255, 190, 11, 0.1))',
              border: '1px solid rgba(255, 190, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <MapPin size={24} color="#ffbe0b" />
          </Box>
          <Box>
            <Text fw={700} size="xl" c="white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {attraction.name}
            </Text>
            <Badge
              size="md"
              mt="xs"
              style={{
                backgroundColor: 'rgba(255, 190, 11, 0.2)',
                color: '#ffbe0b',
                border: '1px solid rgba(255, 190, 11, 0.4)'
              }}
            >
              景点
            </Badge>
          </Box>
        </Group>
      }
      size="xl"
      radius="lg"
      styles={{
        content: {
          background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.98), rgba(6, 13, 26, 0.98))',
          border: '1px solid rgba(255, 190, 11, 0.3)'
        },
        header: {
          background: 'rgba(10, 22, 40, 0.9)',
          borderBottom: '1px solid rgba(255, 190, 11, 0.2)'
        },
        title: {
          width: '100%'
        },
        close: {
          color: '#c0c5ce',
          '&:hover': {
            background: 'rgba(255, 190, 11, 0.2)'
          }
        }
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={attraction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ScrollArea h={550} type="auto" scrollbarSize={6}>
            <Box p="md">
              <Box
                style={{
                  position: 'relative',
                  height: '250px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 190, 11, 0.3)'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    height={250}
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
                    background: 'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(10, 22, 40, 0.9) 100%)'
                  }}
                />
              </Box>

              <Group grow mb="xl">
                <Box
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(0, 245, 212, 0.1)',
                    border: '1px solid rgba(0, 245, 212, 0.3)',
                    textAlign: 'center'
                  }}
                >
                  <Group gap="xs" justify="center" mb="xs" wrap="nowrap">
                    <Clock size={14} color="#00f5d4" />
                    <Text size="xs" c="silverGray.5">游览时长</Text>
                  </Group>
                  <Text fw={700} size="xl" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {attraction.duration} 小时
                  </Text>
                </Box>
                <Box
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(157, 78, 221, 0.1)',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                    textAlign: 'center'
                  }}
                >
                  <Group gap="xs" justify="center" mb="xs" wrap="nowrap">
                    <Calendar size={14} color="#9d4edd" />
                    <Text size="xs" c="silverGray.5">最佳时节</Text>
                  </Group>
                  <Text fw={700} size="md" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {attraction.bestTime}
                  </Text>
                </Box>
                <Box
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 190, 11, 0.1)',
                    border: '1px solid rgba(255, 190, 11, 0.3)',
                    textAlign: 'center'
                  }}
                >
                  <Group gap="xs" justify="center" mb="xs" wrap="nowrap">
                    <Star size={14} color="#ffbe0b" />
                    <Text size="xs" c="silverGray.5">门票价格</Text>
                  </Group>
                  <Text fw={700} size="xl" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {formatCurrency(300)}/人
                  </Text>
                </Box>
              </Group>

              <Divider mb="xl" color="rgba(255, 190, 11, 0.2)" />

              <Group gap="sm" mb="md" wrap="nowrap">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={20} color="#ffbe0b" />
                </motion.div>
                <Title order={5} c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  景点简介
                </Title>
              </Group>

              <Text size="sm" c="silverGray.3" mb="xl" lineClamp={5}>
                {attraction.description}
              </Text>

              <Group gap="sm" mb="md" wrap="nowrap">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star size={20} color="#00f5d4" />
                </motion.div>
                <Title order={5} c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  景点亮点
                </Title>
              </Group>

              <Box
                style={{
                  background: 'rgba(0, 245, 212, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 245, 212, 0.3)',
                  padding: '16px'
                }}
              >
                <Group gap="xs" wrap="wrap">
                  {attraction.highlights.map((highlight, index) => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Badge
                        size="md"
                        style={{
                          background: 'rgba(0, 245, 212, 0.2)',
                          color: '#00f5d4',
                          border: '1px solid rgba(0, 245, 212, 0.4)',
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: '12px',
                          padding: '6px 12px'
                        }}
                      >
                        ✨ {highlight}
                      </Badge>
                    </motion.div>
                  ))}
                </Group>
              </Box>
            </Box>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};
