'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CyberCardProps {
  children: ReactNode;
  variant?: 'default' | 'cyan' | 'purple' | 'pink';
  hover?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

export { CyberCardProps };

const variantStyles = {
  default: 'border-cyber-border bg-cyber-card',
  cyan: 'border-cyber-cyan/30 bg-cyber-cyan/5',
  purple: 'border-cyber-purple/30 bg-cyber-purple/5',
  pink: 'border-cyber-pink/30 bg-cyber-pink/5',
};

const glowStyles = {
  default: '',
  cyan: 'hover:shadow-glow-cyan',
  purple: 'hover:shadow-glow-purple',
  pink: 'hover:shadow-glow-pink',
};

export default function CyberCard({
  children,
  variant = 'default',
  hover = true,
  glow = false,
  className = '',
  onClick,
}: CyberCardProps) {
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-lg border p-6
        ${variantStyles[variant]}
        ${glow ? glowStyles[variant] : ''}
        ${hover ? 'hover:border-cyber-cyan/50 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* 角落装饰 */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan/50 rounded-tl" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan/50 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan/50 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan/50 rounded-br" />

      {/* 扫描线效果 */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 via-transparent to-cyber-cyan/5"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </MotionDiv>
  );
}
