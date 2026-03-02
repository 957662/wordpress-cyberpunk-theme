'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  MessageCircle,
  Mail,
} from 'lucide-react';

interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  showLabels?: boolean;
  className?: string;
}

const colorSchemes = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  orange: {
    primary: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  blue: {
    primary: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
};

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  description,
  url,
  colorScheme = 'cyan',
  showLabels = false,
  className = '',
}) => {
  const colors = colorSchemes[colorScheme];
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';
  const shareDescription = description || '';

  const shareLinks = {
    twitter: {
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-cyan-400',
    },
    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: Facebook,
      label: 'Facebook',
      color: 'hover:text-blue-400',
    },
    linkedin: {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-500',
    },
    wechat: {
      url: '#',
      icon: MessageCircle,
      label: '微信',
      color: 'hover:text-green-400',
      onClick: () => {
        // 微信分享需要特殊处理
        alert('请复制链接分享到微信');
      },
    },
    email: {
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
      icon: Mail,
      label: '邮件',
      color: 'hover:text-gray-400',
    },
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('链接已复制到剪贴板！');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="text-gray-400 text-sm mr-2">分享到:</span>

      {Object.entries(shareLinks).map(([key, link]) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={link.onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border text-gray-300 transition-all ${link.color} ${link.onClick ? 'cursor-pointer' : ''}`}
            title={link.label}
          >
            <Icon className="w-4 h-4" />
            {showLabels && <span className="text-sm">{link.label}</span>}
          </motion.a>
        );
      })}

      {/* 复制链接按钮 */}
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={copyLink}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border text-gray-300 transition-all hover:text-gray-100`}
        title="复制链接"
      >
        <Link2 className="w-4 h-4" />
        {showLabels && <span className="text-sm">复制链接</span>}
      </motion.button>
    </div>
  );
};

export default ShareButtons;
