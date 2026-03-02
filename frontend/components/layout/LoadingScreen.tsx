'use client';

/**
 * Loading Screen Component
 * 加载屏幕组件 - 赛博朋克风格的加载动画
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// ============================================
// 类型定义
// ============================================

export type LoadingType = 'default' | 'spinner' | 'dots' | 'bar' | 'pulse' | 'cyber';

interface LoadingScreenProps {
  isLoading: boolean;
  type?: LoadingType;
  message?: string;
  progress?: number;
  minDuration?: number;
  onComplete?: () => void;
}

// ============================================
// Sub-Components
// ============================================

const DefaultLoader = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="relative"
  >
    <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
    <Loader2 className="relative w-16 h-16 text-cyan-400 animate-spin" />
  </motion.div>
);

const DotsLoader = () => (
  <div className="flex gap-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-3 h-3 bg-cyan-400 rounded-full"
        initial={{ scale: 0, y: 0 }}
        animate={{
          scale: [0, 1, 0],
          y: [0, -10, 0],
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

const BarLoader = ({ progress = 0 }: { progress?: number }) => (
  <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

const PulseLoader = () => (
  <div className="relative">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute inset-0 bg-cyan-400/30 rounded-full"
        initial={{ scale: 0.8, opacity: 1 }}
        animate={{
          scale: [0.8, 1.5, 0.8],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.4,
        }}
        style={{
          width: '80px',
          height: '80px',
        }}
      />
    ))}
  </div>
);

const CyberLoader = () => (
  <div className="relative w-32 h-32">
    {/* 外圈 */}
    <motion.div
      className="absolute inset-0 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />

    {/* 中圈 */}
    <motion.div
      className="absolute inset-4 border-4 border-purple-500/30 border-b-purple-400 rounded-full"
      animate={{ rotate: -360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />

    {/* 内圈 */}
    <motion.div
      className="absolute inset-8 border-4 border-pink-500/30 border-l-pink-400 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />

    {/* 中心 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="w-4 h-4 bg-cyan-400 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================

export const LoadingScreen = ({
  isLoading,
  type = 'cyber',
  message,
  progress,
  minDuration = 1000,
  onComplete,
}: LoadingScreenProps) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setShouldShow(true);
      setElapsed(0);
    } else {
      // 确保至少显示 minDuration 时间
      const timer = setTimeout(() => {
        setShouldShow(false);
        onComplete?.();
      }, minDuration - elapsed);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration, elapsed, onComplete]);

  // 计时
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 backdrop-blur-sm"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Loader */}
            {type === 'default' && <DefaultLoader />}
            {type === 'spinner' && <DefaultLoader />}
            {type === 'dots' && <DotsLoader />}
            {type === 'bar' && <BarLoader progress={progress} />}
            {type === 'pulse' && <PulseLoader />}
            {type === 'cyber' && <CyberLoader />}

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium text-gray-300"
              >
                {message}
              </motion.p>
            )}

            {/* Progress (if provided) */}
            {progress !== undefined && type !== 'bar' && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{progress}%</span>
                <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Loading Text */}
            <motion.div
              className="flex gap-1 text-xs text-gray-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span>LOADING</span>
              <span className="animate-pulse">...</span>
            </motion.div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-500/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Convenience Components
// ============================================

export const PageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <CyberLoader />
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);

export const InlineLoader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizes[size]} text-cyan-400 animate-spin`} />
    </div>
  );
};

export default LoadingScreen;
