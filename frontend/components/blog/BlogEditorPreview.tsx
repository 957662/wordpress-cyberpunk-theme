/**
 * BlogEditorPreview - 博客编辑器预览组件
 * 实时预览文章内容和效果
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlogCardNew } from './BlogCardNew';
import { Post } from '@/types';
import { formatExcerpt, calculateReadingTime, extractFeaturedImage } from '@/lib/utils/blog-helpers';

export interface BlogEditorPreviewProps {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category?: {
    id: string | number;
    name: string;
    slug: string;
    color?: string;
  };
  tags?: Array<{
    id: string | number;
    name: string;
    slug: string;
  }>;
  author?: {
    id: string | number;
    name: string;
    avatar?: string;
  };
  mode?: 'card' | 'full' | 'split';
  showPreview?: boolean;
  onTogglePreview?: () => void;
  className?: string;
}

export const BlogEditorPreview: React.FC<BlogEditorPreviewProps> = ({
  title,
  content,
  excerpt,
  featuredImage,
  category,
  tags,
  author,
  mode = 'card',
  showPreview = true,
  onTogglePreview,
  className,
}) => {
  // 自动生成摘要
  const autoExcerpt = useMemo(() => {
    return excerpt || formatExcerpt(content, 200);
  }, [content, excerpt]);

  // 自动提取封面图
  const autoFeaturedImage = useMemo(() => {
    return featuredImage || extractFeaturedImage(content);
  }, [content, featuredImage]);

  // 计算阅读时间
  const readingTime = useMemo(() => {
    return calculateReadingTime(content);
  }, [content]);

  // 构造预览文章对象
  const previewPost: Post = useMemo(() => {
    return {
      id: 'preview',
      title: title || '无标题',
      content,
      excerpt: autoExcerpt,
      featuredImage: autoFeaturedImage,
      slug: 'preview',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category,
      tags: tags || [],
      author,
      readingTime,
      status: 'published',
    };
  }, [title, content, autoExcerpt, autoFeaturedImage, category, tags, author, readingTime]);

  // 渲染 Markdown 内容
  const renderContent = (htmlContent: string) => {
    return (
      <div
        className="prose prose-invert prose-cyber max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  // 卡片预览模式
  if (mode === 'card' && showPreview) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* 预览控制栏 */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyber-cyan" />
            <span className="text-sm font-semibold text-white">卡片预览</span>
          </div>

          {onTogglePreview && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTogglePreview}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* 卡片预览 */}
        <BlogCardNew post={previewPost} variant="featured" />
      </div>
    );
  }

  // 完整预览模式
  if (mode === 'full' && showPreview) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* 预览控制栏 */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyber-cyan" />
            <span className="text-sm font-semibold text-white">完整预览</span>
          </div>

          <div className="flex items-center gap-2">
            {onTogglePreview && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTogglePreview}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* 完整预览 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
        >
          {/* 封面图 */}
          {autoFeaturedImage && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={autoFeaturedImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          )}

          {/* 内容 */}
          <div className="p-6 md:p-8">
            {/* 分类 */}
            {category && (
              <div className="mb-4">
                <span
                  className={cn(
                    'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                    'bg-cyber-cyan/10 text-cyber-cyan'
                  )}
                >
                  {category.name}
                </span>
              </div>
            )}

            {/* 标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title || '无标题'}
            </h1>

            {/* 摘要 */}
            {autoExcerpt && (
              <p className="text-gray-400 mb-6">{autoExcerpt}</p>
            )}

            {/* 标签 */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 元信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-800">
              <span>{readingTime} 分钟阅读</span>
              {author && <span>作者：{author.name}</span>}
            </div>

            {/* 正文 */}
            <div className="prose prose-invert prose-cyber max-w-none">
              {renderContent(content)}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 分屏预览模式
  if (mode === 'split' && showPreview) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* 预览控制栏 */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyber-cyan" />
            <span className="text-sm font-semibold text-white">分屏预览</span>
          </div>

          <div className="flex items-center gap-2">
            {onTogglePreview && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTogglePreview}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* 分屏预览 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 编辑区占位 */}
          <div className="p-4 bg-gray-900/30 border border-dashed border-gray-700 rounded-lg">
            <p className="text-center text-gray-500 text-sm">编辑器区域</p>
          </div>

          {/* 预览区 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 max-h-[600px] overflow-y-auto"
          >
            {/* 标题 */}
            <h1 className="text-2xl font-bold text-white mb-4">
              {title || '无标题'}
            </h1>

            {/* 摘要 */}
            {autoExcerpt && (
              <p className="text-gray-400 mb-4 text-sm">{autoExcerpt}</p>
            )}

            {/* 标签 */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 正文 */}
            <div className="prose prose-invert prose-cyber prose-sm max-w-none">
              {renderContent(content)}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 隐藏预览时的提示
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-semibold text-gray-400">预览已隐藏</span>
        </div>

        {onTogglePreview && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTogglePreview}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default BlogEditorPreview;
