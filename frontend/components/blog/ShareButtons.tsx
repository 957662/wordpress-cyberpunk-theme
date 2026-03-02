'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  MessageCircle,
  Mail,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  /**
   * 要分享的标题
   */
  title: string;

  /**
   * 要分享的 URL
   */
  url?: string;

  /**
   * 分享内容描述
   */
  description?: string;

  /**
   * 显示哪些分享按钮
   * @default 'all'
   */
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'email' | 'copy'> | 'all';

  /**
   * 按钮样式
   * @default 'default'
   */
  variant?: 'default' | 'minimal' | 'pill' | 'icon-only';

  /**
   * 按钮大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 是否显示标签
   * @default true
   */
  showLabels?: boolean;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * 分享按钮组件
 *
 * 提供多个平台的分享功能，支持复制链接、社交媒体分享等。
 * 包含复制成功的反馈动画。
 *
 * @example
 * ```tsx
 * <ShareButtons title="文章标题" url="https://example.com/post" />
 * <ShareButtons variant="pill" size="large" />
 * ```
 */
export function ShareButtons({
  title,
  url: propUrl,
  description = '',
  platforms = 'all',
  variant = 'default',
  size = 'medium',
  showLabels = true,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // 获取当前页面 URL
  const url = propUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // 编码 URL 参数
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  // 分享平台配置
  const allPlatforms = [
    {
      id: 'twitter' as const,
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: 'facebook' as const,
      name: 'Facebook',
      icon: Facebook,
      color: '#4267B2',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 'linkedin' as const,
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'whatsapp' as const,
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      shareUrl: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      id: 'email' as const,
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      shareUrl: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    },
    {
      id: 'copy' as const,
      name: '复制链接',
      icon: Link2,
      color: '#00f0ff',
      action: 'copy',
    },
  ];

  // 过滤要显示的平台
  const activePlatforms =
    platforms === 'all' ? allPlatforms : allPlatforms.filter((p) => platforms.includes(p.id));

  // 复制链接到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('链接已复制到剪贴板');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('复制失败，请手动复制');
    }
  };

  // 处理分享点击
  const handleShare = (platform: typeof allPlatforms[0]) => {
    if (platform.id === 'copy') {
      copyToClipboard();
    } else {
      window.open(platform.shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  // 尺寸配置
  const sizeClasses = {
    small: 'p-2 text-sm',
    medium: 'p-2.5 text-base',
    large: 'p-3 text-lg',
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  // 变体样式
  const getVariantClasses = (color: string, isActive: boolean) => {
    const baseClasses = 'flex items-center gap-2 rounded-lg transition-all duration-200';

    if (variant === 'minimal') {
      return `${baseClasses} text-gray-400 hover:text-white hover:bg-cyber-muted/50`;
    }

    if (variant === 'pill') {
      return `${baseClasses} px-4 py-2 bg-cyber-dark/80 backdrop-blur-sm border border-gray-800 hover:border-[${color}] hover:shadow-lg hover:shadow-[${color}]/20`;
    }

    if (variant === 'icon-only') {
      return `${baseClasses} ${sizeClasses[size]} hover:scale-110 active:scale-95`;
    }

    // default
    return `${baseClasses} ${sizeClasses[size]} bg-cyber-dark/80 backdrop-blur-sm border border-gray-800 hover:border-[${color}] hover:bg-[${color}]/10 hover:shadow-lg hover:shadow-[${color}]/20`;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {activePlatforms.map((platform) => {
        const Icon = platform.icon;
        const isCopied = platform.id === 'copy' && copied;
        const displayIcon = isCopied ? Check : Icon;

        return (
          <motion.button
            key={platform.id}
            onClick={() => handleShare(platform)}
            className={getVariantClasses(platform.color, isCopied)}
            style={
              variant === 'default' || variant === 'pill'
                ? {
                    borderColor: isCopied ? '#00ff88' : undefined,
                    boxShadow: isCopied ? '0 0 20px rgba(0, 255, 136, 0.3)' : undefined,
                  }
                : undefined
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`分享到${platform.name}`}
          >
            <displayIcon
              className={isCopied ? 'text-green-400' : undefined}
              style={{ color: isCopied ? undefined : platform.color }}
              size={iconSizes[size]}
            />
            {showLabels && variant !== 'icon-only' && (
              <span className="font-medium">{isCopied ? '已复制' : platform.name}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/**
 * 浮动分享按钮组
 */
interface FloatingShareButtonsProps extends Omit<ShareButtonsProps, 'className'> {
  /**
   * 浮动位置
   * @default 'left'
   */
  position?: 'left' | 'right';

  /**
   * 距离底部的距离（像素）
   * @default 120
   */
  bottomOffset?: number;

  /**
   * 是否自动隐藏/显示
   * @default true
   */
  autoHide?: boolean;
}

export function FloatingShareButtons({
  position = 'left',
  bottomOffset = 120,
  autoHide = true,
  ...props
}: FloatingShareButtonsProps) {
  const [isVisible, setIsVisible] = useState(!autoHide);

  // 自动显示/隐藏
  if (autoHide && typeof window !== 'undefined') {
    // 这里可以添加滚动监听逻辑
    // 简化版：始终显示
  }

  const positionClasses = {
    left: 'left-8',
    right: 'right-8',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-40`}
      style={{ bottom: bottomOffset }}
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : position === 'left' ? -50 : 50,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-2">
        <ShareButtons
          {...props}
          platforms={['twitter', 'facebook', 'linkedin', 'copy']}
          variant="icon-only"
          size="medium"
          showLabels={false}
          className="flex-col"
        />
      </div>
    </motion.div>
  );
}

/**
 * 分享统计显示
 */
interface ShareStatsProps {
  /**
   * 分享次数统计
   */
  stats?: {
    twitter?: number;
    facebook?: number;
    linkedin?: number;
    total?: number;
  };

  /**
   * 自定义样式类名
   */
  className?: string;
}

export function ShareStats({ stats, className = '' }: ShareStatsProps) {
  const total = stats?.total || Object.values(stats || {}).reduce((a, b) => a + b, 0);

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-400 ${className}`}>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span>{total} 次分享</span>
      </div>
    </div>
  );
}
