import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: { 
    scale: [1, 1.05, 1], 
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } 
  }
};

export const glow: Variants = {
  hidden: { filter: 'drop-shadow(0 0 0px rgba(157, 78, 221, 0))' },
  visible: { 
    filter: [
      'drop-shadow(0 0 0px rgba(157, 78, 221, 0))',
      'drop-shadow(0 0 20px rgba(157, 78, 221, 0.8))',
      'drop-shadow(0 0 0px rgba(157, 78, 221, 0))'
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const rotate3d: Variants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: { 
    rotateY: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: 'easeOut' } 
  }
};

export const scanline = {
  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 212, 0.03) 2px, rgba(0, 245, 212, 0.03) 4px)'
};
