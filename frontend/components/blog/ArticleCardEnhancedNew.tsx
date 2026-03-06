/**
 * 增强版文章卡片组件
 * 支持更多自定义选项和动画效果
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Eye, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArticleCardEnhancedProps {
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
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
  showStats?: boolean;
  className?: string;
}

export function ArticleCardEnhanced({
  id,
  title,
  slug,
  excerpt,
  featuredImage,
  author,
  categories,
  tags,
  publishedAt,
  readTime,
  viewCount,
  likeCount,
  commentCount,
  variant = 'default',
  index = 0,
  showStats = true,
  className,
}: ArticleCardEnhancedProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
        ease: 'easeOut',
      },
    },
  };

  const getCategoryColor = (color?: string) => {
    if (color) return color;
    const colors = [
      'from-cyber-cyan to-blue-500',
      'from-cyber-purple to-pink-500',
      'from-cyber-pink to-red-500',
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 紧凑型卡片
  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={cn('group', className)}
      >
        <Link
          href={`/blog/${slug}`}
          className="block p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all duration-300"
        >
          <div className="flex gap-4">
            {featuredImage && (
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="96px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">{excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} 分钟
                </span>
                {showStats && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {viewCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // 特色卡片
  if (variant === 'featured') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'group relative overflow-hidden rounded-xl',
          'bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20',
          'border border-cyber-cyan/30 hover:border-cyber-cyan/60',
          'transition-all duration-300',
          className
        )}
      >
        <Link href={`/blog/${slug}`} className="block">
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {featuredImage && (
                <div className="relative w-full lg:w-96 h-56 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={featuredImage}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 384px"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.slice(0, 2).map((category) => (
                    <span
                      key={category.slug}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold text-white',
                        'bg-gradient-to-r',
                        getCategoryColor(category.color),
                        'hover:shadow-neon transition-shadow duration-300'
                      )}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                  {title}
                </h2>

                <p className="text-gray-400 mb-4 line-clamp-2">{excerpt}</p>

                {/* 统计信息 */}
                {showStats && (
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {viewCount} 浏览
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {likeCount} 点赞
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} 评论
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {author.avatar && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyber-cyan/50">
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-white">{author.name}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {readTime} 分钟
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-cyber-cyan font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    阅读更多
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // 默认卡片
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn('group h-full', className)}
    >
      <Link
        href={`/blog/${slug}`}
        className={cn(
          'block h-full rounded-xl overflow-hidden',
          'bg-cyber-dark/50 border border-cyber-cyan/20',
          'hover:border-cyber-cyan/50 transition-all duration-300',
          'hover:shadow-neon-cyan'
        )}
      >
        {featuredImage && (
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category.slug}
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold text-white',
                  'bg-gradient-to-r',
                  getCategoryColor(category.color)
                )}
              >
                {category.name}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{excerpt}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="text-xs text-gray-500 hover:text-cyber-cyan transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-cyber-cyan/10">
            <div className="flex items-center gap-2">
              {author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              )}
              <span className="text-xs text-gray-400">{author.name}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime}分钟
              </span>
              {showStats && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {viewCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ArticleCardEnhanced;
