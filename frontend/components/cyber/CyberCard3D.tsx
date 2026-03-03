'use client';

/**
 * CyberCard3D - 赛博朋克风格 3D 卡片组件
 * 支持鼠标悬停时的 3D 倾斜效果和霓虹光晕
 */

import { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// 类型定义
// ============================================================================

export interface CyberCard3DProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'neon' | 'holographic' | 'glitch';
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  intensity?: number; // 倾斜强度 0-10
  perspective?: number; // 透视深度 500-2000
  disabled?: boolean; // 禁用 3D 效果
  onClick?: () => void;
}

// ============================================================================
// 颜色配置
// ============================================================================

const glowColors = {
  cyan: {
    primary: 'rgba(0, 240, 255, 0.3)',
    secondary: 'rgba(0, 240, 255, 0.1)',
    glow: '0 0 30px rgba(0, 240, 255, 0.5)',
  },
  purple: {
    primary: 'rgba(157, 0, 255, 0.3)',
    secondary: 'rgba(157, 0, 255, 0.1)',
    glow: '0 0 30px rgba(157, 0, 255, 0.5)',
  },
  pink: {
    primary: 'rgba(255, 0, 128, 0.3)',
    secondary: 'rgba(255, 0, 128, 0.1)',
    glow: '0 0 30px rgba(255, 0, 128, 0.5)',
  },
  green: {
    primary: 'rgba(0, 255, 136, 0.3)',
    secondary: 'rgba(0, 255, 136, 0.1)',
    glow: '0 0 30px rgba(0, 255, 136, 0.5)',
  },
  yellow: {
    primary: 'rgba(240, 255, 0, 0.3)',
    secondary: 'rgba(240, 255, 0, 0.1)',
    glow: '0 0 30px rgba(240, 255, 0, 0.5)',
  },
};

// ============================================================================
// 组件实现
// ============================================================================

export function CyberCard3D({
  children,
  className,
  variant = 'default',
  glowColor = 'cyan',
  intensity = 5,
  perspective = 1000,
  disabled = false,
  onClick,
}: CyberCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Framer Motion 动画值
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 弹簧配置
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  // 鼠标移动处理
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 计算鼠标相对于卡片中心的位置（-0.5 到 0.5）
    const mouseX = (e.clientX - centerX) / rect.width;
    const mouseY = (e.clientY - centerY) / rect.height;

    setMousePosition({ x: mouseX, y: mouseY });
    x.set(mouseX);
    y.set(mouseY);
  };

  // 鼠标离开处理
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // 样式配置
  const getVariantStyles = () => {
    const colors = glowColors[glowColor];

    switch (variant) {
      case 'neon':
        return {
          background: isHovered
            ? `radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, ${colors.primary}, transparent 50%)`
            : colors.secondary,
          boxShadow: isHovered ? colors.glow : 'none',
          border: `2px solid ${colors.primary}`,
        };

      case 'holographic':
        return {
          background: isHovered
            ? `linear-gradient(${135 + mousePosition.x * 30}deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`
            : colors.secondary,
          boxShadow: isHovered ? colors.glow : 'none',
          border: `2px solid ${colors.primary}`,
        };

      case 'glitch':
        return {
          background: colors.secondary,
          boxShadow: isHovered
            ? `${colors.glow}, inset 0 0 20px ${colors.primary}`
            : 'none',
          border: `2px solid ${colors.primary}`,
        };

      default:
        return {
          background: isHovered ? colors.primary : colors.secondary,
          boxShadow: isHovered ? colors.glow : 'none',
          border: `1px solid ${colors.primary}`,
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        ...getVariantStyles(),
      }}
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        'backdrop-blur-sm',
        disabled && 'cursor-default',
        className
      )}
    >
      {/* 光晕效果层 */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, ${glowColors[glowColor].primary}, transparent 50%)`
              : 'transparent',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* 扫描线效果 */}
      {variant === 'glitch' && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${glowColors[glowColor].primary} 2px,
              ${glowColors[glowColor].primary} 4px
            )`,
          }}
          animate={{
            y: [-20, 20],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      )}

      {/* 内容层 */}
      <motion.div
        className="relative z-10 h-full"
        style={{
          transform: 'translateZ(20px)',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* 边框高光效果 */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            border: `2px solid ${glowColors[glowColor].primary}`,
            boxShadow: `inset 0 0 20px ${glowColors[glowColor].primary}`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// 预设变体
// ============================================================================

export function CyberCard3DNeon(props: Omit<CyberCard3DProps, 'variant'>) {
  return <CyberCard3D {...props} variant="neon" />;
}

export function CyberCard3DHolographic(props: Omit<CyberCard3DProps, 'variant'>) {
  return <CyberCard3D {...props} variant="holographic" />;
}

export function CyberCard3DGlitch(props: Omit<CyberCard3DProps, 'variant'>) {
  return <CyberCard3D {...props} variant="glitch" />;
}

// ============================================================================
// 导出
// ============================================================================

export default CyberCard3D;
