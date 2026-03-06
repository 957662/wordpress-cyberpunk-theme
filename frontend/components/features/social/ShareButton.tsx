'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link, Check, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  url: string;
  excerpt?: string;
  tags?: string[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function ShareButton({
  title,
  url,
  excerpt,
  tags = [],
  size = 'md',
  variant = 'default',
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareToTwitter = () => {
    const text = `${title}\n\n${excerpt || ''}\n\n${url}\n\n${tags.map(tag => `#${tag}`).join(' ')}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareToEmail = () => {
    const subject = title;
    const body = `${excerpt || ''}\n\n${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3',
    lg: 'h-12 px-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={variant}
            className={cn(
              'gap-2 transition-all duration-200 text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10',
              sizeClasses[size],
              className
            )}
          >
            <Share2 style={{ width: iconSizes[size], height: iconSizes[size] }} />
            <span>分享</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-cyber-dark/95 backdrop-blur-sm border-cyber-cyan/20"
      >
        {/* Native Share (Mobile) */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <DropdownMenuItem
            onClick={handleNativeShare}
            className="cursor-pointer"
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享到...
          </DropdownMenuItem>
        )}

        {/* Copy Link */}
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="cursor-pointer"
        >
          <Link className="w-4 h-4 mr-2" />
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-cyber-green" />
              已复制
            </>
          ) : (
            '复制链接'
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-cyber-cyan/10" />

        {/* Social Platforms */}
        <DropdownMenuItem
          onClick={shareToTwitter}
          className="cursor-pointer"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={shareToFacebook}
          className="cursor-pointer"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={shareToLinkedIn}
          className="cursor-pointer"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={shareToEmail}
          className="cursor-pointer"
        >
          <Mail className="w-4 h-4 mr-2" />
          邮件
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick share buttons (horizontal bar)
export function QuickShareBar({
  title,
  url,
  excerpt,
  className,
}: {
  title: string;
  url: string;
  excerpt?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => {
        const text = `${title}\n\n${excerpt || ''}\n\n${url}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          '_blank',
          'width=600,height=400'
        );
      },
      color: 'hover:text-cyber-cyan',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
      },
      color: 'hover:text-blue-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
      },
      color: 'hover:text-blue-600',
    },
    {
      name: '复制链接',
      icon: Link,
      onClick: handleCopyLink,
      color: 'hover:text-cyber-green',
      badge: copied ? '已复制' : undefined,
    },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {shareButtons.map((button) => (
        <motion.button
          key={button.name}
          onClick={button.onClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'p-2 rounded-lg bg-gray-800 text-gray-400 transition-colors',
            button.color
          )}
          title={button.name}
        >
          <button.icon className="w-5 h-5" />
        </motion.button>
      ))}
    </div>
  );
}

// Share modal/card
export function ShareCard({
  title,
  url,
  excerpt,
  tags,
  onClose,
}: {
  title: string;
  url: string;
  excerpt?: string;
  tags?: string[];
  onClose?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <Card className="bg-cyber-dark/95 backdrop-blur-sm border-cyber-cyan/20 p-6">
      <h3 className="text-xl font-bold text-white mb-4">分享文章</h3>
      <p className="text-cyber-cyan font-semibold mb-4">{title}</p>

      {/* URL Input */}
      <div className="flex gap-2 mb-6">
        <Input
          value={url}
          readOnly
          className="flex-1 bg-cyber-dark/80"
        />
        <Button
          onClick={handleCopyLink}
          className={cn(
            'whitespace-nowrap',
            copied
              ? 'bg-cyber-green hover:bg-cyber-green/80'
              : 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-black'
          )}
        >
          {copied ? <><Check className="w-4 h-4 mr-2" />已复制</> : <><Link className="w-4 h-4 mr-2" />复制链接</>}
        </Button>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          onClick={() => {
            const text = `${title}\n\n${excerpt || ''}\n\n${url}\n\n${tags?.map(tag => `#${tag}`).join(' ')}`;
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
              '_blank'
            );
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        <Button
          onClick={() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
              '_blank'
            );
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>
        <Button
          onClick={() => {
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
              '_blank'
            );
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
        <Button
          onClick={() => {
            const subject = title;
            const body = `${excerpt || ''}\n\n${url}`;
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          <Mail className="w-4 h-4 mr-2" />
          邮件
        </Button>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">标签</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600"
          >
            关闭
          </Button>
        </div>
      )}
    </Card>
  );
}

export default ShareButton;
