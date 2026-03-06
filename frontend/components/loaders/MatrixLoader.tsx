/**
 * MatrixLoader - 矩阵加载器
 * 矩阵雨风格的加载动画
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useEffect, useState } from 'react';

export interface MatrixLoaderProps {
  columns?: number;
  rows?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'cyan';
  className?: string;
}

export function MatrixLoader({
  columns = 10,
  rows = 8,
  size = 'md',
  color = 'green',
  className,
}: MatrixLoaderProps) {
  const [activeCells, setActiveCells] = useState<Set<string>>(new Set());

  const sizes = {
    sm: 'w-2 h-3',
    md: 'w-3 h-4',
    lg: 'w-4 h-6',
  };

  const colors = {
    green: {
      bg: 'bg-cyber-green',
      glow: 'text-cyber-green',
      dim: 'bg-cyber-green/20',
    },
    cyan: {
      bg: 'bg-cyber-cyan',
      glow: 'text-cyber-cyan',
      dim: 'bg-cyber-cyan/20',
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // 随机激活一些单元格
      const newActiveCells = new Set<string>();
      const numActive = Math.floor(Math.random() * 5) + 3;

      for (let i = 0; i < numActive; i++) {
        const col = Math.floor(Math.random() * columns);
        const row = Math.floor(Math.random() * rows);
        newActiveCells.add(`${col}-${row}`);
      }

      setActiveCells(newActiveCells);
    }, 150);

    return () => clearInterval(interval);
  }, [columns, rows]);

  return (
    <div className={cn('font-mono', className)}>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, colIndex) => {
            const key = `${colIndex}-${rowIndex}`;
            const isActive = activeCells.has(key);

            return (
              <AnimatePresence key={key}>
                <motion.div
                  className={cn(
                    'rounded-sm transition-colors',
                    sizes[size],
                    isActive ? colors[color].bg : colors[color].dim
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              </AnimatePresence>
            );
          })
        )}
      </div>

      {/* 加载文本 */}
      <motion.p
        className={cn(
          'text-center mt-4 text-sm font-mono tracking-widest',
          colors[color].glow
        )}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        MATRIX LOADING...
      </motion.p>
    </div>
  );
}
