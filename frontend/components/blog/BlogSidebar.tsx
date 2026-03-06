'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Tag, TrendingUp, Archive, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BlogSidebarProps {
  categories?: string[];
  tags?: string[];
  popularPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    views?: number;
  }>;
  showSearch?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showPopular?: boolean;
  showArchive?: boolean;
  className?: string;
}

export function BlogSidebar({
  categories = [],
  tags = [],
  popularPosts = [],
  showSearch = true,
  showCategories = true,
  showTags = true,
  showPopular = true,
  showArchive = true,
  className,
}: BlogSidebarProps) {
  return (
    <aside className={cn('space-y-8', className)}>
      {/* 搜索 */}
      {showSearch && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Search size={20} />
            搜索文章
          </h3>
          <div className="relative">
            <input
              type="search"
              placeholder="输入关键词..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      )}

      {/* 分类 */}
      {showCategories && categories.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Archive size={20} />
            文章分类
          </h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <span>{category}</span>
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 热门标签 */}
      {showTags && tags.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Tag size={20} />
            热门标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 热门文章 */}
      {showPopular && popularPosts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            热门文章
          </h3>
          <ul className="space-y-3">
            {popularPosts.map((post, index) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      {post.views && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.views} 次阅读
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 归档 */}
      {showArchive && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Archive size={20} />
            文章归档
          </h3>
          <ul className="space-y-2">
            {['2024年3月', '2024年2月', '2024年1月', '2023年12月'].map((month) => (
              <li key={month}>
                <Link
                  href={`/blog?archive=${encodeURIComponent(month)}`}
                  className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <span>{month}</span>
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default BlogSidebar;
