/**
 * CyberPress Animated Icons
 *
 * 带有动画效果的赛博朋克风格图标组件
 *
 * @example
 * ```tsx
 * <PulsingIcon name="cpu" color="cyan" size={48} />
 * <RotatingIcon name="loading" color="purple" size={32} />
 * <GlowingIcon name="shield" color="green" size={40} />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { DynamicIcon } from './IconFactory';

// ==================== 类型定义 ====================

export type AnimatedIconColor = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'red';
export type AnimatedIconSize = number | 'sm' | 'md' | 'lg' | 'xl';

export interface AnimatedIconProps {
  /** 图标名称 */
  name: string;
  /** 颜色主题 */
  color?: AnimatedIconColor;
  /** 图标尺寸 */
  size?: AnimatedIconSize;
  /** 额外的类名 */
  className?: string;
  /** 动画延迟（秒） */
  delay?: number;
  /** 动画持续时间（秒） */
  duration?: number;
}

// ==================== 工具函数 ====================

const getSizeValue = (size: AnimatedIconSize): number => {
  if (typeof size === 'number') return size;
  const sizeMap = { sm: 24, md: 32, lg: 48, xl: 64 };
  return sizeMap[size] || 32;
};

const getColorClass = (color: AnimatedIconColor): string => {
  const colorMap: Record<AnimatedIconColor, string> = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
    green: 'text-cyber-green',
    red: 'text-cyber-red',
  };
  return colorMap[color];
};

const getGlowColor = (color: AnimatedIconColor): string => {
  const colorMap: Record<AnimatedIconColor, string> = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
    red: '#ff4444',
  };
  return colorMap[color];
};

// ==================== 脉冲动画图标 ====================

export interface PulsingIconProps extends AnimatedIconProps {
  /** 脉冲强度 */
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * 带有脉冲发光效果的图标
 */
export const PulsingIcon: React.FC<PulsingIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  delay = 0,
  duration = 2,
  intensity = 'medium'
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);
  const glowColor = getGlowColor(color);

  const intensityMap = {
    low: { opacity: [1, 0.7], scale: [1, 1.05] },
    medium: { opacity: [1, 0.5], scale: [1, 1.1] },
    high: { opacity: [1, 0.3], scale: [1, 1.15] },
  };

  const { opacity, scale } = intensityMap[intensity];

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${className}`.trim()}
      style={{
        width: sizeValue,
        height: sizeValue,
        animationDelay: `${delay}s`,
      }}
    >
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: ${opacity[0]};
            transform: scale(${scale[0]});
            filter: drop-shadow(0 0 4px ${glowColor});
          }
          50% {
            opacity: ${opacity[1]};
            transform: scale(${scale[1]});
            filter: drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 20px ${glowColor});
          }
        }
        .pulse-animation {
          animation: pulse-glow ${duration}s ease-in-out infinite;
        }
      `}</style>
      <div className="pulse-animation">
        <DynamicIcon name={name} size={sizeValue} />
      </div>
    </div>
  );
};

// ==================== 旋转动画图标 ====================

export interface RotatingIconProps extends AnimatedIconProps {
  /** 旋转方向 */
  direction?: 'clockwise' | 'counter-clockwise';
  /** 旋转速度 */
  speed?: 'slow' | 'normal' | 'fast';
}

/**
 * 带有旋转动画的图标
 */
export const RotatingIcon: React.FC<RotatingIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  delay = 0,
  direction = 'clockwise',
  speed = 'normal'
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);

  const speedMap = {
    slow: 4,
    normal: 2,
    fast: 1,
  };

  const rotation = direction === 'clockwise' ? 360 : -360;

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${className}`.trim()}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <style jsx>{`
        @keyframes rotate-icon {
          from { transform: rotate(0deg); }
          to { transform: rotate(${rotation}deg); }
        }
        .rotate-animation {
          animation: rotate-icon ${speedMap[speed]}s linear infinite;
          animation-delay: ${delay}s;
        }
      `}</style>
      <div className="rotate-animation">
        <DynamicIcon name={name} size={sizeValue} />
      </div>
    </div>
  );
};

// ==================== 弹跳动画图标 ====================

export interface BouncingIconProps extends AnimatedIconProps {
  /** 弹跳类型 */
  type?: 'up-down' | 'left-right' | 'diagonal';
}

/**
 * 带有弹跳动画的图标
 */
export const BouncingIcon: React.FC<BouncingIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  delay = 0,
  type = 'up-down'
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);

  const typeMap = {
    'up-down': 'translateY',
    'left-right': 'translateX',
    'diagonal': 'both',
  };

  const transform = typeMap[type];

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${className}`.trim()}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <style jsx>{`
        @keyframes bounce-icon {
          0%, 100% {
            ${transform === 'translateX' || transform === 'both' ? 'transform: translateX(0);' : ''}
            ${transform === 'translateY' || transform === 'both' ? 'transform: translateY(0);' : ''}
          }
          50% {
            ${transform === 'translateX' ? 'transform: translateX(-10px);' : ''}
            ${transform === 'translateY' ? 'transform: translateY(-10px);' : ''}
            ${transform === 'both' ? 'transform: translate(-10px, -10px);' : ''}
          }
        }
        .bounce-animation {
          animation: bounce-icon 1s ease-in-out infinite;
          animation-delay: ${delay}s;
        }
      `}</style>
      <div className="bounce-animation">
        <DynamicIcon name={name} size={sizeValue} />
      </div>
    </div>
  );
};

