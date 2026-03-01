/**
 * 芯片标签组件
 * 小型的可交互标签
 */

'use client';

import { motion } from 'framer-motion';
import { CloseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ChipProps {
  /** 标签内容 */
  label: string;
  /** 是否可删除 */
  deletable?: boolean;
  /** 删除回调 */
  onDelete?: () => void;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 标签颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange' | 'gray';
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否填充 */
  filled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

const colorStyles = {
  cyan: {
    light: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30 hover:bg-cyber-cyan/20',
    filled: 'bg-cyber-cyan text-cyber-dark border-cyber-cyan hover:bg-cyber-cyan/90',
  },
  purple: {
    light: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30 hover:bg-cyber-purple/20',
    filled: 'bg-cyber-purple text-white border-cyber-purple hover:bg-cyber-purple/90',
  },
  pink: {
    light: 'bg-cyber-pink/10 text-cyber-pink border-cyber-pink/30 hover:bg-cyber-pink/20',
    filled: 'bg-cyber-pink text-white border-cyber-pink hover:bg-cyber-pink/90',
  },
  yellow: {
    light: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30 hover:bg-cyber-yellow/20',
    filled: 'bg-cyber-yellow text-cyber-dark border-cyber-yellow hover:bg-cyber-yellow/90',
  },
  green: {
    light: 'bg-cyber-green/10 text-cyber-green border-cyber-green/30 hover:bg-cyber-green/20',
    filled: 'bg-cyber-green text-cyber-dark border-cyber-green hover:bg-cyber-green/90',
  },
  orange: {
    light: 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/30 hover:bg-cyber-orange/20',
    filled: 'bg-cyber-orange text-white border-cyber-orange hover:bg-cyber-orange/90',
  },
  gray: {
    light: 'bg-cyber-muted text-gray-400 border-cyber-border hover:bg-cyber-muted/80',
    filled: 'bg-cyber-muted text-gray-300 border-cyber-border hover:bg-cyber-muted/80',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function Chip({
  label,
  deletable = false,
  onDelete,
  clickable = false,
  onClick,
  color = 'cyan',
  size = 'md',
  filled = false,
  icon,
  className,
}: ChipProps) {
  const style = filled ? colorStyles[color].filled : colorStyles[color].light;

  return (
    <motion.div
      whileHover={{ scale: clickable || deletable ? 1.02 : 1.05 }}
      whileTap={{ scale: clickable || deletable ? 0.98 : 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-all duration-200',
        style,
        sizeStyles[size],
        (clickable || deletable) && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate max-w-[200px]">{label}</span>
      {deletable && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-0.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <CloseIcon className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
}

export interface ChipGroupProps {
  /** 芯片列表 */
  chips: Omit<ChipProps, 'onClick'>[];
  /** 多选模式 */
  multiple?: boolean;
  /** 选中值 */
  value?: string | string[];
  /** 值变化回调 */
  onChange?: (value: string | string[]) => void;
  /** 自定义类名 */
  className?: string;
}

export function ChipGroup({
  chips,
  multiple = false,
  value,
  onChange,
  className,
}: ChipGroupProps) {
  const isSelected = (chipLabel: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(chipLabel);
    }
    return value === chipLabel;
  };

  const handleToggle = (chipLabel: string) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = isSelected(chipLabel)
        ? currentValue.filter(v => v !== chipLabel)
        : [...currentValue, chipLabel];
      onChange?.(newValue);
    } else {
      onChange?.(isSelected(chipLabel) ? '' : chipLabel);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          {...chip}
          clickable
          onClick={() => handleToggle(chip.label)}
          filled={isSelected(chip.label)}
          className={isSelected(chip.label) ? 'shadow-neon-cyan' : ''}
        />
      ))}
    </div>
  );
}
