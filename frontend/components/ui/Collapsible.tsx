/**
 * 折叠面板组件
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@/components/icons';

export interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function Collapsible({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  className,
  triggerClassName,
  contentClassName,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const newState = !open;
    if (!isControlled) {
      setInternalOpen(newState);
    }
    onOpenChange?.(newState);
  };

  return (
    <div className={cn('w-full', className)}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center justify-between p-4 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan/50 transition-colors',
          triggerClassName
        )}
      >
        {trigger}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('overflow-hidden', contentClassName)}
          >
            <div className="p-4 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Collapsible;
