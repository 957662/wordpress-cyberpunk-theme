'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeCountProps {
  itemId: string;
  itemType: 'article' | 'comment';
  initialCount?: number;
  showAvatars?: boolean;
  maxAvatars?: number;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

interface LikersData {
  count: number;
  likers: Array<{
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  }>;
}

export function LikeCount({
  itemId,
  itemType,
  initialCount = 0,
  showAvatars = true,
  maxAvatars = 3,
  variant = 'default',
  className,
}: LikeCountProps) {
  const [data, setData] = useState<LikersData>({
    count: initialCount,
    likers: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLikers();
  }, [itemId, itemType]);

  const fetchLikers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${itemType}s/${itemId}/likers?limit=${maxAvatars}`);
      if (!response.ok) throw new Error('Failed to fetch likers');

      const likersData = await response.json();
      setData(likersData);
    } catch (error) {
      console.error('Error fetching likers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1.5 text-gray-400', className)}>
        <Heart size={14} className={data.count > 0 ? 'text-pink-500 fill-pink-500' : ''} />
        <span className="text-sm">{data.count}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50',
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 统计信息 */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <Heart className="text-pink-500" size={20} />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{data.count}</p>
            <p className="text-xs text-gray-400">人赞过</p>
          </div>
        </div>

        {/* 点赞用户头像 */}
        {showAvatars && data.likers.length > 0 && (
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {data.likers.map((liker, index) => (
                <motion.div
                  key={liker.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-500">
                    {liker.avatar ? (
                      <img
                        src={liker.avatar}
                        alt={liker.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                        {liker.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {data.count > maxAvatars && (
              <span className="ml-2 text-sm text-gray-400">
                +{data.count - maxAvatars}
              </span>
            )}
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex items-center gap-1 text-cyan-500">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
          </div>
        )}
      </motion.div>
    );
  }

  // 默认样式
  return (
    <motion.div
      className={cn('flex items-center gap-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 头像组 */}
      {showAvatars && data.likers.length > 0 && (
        <div className="flex -space-x-2">
          {data.likers.map((liker, index) => (
            <div
              key={liker.id}
              className="w-7 h-7 rounded-full border-2 border-gray-900 overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-500 ring-1 ring-gray-700"
              title={liker.displayName}
            >
              {liker.avatar ? (
                <img
                  src={liker.avatar}
                  alt={liker.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {liker.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
          {data.count > maxAvatars && (
            <div className="w-7 h-7 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs text-gray-300 ring-1 ring-gray-700">
              +{data.count - maxAvatars}
            </div>
          )}
        </div>
      )}

      {/* 点赞数 */}
      <div className={cn('flex items-center gap-1.5 text-gray-400')}>
        <Heart
          size={16}
          className={cn(
            'transition-colors',
            data.count > 0 && 'text-pink-500'
          )}
        />
        <span className="text-sm font-medium">{data.count}</span>
      </div>

      {isLoading && (
        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      )}
    </motion.div>
  );
}

LikeCount.variants = ['default', 'compact', 'detailed'] as const;
