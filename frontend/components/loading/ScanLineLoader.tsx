'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScanLineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function ScanLineLoader({
  size = 'md',
  text,
  className,
}: ScanLineLoaderProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (text) {
      setLines(text.split('\n'));
      const interval = setInterval(() => {
        setCurrentLine((prev) => (prev + 1) % (text.split('\n').length + 1));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [text]);

  const sizeMap = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  return (
    <div
      className={cn(
        'relative w-full bg-cyber-dark border border-cyber-cyan/30 overflow-hidden font-mono',
        sizeMap[size],
        className
      )}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_20px_#00f0ff]"
        animate={{
          top: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scan beam effect */}
      <motion.div
        className="absolute left-0 right-0 h-16 bg-gradient-to-b from-cyber-cyan/20 via-cyber-cyan/5 to-transparent"
        animate={{
          top: ['-10%', '110%', '-10%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Text content */}
      {text && (
        <div className="absolute inset-0 p-4 text-cyber-cyan text-xs sm:text-sm leading-relaxed">
          {text.split('\n').map((line, i) => (
            <motion.p
              key={i}
              className={cn(
                'transition-colors duration-100',
                i === currentLine ? 'text-white font-bold' : 'opacity-30'
              )}
            >
              {line}
            </motion.p>
          ))}
        </div>
      )}

      {/* Corner markers */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute w-4 h-4 border-2 border-cyber-cyan',
            i < 2 ? 'top-2' : 'bottom-2',
            i % 2 === 0 ? 'left-2' : 'right-2',
            i % 2 === 0 ? 'border-r-0 border-b-0' : 'border-l-0 border-t-0'
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

interface DataStreamProps {
  speed?: number;
  className?: string;
}

export function DataStream({ speed = 50, className }: DataStreamProps) {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev, Math.random().toString(36).substring(7)];
        return newData.slice(-20);
      });
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className={cn('font-mono text-xs text-cyber-green p-4', className)}>
      <AnimatePresence mode="popLayout">
        {data.map((item, i) => (
          <motion.div
            key={`${item}-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="py-0.5"
          >
            <span className="text-cyber-cyan">[{String(i).padStart(2, '0')}]</span>{' '}
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface HologramLoaderProps {
  size?: number;
  className?: string;
}

export function HologramLoader({ size = 120, className }: HologramLoaderProps) {
  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Outer ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="1"
          opacity="0.5"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          transformOrigin="50 50"
        />

        {/* Inner ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#9d00ff"
          strokeWidth="1"
          opacity="0.7"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          transformOrigin="50 50"
        />

        {/* Core */}
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#ff0080"
          strokeWidth="2"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          transformOrigin="50 50"
        />

        {/* Scanning lines */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="5"
            x2="50"
            y2="95"
            stroke="#00f0ff"
            strokeWidth="0.5"
            opacity="0.3"
            animate={{
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            transform={`rotate(${i * 22.5} 50 50)`}
          />
        ))}
      </svg>

      {/* Hologram flicker effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/10 to-transparent pointer-events-none"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 2,
        }}
      />
    </div>
  );
}
