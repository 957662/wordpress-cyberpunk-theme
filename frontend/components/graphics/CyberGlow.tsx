'use client';

import React from 'react';

export interface CyberGlowProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  hover?: boolean;
}

/**
 * 赛博发光容器组件
 * 为子元素添加霓虹发光效果
 *
 * @param children - 子元素
 * @param color - 发光颜色
 * @param intensity - 发光强度
 * @param className - 自定义类名
 * @param as - 渲染的 HTML 标签
 * @param hover - 是否仅在悬停时显示发光效果
 */
export const CyberGlow: React.FC<CyberGlowProps> = ({
  children,
  color = 'cyan',
  intensity = 'medium',
  className = '',
  as: Component = 'div',
  hover = false
}) => {
  const colorMap = {
    cyan: 'rgba(0, 240, 255, ',
    purple: 'rgba(157, 0, 255, ',
    pink: 'rgba(255, 0, 128, ',
    yellow: 'rgba(240, 255, 0, ',
    green: 'rgba(0, 255, 136, '
  };

  const intensityMap = {
    low: { opacity: 0.3, spread: 10 },
    medium: { opacity: 0.5, spread: 20 },
    high: { opacity: 0.7, spread: 30 }
  };

  const selectedColor = colorMap[color];
  const selectedIntensity = intensityMap[intensity];

  const boxShadow = `0 0 ${selectedIntensity.spread}px ${selectedColor}${selectedIntensity.opacity})`;

  const baseStyle: React.CSSProperties = {
    transition: hover ? 'all 0.3s ease' : undefined,
    boxShadow: hover ? undefined : boxShadow
  };

  const hoverStyle: React.CSSProperties = hover ? {
    boxShadow: boxShadow
  } : {};

  return (
    <Component
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (hover) {
          (e.currentTarget as HTMLElement).style.boxShadow = boxShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }
      }}
    >
      {children}
    </Component>
  );
};

/**
 * 边框发光组件
 */
export interface CyberBorderGlowProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const CyberBorderGlow: React.FC<CyberBorderGlowProps> = ({
  children,
  color = 'cyan',
  intensity = 'medium',
  className = ''
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88'
  };

  const intensityMap = {
    low: '0 0 5px',
    medium: '0 0 10px',
    high: '0 0 20px'
  };

  const selectedColor = colorMap[color];
  const selectedIntensity = intensityMap[intensity];

  const style: React.CSSProperties = {
    border: `1px solid ${selectedColor}`,
    boxShadow: `${selectedIntensity} ${selectedColor}`,
    transition: 'all 0.3s ease'
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

/**
 * 全息投影效果组件
 */
export interface HolographicEffectProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  children,
  className = ''
}) => {
  const style: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(157,0,255,0.1) 50%, rgba(255,0,128,0.1) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0,240,255,0.2)',
    boxShadow: '0 0 20px rgba(0,240,255,0.1), inset 0 0 20px rgba(157,0,255,0.1)',
    transition: 'all 0.3s ease'
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default CyberGlow;
