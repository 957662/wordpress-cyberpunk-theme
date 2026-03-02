'use client';

import { motion } from 'framer-motion';
import { Twitter, Linkedin, Link2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title?: string;
  url?: string;
  className?: string;
}

export default function ShareButtons({
  title = 'CyberPress - 赛博朋克博客平台',
  url,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:text-[#0077B5] hover:border-[#0077B5]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-400 mr-2">分享:</span>

      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-lg border border-cyber-border flex items-center justify-center text-gray-400 transition-all"
          title={link.name}
        >
          <link.icon className={`w-5 h-5 ${link.color}`} />
        </motion.a>
      ))}

      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={copyToClipboard}
        className="w-10 h-10 rounded-lg border border-cyber-border flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-all"
        title="复制链接"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </motion.button>

      {/* 复制成功提示 */}
      {copied && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-sm text-green-400"
        >
          已复制
        </motion.span>
      )}
    </div>
  );
}
