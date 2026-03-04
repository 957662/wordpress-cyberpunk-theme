'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
  progress?: number;
}

export function LoadingScreen({ fullScreen = false, message = '加载中...', progress }: LoadingScreenProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 旋转加载器 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-cyber-cyan/30 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyber-cyan rounded-full" />
      </motion.div>

      {/* 加载文字 */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-gray-400 text-sm"
      >
        {message}
      </motion.p>

      {/* 进度条 */}
      {progress !== undefined && (
        <div className="w-48 h-2 bg-cyber-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cyber-dark z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}

// 骨架屏加载器
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-cyber-card rounded w-3/4 mb-2" />
      <div className="h-4 bg-cyber-card rounded w-1/2 mb-2" />
      <div className="h-4 bg-cyber-card rounded w-5/6" />
    </div>
  );
}

// 脉冲加载器
export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-cyber-cyan rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// 点状加载器
export function DotLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-cyber-cyan rounded-full"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// 进度环加载器
export function CircularProgress({ progress = 0, size = 64 }: { progress?: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-cyber-border"
        />
        {/* 进度圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-cyber-cyan"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
