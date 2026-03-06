/**
 * SocialShareButtons - 社交分享按钮
 * 支持多种平台分享
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';

export interface ShareButton {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
  getShareUrl: (url: string, title: string) => string;
}

const shareButtons: ShareButton[] = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-gray-400',
    hoverColor: 'hover:text-[#1DA1F2]',
    getShareUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-gray-400',
    hoverColor: 'hover:text-[#4267B2]',
    getShareUrl: (url, title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-gray-400',
    hoverColor: 'hover:text-[#0077B5]',
    getShareUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export interface SocialShareButtonsProps {
  url: string;
  title: string;
  showCopyLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  showCopyLink = true,
  size = 'md',
  variant = 'default',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  // 尺寸映射
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // 变体样式
  const variantClasses = {
    default: cn(
      'bg-cyber-cyan/10 border-cyber-cyan/30',
      'hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50'
    ),
    outline: cn(
      'bg-transparent border-cyber-cyan/30',
      'hover:bg-cyber-cyan/10'
    ),
    ghost: cn('bg-transparent border-transparent hover:bg-cyber-cyan/10'),
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-gray-500 mr-2">分享:</span>

      {/* 社交平台按钮 */}
      {shareButtons.map((button) => (
        <motion.button
          key={button.name}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare(button.getShareUrl(url, title))}
          className={cn(
            'flex items-center justify-center rounded-lg border',
            'transition-all duration-300',
            sizeClasses[size],
            variantClasses[variant],
            button.color,
            button.hoverColor
          )}
          title={`分享到 ${button.name}`}
          aria-label={`分享到 ${button.name}`}
        >
          <button.icon className={iconSizes[size]} />
        </motion.button>
      ))}

      {/* 复制链接按钮 */}
      {showCopyLink && (
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopyLink}
          className={cn(
            'flex items-center justify-center rounded-lg border',
            'transition-all duration-300',
            sizeClasses[size],
            variantClasses[variant],
            copied ? 'text-green-400' : 'text-gray-400 hover:text-cyber-cyan'
          )}
          title={copied ? '已复制!' : '复制链接'}
          aria-label={copied ? '已复制!' : '复制链接'}
        >
          {copied ? (
            <Check className={iconSizes[size]} />
          ) : (
            <Copy className={iconSizes[size]} />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default SocialShareButtons;
