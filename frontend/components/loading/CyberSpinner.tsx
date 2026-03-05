'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function CyberSpinner({
  size = 'md',
  color = 'cyan',
  className,
}: CyberSpinnerProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colorMap = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    green: 'border-cyber-green',
  };

  return (
    <div className={cn('relative inline-block', sizeMap[size], className)}>
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full border-4 border-t-transparent',
          colorMap[color]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={cn(
          'absolute inset-2 rounded-full border-4 border-b-transparent',
          colorMap[color]
        )}
        animate={{ rotate: -360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={cn(
          'absolute inset-4 rounded-full border-2 border-l-transparent',
          colorMap[color]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function PulseLoader({
  size = 'md',
  color = 'cyan',
  className,
}: PulseLoaderProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colorMap = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeMap[size], className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('absolute rounded-full', colorMap[color])}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

interface GlitchTextLoaderProps {
  text?: string;
  className?: string;
}

export function GlitchTextLoader({ text = 'LOADING', className }: GlitchTextLoaderProps) {
  return (
    <div className={cn('font-mono text-2xl font-bold', className)}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block text-cyber-cyan"
          animate={{
            opacity: [1, 0.5, 1],
            textShadow: [
              'none',
              '2px 0 #ff0080, -2px 0 #00f0ff',
              'none',
            ],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            delay: i * 0.05,
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

interface MatrixRainLoaderProps {
  width?: number;
  height?: number;
  className?: string;
}

export function MatrixRainLoader({
  width = 200,
  height = 150,
  className,
}: MatrixRainLoaderProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      <svg width={width} height={height} className="bg-cyber-dark">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.text
            key={i}
            x={i * 10 + Math.random() * 5}
            y={-20}
            fill="#00ff00"
            fontSize="12"
            fontFamily="monospace"
            animate={{
              y: height + 20,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          >
            {String.fromCharCode(0x30a0 + Math.random() * 96)}
          </motion.text>
        ))}
      </svg>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  height?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  progress,
  color = 'cyan',
  height = 8,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const colorMap = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green',
  };

  const glowMap = {
    cyan: 'shadow-[0_0_10px_#00f0ff]',
    purple: 'shadow-[0_0_10px_#9d00ff]',
    pink: 'shadow-[0_0_10px_#ff0080]',
    green: 'shadow-[0_0_10px_#00ff88]',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm font-mono">
          <span className="text-gray-400">Progress</span>
          <span className="text-cyber-cyan">{Math.round(progress)}%</span>
        </div>
      )}
      <div
        className="relative w-full bg-gray-800 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className={cn(
            'h-full rounded-full',
            colorMap[color],
            glowMap[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className={cn(
            'absolute top-0 bottom-0 w-2',
            colorMap[color],
            'blur-sm'
          )}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
