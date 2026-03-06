'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  FileText,
  Image,
  Video,
  Code,
  Link,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  shortcut?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

export interface QuickActionsProps {
  actions: QuickAction[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorClasses = {
  cyan: 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/50',
  purple: 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/50',
  pink: 'bg-pink-500 hover:bg-pink-400 text-white shadow-pink-500/50',
  green: 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/50',
  yellow: 'bg-yellow-500 hover:bg-yellow-400 text-white shadow-yellow-500/50',
};

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  position = 'bottom-right',
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultActions: QuickAction[] = [
    {
      id: 'post',
      label: 'New Post',
      icon: FileText,
      onClick: () => console.log('Create post'),
      color: 'cyan',
    },
    {
      id: 'image',
      label: 'Upload Image',
      icon: Image,
      onClick: () => console.log('Upload image'),
      color: 'purple',
    },
    {
      id: 'video',
      label: 'Upload Video',
      icon: Video,
      onClick: () => console.log('Upload video'),
      color: 'pink',
    },
    {
      id: 'code',
      label: 'Code Snippet',
      icon: Code,
      onClick: () => console.log('Add code'),
      color: 'green',
    },
    {
      id: 'link',
      label: 'Add Link',
      icon: Link,
      onClick: () => console.log('Add link'),
      color: 'yellow',
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-full mb-2 flex flex-col gap-2 items-end">
            {displayActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="flex items-center gap-3 group"
              >
                {/* Label */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="px-3 py-1.5 bg-gray-800/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg shadow-lg border border-white/10 whitespace-nowrap"
                >
                  {action.label}
                  {action.shortcut && (
                    <span className="ml-2 text-xs text-gray-400">
                      {action.shortcut}
                    </span>
                  )}
                </motion.span>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'rounded-full shadow-lg transition-colors duration-200',
                    'flex items-center justify-center',
                    sizeClasses[size],
                    colorClasses[action.color || 'cyan']
                  )}
                >
                  <action.icon className={iconSizeClasses[size]} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg',
          'flex items-center justify-center',
          'hover:shadow-cyan-500/50 transition-shadow duration-200',
          sizeClasses[size]
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className={iconSizeClasses[size]} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className={iconSizeClasses[size]} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
          }}
        />
      </motion.button>
    </div>
  );
};

export default QuickActions;
