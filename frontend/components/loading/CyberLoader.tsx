'use client';

/**
 * CyberPress Platform - CyberLoader Component
 * 赛博朋克风格加载组件
 */

import { motion } from 'framer-motion';
import { HTMLMotionProps } from 'framer-motion';

interface CyberLoaderProps extends HTMLMotionProps<'div'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  text?: string;
}

const sizeMap = {
  sm: { spinner: 24, dots: 8, bars: { w: 2, h: 16 } },
  md: { spinner: 40, dots: 12, bars: { w: 3, h: 24 } },
  lg: { spinner: 64, dots: 16, bars: { w: 4, h: 32 } },
};

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export function CyberLoader({
  size = 'md',
  variant = 'spinner',
  color = 'cyan',
  text,
  className = '',
  ...props
}: CyberLoaderProps) {
  const currentColor = colorMap[color];
  const currentSize = sizeMap[size];

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`} {...props}>
        <motion.div
          className="relative"
          style={{ width: currentSize.spinner, height: currentSize.spinner }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-current"
            style={{ color: currentColor, borderTopColor: currentColor }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-current"
            style={{
              color: `${currentColor}80`,
              borderBottomColor: `${currentColor}80`,
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-transparent border-l-current"
            style={{
              color: `${currentColor}40`,
              borderLeftColor: `${currentColor}40`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Center glow */}
          <motion.div
            className="absolute inset-0 m-auto w-2 h-2 rounded-full"
            style={{ backgroundColor: currentColor }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {text && (
          <motion.p
            className="text-sm font-mono"
            style={{ color: currentColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`} {...props}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: currentSize.dots,
              height: currentSize.dots,
              backgroundColor: currentColor,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
        {text && (
          <span className="ml-2 text-sm font-mono" style={{ color: currentColor }}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`} {...props}>
        <motion.div
          className="rounded-full"
          style={{
            width: currentSize.spinner,
            height: currentSize.spinner,
            backgroundColor: currentColor,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {text && (
          <motion.p
            className="text-sm font-mono"
            style={{ color: currentColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-center gap-1 ${className}`} {...props}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="rounded-sm"
            style={{
              width: currentSize.bars.w,
              height: currentSize.bars.h,
              backgroundColor: currentColor,
            }}
            animate={{
              scaleY: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
        {text && (
          <span className="ml-3 text-sm font-mono" style={{ color: currentColor }}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return null;
}

export default CyberLoader;
