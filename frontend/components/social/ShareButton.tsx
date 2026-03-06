'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link as LinkIcon, Twitter, Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

interface ShareButtonProps {
  title?: string;
  url?: string;
  description?: string;
  className?: string;
}

export function ShareButton({
  title,
  url,
  description,
  className,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';
  const shareDescription = description || '';

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-cyber-cyan',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-600',
    },
    {
      name: 'Copy Link',
      icon: LinkIcon,
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        setIsOpen(false);
      },
      color: 'hover:text-cyber-purple',
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="gap-2 border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10"
      >
        <Share2 className="w-4 h-4" />
        <span className="font-bold">分享</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 分享菜单 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 bg-cyber-dark border border-cyber-cyan/30 rounded-lg p-2 shadow-lg shadow-cyber-cyan/10 min-w-[200px]"
            >
              <div className="space-y-1">
                {shareLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => link.action ? link.action() : window.open(link.url, '_blank')}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded transition-colors',
                      'text-gray-300 hover:bg-cyber-cyan/10',
                      link.color
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast 提示 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Toast message="链接已复制到剪贴板" type="success" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
