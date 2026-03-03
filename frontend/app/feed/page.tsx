/**
 * 社交动态页面
 * Social Feed Page
 */

import { Metadata } from 'next';
import { ActivityFeed } from '@/components/social/ActivityFeed';

export const metadata: Metadata = {
  title: '动态 - CyberPress',
  description: '查看最新的社交动态和活动',
};

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">动态</h1>
          <p className="text-cyber-muted">查看社区中的最新活动</p>
        </div>

        {/* Activity Feed */}
        <ActivityFeed globalFeed showLoadMore />
      </div>
    </div>
  );
}
