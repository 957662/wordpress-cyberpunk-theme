'use client';

import { motion } from 'framer-motion';
import { Calendar, User, Clock, Eye, Star, Edit } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import clsx from 'clsx';

interface Author {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface ArticleHeaderProps {
  /**
   * 文章标题
   */
  title: string;
  /**
   * 文章副标题/摘要
   */
  excerpt?: string;
  /**
   * 特色图片
   */
  featuredImage?: string;
  /**
   * 作者信息
   */
  author?: Author;
  /**
   * 发布日期
   */
  date: string | Date;
  /**
   * 更新日期
   */
  modifiedDate?: string | Date;
  /**
   * 分类
   */
  category?: Category;
  /**
   * 阅读时间（分钟）
   */
  readingTime?: number;
  /**
   * 浏览量
   */
  views?: number;
  /**
   * 是否为精选文章
   */
  featured?: boolean;
  /**
   * 文章状态：published | draft | pending
   */
  status?: 'published' | 'draft' | 'pending';
  /**
   * 样式变体：default | minimal | hero
   */
  variant?: 'default' | 'minimal' | 'hero';
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * ArticleHeader - 文章头部组件
 *
 * 功能特性：
 * - 多种样式变体
 * - 显示文章元数据
 * - 支持特色图片
 * - 赛博朋克风格
 * - 响应式设计
 */
export function ArticleHeader({
  title,
  excerpt,
  featuredImage,
  author,
  date,
  modifiedDate,
  category,
  readingTime,
  views,
  featured = false,
  status = 'published',
  variant = 'default',
  className = '',
}: ArticleHeaderProps) {
  const formatDate = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: zhCN,
      });
    } catch {
      return '未知时间';
    }
  };

  // Hero 变体 - 全屏大图
  if (variant === 'hero' && featuredImage) {
    return (
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          'relative min-h-[60vh] flex items-center justify-center overflow-hidden',
          className
        )}
      >
        {/* 背景图片 */}
        <div className="absolute inset-0 z-0">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/70 via-cyber-dark/50 to-cyber-dark" />
        </div>

        {/* 内容 */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
          {/* 分类标签 */}
          {category && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 backdrop-blur-sm border border-cyber-cyan/50 rounded-full text-cyber-cyan font-medium hover:bg-cyber-cyan/30 transition-colors"
              >
                <Star className="w-4 h-4" />
                {category.name}
              </Link>
            </motion.div>
          )}

          {/* 标题 */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {/* 摘要 */}
          {excerpt && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-cyber-gray max-w-2xl mx-auto mb-8"
            >
              {excerpt}
            </motion.p>
          )}

          {/* 元数据 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-cyber-gray"
          >
            {author && (
              <Link
                href={`/author/${author.id}`}
                className="flex items-center gap-2 hover:text-cyber-cyan transition-colors"
              >
                {author.avatar && (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-8 h-8 rounded-full border-2 border-cyber-cyan"
                  />
                )}
                <span>{author.name}</span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(date)}</span>
            </div>

            {readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} 分钟</span>
              </div>
            )}

            {views !== undefined && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{views} 次浏览</span>
              </div>
            )}
          </motion.div>

          {/* 状态标签 */}
          {status !== 'published' && (
            <div className="mt-6">
              <span
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium',
                  status === 'draft' && 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50',
                  status === 'pending' && 'bg-blue-500/20 text-blue-500 border border-blue-500/50'
                )}
              >
                {status === 'draft' ? '草稿' : '待审核'}
              </span>
            </div>
          )}
        </div>
      </motion.header>
    );
  }

  // Minimal 变体 - 简洁样式
  if (variant === 'minimal') {
    return (
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx('mb-8', className)}
      >
        {/* 分类 */}
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-sm text-cyber-cyan hover:underline"
          >
            {category.name}
          </Link>
        )}

        {/* 标题 */}
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-cyber-white">
          {title}
        </h1>

        {/* 元数据 */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-cyber-gray">
          {author && (
            <Link
              href={`/author/${author.id}`}
              className="hover:text-cyber-cyan transition-colors"
            >
              {author.name}
            </Link>
          )}
          <span>•</span>
          <span>{formatDate(date)}</span>
          {readingTime && <span>• {readingTime} min read</span>}
        </div>
      </motion.header>
    );
  }

  // Default 变体 - 标准样式
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx('mb-8', className)}
    >
      {/* 分类和特色标签 */}
      <div className="flex items-center gap-3 mb-4">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
          >
            {featured && <Star className="w-3 h-3" />}
            {category.name}
          </Link>
        )}

        {status !== 'published' && (
          <span
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-medium',
              status === 'draft' && 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50',
              status === 'pending' && 'bg-blue-500/20 text-blue-500 border border-blue-500/50'
            )}
          >
            {status === 'draft' ? '草稿' : '待审核'}
          </span>
        )}

        {modifiedDate && (
          <span className="flex items-center gap-1 text-xs text-cyber-muted">
            <Edit className="w-3 h-3" />
            已更新 {formatDate(modifiedDate)}
          </span>
        )}
      </div>

      {/* 标题 */}
      <h1 className="text-3xl md:text-5xl font-bold text-cyber-white mb-4 leading-tight">
        {title}
      </h1>

      {/* 摘要 */}
      {excerpt && (
        <p className="text-lg text-cyber-gray mb-6 leading-relaxed">
          {excerpt}
        </p>
      )}

      {/* 特色图片 */}
      {featuredImage && (
        <div className="mb-6 rounded-lg overflow-hidden border border-cyber-cyan/20">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 元数据栏 */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-cyber-cyan/20">
        {/* 作者 */}
        {author && (
          <Link
            href={`/author/${author.id}`}
            className="group flex items-center gap-3"
          >
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-10 h-10 rounded-full border-2 border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors"
              />
            )}
            <div>
              <div className="text-sm text-cyber-muted">作者</div>
              <div className="text-sm text-cyber-gray group-hover:text-cyber-cyan transition-colors">
                {author.name}
              </div>
            </div>
          </Link>
        )}

        {/* 发布信息 */}
        <div className="flex items-center gap-4 text-sm">
          <div>
            <div className="text-cyber-muted">发布于</div>
            <div className="text-cyber-gray">{formatDate(date)}</div>
          </div>

          {readingTime && (
            <div>
              <div className="text-cyber-muted">阅读时间</div>
              <div className="text-cyber-gray">{readingTime} 分钟</div>
            </div>
          )}

          {views !== undefined && (
            <div>
              <div className="text-cyber-muted">浏览</div>
              <div className="text-cyber-gray">{views} 次</div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default ArticleHeader;
