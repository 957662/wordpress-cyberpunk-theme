'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'scan' | 'matrix';
  color?: 'cyan' | 'purple' | 'pink' | 'rainbow';
  text?: string;
  fullscreen?: boolean;
  progress?: number;
}

export const CyberLoader: React.FC<CyberLoaderProps> = ({
  className,
  size = 'md',
  variant = 'spinner',
  color = 'cyan',
  text,
  fullscreen = false,
  progress,
}) => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (variant === 'dots') {
      const interval = setInterval(() => {
        setDots((prev) => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const colors = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    rainbow: 'border-transparent',
  };

  const sizes = {
    sm: { width: '24px', height: '24px' },
    md: { width: '48px', height: '48px' },
    lg: { width: '64px', height: '64px' },
  };

  const renderSpinner = () => (
    <div
      className={cn(
        'relative rounded-full border-4 border-t-transparent animate-spin',
        colors[color],
        size === 'sm' && 'w-6 h-6 border-2',
        size === 'md' && 'w-12 h-12 border-4',
        size === 'lg' && 'w-16 h-16 border-4'
      )}
    >
      <div className="absolute inset-0 rounded-full border-4 border-b-transparent animate-spin-reverse" />
    </div>
  );

  const renderDots = () => (
    <div className="flex gap-2">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={cn(
            'rounded-full',
            size === 'sm' && 'w-2 h-2',
            size === 'md' && 'w-3 h-3',
            size === 'lg' && 'w-4 h-4',
            color === 'cyan' && 'bg-cyber-cyan',
            color === 'purple' && 'bg-cyber-purple',
            color === 'pink' && 'bg-cyber-pink',
            color === 'rainbow' && [
              'bg-gradient-to-r',
              index % 3 === 0 ? 'from-cyber-cyan to-cyber-cyan' : '',
              index % 3 === 1 ? 'from-cyber-purple to-cyber-purple' : '',
              index % 3 === 2 ? 'from-cyber-pink to-cyber-pink' : '',
            ]
          )}
          animate={{
            scale: index <= dots ? [1, 1.2, 1] : 0.5,
            opacity: index <= dots ? 1 : 0.3,
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      <motion.div
        className={cn(
          'rounded-full',
          size === 'sm' && 'w-6 h-6',
          size === 'md' && 'w-12 h-12',
          size === 'lg' && 'w-16 h-16',
          color === 'cyan' && 'bg-cyber-cyan',
          color === 'purple' && 'bg-cyber-purple',
          color === 'pink' && 'bg-cyber-pink',
          color === 'rainbow' && 'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink'
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full blur-xl',
          size === 'sm' && 'w-6 h-6',
          size === 'md' && 'w-12 h-12',
          size === 'lg' && 'w-16 h-16',
          color === 'cyan' && 'bg-cyber-cyan',
          color === 'purple' && 'bg-cyber-purple',
          color === 'pink' && 'bg-cyber-pink'
        )}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );

  const renderScan = () => (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          'border-2 rounded',
          size === 'sm' && 'w-24 h-6',
          size === 'md' && 'w-48 h-8',
          size === 'lg' && 'w-64 h-10',
          color === 'cyan' && 'border-cyber-cyan',
          color === 'purple' && 'border-cyber-purple',
          color === 'pink' && 'border-cyber-pink'
        )}
      >
        <motion.div
          className={cn(
            'absolute inset-0',
            color === 'cyan' && 'bg-cyber-cyan',
            color === 'purple' && 'bg-cyber-purple',
            color === 'pink' && 'bg-cyber-pink'
          )}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );

  const renderMatrix = () => {
    const chars = '01アイウエオカキクケコサシスセソ';
    const [matrixChars, setMatrixChars] = useState(
      Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)])
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setMatrixChars((prev) =>
          prev.map(() => chars[Math.floor(Math.random() * chars.length)])
        );
      }, 100);

      return () => clearInterval(interval);
    }, []);

    return (
      <div
        className={cn(
          'font-mono text-xs leading-none overflow-hidden',
          size === 'sm' && 'w-6 h-6',
          size === 'md' && 'w-12 h-12 text-sm',
          size === 'lg' && 'w-16 h-16 text-base',
          color === 'cyan' && 'text-cyber-cyan',
          color === 'purple' && 'text-cyber-purple',
          color === 'pink' && 'text-cyber-pink'
        )}
      >
        {matrixChars.map((char, index) => (
          <motion.div
            key={index}
            className="opacity-70"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.05,
            }}
          >
            {char}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'scan':
        return renderScan();
      case 'matrix':
        return renderMatrix();
      default:
        return renderSpinner();
    }
  };

  const loader = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {renderVariant()}

      {/* 文本 */}
      {text && (
        <motion.p
          className={cn(
            'text-sm font-medium',
            color === 'cyan' && 'text-cyber-cyan',
            color === 'purple' && 'text-cyber-purple',
            color === 'pink' && 'text-cyber-pink'
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}

      {/* 进度条 */}
      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                'h-full',
                color === 'cyan' && 'bg-cyber-cyan',
                color === 'purple' && 'bg-cyber-purple',
                color === 'pink' && 'bg-cyber-pink'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-center mt-2 text-gray-400">{progress}%</p>
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {loader}
      </motion.div>
    );
  }

  return loader;
};

export default CyberLoader;
