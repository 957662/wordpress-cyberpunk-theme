'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Link2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Check,
  Copy,
  X,
  Download,
  QRCode,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';

export interface SharePlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  shareUrl: (url: string, title: string) => string;
}

export interface EnhancedShareButtonProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  platforms?: SharePlatform[];
  showQRCode?: boolean;
  showCopyLink?: boolean;
  showDownload?: boolean;
  onShare?: (platform: string) => void;
  variant?: 'button' | 'dropdown' | 'modal';
  size?: 'sm' | 'md' | 'lg';
}

const DEFAULT_PLATFORMS: SharePlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter size={20} />,
    color: '#1DA1F2',
    shareUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook size={20} />,
    color: '#4267B2',
    shareUrl: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin size={20} />,
    color: '#0077B5',
    shareUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <MessageCircle size={20} />,
    color: '#25D366',
    shareUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail size={20} />,
    color: '#EA4335',
    shareUrl: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export function EnhancedShareButton({
  url,
  title,
  description,
  imageUrl,
  platforms = DEFAULT_PLATFORMS,
  showQRCode = true,
  showCopyLink = true,
  showDownload = false,
  onShare,
  variant = 'dropdown',
  size = 'md',
}: EnhancedShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const handleShare = useCallback(
    async (platform: SharePlatform) => {
      const shareUrl = platform.shareUrl(url, title);

      if (platform.id === 'copy') {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setToast({ show: true, message: '链接已复制到剪贴板', type: 'success' });
          setTimeout(() => setCopied(false), 2000);
          setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
        } catch (error) {
          setToast({ show: true, message: '复制失败', type: 'error' });
          setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
        }
      } else if (platform.id === 'qrcode') {
        setShowQR(!showQR);
      } else if (platform.id === 'native') {
        try {
          if (navigator.share) {
            await navigator.share({
              title,
              text: description,
              url,
            });
            setToast({ show: true, message: '分享成功', type: 'success' });
            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
          }
        } catch (error) {
          console.error('Native share failed:', error);
        }
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      onShare?.(platform.id);
      setIsOpen(false);
    },
    [url, title, description, showQR, onShare]
  );

  const handleDownloadImage = useCallback(() => {
    // This would generate a downloadable image of the post
    // Implementation depends on your requirements
    setToast({ show: true, message: '图片下载功能开发中', type: 'success' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  const extraPlatforms: SharePlatform[] = [];
  if (showCopyLink) {
    extraPlatforms.push({
      id: 'copy',
      name: '复制链接',
      icon: copied ? <Check size={20} /> : <Copy size={20} />,
      color: copied ? '#10B981' : '#6B7280',
      shareUrl: () => '',
    });
  }
  if (showQRCode) {
    extraPlatforms.push({
      id: 'qrcode',
      name: '二维码',
      icon: <QRCode size={20} />,
      color: '#8B5CF6',
      shareUrl: () => '',
    });
  }
  if (showDownload) {
    extraPlatforms.push({
      id: 'download',
      name: '下载图片',
      icon: <Download size={20} />,
      color: '#F59E0B',
      shareUrl: () => '',
    });
  }
  if (typeof navigator !== 'undefined' && navigator.share) {
    extraPlatforms.unshift({
      id: 'native',
      name: '更多',
      icon: <Share2 size={20} />,
      color: '#6366F1',
      shareUrl: () => '',
    });
  }

  const allPlatforms = [...platforms, ...extraPlatforms];

  if (variant === 'button') {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          {allPlatforms.map((platform) => (
            <Button
              key={platform.id}
              size={size}
              variant="ghost"
              onClick={() => handleShare(platform)}
              className="gap-2 hover:scale-105 transition-transform"
              style={{ '--hover-color': platform.color } as React.CSSProperties}
            >
              {platform.icon}
              {size !== 'sm' && <span>{platform.name}</span>}
            </Button>
          ))}
        </div>
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      </>
    );
  }

  if (variant === 'modal') {
    return (
      <>
        <Button
          size={size}
          variant="neon"
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <Share2 size={size === 'sm' ? 16 : 20} />
          分享
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <Card className="max-w-md w-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">分享文章</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  {description && (
                    <p className="text-gray-400 mb-6">{description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {allPlatforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => handleShare(platform)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-cyber-cyan/10 transition-colors group"
                      >
                        <div
                          className="p-3 rounded-full bg-cyber-dark group-hover:scale-110 transition-transform"
                          style={{ color: platform.color }}
                        >
                          {platform.icon}
                        </div>
                        <span className="text-xs text-gray-400">
                          {platform.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {showQR && (
                    <div className="flex flex-col items-center">
                      <QRCodeDisplay url={url} size={200} />
                      <p className="text-sm text-gray-500 mt-2">扫描二维码分享</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      </>
    );
  }

  // Default dropdown variant
  return (
    <>
      <div className="relative">
        <Button
          size={size}
          variant="neon"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Share2 size={size === 'sm' ? 16 : 20} />
          分享
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 z-50"
              >
                <Card className="p-3 min-w-[200px]">
                  <div className="space-y-1">
                    {allPlatforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => handleShare(platform)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyber-cyan/10 transition-colors text-left"
                      >
                        <div style={{ color: platform.color }}>
                          {platform.icon}
                        </div>
                        <span className="text-sm">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}

// QR Code Display Component
function QRCodeDisplay({ url, size }: { url: string; size: number }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code using a public API
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(apiUrl);
  }, [url, size]);

  if (!qrCodeUrl) {
    return (
      <div
        className="bg-cyber-dark rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-cyan" />
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={qrCodeUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Button size="sm" variant="neon" onClick={() => window.open(qrCodeUrl, '_blank')}>
          下载二维码
        </Button>
      </div>
    </div>
  );
}

// Import useEffect
import { useEffect } from 'react';
