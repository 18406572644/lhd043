import { Box, Text, Group, ScrollArea, Menu, Button, Modal, TextInput, Stack } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Save, Bookmark, BookmarkCheck, FilterX, Plus } from 'lucide-react';
import { useState } from 'react';
import type { FilterPreset, FilterChip } from './filterTypes';

interface FilterChipsBarProps {
  chips: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  resultCount: number;
  totalCount: number;
  accentColor?: string;
  onSavePreset?: () => void;
  presetCount?: number;
}

export const FilterChipsBar = ({
  chips,
  onRemove,
  onClearAll,
  resultCount,
  totalCount,
  accentColor = '#9d4edd',
  onSavePreset,
  presetCount = 0
}: FilterChipsBarProps) => {
  const matchPercent = totalCount > 0 ? Math.round((resultCount / totalCount) * 100) : 0;

  return (
    <Box mb="md">
      <Group justify="space-between" align="center" mb="sm" wrap="wrap" gap="sm">
        <Group gap="md" align="center">
          <Group gap="xs" align="center">
            <Box
              style={{
                position: 'relative',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `2px solid ${accentColor}33`
                }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `2px solid transparent`,
                  borderTopColor: accentColor,
                  borderRightColor: '#00f5d4'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                key={resultCount}
                initial={{ scale: 1.3, color: '#00f5d4' }}
                animate={{ scale: 1, color: accentColor }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Text
                  fw={800}
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '14px',
                    color: accentColor
                  }}
                >
                  {resultCount}
                </Text>
              </motion.div>
            </Box>
            <Box>
              <Text
                size="xs"
                fw={600}
                style={{ fontFamily: "'Orbitron', sans-serif", color: '#c0c5ce', letterSpacing: '0.5px' }}
              >
                匹配结果
              </Text>
              <Text size="10px" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                共 {totalCount} 项 · 匹配 {matchPercent}%
              </Text>
            </Box>
          </Group>

          <motion.div
            animate={{
              background: `linear-gradient(90deg, ${accentColor}00 0%, ${accentColor}33 ${matchPercent / 2}%, #00f5d455 ${matchPercent}%, ${accentColor}00 ${matchPercent + 10}%)`
            }}
            style={{
              height: '4px',
              width: '120px',
              borderRadius: '2px',
              boxShadow: `0 0 8px ${accentColor}40`
            }}
          />
        </Group>

        <Group gap="xs" align="center">
          {onSavePreset && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="xs"
                variant="outline"
                leftSection={<Save size={12} />}
                onClick={onSavePreset}
                styles={{
                  root: {
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '10px',
                    borderColor: `${accentColor}66`,
                    color: accentColor,
                    background: `${accentColor}11`,
                    '&:hover': {
                      background: `${accentColor}22`,
                      borderColor: accentColor
                    }
                  }
                }}
              >
                保存方案
                {presetCount > 0 && (
                  <Box
                    component="span"
                    style={{
                      marginLeft: '4px',
                      padding: '0 4px',
                      borderRadius: '8px',
                      background: `${accentColor}33`,
                      fontSize: '9px'
                    }}
                  >
                    {presetCount}
                  </Box>
                )}
              </Button>
            </motion.div>
          )}

          {chips.length > 0 && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="xs"
                variant="outline"
                leftSection={<FilterX size={12} />}
                onClick={onClearAll}
                styles={{
                  root: {
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '10px',
                    borderColor: 'rgba(255, 0, 110, 0.4)',
                    color: '#ff006e',
                    background: 'rgba(255, 0, 110, 0.08)',
                    '&:hover': {
                      background: 'rgba(255, 0, 110, 0.15)',
                      borderColor: '#ff006e'
                    }
                  }
                }}
              >
                清除全部
              </Button>
            </motion.div>
          )}
        </Group>
      </Group>

      {chips.length > 0 && (
        <ScrollArea h={48} type="hover" scrollbarSize={4}>
          <Group gap="xs" wrap="nowrap">
            <AnimatePresence mode="popLayout">
              {chips.map((chip) => (
                <motion.div
                  key={chip.id}
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  layout
                >
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '16px',
                      background: `${chip.color}18`,
                      border: `1px solid ${chip.color}55`,
                      whiteSpace: 'nowrap',
                      boxShadow: `0 0 8px ${chip.color}22`
                    }}
                  >
                    <Text
                      size="10px"
                      fw={500}
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: chip.color,
                        opacity: 0.7,
                        letterSpacing: '0.3px'
                      }}
                    >
                      {chip.group}
                    </Text>
                    <Text
                      size="11px"
                      fw={600}
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: chip.color
                      }}
                    >
                      {chip.label}
                    </Text>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(chip.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: chip.color,
                        opacity: 0.6,
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: `${chip.color}33`,
                          opacity: 1
                        }
                      }}
                    >
                      <X size={10} strokeWidth={3} />
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Group>
        </ScrollArea>
      )}
    </Box>
  );
};

