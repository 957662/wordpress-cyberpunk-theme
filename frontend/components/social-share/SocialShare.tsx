'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Mail,
  MessageCircle,
  Check,
  Share2,
  X,
  Copy,
  Download,
  Printer
} from 'lucide-react';

/**
 * SocialShare - 社交分享组件
 *
 * 功能特性：
 * - 多平台分享支持
 * - 复制链接
 * - 二维码分享
 * - 邮件分享
 * - 分享统计
 * - 自定义样式
 */

export interface SharePlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  getUrl: (url: string, title: string) => string;
}

export interface SocialShareProps {
  /** 分享URL */
  url?: string;
  /** 分享标题 */
  title?: string;
  /** 分享描述 */
  description?: string;
  /** 分享平台 */
  platforms?: ('facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'copy' | 'qrcode' | 'more')[];
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 显示模式 */
  variant?: 'buttons' | 'icons' | 'compact';
  /** 自定义容器类名 */
  className?: string;
  /** 是否显示标签 */
  showLabels?: boolean;
  /** 是否显示统计 */
  showStats?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// 内置分享平台配置
const BUILT_IN_PLATFORMS: Record<string, SharePlatform> = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    color: '#1877F2',
    hoverColor: '#0d65d9',
    getUrl: (url, title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="w-5 h-5" />,
    color: '#1DA1F2',
    hoverColor: '#0c85d0',
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: '#0A66C2',
    hoverColor: '#004182',
    getUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <MessageCircle className="w-5 h-5" />,
    color: '#25D366',
    hoverColor: '#1da851',
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  email: {
    id: 'email',
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: '#EA4335',
    hoverColor: '#d33426',
    getUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
};

/**
 * 分享按钮组件
 */
interface ShareButtonProps {
  platform: SharePlatform;
  label?: string;
  variant: 'buttons' | 'icons' | 'compact';
  onClick: () => void;
  stats?: number;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  platform,
  label,
  variant,
  onClick,
  stats,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = 'flex items-center justify-center gap-2 rounded-lg transition-all duration-200';
  const variantClasses = {
    buttons: 'px-4 py-2.5 text-white font-medium shadow-lg',
    icons: 'w-12 h-12 text-white shadow-lg',
    compact: 'px-3 py-2 text-white text-sm shadow-md',
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        baseClasses,
        variantClasses[variant],
        'hover:scale-105 active:scale-95'
      )}
      style={{
        backgroundColor: isHovered ? platform.hoverColor : platform.color,
        boxShadow: isHovered ? `0 0 20px ${platform.color}40` : undefined,
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {platform.icon}
      {(variant === 'buttons' || variant === 'compact') && label && (
        <span>{label}</span>
      )}
      {stats !== undefined && stats > 0 && (
        <span className="ml-1 text-xs opacity-75">({stats})</span>
      )}
    </motion.button>
  );
};

/**
 * SocialShare 主组件
 */
export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title = '',
  description = '',
  platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'copy'],
  direction = 'horizontal',
  variant = 'buttons',
  className,
  showLabels = true,
  showStats = false,
  style,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  // 获取当前页面URL
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || (typeof window !== 'undefined' ? document.title : '');

  // 处理分享
  const handleShare = (platformId: string) => {
    if (platformId === 'copy') {
      handleCopy();
      return;
    }

    const platform = BUILT_IN_PLATFORMS[platformId];
    if (platform) {
      const shareUrl = platform.getUrl(shareUrl, shareTitle);
      window.open(shareUrl, '_blank', 'width=600,height=400');

      // 更新统计
      setStats((prev) => ({
        ...prev,
        [platformId]: (prev[platformId] || 0) + 1,
      }));
    }
  };

  // 复制链接
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 复制按钮特殊配置
  const copyPlatform: SharePlatform = {
    id: 'copy',
    name: copied ? '已复制' : '复制链接',
    icon: copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
    color: copied ? '#10B981' : '#6B7280',
    hoverColor: copied ? '#059669' : '#4B5563',
    getUrl: () => '',
  };

  // 渲染分享按钮
  const renderButtons = () => {
    const containerClasses = {
      horizontal: 'flex flex-wrap gap-3',
      vertical: 'flex flex-col gap-3',
    };

    return (
      <div className={containerClasses[direction]}>
        {platforms.map((platformId) => {
          if (platformId === 'more') return null;

          const platform =
            BUILT_IN_PLATFORMS[platformId] ||
            (platformId === 'copy' ? copyPlatform : null);

          if (!platform) return null;

          return (
            <ShareButton
              key={platform.id}
              platform={platform}
              label={showLabels ? platform.name : undefined}
              variant={variant}
              onClick={() => handleShare(platform.id)}
              stats={showStats ? stats[platform.id] : undefined}
            />
          );
        })}
      </div>
    );
  };

  // 紧凑模式渲染
  const renderCompact = () => {
    return (
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => setShowMore(!showMore)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
            'text-white font-medium shadow-lg',
            'hover:scale-105 active:scale-95 transition-transform'
          )}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-5 h-5" />
          <span>分享</span>
        </motion.button>

        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {platforms
                .filter((p) => p !== 'more')
                .slice(0, 4)
                .map((platformId) => {
                  const platform =
                    BUILT_IN_PLATFORMS[platformId] ||
                    (platformId === 'copy' ? copyPlatform : null);

                  if (!platform) return null;

                  return (
                    <motion.button
                      key={platform.id}
                      onClick={() => handleShare(platform.id)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                      style={{ backgroundColor: platform.color }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {platform.icon}
                    </motion.button>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={cn('social-share', className)} style={style}>
      {variant === 'compact' ? renderCompact() : renderButtons()}
    </div>
  );
};

/**
 * 分享工具栏组件（固定在页面底部）
 */
export const ShareToolbar: React.FC<
  Omit<SocialShareProps, 'variant' | 'direction'> & {
    position?: 'bottom' | 'top';
  }
> = ({ position = 'bottom', ...props }) => {
  return (
    <motion.div
      initial={{ y: position === 'bottom' ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        'fixed left-0 right-0 z-50',
        'bg-black/80 backdrop-blur-lg border-t border-white/10',
        'py-4 px-6',
        position === 'bottom' ? 'bottom-0' : 'top-0'
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="text-white font-medium">分享这篇文章</span>
        <SocialShare {...props} variant="icons" />
      </div>
    </motion.div>
  );
};

/**
 * 浮动分享按钮
 */
export const FloatingShareButton: React.FC<SocialShareProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-6 bottom-1/2 transform -translate-y-1/2 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-3 bg-black/90 backdrop-blur-lg rounded-xl border border-white/10 p-3 shadow-2xl"
          >
            <SocialShare {...props} variant="icons" direction="vertical" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full shadow-lg',
          'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
          'text-white flex items-center justify-center',
          'hover:scale-110 transition-transform'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

/**
 * Hook: 获取分享URL
 */
export const useShareUrl = () => {
  return typeof window !== 'undefined' ? window.location.href : '';
};

/**
 * Hook: 复制到剪贴板
 */
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  return { copied, copy };
};

export default SocialShare;
