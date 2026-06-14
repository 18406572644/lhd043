import { Box, Text, Group, Collapse, ScrollArea } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal, Gauge } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
  badge?: string | number;
}

export const FilterSection = ({
  title,
  icon,
  children,
  defaultOpen = true,
  accentColor = '#9d4edd',
  badge
}: FilterSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box
      mb="md"
      style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.8) 0%, rgba(6, 13, 26, 0.9) 100%)',
        border: `1px solid ${accentColor}22`,
        overflow: 'hidden',
        boxShadow: `inset 0 1px 0 ${accentColor}11`
      }}
    >
      <motion.div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          cursor: 'pointer',
          background: open ? `linear-gradient(90deg, ${accentColor}11 0%, transparent 100%)` : 'transparent',
          borderBottom: open ? `1px solid ${accentColor}22` : 'none'
        }}
        whileHover={{ background: `linear-gradient(90deg, ${accentColor}18 0%, transparent 100%)` }}
      >
        <Group gap="xs" align="center">
          <motion.div
            animate={{ rotate: open ? 360 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ color: accentColor }}
          >
            {icon || <Gauge size={14} />}
          </motion.div>
          <Text
            size="xs"
            fw={700}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: open ? accentColor : '#c0c5ce',
              letterSpacing: '0.8px',
              textTransform: 'uppercase'
            }}
          >
            {title}
          </Text>
          {badge !== undefined && (
            <Box
              style={{
                padding: '1px 7px',
                borderRadius: '10px',
                background: `${accentColor}25`,
                border: `1px solid ${accentColor}55`,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '9px',
                fontWeight: 700,
                color: accentColor
              }}
            >
              {badge}
            </Box>
          )}
        </Group>
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }} style={{ color: '#6c757d' }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>

      <Collapse in={open}>
        <Box p="md">
          <AnimatePresence mode="wait">
            <motion.div
              key={open ? 'open' : 'closed'}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Collapse>
    </Box>
  );
};

interface FilterDashboardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
  width?: number | string;
  maxHeight?: number;
  collapsible?: boolean;
}

export const FilterDashboard = ({
  title = '筛选控制中心',
  subtitle = 'FILTER CONTROL CENTER',
  children,
  accentColor = '#9d4edd',
  width = 340,
  maxHeight,
  collapsible = true
}: FilterDashboardProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const content = (
    <Box
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, rgba(8, 18, 34, 0.95) 0%, rgba(4, 9, 18, 0.98) 100%)',
        borderRadius: '16px',
        border: `1px solid ${accentColor}33`,
        boxShadow: `
          0 0 30px ${accentColor}15,
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, #00f5d4, ${accentColor}, transparent)`,
          boxShadow: `0 0 10px ${accentColor}88, 0 0 20px #00f5d444`
        }}
      />

      <Box
        style={{
          padding: '14px 18px',
          borderBottom: `1px solid ${accentColor}22`,
          background: `linear-gradient(135deg, ${accentColor}14 0%, transparent 50%)`
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="sm" align="center">
            <Box
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ color: accentColor, opacity: 0.8 }}
              >
                <SlidersHorizontal size={18} />
              </motion.div>
            </Box>
            <Box>
              <Text
                fw={700}
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '13px',
                  color: accentColor,
                  letterSpacing: '1px',
                  lineHeight: 1.2
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  size="10px"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#6c757d',
                    letterSpacing: '1.5px',
                    marginTop: '2px'
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </Box>
          </Group>

          {collapsible && (
            <motion.div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#6c757d',
                border: '1px solid rgba(157, 78, 221, 0.2)'
              }}
              whileHover={{ color: accentColor, borderColor: accentColor + '66' }}
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </motion.div>
          )}
        </Group>
      </Box>

      <Collapse in={!collapsed}>
        <Box style={{ maxHeight: maxHeight ? maxHeight - 70 : undefined }}>
          <ScrollArea type="auto" scrollbarSize={4} offsetScrollbars>
            <Box p="md" style={{ paddingBottom: '4px' }}>
              {children}
            </Box>
          </ScrollArea>
        </Box>
      </Collapse>

      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, #00f5d444, ${accentColor}44, transparent)`
        }}
      />
    </Box>
  );

  if (width === 'auto' || !width) return content;

  return <Box style={{ width, minWidth: width, flexShrink: 0 }}>{content}</Box>;
};
