'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ShareButton {
  platform: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  shareUrl: (url: string, title: string) => string;
}

export interface ShareButtonsProps {
  url: string;
  title?: string;
  description?: string;
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  platforms?: string[];
  className?: string;
  onShare?: (platform: string) => void;
}

const shareButtons: ShareButton[] = [
  {
    platform: 'twitter',
    icon: <Twitter className="w-5 h-5" />,
    label: 'Twitter',
    color: '#1DA1F2',
    shareUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    platform: 'facebook',
    icon: <Facebook className="w-5 h-5" />,
    label: 'Facebook',
    color: '#1877F2',
    shareUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    platform: 'linkedin',
    icon: <Linkedin className="w-5 h-5" />,
    label: 'LinkedIn',
    color: '#0A66C2',
    shareUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    platform: 'whatsapp',
    icon: <MessageCircle className="w-5 h-5" />,
    label: 'WhatsApp',
    color: '#25D366',
    shareUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    platform: 'email',
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    color: '#EA4335',
    shareUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
  {
    platform: 'copy',
    icon: <LinkIcon className="w-5 h-5" />,
    label: '复制链接',
    color: '#6B7280',
    shareUrl: () => '',
  },
];

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    text: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/20',
    hover: 'hover:bg-cyber-cyan/30',
    glow: 'shadow-lg shadow-cyber-cyan/20',
  },
  purple: {
    border: 'border-cyber-purple/50',
    text: 'text-cyber-purple',
    bg: 'bg-cyber-purple/20',
    hover: 'hover:bg-cyber-purple/30',
    glow: 'shadow-lg shadow-cyber-purple/20',
  },
  pink: {
    border: 'border-cyber-pink/50',
    text: 'text-cyber-pink',
    bg: 'bg-cyber-pink/20',
    hover: 'hover:bg-cyber-pink/30',
    glow: 'shadow-lg shadow-cyber-pink/20',
  },
  green: {
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    bg: 'bg-cyber-green/20',
    hover: 'hover:bg-cyber-green/30',
    glow: 'shadow-lg shadow-cyber-green/20',
  },
};

const variantStyles = {
  neon: 'border-2 bg-cyber-dark/80 backdrop-blur-sm',
  holographic: 'border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md',
  minimal: 'border border-gray-700 bg-gray-900/50',
};

const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

const layoutStyles = {
  horizontal: 'flex-row gap-2',
  vertical: 'flex-col gap-2',
  dropdown: 'relative',
};

export function ShareButtons({
  url,
  title = '',
  description = '',
  variant = 'neon',
  color = 'cyan',
  layout = 'horizontal',
  size = 'md',
  showLabel = false,
  platforms,
  className,
  onShare,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const styles = colorStyles[color];

  // 过滤显示的平台
  const displayButtons = platforms
    ? shareButtons.filter((btn) => platforms.includes(btn.platform))
    : shareButtons;

  const handleShare = (button: ShareButton) => {
    if (button.platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      const shareUrl = button.shareUrl(url, title);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
    onShare?.(button.platform);
  };

  // Dropdown 模式
  if (layout === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300',
            variantStyles[variant],
            styles.border,
            styles.text,
            isOpen && styles.glow
          )}
        >
          <Share2 className="w-5 h-5" />
          <span>分享</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={cn(
                  'absolute z-20 mt-2 p-3 rounded-lg border-2',
                  variantStyles[variant],
                  styles.border,
                  styles.glow,
                  'flex flex-col gap-2 min-w-[200px]'
                )}
              >
                {displayButtons.map((button) => (
                  <motion.button
                    key={button.platform}
                    onClick={() => handleShare(button)}
                    whileHover={{ x: 5 }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      styles.hover,
                      styles.bg,
                      button.platform === 'copy' && copied && 'text-green-500'
                    )}
                  >
                    {button.platform === 'copy' && copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      button.icon
                    )}
                    <span>{button.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Horizontal 和 Vertical 模式
  return (
    <div className={cn('flex', layoutStyles[layout], className)}>
      {displayButtons.map((button) => (
        <motion.button
          key={button.platform}
          onClick={() => handleShare(button)}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'flex items-center justify-center rounded-lg transition-all duration-300',
            variantStyles[variant],
            styles.border,
            styles.hover,
            styles.bg,
            sizeStyles[size],
            button.platform === 'copy' && copied && 'border-green-500 text-green-500'
          )}
          title={button.label}
        >
          {button.platform === 'copy' && copied ? (
            <Check className="w-5 h-5" />
          ) : (
            button.icon
          )}
        </motion.button>
      ))}
    </div>
  );
}

// Web Share API (原生分享)
export interface NativeShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function NativeShare({
  url,
  title,
  description,
  className,
}: NativeShareProps) {
  const [isSupported, setIsSupported] = useState(false);

  React.useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!isSupported) return null;

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
        'border-2 border-cyber-cyan/50 bg-cyber-cyan/20',
        'hover:bg-cyber-cyan/30 text-cyber-cyan',
        'transition-all duration-300',
        className
      )}
    >
      <Share2 className="w-5 h-5" />
      <span>分享</span>
    </motion.button>
  );
}

// 文章内联分享按钮
export interface ArticleShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ArticleShare({
  url,
  title,
  description,
  className,
}: ArticleShareProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border-2',
        'border-cyber-cyan/50 bg-cyber-dark/50 backdrop-blur-sm',
        'mt-8 mb-4',
        className
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-cyber-cyan mb-1">分享这篇文章</h3>
        <p className="text-sm text-gray-400">如果喜欢，欢迎分享给更多人</p>
      </div>
      <ShareButtons
        url={url}
        title={title}
        description={description}
        layout="horizontal"
        size="md"
        platforms={['twitter', 'facebook', 'linkedin', 'copy']}
      />
    </div>
  );
}

// 浮动分享按钮
export interface FloatingShareProps extends Omit<ShareButtonsProps, 'layout'> {
  position?: 'left' | 'right';
  offset?: number;
}

export function FloatingShare({
  position = 'left',
  offset = 20,
  ...props
}: FloatingShareProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-40',
        'flex flex-col gap-2 p-3 rounded-xl',
        'border-2 border-cyber-cyan/50 bg-cyber-dark/80 backdrop-blur-sm',
        'shadow-lg shadow-cyber-cyan/20',
        position === 'left' ? 'left-4' : 'right-4'
      )}
      style={{ [position]: offset }}
    >
      <ShareButtons
        {...props}
        layout="vertical"
        size="sm"
        showLabel={false}
        variant="holographic"
      />
    </motion.div>
  );
}

// 预设平台组合
export const platformPresets = {
  social: ['twitter', 'facebook', 'linkedin', 'whatsapp'],
  basic: ['twitter', 'facebook', 'copy'],
  all: ['twitter', 'facebook', 'linkedin', 'whatsapp', 'email', 'copy'],
  minimal: ['twitter', 'copy'],
};

export default ShareButtons;
