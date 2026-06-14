import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Group, Box, Select, SimpleGrid, Image, ActionIcon, Tooltip, Badge, Text, Checkbox } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { X, Upload, Camera, MapPin, Star, Sparkles, Check } from 'lucide-react';
import { DiaryEntry, DiaryImage, Planet, Attraction } from '../../types';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';

interface DiaryEditorProps {
  opened: boolean;
  onClose: () => void;
  editingEntry?: DiaryEntry | null;
  planets: Planet[];
  attractions: Attraction[];
}

const mockImagePrompts = [
  'space nebula galaxy stars cosmic colorful vibrant cinematic',
  'alien planet landscape exotic mountains two suns sci-fi',
  'space station interior futuristic window earth view',
  'astronaut floating zero gravity stars background cinematic',
  'mars colony dome city red planet landscape sunset',
  'jupiter great red spot view from spacecraft window',
  'saturn rings close up view from probe cinematic',
  'alien forest bioluminescent plants purple atmosphere'
];

const moodOptions = [
  { value: 'excited', label: '🚀 兴奋', color: '#ffbe0b' },
  { value: 'peaceful', label: '🌙 平静', color: '#00f5d4' },
  { value: 'adventurous', label: '⭐ 冒险', color: '#9d4edd' },
  { value: 'tired', label: '💤 疲惫', color: '#bdc3c7' },
  { value: 'amazed', label: '✨ 惊叹', color: '#ff006e' }
];

const weatherOptions = [
  { value: 'sunny', label: '☀️ 晴朗' },
  { value: 'rainy', label: '🌧️ 下雨' },
  { value: 'windy', label: '💨 大风' },
  { value: 'snowy', label: '❄️ 冰雪' },
  { value: 'stormy', label: '⚡ 风暴' }
];

