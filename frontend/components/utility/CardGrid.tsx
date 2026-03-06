'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={cn(
      'grid',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// 赛博朋克风格卡片容器
export const CyberCard: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'border' | 'gradient';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ children, variant = 'default', hover = true, clickable = false, onClick, className }) => {
  const variantClasses = {
    default: 'bg-cyber-dark/50 border border-cyber-cyan/20',
    glow: 'bg-cyber-dark/50 border border-cyber-cyan/30 shadow-lg shadow-cyber-cyan/10',
    border: 'bg-cyber-dark/30 border-2 border-cyber-cyan/40',
    gradient: 'bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 border border-cyber-cyan/20'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variantClasses[variant],
        hover && 'hover:shadow-xl hover:shadow-cyber-cyan/20',
        clickable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// 玻璃态卡片
export const GlassCard: React.FC<{
  children: React.ReactNode;
  blur?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, blur = 'md', className }) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  return (
    <div className={cn(
      'bg-white/5 border border-white/10 rounded-xl p-6',
      blurClasses[blur],
      className
    )}>
      {children}
    </div>
  );
};

// 全息卡片
export const HolographicCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(
      'relative bg-gradient-to-br from-cyber-cyan/5 via-cyber-purple/5 to-cyber-pink/5',
      'border border-cyber-cyan/30 rounded-xl p-6',
      'overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-br',
      'before:from-cyber-cyan/10 before:to-transparent before:opacity-0',
      'hover:before:opacity-100 before:transition-opacity before:duration-300',
      className
    )}>
      {/* 扫描线效果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent opacity-20 animate-pulse" />
      {children}
    </div>
  );
};

// 可折叠卡片
export const CollapsibleCard: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, children, defaultOpen = false, icon, className }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn(
      'bg-cyber-dark/50 border border-cyber-cyan/20 rounded-xl overflow-hidden',
      className
    )}>
      {/* 头部 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-6 py-4 flex items-center justify-between',
          'hover:bg-cyber-cyan/5 transition-colors'
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-cyber-cyan">{icon}</div>}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* 内容 */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// 统计卡片网格（带动画）
export const AnimatedStatGrid: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const items = React.Children.toArray(children);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * 0.1 }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
};

export default CardGrid;
