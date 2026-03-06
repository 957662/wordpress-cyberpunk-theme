/**
 * 社交分享组件
 * 支持多个社交平台的文章分享功能
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
  Copy,
  Mail,
  MessageCircle,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialShareProps {
  /**
   * 文章标题
   */
  title: string;
  /**
   * 文章 URL
   */
  url: string;
  /**
   * 文章描述（可选）
   */
  description?: string;
  /**
   * 标签（可选）
   */
  tags?: string[];
  /**
   * 显示方向
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 是否显示标签
   */
  showLabels?: boolean;
  /**
   * 自定义样式类名
   */
  className?: string;
}

const socialPlatforms = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-gray-400 hover:text-[#1DA1F2]',
    bgColor: 'hover:bg-[#1DA1F2]/10',
    getUrl: (title: string, url: string, tags?: string[]) => {
      const hashtags = tags?.join(',') || '';
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    },
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-gray-400 hover:text-[#4267B2]',
    bgColor: 'hover:bg-[#4267B2]/10',
    getUrl: (title: string, url: string) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    },
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-gray-400 hover:text-[#0077B5]',
    bgColor: 'hover:bg-[#0077B5]/10',
    getUrl: (title: string, url: string, description?: string) => {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`;
    },
  },
  {
    name: 'WeChat',
    icon: MessageCircle,
    color: 'text-gray-400 hover:text-[#07C160]',
    bgColor: 'hover:bg-[#07C160]/10',
    action: 'qrcode',
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'text-gray-400 hover:text-cyber-cyan',
    bgColor: 'hover:bg-cyber-cyan/10',
    getUrl: (title: string, url: string, description?: string) => {
      const body = description ? `${description}\n\n${url}` : url;
      return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    },
  },
  {
    name: 'Copy Link',
    icon: Link2,
    color: 'text-gray-400 hover:text-cyber-purple',
    bgColor: 'hover:bg-cyber-purple/10',
    action: 'copy',
  },
];

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function SocialShare({
  title,
  url,
  description,
  tags,
  direction = 'horizontal',
  size = 'md',
  showLabels = false,
  className,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    if (platform.action === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform.action === 'qrcode') {
      setShowQRCode(!showQRCode);
    } else if (platform.getUrl) {
      const shareUrl = platform.getUrl(title, url, description || tags?.join(', '));
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div
      className={cn(
        'relative',
        direction === 'horizontal' ? 'flex items-center gap-2' : 'flex flex-col gap-2',
        className
      )}
    >
      {/* 分享按钮 */}
      <div className={cn('flex gap-2', direction === 'vertical' && 'flex-col')}>
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <motion.button
              key={platform.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare(platform)}
              className={cn(
                'flex items-center justify-center rounded-lg transition-all duration-300',
                'border border-cyber-border/50',
                'bg-cyber-dark/50 backdrop-blur-sm',
                sizeStyles[size],
                platform.color,
                platform.bgColor
              )}
              title={platform.name}
            >
              <Icon className={iconSizeStyles[size]} />
            </motion.button>
          );
        })}
      </div>

      {/* 标签 */}
      {showLabels && direction === 'horizontal' && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Share2 className="w-4 h-4" />
          <span>分享</span>
        </div>
      )}

      {/* 复制成功提示 */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={cn(
              'absolute z-50 px-3 py-2 rounded-lg',
              'bg-cyber-cyan/10 border border-cyber-cyan',
              'text-cyber-cyan text-sm font-medium',
              'flex items-center gap-2',
              direction === 'vertical' ? 'right-full mr-2' : 'top-full mt-2'
            )}
          >
            <Check className="w-4 h-4" />
            <span>链接已复制</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 二维码弹窗 */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              className="relative p-6 bg-cyber-dark border border-cyber-border rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQRCode(false)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>

              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-4">扫码分享</h3>

                {/* 这里可以集成真实的二维码库，如 qrcode.react */}
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                  <p className="text-gray-800 text-sm">二维码区域</p>
                  <p className="text-gray-600 text-xs mt-2">{url}</p>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  使用微信扫描二维码分享
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 简洁版分享按钮（仅显示一个分享图标）
 */
export interface SocialShareButtonProps {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SocialShareButton({
  title,
  url,
  description,
  tags,
  size = 'md',
  className,
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center rounded-lg transition-all duration-300',
          'border border-cyber-border/50',
          'bg-cyber-dark/50 backdrop-blur-sm',
          'text-gray-400 hover:text-cyber-cyan',
          'hover:bg-cyber-cyan/10',
          sizeStyles[size]
        )}
        title="分享"
      >
        {isOpen ? <Copy className={iconSizeStyles[size]} /> : <Share2 className={iconSizeStyles[size]} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <div className="p-3 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-border rounded-xl shadow-xl">
              <SocialShare
                title={title}
                url={url}
                description={description}
                tags={tags}
                direction="vertical"
                size="sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 浮动分享按钮（固定在页面边缘）
 */
export interface FloatingShareProps {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  position?: 'left' | 'right';
  className?: string;
}

export function FloatingShare({
  title,
  url,
  description,
  tags,
  position = 'left',
  className,
}: FloatingShareProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-40',
        'hidden md:flex',
        position === 'left' ? 'left-4' : 'right-4',
        className
      )}
    >
      <div className="flex flex-col gap-3 p-3 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-border rounded-xl shadow-xl">
        <SocialShare
          title={title}
          url={url}
          description={description}
          tags={tags}
          direction="vertical"
          size="sm"
          showLabels={false}
        />
      </div>
    </motion.div>
  );
}

/**
 * 文章底部分享卡片
 */
export interface ShareCardProps {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  className?: string;
}

export function ShareCard({
  title,
  url,
  description,
  tags,
  className,
}: ShareCardProps) {
  return (
    <div
      className={cn(
        'cyber-card p-6',
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyber-cyan/10">
          <Share2 className="w-5 h-5 text-cyber-cyan" />
        </div>
        <div>
          <h3 className="text-white font-medium">分享这篇文章</h3>
          <p className="text-sm text-gray-400">让更多人看到有价值的内容</p>
        </div>
      </div>

      <SocialShare
        title={title}
        url={url}
        description={description}
        tags={tags}
        direction="horizontal"
        size="md"
      />
    </div>
  );
}

export default SocialShare;
