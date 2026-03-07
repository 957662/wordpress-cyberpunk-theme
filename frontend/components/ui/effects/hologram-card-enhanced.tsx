'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HologramCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 全息效果强度 (0-1)
  enableGlow?: boolean;
  enableReflection?: boolean;
  enableScanlines?: boolean;
  glitchChance?: number; // 故障效果概率 (0-1)
  tiltAmount?: number; // 倾斜角度
  perspective?: number; // 透视深度
  onHover?: (isHovering: boolean) => void;
}

export function HologramCard({
  children,
  className,
  intensity = 0.7,
  enableGlow = true,
  enableReflection = true,
  enableScanlines = true,
  glitchChance = 0.05,
  tiltAmount = 10,
  perspective = 1000,
  onHover,
}: HologramCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);

  // 鼠标位置跟随
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const xValue = (e.clientX - rect.left) / rect.width - 0.5;
    const yValue = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(xValue);
    y.set(yValue);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // 处理鼠标进入/离开
  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    onHover?.(false);
  };

  // 随机故障效果
  useEffect(() => {
    if (!isHovered || glitchChance === 0) return;

    const interval = setInterval(() => {
      if (Math.random() < glitchChance) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, glitchChance]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      className={cn("relative", className)}
    >
      {/* 主卡片 */}
      <motion.div
        className={cn(
          "relative z-10 rounded-xl border",
          "bg-gradient-to-br from-cyber-muted/50 to-cyber-dark/50",
          "backdrop-blur-sm",
          "transition-all duration-300",
          isHovered && "border-cyber-cyan/50"
        )}
        animate={
          isGlitching
            ? {
                x: [0, -2, 2, -2, 0],
                opacity: [1, 0.8, 1, 0.9, 1],
              }
            : {}
        }
        transition={{ duration: 0.2 }}
      >
        {/* 内容 */}
        <div className="relative z-10">{children}</div>

        {/* 扫描线效果 */}
        {enableScanlines && (
          <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 240, 255, ${intensity * 0.03}) 2px,
                    rgba(0, 240, 255, ${intensity * 0.03}) 4px
                  )
                `,
              }}
            />
          </div>
        )}

        {/* 全息发光效果 */}
        {enableGlow && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at ${mousePosition.x}px ${mousePosition.y}px,
                  rgba(0, 240, 255, ${isHovered ? intensity * 0.3 : 0}),
                  transparent 50%
                )
              `,
            }}
            animate={isGlitching ? { opacity: [1, 0.5, 1] } : {}}
          />
        )}

        {/* 边框发光 */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `
                0 0 20px rgba(0, 240, 255, ${intensity * 0.3}),
                inset 0 0 20px rgba(0, 240, 255, ${intensity * 0.1})
              `,
            }}
            animate={isGlitching ? { opacity: [1, 0.5, 1] } : {}}
          />
        )}
      </motion.div>

      {/* 反射层 */}
      {enableReflection && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(0, 240, 255, ${intensity * 0.1}) 0%,
                transparent 50%
              )
            `,
            transform: 'translateZ(-1px) scale(1.02)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* 粒子效果 */}
      {isHovered && (
        <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-cyber-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// 简化版本 - 只有发光效果
export function GlowCard({
  children,
  className,
  color = 'cyan',
  intensity = 0.7,
}: {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  intensity?: number;
}) {
  const colorMap = {
    cyan: 'rgba(0, 240, 255',
    purple: 'rgba(157, 0, 255',
    pink: 'rgba(255, 0, 128',
    green: 'rgba(0, 255, 136',
    yellow: 'rgba(240, 255, 0',
  };

  const baseColor = colorMap[color];

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border",
        "bg-gradient-to-br from-cyber-muted/50 to-cyber-dark/50",
        "backdrop-blur-sm",
        className
      )}
      whileHover={{
        boxShadow: `
          0 0 30px ${baseColor}, ${intensity * 0.4}),
          inset 0 0 30px ${baseColor}, ${intensity * 0.2})
        `,
      }}
    >
      {children}
    </motion.div>
  );
}

// 数据展示卡片
export interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  className?: string;
}

export function DataCard({
  title,
  value,
  unit,
  icon,
  trend,
  color = 'cyan',
  className,
}: DataCardProps) {
  const colorMap = {
    cyan: {
      bg: 'from-cyber-cyan/20 to-cyber-cyan/5',
      border: 'border-cyber-cyan/30',
      text: 'text-cyber-cyan',
      trend: 'text-cyber-cyan',
    },
    purple: {
      bg: 'from-cyber-purple/20 to-cyber-purple/5',
      border: 'border-cyber-purple/30',
      text: 'text-cyber-purple',
      trend: 'text-cyber-purple',
    },
    pink: {
      bg: 'from-cyber-pink/20 to-cyber-pink/5',
      border: 'border-cyber-pink/30',
      text: 'text-cyber-pink',
      trend: 'text-cyber-pink',
    },
    green: {
      bg: 'from-cyber-green/20 to-cyber-green/5',
      border: 'border-cyber-green/30',
      text: 'text-cyber-green',
      trend: 'text-cyber-green',
    },
    yellow: {
      bg: 'from-cyber-yellow/20 to-cyber-yellow/5',
      border: 'border-cyber-yellow/30',
      text: 'text-cyber-yellow',
      trend: 'text-cyber-yellow',
    },
  };

  const colors = colorMap[color];

  return (
    <HologramCard className={className} intensity={0.5}>
      <div className={cn(
        "p-6 rounded-xl",
        "bg-gradient-to-br",
        colors.bg,
        "border",
        colors.border
      )}>
        {/* 标题和图标 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          {icon && (
            <div className={cn("text-xl", colors.text)}>
              {icon}
            </div>
          )}
        </div>

        {/* 数值 */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500">{unit}</span>
          )}
        </div>

        {/* 趋势 */}
        {trend && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-sm font-medium",
            trend.isPositive ? colors.trend : 'text-cyber-pink'
          )}>
            <span className="text-lg">
              {trend.isPositive ? '↑' : '↓'}
            </span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-gray-500 ml-1">vs 上月</span>
          </div>
        )}
      </div>
    </HologramCard>
  );
}

// 状态卡片
export interface StatusCardProps {
  status: 'online' | 'offline' | 'warning' | 'loading';
  title: string;
  description?: string;
  className?: string;
}

export function StatusCard({
  status,
  title,
  description,
  className,
}: StatusCardProps) {
  const statusMap = {
    online: {
      color: 'text-cyber-green',
      bg: 'bg-cyber-green/20',
      border: 'border-cyber-green/30',
      icon: '●',
      label: '在线',
    },
    offline: {
      color: 'text-cyber-pink',
      bg: 'bg-cyber-pink/20',
      border: 'border-cyber-pink/30',
      icon: '●',
      label: '离线',
    },
    warning: {
      color: 'text-cyber-yellow',
      bg: 'bg-cyber-yellow/20',
      border: 'border-cyber-yellow/30',
      icon: '●',
      label: '警告',
    },
    loading: {
      color: 'text-cyber-cyan',
      bg: 'bg-cyber-cyan/20',
      border: 'border-cyber-cyan/30',
      icon: '○',
      label: '加载中',
    },
  };

  const config = statusMap[status];

  return (
    <HologramCard className={className} intensity={0.5}>
      <div className={cn(
        "p-4 rounded-xl flex items-center gap-4",
        "bg-gradient-to-br from-cyber-muted/50 to-cyber-dark/50",
        "border",
        config.border
      )}>
        {/* 状态指示器 */}
        <div className={cn(
          "flex-shrink-0 w-3 h-3 rounded-full",
          config.bg,
          config.color
        )}>
          {status === 'loading' && (
            <motion.div
              className="w-full h-full rounded-full border-2 border-current border-t-transparent animate-spin"
            />
          )}
        </div>

        {/* 文本信息 */}
        <div className="flex-1">
          <h4 className="font-medium text-white">{title}</h4>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>

        {/* 状态标签 */}
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
      </div>
    </HologramCard>
  );
}

export default HologramCard;
