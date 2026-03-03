'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  text?: string;
  fullscreen?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
};

const colorClasses = {
  cyan: 'border-cyan-500',
  purple: 'border-purple-500',
  pink: 'border-pink-500',
  green: 'border-green-500'
};

export function CyberLoading({
  size = 'md',
  color = 'cyan',
  text,
  fullscreen = false
}: CyberLoadingProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={cn('relative rounded-full', sizeClass, colorClass)}
        style={{
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          borderWidth: '3px'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// Pulse Loading Variant
export function CyberPulseLoading({
  size = 'md',
  color = 'cyan',
  text
}: Omit<CyberLoadingProps, 'fullscreen'>) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color].replace('border-', 'bg-').replace('-500', '-500/20');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={cn('relative rounded-full', sizeClass)}>
        <motion.div
          className={cn('absolute inset-0 rounded-full', colorClass)}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={cn('absolute inset-0 rounded-full', colorClass)}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
      </div>

      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}

// Dot Loading Variant
export function CyberDotLoading({
  color = 'cyan',
  text
}: Pick<CyberLoadingProps, 'color' | 'text'>) {
  const colorClass = colorClasses[color].replace('border-', 'bg-');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('w-3 h-3 rounded-full', colorClass)}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15
            }}
          />
        ))}
      </div>

      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}

// Bar Loading Variant
export function CyberBarLoading({
  color = 'cyan',
  text
}: Pick<CyberLoadingProps, 'color' | 'text'>) {
  const colorClass = colorClasses[color].replace('border-', 'bg-');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={cn('w-1 h-8 rounded-full', colorClass)}
            animate={{ scaleY: [1, 2, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1
            }}
          />
        ))}
      </div>

      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
}
