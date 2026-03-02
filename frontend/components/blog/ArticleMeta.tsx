'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  MessageSquare,
  Tag,
  Folder,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Author {
  id: number;
  name: string;
  avatar?: string;
  url?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface ArticleMetaProps {
  /**
   * 发布日期
   */
  date: string | Date;
  /**
   * 作者信息
   */
  author?: Author;
  /**
   * 分类
   */
  category?: Category;
  /**
   * 标签列表
   */
  tags?: Tag[];
  /**
   * 阅读时间（分钟）
   */
  readingTime?: number;
  /**
   * 浏览量
   */
  views?: number;
  /**
   * 点赞数
   */
  likes?: number;
  /**
   * 评论数
   */
  comments?: number;
  /**
   * 显示模式：full | compact | minimal
   */
  mode?: 'full' | 'compact' | 'minimal';
  /**
   * 是否显示标签
   */
  showTags?: boolean;
  /**
   * 是否显示分类
   */
  showCategory?: boolean;
}

/**
 * ArticleMeta - 文章元数据组件
 *
 * 功能特性：
 * - 显示文章发布信息
 * - 显示作者、分类、标签
 * - 显示阅读时间、浏览量、点赞数
 * - 多种显示模式
 * - 赛博朋克风格
 */
export function ArticleMeta({
  date,
  author,
  category,
  tags = [],
  readingTime,
  views,
  likes,
  comments,
  mode = 'full',
  showTags = true,
  showCategory = true,
}: ArticleMetaProps) {
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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Compact 模式 - 单行显示
  if (mode === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4 text-sm text-cyber-gray"
      >
        {/* 作者 */}
        {author && (
          <Link
            href={`/author/${author.id}`}
            className="flex items-center gap-2 hover:text-cyber-cyan transition-colors"
          >
            <User className="w-4 h-4" />
            <span>{author.name}</span>
          </Link>
        )}

        {/* 发布日期 */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(date)}</span>
        </div>

        {/* 阅读时间 */}
        {readingTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} 分钟</span>
          </div>
        )}

        {/* 统计数据 */}
        <div className="flex items-center gap-3 ml-auto">
          {views !== undefined && (
            <div className="flex items-center gap-1" title="浏览量">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(views)}</span>
            </div>
          )}

          {likes !== undefined && (
            <div className="flex items-center gap-1" title="点赞数">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(likes)}</span>
            </div>
          )}

          {comments !== undefined && (
            <div className="flex items-center gap-1" title="评论数">
              <MessageSquare className="w-4 h-4" />
              <span>{formatNumber(comments)}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Minimal 模式 - 仅显示基本信息
  if (mode === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 text-xs text-cyber-muted"
      >
        {author && <span>By {author.name}</span>}
        <span>{formatDate(date)}</span>
        {readingTime && <span>{readingTime} min read</span>}
      </motion.div>
    );
  }

  // Full 模式 - 完整显示
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* 主要信息 */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* 作者 */}
        {author && (
          <Link
            href={`/author/${author.id}`}
            className="group flex items-center gap-2"
          >
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full border-2 border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors"
              />
            )}
            <div className="flex items-center gap-2 text-cyber-gray group-hover:text-cyber-cyan transition-colors">
              <User className="w-4 h-4" />
              <span>{author.name}</span>
            </div>
          </Link>
        )}

        {/* 分隔符 */}
        {author && <span className="text-cyber-muted">•</span>}

        {/* 发布日期 */}
        <div className="flex items-center gap-2 text-cyber-gray">
          <Calendar className="w-4 h-4 text-cyber-cyan" />
          <time dateTime={new Date(date).toISOString()}>
            {formatDate(date)}
          </time>
        </div>

        {/* 阅读时间 */}
        {readingTime && (
          <>
            <span className="text-cyber-muted">•</span>
            <div className="flex items-center gap-2 text-cyber-gray">
              <Clock className="w-4 h-4 text-cyber-purple" />
              <span>{readingTime} 分钟阅读</span>
            </div>
          </>
        )}
      </div>

      {/* 分类和标签 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 分类 */}
        {showCategory && category && (
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
          >
            <Folder className="w-4 h-4" />
            <span>{category.name}</span>
          </Link>
        )}

        {/* 标签 */}
        {showTags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-cyber-purple" />
            {tags.slice(0, 5).map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-2.5 py-1 bg-cyber-purple/10 border border-cyber-purple/30 rounded-md text-xs text-cyber-purple hover:bg-cyber-purple/20 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
            {tags.length > 5 && (
              <span className="text-xs text-cyber-muted">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 统计数据 */}
      {(views !== undefined || likes !== undefined || comments !== undefined) && (
        <div className="flex items-center gap-6 pt-4 border-t border-cyber-cyan/20">
          {views !== undefined && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-sm text-cyber-gray"
              title="浏览量"
            >
              <Eye className="w-5 h-5 text-cyber-cyan" />
              <span>{formatNumber(views)} 次浏览</span>
            </motion.div>
          )}

          {likes !== undefined && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-sm text-cyber-gray"
              title="点赞数"
            >
              <Heart className="w-5 h-5 text-cyber-pink" />
              <span>{formatNumber(likes)} 点赞</span>
            </motion.div>
          )}

          {comments !== undefined && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-sm text-cyber-gray"
              title="评论数"
            >
              <MessageSquare className="w-5 h-5 text-cyber-purple" />
              <span>{formatNumber(comments)} 评论</span>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/**
 * ArticleMetaInline - 内联模式的文章元数据
 */
export function ArticleMetaInline(props: ArticleMetaProps) {
  return <ArticleMeta {...props} mode="compact" />;
}

/**
 * ArticleMetaMinimal - 最小化模式的文章元数据
 */
export function ArticleMetaMinimal(props: ArticleMetaProps) {
  return <ArticleMeta {...props} mode="minimal" />;
}

export default ArticleMeta;
