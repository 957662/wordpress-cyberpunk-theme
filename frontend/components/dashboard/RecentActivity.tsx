'use client';

import { motion } from 'framer-motion';
import { Clock, User, FileText, MessageSquare } from 'lucide-react';
import { CyberCard } from '@/components/cyber/CyberCard';

interface Activity {
  id: string;
  type: 'post' | 'comment' | 'user' | 'like';
  message: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  maxItems?: number;
}

export function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
  const iconMap = {
    post: FileText,
    comment: MessageSquare,
    user: User,
    like: MessageSquare,
  };

  const colorMap = {
    post: 'text-cyber-cyan bg-cyber-cyan/10',
    comment: 'text-cyber-purple bg-cyber-purple/10',
    user: 'text-cyber-pink bg-cyber-pink/10',
    like: 'text-green-400 bg-green-400/10',
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <CyberCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">最近活动</h3>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          const colorClass = colorMap[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-cyber-dark/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span>{activity.user.name}</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayActivities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          暂无活动记录
        </div>
      )}
    </CyberCard>
  );
}
