'use client';

import React from 'react';
import { Loader2, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

// =====================================================
// 加载状态类型
// =====================================================

export type LoadingVariant =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'skeleton'
  | 'bar'
  | 'cyber'
  | 'glitch'
  | 'hologram';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingStateProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

// =====================================================
// Spinner 加载器
// =====================================================

function SpinnerLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    cyan: 'text-cyber-cyan border-cyber-cyan',
    purple: 'text-cyber-purple border-cyber-purple',
    pink: 'text-cyber-pink border-cyber-pink',
    green: 'text-cyber-green border-cyber-green',
    yellow: 'text-cyber-yellow border-cyber-yellow',
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} relative`}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="absolute inset-0 rounded-full border-2 border-b-transparent opacity-50" />
    </div>
  );
}

// =====================================================
// Dots 加载器
// =====================================================

function DotsLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const colorClasses = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green',
    yellow: 'bg-cyber-yellow',
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// =====================================================
// Pulse 加载器
// =====================================================

function PulseLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const colorClasses = {
    cyan: 'bg-cyber-cyan shadow-cyber-cyan',
    purple: 'bg-cyber-purple shadow-cyber-purple',
    pink: 'bg-cyber-pink shadow-cyber-pink',
    green: 'bg-cyber-green shadow-cyber-green',
    yellow: 'bg-cyber-yellow shadow-cyber-yellow',
  };

  return (
    <div className="relative">
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full absolute inset-0`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// =====================================================
// Cyber 加载器（赛博朋克风格）
// =====================================================

function CyberLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const colorClasses = {
    cyan: 'border-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink shadow-neon-pink',
    green: 'border-cyber-green',
    yellow: 'border-cyber-yellow',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* 外圈 */}
      <motion.div
        className={`absolute inset-0 border-2 ${colorClasses[color]} rounded-lg`}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          boxShadow: `0 0 20px ${color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : '#ff0080'}`,
        }}
      />

      {/* 内圈 */}
      <motion.div
        className={`absolute inset-4 border ${colorClasses[color]} rounded-lg opacity-50`}
        animate={{
          rotate: [360, 270, 180, 90, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 中心点 */}
      <motion.div
        className={`absolute inset-0 m-auto w-2 h-2 ${colorClasses[color].split(' ')[0]} bg-current rounded-full`}
        animate={{
          scale: [1, 2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 扫描线 */}
      <motion.div
        className={`absolute inset-0 ${colorClasses[color].split(' ')[0]} bg-gradient-to-r from-transparent via-current to-transparent opacity-20`}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformOrigin: 'center',
        }}
      />
    </div>
  );
}

// =====================================================
// Glitch 加载器（故障效果）
// =====================================================

function GlitchLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const text = 'LOADING';
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const colorClasses = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    green: 'text-cyber-green',
    yellow: 'text-cyber-yellow',
  };

  return (
    <div className="relative">
      <motion.span
        className={`${sizeClasses[size]} ${colorClasses[color]} font-bold font-mono`}
        animate={{
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{
              x: [0, -2, 2, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      {/* 故障线 */}
      <motion.div
        className="absolute inset-0 bg-cyber-cyan/20"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: '20%',
        }}
      />
    </div>
  );
}

// =====================================================
// 全息投影加载器
// =====================================================

function HologramLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const colorClasses = {
    cyan: 'border-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink shadow-neon-pink',
    green: 'border-cyber-green',
    yellow: 'border-cyber-yellow',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* 外层光圈 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 border-2 ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1 + i * 0.2, 1.5 + i * 0.2],
            opacity: [1 - i * 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* 中心图标 */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center ${colorClasses[color].split(' ')[0]} text-current`}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Loader2 className="w-1/2 h-1/2" />
      </motion.div>
    </div>
  );
}

// =====================================================
// 骨架屏加载器
// =====================================================

function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <motion.div
        className="h-4 bg-gray-800 rounded"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="h-4 bg-gray-800 rounded w-5/6"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-4 bg-gray-800 rounded w-4/6"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
      />
    </div>
  );
}

// =====================================================
// 进度条加载器
// =====================================================

function BarLoader({
  size = 'md',
  color = 'cyan',
}: {
  size: LoadingSize;
  color: string;
}) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const colorClasses = {
    cyan: 'bg-cyber-cyan shadow-neon-cyan',
    purple: 'bg-cyber-purple shadow-neon-purple',
    pink: 'bg-cyber-pink shadow-neon-pink',
    green: 'bg-cyber-green',
    yellow: 'bg-cyber-yellow',
  };

  return (
    <div className={`${heightClasses[size]} w-full bg-gray-800 rounded-full overflow-hidden`}>
      <motion.div
        className={`h-full ${colorClasses[color]}`}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: '30%',
        }}
      />
    </div>
  );
}

// =====================================================
// 主加载状态组件
// =====================================================

export function LoadingState({
  variant = 'spinner',
  size = 'md',
  color = 'cyan',
  text,
  fullScreen = false,
  className = '',
}: LoadingStateProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader size={size} color={color} />;
      case 'dots':
        return <DotsLoader size={size} color={color} />;
      case 'pulse':
        return <PulseLoader size={size} color={color} />;
      case 'cyber':
        return <CyberLoader size={size} color={color} />;
      case 'glitch':
        return <GlitchLoader size={size} color={color} />;
      case 'hologram':
        return <HologramLoader size={size} color={color} />;
      case 'skeleton':
        return <SkeletonLoader className={className} />;
      case 'bar':
        return <BarLoader size={size} color={color} />;
      default:
        return <SpinnerLoader size={size} color={color} />;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {renderLoader()}
      {text && (
        <motion.p
          className="text-gray-400 text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// =====================================================
// 预设的加载状态
// =====================================================

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <LoadingState variant="cyber" size="xl" text="加载中..." />
    </div>
  );
}

export function ContentLoading() {
  return <LoadingState variant="spinner" size="md" text="加载内容..." />;
}

export function ButtonLoading() {
  return <LoadingState variant="dots" size="sm" />;
}

export function FullScreenLoading() {
  return <LoadingState variant="hologram" size="lg" fullScreen text="处理中..." />;
}

// =====================================================
// 默认导出
// =====================================================

export default LoadingState;
