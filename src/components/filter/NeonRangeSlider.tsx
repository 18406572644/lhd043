import { Box, Text, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { RangeFilterValue } from './filterTypes';

interface NeonRangeSliderProps {
  label: string;
  icon?: React.ReactNode;
  value: RangeFilterValue;
  min: number;
  max: number;
  step?: number;
  onChange: (value: RangeFilterValue) => void;
  formatMin?: (v: number) => string;
  formatMax?: (v: number) => string;
  accentColor?: string;
  glowColor?: string;
  unit?: string;
  decimals?: number;
}

export const NeonRangeSlider = ({
  label,
  icon,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatMin,
  formatMax,
  accentColor = '#9d4edd',
  glowColor = 'rgba(157, 78, 221, 0.6)',
  unit,
  decimals = 0
}: NeonRangeSliderProps) => {
  const formatVal = (v: number) => {
    if (decimals > 0) return v.toFixed(decimals);
    return Math.round(v).toString();
  };

  const displayMin = formatMin ? formatMin(value.min) : (unit ? `${formatVal(value.min)}${unit}` : formatVal(value.min));
  const displayMax = formatMax ? formatMax(value.max) : (unit ? `${formatVal(value.max)}${unit}` : formatVal(value.max));

  const percentMin = ((value.min - min) / (max - min)) * 100;
  const percentMax = ((value.max - min) / (max - min)) * 100;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const clickedValue = min + (percent / 100) * (max - min);

    const distToMin = Math.abs(clickedValue - value.min);
    const distToMax = Math.abs(clickedValue - value.max);

    if (distToMin < distToMax) {
      const newMin = Math.min(clickedValue, value.max - step);
      onChange({ ...value, min: Math.max(min, newMin) });
    } else {
      const newMax = Math.max(clickedValue, value.min + step);
      onChange({ ...value, max: Math.min(max, newMax) });
    }
  };

  const handleMinThumbDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startMin = value.min;
    const trackWidth = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width || 300;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const delta = ((currentX - startX) / trackWidth) * (max - min);
      const newMin = Math.min(startMin + delta, value.max - step);
      onChange({ ...value, min: Math.max(min, Math.round(newMin / step) * step) });
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);
  };

  const handleMaxThumbDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startMax = value.max;
    const trackWidth = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width || 300;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const delta = ((currentX - startX) / trackWidth) * (max - min);
      const newMax = Math.max(startMax + delta, value.min + step);
      onChange({ ...value, max: Math.min(max, Math.round(newMax / step) * step) });
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);
  };

  return (
    <Box mb="lg">
      <Group justify="space-between" mb="xs" align="center">
        <Group gap="xs" align="center">
          {icon && <Box style={{ color: accentColor }}>{icon}</Box>}
          <Text
            size="xs"
            fw={600}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: '#c0c5ce',
              letterSpacing: '0.5px'
            }}
          >
            {label}
          </Text>
        </Group>
        <Group gap="xs">
          <Box
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '10px',
              color: accentColor
            }}
          >
            {displayMin}
          </Box>
          <Text size="xs" c="silverGray.5">—</Text>
          <Box
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '10px',
              color: accentColor
            }}
          >
            {displayMax}
          </Box>
        </Group>
      </Group>

      <Box
        style={{
          position: 'relative',
          height: '28px',
          padding: '0 8px',
          cursor: 'pointer'
        }}
        onClick={handleTrackClick}
      >
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '8px',
            right: '8px',
            height: '4px',
            transform: 'translateY(-50%)',
            background: 'rgba(192, 197, 206, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              borderRadius: '2px',
              background: `linear-gradient(90deg, ${accentColor}, #00f5d4)`,
              boxShadow: `0 0 12px ${glowColor}, 0 0 24px ${glowColor}40`
            }}
            animate={{
              left: `${percentMin}%`,
              width: `${percentMax - percentMin}%`
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </Box>

        <motion.div
          onMouseDown={handleMinThumbDrag}
          onTouchStart={handleMinThumbDrag}
          style={{
            position: 'absolute',
            top: '50%',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: accentColor,
            border: '2px solid #00f5d4',
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
            boxShadow: `0 0 12px ${glowColor}, 0 0 24px ${glowColor}60`,
            zIndex: 2
          }}
          animate={{ left: `calc(${percentMin}% + 8px * (1 - ${percentMin / 100}))` }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
        />

        <motion.div
          onMouseDown={handleMaxThumbDrag}
          onTouchStart={handleMaxThumbDrag}
          style={{
            position: 'absolute',
            top: '50%',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#00f5d4',
            border: `2px solid ${accentColor}`,
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
            boxShadow: `0 0 12px rgba(0, 245, 212, 0.6), 0 0 24px rgba(0, 245, 212, 0.3)`,
            zIndex: 2
          }}
          animate={{ left: `calc(${percentMax}% + 8px * (1 - ${percentMax / 100}))` }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          whileHover={{ scale: 1.2 }}
        />

        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: '8px',
            right: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            opacity: 0.4
          }}
        >
          <Text size="9px" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {formatMin ? formatMin(min) : (unit ? `${min}${unit}` : min)}
          </Text>
          <Text size="9px" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {formatMax ? formatMax(max) : (unit ? `${max}${unit}` : max)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
