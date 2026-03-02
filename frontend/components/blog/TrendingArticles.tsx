'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Award, Zap, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TrendingArticle {
  id: number;
  slug: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  featured_media?: string;
  category?: string;
  trend?: 'rising' | 'hot' | 'stable';
}

interface TrendingArticlesProps {
  timeRange?: 'day' | 'week' | 'month' | 'all';
  maxItems?: number;
  className?: string;
}

export function TrendingArticles({
  timeRange = 'week',
  maxItems = 10,
  className
}: TrendingArticlesProps) {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'popular' | 'latest'>('trending');

  useEffect(() => {
    // 模拟加载热门文章数据
    const loadArticles = async () => {
      setIsLoading(true);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模拟数据
      const mockArticles: TrendingArticle[] = Array.from({ length: maxItems }, (_, i) => ({
        id: i + 1,
        slug: `article-${i + 1}`,
        title: `热门文章标题 ${i + 1}：这是一篇关于技术趋势的深度分析文章`,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 100) + 10,
        featured_media: undefined,
        category: ['技术', '教程', '观点', '资源'][Math.floor(Math.random() * 4)],
        trend: ['rising', 'hot', 'stable'][Math.floor(Math.random() * 3)] as any
      }));

      // 按浏览量排序
      mockArticles.sort((a, b) => b.views - a.views);

      setArticles(mockArticles);
      setIsLoading(false);
    };

    loadArticles();
  }, [timeRange, maxItems]);

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // 获取趋势图标
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'hot':
        return <Flame className="w-4 h-4 text-cyber-pink" />;
      default:
        return null;
    }
  };

  // 获取排名样式
  const getRankStyle = (index: number) => {
    if (index === 0) return 'text-2xl font-bold text-cyber-cyan';
    if (index === 1) return 'text-xl font-bold text-cyber-purple';
    if (index === 2) return 'text-xl font-bold text-cyber-pink';
    return 'text-lg font-bold text-gray-500';
  };

  if (isLoading) {
    return (
      <div className={cn('cyber-card p-6', className)}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-cyber-darker rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('cyber-card overflow-hidden', className)}>
      {/* 标题和标签 */}
      <div className="px-6 py-4 border-b border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-cyber-pink" />
            <h3 className="font-display font-bold text-white">热门文章</h3>
          </div>
          <span className="text-xs text-gray-500">
            {timeRange === 'day' && '今日'}
            {timeRange === 'week' && '本周'}
            {timeRange === 'month' && '本月'}
            {timeRange === 'all' && '全部'}
          </span>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-2">
          {[
            { key: 'trending', label: '趋势', icon: TrendingUp },
            { key: 'popular', label: '热门', icon: Flame },
            { key: 'latest', label: '最新', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                activeTab === tab.key
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="divide-y divide-cyber-border">
        <AnimatePresence>
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/blog/${article.slug}`}
                className="block px-6 py-4 hover:bg-cyber-cyan/5 transition-colors group"
              >
                <div className="flex gap-4">
                  {/* 排名 */}
                  <div className={cn('w-8 flex-shrink-0 flex items-center justify-end', getRankStyle(index))}>
                    {index + 1}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2 flex-1">
                        {article.title}
                      </h4>
                      {getTrendIcon(article.trend)}
                    </div>

                    {/* 元信息 */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {article.category && (
                        <span className="px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
                          {article.category}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(article.views)}
                      </span>

                      <span>❤️ {formatNumber(article.likes)}</span>

                      {article.comments > 0 && (
                        <span>💬 {article.comments}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 底部提示 */}
      <div className="px-6 py-3 bg-cyber-darker/50 border-t border-cyber-border">
        <p className="text-xs text-gray-500 text-center">
          数据每小时更新 · 基于 {timeRange === 'day' ? '24小时' : timeRange === 'week' ? '7天' : '30天'} 的数据统计
        </p>
      </div>
    </div>
  );
}

// 简化版（用于侧边栏）
export function TrendingArticlesCompact({ className }: { className?: string }) {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);

  useEffect(() => {
    // 加载前 5 篇热门文章
    const mockArticles: TrendingArticle[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      slug: `article-${i + 1}`,
      title: `热门文章 ${i + 1}`,
      views: Math.floor(Math.random() * 5000) + 1000,
      likes: 0,
      comments: 0,
      trend: 'hot'
    }));

    setArticles(mockArticles);
  }, []);

  if (articles.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-cyber-pink" />
        <h4 className="text-sm font-medium text-white">热门文章</h4>
      </div>

      {articles.map((article, index) => (
        <Link
          key={article.id}
          href={`/blog/${article.slug}`}
          className="flex items-start gap-2 group"
        >
          <span className={cn(
            'text-sm font-bold flex-shrink-0',
            index < 3 ? 'text-cyber-cyan' : 'text-gray-600'
          )}>
            {index + 1}
          </span>
          <h5 className="text-sm text-gray-400 group-hover:text-cyber-cyan transition-colors line-clamp-2">
            {article.title}
          </h5>
        </Link>
      ))}
    </div>
  );
}

// 排行榜样式
export function TrendingArticlesLeaderboard({ className }: { className?: string }) {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);

  useEffect(() => {
    const mockArticles: TrendingArticle[] = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      slug: `article-${i + 1}`,
      title: `排行榜文章 ${i + 1}`,
      views: Math.floor(Math.random() * 10000) + 5000,
      likes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 50) + 10,
      trend: i === 0 ? 'hot' : 'rising'
    }));

    setArticles(mockArticles);
  }, []);

  return (
    <div className={cn('cyber-card p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-cyber-cyan" />
        <h3 className="font-display font-bold text-white">本周排行</h3>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* 奖牌背景 */}
            {index < 3 && (
              <div className={cn(
                'absolute -left-2 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                index === 0 && 'bg-gradient-to-br from-yellow-400 to-orange-500 text-yellow-900',
                index === 1 && 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700',
                index === 2 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900'
              )}>
                {index + 1}
              </div>
            )}

            <Link
              href={`/blog/${article.slug}`}
              className="block pl-8 pr-4 py-3 bg-cyber-darker/50 rounded-lg border border-cyber-border hover:border-cyber-cyan/50 transition-all group-hover:bg-cyber-cyan/5"
            >
              <h4 className="text-sm font-medium text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-2">
                {article.title}
              </h4>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views.toLocaleString()}
                </span>
                <span>❤️ {article.likes}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
