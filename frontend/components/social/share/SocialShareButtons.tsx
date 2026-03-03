/**
 * 社交分享按钮组件
 * Social Share Buttons Component
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Twitter,
  Linkedin,
  Link2,
  Copy,
  Check,
  Facebook,
  Mail,
} from 'lucide-react';

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  excerpt?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function SocialShareButtons({
  url,
  title,
  excerpt,
  variant = 'horizontal',
  size = 'md',
  showLabels = false,
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // 默认使用当前页面 URL
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';
  const shareExcerpt = excerpt || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${shareTitle}\n${shareExcerpt}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(shareTitle);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
      '_blank'
    );
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareExcerpt}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const ShareButton = ({
    icon: Icon,
    label,
    onClick,
    color,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    color: string;
  }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`${variant === 'vertical' ? 'w-full' : ''}`}
        title={label}
      >
        <div
          className={`${sizeClasses[size]} rounded-lg ${color} text-white flex items-center justify-center transition-colors`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {showLabels && (
          <span className="text-xs text-cyber-muted mt-1 block">{label}</span>
        )}
      </motion.button>
    );
  };

  return (
    <div
      className={`flex ${
        variant === 'vertical' ? 'flex-col gap-3' : 'flex-wrap gap-2'
      } ${className}`}
    >
      <ShareButton
        icon={Twitter}
        label="Twitter"
        onClick={shareToTwitter}
        color="bg-sky-500 hover:bg-sky-600"
      />
      <ShareButton
        icon={Facebook}
        label="Facebook"
        onClick={shareToFacebook}
        color="bg-blue-600 hover:bg-blue-700"
      />
      <ShareButton
        icon={Linkedin}
        label="LinkedIn"
        onClick={shareToLinkedIn}
        color="bg-blue-700 hover:bg-blue-800"
      />
      <ShareButton
        icon={Mail}
        label="Email"
        onClick={shareToEmail}
        color="bg-cyber-purple hover:bg-cyber-purple/80"
      />
      <ShareButton
        icon={copied ? Check : Copy}
        label={copied ? '已复制' : '复制链接'}
        onClick={handleCopyLink}
        color={copied ? 'bg-cyber-green' : 'bg-cyber-cyan hover:bg-cyber-cyan/80'}
      />
    </div>
  );
}

/**
 * 快速分享按钮组件 (只包含复制链接)
 */
export function QuickShareButton({
  url,
  className = '',
}: {
  url?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className={`p-2 rounded-lg hover:bg-cyber-secondary transition-colors ${className}`}
      title={copied ? '已复制!' : '复制链接'}
    >
      {copied ? (
        <Check className="w-5 h-5 text-cyber-green" />
      ) : (
        <Link2 className="w-5 h-5 text-cyber-muted" />
      )}
    </motion.button>
  );
}

/**
 * 内联分享组件 (文章底部的分享条)
 */
export function InlineShareBar({
  url,
  title,
  excerpt,
  className = '',
}: {
  url?: string;
  title?: string;
  excerpt?: string;
  className?: string;
}) {
  return (
    <div
      className={`cyber-card p-4 flex items-center justify-between ${className}`}
    >
      <span className="text-sm text-cyber-muted">分享这篇文章:</span>
      <SocialShareButtons
        url={url}
        title={title}
        excerpt={excerpt}
        variant="horizontal"
        size="md"
      />
    </div>
  );
}
