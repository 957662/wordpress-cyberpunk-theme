'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CyberDropdownProps {
  options: CyberDropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  disabled?: boolean;
  className?: string;
}

export const CyberDropdown: React.FC<CyberDropdownProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  variant = 'default',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const variantStyles = {
    default: 'border-cyan-500/30 hover:border-cyan-500 focus:border-cyan-500 focus:shadow-cyan-500/20',
    glow: 'border-fuchsia-500/30 hover:border-fuchsia-500 focus:border-fuchsia-500 focus:shadow-fuchsia-500/20',
    neon: 'border-pink-500/30 hover:border-pink-500 focus:border-pink-500 focus:shadow-pink-500/20',
    hologram: 'border-purple-500/30 hover:border-purple-500 focus:border-purple-500 focus:shadow-purple-500/20',
  };

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: CyberDropdownOption) => {
    if (option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3 bg-black/40 backdrop-blur-sm border',
          'text-white text-left rounded-sm',
          'transition-all duration-300',
          'focus:outline-none focus:shadow-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-between',
          variantStyles[variant],
          isOpen && 'shadow-lg'
        )}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={cn(!selectedOption && 'text-gray-500')}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <svg
          className={cn(
            'w-5 h-5 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
            variant === 'default' && 'text-cyan-500',
            variant === 'glow' && 'text-fuchsia-500',
            variant === 'neon' && 'text-pink-500',
            variant === 'hologram' && 'text-purple-500'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-sm border',
            'rounded-sm shadow-xl overflow-hidden',
            variant === 'default' && 'border-cyan-500/30',
            variant === 'glow' && 'border-fuchsia-500/30',
            variant === 'neon' && 'border-pink-500/30',
            variant === 'hologram' && 'border-purple-500/30'
          )}
        >
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleSelect(option)}
                className={cn(
                  'w-full px-4 py-2 text-left transition-colors duration-200',
                  'flex items-center gap-2',
                  'hover:bg-cyan-500/10',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  option.value === value && 'bg-cyan-500/20 text-cyan-400'
                )}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberDropdown;
