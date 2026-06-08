import React, { useState } from 'react';
import { COLORS } from '../../lib/constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

const fieldBase: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '15px',
  borderRadius: '12px',
  border: `1.5px solid ${COLORS.border}`,
  background: '#fff',
  color: COLORS.dark,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export function Input({ label, error, hint, leftIcon, rightIcon, fullWidth = true, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted, pointerEvents: 'none', display: 'flex' }}>
            {leftIcon}
          </span>
        )}
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            ...fieldBase,
            paddingLeft: leftIcon ? '42px' : '16px',
            paddingRight: rightIcon ? '42px' : '16px',
            borderColor: error ? COLORS.danger : focused ? COLORS.primary : COLORS.border,
            boxShadow: focused ? `0 0 0 3px ${error ? '#FF3B3020' : '#007AFF20'}` : 'none',
            ...style,
          }}
        />
        {rightIcon && (
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted, display: 'flex' }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p style={{ color: COLORS.danger, fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>{error}</p>}
      {hint && !error && <p style={{ color: COLORS.muted, fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, fullWidth = true, style, ...props }: TextareaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={{
          ...fieldBase,
          resize: 'vertical',
          minHeight: '120px',
          borderColor: error ? COLORS.danger : focused ? COLORS.primary : COLORS.border,
          boxShadow: focused ? `0 0 0 3px ${error ? '#FF3B3020' : '#007AFF20'}` : 'none',
          ...style,
        }}
      />
      {error && <p style={{ color: COLORS.danger, fontSize: '13px', margin: '4px 0 0' }}>{error}</p>}
      {hint && !error && <p style={{ color: COLORS.muted, fontSize: '13px', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}

export function Select({ label, error, hint, fullWidth = true, options, style, ...props }: SelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>
          {label}
        </label>
      )}
      <select
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={{
          ...fieldBase,
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '40px',
          borderColor: error ? COLORS.danger : focused ? COLORS.primary : COLORS.border,
          boxShadow: focused ? `0 0 0 3px ${error ? '#FF3B3020' : '#007AFF20'}` : 'none',
          ...style,
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p style={{ color: COLORS.danger, fontSize: '13px', margin: '4px 0 0' }}>{error}</p>}
      {hint && !error && <p style={{ color: COLORS.muted, fontSize: '13px', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}
