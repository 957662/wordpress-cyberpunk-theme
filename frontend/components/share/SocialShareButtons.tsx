/**
 * SocialShareButtons - 社交分享按钮组件
 * 赛博朋克风格的社交分享功能
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Check,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface SharePlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  shareUrl: (url: string, title: string, description?: string) => string;
}

const SHARE_PLATFORMS: SharePlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter size={18} />,
    color: '#1DA1F2',
    hoverColor: '#0c85d0',
    shareUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook size={18} />,
    color: '#1877F2',
    hoverColor: '#0c63d4',
    shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin size={18} />,
    color: '#0A66C2',
    hoverColor: '#084d93',
    shareUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail size={18} />,
    color: '#EA4335',
    hoverColor: '#d23425',
    shareUrl: (url, title, description) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || '')}%0A%0A${encodeURIComponent(url)}`,
  },
  {
    id: 'wechat',
    name: 'WeChat',
    icon: <MessageCircle size={18} />,
    color: '#07C160',
    hoverColor: '#06a854',
    shareUrl: () => '#',
  },
];

export function SocialShareButtons({
  url,
  title,
  description,
  className,
  variant = 'horizontal',
  size = 'md',
  showLabel = false,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleShare = (platform: SharePlatform) => {
    const shareUrl = platform.shareUrl(url, title, description);
    if (platform.id === 'wechat') {
      // 微信分享可以显示二维码
      alert('微信分享功能需要扫码，请自行实现');
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const containerClasses = cn(
    'flex gap-2',
    variant === 'vertical' && 'flex-col',
    className
  );

  return (
    <div className={containerClasses}>
      {/* 复制链接按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className={cn(
          'relative overflow-hidden rounded-lg',
          'bg-cyber-dark/80 border border-cyber-cyan/30',
          'flex items-center gap-2',
          'transition-all duration-300',
          'hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          sizeClasses[size]
        )}
        title="复制链接"
      >
        {copied ? (
          <Check className={cn('text-cyber-green', iconSizeClasses[size])} />
        ) : (
          <Copy className={cn('text-cyber-cyan', iconSizeClasses[size])} />
        )}
        {showLabel && (
          <span className="text-sm font-mono text-cyber-cyan">
            {copied ? '已复制' : '复制链接'}
          </span>
        )}
      </motion.button>

      {/* 分享按钮 */}
      {SHARE_PLATFORMS.map((platform) => (
        <motion.button
          key={platform.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare(platform)}
          className={cn(
            'relative overflow-hidden rounded-lg',
            'bg-cyber-dark/80 border',
            'flex items-center gap-2',
            'transition-all duration-300',
            sizeClasses[size]
          )}
          style={{
            borderColor: `${platform.color}50`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = platform.hoverColor;
            e.currentTarget.style.boxShadow = `0 0 20px ${platform.color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${platform.color}50`;
            e.currentTarget.style.boxShadow = 'none';
          }}
          title={platform.name}
        >
          <div style={{ color: platform.color }}>
            {platform.icon}
          </div>
          {showLabel && (
            <span
              className="text-sm font-mono"
              style={{ color: platform.color }}
            >
              {platform.name}
            </span>
          )}
        </motion.button>
      ))}

      {/* 更多选项按钮（移动端） */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title,
              url,
            });
          }
        }}
        className={cn(
          'relative overflow-hidden rounded-lg',
          'bg-cyber-dark/80 border border-cyber-purple/30',
          'flex items-center gap-2',
          'transition-all duration-300',
          'hover:border-cyber-purple hover:shadow-[0_0_20px_rgba(157,0,255,0.3)]',
          sizeClasses[size]
        )}
        title="更多分享"
      >
        <Share2 className={cn('text-cyber-purple', iconSizeClasses[size])} />
        {showLabel && (
          <span className="text-sm font-mono text-cyber-purple">
            分享
          </span>
        )}
      </motion.button>
    </div>
  );
}

// 快速分享按钮（单个按钮）
export function QuickShareButton({
  url,
  title,
  description,
  className,
}: {
  url: string;
  title: string;
  description?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative overflow-hidden rounded-lg',
          'bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20',
          'border border-cyber-cyan/50',
          'p-3',
          'flex items-center gap-2',
          'transition-all duration-300',
          'hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
        )}
      >
        <Share2 className="w-5 h-5 text-cyber-cyan" />
        <span className="text-sm font-mono text-cyber-cyan">分享</span>
      </motion.button>

      {/* 下拉面板 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className={cn(
            'absolute top-full right-0 mt-2 z-50',
            'bg-cyber-dark/95 backdrop-blur-xl',
            'border border-cyber-cyan/30',
            'rounded-lg p-4',
            'shadow-2xl',
            'min-w-[200px]'
          )}
        >
          <SocialShareButtons
            url={url}
            title={title}
            description={description}
            variant="vertical"
            size="md"
            showLabel
          />
        </motion.div>
      )}
    </div>
  );
}

export default SocialShareButtons;
