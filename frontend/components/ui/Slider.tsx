/**
 * 赛博朋克风格滑块组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback, MouseEvent, TouchEvent } from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  variant?: 'default' | 'neon' | 'hologram';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showTicks?: boolean;
  vertical?: boolean;
  disabled?: boolean;
  label?: string;
  unit?: string;
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}

export function Slider({
  value: controlledValue = 50,
  min = 0,
  max = 100,
  step = 1,
  color = 'cyan',
  variant = 'default',
  size = 'md',
  showValue = true,
  showTicks = false,
  vertical = false,
  disabled = false,
  label,
  unit,
  formatValue,
  onChange,
  onChangeEnd,
  className,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(controlledValue);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = ((localValue - min) / (max - min)) * 100;

  const handlePointerDown = useCallback((event: MouseEvent | TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(event);
  }, [disabled]);

  const handlePointerMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging || disabled) return;
    updateValue(event);
  }, [isDragging, disabled]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    onChangeEnd?.(localValue);
  }, [isDragging, localValue, onChangeEnd]);

  const updateValue = useCallback((event: MouseEvent | TouchEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    let percentage: number;
    if (vertical) {
      percentage = 1 - (clientY - rect.top) / rect.height;
    } else {
      percentage = (clientX - rect.left) / rect.width;
    }

    percentage = Math.max(0, Math.min(1, percentage));

    let newValue = min + percentage * (max - min);

    // Apply step
    if (step > 0) {
      newValue = Math.round((newValue - min) / step) * step + min;
    }

    newValue = Math.max(min, Math.min(max, newValue));
    setLocalValue(newValue);
    onChange?.(newValue);
  }, [min, max, step, vertical, onChange]);

  const sizes = {
    sm: { height: 'h-1', thumb: 'w-3 h-3', textSize: 'text-xs' },
    md: { height: 'h-2', thumb: 'w-4 h-4', textSize: 'text-sm' },
    lg: { height: 'h-3', thumb: 'w-5 h-5', textSize: 'text-base' },
  };

  return (
    <div className={cn('flex gap-3', vertical ? 'flex-col' : 'flex-row', className)}>
      {label && (
        <div className={cn(
          'flex items-center font-body text-gray-300',
          sizes[size].textSize
        )}>
          {label}
        </div>
      )}

      <div className={cn('flex items-center gap-4', vertical ? 'flex-row' : 'flex-col')}>
        {/* 最小值 */}
        {showValue && (
          <span className={cn(
            'font-mono text-gray-500 min-w-[3rem] text-right',
            sizes[size].textSize
          )}>
            {min}
          </span>
        )}

        {/* 轨道 */}
        <div
          ref={trackRef}
          className={cn(
            'relative bg-cyber-muted/50 rounded-full cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed',
            vertical ? 'h-48 w-2' : sizes[size].height
          )}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          onMouseLeave={handlePointerUp}
        >
          {/* 背景轨道 */}
          <div className="absolute inset-0 rounded-full bg-cyber-muted/30" />

          {/* 进度条 */}
          <motion.div
            className={cn(
              'absolute rounded-full',
              variant === 'neon' && `shadow-neon-${color}`,
              variant === 'hologram' && 'bg-gradient-to-r from-cyber-cyan to-cyber-purple'
            )}
            style={{
              backgroundColor: variant !== 'hologram' ? `var(--cyber-${color})` : undefined,
              [vertical ? 'bottom' : 'left']: 0,
              [vertical ? 'width' : 'height']: '100%',
              [vertical ? 'height' : 'width']: `${percentage}%`,
            }}
          />

          {/* 刻度线 */}
          {showTicks && !disabled && (
            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
              {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
                const tickPercentage = (i / Math.floor((max - min) / step)) * 100;
                return (
                  <div
                    key={i}
                    className={cn(
                      'w-px bg-current',
                      tickPercentage <= percentage ? `text-cyber-${color}` : 'text-cyber-border',
                      vertical ? 'h-1' : 'h-2'
                    )}
                  />
                );
              })}
            </div>
          )}

          {/* 滑块 */}
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-lg',
              sizes[size].thumb,
              disabled && 'opacity-50',
              variant === 'neon' && `border-cyber-${color} shadow-neon-${color}`
            )}
            style={{
              [vertical ? 'bottom' : 'left']: `${percentage}%`,
              [vertical ? 'right' : 'top']: '50%',
              transform: vertical ? 'translate(50%, 50%)' : 'translate(-50%, -50%)',
            }}
            animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* 最大值 */}
        {showValue && (
          <span className={cn(
            'font-mono text-gray-500 min-w-[3rem]',
            sizes[size].textSize
          )}>
            {max}
          </span>
        )}

        {/* 当前值 */}
        {showValue && (
          <div className="flex items-baseline gap-1 min-w-[4rem]">
            <span className={cn(
              'font-mono font-bold text-gray-200',
              sizes[size].textSize
            )}>
              {formatValue ? formatValue(localValue) : localValue.toFixed(step < 1 ? 1 : 0)}
            </span>
            {unit && (
              <span className={cn('text-gray-400', sizes[size].textSize)}>{unit}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
