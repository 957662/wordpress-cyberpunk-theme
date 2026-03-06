'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Link2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Check,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface ShareButtonsProps {
  /**
   * 文章标题
   */
  title: string;

  /**
   * 文章 URL
   */
  url: string;

  /**
   * 文章摘要
   */
  excerpt?: string;

  /**
   * 显示的社交平台
   */
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'whatsapp' | 'link'>;

  /**
   * 按钮样式
   * - 'default': 默认样式
   * - 'minimal': 简约样式
   * - 'filled': 填充样式
   */
  variant?: 'default' | 'minimal' | 'filled';

  /**
   * 按钮大小
   * - 'sm': 小号
   * - 'md': 中号 (默认)
   * - 'lg': 大号
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 自定义类名
   */
  className?: string;
}

// ============================================================================
// Platform Configurations
// ============================================================================

const PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-[#1DA1F2]',
    bgColor: 'bg-[#1DA1F2]',
    hoverBg: 'hover:bg-[#1a8cd8]',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-[#4267B2]',
    bgColor: 'bg-[#4267B2]',
    hoverBg: 'hover:bg-[#365899]',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-[#0077B5]',
    bgColor: 'bg-[#0077B5]',
    hoverBg: 'hover:bg-[#006399]',
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-600 dark:bg-gray-400',
    hoverBg: 'hover:bg-gray-700 dark:hover:bg-gray-500',
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-[#25D366]',
    bgColor: 'bg-[#25D366]',
    hoverBg: 'hover:bg-[#20bd5a]',
  },
  link: {
    name: 'Copy Link',
    icon: Link2,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-600 dark:bg-gray-400',
    hoverBg: 'hover:bg-gray-700 dark:hover:bg-gray-500',
  },
} as const;

// ============================================================================
// Share Button Component
// ============================================================================

interface ShareButtonProps {
  platform: keyof typeof PLATFORMS;
  onClick: () => void;
  variant: 'default' | 'minimal' | 'filled';
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  platform,
  onClick,
  variant,
  size,
  showLabel = false,
}) => {
  const config = PLATFORMS[platform];
  const Icon = config.icon;

  // Size mapping
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Variant styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return cn(
          'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
          'transition-colors duration-200'
        );
      case 'filled':
        return cn(
          config.bgColor,
          'text-white hover:opacity-90',
          'transition-opacity duration-200'
        );
      default:
        return cn(
          'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900',
          'hover:border-gray-400 dark:hover:border-gray-600',
          'transition-colors duration-200'
        );
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg',
        sizeClasses[size],
        getVariantClasses()
      )}
      aria-label={`Share on ${config.name}`}
    >
      <Icon size={iconSize[size]} />
      {showLabel && (
        <span className="text-sm font-medium">{config.name}</span>
      )}
    </motion.button>
  );
};

// ============================================================================
// Copy Link Button Component
// ============================================================================

interface CopyLinkButtonProps {
  url: string;
  variant: 'default' | 'minimal' | 'filled';
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  url,
  variant,
  size,
  showLabel = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Size mapping
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg',
        sizeClasses[size],
        copied
          ? 'bg-green-500 text-white'
          : variant === 'minimal'
          ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          : variant === 'filled'
          ? 'bg-gray-600 dark:bg-gray-400 text-white hover:opacity-90'
          : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600',
        'transition-all duration-200'
      )}
      aria-label="Copy link"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Check size={iconSize[size]} />
            {showLabel && <span className="text-sm font-medium">已复制</span>}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Copy size={iconSize[size]} />
            {showLabel && <span className="text-sm font-medium">复制链接</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ============================================================================
// Main Share Buttons Component
// ============================================================================

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  excerpt,
  platforms = ['twitter', 'facebook', 'linkedin', 'email', 'link'],
  variant = 'default',
  size = 'md',
  className,
}) => {
  // Share handlers
  const shareHandlers = {
    twitter: () => {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    },
    facebook: () => {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    },
    linkedin: () => {
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    },
    email: () => {
      const subject = encodeURIComponent(title);
      const body = excerpt
        ? encodeURIComponent(`${excerpt}\n\n${url}`)
        : encodeURIComponent(url);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },
    whatsapp: () => {
      const text = encodeURIComponent(`${title}\n\n${url}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    },
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {platforms.map((platform) => {
        if (platform === 'link') {
          return (
            <CopyLinkButton
              key={platform}
              url={url}
              variant={variant}
              size={size}
            />
          );
        }

        return (
          <ShareButton
            key={platform}
            platform={platform}
            onClick={shareHandlers[platform]}
            variant={variant}
            size={size}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// Floating Share Button Component
// ============================================================================

interface FloatingShareButtonProps {
  title: string;
  url: string;
  excerpt?: string;
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'whatsapp' | 'link'>;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({
  title,
  url,
  excerpt,
  platforms = ['twitter', 'facebook', 'linkedin', 'link'],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Expandable Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl"
          >
            <ShareButtons
              title={title}
              url={url}
              excerpt={excerpt}
              platforms={platforms}
              variant="minimal"
              size="md"
              className="flex-col"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-4 rounded-full shadow-lg',
          'bg-gradient-to-r from-cyan-500 to-purple-500 text-white',
          'hover:shadow-cyan-500/25 transition-all duration-200'
        )}
        aria-label="Share"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Copy size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Share2 size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ShareButtons;
