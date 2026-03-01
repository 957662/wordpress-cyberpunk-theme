/**
 * 滑块组件
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  label,
  showValue = true,
  disabled = false,
  color = 'cyan',
  className,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const colors = {
    cyan: 'bg-cyber-cyan shadow-neon-cyan',
    purple: 'bg-cyber-purple shadow-neon-purple',
    pink: 'bg-cyber-pink shadow-neon-pink',
    green: 'bg-cyber-green shadow-[0_0_10px_#00ff88]',
  };

  const handleChange = (clientX: number) => {
    if (disabled || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const newPosition = clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(1, newPosition / rect.width));
    const newValue = min + newPercentage * (max - min);

    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    if (!isControlled) {
      setInternalValue(clampedValue);
    }
    onChange?.(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleChange(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleChange(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, disabled]);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-300">{label}</label>
          )}
          {showValue && (
            <span className="text-sm text-cyber-cyan font-mono">{value}</span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className={cn(
          'relative h-2 bg-cyber-muted rounded-full cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onMouseDown={handleMouseDown}
      >
        {/* 填充条 */}
        <motion.div
          className={cn(
            'absolute h-full rounded-full',
            colors[color]
          )}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* 滑块 */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing',
            colors[color],
            isDragging && 'scale-125'
          )}
          initial={false}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.1 }}
          style={{ marginLeft: '-8px' }}
        />
      </div>
    </div>
  );
}

export default Slider;
