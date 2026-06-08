import React from 'react';
import { COLORS } from '../../lib/constants';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'dark';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  primary: { bg: COLORS.primaryLight, color: COLORS.primary },
  success: { bg: '#D1FAE5', color: '#059669' },
  warning: { bg: '#FEF3C7', color: '#D97706' },
  danger: { bg: '#FEE2E2', color: '#DC2626' },
  neutral: { bg: '#F3F4F6', color: COLORS.muted },
  dark: { bg: COLORS.dark, color: '#fff' },
};

export default function Badge({ children, variant = 'primary', size = 'md', dot = false }: BadgeProps) {
  const { bg, color } = variantMap[variant];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: size === 'sm' ? '3px 8px' : '4px 10px',
      borderRadius: '999px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 600,
      background: bg,
      color,
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />}
      {children}
    </span>
  );
}
