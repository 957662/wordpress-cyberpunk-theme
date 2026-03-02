/**
 * Tooltip - 工具提示组件
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  }, [delay, disabled]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  }, [timeoutId]);

  const placements = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              'absolute z-50 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm',
              'bg-gray-900 text-white border border-gray-700',
              'pointer-events-none',
              placements[placement]
            )}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;

// 快捷提示
export function QuickTip({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <Tooltip content={tip}>
      <span className="inline-flex items-center gap-1 text-gray-400 hover:text-cyan-400 cursor-help">
        {children}
        <span className="text-xs">ⓘ</span>
      </span>
    </Tooltip>
  );
}

// 状态提示
export function StatusTooltip({ status }: { status: 'online' | 'offline' }) {
  const statusConfig = {
    online: { color: 'bg-green-500', text: '在线' },
    offline: { color: 'bg-gray-500', text: '离线' },
  };

  const config = statusConfig[status];

  return (
    <Tooltip content={config.text}>
      <div className="inline-flex items-center gap-2 cursor-help">
        <div className={cn('w-2 h-2 rounded-full', config.color)} />
        <span className="text-sm text-gray-400">{config.text}</span>
      </div>
    </Tooltip>
  );
}
