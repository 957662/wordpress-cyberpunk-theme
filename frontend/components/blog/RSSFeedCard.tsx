/**
 * RSS 订阅卡片组件
 * 允许用户订阅 RSS/Atom/JSON Feed
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, Atom, FileJson, Mail, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';

export type FeedFormat = 'rss' | 'atom' | 'json' | 'email';

export interface RSSFeedCardProps {
  feedUrl?: string;
  showTitle?: boolean;
  showDescription?: boolean;
}

const feedFormats = [
  {
    id: 'rss' as FeedFormat,
    name: 'RSS 2.0',
    description: '最常用的订阅格式',
    icon: Rss,
    color: 'orange',
    mimeType: 'application/rss+xml',
  },
  {
    id: 'atom' as FeedFormat,
    name: 'Atom 1.0',
    description: '现代标准订阅格式',
    icon: Atom,
    color: 'blue',
    mimeType: 'application/atom+xml',
  },
  {
    id: 'json' as FeedFormat,
    name: 'JSON Feed',
    description: '基于 JSON 的订阅格式',
    icon: FileJson,
    color: 'green',
    mimeType: 'application/feed+json',
  },
];

export const RSSFeedCard: React.FC<RSSFeedCardProps> = ({
  feedUrl = '/api/feed',
  showTitle = true,
  showDescription = true,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<FeedFormat | null>(null);
  const [showToast, setShowToast] = useState(false);

  // 获取完整的订阅链接
  const getFeedUrl = (format: FeedFormat) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}${feedUrl}?format=${format}`;
  };

  // 复制订阅链接
  const copyToClipboard = async (format: FeedFormat) => {
    const url = getFeedUrl(format);

    try {
      await navigator.clipboard.writeText(url);
      setCopiedFormat(format);
      setShowToast(true);

      setTimeout(() => {
        setCopiedFormat(null);
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 订阅到邮件服务
  const subscribeToEmail = () => {
    // 这里可以集成第三方邮件订阅服务
    // 例如 Blogtrottr、Feedrabbit 等
    const url = getFeedUrl('rss');
    const mailtoUrl = `mailto:?subject=订阅 ${typeof window !== 'undefined' ? window.location.hostname : ''}&body=我想订阅这个网站的更新，RSS 链接是：${encodeURIComponent(url)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <>
      <Card className="p-6 border-cyber-cyan/20">
        {showTitle && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">订阅更新</h3>
            {showDescription && (
              <p className="text-gray-400 text-sm">
                通过 RSS 或邮件获取最新文章推送
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          {/* RSS/Atom/JSON 订阅 */}
          {feedFormats.map((format) => {
            const Icon = format.icon;
            const url = getFeedUrl(format.id);
            const isCopied = copiedFormat === format.id;

            return (
              <motion.a
                key={format.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/30 border border-gray-800 hover:border-cyber-cyan/50 transition-all">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${format.color}-500/20 text-${format.color}-400`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{format.name}</div>
                    <div className="text-xs text-gray-500">{format.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      copyToClipboard(format.id);
                    }}
                    className="flex-shrink-0"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </motion.a>
            );
          })}

          {/* 邮件订阅 */}
          <motion.button
            onClick={subscribeToEmail}
            className="w-full group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 hover:border-cyber-purple/60 transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyber-purple/20 text-cyber-purple">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">邮件订阅</div>
                <div className="text-xs text-gray-500">通过邮件接收更新</div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* 提示信息 */}
        <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/20 rounded-lg">
          <p className="text-xs text-gray-400">
            💡 提示：使用 RSS 阅读器（如 Feedly、Inoreader）可以更方便地订阅和管理多个网站的内容
          </p>
        </div>

        {/* 推荐的 RSS 阅读器 */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2">推荐的 RSS 阅读器：</p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Feedly', url: 'https://feedly.com', color: 'bg-green-500/20' },
              { name: 'Inoreader', url: 'https://www.inoreader.com', color: 'bg-blue-500/20' },
              { name: 'NewsBlur', url: 'https://www.newsblur.com', color: 'bg-purple-500/20' },
            ].map((reader) => (
              <a
                key={reader.name}
                href={`${reader.url}?subscribe=${encodeURIComponent(getFeedUrl('rss'))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="outline" className={`${reader.color} border-current hover:opacity-80 transition-opacity cursor-pointer`}>
                  {reader.name}
                </Badge>
              </a>
            ))}
          </div>
        </div>
      </Card>

      {/* Toast 通知 */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        message="订阅链接已复制到剪贴板"
      />
    </>
  );
};

export default RSSFeedCard;
