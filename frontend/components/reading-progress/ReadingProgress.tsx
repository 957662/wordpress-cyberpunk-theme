'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReadingProgressProps {
  className?: string;
  position?: 'top' | 'bottom';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  height?: number;
  showPercentage?: boolean;
  percentagePosition?: 'left' | 'center' | 'right';
}

const colorClasses = {
  cyan: 'from-cyan-400 to-cyan-600 shadow-cyan-500/50',
  purple: 'from-purple-400 to-purple-600 shadow-purple-500/50',
  pink: 'from-pink-400 to-pink-600 shadow-pink-500/50',
  green: 'from-green-400 to-green-600 shadow-green-500/50',
};

export function ReadingProgress({
  className,
  position = 'top',
  color = 'cyan',
  height = 3,
  showPercentage = false,
  percentagePosition = 'right',
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      
      const currentProgress = scrollableHeight > 0 
        ? (scrollTop / scrollableHeight) * 100 
        : 0;
      
      setProgress(Math.min(100, Math.max(0, currentProgress)));
      
      // Show/hide based on scroll position
      setIsVisible(scrollTop > 100);
    };

    // Initial check
    handleScroll();

    // Throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'fixed left-0 right-0 z-50 bg-cyber-dark/80 backdrop-blur-sm',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
        style={{ height: `${height + 8}px` }}
      >
        {/* Background Track */}
        <div className="absolute inset-0 bg-gray-800/50" />
        
        {/* Progress Fill */}
        <motion.div
          className={cn(
            'absolute top-0 left-0 h-full bg-gradient-to-r shadow-lg',
            colorClasses[color]
          )}
          style={{ 
            width: `${progress}%`,
            height: `${height}px`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Glow Effect */}
        {progress > 0 && (
          <motion.div
            className={cn(
              'absolute top-0 h-full w-1 bg-gradient-to-b blur-sm',
              colorClasses[color]
            )}
            style={{
              left: `${progress}%`,
              height: `${height + 4}px`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )}
      </motion.div>

      {/* Percentage Display */}
      {showPercentage && isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          className={cn(
            'fixed z-50 px-3 py-1.5 rounded-lg bg-cyber-dark/90 backdrop-blur-sm border border-cyber-cyan/30 text-sm font-medium text-cyber-cyan shadow-lg',
            position === 'top' ? 'top-4' : 'bottom-4',
            percentagePosition === 'left' && 'left-4',
            percentagePosition === 'center' && 'left-1/2 -translate-x-1/2',
            percentagePosition === 'right' && 'right-4'
          )}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </>
  );
}

// Circular Reading Progress Indicator
interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  showPercentage?: boolean;
}

export function CircularReadingProgress({
  size = 60,
  strokeWidth = 4,
  color = 'cyan',
  className,
  showPercentage = true,
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      
      const currentProgress = scrollableHeight > 0 
        ? (scrollTop / scrollableHeight) * 100 
        : 0;
      
      setProgress(Math.min(100, Math.max(0, currentProgress)));
      setIsVisible(scrollTop > 100);
    };

    handleScroll();

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8 
      }}
      transition={{ duration: 0.3 }}
      className={cn('fixed bottom-6 right-6 z-50', className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(26, 26, 46, 0.8)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorMap[color]}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.1 }}
            style={{
              filter: `drop-shadow(0 0 8px ${colorMap[color]})`,
            }}
          />
        </svg>

        {/* Percentage Text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30"
          style={{
            background: colorMap[color],
          }}
        />
      </div>
    </motion.div>
  );
}

// Article Time Estimate Component
interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  className?: string;
}

export function ReadingTime({
  content,
  wordsPerMinute = 200,
  className,
}: ReadingTimeProps) {
  const calculateReadingTime = (text: string): number => {
    // Remove HTML tags
    const cleanText = text.replace(/<[^>]*>/g, '');
    // Count words
    const words = cleanText.trim().split(/\s+/).length;
    // Calculate reading time
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(content);

  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-400', className)}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{readingTime} min read</span>
    </div>
  );
}

export default ReadingProgress;
