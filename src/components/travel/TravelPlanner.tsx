import { Card, Text, Group, Slider, NumberInput, Box, Grid, RingProgress } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Rocket, MapPin } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { formatDistance } from '../../utils/calculations';
import dayjs from 'dayjs';

export const TravelPlanner = () => {
  const { destination, durationDays, travelers, startDate, setDuration, setTravelers, setStartDate } = useTravelStore();

  return (
    <Card p="lg" radius="lg">
      <Group mb="lg" gap="md">
        <NeonText color="#00f5d4" size="20px">
          旅行参数配置
        </NeonText>
        <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          TRAVEL PARAMETERS
        </Text>
      </Group>

      {destination ? (
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card 
              p="md" 
              radius="md"
              style={{ 
                background: `linear-gradient(135deg, ${destination.color}22, transparent)`,
                border: `1px solid ${destination.color}44`
              }}
            >
              <Group gap="sm" mb="sm">
                <MapPin size={18} color={destination.color} />
                <Text fw={600} style={{ color: destination.color, fontFamily: "'Orbitron', sans-serif" }}>
                  目的地信息
                </Text>
              </Group>
              <Text size="lg" fw={700} c="white" mb="xs">
                {destination.name} ({destination.nameEn})
              </Text>
              <Group gap="xl" mt="md">
                <Box>
                  <Text size="xs" c="silverGray.5">距离</Text>
                  <Text fw={600} c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {formatDistance(destination.distance)}
                  </Text>
                </Box>
                <Box>
                  <Text size="xs" c="silverGray.5">重力</Text>
                  <Text fw={600} c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {destination.gravity}G
                  </Text>
                </Box>
                <Box>
                  <Text size="xs" c="silverGray.5">温度</Text>
                  <Text fw={600} c="neonPink.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {destination.temperature}
                  </Text>
                </Box>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box>
              <Group justify="space-between" mb="xs">
                <Group gap="sm">
                  <Clock size={16} color="#9d4edd" />
                  <Text fw={600} c="silverGray.3">旅行时长</Text>
                </Group>
                <Text fw={700} size="xl" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {durationDays} 天
                </Text>
              </Group>
              <Slider
                value={durationDays}
                onChange={setDuration}
                min={1}
                max={365}
                step={1}
                marks={[
                  { value: 7, label: '7天' },
                  { value: 30, label: '30天' },
                  { value: 90, label: '90天' },
                  { value: 180, label: '180天' },
                  { value: 365, label: '365天' }
                ]}
                mb="lg"
              />
            </Box>

            <Box>
              <Group justify="space-between" mb="xs">
                <Group gap="sm">
                  <Users size={16} color="#00f5d4" />
                  <Text fw={600} c="silverGray.3">同行人数</Text>
                </Group>
                <Text fw={700} size="xl" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {travelers} 人
                </Text>
              </Group>
              <NumberInput
                value={travelers}
                onChange={(val) => setTravelers(val as number)}
                min={1}
                max={100}
                step={1}
                styles={{
                  input: {
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }
                }}
              />
            </Box>
          </Grid.Col>

          <Grid.Col span={12}>
            <Group grow>
              <Box>
                <Group gap="sm" mb="sm">
                  <Calendar size={16} color="#ffbe0b" />
                  <Text fw={600} c="silverGray.3">出发日期</Text>
                </Group>
                <DateInput
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="选择出发日期"
                  minDate={new Date()}
                  valueFormat="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              </Box>
              <Box>
                <Group gap="sm" mb="sm">
                  <Rocket size={16} color="#ff006e" />
                  <Text fw={600} c="silverGray.3">预计返回</Text>
                </Group>
                <Box
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(157, 78, 221, 0.1)',
                    border: '1px solid rgba(157, 78, 221, 0.3)'
                  }}
                >
                  <Text fw={700} c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {startDate ? dayjs(startDate).add(durationDays, 'day').format('YYYY-MM-DD') : '请选择出发日期'}
                  </Text>
                </Box>
              </Box>
              <Box>
                <Group gap="sm" mb="sm">
                  <Clock size={16} color="#9d4edd" />
                  <Text fw={600} c="silverGray.3">任务进度</Text>
                </Group>
                <Group gap="md" align="center">
                  <RingProgress
                    size={50}
                    thickness={4}
                    roundCaps
                    sections={[{ value: destination ? 100 : 0, color: '#9d4edd' }]}
                    label={
                      <Text size="xs" fw={700} c="neonPurple.5" ta="center">
                        {destination ? '100%' : '0%'}
                      </Text>
                    }
                  />
                  <Box>
                    <Text size="xs" c="silverGray.5">航线已锁定</Text>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Text size="xs" fw={600} c="neonCyan.5">
                        ● 导航系统在线
                      </Text>
                    </motion.div>
                  </Box>
                </Group>
              </Box>
            </Group>
          </Grid.Col>
        </Grid>
      ) : (
        <Box style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin size={48} color="#9d4edd" strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            请先选择目的地星球
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            从上方星球列表中选择您的旅行目的地
          </Text>
        </Box>
      )}
    </Card>
  );
};
