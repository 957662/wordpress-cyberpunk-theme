'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressBarProps {
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  height?: number;
  position?: 'top' | 'bottom';
  showPercentage?: boolean;
  shadow?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  color = 'cyan',
  height = 3,
  position = 'top',
  showPercentage = false,
  shadow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const percentage = Math.round(scrollYProgress.get() * 100);

  return (
    <>
      {/* 进度条 */}
      <motion.div
        className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'} ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        style={{
          height: `${height}px`,
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX,
            backgroundColor: colorMap[color],
            boxShadow: shadow ? `0 0 10px ${colorMap[color]}, 0 0 20px ${colorMap[color]}` : 'none',
          }}
        />
      </motion.div>

      {/* 百分比显示 */}
      {showPercentage && isVisible && (
        <div
          className={`fixed z-50 px-3 py-1 rounded-full text-xs font-bold ${
            position === 'top' ? 'top-4' : 'bottom-4'
          } right-4 transition-opacity duration-300`}
          style={{
            backgroundColor: `${colorMap[color]}20`,
            border: `1px solid ${colorMap[color]}`,
            color: colorMap[color],
            boxShadow: shadow ? `0 0 10px ${colorMap[color]}40` : 'none',
          }}
        >
          {percentage}%
        </div>
      )}
    </>
  );
};

export default ReadingProgressBar;
