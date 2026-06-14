import { Card, Text, Group, Box, Badge, Checkbox, Tooltip, ActionIcon } from '@mantine/core';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Equipment } from '../../types';
import { getCategoryLabel, formatCurrency } from '../../utils/calculations';
import { Lock, Star, Info } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  selected: boolean;
  favorite: boolean;
  onToggle: () => void;
  onFavoriteToggle: () => void;
  onViewDetails: () => void;
}

export const EquipmentCard = ({ equipment, selected, favorite, onToggle, onFavoriteToggle, onViewDetails }: EquipmentCardProps) => {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size: number; color: string }>>)[equipment.icon] || Icons.Package;
  
  const categoryColors: Record<string, string> = {
    suit: '#9d4edd',
    tool: '#00f5d4',
    medical: '#ff006e',
    survival: '#ffbe0b',
    luxury: '#e879f9'
  };

  const color = categoryColors[equipment.category] || '#c0c5ce';

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('button')) {
      return;
    }
    onViewDetails();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <Card
        p="md"
        radius="md"
        style={{
          background: selected 
            ? `linear-gradient(135deg, ${color}22, rgba(10, 22, 40, 0.8))`
            : 'rgba(10, 22, 40, 0.6)',
          border: selected 
            ? `2px solid ${color}`
            : '1px solid rgba(157, 78, 221, 0.2)',
          boxShadow: selected 
            ? `0 0 20px ${color}44`
            : 'none',
          transition: 'all 0.3s ease',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {selected && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 50% 0%, ${color}22, transparent 70%)`,
              pointerEvents: 'none'
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <Group justify="space-between" mb="md" wrap="nowrap" align="flex-start">
          <Group gap="sm" wrap="nowrap">
            <motion.div
              animate={selected ? { rotate: [0, 360] } : {}}
              transition={{ duration: 1 }}
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
              <Text fw={700} size="sm" c="white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {equipment.name}
              </Text>
              <Badge
                size="sm"
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

          <Group gap="xs" wrap="nowrap" align="flex-start">
            <Tooltip label={favorite ? '取消收藏' : '收藏装备'} position="top">
              <ActionIcon
                size="md"
                variant="transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                style={{ color: favorite ? '#ffbe0b' : '#6c757d' }}
              >
                <motion.div
                  animate={favorite ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Star size={18} fill={favorite ? '#ffbe0b' : 'none'} />
                </motion.div>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="查看详情" position="top">
              <ActionIcon
                size="md"
                variant="transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                style={{ color: '#9d4edd' }}
              >
                <Info size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={equipment.required ? '必需装备，不可取消' : '点击选择'} position="top">
              <Box style={{ pointerEvents: equipment.required ? 'none' : 'auto' }}>
                <Checkbox
                  checked={selected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  size="lg"
                  color="neonPurple"
                  icon={equipment.required ? Lock : undefined}
                  styles={{
                    input: {
                      borderColor: equipment.required ? '#ff006e' : color,
                      backgroundColor: equipment.required ? 'rgba(255, 0, 110, 0.2)' : undefined
                    }
                  }}
                />
              </Box>
            </Tooltip>
          </Group>
        </Group>

        <Text size="xs" c="silverGray.4" mb="md" lineClamp={2}>
          {equipment.description}
        </Text>

        <Group justify="space-between" wrap="nowrap">
          <Box>
            <Text size="xs" c="silverGray.5">价格</Text>
            <Text fw={700} size="lg" style={{ color, fontFamily: "'Orbitron', sans-serif" }}>
              {formatCurrency(equipment.price)}
            </Text>
          </Box>
          <Box style={{ textAlign: 'right' }}>
            <Text size="xs" c="silverGray.5">重量</Text>
            <Text fw={600} size="sm" c="silverGray.3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {equipment.weight} kg
            </Text>
          </Box>
          <Group gap="xs" wrap="nowrap">
            {favorite && (
              <Badge 
                color="energyYellow" 
                size="sm"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                收藏
              </Badge>
            )}
            {equipment.required && (
              <Badge 
                color="neonPink" 
                size="sm"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                必需
              </Badge>
            )}
          </Group>
        </Group>
      </Card>
    </motion.div>
  );
};