export const DiaryEditor = ({ opened, onClose, editingEntry, planets, attractions }: DiaryEditorProps) => {
  const { addDiaryEntry, updateDiaryEntry, addCheckIn, removeCheckIn, checkInRecords, isAttractionCheckedIn } = useTravelStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [planetId, setPlanetId] = useState<string | null>(null);
  const [attractionId, setAttractionId] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const [images, setImages] = useState<DiaryImage[]>([]);
  const [selectedCheckIns, setSelectedCheckIns] = useState<string[]>([]);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setDate(new Date(editingEntry.date));
      setPlanetId(editingEntry.planetId || null);
      setAttractionId(editingEntry.attractionId || null);
      setMood(editingEntry.mood || null);
      setWeather(editingEntry.weather || null);
      setImages(editingEntry.images);
      const relatedCheckIns = checkInRecords
        .filter(r => r.diaryEntryId === editingEntry.id)
        .map(r => r.attractionId);
      setSelectedCheckIns(relatedCheckIns);
    } else {
      setTitle('');
      setContent('');
      setDate(new Date());
      setPlanetId(null);
      setAttractionId(null);
      setMood(null);
      setWeather(null);
      setImages([]);
      setSelectedCheckIns([]);
    }
  }, [editingEntry, opened, checkInRecords]);

  const planetOptions = planets.map(p => ({
    value: p.id,
    label: `${p.name} (${p.nameEn})`
  }));

  const filteredAttractions = attractions.filter(a => !planetId || a.planetId === planetId);
  const attractionOptions = filteredAttractions.map(a => ({
    value: a.id,
    label: a.name
  }));

  const handleMockUpload = () => {
    const randomPrompt = mockImagePrompts[Math.floor(Math.random() * mockImagePrompts.length)];
    const encodedPrompt = encodeURIComponent(randomPrompt);
    const imageSize = Math.random() > 0.5 ? 'landscape_16_9' : 'square_hd';
    const newImage: DiaryImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${imageSize}`,
      caption: `星际影像 #${images.length + 1}`,
      uploadedAt: new Date().toISOString()
    };
    setImages(prev => [...prev, newImage]);
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleToggleCheckIn = (attractionIdValue: string) => {
    setSelectedCheckIns(prev => {
      if (prev.includes(attractionIdValue)) {
        return prev.filter(id => id !== attractionIdValue);
      }
      return [...prev, attractionIdValue];
    });
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !date) {
      return;
    }

    const dateStr = date.toISOString().split('T')[0];
    const baseData = {
      title: title.trim(),
      content: content.trim(),
      date: dateStr,
      planetId: planetId || undefined,
      attractionId: attractionId || undefined,
      images,
      mood: (mood as DiaryEntry['mood']) || undefined,
      weather: weather || undefined
    };

    if (editingEntry) {
      updateDiaryEntry(editingEntry.id, baseData);

      const prevCheckIns = checkInRecords.filter(r => r.diaryEntryId === editingEntry.id);
      const prevIds = prevCheckIns.map(r => r.attractionId);

      const toAdd = selectedCheckIns.filter(id => !prevIds.includes(id));
      const toRemove = prevIds.filter(id => !selectedCheckIns.includes(id));

      toAdd.forEach(attrId => {
        const attraction = attractions.find(a => a.id === attrId);
        if (attraction) {
          addCheckIn({
            attractionId: attrId,
            planetId: attraction.planetId,
            notes: `打卡于日志: ${title}`,
            diaryEntryId: editingEntry.id
          });
        }
      });

      toRemove.forEach(attrId => {
        const record = prevCheckIns.find(r => r.attractionId === attrId);
        if (record) {
          removeCheckIn(record.id);
        }
      });
    } else {
      const tempId = `diary-temp-${Date.now()}`;
      addDiaryEntry(baseData);

      setTimeout(() => {
        const state = useTravelStore.getState();
        const newEntry = state.diaryEntries.find(
          e => e.title === baseData.title && e.content === baseData.content
        );
        if (newEntry) {
          selectedCheckIns.forEach(attrId => {
            const attraction = attractions.find(a => a.id === attrId);
            if (attraction) {
              addCheckIn({
                attractionId: attrId,
                planetId: attraction.planetId,
                notes: `打卡于日志: ${title}`,
                diaryEntryId: newEntry.id
              });
            }
          });
        }
      }, 50);
    }

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs" wrap="nowrap">
          <Sparkles size={20} color="#9d4edd" />
          <NeonText color="#9d4edd" size="18px">
            {editingEntry ? '编辑船员日志' : '新增船员日志'}
          </NeonText>
        </Group>
      }
      size="xl"
      radius="lg"
      styles={{
        header: {
          background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(10, 22, 40, 0.95) 100%)',
          borderBottom: '1px solid rgba(157, 78, 221, 0.3)'
        },
        content: {
          background: 'rgba(10, 22, 40, 0.98)',
          border: '1px solid rgba(157, 78, 221, 0.4)'
        },
        body: {
          padding: '20px'
        }
      }}
    >
      <Box>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
          <DatePickerInput
            label="日志日期"
            placeholder="选择日期"
            value={date}
            onChange={setDate}
            required
            leftSection={<Star size={14} />}
          />
          <Select
            label="心情状态"
            placeholder="选择心情"
            value={mood}
            onChange={setMood}
            data={moodOptions}
            leftSection={<Sparkles size={14} />}
          />
        </SimpleGrid>

        <TextInput
          label="日志标题"
          placeholder="给今天的旅程起个标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          mb="md"
          leftSection={<Star size={14} />}
          styles={{
            input: {
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '14px'
            }
          }}
        />

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
          <Select
            label="所在星球"
            placeholder="选择星球"
            value={planetId}
            onChange={(val) => {
              setPlanetId(val);
              if (val) {
                const planet = planets.find(p => p.id === val);
                const planetAttractions = attractions.filter(a => a.planetId === val);
                if (planetAttractions.length > 0 && !attractions.find(a => a.id === attractionId && a.planetId === val)) {
                  setAttractionId(null);
                }
              }
            }}
            data={planetOptions}
            leftSection={<MapPin size={14} />}
            clearable
          />
          <Select
            label="关联景点"
            placeholder="选择景点"
            value={attractionId}
            onChange={setAttractionId}
            data={attractionOptions}
            leftSection={<MapPin size={14} />}
            clearable
            disabled={!planetId}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 1 }} spacing="md" mb="md">
          <Select
            label="天气状况"
            placeholder="选择天气"
            value={weather}
            onChange={setWeather}
            data={weatherOptions}
            clearable
          />
        </SimpleGrid>

        <Textarea
          label="日志内容"
          placeholder="记录今天的旅行见闻...&#10;&#10;可以写下你看到的风景、遇到的趣事、或者对未来的思考..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minRows={6}
          maxRows={12}
          autosize
          mb="md"
          styles={{
            input: {
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '15px',
              lineHeight: 1.8
            }
          }}
        />

        {filteredAttractions.length > 0 && (
          <Box mb="md">
            <Group gap="xs" mb="sm" wrap="nowrap">
              <MapPin size={14} color="#ffbe0b" />
              <Text size="sm" fw={600} c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                景点打卡
              </Text>
              <Badge size="sm" variant="outline" color="energyYellow">
                已选 {selectedCheckIns.length}
              </Badge>
            </Group>
            <Box
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 190, 11, 0.05)',
                border: '1px solid rgba(255, 190, 11, 0.2)',
                maxHeight: '180px',
                overflowY: 'auto'
              }}
            >
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {filteredAttractions.map(attr => {
                  const isChecked = selectedCheckIns.includes(attr.id);
                  const isGlobalCheckedIn = isAttractionCheckedIn(attr.id);
                  return (
                    <Checkbox
                      key={attr.id}
                      label={
                        <Group gap="xs" wrap="nowrap">
                          <Text size="sm" c="silverGray.4">{attr.name}</Text>
                          {isGlobalCheckedIn && !selectedCheckIns.includes(attr.id) && (
                            <Badge size="xs" color="green" variant="dot">
                              已打卡
                            </Badge>
                          )}
                        </Group>
                      }
                      checked={isChecked}
                      onChange={() => handleToggleCheckIn(attr.id)}
                      styles={{
                        input: {
                          borderColor: isChecked ? '#ffbe0b' : undefined,
                          background: isChecked ? 'rgba(255, 190, 11, 0.2)' : undefined
                        },
                        label: {
                          padding: '6px 8px',
                          borderRadius: '6px',
                          width: '100%',
                          background: isChecked ? 'rgba(255, 190, 11, 0.08)' : 'transparent'
                        }
                      }}
                    />
                  );
                })}
              </SimpleGrid>
            </Box>
          </Box>
        )}

        <Box mb="md">
          <Group justify="space-between" mb="sm" wrap="wrap" gap="sm">
            <Group gap="xs" wrap="nowrap">
              <Camera size={14} color="#00f5d4" />
              <Text size="sm" fw={600} c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                影像记录
              </Text>
              <Badge size="sm" variant="outline" color="neonCyan">
                {images.length} 张
              </Badge>
            </Group>

            <Button
              size="sm"
              variant="outline"
              color="neonCyan"
              leftSection={<Upload size={14} />}
              onClick={handleMockUpload}
            >
              模拟上传图片
            </Button>
          </Group>

          {images.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              {images.map(img => (
                <Box
                  key={img.id}
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 245, 212, 0.3)'
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.caption || ''}
                    height={120}
                  />
                  <Tooltip label="移除图片" position="top">
                    <ActionIcon
                      size="sm"
                      color="neonPink"
                      variant="filled"
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px'
                      }}
                      onClick={() => handleRemoveImage(img.id)}
                    >
                      <X size={12} />
                    </ActionIcon>
                  </Tooltip>
                  {img.caption && (
                    <Box
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(10, 22, 40, 0.9)',
                        borderTop: '1px solid rgba(0, 245, 212, 0.2)'
                      }}
                    >
                      <Text size="xs" c="silverGray.5" lineClamp={1}>
                        {img.caption}
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box
              style={{
                padding: '24px',
                borderRadius: '8px',
                border: '2px dashed rgba(0, 245, 212, 0.2)',
                background: 'rgba(0, 245, 212, 0.03)',
                textAlign: 'center'
              }}
            >
              <Camera size={32} color="#00f5d4" strokeWidth={1} style={{ opacity: 0.5 }} />
              <Text size="sm" c="silverGray.6" mt="sm">
                点击上方按钮模拟上传旅行照片
              </Text>
              <Text size="xs" c="silverGray.7" mt="xs">
                系统将生成随机的星际主题图片
              </Text>
            </Box>
          )}
        </Box>

        <Group justify="flex-end" mt="xl" gap="sm">
          <Button variant="outline" color="silverGray" onClick={onClose}>
            取消
          </Button>
          <Button
            color="neonPurple"
            leftSection={<Check size={16} />}
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !date}
          >
            {editingEntry ? '保存修改' : '记录日志'}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
