import { motion } from 'framer-motion';

export const ScanlineOverlay = () => {
  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 212, 0.02) 2px, rgba(0, 245, 212, 0.02) 4px)'
        }}
      />
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '200px',
          pointerEvents: 'none',
          zIndex: 1001,
          background: 'linear-gradient(180deg, rgba(157, 78, 221, 0.1) 0%, transparent 100%)',
          filter: 'blur(40px)'
        }}
        animate={{
          y: ['-100%', '100vh']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </>
  );
};
