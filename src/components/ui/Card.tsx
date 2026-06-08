import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../lib/constants';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: string;
  radius?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  onClick?: () => void;
}

const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  md: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
  lg: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)',
};

export default function Card({ children, hover = false, padding = '24px', radius = '16px', shadow = 'md', style, onClick }: CardProps) {
  const cardStyle: React.CSSProperties = {
    background: COLORS.surface,
    borderRadius: radius,
    padding,
    boxShadow: shadows[shadow],
    border: `1px solid ${COLORS.border}`,
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  if (hover) {
    return (
      <motion.div
        style={cardStyle}
        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={cardStyle} onClick={onClick}>
      {children}
    </div>
  );
}
