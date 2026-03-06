'use client';

import React from 'react';

export interface NeonTextProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * 霓虹发光文字组件
 *
 * @param children - 文字内容
 * @param color - 霓虹颜色
 * @param size - 文字大小
 * @param intensity - 发光强度
 * @param className - 自定义类名
 * @param as - 渲染的 HTML 标签
 */
export const NeonText: React.FC<NeonTextProps> = ({
  children,
  color = 'cyan',
  size = 'md',
  intensity = 'medium',
  className = '',
  as: Component = 'span'
}) => {
  const colorMap = {
    cyan: {
      text: '#00f0ff',
      shadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff'
    },
    purple: {
      text: '#9d00ff',
      shadow: '0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff'
    },
    pink: {
      text: '#ff0080',
      shadow: '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080'
    },
    yellow: {
      text: '#f0ff00',
      shadow: '0 0 5px #f0ff00, 0 0 10px #f0ff00, 0 0 20px #f0ff00'
    },
    green: {
      text: '#00ff88',
      shadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88'
    }
  };

  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const intensityMap = {
    low: {
      shadow: '0 0 2px currentColor, 0 0 4px currentColor'
    },
    medium: {
      shadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
    },
    high: {
      shadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
    }
  };

  const selectedColor = colorMap[color];
  const selectedSize = sizeMap[size];
  const selectedIntensity = intensityMap[intensity];

  const style: React.CSSProperties = {
    color: selectedColor.text,
    textShadow: selectedIntensity.shadow,
    fontWeight: 'bold'
  };

  return (
    <Component
      className={`${selectedSize} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};

export default NeonText;
