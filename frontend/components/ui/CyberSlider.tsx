'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  helperText?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  showValue?: boolean;
  disabled?: boolean;
}

export const CyberSlider: React.FC<CyberSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  label,
  helperText,
  variant = 'default',
  showValue = true,
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const variantStyles = {
    default: {
      track: 'bg-cyan-500/20',
      fill: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      thumb: 'border-cyan-500 shadow-cyan-500/50',
    },
    glow: {
      track: 'bg-fuchsia-500/20',
      fill: 'bg-gradient-to-r from-fuchsia-500 to-pink-500',
      thumb: 'border-fuchsia-500 shadow-fuchsia-500/50',
    },
    neon: {
      track: 'bg-pink-500/20',
      fill: 'bg-gradient-to-r from-pink-500 to-rose-500',
      thumb: 'border-pink-500 shadow-pink-500/50',
    },
    hologram: {
      track: 'bg-purple-500/20',
      fill: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      thumb: 'border-purple-500 shadow-purple-500/50',
    },
  };

  const styles = variantStyles[variant];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-cyan-400">{label}</label>
          {showValue && (
            <span className="text-sm text-gray-300">{value}</span>
          )}
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div
          className={cn(
            'absolute h-2 rounded-full overflow-hidden',
            styles.track,
            disabled && 'opacity-50'
          )}
        >
          <div
            className={cn('h-full', styles.fill)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'relative w-full h-2 appearance-none bg-transparent cursor-pointer',
            'focus:outline-none',
            'disabled:cursor-not-allowed',
            disabled && 'opacity-50'
          )}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
          }}
        />
        <style jsx>{`
          input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #0a0a0f;
            border: 2px;
            cursor: pointer;
            box-shadow: 0 0 10px currentColor;
          }
          input::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #0a0a0f;
            border: 2px;
            cursor: pointer;
            box-shadow: 0 0 10px currentColor;
          }
        `}</style>
      </div>
      {helperText && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default CyberSlider;
