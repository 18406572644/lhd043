import { Card, Text, Group, Box, Progress, ScrollArea, Button, Divider } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plane, Home, Shirt, Utensils, Ticket, Shield, AlertCircle, TrendingUp } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { formatCurrency } from '../../utils/calculations';
import { useState, useEffect } from 'react';

interface BudgetItemProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  percentage: number;
}

const AnimatedNumber = ({ value, color }: { value: number; color: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Text fw={700} size="lg" style={{ color, fontFamily: "'Orbitron', sans-serif" }}>
      {formatCurrency(Math.round(displayValue))}
    </Text>
  );
};

const BudgetItem = ({ icon: Icon, label, value, color, percentage }: BudgetItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Group justify="space-between" mb="xs" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <Box
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={16} color={color} />
        </Box>
        <Text size="sm" c="silverGray.3">
          {label}
        </Text>
      </Group>
      <AnimatedNumber value={value} color={color} />
    </Group>
    <Progress
      value={percentage}
      size="xs"
      radius="xl"
      styles={{
        section: { background: `linear-gradient(90deg, ${color}88, ${color})` },
        root: { background: 'rgba(192, 197, 206, 0.1)' }
      }}
      mb="md"
    />
  </motion.div>
);

export const BudgetCalculator = () => {
  const { totalBudget, destination, durationDays, travelers } = useTravelStore();
  const [showDetails, setShowDetails] = useState(false);

  const budgetItems = [
    { icon: Plane, label: '交通费用', value: totalBudget.transportCost, color: '#00f5d4' },
    { icon: Home, label: '住宿费用', value: totalBudget.accommodationCost, color: '#9d4edd' },
    { icon: Shirt, label: '装备费用', value: totalBudget.equipmentCost, color: '#ffbe0b' },
    { icon: Utensils, label: '餐饮费用', value: totalBudget.foodCost, color: '#fb5607' },
    { icon: Ticket, label: '景点门票', value: totalBudget.attractionCost, color: '#e879f9' },
    { icon: Shield, label: '保险费用', value: totalBudget.insuranceCost, color: '#06b6d4' },
    { icon: AlertCircle, label: '紧急备用金', value: totalBudget.emergencyFund, color: '#ff006e' }
  ];

  const maxValue = Math.max(...budgetItems.map(item => item.value), 1);

  return (
    <Card p="lg" radius="lg">
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="md">
          <NeonText color="#ff006e" size="20px">
            预算计算
          </NeonText>
          <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            BUDGET CALCULATOR
          </Text>
        </Group>
        {destination && (
          <Group gap="md">
            <Text size="xs" c="silverGray.5">
              {travelers} 人 · {durationDays} 天
            </Text>
          </Group>
        )}
      </Group>

      {destination ? (
        <>
          <Card
            p="lg"
            radius="md"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(157, 78, 221, 0.1))',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 0, 110, 0.2), transparent)',
                filter: 'blur(20px)'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Box>
                <Text size="sm" c="silverGray.4" mb="xs" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  旅行总预算
                </Text>
                <Group gap="sm" align="center">
                  <TrendingUp size={24} color="#ff006e" />
                  <AnimatedNumber value={totalBudget.total} color="#ff006e" />
                </Group>
                <Text size="xs" c="silverGray.5" mt="xs">
                  人均 {formatCurrency(Math.round(totalBudget.total / travelers))}
                </Text>
              </Box>
              <Box style={{ textAlign: 'right' }}>
                <Text size="xs" c="silverGray.5" mb="xs">
                  基础费用
                </Text>
                <AnimatedNumber value={totalBudget.baseCost} color="#9d4edd" />
                <Group gap="xs" justify="flex-end" mt="xs">
                  <Text size="xs" c="silverGray.6">
                    + 附加费用
                  </Text>
                  <AnimatedNumber 
                    value={totalBudget.total - totalBudget.baseCost} 
                    color="#00f5d4" 
                  />
                </Group>
              </Box>
            </Group>
          </Card>

          <Button
            fullWidth
            variant="outline"
            color="neonPurple"
            onClick={() => setShowDetails(!showDetails)}
            mb="md"
            style={{
              borderColor: 'rgba(157, 78, 221, 0.5)',
              fontFamily: "'Orbitron', sans-serif"
            }}
          >
            {showDetails ? '收起详情' : '查看费用明细'}
          </Button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ScrollArea h={350} type="auto" scrollbarSize={6}>
                  <Box p="xs">
                    <BudgetItem
                      icon={Wallet}
                      label="基础费用"
                      value={totalBudget.baseCost}
                      color="#9d4edd"
                      percentage={(totalBudget.baseCost / maxValue) * 100}
                    />
                    <Divider mb="md" style={{ borderColor: 'rgba(157, 78, 221, 0.2)' }} />
                    
                    {budgetItems.map((item, index) => (
                      <BudgetItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                        percentage={(item.value / maxValue) * 100}
                      />
                    ))}
                  </Box>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {!showDetails && (
            <Group grow>
              {budgetItems.slice(0, 4).map((item, index) => (
                <Card
                  key={index}
                  p="sm"
                  radius="md"
                  style={{
                    background: `${item.color}11`,
                    border: `1px solid ${item.color}33`,
                    textAlign: 'center'
                  }}
                >
                  <item.icon size={16} color={item.color} style={{ marginBottom: '4px' }} />
                  <Text size="xs" c="silverGray.5" lineClamp={1}>
                    {item.label.replace('费用', '')}
                  </Text>
                  <Text fw={700} size="sm" style={{ color: item.color, fontFamily: "'Orbitron', sans-serif" }}>
                    {formatCurrency(item.value)}
                  </Text>
                </Card>
              ))}
            </Group>
          )}
        </>
      ) : (
        <Box style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet size={48} color="#ff006e" strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            选择目的地后计算预算
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            系统将自动计算完整的旅行费用明细
          </Text>
        </Box>
      )}
    </Card>
  );
};
