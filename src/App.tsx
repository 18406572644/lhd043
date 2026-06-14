import { MantineProvider } from '@mantine/core';
import { mantineTheme } from './theme/mantineTheme';
import { StarField } from './components/effects/StarField';
import { ScanlineOverlay } from './components/effects/ScanlineOverlay';
import { ControlPanel } from './components/layout/ControlPanel';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

export default function App() {
  return (
    <MantineProvider theme={mantineTheme}>
      <StarField />
      <ControlPanel />
      <ScanlineOverlay />
    </MantineProvider>
  );
}
