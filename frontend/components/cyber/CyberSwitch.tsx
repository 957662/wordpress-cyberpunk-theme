'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'orange';
  label?: string;
  description?: string;
  id?: string;
  name?: string;
  className?: string;
}

const sizeClasses = {
  sm: {
    track: 'w-10 h-5',
    thumb: 'w-3.5 h-3.5',
    text: 'text-sm'
  },
  md: {
    track: 'w-12 h-6',
    thumb: 'w-4 h-4',
    text: 'text-base'
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-5 h-5',
    text: 'text-lg'
  }
};

const colorClasses = {
  cyan: {
    checked: 'bg-cyan-500',
    glow: 'shadow-cyan-500/50'
  },
  purple: {
    checked: 'bg-purple-500',
    glow: 'shadow-purple-500/50'
  },
  pink: {
    checked: 'bg-pink-500',
    glow: 'shadow-pink-500/50'
  },
  green: {
    checked: 'bg-green-500',
    glow: 'shadow-green-500/50'
  },
  yellow: {
    checked: 'bg-yellow-500',
    glow: 'shadow-yellow-500/50'
  },
  orange: {
    checked: 'bg-orange-500',
    glow: 'shadow-orange-500/50'
  }
};

export const CyberSwitch: React.FC<CyberSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  color = 'cyan',
  label,
  description,
  id,
  name,
  className
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  // 处理切换
  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newChecked = !checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  }, [checked, disabled, isControlled, onChange]);

  // 生成唯一 ID
  const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {/* 开关 */}
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        id={switchId}
        name={name}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative rounded-full border-2 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          sizeClass.track,
          checked ? colorClass.checked : 'bg-gray-700 border-gray-600',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {/* 滑块 */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg',
            sizeClass.thumb,
            checked && colorClass.glow
          )}
          initial={false}
          animate={{
            left: checked ? 'calc(100% - 4px)' : '4px',
            boxShadow: checked ? `0 0 12px ${color === 'cyan' ? '#06b6d4' : color === 'purple' ? '#a855f7' : '#ec4899'}` : 'none'
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
        />

        {/* 光效 */}
        {checked && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full opacity-50 blur-md',
              colorClass.checked
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* 标签和描述 */}
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'font-medium text-white cursor-pointer',
                sizeClass.text,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CyberSwitch;
