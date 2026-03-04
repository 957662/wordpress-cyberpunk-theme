/**
 * CyberPress Platform - SpeedDial Component
 * 快速拨号按钮组件 - 赛博朋克风格
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  direction?: 'up' | 'down' | 'left' | 'right';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  mainIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-12 h-12',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

const iconSizeStyles = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

const actionSizeStyles = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const positionStyles = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const colorMap = {
  cyan: 'bg-cyber-cyan text-cyber-dark shadow-neon-cyan hover:shadow-neon-cyan-lg',
  purple: 'bg-cyber-purple text-white shadow-neon-purple hover:shadow-neon-purple-lg',
  pink: 'bg-cyber-pink text-white shadow-neon-pink hover:shadow-neon-pink-lg',
  green: 'bg-cyber-green text-cyber-dark shadow-neon-green hover:shadow-neon-green-lg',
  yellow: 'bg-cyber-yellow text-cyber-dark shadow-neon-yellow hover:shadow-neon-yellow-lg',
};

export function SpeedDial({
  actions,
  direction = 'up',
  position = 'bottom-right',
  mainIcon,
  size = 'md',
  tooltip = true,
  className,
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const getDirectionStyles = (index: number) => {
    const spacing = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
    const offset = (index + 1) * spacing;

    switch (direction) {
      case 'up':
        return { bottom: `${offset}px` };
      case 'down':
        return { top: `${offset}px` };
      case 'left':
        return { right: `${offset}px` };
      case 'right':
        return { left: `${offset}px` };
      default:
        return { bottom: `${offset}px` };
    }
  };

  const getAnimationVariants = () => {
    switch (direction) {
      case 'up':
        return {
          open: { y: 0, opacity: 1, scale: 1 },
          closed: { y: 20, opacity: 0, scale: 0.8 },
        };
      case 'down':
        return {
          open: { y: 0, opacity: 1, scale: 1 },
          closed: { y: -20, opacity: 0, scale: 0.8 },
        };
      case 'left':
        return {
          open: { x: 0, opacity: 1, scale: 1 },
          closed: { x: 20, opacity: 0, scale: 0.8 },
        };
      case 'right':
        return {
          open: { x: 0, opacity: 1, scale: 1 },
          closed: { x: -20, opacity: 0, scale: 0.8 },
        };
      default:
        return {
          open: { y: 0, opacity: 1, scale: 1 },
          closed: { y: 20, opacity: 0, scale: 0.8 },
        };
    }
  };

  const variants = getAnimationVariants();

  const defaultMainIcon = (
    <svg
      className={cn(iconSizeStyles[size], 'transition-transform duration-300')}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={{
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
      }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div
      ref={containerRef}
      className={cn('fixed z-50', positionStyles[position], className)}
    >
      {/* 操作按钮 */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, index) => (
            <motion.div
              key={index}
              initial={variants.closed}
              animate={variants.open}
              exit={variants.closed}
              transition={{
                delay: index * 0.05,
                duration: 0.2,
                ease: 'easeOut',
              }}
              style={getDirectionStyles(index)}
              className="absolute"
            >
              <button
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'relative flex items-center justify-center rounded-full font-medium transition-all duration-200 hover:scale-110 active:scale-95',
                  actionSizeStyles[size],
                  colorMap[action.color || 'cyan']
                )}
                aria-label={action.label}
              >
                {action.icon}

                {/* Tooltip */}
                {tooltip && (
                  <span
                    className={cn(
                      'absolute whitespace-nowrap px-2 py-1 text-xs font-medium text-white bg-cyber-dark/90 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                      direction === 'up' && 'bottom-full mb-2',
                      direction === 'down' && 'top-full mt-2',
                      direction === 'left' && 'right-full mr-2',
                      direction === 'right' && 'left-full ml-2'
                    )}
                  >
                    {action.label}
                  </span>
                )}
              </button>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex items-center justify-center rounded-full bg-cyber-cyan text-cyber-dark shadow-neon-cyan hover:shadow-neon-cyan-lg transition-all duration-300',
          sizeStyles[size],
          isOpen && 'shadow-neon-cyan-xl'
        )}
        aria-label={isOpen ? '关闭' : '打开'}
      >
        {mainIcon || defaultMainIcon}

        {/* 脉冲动画 */}
        {isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-cyber-cyan/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