interface FilterPresetsPanelProps<T> {
  opened: boolean;
  onClose: () => void;
  presets: FilterPreset<T>[];
  onApply: (preset: FilterPreset<T>) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
  accentColor?: string;
  showSaveOption?: boolean;
}

export function FilterPresetsPanel<T>({
  opened,
  onClose,
  presets,
  onApply,
  onDelete,
  onSave,
  accentColor = '#9d4edd',
  showSaveOption = true
}: FilterPresetsPanelProps<T>) {
  const [newPresetName, setNewPresetName] = useState('');

  const handleSave = () => {
    if (newPresetName.trim()) {
      onSave(newPresetName.trim());
      setNewPresetName('');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Bookmark size={16} color={accentColor} />
          <Text style={{ fontFamily: "'Orbitron', sans-serif", color: '#c0c5ce', fontSize: '14px' }}>
            筛选方案管理
          </Text>
        </Group>
      }
      styles={{
        root: {
          background: 'rgba(8, 18, 34, 0.98)',
          border: `1px solid ${accentColor}44`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 40px ${accentColor}22`
        },
        title: { paddingBottom: '12px' },
        body: { paddingTop: '8px' }
      }}
      size="md"
    >
      {showSaveOption && (
        <Box mb="md" p="sm" style={{ background: 'rgba(10, 22, 40, 0.5)', borderRadius: '8px', border: `1px solid ${accentColor}22` }}>
          <Text size="xs" c="silverGray.4" mb="xs" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            保存当前筛选条件
          </Text>
          <Group gap="xs" grow>
            <TextInput
              placeholder="输入方案名称..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              size="xs"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              styles={{
                input: {
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '11px',
                  background: 'rgba(10, 22, 40, 0.8)',
                  border: `1px solid ${accentColor}44`
                }
              }}
            />
            <Button
              size="xs"
              leftSection={<Plus size={12} />}
              onClick={handleSave}
              disabled={!newPresetName.trim()}
              styles={{
                root: {
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '10px',
                  background: accentColor,
                  '&:hover': { background: accentColor + 'dd' }
                }
              }}
            >
              保存
            </Button>
          </Group>
        </Box>
      )}

      <Box>
        <Text size="xs" c="silverGray.4" mb="sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          已保存方案 ({presets.length})
        </Text>

        {presets.length === 0 ? (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Bookmark size={32} color="#6c757d" strokeWidth={1} />
            <Text size="sm" c="silverGray.5" mt="sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              暂无保存的筛选方案
            </Text>
            <Text size="xs" c="silverGray.6" mt="xs">
              设置好筛选条件后点击保存以便快速复用
            </Text>
          </Box>
        ) : (
          <Stack gap="xs">
            <AnimatePresence mode="popLayout">
              {presets.map((preset) => (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <Group
                    justify="space-between"
                    p="sm"
                    style={{
                      background: 'rgba(10, 22, 40, 0.6)',
                      borderRadius: '8px',
                      border: `1px solid ${accentColor}22`
                    }}
                  >
                    <Group gap="xs">
                      <BookmarkCheck size={14} color={accentColor} />
                      <Box>
                        <Text size="sm" fw={600} style={{ fontFamily: "'Orbitron', sans-serif", color: '#c0c5ce' }}>
                          {preset.name}
                        </Text>
                        <Text size="10px" c="silverGray.6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {new Date(preset.createdAt).toLocaleDateString('zh-CN')}
                        </Text>
                      </Box>
                    </Group>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          onApply(preset);
                          onClose();
                        }}
                        styles={{
                          root: {
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '10px',
                            borderColor: `${accentColor}55`,
                            color: accentColor
                          }
                        }}
                      >
                        应用
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => onDelete(preset.id)}
                        leftSection={<Trash2 size={12} />}
                        styles={{
                          root: {
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '10px',
                            color: '#ff006e',
                            '&:hover': { background: 'rgba(255, 0, 110, 0.15)' }
                          }
                        }}
                      />
                    </Group>
                  </Group>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}

export { Menu };
