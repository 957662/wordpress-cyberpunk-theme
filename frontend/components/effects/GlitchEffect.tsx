/**
 * GlitchEffect - 故障艺术效果
 * 为文本或元素添加赛博朋克风格的故障效果
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchEffectProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  hover?: boolean;
  children?: React.ReactNode;
}

export default function GlitchEffect({
  text,
  className = '',
  intensity = 'medium',
  speed = 'normal',
  hover = false,
  children,
}: GlitchEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  // 强度配置
  const intensityConfig = {
    low: {
      clipCount: 2,
      shiftAmount: 2,
      duration: 0.2,
    },
    medium: {
      clipCount: 4,
      shiftAmount: 5,
      duration: 0.3,
    },
    high: {
      clipCount: 7,
      shiftAmount: 10,
      duration: 0.4,
    },
  };

  // 速度配置
  const speedConfig = {
    slow: 3000,
    normal: 2000,
    fast: 1000,
  };

  // 自动触发故障效果
  useEffect(() => {
    if (!hover) {
      const interval = setInterval(() => {
        triggerGlitch();
      }, speedConfig[speed]);

      return () => clearInterval(interval);
    }
  }, [hover, speed]);

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
    }, intensityConfig[intensity].duration * 1000);
  };

  const config = intensityConfig[intensity];

  return (
    <motion.span
      className={cn('relative inline-block', className)}
      onMouseEnter={hover ? triggerGlitch : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 主文本 */}
      <span className="relative z-10">{children || text}</span>

      {/* 故障切片 1 - 青色 */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0 z-0 text-cyan-400 opacity-70"
          animate={{
            x: [0, -config.shiftAmount, config.shiftAmount, 0],
            clipPath: [
              'inset(0 0 95% 0)',
              'inset(40% 0 30% 0)',
              'inset(80% 0 5% 0)',
              'inset(0 0 95% 0)',
            ],
          }}
          transition={{
            duration: config.duration,
            times: [0, 0.3, 0.7, 1],
          }}
          aria-hidden="true"
        >
          {children || text}
        </motion.span>
      )}

      {/* 故障切片 2 - 紫色 */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0 z-0 text-purple-500 opacity-70"
          animate={{
            x: [0, config.shiftAmount, -config.shiftAmount, 0],
            clipPath: [
              'inset(95% 0 0 0)',
              'inset(30% 0 40% 0)',
              'inset(5% 0 80% 0)',
              'inset(95% 0 0 0)',
            ],
          }}
          transition={{
            duration: config.duration,
            times: [0, 0.3, 0.7, 1],
          }}
          aria-hidden="true"
        >
          {children || text}
        </motion.span>
      )}

      {/* 扫描线效果 */}
      {isGlitching && intensity !== 'low' && (
        <motion.div
          className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: config.duration / 2,
            repeat: 2,
          }}
        />
      )}
    </motion.span>
  );
}
