/**
 * Switch 组件
 * 开关切换组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'cyber' | 'neon';
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  size = 'md',
  variant = 'cyber',
  className = '',
  id,
}) => {
  const handleChange = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  // 尺寸配置
  const sizeStyles = {
    sm: {
      width: '36px',
      height: '20px',
      thumb: 'w-3 h-3',
      thumbTranslate: 'translateX(16px)',
    },
    md: {
      width: '44px',
      height: '24px',
      thumb: 'w-4 h-4',
      thumbTranslate: 'translateX(20px)',
    },
    lg: {
      width: '56px',
      height: '32px',
      thumb: 'w-5 h-5',
      thumbTranslate: 'translateX(24px)',
    },
  };

  // 变体配置
  const variantStyles = {
    default: {
      checkedBg: 'bg-green-500',
      uncheckedBg: 'bg-gray-700',
      thumb: 'bg-white',
    },
    cyber: {
      checkedBg: 'bg-cyber-cyan',
      uncheckedBg: 'bg-gray-700',
      thumb: 'bg-white',
    },
    neon: {
      checkedBg: 'bg-cyber-purple',
      uncheckedBg: 'bg-gray-700',
      thumb: 'bg-white',
    },
  };

  const styles = sizeStyles[size];
  const colors = variantStyles[variant];

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleChange}
      disabled={disabled}
      className={`
        relative inline-flex flex-shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
        disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? colors.checkedBg : colors.uncheckedBg}
        ${styles.width} ${styles.height}
        ${className}
      `}
    >
      <motion.span
        animate={{
          x: checked ? parseFloat(styles.thumbTranslate.replace('translateX(', '').replace('px)', '')) : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className={`
          pointer-events-none inline-block rounded-full shadow-lg
          ${styles.thumb} ${colors.thumb}
          absolute top-1/2 -translate-y-1/2 left-0
        `}
      />
    </button>
  );
};

export default Switch;
