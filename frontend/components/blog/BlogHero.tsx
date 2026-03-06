'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/models';
import { cn, formatDate } from '@/lib/utils';

export interface BlogHeroProps {
  post: BlogPost;
  className?: string;
}

export function BlogHero({ post, className }: BlogHeroProps) {
  return (
    <section className={cn('relative overflow-hidden rounded-2xl', className)}>
      <Link href={`/blog/${post.slug}`} className="block group">
        {/* 背景图片 */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900">
          {post.featuredImage && (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              priority
              sizes="100vw"
            />
          )}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* 内容 */}
          <div className="absolute inset-0 flex items-end p-6 md:p-10 lg:p-16">
            <div className="w-full max-w-4xl">
              {/* 分类标签 */}
              {post.category && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              )}

              {/* 标题 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                {post.title}
              </h1>

              {/* 摘要 */}
              {post.excerpt && (
                <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-2 md:line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{post.author}</span>
                  </div>
                )}

                {post.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <time dateTime={post.date}>{formatDate(post.date, 'long')}</time>
                  </div>
                )}

                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{post.readingTime} 分钟阅读</span>
                  </div>
                )}
              </div>

              {/* CTA 按钮 */}
              <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                <span>阅读全文</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default BlogHero;
