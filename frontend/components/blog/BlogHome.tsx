/**
 * 博客首页 - 完整的博客展示页面
 * 包含特色文章、文章列表、分类筛选、搜索等功能
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, Filter, ChevronDown } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 类型定义
export interface Article {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories: Array<{
    name: string;
    slug: string;
    color?: string;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface BlogHomeProps {
  articles: Article[];
  categories?: string[];
  currentCategory?: string;
}

export function BlogHome({
  articles,
  categories = [],
  currentCategory,
}: BlogHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || '全部');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'mostLiked'>('latest');

  // 过滤和排序文章
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // 按分类过滤
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(article =>
        article.categories.some(cat => cat.name === selectedCategory)
      );
    }

    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // 排序
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'mostLiked':
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        break;
    }

    return filtered;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  // 特色文章（第一篇文章）
  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-dark via-gray-950 to-cyber-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyber-cyan/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 to-cyber-purple/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
                博客文章
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              探索技术、分享见解、记录成长
            </p>

            {/* 搜索框 */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="搜索文章标题、内容或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 text-white placeholder-gray-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* 筛选栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-cyber-dark/30 border border-cyber-cyan/20 rounded-lg p-4"
        >
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === '全部' ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory('全部')}
              className="rounded-full"
            >
              全部
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'primary' : 'ghost'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* 排序和视图切换 */}
          <div className="flex items-center gap-3">
            {/* 排序 */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-all text-white">
                <Filter className="w-4 h-4" />
                <span className="text-sm">
                  {sortBy === 'latest' && '最新发布'}
                  {sortBy === 'popular' && '最多浏览'}
                  {sortBy === 'mostLiked' && '最多点赞'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="absolute top-full right-0 mt-2 w-48 bg-cyber-dark border border-cyber-cyan/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => setSortBy('latest')}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-cyber-cyan/10 transition-colors"
                >
                  最新发布
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-cyber-cyan/10 transition-colors"
                >
                  最多浏览
                </button>
                <button
                  onClick={() => setSortBy('mostLiked')}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-cyber-cyan/10 transition-colors"
                >
                  最多点赞
                </button>
              </div>
            </div>

            {/* 视图切换 */}
            <div className="flex items-center bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 结果统计 */}
        <div className="mb-6 text-sm text-gray-400">
          找到 <span className="text-cyber-cyan font-semibold">{filteredArticles.length}</span> 篇文章
        </div>

        {/* 空状态 */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">暂无文章</h3>
            <p className="text-gray-400">
              {searchQuery || selectedCategory !== '全部'
                ? '没有找到匹配的文章，试试其他关键词或分类'
                : '还没有发布任何文章，敬请期待！'}
            </p>
          </motion.div>
        )}

        {/* 特色文章 */}
        {featuredArticle && viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-cyber-cyan to-cyber-purple rounded-full" />
              特色文章
            </h2>
            <ArticleCard article={featuredArticle} variant="featured" />
          </motion.div>
        )}

        {/* 文章列表 */}
        {regularArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <ArticleCard article={article} variant="default" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {regularArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <ArticleCard article={article} variant="compact" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BlogHome;
