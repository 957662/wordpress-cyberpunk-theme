'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Mail,
  Check,
  Share2
} from 'lucide-react';

export interface ShareButtonProps {
  /** 分享标题 */
  title?: string;
  /** 分享描述 */
  description?: string;
  /** 分享URL */
  url?: string;
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 显示的社交平台 */
  platforms?: ('twitter' | 'linkedin' | 'facebook' | 'copy' | 'email')[];
  /** 自定义类名 */
  className?: string;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  description,
  url: propUrl,
  size = 'md',
  variant = 'primary',
  platforms = ['twitter', 'linkedin', 'facebook', 'copy', 'email'],
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = propUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || '')}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(description || '')}%0A%0A${encodeURIComponent(url)}`,
  };

  const handleShare = (platform: keyof typeof shareUrls | 'copy') => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setIsOpen(false);
  };

  const variantStyles = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-purple hover:text-white',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-pink',
    ghost: 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
  };

  const platformIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    copy: copied ? Check : Link2,
    email: Mail,
  };

  const platformNames = {
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    copy: copied ? '已复制' : '复制链接',
    email: '邮件',
  };

  return (
    <div className={`relative ${className}`}>
      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg font-medium
          transition-all duration-300
          ${sizeStyles[size]}
          ${variantStyles[variant]}
        `}
      >
        <Share2 size={iconSizes[size]} />
        <span>分享</span>
      </motion.button>

      {/* 下拉面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50 w-48"
            >
              <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-hidden shadow-xl shadow-cyber-cyan/10">
                {platforms.map((platform) => {
                  const Icon = platformIcons[platform];
                  return (
                    <motion.button
                      key={platform}
                      whileHover={{ x: 5 }}
                      onClick={() => handleShare(platform)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3
                        text-left transition-colors
                        hover:bg-cyber-muted/50
                        ${platform === 'copy' && copied ? 'text-cyber-green' : 'text-gray-300'}
                      `}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">
                        {platformNames[platform]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/** 快捷分享按钮组 - 水平排列 */
export const ShareButtons: React.FC<Omit<ShareButtonProps, 'size'>> = (props) => {
  const { platforms = ['twitter', 'linkedin', 'facebook', 'copy'], ...rest } = props;
  const [copied, setCopied] = useState(false);
  const url = props.url || (typeof window !== 'undefined' ? window.location.href : '');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title || '')}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform: keyof typeof shareUrls | 'copy') => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const platformIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    copy: copied ? Check : Link2,
  };

  return (
    <div className="flex items-center gap-2">
      {platforms.map((platform) => {
        const Icon = platformIcons[platform];
        return (
          <motion.button
            key={platform}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare(platform)}
            className={`
              p-2 rounded-lg border transition-all duration-300
              ${platform === 'copy' && copied
                ? 'border-cyber-green text-cyber-green bg-cyber-green/10'
                : 'border-cyber-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-cyan/10'
              }
            `}
            aria-label={`Share on ${platform}`}
          >
            <Icon size={20} />
          </motion.button>
        );
      })}
    </div>
  );
};

export default ShareButton;
