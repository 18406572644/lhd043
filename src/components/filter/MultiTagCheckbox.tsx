import { Box, Text, Group, Tooltip } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface TagOption {
  value: string;
  label: string;
  color?: string;
  description?: string;
}

interface MultiTagCheckboxProps {
  label?: string;
  icon?: React.ReactNode;
  options: TagOption[];
  value: string[];
  onChange: (value: string[]) => void;
  accentColor?: string;
  maxVisible?: number;
}

export const MultiTagCheckbox = ({
  label,
  icon,
  options,
  value,
  onChange,
  accentColor = '#9d4edd',
  maxVisible
}: MultiTagCheckboxProps) => {
  const displayOptions = maxVisible ? options.slice(0, maxVisible) : options;
  const hiddenOptions = maxVisible ? options.slice(maxVisible) : [];

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const renderTag = (option: TagOption) => {
    const isSelected = value.includes(option.value);
    const tagColor = option.color || accentColor;

    return (
      <Tooltip key={option.value} label={option.description} disabled={!option.description} position="top">
        <motion.div
          onClick={() => toggleOption(option.value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '6px',
            background: isSelected ? `${tagColor}25` : 'rgba(10, 22, 40, 0.6)',
            border: `1px solid ${isSelected ? tagColor : 'rgba(157, 78, 221, 0.25)'}`,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.2s ease',
            boxShadow: isSelected ? `0 0 12px ${tagColor}40` : 'none'
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: isSelected ? `0 0 16px ${tagColor}60` : `0 0 8px ${tagColor}20`
          }}
          whileTap={{ scale: 0.97 }}
          layout
        >
          <AnimatePresence mode="wait">
            {isSelected ? (
              <motion.div
                key="selected"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check size={12} color={tagColor} strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="unselected"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  border: `1.5px solid ${tagColor}60`
                }}
              />
            )}
          </AnimatePresence>

          <Text
            size="xs"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: isSelected ? tagColor : '#c0c5ce',
              fontWeight: isSelected ? 600 : 400,
              fontSize: '11px',
              whiteSpace: 'nowrap'
            }}
          >
            {option.label}
          </Text>
        </motion.div>
      </Tooltip>
    );
  };

  return (
    <Box mb="lg">
      {(label || icon) && (
        <Group gap="xs" align="center" mb="sm">
          {icon && <Box style={{ color: accentColor }}>{icon}</Box>}
          {label && (
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
              {value.length > 0 && (
                <Box
                  component="span"
                  style={{
                    marginLeft: '6px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: `${accentColor}33`,
                    color: accentColor,
                    fontSize: '9px',
                    fontWeight: 700
                  }}
                >
                  {value.length}
                </Box>
              )}
            </Text>
          )}
        </Group>
      )}

      <Group gap="xs" wrap="wrap">
        {displayOptions.map(renderTag)}
        {hiddenOptions.length > 0 && (
          <Box
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'rgba(10, 22, 40, 0.4)',
              border: '1px dashed rgba(157, 78, 221, 0.3)'
            }}
          >
            <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px' }}>
              +{hiddenOptions.length} 更多
            </Text>
          </Box>
        )}
      </Group>
    </Box>
  );
};

interface LogicToggleProps {
  value: 'AND' | 'OR';
  onChange: (value: 'AND' | 'OR') => void;
  accentColor?: string;
}

export const LogicToggle = ({ value, onChange, accentColor = '#9d4edd' }: LogicToggleProps) => {
  return (
    <Group gap="xs">
      <Text size="10px" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
        逻辑:
      </Text>
      <Group gap={4} style={{ padding: '2px', borderRadius: '6px', background: 'rgba(10, 22, 40, 0.6)' }}>
        {(['OR', 'AND'] as const).map((logic) => {
          const isActive = value === logic;
          return (
            <motion.div
              key={logic}
              onClick={() => onChange(logic)}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                background: isActive ? accentColor : 'transparent',
                color: isActive ? '#fff' : '#6c757d',
                boxShadow: isActive ? `0 0 10px ${accentColor}60` : 'none'
              }}
              whileHover={{ scale: isActive ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {logic === 'AND' ? '且 ∧' : '或 ∨'}
            </motion.div>
          );
        })}
      </Group>
    </Group>
  );
};

interface ToggleSwitchProps {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor?: string;
}

export const ToggleSwitch = ({ label, icon, checked, onChange, accentColor = '#00f5d4' }: ToggleSwitchProps) => {
  return (
    <motion.div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: checked ? `${accentColor}15` : 'rgba(10, 22, 40, 0.6)',
        border: `1px solid ${checked ? accentColor + '66' : 'rgba(157, 78, 221, 0.2)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && <Box style={{ color: checked ? accentColor : '#6c757d' }}>{icon}</Box>}
      <Text
        size="xs"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: checked ? accentColor : '#c0c5ce',
          fontSize: '11px',
          flex: 1,
          fontWeight: checked ? 600 : 400
        }}
      >
        {label}
      </Text>

      <Box
        style={{
          position: 'relative',
          width: '34px',
          height: '18px',
          borderRadius: '9px',
          background: checked ? accentColor : 'rgba(192, 197, 206, 0.3)',
          transition: 'all 0.3s ease',
          boxShadow: checked ? `0 0 10px ${accentColor}60` : 'none'
        }}
      >
        <motion.div
          animate={{ x: checked ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute',
            top: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        />
      </Box>
    </motion.div>
  );
};
