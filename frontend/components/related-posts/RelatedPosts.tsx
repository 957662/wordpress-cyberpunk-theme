'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, Calendar, Clock, Tag, TrendingUp } from 'lucide-react';

/**
 * RelatedPosts - 相关文章推荐组件
 *
 * 功能特性：
 * - 基于标签/分类推荐
 * - 智能匹配算法
 * - 多种布局模式
 * - 阅读时间估算
 * - 自定义卡片样式
 */

export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  coverImage?: string;
  publishedAt: Date | string;
  readingTime?: number;
  tags?: string[];
  category?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface RelatedPostsProps {
  /** 当前文章ID */
  currentPostId: string;
  /** 所有文章列表 */
  posts: Post[];
  /** 推荐数量 */
  limit?: number;
  /** 推荐依据 */
  strategy?: 'tags' | 'category' | 'random' | 'recent';
  /** 布局模式 */
  layout?: 'grid' | 'list' | 'masonry';
  /** 是否显示阅读时间 */
  showReadingTime?: boolean;
  /** 是否显示标签 */
  showTags?: boolean;
  /** 是否显示分类 */
  showCategory?: boolean;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义标题 */
  title?: string;
  /** 卡片点击回调 */
  onPostClick?: (post: Post) => void;
}

/**
 * 计算文章相似度
 */
const calculateSimilarity = (currentPost: Post, candidatePost: Post): number => {
  let score = 0;

  // 标签匹配
  if (currentPost.tags && candidatePost.tags) {
    const commonTags = currentPost.tags.filter((tag) =>
      candidatePost.tags?.includes(tag)
    );
    score += commonTags.length * 10;
  }

  // 分类匹配
  if (currentPost.category && currentPost.category === candidatePost.category) {
    score += 5;
  }

  // 作者匹配
  if (
    currentPost.author?.name &&
    currentPost.author.name === candidatePost.author?.name
  ) {
    score += 2;
  }

  return score;
};

/**
 * 推荐文章卡片
 */
