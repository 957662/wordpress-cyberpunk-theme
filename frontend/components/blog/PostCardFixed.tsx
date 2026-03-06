'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, MessageSquare, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface PostCardFixedProps {
  post: {
    id: number;
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
  };
  index?: number;
}

export const PostCardFixed: React.FC<PostCardFixedProps> = ({
  post,
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block h-full rounded-xl bg-dark-bg/50 border border-dark-border overflow-hidden hover:border-cyber-cyan/50 transition-all duration-300 hover:shadow-neon-cyan"
      >
        {post.featuredImage && (
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
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
            {post.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
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
              {post.author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-xs text-gray-400">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}分钟
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.viewCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCardFixed;
