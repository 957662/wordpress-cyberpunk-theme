'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, MessageSquare, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface ArticleCardProps {
  id: string;
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
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
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
  index = 0
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    }
  };

  const getCategoryColor = (color?: string) => {
    if (color) return color;
    const colors = [
      'from-cyber-cyan to-blue-500',
      'from-cyber-purple to-pink-500',
      'from-cyber-pink to-red-500',
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group"
      >
        <Link
          href={`/blog/${slug}`}
          className="block p-4 rounded-lg bg-dark-bg/50 border border-dark-border hover:border-cyber-cyan/50 transition-all duration-300"
        >
          <div className="flex gap-4">
            {featuredImage && (
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {viewCount}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-bg to-dark-bg/80 border border-cyber-cyan/30 shadow-neon-cyan hover:shadow-neon-cyan-hover transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-8">
          <div className="flex items-start gap-6 mb-6">
            {featuredImage && (
              <div className="relative w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.slice(0, 2).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold text-white
                      bg-gradient-to-r ${getCategoryColor(category.color)}
                      hover:shadow-neon transition-shadow duration-300
                    `}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link href={`/blog/${slug}`}>
                <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
                  {title}
                </h2>
              </Link>

              <p className="text-gray-400 mb-4 line-clamp-2">{excerpt}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {author.avatar && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyber-cyan/50">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm text-gray-400">{author.name}</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(new Date(publishedAt), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime} 分钟
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {commentCount}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <Link
        href={`/blog/${slug}`}
        className="block h-full rounded-xl bg-dark-bg/50 border border-dark-border overflow-hidden hover:border-cyber-cyan/50 transition-all duration-300 hover:shadow-neon-cyan"
      >
        {featuredImage && (
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category.slug}
                className={`
                  px-2 py-1 rounded-full text-xs font-semibold text-white
                  bg-gradient-to-r ${getCategoryColor(category.color)}
                `}
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
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyber-cyan transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div className="flex items-center gap-2">
              {author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-xs text-gray-400">{author.name}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime}分钟
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {viewCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
