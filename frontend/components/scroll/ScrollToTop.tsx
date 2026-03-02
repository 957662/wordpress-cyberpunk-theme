'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToTopProps {
  /**
   * 显示按钮的滚动阈值（像素）
   */
  threshold?: number;

  /**
   * 按钮位置
   */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';

  /**
   * 按钮样式
   */
  variant?: 'circle' | 'rounded' | 'pill';

  /**
   * 按钮大小
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 是否显示文本
   */
  showText?: boolean;

  /**
   * 自定义文本
   */
  text?: string;

  /**
   * 滚动行为
   */
  behavior?: ScrollBehavior;

  /**
   * 是否平滑滚动
   */
  smooth?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 点击回调
   */
  onClick?: () => void;
}

export function ScrollToTop({
  threshold = 300,
  position = 'bottom-right',
  variant = 'circle',
  size = 'md',
  showText = false,
  text = '返回顶部',
  behavior = 'smooth',
  smooth = true,
  className = '',
  style,
  onClick,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    onClick?.();
    window.scrollTo({
      top: 0,
      behavior: smooth ? behavior : 'auto',
    });
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-10 h-10 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-14 h-14 text-lg',
    };
    return sizes[size];
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-8 right-8',
      'bottom-left': 'bottom-8 left-8',
      'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
    };
    return positions[position];
  };

  const getVariantClasses = () => {
    const variants = {
      circle: 'rounded-full',
      rounded: 'rounded-lg',
      pill: 'rounded-full px-6',
    };
    return variants[variant];
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`fixed z-40 ${getPositionClasses()} ${className}`}
        style={style}
      >
        <button
          onClick={scrollToTop}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses()}
            bg-cyber-cyan
            hover:bg-cyber-cyan/80
            text-black
            shadow-lg
            hover:shadow-cyber-cyan/50
            transition-all
            duration-300
            flex
            items-center
            justify-center
            gap-2
            font-medium
            group
            relative
            overflow-hidden
          `}
          aria-label="返回顶部"
        >
          {/* 进度环 */}
          {variant === 'circle' && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(0, 240, 255, 0.2)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - scrollProgress / 100)}`}
                strokeLinecap="round"
                className="text-black/20"
              />
            </svg>
          )}

          {/* 图标 */}
          {variant === 'circle' ? <ChevronUp size={24} /> : <ArrowUp size={20} />}

          {/* 文本 */}
          {showText && variant !== 'circle' && (
            <span className="hidden sm:inline">{text}</span>
          )}

          {/* 悬停效果 */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 滚动进度条组件
 */
interface ScrollProgressProps {
  /**
   * 进度条位置
   */
  position?: 'top' | 'bottom';

  /**
   * 高度
   */
  height?: number;

  /**
   * 颜色
   */
  color?: string;

  /**
   * 渐变色
   */
  gradient?: boolean;

  /**
   * 是否显示百分比
   */
  showPercentage?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

export function ScrollProgress({
  position = 'top',
  height = 3,
  color = '#00f0ff',
  gradient = true,
  showPercentage = false,
  className = '',
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const barStyle = {
    height: `${height}px`,
    width: `${scrollProgress}%`,
    backgroundColor: color,
    background: gradient
      ? `linear-gradient(90deg, ${color}, #9d00ff, #ff0080)`
      : color,
  };

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'} ${className}`}
    >
      {/* 进度条 */}
      <div className="w-full bg-gray-800/50">
        <motion.div
          style={barStyle}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 百分比 */}
      {showPercentage && (
        <div className="absolute right-4 -top-6 text-xs text-cyber-cyan font-mono">
          {Math.round(scrollProgress)}%
        </div>
      )}
    </div>
  );
}

/**
 * 滚动指示器组件
 */
export function ScrollIndicator({
  totalSections = 4,
  currentSection = 0,
  onSectionClick,
}: {
  totalSections?: number;
  currentSection?: number;
  onSectionClick?: (index: number) => void;
}) {
  const [activeSection, setActiveSection] = useState(currentSection);

  useEffect(() => {
    setActiveSection(currentSection);
  }, [currentSection]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => {
            onSectionClick?.(index);
            setActiveSection(index);
          }}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeSection === index
              ? 'bg-cyber-cyan w-8'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
          aria-label={`跳转到第 ${index + 1} 部分`}
        />
      ))}
    </div>
  );
}

/**
 * 滚动触发动画组件
 */
export function ScrollReveal({
  children,
  threshold = 0.1,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getDirectionVariants = () => {
    const variants = {
      up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
      down: { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
      left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
      right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    };
    return variants[direction];
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={getDirectionVariants()}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollToTop;
