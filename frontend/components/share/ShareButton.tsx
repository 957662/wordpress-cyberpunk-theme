'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Twitter, Linkedin, Link, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
  showLabel?: boolean;
}

/**
 * ShareButton - 社交分享按钮组件
 *
 * 特性：
 * - 多平台分享（Twitter, LinkedIn, Email）
 * - 复制链接功能
 * - 赛博朋克风格
 * - 动画效果
 */
export function ShareButton({
  title,
  url,
  description,
  className,
  showLabel = true
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description ? `${description}\n\n${url}` : url)}`,
    copy: url
  };

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareLinks.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    {
      id: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-cyber-cyan hover:border-cyber-cyan'
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-cyber-purple hover:border-cyber-purple'
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      color: 'hover:text-cyber-pink hover:border-cyber-pink'
    },
    {
      id: 'copy',
      icon: copied ? Check : Link,
      label: copied ? 'Copied!' : 'Copy Link',
      color: copied ? 'text-cyber-green border-cyber-green' : 'hover:text-cyber-yellow hover:border-cyber-yellow'
    }
  ];

  return (
    <div className="relative">
      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-cyber-muted/50 border border-cyber-cyan/30',
          'text-cyber-cyan hover:text-cyber-cyan',
          'hover:bg-cyber-cyan/10 hover:border-cyber-cyan/60',
          'transition-all duration-200',
          'shadow-[0_0_15px_rgba(0,240,255,0.1)]',
          'hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          className
        )}
      >
        <Share2 className="w-4 h-4" />
        {showLabel && <span className="text-sm font-medium">Share</span>}
      </motion.button>

      {/* Share panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute top-full right-0 mt-2 z-50',
                'min-w-[200px] p-2 rounded-lg',
                'bg-cyber-dark/95 backdrop-blur-sm',
                'border border-cyber-cyan/30',
                'shadow-[0_0_30px_rgba(0,240,255,0.2)]'
              )}
            >
              <div className="space-y-1">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleShare(option.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                      'text-cyber-muted/80 text-sm',
                      'border border-transparent',
                      'transition-all duration-200',
                      option.color
                    )}
                  >
                    <option.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * SharePanel - 完整的分享面板组件
 */
interface SharePanelProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export function SharePanel({ title, url, description, className }: SharePanelProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description ? `${description}\n\n${url}` : url)}`,
    copy: url
  };

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareLinks.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    { id: 'twitter', icon: Twitter, label: 'Tweet', color: 'hover:bg-[#1DA1F2]/20' },
    { id: 'linkedin', icon: Linkedin, label: 'Share', color: 'hover:bg-[#0A66C2]/20' },
    { id: 'email', icon: Mail, label: 'Email', color: 'hover:bg-cyber-pink/20' },
    { id: 'copy', icon: copied ? Check : Link, label: copied ? 'Copied!' : 'Copy', color: copied ? 'text-cyber-green' : 'hover:bg-cyber-yellow/20' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-lg border border-cyber-cyan/30',
        'bg-cyber-dark/80 backdrop-blur-sm',
        'shadow-[0_0_20px_rgba(0,240,255,0.1)]',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-cyber-cyan mb-4">Share this article</h3>

      <div className="grid grid-cols-2 gap-3">
        {shareOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShare(option.id)}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'bg-cyber-muted/30 border border-cyber-cyan/20',
              'text-cyber-cyan transition-all duration-200',
              option.color
            )}
          >
            <option.icon className="w-5 h-5" />
            <span className="font-medium">{option.label}</span>
          </motion.button>
        ))}
      </div>

      {/* URL display */}
      <div className="mt-4 p-3 rounded bg-cyber-muted/20 border border-cyber-cyan/10">
        <p className="text-xs text-cyber-muted/60 mb-1">Article URL</p>
        <p className="text-sm text-cyber-cyan/80 break-all">{url}</p>
      </div>
    </motion.div>
  );
}

/**
 * FloatingShareButtons - 浮动分享按钮组
 */
interface FloatingShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export function FloatingShareButtons({ title, url, description, className }: FloatingShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    copy: url
  };

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareLinks.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    { id: 'twitter', icon: Twitter, label: 'Twitter' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { id: 'copy', icon: copied ? Check : Link, label: copied ? 'Copied' : 'Copy' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex flex-col gap-2',
        'sticky top-1/2 -translate-y-1/2',
        className
      )}
    >
      {shareOptions.map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare(option.id)}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-cyber-muted/50 border border-cyber-cyan/30',
            'text-cyber-cyan',
            'hover:bg-cyber-cyan/20 hover:border-cyber-cyan/60',
            'transition-all duration-200',
            'shadow-[0_0_15px_rgba(0,240,255,0.1)]',
            'hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
            copied && option.id === 'copy' && 'bg-cyber-green/20 border-cyber-green text-cyber-green'
          )}
          title={option.label}
        >
          <option.icon className="w-5 h-5" />
        </motion.button>
      ))}
    </motion.div>
  );
}
