/**
 * 赛博朋克风格旋钮组件
 */

'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback } from 'react';

export interface KnobProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  variant?: 'default' | 'neon' | 'hologram';
  showValue?: boolean;
  showTicks?: boolean;
  disabled?: boolean;
  label?: string;
  unit?: string;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
}

export function Knob({
  value: controlledValue = 50,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  color = 'cyan',
  variant = 'default',
  showValue = true,
  showTicks = false,
  disabled = false,
  label,
  unit,
  onChange,
  onChangeEnd,
  className,
}: KnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(controlledValue);
  const startY = useRef(0);
  const startValue = useRef(controlledValue);

  const sizes = {
    sm: { width: 'w-12', height: 'h-12', track: 'w-10', text: 'text-xs' },
    md: { width: 'w-16', height: 'h-16', track: 'w-14', text: 'text-sm' },
    lg: { width: 'w-20', height: 'h-20', track: 'w-18', text: 'text-base' },
    xl: { width: 'w-24', height: 'h-24', track: 'w-22', text: 'text-lg' },
  };

  const percentage = ((localValue - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 270 - 135; // -135deg to 135deg

  const handleDragStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    startY.current = clientY;
    startValue.current = localValue;
  }, [disabled, localValue]);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (disabled || !isDragging) return;

    const deltaY = startY.current - info.point.y;
    const range = max - min;
    const sensitivity = 0.5;
    let newValue = startValue.current + deltaY * sensitivity * (range / 200);

    // Snap to step
    if (step > 0) {
      newValue = Math.round(newValue / step) * step;
    }

    // Clamp to range
    newValue = Math.max(min, Math.min(max, newValue));

    setLocalValue(newValue);
    onChange?.(newValue);
  }, [disabled, isDragging, min, max, step, onChange]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onChangeEnd?.(localValue);
  }, [localValue, onChangeEnd]);

  const getKnobStyles = () => {
    const base = 'relative rounded-full border-2 flex items-center justify-center cursor-pointer select-none';
    
    if (disabled) {
      return cn(base, 'bg-cyber-muted border-cyber-border opacity-50 cursor-not-allowed');
    }

    if (variant === 'neon') {
      return cn(
        base,
        `bg-cyber-card border-cyber-${color}`,
        isDragging && `shadow-neon-${color}`
      );
    }

    if (variant === 'hologram') {
      return cn(
        base,
        'bg-gradient-to-br from-cyber-card to-cyber-muted border-cyber-cyan/50'
      );
    }

    return cn(base, 'bg-cyber-card border-cyber-border', isDragging && `border-cyber-${color}`);
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {label && (
        <span className="text-sm font-body text-gray-400">{label}</span>
      )}

      <motion.div
        drag={disabled ? false : { y: 0 }}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={cn(getKnobStyles(), sizes[size].width, sizes[size].height)}
      >
        {/* 背景轨道 */}
        <svg
          className={cn('absolute inset-0 w-full h-full -rotate-90')}
          viewBox="0 0 100 100"
        >
          {/* 背景圆 */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className={cn(
              'stroke-current',
              disabled ? 'text-cyber-muted' : 'text-cyber-muted/50'
            )}
            strokeWidth="8"
          />

          {/* 进度圆 */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className={`stroke-cyber-${color}`}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 0.1 }}
            style={{
              strokeDasharray: '251.2',
              strokeDashoffset: '251.2',
            }}
          />

          {/* 刻度线 */}
          {showTicks && !disabled && (
            <>
              {[0, 25, 50, 75, 100].map((tick) => {
                const angle = (tick / 100) * 270 - 135;
                const radian = (angle * Math.PI) / 180;
                const x1 = 50 + 35 * Math.cos(radian);
                const y1 = 50 + 35 * Math.sin(radian);
                const x2 = 50 + 45 * Math.cos(radian);
                const y2 = 50 + 45 * Math.sin(radian);
                
                return (
                  <line
                    key={tick}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={cn(
                      'stroke-current',
                      percentage >= tick ? `stroke-cyber-${color}` : 'stroke-cyber-border'
                    )}
                    strokeWidth="2"
                  />
                );
              })}
            </>
          )}
        </svg>

        {/* 中心指示器 */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'w-1/2 h-0.5 bg-current rounded-full',
            `text-cyber-${color}`,
            variant === 'neon' && `shadow-neon-${color}`
          )}
        />

        {/* 霓虹发光效果 */}
        {isDragging && variant === 'neon' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 rounded-full bg-cyber-${color} opacity-20 blur-xl`}
          />
        )}
      </motion.div>

      {/* 数值显示 */}
      {showValue && (
        <div className="flex items-baseline gap-1">
          <span className={cn('font-mono font-bold text-gray-200', sizes[size].text)}>
            {localValue.toFixed(step < 1 ? 1 : 0)}
          </span>
          {unit && (
            <span className={cn('text-gray-400', sizes[size].text)}>{unit}</span>
          )}
        </div>
      )}
    </div>
  );
}
