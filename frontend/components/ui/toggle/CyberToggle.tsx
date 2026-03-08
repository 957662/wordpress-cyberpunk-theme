/**
 * CyberToggle - 赛博朋克风格切换开关
 * 支持多种颜色主题和尺寸
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeStyles = {
  sm: {
    width: 'w-10',
    height: 'h-5',
    dot: 'w-3 h-3',
    translateX: 20,
  },
  md: {
    width: 'w-12',
    height: 'h-6',
    dot: 'w-4 h-4',
    translateX: 24,
  },
  lg: {
    width: 'w-14',
    height: 'h-7',
    dot: 'w-5 h-5',
    translateX: 28,
  },
};

const colorStyles = {
  cyan: {
    bg: 'bg-cyber-cyan/20',
    border: 'border-cyber-cyan/50',
    checkedBg: 'bg-cyber-cyan',
    checkedBorder: 'border-cyber-cyan',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
  },
  purple: {
    bg: 'bg-cyber-purple/20',
    border: 'border-cyber-purple/50',
    checkedBg: 'bg-cyber-purple',
    checkedBorder: 'border-cyber-purple',
    glow: 'shadow-[0_0_20px_rgba(157,0,255,0.5)]',
  },
  pink: {
    bg: 'bg-cyber-pink/20',
    border: 'border-cyber-pink/50',
    checkedBg: 'bg-cyber-pink',
    checkedBorder: 'border-cyber-pink',
    glow: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]',
  },
  green: {
    bg: 'bg-cyber-green/20',
    border: 'border-cyber-green/50',
    checkedBg: 'bg-cyber-green',
    checkedBorder: 'border-cyber-green',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.5)]',
  },
  yellow: {
    bg: 'bg-cyber-yellow/20',
    border: 'border-cyber-yellow/50',
    checkedBg: 'bg-cyber-yellow',
    checkedBorder: 'border-cyber-yellow',
    glow: 'shadow-[0_0_20px_rgba(240,255,0,0.5)]',
  },
};

export function CyberToggle({
  checked = false,
  onChange,
  disabled = false,
  color = 'cyan',
  size = 'md',
  label,
  className,
}: CyberToggleProps) {
  const styles = colorStyles[color];
  const sizeStyle = sizeStyles[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex flex-shrink-0 rounded-full border-2 transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
          sizeStyle.width,
          sizeStyle.height,
          checked ? styles.checkedBg : styles.bg,
          checked ? styles.checkedBorder : styles.border,
          checked && styles.glow,
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
      >
        <motion.span
          animate={{
            x: checked ? sizeStyle.translateX : 2,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg',
            sizeStyle.dot
          )}
        />
      </button>

      {label && (
        <span className={cn('text-sm font-medium text-gray-300', disabled && 'opacity-50')}>
          {label}
        </span>
      )}
    </div>
  );
}

export default CyberToggle;
