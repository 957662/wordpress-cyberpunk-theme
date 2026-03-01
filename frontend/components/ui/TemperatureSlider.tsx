'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TemperatureSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

const coldGradient = 'from-cyan-500 via-blue-500 to-purple-500';
const hotGradient = 'from-yellow-500 via-orange-500 to-red-500';

const sizeClasses = {
  sm: { height: 'h-2', thumb: 'w-4 h-4', text: 'text-xs' },
  md: { height: 'h-3', thumb: 'w-5 h-5', text: 'text-sm' },
  lg: { height: 'h-4', thumb: 'w-6 h-6', text: 'text-base' },
};

export function TemperatureSlider({
  value: controlledValue,
  defaultValue = 20,
  onChange,
  min = -10,
  max = 40,
  step = 1,
  size = 'md',
  showValue = true,
  disabled = false,
  className,
}: TemperatureSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const colors = sizeClasses[size];

  // Determine if hot or cold based on value
  const midPoint = (min + max) / 2;
  const isHot = value > midPoint;
  const gradient = isHot ? hotGradient : coldGradient;

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const rawValue = percentage * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    const newValue = Math.max(min, Math.min(max, steppedValue));

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
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
  }, [isDragging, min, max, step, disabled, controlledValue]);

  const getTemperatureEmoji = () => {
    if (value <= 0) return '🥶';
    if (value <= 10) return '❄️';
    if (value <= 20) return '☁️';
    if (value <= 30) return '🌤️';
    return '🥵';
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex justify-between items-center">
        <span className="text-cyan-400 font-semibold">❄️ 冷</span>
        <div className="flex items-center gap-2">
          {showValue && (
            <span className={cn('font-mono font-bold', colors.text, disabled && 'opacity-50')}>
              {getTemperatureEmoji()} {Math.round(value)}°C
            </span>
          )}
        </div>
        <span className="text-red-400 font-semibold">热 🥵</span>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className={cn(
            'relative cursor-pointer rounded-full overflow-hidden',
            'bg-gray-800/50',
            sizes.height,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Temperature gradient track */}
          <div className={cn('absolute inset-0 bg-gradient-to-r', gradient, 'opacity-30')} />

          {/* Progress fill */}
          <div
            className={cn(
              'absolute h-full transition-all rounded-full',
              'bg-gradient-to-r',
              gradient,
              isDragging && 'transition-none'
            )}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Thumb with glow effect */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 rounded-full',
              'bg-white shadow-lg transition-all',
              'hover:scale-110',
              colors.thumb,
              isHot ? 'shadow-orange-500/50' : 'shadow-cyan-500/50',
              isHot ? 'hover:shadow-orange-500' : 'hover:shadow-cyan-500',
              disabled && 'opacity-50'
            )}
            style={{
              left: `${percentage}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={cn(
              'absolute inset-0 rounded-full animate-pulse',
              isHot ? 'bg-orange-400' : 'bg-cyan-400',
              'opacity-20 blur-sm'
            )} />
          </div>
        </div>
      </div>

      {/* Temperature indicator */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}°C</span>
        <span>{Math.round((min + max) / 2)}°C</span>
        <span>{max}°C</span>
      </div>
    </div>
  );
}
