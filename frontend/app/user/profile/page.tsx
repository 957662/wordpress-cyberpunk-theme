'use client';

/**
 * User Profile Page
 * 用户个人中心页面
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Link as LinkIcon, Edit, Settings } from 'lucide-react';
import { UserProfileCard } from '@/components/user/UserProfileCard';
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberTabs } from '@/components/ui/CyberTabs';
import { mockUserPosts, mockUserLiked, mockUserSaved } from '@/lib/mock-data';

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState({
    id: 1,
    username: 'cyberuser',
    displayName: '赛博用户',
    avatar: '/images/avatar-placeholder.jpg',
    bio: '热爱技术与设计的开发者，专注于前端开发与用户体验设计。',
    website: 'https://cyberuser.dev',
    location: '上海, 中国',
    joinedAt: '2023-01-15',
    stats: {
      posts: 42,
      followers: 1024,
      following: 256,
    },
  });

  const tabs = [
    { id: 'posts', label: '文章', count: user.stats.posts },
    { id: 'liked', label: '喜欢', count: 128 },
    { id: 'saved', label: '收藏', count: 64 },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'posts':
        return <ArticleGrid posts={mockUserPosts} />;
      case 'liked':
        return <ArticleGrid posts={mockUserLiked} />;
      case 'saved':
        return <ArticleGrid posts={mockUserSaved} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">个人中心</h1>
            </div>
            <div className="flex items-center gap-3">
              <CyberButton variant="ghost" size="sm" icon={<Settings className="w-4 h-4" />}>
                设置
              </CyberButton>
              <CyberButton variant="primary" size="sm" icon={<Edit className="w-4 h-4" />}>
                编辑资料
              </CyberButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：用户资料卡片 */}
          <div className="lg:col-span-1">
            <UserProfileCard user={user} isOwner={true} />
          </div>

          {/* 右侧：内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标签切换 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CyberTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pills"
              />
            </motion.div>

            {/* 内容区域 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              key={activeTab}
            >
              {getContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
