'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  target?: HTMLElement | string;
  showLabel?: boolean;
  showPercentage?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export default function ReadingProgress({
  target,
  showLabel = true,
  showPercentage = true,
  color = 'cyan',
}: ReadingProgressProps) {
  const [readingTime, setReadingTime] = useState(0);
  const { scrollYProgress } = useScroll({
    target: typeof target === 'string' ? () => document.querySelector(target) || null : target,
    offset: ['start start', 'end end'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const percentage = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const colorClasses = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
  };

  // 计算阅读时间
  useEffect(() => {
    const targetElement = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (targetElement) {
      const text = targetElement.textContent || '';
      const wordsPerMinute = 200;
      const wordCount = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      setReadingTime(minutes);
    }
  }, [target]);

  return (
    <div className="sticky top-0 z-30 bg-cyber-dark/80 backdrop-blur-sm border-b border-cyber-border">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className="text-sm text-gray-400">
              阅读进度 · {readingTime} 分钟
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-mono text-cyber-cyan">
              {percentage.get().toFixed(0)}%
            </span>
          )}
        </div>
        <div className="relative h-1 bg-cyber-darker rounded-full overflow-hidden">
          <motion.div
            className={`absolute top-0 left-0 right-0 bottom-0 ${colorClasses[color]} origin-left`}
            style={{ scaleX }}
          />
        </div>
      </div>
    </div>
  );
}
