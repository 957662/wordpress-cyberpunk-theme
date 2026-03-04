'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';
import { ChevronDown, Check } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  disabled = false,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variantStyles = {
    default: 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan',
    neon: `bg-cyber-card/50 border-2 border-cyber-${glowColor} hover:shadow-neon-${glowColor}`,
    cyber: 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan hover:shadow-neon-cyan',
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between rounded-lg font-medium text-white transition-all duration-300',
          sizeStyles[size],
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-full mt-2 bg-cyber-card border border-cyber-border rounded-lg shadow-xl overflow-hidden',
              variant === 'neon' && `border-cyber-${glowColor}`
            )}
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-left text-white hover:bg-cyber-muted transition-colors',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  option.value === value && `bg-cyber-${glowColor}/10`
                )}
                whileHover={{ x: 4 }}
                disabled={option.disabled}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-cyber-cyan" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface SelectProps extends Omit<DropdownProps, 'options'> {
  children: React.ReactElement[] | React.ReactElement;
}

export const Select = ({ children, ...props }: SelectProps) => {
  const options = Array.isArray(children)
    ? children.map((child) => ({
        value: child.props.value,
        label: child.props.children,
        disabled: child.props.disabled,
      }))
    : [];

  return <Dropdown options={options} {...props} />;
};
