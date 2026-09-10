import React from 'react';
import { motion } from 'motion/react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Fade-up when scrolled into view
export const Rise: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, y = 24, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-64px' }}
    transition={{ duration: 0.65, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

// Masked line reveal for headlines, plays on mount
export const MaskedLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => (
  <span className={`block overflow-hidden pb-2 -mb-2 ${className || ''}`}>
    <motion.span
      className="block"
      initial={{ y: '112%' }}
      animate={{ y: '0%' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);
