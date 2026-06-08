import React from 'react';
import { COLORS } from '../../lib/constants';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  fullPage?: boolean;
  label?: string;
}

export default function LoadingSpinner({ size = 32, color = COLORS.primary, fullPage = false, label = 'Loading...' }: LoadingSpinnerProps) {
  const spinner = (
    <div role="status" aria-label={label} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid ${COLORS.border}`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'wmSpin 0.7s linear infinite',
      }} />
      <style>{`@keyframes wmSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
