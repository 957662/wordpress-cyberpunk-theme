'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

export interface CyberAvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  color?: AvatarColor;
  fallback?: string;
  shape?: 'circle' | 'square' | 'rounded';
  glow?: boolean;
  border?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
  editable?: boolean;
  onEdit?: (file: File) => void;
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-24 w-24 text-3xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

const colorClasses = {
  cyan: 'from-cyan-500 to-cyan-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

export const CyberAvatar: React.FC<CyberAvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  color = 'cyan',
  fallback,
  shape = 'circle',
  glow = false,
  border = true,
  status,
  editable = false,
  onEdit,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onEdit) {
      onEdit(file);
    }
  };

  const getFallbackText = () => {
    if (fallback) return fallback;
    return alt
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getShapeClass = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-xl';
      default:
        return 'rounded-full';
    }
  };

  return (
    <div className="relative inline-block">
      <motion.div
        className={cn(
          'relative overflow-hidden',
          'flex items-center justify-center',
          'bg-gradient-to-br',
          colorClasses[color],
          'font-semibold text-white',
          sizeClasses[size],
          getShapeClass(),
          border && 'border-2 border-white/20',
          glow && `shadow-lg shadow-${color}-500/50`,
          className
        )}
        whileHover={editable ? { scale: 1.05 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => editable && fileInputRef.current?.click()}
      >
        {/* 图片 */}
        {src && !imageError ? (
          <>
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
            {/* 编辑遮罩 */}
            {editable && isHovered && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Camera className="h-4 w-4" />
              </div>
            )}
          </>
        ) : (
          <span>{getFallbackText()}</span>
        )}

        {/* 扫描线效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {/* 光晕动画 */}
        {glow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </motion.div>

      {/* 状态指示器 */}
      {status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900',
            statusColors[status],
            size === 'xs' && 'h-1.5 w-1.5',
            size === 'sm' && 'h-2 w-2',
            size === 'xl' && 'h-4 w-4',
            size === '2xl' && 'h-5 w-5'
          )}
        />
      )}

      {/* 文件输入 */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
};

// 头像组
export interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string; fallback?: string }>;
  max?: number;
  size?: AvatarSize;
  color?: AvatarColor;
  glow?: boolean;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  color = 'cyan',
  glow = false,
  className,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'relative -ml-3 first:ml-0',
            'border-2 border-gray-900',
            sizeClasses[size].split(' ')[0].replace('h', 'h-').replace('w', 'w-')
          )}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <CyberAvatar
            {...avatar}
            size={size}
            color={color}
            glow={glow}
            border={false}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'relative -ml-3 flex items-center justify-center',
            'bg-gray-800 border-2 border-gray-900',
            'text-xs font-medium text-gray-400',
            sizeClasses[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default CyberAvatar;
