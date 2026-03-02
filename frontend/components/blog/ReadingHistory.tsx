'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, History } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  readAt: string;
  progress: number;
  featured_media?: string;
}

interface ReadingHistoryProps {
  className?: string;
  maxItems?: number;
}

export function ReadingHistory({ className, maxItems = 10 }: ReadingHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 从 localStorage 加载阅读历史
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('reading_history');
        if (stored) {
          const parsed: HistoryItem[] = JSON.parse(stored);
          setHistory(parsed.slice(0, maxItems));
        }
      } catch (error) {
        console.error('加载阅读历史失败:', error);
      }
    };

    loadHistory();

    // 监听自定义事件，当有新文章被阅读时更新
    const handleUpdate = () => loadHistory();
    window.addEventListener('reading-history-update', handleUpdate);

    return () => {
      window.removeEventListener('reading-history-update', handleUpdate);
    };
  }, [maxItems]);

  // 删除历史记录
  const removeItem = (id: number) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);

    try {
      localStorage.setItem('reading_history', JSON.stringify(updated));
    } catch (error) {
      console.error('保存阅读历史失败:', error);
    }
  };

  // 清空历史
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('reading_history');
    } catch (error) {
      console.error('清空阅读历史失败:', error);
    }
  };

  // 格式化时间
  const formatReadTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (history.length === 0) {
    return (
      <div className={cn('cyber-card p-6', className)}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">暂无阅读历史</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('cyber-card', className)}>
      {/* 标题栏 */}
      <div className="px-6 py-4 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-cyber-cyan" />
          <h3 className="font-display font-bold text-white">最近阅读</h3>
          <span className="px-2 py-0.5 text-xs rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-gray-500 hover:text-cyber-pink transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        )}
      </div>

      {/* 历史列表 */}
      <div className="divide-y divide-cyber-border max-h-96 overflow-y-auto">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <Link
                href={`/blog/${item.slug}`}
                className="block px-6 py-4 hover:bg-cyber-cyan/5 transition-colors"
              >
                <div className="flex gap-4">
                  {/* 缩略图 */}
                  {item.featured_media && (
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-cyber-darker">
                      <img
                        src={item.featured_media}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatReadTime(item.readAt)}
                      </span>

                      {item.progress > 0 && item.progress < 100 && (
                        <span className="flex items-center gap-1">
                          已读 {item.progress}%
                        </span>
                      )}
                    </div>

                    {/* 阅读进度条 */}
                    {item.progress > 0 && item.progress < 100 && (
                      <div className="mt-2 h-1 bg-cyber-darker rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              {/* 删除按钮 */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-cyber-pink/10 text-gray-500 hover:text-cyber-pink transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 底部链接 */}
      <div className="px-6 py-3 border-t border-cyber-border">
        <Link
          href="/history"
          className="block text-center text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
        >
          查看完整历史 →
        </Link>
      </div>
    </div>
  );
}

// 内联版本（用于侧边栏）
export function ReadingHistoryInline({ className, maxItems = 5 }: ReadingHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('reading_history');
      if (stored) {
        const parsed: HistoryItem[] = JSON.parse(stored);
        setHistory(parsed.slice(0, maxItems));
      }
    } catch (error) {
      console.error('加载阅读历史失败:', error);
    }
  }, [maxItems]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-cyber-cyan" />
        <h4 className="text-sm font-medium text-white">最近阅读</h4>
      </div>

      {history.map((item) => (
        <Link
          key={item.id}
          href={`/blog/${item.slug}`}
          className="block group"
        >
          <h5 className="text-sm text-gray-400 group-hover:text-cyber-cyan transition-colors line-clamp-1">
            {item.title}
          </h5>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(item.readAt).toLocaleDateString('zh-CN')}
          </p>
        </Link>
      ))}
    </div>
  );
}

// Hook：添加到阅读历史
export function useReadingHistory() {
  const addToHistory = (post: any, progress: number = 100) => {
    try {
      const stored = localStorage.getItem('reading_history');
      let history: HistoryItem[] = stored ? JSON.parse(stored) : [];

      // 移除已存在的记录
      history = history.filter(item => item.id !== post.id);

      // 添加新记录到开头
      history.unshift({
        id: post.id,
        slug: post.slug,
        title: post.title?.rendered || post.title,
        excerpt: post.excerpt?.rendered || '',
        readAt: new Date().toISOString(),
        progress,
        featured_media: post.featured_media
      });

      // 只保留最近 50 条
      history = history.slice(0, 50);

      localStorage.setItem('reading_history', JSON.stringify(history));

      // 触发自定义事件
      window.dispatchEvent(new Event('reading-history-update'));
    } catch (error) {
      console.error('保存阅读历史失败:', error);
    }
  };

  return { addToHistory };
}
