'use client';

import { useEffect, useRef, useState } from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface AnimationWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
  trigger?: boolean;
}

/**
 * 动画包装组件
 * 为子元素添加进入动画效果
 */
export const AnimationWrapper = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 500,
  trigger = true,
  className = '',
  ...props
}: AnimationWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [trigger, delay]);

  const animationClasses = {
    fadeIn: 'animate-fadeIn',
    slideUp: 'animate-slideUp',
    slideDown: 'animate-slideDown',
    slideLeft: 'animate-slideLeft',
    slideRight: 'animate-slideRight',
    scale: 'animate-scale',
    rotate: 'animate-rotate'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-${duration} ${isVisible ? animationClasses[animation] : 'opacity-0'} ${className}`}
      style={{ animationDuration: `${duration}ms`, animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

interface StaggerChildrenProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

/**
 * 交错动画组件
 * 让子元素依次出现
 */
export const StaggerChildren = ({
  children,
  staggerDelay = 100,
  className = '',
  ...props
}: StaggerChildrenProps) => {
  return (
    <div className={className} {...props}>
      {children.map((child, index) => (
        <AnimationWrapper key={index} delay={index * staggerDelay}>
          {child}
        </AnimationWrapper>
      ))}
    </div>
  );
};

interface ParallaxLayerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * 视差滚动层组件
 * 创建视差滚动效果
 */
export const ParallaxLayer = ({
  children,
  speed = 0.5,
  className = '',
  ...props
}: ParallaxLayerProps) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        setOffset(scrolled * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
      {...props}
    >
      {children}
    </div>
  );
};

interface MorphShapeProps {
  from: string;
  to: string;
  duration?: number;
  className?: string;
}

/**
 * 形状变换组件
 * SVG 路径变换动画
 */
export const MorphShape = ({ from, to, duration = 1000, className = '' }: MorphShapeProps) => {
  const [isMorphed, setIsMorphed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMorphed(prev => !prev);
    }, duration);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path
        d={isMorphed ? to : from}
        stroke="#00f0ff"
        strokeWidth="2"
        style={{
          transition: `d ${duration}ms ease-in-out`,
          filter: 'drop-shadow(0 0 4px #00f0ff)'
        }}
      />
    </svg>
  );
};

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

/**
 * 数字计数器组件
 * 动态数字递增动画
 */
export const Counter = ({ from, to, duration = 2000, className = '', format }: CounterProps) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(from + (to - from) * progress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  const displayValue = format ? format(count) : count.toString();

  return (
    <span className={className}>
      {displayValue}
    </span>
  );
};

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

/**
 * 打字机效果组件
 */
export const Typewriter = ({ text, delay = 50, className = '', onComplete }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default AnimationWrapper;
