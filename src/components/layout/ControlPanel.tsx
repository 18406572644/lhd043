import { Box, Grid, Tabs, ScrollArea } from '@mantine/core';
import { motion } from 'framer-motion';
import { Globe, CalendarCheck, Package, Shield, Map, Ticket, Wallet, BookOpen, Radio } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { DashboardHeader } from './DashboardHeader';
import { PlanetSelector } from '../planet/PlanetSelector';
import { TravelPlanner } from '../travel/TravelPlanner';
import { SupplyList } from '../travel/SupplyList';
import { EquipmentList } from '../equipment/EquipmentList';
import { RouteMap } from '../route/RouteMap';
import { AttractionList } from '../route/AttractionList';
import { BudgetCalculator } from '../travel/BudgetCalculator';
import { DiaryManager } from '../diary/DiaryManager';
import { CommConsole } from '../comm/CommConsole';

export const ControlPanel = () => {
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <StatusBar />
      <DashboardHeader />

      <Box style={{ flex: 1, padding: '20px' }}>
        <Tabs
          defaultValue="planets"
          orientation="vertical"
          styles={{
            root: {
              display: 'flex',
              gap: '20px',
              height: '100%'
            },
            list: {
              width: '80px',
              padding: '12px',
              background: 'rgba(10, 22, 40, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(157, 78, 221, 0.3)',
              backdropFilter: 'blur(10px)',
              gap: '8px'
            },
            tab: {
              width: '100%',
              height: '60px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: '#c0c5ce',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '10px',
              transition: 'all 0.3s ease'
            },
            panel: {
              flex: 1,
              padding: 0,
              height: 'calc(100vh - 200px)',
              overflow: 'hidden'
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="planets" leftSection={<Globe size={20} />}>
              星球
            </Tabs.Tab>
            <Tabs.Tab value="planner" leftSection={<CalendarCheck size={20} />}>
              规划
            </Tabs.Tab>
            <Tabs.Tab value="supplies" leftSection={<Package size={20} />}>
              物资
            </Tabs.Tab>
            <Tabs.Tab value="equipment" leftSection={<Shield size={20} />}>
              装备
            </Tabs.Tab>
            <Tabs.Tab value="route" leftSection={<Map size={20} />}>
              航线
            </Tabs.Tab>
            <Tabs.Tab value="attractions" leftSection={<Ticket size={20} />}>
              景点
            </Tabs.Tab>
            <Tabs.Tab value="budget" leftSection={<Wallet size={20} />}>
              预算
            </Tabs.Tab>
            <Tabs.Tab value="diary" leftSection={<BookOpen size={20} />}>
              日志
            </Tabs.Tab>
            <Tabs.Tab value="comm" leftSection={<Radio size={20} />}>
              通讯
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="planets">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PlanetSelector />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="planner">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <TravelPlanner />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="supplies">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <SupplyList />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="equipment">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <EquipmentList />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="route">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <RouteMap />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="attractions">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <AttractionList />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="budget">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <BudgetCalculator />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="diary">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
              >
                <DiaryManager />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="comm">
            <ScrollArea h="100%" type="auto" scrollbarSize={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CommConsole />
              </motion.div>
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};
