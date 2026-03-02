/**
 * 社交媒体分享按钮组件
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TwitterIcon, GitHubIcon, LinkedInIcon, EmailIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'pill';
}

const socialPlatforms = [
  {
    name: 'Twitter',
    icon: TwitterIcon,
    color: 'hover:bg-[#1DA1F2]',
    bgColor: 'bg-[#1DA1F2]/10',
    shareUrl: (title: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'GitHub',
    icon: GitHubIcon,
    color: 'hover:bg-[#333]',
    bgColor: 'bg-[#333]/10',
    shareUrl: (_title: string, url: string) => url,
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    color: 'hover:bg-[#0077B5]',
    bgColor: 'bg-[#0077B5]/10',
    shareUrl: (title: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Email',
    icon: EmailIcon,
    color: 'hover:bg-cyber-pink',
    bgColor: 'bg-cyber-pink/10',
    shareUrl: (title: string, url: string, description?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description ? description + '\n\n' + url : url)}`,
  },
];

export function SocialShareButtons({
  title,
  url,
  description,
  className,
  variant = 'default',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    const shareUrl = platform.shareUrl(title, url, description);
    if (platform.name === 'GitHub') {
      copyToClipboard(url);
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const variants = {
    default: 'flex flex-wrap gap-3',
    minimal: 'flex gap-2',
    pill: 'flex gap-2',
  };

  const buttonVariants = {
    default: 'p-3 rounded-lg',
    minimal: 'p-2 rounded-md',
    pill: 'px-4 py-2 rounded-full',
  };

  return (
    <div className={cn(variants[variant], className)}>
      {socialPlatforms.map((platform) => (
        <motion.button
          key={platform.name}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare(platform)}
          className={cn(
            'flex items-center gap-2 border border-cyber-border transition-all duration-300',
            buttonVariants[variant],
            platform.bgColor,
            platform.color,
            variant === 'pill' && 'text-sm font-medium'
          )}
          title={`Share on ${platform.name}`}
        >
          <platform.icon className="w-5 h-5" />
          {variant === 'pill' && <span>{platform.name}</span>}
        </motion.button>
      ))}

      {/* 复制链接按钮 */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => copyToClipboard(url)}
        className={cn(
          'flex items-center gap-2 border border-cyber-cyan/30 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan transition-all duration-300',
          buttonVariants[variant],
          variant === 'pill' && 'text-sm font-medium'
        )}
        title={copied ? '已复制!' : '复制链接'}
      >
        {copied ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {variant === 'pill' && <span>已复制</span>}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {variant === 'pill' && <span>复制链接</span>}
          </>
        )}
      </motion.button>
    </div>
  );
}

// 分享卡片组件
export function ShareCard({ title, url, description }: { title: string; url: string; description?: string }) {
  return (
    <div className="cyber-card p-6">
      <h3 className="text-lg font-display font-bold text-white mb-4">分享这篇文章</h3>
      <p className="text-gray-400 text-sm mb-4">
        如果你觉得这篇文章有价值，欢迎分享给更多人
      </p>
      <SocialShareButtons title={title} url={url} description={description} />
    </div>
  );
}

// 浮动分享按钮
export function FloatingShareButton({ title, url, description }: { title: string; url: string; description?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-4 bottom-4 z-40">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 left-0 cyber-card p-3"
          >
            <SocialShareButtons
              title={title}
              url={url}
              description={description}
              variant="minimal"
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-neon-cyan flex items-center justify-center"
          aria-label="分享"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}
