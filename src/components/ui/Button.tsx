import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../lib/constants';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: COLORS.primary, color: '#fff', border: 'none' },
  secondary: { background: COLORS.dark, color: '#fff', border: 'none' },
  outline: { background: 'transparent', color: COLORS.primary, border: `2px solid ${COLORS.primary}` },
  ghost: { background: 'transparent', color: COLORS.darkMuted, border: `1.5px solid ${COLORS.border}` },
  danger: { background: COLORS.danger, color: '#fff', border: 'none' },
  success: { background: COLORS.success, color: '#fff', border: 'none' },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '7px 16px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '10px 22px', fontSize: '15px', borderRadius: '10px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '12px' },
  xl: { padding: '18px 36px', fontSize: '18px', borderRadius: '14px' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : undefined,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, filter: 'brightness(1.05)' } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      style={baseStyle}
      disabled={disabled || loading}
      {...(props as never)}
    >
      {loading && (
        <span style={{ width: 16, height: 16, border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.button>
  );
}
