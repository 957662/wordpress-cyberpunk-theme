'use client';

import React from 'react';

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'mention';
  user: {
    name: string;
    avatar?: string;
    username?: string;
  };
  content?: string;
  timestamp: string;
  link?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showEmpty?: boolean;
  className?: string;
}

export function ActivityFeed({
  activities,
  maxItems = 10,
  showEmpty = true,
  className = '',
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const icons = {
      post: '📝',
      comment: '💬',
      like: '❤️',
      follow: '👤',
      mention: '@',
    };
    return icons[type];
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'post':
        return 'published a new post';
      case 'comment':
        return `commented: "${activity.content}"`;
      case 'like':
        return 'liked your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you';
      default:
        return 'did something';
    }
  };

  if (displayActivities.length === 0 && !showEmpty) {
    return null;
  }

  return (
    <div className={`bg-gray-900/50 border border-cyan-500/20 rounded-2xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-cyan-100 mb-4">Recent Activity</h3>

      {displayActivities.length === 0 ? (
        <div className="text-center py-8 text-cyan-700">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 hover:bg-cyan-500/5 rounded-lg transition-colors"
            >
              <div className="text-2xl flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {activity.user.avatar && (
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-cyan-300 font-medium text-sm">
                    {activity.user.name}
                  </span>
                  {activity.user.username && (
                    <span className="text-cyan-600 text-sm">
                      @{activity.user.username}
                    </span>
                  )}
                </div>

                <p className="text-cyan-400/80 text-sm mt-1">
                  {getActivityText(activity)}
                </p>

                <p className="text-cyan-700 text-xs mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
