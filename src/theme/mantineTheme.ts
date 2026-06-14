import { createTheme, MantineColorsTuple } from '@mantine/core';

const neonPurple: MantineColorsTuple = [
  '#f8f0ff',
  '#efe4ff',
  '#dcc5ff',
  '#c5a3ff',
  '#b085ff',
  '#9d4edd',
  '#8b3dd1',
  '#772eb3',
  '#662590',
  '#551e75'
];

const deepBlue: MantineColorsTuple = [
  '#eef3ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc0',
  '#0a1628',
  '#081222',
  '#060d1a',
  '#040912',
  '#02050a'
];

const silverGray: MantineColorsTuple = [
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#c0c5ce',
  '#6c757d',
  '#495057',
  '#343a40',
  '#212529'
];

const neonCyan: MantineColorsTuple = [
  '#e0fffb',
  '#ccfff7',
  '#99ffef',
  '#66ffe7',
  '#33ffdf',
  '#00f5d4',
  '#00d4b8',
  '#00b39c',
  '#009180',
  '#007064'
];

const neonPink: MantineColorsTuple = [
  '#ffe6f0',
  '#ffcce0',
  '#ff99c2',
  '#ff66a3',
  '#ff3385',
  '#ff006e',
  '#e60063',
  '#cc0058',
  '#b3004d',
  '#990042'
];

const energyYellow: MantineColorsTuple = [
  '#fff9e6',
  '#fff3cc',
  '#ffe699',
  '#ffd966',
  '#ffcc33',
  '#ffbe0b',
  '#e6a80a',
  '#cc9308',
  '#b37e07',
  '#996906'
];

export const mantineTheme = createTheme({
  primaryColor: 'neonPurple',
  colors: {
    neonPurple,
    deepBlue,
    silverGray,
    neonCyan,
    neonPink,
    energyYellow
  },
  fontFamily: "'Rajdhani', sans-serif",
  fontFamilyMonospace: "'Orbitron', monospace",
  headings: {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '36px' },
      h2: { fontSize: '28px' },
      h3: { fontSize: '22px' },
      h4: { fontSize: '18px' },
      h5: { fontSize: '16px' },
      h6: { fontSize: '14px' }
    }
  },
  fontSizes: {
    xs: '11px',
    sm: '13px',
    md: '15px',
    lg: '17px',
    xl: '20px'
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 245, 212, 0.1)',
    sm: '0 2px 4px rgba(157, 78, 221, 0.2)',
    md: '0 4px 12px rgba(157, 78, 221, 0.3)',
    lg: '0 8px 24px rgba(157, 78, 221, 0.4)',
    xl: '0 16px 48px rgba(157, 78, 221, 0.5)'
  },
  components: {
    Card: {
      styles: (theme) => ({
        root: {
          backgroundColor: 'rgba(10, 22, 40, 0.85)',
          border: '1px solid rgba(157, 78, 221, 0.3)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(157, 78, 221, 0.6)',
            boxShadow: '0 0 30px rgba(157, 78, 221, 0.3)'
          }
        }
      })
    },
    Button: {
      styles: (theme) => ({
        root: {
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontSize: '13px',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s ease'
          },
          '&:hover::before': {
            left: '100%'
          }
        }
      }),
      defaultProps: {
        variant: 'filled'
      }
    },
    Slider: {
      styles: (theme) => ({
        thumb: {
          backgroundColor: '#9d4edd',
          border: '2px solid #00f5d4',
          boxShadow: '0 0 15px rgba(157, 78, 221, 0.8)'
        },
        track: {
          backgroundColor: 'rgba(192, 197, 206, 0.3)'
        },
        bar: {
          background: 'linear-gradient(90deg, #9d4edd, #00f5d4)'
        }
      })
    },
    Input: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(10, 22, 40, 0.6)',
          border: '1px solid rgba(157, 78, 221, 0.4)',
          color: '#c0c5ce',
          '&:focus': {
            borderColor: '#9d4edd',
            boxShadow: '0 0 15px rgba(157, 78, 221, 0.4)'
          }
        }
      })
    },
    Badge: {
      styles: (theme) => ({
        root: {
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }
      })
    }
  }
});
