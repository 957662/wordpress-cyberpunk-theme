'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lucideIconNames } from 'lucide-react';

interface CyberBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof lucideIconNames;
  pulse?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * CyberBadge - 赛博朋克风格徽章
 * 带有发光效果和脉冲动画的标签组件
 */
export const CyberBadge: React.FC<CyberBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  pulse = false,
  glow = true,
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: {
      bg: 'bg-cyber-dark/80',
      border: 'border-cyber-primary',
      text: 'text-cyber-primary',
      shadow: 'shadow-[0_0_10px_rgba(0,240,255,0.3)]'
    },
    success: {
      bg: 'bg-cyber-dark/80',
      border: 'border-green-500',
      text: 'text-green-500',
      shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]'
    },
    warning: {
      bg: 'bg-cyber-dark/80',
      border: 'border-cyber-warning',
      text: 'text-cyber-warning',
      shadow: 'shadow-[0_0_10px_rgba(240,255,0,0.3)]'
    },
    error: {
      bg: 'bg-cyber-dark/80',
      border: 'border-cyber-accent',
      text: 'text-cyber-accent',
      shadow: 'shadow-[0_0_10px_rgba(255,0,128,0.3)]'
    },
    info: {
      bg: 'bg-cyber-dark/80',
      border: 'border-cyber-secondary',
      text: 'text-cyber-secondary',
      shadow: 'shadow-[0_0_10px_rgba(157,0,255,0.3)]'
    }
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <AnimatePresence>
      <motion.div
        className={`
          relative inline-flex items-center
          ${currentVariant.bg}
          border ${currentVariant.border}
          ${currentVariant.text}
          ${currentSize}
          rounded backdrop-blur-sm
          ${glow ? currentVariant.shadow : ''}
          ${onClick ? 'cursor-pointer' : ''}
          transition-all duration-300
          ${className}
        `}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          opacity: 1,
          boxShadow: isHovered && glow
            ? `0 0 20px ${variant === 'default' ? 'rgba(0,240,255,0.6)' : 'currentColor'}`
            : undefined
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* 脉冲动画 */}
        {pulse && (
          <motion.div
            className={`absolute inset-0 rounded ${currentVariant.border} border`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* 图标 */}
        {icon && (
          <motion.span
            className="flex-shrink-0"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 这里应该渲染图标，但需要动态导入 */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.span>
        )}

        {/* 内容 */}
        <span className="relative z-10 font-medium">{children}</span>

        {/* 装饰角标 */}
        <div className={`absolute top-0 left-0 w-1 h-1 ${currentVariant.text} opacity-50`} />
        <div className={`absolute top-0 right-0 w-1 h-1 ${currentVariant.text} opacity-50`} />
        <div className={`absolute bottom-0 left-0 w-1 h-1 ${currentVariant.text} opacity-50`} />
        <div className={`absolute bottom-0 right-0 w-1 h-1 ${currentVariant.text} opacity-50`} />
      </motion.div>
    </AnimatePresence>
  );
};

export default CyberBadge;
