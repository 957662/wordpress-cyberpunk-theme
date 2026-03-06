'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram' | 'copy'>;
  variant?: 'default' | 'minimal' | 'expanded';
  showCount?: boolean;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  platforms = ['twitter', 'facebook', 'linkedin', 'copy'],
  variant = 'default',
  showCount = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const platformConfig = {
    twitter: {
      name: 'Twitter',
      icon: '🐦',
      color: '#1DA1F2',
      shareUrl: () => {
        const text = encodeURIComponent(`${title} - ${description}`);
        return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
      },
    },
    facebook: {
      name: 'Facebook',
      icon: '👍',
      color: '#1877F2',
      shareUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      shareUrl: () => {
        const postTitle = encodeURIComponent(title);
        const postUrl = encodeURIComponent(url);
        return `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}&title=${postTitle}`;
      },
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      shareUrl: () => {
        const text = encodeURIComponent(`${title}\n${description}\n${url}`);
        return `https://wa.me/?text=${text}`;
      },
    },
    telegram: {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      shareUrl: () => {
        const text = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);
        return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      },
    },
    copy: {
      name: 'Copy Link',
      icon: '🔗',
      color: '#00f0ff',
      action: async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          setShareCount((prev) => prev + 1);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      },
    },
  };

  const handleShare = (platform: keyof typeof platformConfig) => {
    const config = platformConfig[platform];

    if (platform === 'copy') {
      config.action?.();
      return;
    }

    window.open(config.shareUrl(), '_blank', 'width=600,height=400');
    setShareCount((prev) => prev + 1);
  };

  const renderDefault = () => (
    <div className={`share-button-default ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>📤</span>
        Share
        {showCount && shareCount > 0 && (
          <span style={{ marginLeft: '4px', opacity: 0.7 }}>({shareCount})</span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="share-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              background: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              gap: '8px',
              zIndex: 1000,
              backdropFilter: 'blur(10px)',
            }}
          >
            {platforms.map((platform) => {
              const config = platformConfig[platform];
              return (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(platform)}
                  className="share-platform-btn"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(0, 240, 255, 0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = config.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                  }}
                  title={config.name}
                >
                  {platform === 'copy' && copied ? '✓' : config.icon}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderMinimal = () => (
    <div className={`share-button-minimal ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="share-bar"
            style={{
              display: 'flex',
              gap: '8px',
              overflow: 'hidden',
              marginRight: '8px',
            }}
          >
            {platforms.map((platform) => {
              const config = platformConfig[platform];
              return (
                <motion.button
                  key={platform}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: platforms.indexOf(platform) * 0.05 }}
                  onClick={() => handleShare(platform)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    color: config.color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                  title={config.name}
                >
                  {platform === 'copy' && copied ? '✓' : config.icon}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px',
        }}
        title="Share"
      >
        {isOpen ? '✕' : '📤'}
      </button>
    </div>
  );

  const renderExpanded = () => (
    <div className={`share-button-expanded ${className}`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '8px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#00f0ff' }}>Share:</span>

        {platforms.map((platform) => {
          const config = platformConfig[platform];
          return (
            <motion.button
              key={platform}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare(platform)}
              className="share-platform-expanded"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `1px solid ${config.color}40`,
                background: 'transparent',
                color: config.color,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${config.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '16px' }}>
                {platform === 'copy' && copied ? '✓' : config.icon}
              </span>
              <span>{config.name}</span>
            </motion.button>
          );
        })}

        {showCount && shareCount > 0 && (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '12px',
              color: '#00f0ff',
              opacity: 0.7,
            }}
          >
            Shared {shareCount} {shareCount === 1 ? 'time' : 'times'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      {variant === 'minimal' && renderMinimal()}
      {variant === 'default' && renderDefault()}
      {variant === 'expanded' && renderExpanded()}

      <style jsx>{`
        .share-platform-btn:hover {
          transform: scale(1.15);
        }

        .share-platform-expanded:hover {
          border-color: currentColor;
        }
      `}</style>
    </div>
  );
};

export default ShareButton;
