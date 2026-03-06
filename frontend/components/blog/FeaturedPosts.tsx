'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogCardData } from '@/types/blog';

/**
 * FeaturedPosts 组件 - 精选文章轮播
 *
 * @description 展示精选文章的轮播组件
 *
 * @example
 * ```tsx
 * <FeaturedPosts
 *   posts={featuredPosts}
 *   autoPlay={true}
 *   interval={5000}
 *   variant="gradient"
 * />
 * ```
 */

export interface FeaturedPostsProps {
  /** 精选文章列表 */
  posts: BlogCardData[];
  /** 自动播放 */
  autoPlay?: boolean;
  /** 轮播间隔（毫秒） */
  interval?: number;
  /** 显示变体 */
  variant?: 'default' | 'gradient' | 'cyber' | 'minimal';
  /** 显示指示器 */
  showIndicators?: boolean;
  /** 显示导航按钮 */
  showNavigation?: boolean;
  /** 自定义类名 */
  className?: string;
}

export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  autoPlay = true,
  interval = 5000,
  variant = 'default',
  showIndicators = true,
  showNavigation = true,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // 自动播放
  React.useEffect(() => {
    if (!autoPlay || posts.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % posts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, posts.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + posts.length) % posts.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % posts.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  if (posts.length === 0) {
    return null;
  }

  const currentPost = posts[currentIndex];

  return (
    <div className={cn('relative w-full', className)}>
      {/* 轮播容器 */}
      <div className="relative overflow-hidden rounded-xl bg-gray-900">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px]"
          >
            {/* 背景图片 */}
            {currentPost.coverImage && (
              <div className="absolute inset-0">
                <Image
                  src={currentPost.coverImage}
                  alt={currentPost.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
                />
                {/* 遮罩 */}
                <div
                  className={cn(
                    'absolute inset-0',
                    variant === 'gradient' &&
                      'bg-gradient-to-t from-black via-black/50 to-transparent',
                    variant === 'cyber' &&
                      'bg-gradient-to-br from-cyan-900/80 via-purple-900/80 to-pink-900/80',
                    variant === 'minimal' && 'bg-black/60',
                    variant === 'default' && 'bg-gradient-to-t from-black/80 to-transparent'
                  )}
                />
              </div>
            )}

            {/* 内容 */}
            <div className="absolute inset-0 flex items-end p-6 md:p-10 lg:p-16">
              <div className="w-full max-w-4xl">
                {/* 标签 */}
                <div className="flex items-center gap-3 mb-4">
                  {currentPost.category && (
                    <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      {currentPost.category}
                    </span>
                  )}
                  {currentPost.featured && (
                    <span className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-full">
                      精选
                    </span>
                  )}
                </div>

                {/* 标题 */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  <Link
                    href={`/blog/${currentPost.slug}`}
                    className="hover:text-blue-300 transition-colors"
                  >
                    {currentPost.title}
                  </Link>
                </h2>

                {/* 摘要 */}
                {currentPost.excerpt && (
                  <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-2 md:line-clamp-3">
                    {currentPost.excerpt}
                  </p>
                )}

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mb-6">
                  {currentPost.author && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {currentPost.author.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{currentPost.author.name}</span>
                    </div>
                  )}
                  {currentPost.publishedAt && (
                    <span>
                      {new Date(currentPost.publishedAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {currentPost.readingTime && (
                    <span>{currentPost.readingTime} 分钟阅读</span>
                  )}
                </div>

                {/* 统计 */}
                <div className="flex items-center gap-6 text-gray-300 text-sm">
                  {currentPost.viewCount !== undefined && (
                    <span>{currentPost.viewCount} 次浏览</span>
                  )}
                  {currentPost.likeCount !== undefined && (
                    <span>{currentPost.likeCount} 个赞</span>
                  )}
                  {currentPost.commentCount !== undefined && (
                    <span>{currentPost.commentCount} 条评论</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      {showNavigation && posts.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110"
            aria-label="上一张"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110"
            aria-label="下一张"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && posts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`前往第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedPosts;
