'use client';

/**
 * Activity Stream Component - Real-time activity feed
 * Shows recent activities from followed users, system notifications,
 * and other relevant updates in real-time.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share2, Star, UserPlus, BookOpen, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Virtuoso } from 'react-virtuoso';

// Types
interface Activity {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'post' | 'bookmark' | 'mention' | 'achievement';
  actor: {
    id: number;
    username: string;
    avatar?: string;
    display_name?: string;
  };
  target?: {
    type: 'post' | 'comment' | 'user';
    id: number;
    title?: string;
    content?: string;
  };
  metadata?: {
    reason?: string;
    points?: number;
  };
  created_at: string;
  is_read: boolean;
}

interface ActivityStreamProps {
  userId?: number;
  showHeader?: boolean;
  maxItems?: number;
  autoRefresh?: boolean;
  onActivityClick?: (activity: Activity) => void;
}

const ACTIVITY_ICONS = {
  like: Heart,
  comment: MessageSquare,
  share: Share2,
  bookmark: Star,
  follow: UserPlus,
  post: BookOpen,
  mention: MessageSquare,
  achievement: TrendingUp,
};

const ACTIVITY_COLORS = {
  like: 'text-pink-500',
  comment: 'text-cyber-cyan',
  share: 'text-green-500',
  bookmark: 'text-yellow-500',
  follow: 'text-purple-500',
  post: 'text-blue-500',
  mention: 'text-cyber-cyan',
  achievement: 'text-orange-500',
};

export function ActivityStream({
  userId,
  showHeader = true,
  maxItems = 50,
  autoRefresh = true,
  onActivityClick,
}: ActivityStreamProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Load activities
  const loadActivities = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        setError(null);
        const endpoint = userId
          ? `/api/v1/users/${userId}/activities`
          : '/api/v1/activities/feed';
        const response = await fetch(
          `${endpoint}?page=${pageNum}&per_page=${maxItems}`
        );

        if (!response.ok) {
          throw new Error('Failed to load activities');
        }

        const data = await response.json();
        const newActivities = data.items || [];

        setActivities((prev) =>
          append ? [...prev, ...newActivities] : newActivities
        );
        setHasMore(newActivities.length === maxItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading activities:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, maxItems]
  );

  // Initial load
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadActivities(1, false);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loadActivities]);

  // Load more
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    loadActivities(nextPage, true);
  }, [hasMore, isLoading, page, loadActivities]);

  // Render activity
  const renderActivity = (activity: Activity) => {
    const Icon = ACTIVITY_ICONS[activity.type];
    const colorClass = ACTIVITY_COLORS[activity.type];

    const getActivityText = () => {
      const actorName = activity.actor.display_name || activity.actor.username;

      switch (activity.type) {
        case 'like':
          return `${actorName} liked your post`;
        case 'comment':
          return `${actorName} commented on your post`;
        case 'follow':
          return `${actorName} started following you`;
        case 'bookmark':
          return `${actorName} bookmarked your post`;
        case 'post':
          return `${actorName} published a new post`;
        case 'mention':
          return `${actorName} mentioned you in a comment`;
        case 'achievement':
          return `You unlocked an achievement: ${activity.metadata?.reason || 'New milestone'}`;
        default:
          return `${actorName} performed an action`;
      }
    };

    return (
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => onActivityClick?.(activity)}
        className={`flex items-start gap-3 p-4 border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5 transition-colors cursor-pointer ${
          !activity.is_read ? 'bg-cyber-cyan/5 border-l-2 border-l-cyber-cyan' : ''
        }`}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-[#16162a] flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Actor */}
              <div className="flex items-center gap-2 mb-1">
                {activity.actor.avatar && (
                  <img
                    src={activity.actor.avatar}
                    alt={activity.actor.username}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                <p className="text-sm text-white font-medium">
                  {activity.actor.display_name || activity.actor.username}
                </p>
              </div>

              {/* Activity text */}
              <p className="text-sm text-gray-300">{getActivityText()}</p>

              {/* Target */}
              {activity.target && activity.target.title && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  "{activity.target.title}"
                </p>
              )}
            </div>

            {/* Time */}
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatDistanceToNow(new Date(activity.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Metadata */}
          {activity.metadata?.points && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-cyber-purple/20 border border-cyber-purple/30 rounded-full">
              <TrendingUp className="w-3 h-3 text-cyber-purple" />
              <span className="text-xs text-cyber-purple">+{activity.metadata.points} points</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (isLoading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-cyber-cyan/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-center">{error}</p>
        <button
          onClick={() => loadActivities()}
          className="mt-4 px-4 py-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan/30 text-cyber-cyan rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="text-cyber-cyan/20 mb-4">
          <TrendingUp className="w-16 h-16" />
        </div>
        <p className="text-gray-400 text-center">No recent activity</p>
        <p className="text-gray-500 text-sm mt-1">Your activity feed will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0f] border border-cyber-cyan/20 rounded-lg overflow-hidden">
      {showHeader && (
        <div className="px-6 py-4 border-b border-cyber-cyan/20 bg-[#16162a]">
          <h2 className="text-lg font-bold text-white">Activity Feed</h2>
          <p className="text-xs text-gray-400">Recent updates from your network</p>
        </div>
      )}

      <div className="divide-y divide-cyber-cyan/10">
        <AnimatePresence mode="popLayout">
          <Virtuoso
            style={{ height: '600px' }}
            data={activities}
            itemContent={(index, activity) => renderActivity(activity)}
            endReached={loadMore}
            components={{
              Footer: () =>
                hasMore ? (
                  <div className="py-4 flex items-center justify-center">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 border-2 border-cyber-cyan/20 rounded-full"></div>
                      <div className="absolute inset-0 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : null,
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
