'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleRatingProps {
  articleId: number;
  initialRating?: number;
  initialLikes?: number;
  initialDislikes?: number;
  userRating?: number;
  className?: string;
}

interface RatingStats {
  average: number;
  total: number;
  distribution: [number, number, number, number, number]; // 5星到1星的数量
}

export function ArticleRating({
  articleId,
  initialRating = 0,
  initialLikes = 0,
  initialDislikes = 0,
  userRating,
  className
}: ArticleRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(userRating || 0);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [showStats, setShowStats] = useState(false);

  // 模拟评分统计
  const ratingStats: RatingStats = {
    average: initialRating,
    total: Math.floor(Math.random() * 100) + 10,
    distribution: [
      Math.floor(initialRating * 0.5),
      Math.floor(initialRating * 0.2),
      Math.floor(initialRating * 0.15),
      Math.floor(initialRating * 0.1),
      Math.floor(initialRating * 0.05)
    ]
  };

  const handleRating = async (rating: number) => {
    setCurrentRating(rating);
    // 这里应该调用 API 保存评分
    console.log(`文章 ${articleId} 评分: ${rating} 星`);
  };

  const handleVote = async (type: 'like' | 'dislike') => {
    if (userVote === type) {
      // 取消投票
      setUserVote(null);
      if (type === 'like') {
        setLikes(likes - 1);
      } else {
        setDislikes(dislikes - 1);
      }
    } else {
      // 新投票或改变投票
      if (userVote) {
        // 改变投票
        if (userVote === 'like') {
          setLikes(likes - 1);
        } else {
          setDislikes(dislikes - 1);
        }
      }

      setUserVote(type);
      if (type === 'like') {
        setLikes(likes + 1);
      } else {
        setDislikes(dislikes + 1);
      }
    }

    // 这里应该调用 API 保存投票
    console.log(`文章 ${articleId} 投票: ${type}`);
  };

  return (
    <div className={cn('cyber-card p-6', className)}>
      {/* 星级评分 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-white">文章评分</h3>
          {ratingStats.total > 0 && (
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
            >
              {showStats ? '隐藏详情' : '查看详情'}
            </button>
          </div>
        </div>

        {/* 星星 */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(star)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors',
                    (hoverRating || currentRating) >= star
                      ? 'fill-cyber-cyan text-cyber-cyan'
                      : 'fill-gray-700 text-gray-700'
                  )}
                />
              </motion.button>
            ))}
          </div>

          {currentRating > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-cyber-cyan font-medium"
            >
              {currentRating}.0 / 5.0
            </motion.span>
          )}
        </div>

        {/* 快速投票 */}
        <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
          <span className="text-sm text-gray-400">这篇文章有帮助吗？</span>

          <div className="flex gap-2">
            <motion.button
              onClick={() => handleVote('like')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                userVote === 'like'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-cyber-darker text-gray-400 hover:bg-cyber-darker hover:text-green-400 border border-cyber-border'
              )}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{likes}</span>
            </motion.button>

            <motion.button
              onClick={() => handleVote('dislike')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                userVote === 'dislike'
                  ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30'
                  : 'bg-cyber-darker text-gray-400 hover:bg-cyber-darker hover:text-cyber-pink border border-cyber-border'
              )}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="text-sm font-medium">{dislikes}</span>
            </motion.button>
          </div>
        </div>

        {/* 评分统计 */}
        {showStats && ratingStats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-4 border-t border-cyber-border space-y-3"
          >
            {/* 平均分 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">
                  {ratingStats.average.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.round(ratingStats.average)
                          ? 'fill-cyber-cyan text-cyber-cyan'
                          : 'fill-gray-700 text-gray-700'
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">总评分</div>
                <div className="text-lg font-medium text-white">
                  {ratingStats.total} 人
                </div>
              </div>
            </div>

            {/* 分布图 */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.distribution[5 - star];
                const percentage = (count / ratingStats.total) * 100;

                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-16">
                      <Star className="w-3.5 h-3.5 fill-gray-600 text-gray-600" />
                      <span className="text-xs text-gray-500">{star} 星</span>
                    </div>
                    <div className="flex-1 h-2 bg-cyber-darker rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                      />
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 简化版评分组件
export function ArticleRatingCompact({
  articleId,
  initialRating = 0,
  userRating,
  className
}: Omit<ArticleRatingProps, 'initialLikes' | 'initialDislikes'>) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(userRating || 0);

  const handleRating = async (rating: number) => {
    setCurrentRating(rating);
    console.log(`文章 ${articleId} 评分: ${rating} 星`);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                'w-5 h-5 transition-colors',
                (hoverRating || currentRating) >= star
                  ? 'fill-cyber-cyan text-cyber-cyan'
                  : 'fill-gray-700 text-gray-700'
              )}
            />
          </button>
        ))}
      </div>

      {initialRating > 0 && (
        <span className="text-sm text-gray-400">
          {initialRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
