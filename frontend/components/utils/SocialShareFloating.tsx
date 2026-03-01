'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareIcon, CopyIcon, CheckIcon } from '../icons';

export interface SocialShareFloatingProps {
  title: string;
  url?: string;
  description?: string;
  className?: string;
  position?: 'left' | 'right';
  platforms?: ('twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'weibo' | 'wechat' | 'copy')[];
}

export default function SocialShareFloating({
  title,
  url,
  description = '',
  className = '',
  position = 'left',
  platforms = ['twitter', 'facebook', 'linkedin', 'copy'],
}: SocialShareFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || '');

  useEffect(() => {
    if (!url) {
      setCurrentUrl(window.location.href);
    }
  }, [url]);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl}`)}`,
    weibo: `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    wechat: '', // 微信需要特殊处理，显示二维码
  };

  const platformIcons = {
    twitter: '𝕏',
    facebook: 'f',
    linkedin: 'in',
    whatsapp: '📱',
    weibo: '微',
    wechat: '💬',
    copy: '📋',
  };

  const platformColors = {
    twitter: 'bg-black hover:bg-gray-900',
    facebook: 'bg-[#1877f2] hover:bg-[#166fe5]',
    linkedin: 'bg-[#0077b5] hover:bg-[#006399]',
    whatsapp: 'bg-[#25d366] hover:bg-[#20bd5a]',
    weibo: 'bg-[#e6162d] hover:bg-[#d01227]',
    wechat: 'bg-[#07c160] hover:bg-[#06ad56]',
    copy: 'bg-cyber-purple hover:bg-cyber-purple/80',
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    if (platform === 'copy') {
      handleCopy();
    } else if (platform === 'wechat') {
      // 微信分享特殊处理
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`, '_blank');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: currentUrl,
        });
      } catch (err) {
        console.log('分享取消:', err);
      }
    }
  };

  return (
    <div className={`fixed bottom-8 ${position}-8 z-50 ${className}`}>
      {/* 主按钮 */}
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${position === 'left' ? 'left-0' : 'right-0'} bottom-full mb-3 flex flex-col gap-2`}
            >
              {platforms.map((platform) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShare(platform as keyof typeof shareUrls)}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${platformColors[platform as keyof typeof platformColors]}
                    text-white font-bold shadow-lg
                    transition-all duration-200
                  `}
                  title={platform === 'copy' ? '复制链接' : platform}
                >
                  {platform === 'copy' && copied ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{platformIcons[platform]}</span>
                  )}
                </motion.button>
              ))}

              {/* 分隔线 */}
              <div className="h-px w-full bg-cyber-border my-1" />

              {/* 原生分享按钮（移动端） */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNativeShare}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-dark font-bold shadow-lg"
                  title="更多分享"
                >
                  <ShareIcon className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 切换按钮 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center
            bg-gradient-to-br from-cyber-cyan to-cyber-purple
            text-white shadow-neon-cyan
            border-2 border-cyber-cyan/50
            transition-all duration-300
            ${isOpen ? 'rotate-45' : ''}
          `}
        >
          <ShareIcon className="w-6 h-6" />
        </motion.button>

        {/* 发光效果 */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple -z-10 blur-xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 提示文本 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
            className={`absolute ${position === 'left' ? 'left-full' : 'right-full'} top-1/2 -translate-y-1/2 ${position === 'left' ? 'ml-3' : 'mr-3'} whitespace-nowrap`}
          >
            <div className="px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border text-xs text-gray-400">
              分享文章
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 静态分享按钮组（用于嵌入内容中）
export function SocialShareButtons({
  title,
  url,
  description = '',
  className = '',
}: {
  title: string;
  url?: string;
  description?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || '');

  useEffect(() => {
    if (!url) {
      setCurrentUrl(window.location.href);
    }
  }, [url]);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      <span className="text-sm text-gray-500">分享到:</span>

      {Object.entries(shareUrls).map(([platform, platformUrl]) => (
        <motion.a
          key={platform}
          href={platformUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg border border-cyber-border hover:border-cyber-cyan text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
        >
          {platform === 'twitter' && '𝕏 Twitter'}
          {platform === 'facebook' && 'Facebook'}
          {platform === 'linkedin' && 'LinkedIn'}
        </motion.a>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="px-4 py-2 rounded-lg border border-cyber-border hover:border-cyber-purple text-sm text-gray-400 hover:text-cyber-purple transition-colors flex items-center gap-2"
      >
        {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
        {copied ? '已复制' : '复制链接'}
      </motion.button>
    </div>
  );
}
