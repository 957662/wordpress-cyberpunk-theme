/**
 * 头像组件
 * 支持图片、首字母和加载状态
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  /** 图片 URL */
  src?: string;
  /** 备用文本（首字母） */
  alt?: string;
  /** 头像大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 是否带边框 */
  bordered?: boolean;
  /** 边框颜色 */
  borderColor?: 'cyan' | 'purple' | 'pink' | 'yellow';
  /** 是否在线状态 */
  online?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 点击回调 */
  onClick?: () => void;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  full: 'w-full h-full text-xl',
};

const borderColors = {
  cyan: 'border-cyber-cyan shadow-neon-cyan',
  purple: 'border-cyber-purple shadow-neon-purple',
  pink: 'border-cyber-pink shadow-neon-pink',
  yellow: 'border-cyber-yellow shadow-neon-yellow',
};

export function Avatar({
  src,
  alt = '',
  size = 'md',
  bordered = false,
  borderColor = 'cyan',
  online = false,
  className,
  onClick,
}: AvatarProps) {
  const initials = alt
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const Content = () => (
    <>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-full"
        />
      ) : (
        <span className="font-medium">{initials}</span>
      )}

      {online && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-0 right-0 w-3 h-3 bg-cyber-green border-2 border-cyber-dark rounded-full"
        />
      )}
    </>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative rounded-full overflow-hidden bg-cyber-card flex items-center justify-center',
        'text-white font-medium',
        sizeStyles[size],
        bordered && `border-2 ${borderColors[borderColor]}`,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Content />
    </motion.div>
  );
}
