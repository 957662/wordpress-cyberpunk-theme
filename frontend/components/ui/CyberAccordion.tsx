'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberAccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CyberAccordionProps {
  items: CyberAccordionItem[];
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export const CyberAccordion: React.FC<CyberAccordionProps> = ({
  items,
  variant = 'default',
  allowMultiple = false,
  defaultOpen = [],
  className,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const variantStyles = {
    default: {
      border: 'border-cyan-500/30',
      header: 'hover:bg-cyan-500/5',
      icon: 'text-cyan-500',
      content: 'bg-cyan-500/5',
    },
    glow: {
      border: 'border-fuchsia-500/30',
      header: 'hover:bg-fuchsia-500/5',
      icon: 'text-fuchsia-500',
      content: 'bg-fuchsia-500/5',
    },
    neon: {
      border: 'border-pink-500/30',
      header: 'hover:bg-pink-500/5',
      icon: 'text-pink-500',
      content: 'bg-pink-500/5',
    },
    hologram: {
      border: 'border-purple-500/30',
      header: 'hover:bg-purple-500/5',
      icon: 'text-purple-500',
      content: 'bg-purple-500/5',
    },
  };

  const styles = variantStyles[variant];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (allowMultiple) {
          newSet.add(id);
        } else {
          newSet.clear();
          newSet.add(id);
        }
      }

      return newSet;
    });
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div
            key={item.id}
            className={cn(
              'border rounded-lg overflow-hidden transition-all duration-300',
              styles.border
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between p-4',
                'transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                styles.header
              )}
            >
              <span className="flex items-center gap-3">
                {item.icon && <span>{item.icon}</span>}
                <span className="font-semibold text-white">{item.title}</span>
              </span>
              <svg
                className={cn(
                  'w-5 h-5 transition-transform duration-300',
                  styles.icon,
                  isOpen && 'rotate-180'
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
                  'p-4 border-t border-gray-700/50',
                  styles.content
                )}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CyberAccordion;
