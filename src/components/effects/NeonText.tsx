import { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface NeonTextProps {
  children: ReactNode;
  color?: string;
  size?: string;
  className?: string;
  style?: CSSProperties;
}

export const NeonText = ({ children, color = '#9d4edd', size = 'inherit', className = '', style }: NeonTextProps) => {
  return (
    <motion.span
      className={className}
      style={{
        fontSize: size,
        color,
        textShadow: `
          0 0 5px ${color},
          0 0 10px ${color},
          0 0 20px ${color},
          0 0 40px ${color}
        `,
        fontFamily: "'Orbitron', sans-serif",
        letterSpacing: '1px',
        ...style
      }}
      animate={{
        textShadow: [
          `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`,
          `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.span>
  );
};
