'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'dark' | 'light' | 'cyber' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  arrow?: boolean;
  className?: string;
}

/**
 * Tooltip - 工具提示组件
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'dark',
  size = 'md',
  delay = 200,
  arrow = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const variants = {
    dark: 'bg-gray-900 text-gray-100 border-gray-700',
    light: 'bg-white text-gray-900 border-gray-300',
    cyber: 'bg-[#0a0a0f] text-cyber-cyan border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]',
    neon: 'bg-gradient-to-r from-cyber-purple/90 to-cyber-pink/90 text-white border-cyber-pink',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs max-w-[150px]',
    md: 'px-3 py-1.5 text-sm max-w-[200px]',
    lg: 'px-4 py-2 text-base max-w-[300px]',
  };

  const getPositionStyles = () => {
    const offset = 10;
    switch (position) {
      case 'top':
        return {
          left: coords.x,
          bottom: window.innerHeight - coords.y + offset,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          left: coords.x,
          top: coords.y + offset,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          right: window.innerWidth - coords.x + offset,
          top: coords.y,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          left: coords.x + offset,
          top: coords.y,
          transform: 'translateY(-50%)',
        };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`fixed z-50 border rounded-lg ${variants[variant]} ${sizes[size]} pointer-events-none`}
            style={getPositionStyles()}
          >
            {content}
            {arrow && (
              <div
                className={`absolute w-2 h-2 border ${
                  variant === 'dark' || variant === 'cyber'
                    ? 'bg-gray-900 border-gray-700'
                    : variant === 'light'
                    ? 'bg-white border-gray-300'
                    : 'bg-cyber-purple border-cyber-pink'
                }`}
                style={{
                  ...(position === 'top' && {
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                  }),
                  ...(position === 'bottom' && {
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                  }),
                  ...(position === 'left' && {
                    right: -4,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                  }),
                  ...(position === 'right' && {
                    left: -4,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                  }),
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Popover - 弹出框组件
 */
export const Popover: React.FC<{
  trigger: React.ReactNode;
  content: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ trigger, content, isOpen, onOpenChange, position = 'bottom', className = '' }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (triggerRef.current && open) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [open]);

  const getPositionStyles = () => {
    const offset = 8;
    switch (position) {
      case 'top':
        return {
          left: coords.x,
          bottom: window.innerHeight - coords.y + offset,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          left: coords.x,
          top: coords.y + offset,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          right: window.innerWidth - coords.x + offset,
          top: coords.y,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          left: coords.x + offset,
          top: coords.y,
          transform: 'translateY(-50%)',
        };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={`inline-block cursor-pointer ${className}`}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-50 p-4 bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg shadow-xl"
              style={getPositionStyles()}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * HoverCard - 悬停卡片
 */
export const HoverCard: React.FC<{
  trigger: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ trigger, content, delay = 300, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 p-4 mt-2 bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg shadow-xl w-80"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