interface PostCardProps {
  post: Post;
  layout: 'grid' | 'list' | 'masonry';
  showReadingTime: boolean;
  showTags: boolean;
  showCategory: boolean;
  onClick: () => void;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  layout,
  showReadingTime,
  showTags,
  showCategory,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 布局样式
  const layoutClasses = {
    grid: 'col-span-1',
    list: 'col-span-full',
    masonry: index % 3 === 0 ? 'col-span-2 row-span-2' : 'col-span-1',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'bg-gray-800/50 border border-gray-700',
        'hover:border-cyber-cyan/50 transition-all duration-300',
        layoutClasses[layout],
        isHovered && 'shadow-lg shadow-cyber-cyan/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* 封面图 */}
      {post.coverImage && (
        <div className="relative overflow-hidden aspect-video">
          <motion.img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* 分类标签 */}
          {showCategory && post.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-cyber-purple/90 text-white text-xs font-medium rounded-full">
                {post.category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 内容 */}
      <div className="p-4">
        {/* 标题 */}
        <h3
          className={cn(
            'font-bold text-white mb-2 line-clamp-2',
            'group-hover:text-cyber-cyan transition-colors'
          )}
        >
          {post.title}
        </h3>

        {/* 摘要 */}
        {post.excerpt && layout !== 'grid' && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        {/* 标签 */}
        {showTags && post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 元信息 */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {/* 发布日期 */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>

          {/* 阅读时间 */}
          {showReadingTime && post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} 分钟
            </div>
          )}
        </div>
      </div>

      {/* 悬浮效果 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* 箭头指示器 */}
      <motion.div
        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-cyber-cyan text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
        animate={{ x: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
};

/**
 * 列表布局卡片
 */
const ListPostCard: React.FC<{
  post: Post;
  showReadingTime: boolean;
  onClick: () => void;
  index: number;
}> = ({ post, showReadingTime, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        'group flex items-start gap-4 p-4 rounded-lg',
        'bg-gray-800/30 border border-gray-700',
        'hover:border-cyber-cyan/50 hover:bg-gray-800/50',
        'transition-all duration-300 cursor-pointer'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: 4 }}
    >
      {/* 缩略图 */}
      {post.coverImage && (
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <motion.img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'font-bold text-white mb-1 line-clamp-2',
            'group-hover:text-cyber-cyan transition-colors'
          )}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-gray-400 line-clamp-1 mb-2">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
          {showReadingTime && post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} 分钟
            </div>
          )}
        </div>
      </div>

      <motion.div
        className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center group-hover:bg-cyber-cyan group-hover:text-black transition-colors"
        animate={{ rotate: isHovered ? -45 : 0 }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
};

/**
 * RelatedPosts 主组件
 */
export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPostId,
  posts,
  limit = 3,
  strategy = 'tags',
  layout = 'grid',
  showReadingTime = true,
  showTags = false,
  showCategory = true,
  className,
  style,
  title = '相关推荐',
  onPostClick,
}) => {
  // 查找当前文章
  const currentPost = useMemo(
    () => posts.find((p) => p.id === currentPostId),
    [currentPostId, posts]
  );

  // 推荐相关文章
  const relatedPosts = useMemo(() => {
    // 过滤掉当前文章
    const candidates = posts.filter((p) => p.id !== currentPostId);

    let sorted: Post[] = [];

    switch (strategy) {
      case 'tags':
        if (currentPost) {
          sorted = candidates
            .map((post) => ({
              post,
              score: calculateSimilarity(currentPost, post),
            }))
            .sort((a, b) => b.score - a.score)
            .map(({ post }) => post);
        } else {
          sorted = candidates;
        }
        break;

      case 'category':
        if (currentPost?.category) {
          sorted = candidates
            .filter((p) => p.category === currentPost.category)
            .sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
            );
        }
        break;

      case 'recent':
        sorted = [...candidates].sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        break;

      case 'random':
        sorted = [...candidates].sort(() => Math.random() - 0.5);
        break;

      default:
        sorted = candidates;
    }

    return sorted.slice(0, limit);
  }, [currentPost, posts, currentPostId, strategy, limit]);

  // 如果没有相关文章，不显示
  if (relatedPosts.length === 0) {
    return null;
  }

  // 布局网格类
  const gridClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    list: 'space-y-3',
    masonry: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto',
  };

  return (
    <div className={cn('related-posts', className)} style={style}>
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-cyber-cyan" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      {/* 文章列表 */}
      <div className={gridClasses[layout]}>
        {layout === 'list' ? (
          relatedPosts.map((post, index) => (
            <ListPostCard
              key={post.id}
              post={post}
              showReadingTime={showReadingTime}
              onClick={() => onPostClick?.(post)}
              index={index}
            />
          ))
        ) : (
          relatedPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              layout={layout}
              showReadingTime={showReadingTime}
              showTags={showTags}
              showCategory={showCategory}
              onClick={() => onPostClick?.(post)}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * 侧边栏推荐组件
 */
export const SidebarRelatedPosts: React.FC<
  Omit<RelatedPostsProps, 'layout' | 'limit'> & {
    limit?: number;
  }
> = ({ limit = 5, ...props }) => {
  return (
    <RelatedPosts
      {...props}
      limit={limit}
      layout="list"
      className="sidebar-related-posts"
      title="你可能还喜欢"
    />
  );
};

/**
 * 相关文章网格组件
 */
export const RelatedPostsGrid: React.FC<RelatedPostsProps> = (props) => {
  return (
    <RelatedPosts {...props} layout="grid" className="related-posts-grid" />
  );
};

/**
 * Hook: 获取相关文章
 */
export const useRelatedPosts = (
  currentPostId: string,
  posts: Post[],
  strategy: 'tags' | 'category' | 'random' | 'recent' = 'tags',
  limit: number = 3
) => {
  const relatedPosts = useMemo(() => {
    const candidates = posts.filter((p) => p.id !== currentPostId);
    // ... 推荐逻辑
    return candidates.slice(0, limit);
  }, [currentPostId, posts, strategy, limit]);

  return relatedPosts;
};

export default RelatedPosts;
