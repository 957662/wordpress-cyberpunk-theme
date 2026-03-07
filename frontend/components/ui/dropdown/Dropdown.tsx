/**
 * Dropdown 下拉菜单组件
 * 用于显示下拉选项列表
 */

'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
}

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ children, className, align = 'start' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, closeDropdown }}>
      <div ref={dropdownRef} className={cn('relative', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps {
  children: React.ReactElement;
  className?: string;
}

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const { isOpen, setIsOpen } = useDropdownContext();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn('inline-flex items-center justify-center', className)}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
}

export interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function DropdownContent({ children, className, align = 'start' }: DropdownContentProps) {
  const { isOpen, closeDropdown } = useDropdownContext();

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] max-w-xs',
            'bg-gray-900 border border-gray-800 rounded-lg shadow-lg',
            'py-1',
            alignClasses[align],
            className
          )}
        >
          {typeof children === 'function' ? children({ closeDropdown }) : children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: (closeDropdown: () => void) => void | Promise<void>;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  disabled = false,
  active = false,
  className,
}: DropdownItemProps) {
  const { closeDropdown } = useDropdownContext();

  const handleClick = async () => {
    if (disabled) return;
    await onClick?.(closeDropdown);
    closeDropdown();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-2',
        'flex items-center gap-3',
        'text-left text-sm',
        'transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        active
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        className
      )}
    >
      {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
      <span className="flex-1">{children}</span>
      {active && <Check className="w-4 h-4 ml-auto" />}
    </button>
  );
}

export interface DropdownSeparatorProps {
  className?: string;
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return (
    <div className={cn('my-1 h-px bg-gray-800', className)} aria-hidden="true" />
  );
}

export interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return (
    <div className={cn('px-4 py-2 text-xs font-semibold text-gray-500 uppercase', className)}>
      {children}
    </div>
  );
}

/**
 * 预设的 Dropdown 组件
 */
export interface SimpleDropdownProps {
  trigger: React.ReactNode;
  items: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void | Promise<void>;
    disabled?: boolean;
  }[];
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function SimpleDropdown({ trigger, items, align, className }: SimpleDropdownProps) {
  return (
    <Dropdown align={align} className={className}>
      <DropdownTrigger className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors inline-flex items-center gap-2">
        {trigger}
        <ChevronDown className="w-4 h-4" />
      </DropdownTrigger>
      <DropdownContent align={align}>
        {items.map((item, index) => (
          <DropdownItem
            key={index}
            icon={item.icon}
            onClick={async () => await item.onClick?.()}
            disabled={item.disabled}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

/**
 * 菜单 Dropdown
 */
export interface MenuDropdownProps {
  trigger: React.ReactNode;
  items: {
    label?: string;
    items: {
      label: string;
      icon?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }[];
  }[];
  align?: 'start' | 'center' | 'end';
}

export function MenuDropdown({ trigger, items, align = 'start' }: MenuDropdownProps) {
  return (
    <Dropdown align={align}>
      <DropdownTrigger>{trigger}</DropdownTrigger>
      <DropdownContent align={align}>
        {items.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.label && <DropdownLabel>{group.label}</DropdownLabel>}
            {group.items.map((item, itemIndex) => (
              <DropdownItem
                key={itemIndex}
                icon={item.icon}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.label}
              </DropdownItem>
            ))}
            {groupIndex < items.length - 1 && <DropdownSeparator />}
          </div>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

// 修复 MenuDropdown 中的 Content 错误
function Content({ children, align }: { children: React.ReactNode; align?: 'start' | 'center' | 'end' }) {
  const { isOpen } = useDropdownContext();
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] max-w-xs',
            'bg-gray-900 border border-gray-800 rounded-lg shadow-lg',
            'py-1',
            alignClasses[align || 'start']
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
