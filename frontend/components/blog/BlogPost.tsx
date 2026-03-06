/**
 * 博客文章详情组件
 * 显示完整的博客文章内容
 */

'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Bookmark, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
      bio?: string;
    };
    coverImage?: string;
    category: string;
    publishedAt: string;
    readTime: number;
    views?: number;
    likes?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    tags?: string[];
  };
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function BlogPost({ post, onLike, onBookmark, onShare }: BlogPostProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回博客</span>
        </Link>
      </motion.div>

      {/* Cover Image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="aspect-[16/9] w-full mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20"
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={675}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded-full border border-cyber-cyan/30">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} 分钟阅读</span>
          </div>
          {post.views && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{post.views} 阅读</span>
            </div>
          )}
        </div>

        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author & Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-cyber-cyan/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                <User className="w-6 h-6 text-cyber-cyan" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-200">{post.author.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-border/50 rounded-lg text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">分享</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
              className={cn(
                'flex items-center gap-2 px-4 py-2 border rounded-lg transition-all',
                post.isLiked
                  ? 'bg-cyber-pink/10 border-cyber-pink/50 text-cyber-pink'
                  : 'bg-cyber-dark/50 border-cyber-border/50 text-gray-300 hover:text-cyber-pink hover:border-cyber-pink/50'
              )}
            >
              <Heart className={cn('w-4 h-4', post.isLiked && 'fill-current')} />
              <span className="hidden sm:inline">{post.likes || '赞'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookmark}
              className={cn(
                'flex items-center gap-2 px-4 py-2 border rounded-lg transition-all',
                post.isBookmarked
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/50 text-cyber-cyan'
                  : 'bg-cyber-dark/50 border-cyber-border/50 text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan/50'
              )}
            >
              <Bookmark className={cn('w-4 h-4', post.isBookmarked && 'fill-current')} />
              <span className="hidden sm:inline">收藏</span>
            </motion.button>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="text-sm px-3 py-1 bg-cyber-dark/50 border border-cyber-border/50 rounded-full text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="prose prose-invert prose-cyber max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Share Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 pt-8 border-t border-cyber-border/50"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-gray-200 mb-2">
              喜欢这篇文章吗?
            </h3>
            <p className="text-gray-500">分享给你的朋友,让更多人看到</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="flex items-center gap-2 px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/20 transition-all font-medium"
          >
            <Share2 className="w-5 h-5" />
            分享文章
          </motion.button>
        </div>
      </motion.div>
    </article>
  );
}
