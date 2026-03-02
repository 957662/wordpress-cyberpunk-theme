/**
 * 阅读列表按钮组件
 * 添加/移除文章到阅读列表
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { readingListService } from '@/services/reading-list-service';
import type { ReadingListItem } from '@/services/reading-list-service';

interface ReadingListButtonProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featured_media?: string;
    categories?: Array<{ name: string }>;
    author?: { name: string };
    date?: string;
    tags?: Array<{ name: string }>;
  };
  variant?: 'icon' | 'pill' | 'full';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onToggle?: (isInList: boolean) => void;
}

export function ReadingListButton({
  post,
  variant = 'icon',
  size = 'medium',
  showLabel = false,
  onToggle,
}: ReadingListButtonProps) {
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 检查文章是否在阅读列表中
  useEffect(() => {
    setIsInList(readingListService.isInReadingList(post.id));
  }, [post.id]);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      const newItem: Omit<ReadingListItem, 'addedAt'> = {
        postId: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt?.replace(/<[^>]*>/g, '') || '',
        thumbnail: post.featured_media,
        category: post.categories?.[0]?.name,
        author: post.author?.name,
        publishedAt: post.date || new Date().toISOString(),
        tags: post.tags?.map((t) => t.name),
        priority: 'medium',
      };

      if (isInList) {
        readingListService.removeFromReadingList(post.id);
        setIsInList(false);
        toast.success('已从阅读列表移除');
      } else {
        readingListService.addToReadingList(newItem);
        setIsInList(true);
        toast.success('已添加到阅读列表');
      }

      onToggle?.(!isInList);
    } catch (error) {
      console.error('Failed to toggle reading list:', error);
      toast.error('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24,
  };

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center transition-colors ${
          isInList
            ? 'bg-cyber-purple text-white'
            : 'bg-cyber-muted text-gray-400 hover:text-cyber-purple'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isInList ? '从阅读列表移除' : '添加到阅读列表'}
      >
        {isLoading ? (
          <Loader2 className={`w-${iconSize[size]} h-${iconSize[size]} animate-spin`} />
        ) : isInList ? (
          <BookmarkCheck className={iconSize[size]} />
        ) : (
          <Bookmark className={iconSize[size]} />
        )}
      </motion.button>
    );
  }

  if (variant === 'pill') {
    return (
      <Button
        variant={isInList ? 'primary' : 'outline'}
        size={size}
        onClick={handleToggle}
        disabled={isLoading}
        className="relative"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isInList ? (
          <>
            <BookmarkCheck className="w-4 h-4 mr-2" />
            {showLabel && '已收藏'}
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4 mr-2" />
            {showLabel && '稍后阅读'}
          </>
        )}
      </Button>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
        isInList
          ? 'bg-cyber-purple text-white shadow-lg shadow-cyber-purple/50'
          : 'bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isInList ? (
        <>
          <BookmarkCheck className="w-5 h-5" />
          <span>已在阅读列表</span>
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5" />
          <span>添加到阅读列表</span>
        </>
      )}
    </motion.button>
  );
}
