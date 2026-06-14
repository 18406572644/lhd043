import { Card, Text, Group, Box, Badge } from '@mantine/core';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Plane } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { formatDistance } from '../../utils/calculations';
import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export const RouteMap = () => {
  const { destination, attractions } = useTravelStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const animationRef = useRef<number>();
  const progressRef = useRef(0);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !destination) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      progressRef.current += 0.005;
      if (progressRef.current > 1) progressRef.current = 0;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.5 + Math.sin(Date.now() / 1000 + star.x * 10) * 0.5)})`;
        ctx.fill();
      });

      const startX = width * 0.15;
      const startY = height * 0.5;
      const endX = width * 0.85;
      const endY = height * 0.5;

      const path = new Path2D();
      path.moveTo(startX, startY);
      const midX = (startX + endX) / 2;
      const midY = height * 0.2;
      path.quadraticCurveTo(midX, midY, endX, endY);

      ctx.strokeStyle = destination.color + '44';
      ctx.lineWidth = 3;
      ctx.stroke(path);

      const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
      gradient.addColorStop(0, '#00f5d4');
      gradient.addColorStop(0.5, destination.color);
      gradient.addColorStop(1, destination.color);

      const dashOffset = -progressRef.current * 200;
      ctx.setLineDash([10, 10]);
      ctx.lineDashOffset = dashOffset;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke(path);
      ctx.setLineDash([]);

      const progress = progressRef.current;
      const t = progress;
      const shipX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
      const shipY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;

      const glow = ctx.createRadialGradient(shipX, shipY, 0, shipX, shipY, 20);
      glow.addColorStop(0, destination.color);
      glow.addColorStop(0.5, destination.color + '66');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(shipX, shipY, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f5d4';
      ctx.beginPath();
      ctx.arc(shipX, shipY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f5d4';
      ctx.beginPath();
      ctx.arc(startX, startY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a1628';
      ctx.beginPath();
      ctx.arc(startX, startY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = destination.color;
      ctx.beginPath();
      ctx.arc(endX, endY, 15, 0, Math.PI * 2);
      ctx.fill();
      
      const planetGlow = ctx.createRadialGradient(endX, endY, 10, endX, endY, 35);
      planetGlow.addColorStop(0, destination.color + '66');
      planetGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = planetGlow;
      ctx.beginPath();
      ctx.arc(endX, endY, 35, 0, Math.PI * 2);
      ctx.fill();

      if (attractions.length > 0) {
        attractions.forEach((attraction, index) => {
          const attProgress = (index + 1) / (attractions.length + 1);
          const attX = (1 - attProgress) * (1 - attProgress) * startX + 2 * (1 - attProgress) * attProgress * midX + attProgress * attProgress * endX;
          const attY = (1 - attProgress) * (1 - attProgress) * startY + 2 * (1 - attProgress) * attProgress * midY + attProgress * attProgress * endY - 15;

          const pulse = Math.sin(Date.now() / 500 + index) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(255, 190, 11, ${0.3 + pulse * 0.4})`;
          ctx.beginPath();
          ctx.arc(attX, attY, 10 + pulse * 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffbe0b';
          ctx.beginPath();
          ctx.arc(attX, attY, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [destination, stars, attractions]);

  return (
    <Card p="lg" radius="lg">
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="md">
          <NeonText color="#9d4edd" size="20px">
            航线规划
          </NeonText>
          <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            ROUTE NAVIGATION
          </Text>
        </Group>
        {destination && (
          <Group gap="md">
            <Badge 
              variant="dot" 
              color="neonCyan"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <Navigation size={12} style={{ marginRight: '4px' }} />
              导航中
            </Badge>
            <Badge 
              variant="outline" 
              color="neonPurple"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {formatDistance(destination.distance)}
            </Badge>
          </Group>
        )}
      </Group>

      {destination ? (
        <>
          <Box
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(157, 78, 221, 0.3)',
              background: 'linear-gradient(135deg, #0a1628, #060d1a)'
            }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              style={{ width: '100%', height: '200px', display: 'block' }}
            />
            
            <Box
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Box
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#00f5d4',
                  boxShadow: '0 0 10px #00f5d4'
                }}
              />
              <Text size="xs" c="silverGray.3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                地球
              </Text>
            </Box>

            <Box
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Text size="xs" c="silverGray.3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {destination.name}
              </Text>
              <Box
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: destination.color,
                  boxShadow: `0 0 10px ${destination.color}`
                }}
              />
            </Box>
          </Box>

          <Group mt="md" grow>
            <Card 
              p="sm" 
              radius="md"
              style={{
                background: 'rgba(0, 245, 212, 0.1)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                textAlign: 'center'
              }}
            >
              <Group gap="xs" justify="center" mb="xs">
                <Plane size={16} color="#00f5d4" />
                <Text size="xs" c="silverGray.5">预计飞行时间</Text>
              </Group>
              <Text fw={700} size="lg" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {destination.travelDays} 天
              </Text>
            </Card>
            <Card 
              p="sm" 
              radius="md"
              style={{
                background: 'rgba(157, 78, 221, 0.1)',
                border: '1px solid rgba(157, 78, 221, 0.3)',
                textAlign: 'center'
              }}
            >
              <Group gap="xs" justify="center" mb="xs">
                <MapPin size={16} color="#9d4edd" />
                <Text size="xs" c="silverGray.5">途经景点</Text>
              </Group>
              <Text fw={700} size="lg" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {attractions.length} 个
              </Text>
            </Card>
            <Card 
              p="sm" 
              radius="md"
              style={{
                background: 'rgba(255, 190, 11, 0.1)',
                border: '1px solid rgba(255, 190, 11, 0.3)',
                textAlign: 'center'
              }}
            >
              <Group gap="xs" justify="center" mb="xs">
                <Navigation size={16} color="#ffbe0b" />
                <Text size="xs" c="silverGray.5">航线状态</Text>
              </Group>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Text fw={700} size="lg" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  已锁定
                </Text>
              </motion.div>
            </Card>
          </Group>
        </>
      ) : (
        <Box style={{ padding: '40px', textAlign: 'center' }}>
          <motion.div
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 20, repeat: Infinity, ease: 'linear' }
            }}
          >
            <Navigation size={48} color="#9d4edd" strokeWidth={1} />
          </motion.div>
          <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            选择目的地后规划航线
          </Text>
          <Text size="sm" c="silverGray.6" mt="xs">
            系统将自动计算最优航线和途经景点
          </Text>
        </Box>
      )}
    </Card>
  );
};
