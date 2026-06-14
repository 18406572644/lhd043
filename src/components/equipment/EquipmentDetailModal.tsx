import { Modal, Text, Group, Box, Badge, ScrollArea, Table, Title, Divider } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Equipment } from '../../types';
import { getCategoryLabel, formatCurrency } from '../../utils/calculations';
import { AlertTriangle, BookOpen, Shield, Factory, Award } from 'lucide-react';

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  opened: boolean;
  onClose: () => void;
}

export const EquipmentDetailModal = ({ equipment, opened, onClose }: EquipmentDetailModalProps) => {
  if (!equipment) return null;

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size: number; color: string }>>)[equipment.icon] || Icons.Package;

  const categoryColors: Record<string, string> = {
    suit: '#9d4edd',
    tool: '#00f5d4',
    medical: '#ff006e',
    survival: '#ffbe0b',
    luxury: '#e879f9'
  };

  const color = categoryColors[equipment.category] || '#c0c5ce';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="md" wrap="nowrap">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${color}44, ${color}11)`,
              border: `1px solid ${color}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <IconComponent size={24} color={color} />
          </motion.div>
          <Box>
            <Text fw={700} size="xl" c="white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {equipment.name}
            </Text>
            <Badge
              size="md"
              mt="xs"
              style={{
                backgroundColor: `${color}22`,
                color,
                border: `1px solid ${color}44`
              }}
            >
              {getCategoryLabel(equipment.category)}
            </Badge>
          </Box>
        </Group>
      }
      size="xl"
      radius="lg"
      styles={{
        content: {
          background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.98), rgba(6, 13, 26, 0.98))',
          border: '1px solid rgba(157, 78, 221, 0.3)'
        },
        header: {
          background: 'rgba(10, 22, 40, 0.9)',
          borderBottom: '1px solid rgba(157, 78, 221, 0.2)'
        },
        title: {
          width: '100%'
        },
        close: {
          color: '#c0c5ce',
          '&:hover': {
            background: 'rgba(157, 78, 221, 0.2)'
          }
        }
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={equipment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ScrollArea h={550} type="auto" scrollbarSize={6}>
            <Box p="md">
              <Text size="sm" c="silverGray.3" mb="xl" lineClamp={3}>
                {equipment.description}
              </Text>

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
                  <Text size="xs" c="silverGray.5" mb="xs">价格</Text>
                  <Text fw={700} size="xl" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {formatCurrency(equipment.price)}
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
                  <Text size="xs" c="silverGray.5" mb="xs">重量</Text>
                  <Text fw={700} size="xl" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {equipment.weight} kg
                  </Text>
                </Box>
                {equipment.required && (
                  <Box
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 0, 110, 0.1)',
                      border: '1px solid rgba(255, 0, 110, 0.3)',
                      textAlign: 'center'
                    }}
                  >
                    <Text size="xs" c="silverGray.5" mb="xs">类型</Text>
                    <Text fw={700} size="xl" c="neonPink.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      必需
                    </Text>
                  </Box>
                )}
              </Group>

              <Divider mb="xl" color="rgba(157, 78, 221, 0.2)" />

              <Group gap="sm" mb="md" wrap="nowrap">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield size={20} color="#00f5d4" />
                </motion.div>
                <Title order={5} c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  技术规格
                </Title>
              </Group>

              <Box
                style={{
                  background: 'rgba(10, 22, 40, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 245, 212, 0.2)',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}
              >
                <Table
                  withColumnBorders
                  withRowBorders={false}
                  styles={{
                    table: {
                      borderCollapse: 'collapse'
                    },
                    th: {
                      background: 'rgba(0, 245, 212, 0.1)',
                      color: '#00f5d4',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '12px',
                      padding: '12px 16px'
                    },
                    td: {
                      padding: '12px 16px',
                      color: '#c0c5ce',
                      fontSize: '13px'
                    },
                    tr: {
                      '&:hover': {
                        background: 'rgba(0, 245, 212, 0.05)'
                      }
                    }
                  }}
                >
                  <thead>
                    <tr>
                      <th>参数</th>
                      <th>数值</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.specifications.map((spec, index) => (
                      <motion.tr
                        key={spec.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td style={{ fontWeight: 600 }}>{spec.label}</td>
                        <td>{spec.value}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </Box>

              <Group gap="sm" mb="md" wrap="nowrap">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <BookOpen size={20} color="#9d4edd" />
                </motion.div>
                <Title order={5} c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  使用说明
                </Title>
              </Group>

              <Box
                style={{
                  background: 'rgba(157, 78, 221, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(157, 78, 221, 0.3)',
                  padding: '16px',
                  marginBottom: '24px'
                }}
              >
                {equipment.usageInstructions.split('\n').map((line, index) => (
                  <Group key={index} gap="sm" mb={index < equipment.usageInstructions.split('\n').length - 1 ? 'xs' : 0} wrap="nowrap">
                    <Badge
                      size="sm"
                      style={{
                        background: 'rgba(157, 78, 221, 0.3)',
                        color: '#9d4edd',
                        minWidth: '24px',
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </Badge>
                    <Text size="sm" c="silverGray.3">
                      {line.replace(/^\d+\.\s*/, '')}
                    </Text>
                  </Group>
                ))}
              </Box>

              <Group gap="sm" mb="md" wrap="nowrap">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle size={20} color="#ff006e" />
                </motion.div>
                <Title order={5} c="neonPink.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  注意事项
                </Title>
              </Group>

              <Box
                style={{
                  background: 'rgba(255, 0, 110, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 0, 110, 0.3)',
                  padding: '16px',
                  marginBottom: '24px'
                }}
              >
                {equipment.precautions.map((precaution, index) => (
                  <Group key={index} gap="sm" mb={index < equipment.precautions.length - 1 ? 'xs' : 0} wrap="nowrap" align="flex-start">
                    <AlertTriangle size={14} color="#ff006e" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <Text size="sm" c="silverGray.3">
                      {precaution}
                    </Text>
                  </Group>
                ))}
              </Box>

              <Group grow>
                <Box
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 22, 40, 0.6)',
                    border: '1px solid rgba(157, 78, 221, 0.2)'
                  }}
                >
                  <Group gap="xs" mb="xs" wrap="nowrap">
                    <Factory size={14} color="#9d4edd" />
                    <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      制造商
                    </Text>
                  </Group>
                  <Text size="sm" c="silverGray.3" fw={500}>
                    {equipment.manufacturer}
                  </Text>
                </Box>
                <Box
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 22, 40, 0.6)',
                    border: '1px solid rgba(255, 190, 11, 0.2)'
                  }}
                >
                  <Group gap="xs" mb="xs" wrap="nowrap">
                    <Award size={14} color="#ffbe0b" />
                    <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      保修
                    </Text>
                  </Group>
                  <Text size="sm" c="silverGray.3" fw={500}>
                    {equipment.warranty}
                  </Text>
                </Box>
              </Group>
            </Box>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};
