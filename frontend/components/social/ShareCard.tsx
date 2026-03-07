'use client';

/**
 * ShareCard Component
 * 社交分享卡片组件
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  Link2,
  Mail,
  MessageCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface ShareData {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

interface ShareCardProps {
  shareData: ShareData;
  className?: string;
  onShare?: (platform: string) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 生成分享链接
 */
function generateShareUrl(platform: string, data: ShareData): string {
  const { title, description, url, imageUrl } = data;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

    case 'email':
      return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;

    case 'copy':
      return url;

    default:
      return '';
  }
}

/**
 * 社交平台配置
 */
const socialPlatforms = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#4267B2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Share2, color: '#0077B5' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: '#0088cc' },
  { id: 'email', name: 'Email', icon: Mail, color: '#EA4335' },
];

// ============================================================================
// Component
// ============================================================================

export function ShareCard({ shareData, className, onShare }: ShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(
    async (platform: string) => {
      const shareUrl = generateShareUrl(platform, shareData);

      if (platform === 'copy') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Failed to copy:', error);
        }
      } else {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }

      onShare?.(platform);
    },
    [shareData, onShare]
  );

  return (
    <motion.div
      className={cn('cyber-card', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 触发按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cyber-dark/50 hover:bg-cyber-muted/20 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-cyber-cyan" />
          <span className="text-white font-medium">分享文章</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <X className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* 分享选项 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            {/* 复制链接 */}
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleShare('copy')}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg',
                'bg-cyber-muted/20 hover:bg-cyber-muted/30',
                'border border-cyber-border hover:border-cyber-cyan/50',
                'transition-all duration-200'
              )}
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-cyber-cyan" />
                <div className="text-left">
                  <div className="text-white font-medium">复制链接</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {shareData.url}
                  </div>
                </div>
              </div>
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 text-cyber-green"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">已复制</span>
                </motion.div>
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>

            {/* 社交平台 */}
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <motion.button
                    key={platform.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleShare(platform.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                      'bg-cyber-muted/20 hover:bg-opacity-30',
                      'border border-cyber-border hover:border-opacity-50',
                      'transition-all duration-200'
                    )}
                    style={{
                      borderColor: copied ? `${platform.color}40` : undefined,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: platform.color }}
                    />
                    <span className="text-sm text-white">{platform.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* 预览信息 */}
            <div className="p-3 bg-cyber-dark/30 rounded-lg border border-cyber-border">
              <div className="text-xs text-gray-500 mb-2">分享预览</div>
              <div className="flex gap-3">
                {shareData.imageUrl && (
                  <div className="w-16 h-16 rounded bg-cyber-muted/20 flex-shrink-0 overflow-hidden">
                    <img
                      src={shareData.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium line-clamp-2 mb-1">
                    {shareData.title}
                  </div>
                  {shareData.description && (
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {shareData.description}
                    </div>
                  )}
                  <div className="text-xs text-cyber-cyan mt-1 truncate">
                    {shareData.url}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * 简化的分享按钮组件
 */
interface ShareButtonProps {
  shareData: ShareData;
  variant?: 'icon' | 'text';
  className?: string;
}

export function ShareButton({
  shareData,
  variant = 'icon',
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
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
      onClick={handleShare}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-cyber-cyan/10 text-cyber-cyan',
        'hover:bg-cyber-cyan/20 transition-colors',
        'border border-cyber-cyan/30',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          {variant === 'text' && <span className="text-sm">已复制</span>}
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          {variant === 'text' && <span className="text-sm">分享</span>}
        </>
      )}
    </motion.button>
  );
}

export default ShareCard;
