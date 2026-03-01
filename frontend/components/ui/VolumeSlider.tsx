'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

export interface VolumeSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyan-500',
    shadow: 'shadow-cyan-500/50',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.6)]',
    text: 'text-cyan-400',
  },
  purple: {
    bg: 'bg-purple-500',
    shadow: 'shadow-purple-500/50',
    glow: 'shadow-[0_0_15px_rgba(157,0,255,0.6)]',
    text: 'text-purple-400',
  },
  pink: {
    bg: 'bg-pink-500',
    shadow: 'shadow-pink-500/50',
    glow: 'shadow-[0_0_15px_rgba(255,0,128,0.6)]',
    text: 'text-pink-400',
  },
  green: {
    bg: 'bg-green-500',
    shadow: 'shadow-green-500/50',
    glow: 'shadow-[0_0_15px_rgba(0,255,65,0.6)]',
    text: 'text-green-400',
  },
};

const sizeClasses = {
  sm: { height: 'h-1', thumb: 'w-3 h-3', icon: 'w-3 h-3' },
  md: { height: 'h-2', thumb: 'w-4 h-4', icon: 'w-4 h-4' },
  lg: { height: 'h-3', thumb: 'w-5 h-5', icon: 'w-5 h-5' },
};

export function VolumeSlider({
  value: controlledValue,
  defaultValue = 70,
  onChange,
  max = 100,
  step = 1,
  size = 'md',
  showValue = false,
  disabled = false,
  color = 'cyan',
  className,
}: VolumeSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [previousValue, setPreviousValue] = useState(defaultValue);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const percentage = (value / max) * 100;

  const updateValue = (clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const rawValue = percentage * max;
    const steppedValue = Math.round(rawValue / step) * step;
    const newValue = Math.max(0, Math.min(max, steppedValue));

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

  const toggleMute = () => {
    if (disabled) return;

    if (value > 0) {
      setPreviousValue(value);
      const newValue = 0;
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    } else {
      const newValue = previousValue;
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
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
  }, [isDragging, max, step, disabled, controlledValue]);

  const getVolumeIcon = () => {
    if (value === 0) return <VolumeX className={sizes.icon} />;
    if (value < 50) return <Volume1 className={sizes.icon} />;
    return <Volume2 className={sizes.icon} />;
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Mute button */}
      <button
        onClick={toggleMute}
        disabled={disabled}
        className={cn(
          'flex-shrink-0 p-2 rounded-lg transition-all',
          'hover:bg-gray-800/50',
          colors.text,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        title={value > 0 ? '静音' : '取消静音'}
      >
        {getVolumeIcon()}
      </button>

      {/* Slider track */}
      <div className="relative flex-1">
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
          {/* Progress bar */}
          <div
            className={cn(
              'absolute h-full transition-all rounded-full',
              colors.bg,
              colors.shadow,
              (isDragging || !controlledValue) && 'transition-none'
            )}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 rounded-full',
              'bg-white shadow-lg transition-all',
              'hover:scale-125',
              colors.thumb,
              colors.glow,
              disabled && 'opacity-50'
            )}
            style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>

      {/* Value display */}
      {showValue && (
        <span
          className={cn(
            'font-mono text-sm font-medium min-w-[3rem] text-right',
            colors.text,
            disabled && 'opacity-50'
          )}
        >
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
