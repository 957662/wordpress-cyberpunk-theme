/**
 * 社交分享组件
 * 支持多种社交平台的分享功能
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
  Mail,
  MessageCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast, { Toaster } from 'react-hot-toast';

export interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  platforms?: SocialPlatform[];
  showLabel?: boolean;
  variant?: 'default' | 'minimal' | 'expanded';
}

export type SocialPlatform =
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'whatsapp'
  | 'telegram'
  | 'copy'
  | 'email';

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    hoverColor: string;
    getUrl: (url: string, title: string, description: string) => string;
  }
> = {
  twitter: {
    icon: Twitter,
    label: 'Twitter',
    color: 'bg-gray-800',
    hoverColor: 'hover:bg-gray-700',
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  linkedin: {
    icon: Linkedin,
    label: 'LinkedIn',
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-600',
    getUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-500',
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  whatsapp: {
    icon: MessageCircle,
    label: 'WhatsApp',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-500',
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
  },
  telegram: {
    icon: MessageCircle,
    label: 'Telegram',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-400',
    getUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  copy: {
    icon: Link2,
    label: '复制链接',
    color: 'bg-gray-700',
    hoverColor: 'hover:bg-gray-600',
    getUrl: () => ''
  },
  email: {
    icon: Mail,
    label: '邮件',
    color: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-500',
    getUrl: (url, title, description) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  }
};

const DEFAULT_PLATFORMS: SocialPlatform[] = [
  'twitter',
  'linkedin',
  'facebook',
  'copy'
];

/**
 * 社交分享按钮
 */
export function SocialShare({
  url,
  title = 'Check this out!',
  description = '',
  className,
  platforms = DEFAULT_PLATFORMS,
  showLabel = false,
  variant = 'default'
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // 获取当前页面 URL
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async (platform: SocialPlatform) => {
    const config = PLATFORM_CONFIG[platform];

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('链接已复制到剪贴板');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('复制失败');
      }
    } else {
      const shareUrl = config.getUrl(shareUrl, title, description);
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <>
        <div className={cn('flex items-center gap-2', className)}>
          {platforms.map((platform) => {
            const config = PLATFORM_CONFIG[platform];
            const Icon = config.icon;
            return (
              <motion.button
                key={platform}
                onClick={() => handleShare(platform)}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  'bg-cyber-muted/30 text-gray-400',
                  'hover:text-cyber-cyan hover:bg-cyber-muted/50',
                  platform === 'copy' && copied && 'text-green-400'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={config.label}
              >
                <Icon className="h-4 w-4" />
              </motion.button>
            );
          })}
        </div>
        <Toaster position="bottom-center" />
      </>
    );
  }

  return (
    <>
      <div className={cn('relative', className)}>
        {/* 触发按钮 */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'cyber-button flex items-center gap-2',
            isOpen && 'ring-2 ring-cyber-cyan'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="h-4 w-4" />
          {showLabel && <span>分享</span>}
        </motion.button>

        {/* 下拉菜单 */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 遮罩层 */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* 菜单内容 */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 z-20 w-48 rounded-lg border border-cyber-muted/30 bg-background/95 backdrop-blur-sm p-2 shadow-xl"
              >
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <span className="text-xs font-semibold text-gray-400">分享到</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {platforms.map((platform) => {
                    const config = PLATFORM_CONFIG[platform];
                    const Icon = config.icon;
                    return (
                      <motion.button
                        key={platform}
                        onClick={() => handleShare(platform)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                          'text-left text-sm transition-colors',
                          'hover:bg-cyber-muted/30'
                        )}
                        whileHover={{ x: 4 }}
                      >
                        <div
                          className={cn(
                            'p-1.5 rounded',
                            config.color,
                            config.hoverColor
                          )}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="flex-1 text-gray-300">{config.label}</span>
                        {platform === 'copy' && copied && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* URL 预览 */}
                <div className="mt-3 pt-3 border-t border-cyber-muted/20">
                  <p className="text-xs text-gray-500 truncate px-2">
                    {shareUrl}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}

/**
 * 浮动分享按钮组
 */
export function FloatingShareButtons(props: Omit<SocialShareProps, 'variant'>) {
  return (
    <div
      className={cn(
        'fixed left-4 top-1/2 -translate-y-1/2 z-50',
        'flex flex-col gap-2',
        props.className
      )}
    >
      {(props.platforms || DEFAULT_PLATFORMS).map((platform) => {
        const config = PLATFORM_CONFIG[platform];
        const Icon = config.icon;
        const shareUrl =
          props.url ||
          (typeof window !== 'undefined' ? window.location.href : '');

        return (
          <motion.button
            key={platform}
            onClick={() => {
              const shareUrl = props.url || shareUrl;
              const title = props.title || '';
              const description = props.description || '';

              if (platform === 'copy') {
                navigator.clipboard.writeText(shareUrl);
                toast.success('链接已复制');
              } else {
                const url = config.getUrl(shareUrl, title, description);
                window.open(url, '_blank');
              }
            }}
            className={cn(
              'p-3 rounded-lg shadow-lg',
              'text-white transition-all',
              config.color,
              config.hoverColor,
              'hover:scale-110 active:scale-95'
            )}
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            title={config.label}
          >
            <Icon className="h-5 w-5" />
          </motion.button>
        );
      })}
    </div>
  );
}

/**
 * 内联分享按钮
 */
export function InlineShareButtons(props: Omit<SocialShareProps, 'variant' | 'showLabel'>) {
  return (
    <div className={cn('flex items-center gap-2', props.className)}>
      <span className="text-sm text-gray-400 mr-2">分享:</span>
      <SocialShare {...props} variant="minimal" />
    </div>
  );
}
