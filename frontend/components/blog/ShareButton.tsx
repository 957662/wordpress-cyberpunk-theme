'use client';

/**
 * 分享按钮组件
 * 支持多平台分享、复制链接、生成二维码
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Check,
  X,
  QrCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  onShare?: (platform: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showPlatforms?: boolean;
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy' | 'qrcode'>;
  className?: string;
}

const PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'hover:bg-sky-500/20 hover:text-sky-500 hover:border-sky-500',
    shareUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:bg-blue-600/20 hover:text-blue-600 hover:border-blue-600',
    shareUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'hover:bg-blue-700/20 hover:text-blue-700 hover:border-blue-700',
    shareUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: 'hover:bg-yellow-500/20 hover:text-yellow-500 hover:border-yellow-500',
    shareUrl: (url: string, title: string, description: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
  },
} as const;

export function ShareButton({
  url: propUrl,
  title = '精彩文章推荐',
  description = '',
  onShare,
  size = 'md',
  variant = 'default',
  showPlatforms = true,
  platforms = ['twitter', 'facebook', 'linkedin', 'email', 'copy'],
  className = '',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // 获取当前页面 URL
  const url = propUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // 处理分享
  const handleShare = useCallback(
    async (platform: string) => {
      if (platform === 'copy') {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast.success('链接已复制到剪贴板');
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          toast.error('复制失败');
          console.error('复制失败:', error);
        }
      } else if (platform === 'qrcode') {
        setShowQrCode(true);
      } else {
        const platformData = PLATFORMS[platform as keyof typeof PLATFORMS];
        if (platformData) {
          const shareUrl = platformData.shareUrl(url, title, description);
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      }

      onShare?.(platform);
      setIsOpen(false);
    },
    [url, title, description, onShare]
  );

  // 尺寸样式
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // 变体样式
  const variantStyles = {
    default: 'bg-cyber-dark border-cyber-border text-cyber-muted hover:text-cyber-cyan hover:border-cyber-cyan',
    outline: 'border-cyber-border text-cyber-muted hover:text-cyber-cyan hover:border-cyber-cyan bg-transparent',
    ghost: 'text-cyber-muted hover:text-cyber-cyan bg-transparent border-0',
  };

  return (
    <div className="relative">
      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg border transition-all duration-200',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        aria-label="分享"
      >
        <Share2 size={iconSizes[size]} />
        <span className="font-medium">分享</span>
      </motion.button>

      {/* 分享面板 */}
      <AnimatePresence>
        {isOpen && showPlatforms && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 bg-cyber-dark border border-cyber-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {/* 标题栏 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
                <h3 className="font-semibold text-white">分享到</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-cyber-muted transition-colors"
                >
                  <X className="w-4 h-4 text-cyber-muted" />
                </button>
              </div>

              {/* 平台列表 */}
              <div className="p-3 grid grid-cols-2 gap-2">
                {platforms.map((platform) => {
                  if (platform === 'copy') {
                    return (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark hover:bg-cyber-muted/50 transition-all"
                      >
                        <div className="relative">
                          <LinkIcon className="w-5 h-5 text-cyber-muted" />
                          {copied && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-green rounded-full"
                            />
                          )}
                        </div>
                        <span className="text-sm text-cyber-muted">
                          {copied ? '已复制' : '复制链接'}
                        </span>
                      </motion.button>
                    );
                  }

                  if (platform === 'qrcode') {
                    return (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare('qrcode')}
                        className="flex items-center gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark hover:bg-cyber-muted/50 transition-all"
                      >
                        <QrCode className="w-5 h-5 text-cyber-cyan" />
                        <span className="text-sm text-cyber-muted">二维码</span>
                      </motion.button>
                    );
                  }

                  const platformData = PLATFORMS[platform];
                  const Icon = platformData.icon;

                  return (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleShare(platform)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border border-cyber-border',
                        'bg-cyber-dark transition-all',
                        platformData.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{platformData.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* URL 预览 */}
              <div className="px-4 py-3 border-t border-cyber-border bg-cyber-muted/30">
                <p className="text-xs text-cyber-muted mb-1">分享链接:</p>
                <p className="text-sm text-cyber-cyan truncate">{url}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 二维码模态框 */}
      <AnimatePresence>
        {showQrCode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowQrCode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-cyber-dark border border-cyber-border rounded-lg p-6 max-w-sm w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">扫码分享</h3>
                  <button
                    onClick={() => setShowQrCode(false)}
                    className="p-1 rounded hover:bg-cyber-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-cyber-muted" />
                  </button>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="w-64 h-64 bg-white rounded-lg p-4">
                    {/* 这里应该使用实际的二维码生成库 */}
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500 text-sm text-center">
                        QR Code
                        <br />
                        {url.slice(0, 30)}...
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-cyber-muted text-center">
                  使用手机扫描二维码快速访问
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 快速分享按钮组 (仅图标)
 */
export interface QuickShareProps {
  url?: string;
  title?: string;
  className?: string;
}

export function QuickShare({ url, title, className = '' }: QuickShareProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ShareButton url={url} title={title} size="sm" variant="ghost" showPlatforms={false} />
    </div>
  );
}

export default ShareButton;
