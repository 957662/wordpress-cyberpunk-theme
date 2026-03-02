'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Tag, Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  readTime: number;
}

interface ArticleTimelineProps {
  articles: TimelineArticle[];
  className?: string;
  variant?: 'vertical' | 'horizontal';
  showStats?: boolean;
  showTags?: boolean;
  onArticleClick?: (article: TimelineArticle) => void;
}

export const ArticleTimeline: React.FC<ArticleTimelineProps> = ({
  articles,
  className,
  variant = 'vertical',
  showStats = true,
  showTags = true,
  onArticleClick,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique years and categories
  const { years, categories, groupedArticles } = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(articles.map(a => new Date(a.date).getFullYear().toString()))
    ).sort((a, b) => b.localeCompare(a));

    const uniqueCategories = Array.from(
      new Set(articles.map(a => a.category))
    ).sort();

    // Group articles by year
    const grouped = articles.reduce((acc, article) => {
      const year = new Date(article.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(article);
      return acc;
    }, {} as Record<string, TimelineArticle[]>);

    return {
      years: uniqueYears,
      categories: uniqueCategories,
      groupedArticles: grouped,
    };
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const year = new Date(article.date).getFullYear().toString();
      const yearMatch = selectedYear === 'all' || year === selectedYear;
      const categoryMatch =
        selectedCategory === 'all' || article.category === selectedCategory;
      return yearMatch && categoryMatch;
    });
  }, [articles, selectedYear, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: variant === 'vertical' ? -20 : 0, y: variant === 'vertical' ? 0 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  if (variant === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-cyber-cyan focus:outline-none focus:border-cyber-cyan"
          >
            <option value="all">所有年份</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-cyber-dark/50 border border-cyber-purple/30 rounded-lg text-cyber-purple focus:outline-none focus:border-cyber-purple"
          >
            <option value="all">所有分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Horizontal Timeline */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 rounded-full bg-cyber-cyan border-4 border-cyber-dark shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => onArticleClick?.(article)}
                    className="mt-8 w-80 p-6 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg hover:border-cyber-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm text-cyber-cyan/70 mb-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.date)}
                    </div>

                    <h3 className="text-xl font-bold text-cyber-cyan mb-3 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-cyber-gray text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {showTags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-cyber-purple/20 text-cyber-purple rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {showStats && (
                      <div className="flex items-center gap-4 text-xs text-cyber-gray">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {article.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime} 分钟
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-cyber-cyan focus:outline-none focus:border-cyber-cyan"
        >
          <option value="all">所有年份</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-cyber-dark/50 border border-cyber-purple/30 rounded-lg text-cyber-purple focus:outline-none focus:border-cyber-purple"
        >
          <option value="all">所有分类</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Vertical Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink" />

        <AnimatePresence>
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              variants={itemVariants}
              className="relative mb-8 pl-20"
            >
              {/* Timeline dot */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="absolute left-6 top-6 w-5 h-5 rounded-full bg-cyber-dark border-2 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)] z-10"
              />

              {/* Card */}
              <motion.div
                whileHover={{ x: 10 }}
                onClick={() => onArticleClick?.(article)}
                className="p-6 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-cyber-cyan/70">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.date)}
                  </div>
                  <span className="px-3 py-1 text-xs bg-cyber-purple/20 text-cyber-purple rounded-full">
                    {article.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-cyber-cyan mb-3">
                  {article.title}
                </h3>

                <p className="text-cyber-gray mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                {showTags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag className="w-4 h-4 text-cyber-gray" />
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-cyber-dark border border-cyber-gray/30 text-cyber-gray rounded hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {showStats && (
                  <div className="flex items-center gap-6 text-sm text-cyber-gray border-t border-cyber-gray/20 pt-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{article.views} 浏览</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{article.likes} 喜欢</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} 分钟阅读</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 text-cyber-gray">
            没有找到匹配的文章
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ArticleTimeline;