// ==================== 发光脉冲图标 ====================

export interface GlowingIconProps extends AnimatedIconProps {
  /** 发光强度 */
  glowIntensity?: 'soft' | 'medium' | 'strong';
}

/**
 * 带有强烈发光效果的图标
 */
export const GlowingIcon: React.FC<GlowingIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  delay = 0,
  glowIntensity = 'medium'
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);
  const glowColor = getGlowColor(color);

  const glowMap = {
    soft: { blur: 4, spread: 8 },
    medium: { blur: 8, spread: 16 },
    strong: { blur: 12, spread: 24 },
  };

  const { blur, spread } = glowMap[glowIntensity];

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${className}`.trim()}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 ${blur}px ${glowColor});
          }
          50% {
            filter: drop-shadow(0 0 ${spread}px ${glowColor}) drop-shadow(0 0 ${blur * 2}px ${glowColor});
          }
        }
        .glow-animation {
          animation: glow-pulse 2s ease-in-out infinite;
          animation-delay: ${delay}s;
        }
      `}</style>
      <div className="glow-animation">
        <DynamicIcon name={name} size={sizeValue} />
      </div>
    </div>
  );
};

// ==================== 故障效果图标 ====================

export interface GlitchIconProps extends AnimatedIconProps {
  /** 故障频率 */
  frequency?: 'low' | 'medium' | 'high';
}

/**
 * 带有赛博朋克故障效果的图标
 */
export const GlitchIcon: React.FC<GlitchIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  frequency = 'medium'
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);
  const glowColor = getGlowColor(color);

  const [isGlitching, setIsGlitching] = useState(false);

  const frequencyMap = {
    low: 3000,
    medium: 1500,
    high: 500,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, frequencyMap[frequency]);

    return () => clearInterval(interval);
  }, [frequency]);

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${className}`.trim()}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <style jsx>{`
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(-10deg); filter: drop-shadow(-2px 0 ${glowColor}); }
          40% { transform: skew(10deg); filter: drop-shadow(2px 0 ${glowColor}); }
          60% { transform: skew(-5deg); }
          80% { transform: skew(5deg); filter: drop-shadow(-1px 0 ${glowColor}); }
          100% { transform: skew(0deg); }
        }
        .glitch-animation {
          animation: glitch-skew 0.3s ease-in-out;
        }
      `}</style>
      <div className={isGlitching ? 'glitch-animation' : ''}>
        <DynamicIcon name={name} size={sizeValue} />
      </div>
    </div>
  );
};

// ==================== 打字机图标 ====================

export interface TypingIconProps extends AnimatedIconProps {
  /** 文本内容 */
  text?: string;
  /** 打字速度（毫秒） */
  typingSpeed?: number;
}

/**
 * 带有打字机效果的图标和文本
 */
export const TypingIcon: React.FC<TypingIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  text = '',
  typingSpeed = 100
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!text) return;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText(text.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, typingSpeed]);

  return (
    <div className={`inline-flex items-center gap-3 ${colorClass} ${className}`.trim()}>
      <DynamicIcon name={name} size={sizeValue} />
      {text && (
        <div className="font-mono">
          {displayText}
          <span className="animate-pulse">|</span>
        </div>
      )}
    </div>
  );
};

// ==================== 悬浮动画图标 ====================

export interface FloatingIconProps extends AnimatedIconProps {
  /** 悬浮幅度 */
  amplitude?: 'small' | 'medium' | 'large';
}

/**
 * 带有悬浮动画的图标
 */
export const FloatingIcon: React.FC<FloatingIconProps> = ({
  name,
  color = 'cyan',
  size = 'md',
  className = '',
  delay = 0,
  amplitude = 'medium'
}) => {
  const sizeValue = getSizeValue(size);
  const colorClass = getColorClass(color);

  const amplitudeMap = {
    small: '-5px',
    medium: '-10px',
    large: '-20px',
  };

  const translateY = amplitudeMap[amplitude];

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${className}`.trim()}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <style jsx>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(${translateY}); }
        }
        .float-animation {
          animation: float-icon 3s ease-in-out infinite;
          animation-delay: ${delay}s;
        }
      `}</style>
      <div className="float-animation">
        <DynamicIcon name={name} size={sizeValue} />
      </div>
    </div>
  );
};

// ==================== 导出所有组件 ====================

export default {
  PulsingIcon,
  RotatingIcon,
  BouncingIcon,
  GlowingIcon,
  GlitchIcon,
  TypingIcon,
  FloatingIcon,
};
