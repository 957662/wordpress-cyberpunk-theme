/**
 * 全息投影效果组件
 * 3D 全息卡片展示效果
 */

'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HoloProjectorProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 倾斜强度 (1-10)
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green';
  showGrid?: boolean;
  reflective?: boolean;
}

export function HoloProjector({
  children,
  className,
  intensity = 5,
  glowColor = 'cyan',
  showGrid = true,
  reflective = true,
}: HoloProjectorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * (intensity / 5);
    const yPct = (mouseY / height - 0.5) * (intensity / 5);

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowColors = {
    cyan: 'rgba(0, 240, 255, 0.5)',
    purple: 'rgba(157, 0, 255, 0.5)',
    pink: 'rgba(255, 0, 128, 0.5)',
    green: 'rgba(0, 255, 136, 0.5)',
  };

  const borderColors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
  };

  return (
    <div
      ref={ref}
      className={cn('relative perspective-1000', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* 全息光晕 */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-4 rounded-2xl blur-xl"
            style={{
              background: `radial-gradient(circle at center, ${glowColors[glowColor]}, transparent 70%)`,
            }}
          />
        )}

        {/* 主卡片 */}
        <div
          className={cn(
            'relative rounded-xl border backdrop-blur-sm overflow-hidden',
            'transition-all duration-300',
            reflective && 'bg-gradient-to-br from-white/5 to-transparent'
          )}
          style={{
            borderColor: isHovered ? borderColors[glowColor] : 'rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(22, 22, 42, 0.8)',
            boxShadow: isHovered
              ? `0 0 30px ${glowColors[glowColor]}, inset 0 0 20px rgba(255, 255, 255, 0.05)`
              : '0 0 0 transparent',
          }}
        >
          {/* 全息扫描线 */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: `
                  linear-gradient(90deg, ${borderColors[glowColor]}20 1px, transparent 1px),
                  linear-gradient(${borderColors[glowColor]}20 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {/* 扫描动画 */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="w-full h-32"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${glowColors[glowColor]}, transparent)`,
                }}
              />
            </motion.div>
          )}

          {/* 内容 */}
          <div className="relative z-10">{children}</div>

          {/* 反光效果 */}
          {reflective && (
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0"
              animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)',
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 全息投影按钮
 */
export interface HoloButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function HoloButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
}: HoloButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'bg-cyber-cyan text-cyber-dark border-cyber-cyan',
    secondary: 'bg-cyber-purple text-white border-cyber-purple',
    outline: 'bg-transparent text-cyber-cyan border-cyber-cyan',
  };

  return (
    <HoloProjector intensity={3} glowColor={variant === 'secondary' ? 'purple' : 'cyan'}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative font-display font-bold uppercase tracking-wider',
          'border rounded-lg transition-all',
          sizes[size],
          variants[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    </HoloProjector>
  );
}

/**
 * 全息信息卡片
 */
export interface HoloCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  stats?: Array<{ label: string; value: string | number }>;
  actions?: Array<{ label: string; onClick: () => void }>;
  className?: string;
}

export function HoloCard({
  title,
  description,
  icon,
  stats,
  actions,
  className,
}: HoloCardProps) {
  return (
    <HoloProjector className={className} glowColor="cyan">
      <div className="p-6 space-y-4">
        {/* 图标和标题 */}
        <div className="flex items-start gap-4">
          {icon && <div className="text-cyber-cyan">{icon}</div>}
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>

        {/* 统计数据 */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyber-border">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-cyber-cyan">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 操作按钮 */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 pt-4">
            {actions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className="px-4 py-2 text-sm border border-cyber-cyan text-cyber-cyan rounded hover:bg-cyber-cyan hover:text-cyber-dark transition-colors"
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </HoloProjector>
  );
}
