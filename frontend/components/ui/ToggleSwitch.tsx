'use client';

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  label?: string;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'cyan',
  label,
  className = '',
}: ToggleSwitchProps) {
  const colors = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    pink: 'bg-pink-400',
    yellow: 'bg-yellow-400',
  };

  const sizes = {
    sm: { width: '40px', height: '20px', dot: '14px' },
    md: { width: '48px', height: '24px', dot: '18px' },
    lg: { width: '56px', height: '28px', dot: '22px' },
  };

  const sizeConfig = sizes[size];

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      {label && (
        <span className="text-sm text-cyan-100 select-none">{label}</span>
      )}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`block transition-all duration-300 rounded-full ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${checked ? colors[color] : 'bg-gray-700'}`}
          style={{
            width: sizeConfig.width,
            height: sizeConfig.height,
          }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md transition-all duration-300 ${
            disabled ? 'opacity-50' : ''
          }`}
          style={{
            width: sizeConfig.dot,
            height: sizeConfig.dot,
            left: checked ? 'calc(100% - 2px)' : '2px',
            transform: `translate(calc(${checked ? '-100%' : '0'} - 50%), -50%)`,
          }}
        />
      </div>
    </label>
  );
}
