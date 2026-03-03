'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Bookmark,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { activityApi } from '@/lib/api/social';

interface ActivityFeedProps {
  userId?: string;
  globalFeed?: boolean;
  maxItems?: number;
  showLoadMore?: boolean;
  className?: string;
}

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'bookmark' | 'post' | 'mention';
  actor: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    title?: string;
    excerpt?: string;
  };
  createdAt: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  userId,
  globalFeed = false,
  maxItems = 10,
  showLoadMore = true,
  className,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [userId, globalFeed]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setPage(1);
      const response = globalFeed
        ? await activityApi.getActivityFeed(1, maxItems)
        : userId
        ? await activityApi.getUserActivity(userId, 1, maxItems)
        : null;

      if (response?.success && response.data) {
        setActivities(response.data.activities);
        setHasMore(response.data.activities.length >= maxItems);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const response = globalFeed
        ? await activityApi.getActivityFeed(nextPage, maxItems)
        : userId
        ? await activityApi.getUserActivity(userId, nextPage, maxItems)
        : null;

      if (response?.success && response.data) {
        setActivities((prev) => [...prev, ...response.data.activities]);
        setPage(nextPage);
        setHasMore(response.data.activities.length >= maxItems);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getIconForType = (type: Activity['type']) => {
    const icons = {
      like: <Heart size={16} className="text-cyber-pink" />,
      comment: <MessageCircle size={16} className="text-cyber-cyan" />,
      follow: <UserPlus size={16} className="text-cyber-purple" />,
      bookmark: <Bookmark size={16} className="text-cyber-yellow" />,
      post: <TrendingUp size={16} className="text-green-400" />,
      mention: <MessageCircle size={16} className="text-orange-400" />,
    };
    return icons[type] || icons.like;
  };

  const getActionText = (activity: Activity) => {
    const texts = {
      like: 'liked your post',
      comment: 'commented on',
      follow: 'started following',
      bookmark: 'bookmarked',
      post: 'published',
      mention: 'mentioned you in',
    };
    return texts[activity.type];
  };

  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-cyber-purple/20 p-6',
        className
      )}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-cyber-purple" size={32} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-red-500/20 p-6',
        className
      )}>
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn(
        'rounded-xl bg-cyber-dark/50 border border-cyber-purple/20 p-12',
        'flex flex-col items-center justify-center gap-4',
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-cyber-purple/10 flex items-center justify-center">
          <TrendingUp size={32} className="text-cyber-purple/50" />
        </div>
        <div className="text-center">
          <p className="text-cyber-muted text-sm mb-1">No activity yet</p>
          <p className="text-cyber-muted/50 text-xs">
            {globalFeed ? 'Be the first to post something!' : 'Activity will appear here'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl bg-gradient-to-br from-cyber-dark/80 to-cyber-dark/60',
      'border border-cyber-purple/20 p-6',
      className
    )}>
      <h3 className="text-lg font-semibold text-white mb-6">
        {globalFeed ? 'Global Activity' : 'Recent Activity'}
      </h3>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-start gap-4 p-4 rounded-lg"
            >
              {/* Actor Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink p-0.5">
                  <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center overflow-hidden">
                    {activity.actor.avatar ? (
                      <img
                        src={activity.actor.avatar}
                        alt={activity.actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {activity.actor.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Activity Icon Badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyber-dark flex items-center justify-center border-2 border-cyber-dark">
                  {getIconForType(activity.type)}
                </div>
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cyber-muted mb-1">
                  <span className="font-medium text-white">
                    {activity.actor.name}
                  </span>
                  {' '}
                  <span className="text-cyber-muted/70">
                    {getActionText(activity)}
                  </span>
                  {activity.target?.title && (
                    <span className="text-white/90">
                      "{activity.target.title}"
                    </span>
                  )}
                </p>

                {activity.target?.excerpt && (
                  <p className="text-xs text-cyber-muted/50 line-clamp-2">
                    {activity.target.excerpt}
                  </p>
                )}

                <p className="text-xs text-cyber-muted/40 mt-2">
                  {formatTimeAgo(activity.createdAt)}
                </p>
              </div>

              {/* Hover Action */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-cyber-purple/10 flex items-center justify-center">
                  <TrendingUp size={14} className="text-cyber-purple" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showLoadMore && hasMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className={cn(
            'w-full mt-6 py-3 px-4 rounded-lg',
            'bg-cyber-purple/10 border border-cyber-purple/20',
            'text-cyber-purple hover:bg-cyber-purple/20',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
          )}
        >
          {isLoadingMore ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <TrendingUp size={16} />
              <span>Load More Activity</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ActivityFeed;
