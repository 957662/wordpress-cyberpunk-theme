'use client';

import React from 'react';
import { CommentSystemEnhanced } from '@/components/comment';
import { LazyImage } from '@/components/performance';
import { UserDashboard } from '@/components/user';
import { NotificationPanel, SearchOverlay } from '@/components/interactive';
import { motion } from 'framer-motion';

export default function NewComponentsExample() {
  // Mock data
  const mockUser = {
    id: '1',
    name: 'Cyber Developer',
    email: 'dev@cyberpress.com',
    avatar: undefined,
    role: 'admin' as const,
    bio: 'Full-stack developer passionate about cyberpunk design and modern web technologies.',
    location: 'Neo Tokyo',
    website: 'https://cyberpress.com',
    joined_at: '2024-01-01T00:00:00Z',
  };

  const mockStats = {
    posts: 42,
    comments: 128,
    likes: 456,
    views: 12890,
    bookmarks: 23,
  };

  const mockActivity = [
    { id: '1', type: 'post' as const, title: 'Published "Getting Started with Next.js 14"', date: '2024-03-06' },
    { id: '2', type: 'comment' as const, title: 'Commented on "TypeScript Best Practices"', date: '2024-03-05' },
    { id: '3', type: 'like' as const, title: 'Liked "Building Modern UIs with Tailwind"', date: '2024-03-05' },
    { id: '4', type: 'bookmark' as const, title: 'Bookmarked "Advanced React Patterns"', date: '2024-03-04' },
  ];

  const mockNotifications = [
    {
      id: '1',
      type: 'like' as const,
      title: 'New like',
      message: 'John Doe liked your post "Getting Started with Next.js 14"',
      created_at: '2024-03-06T10:00:00Z',
      read: false,
    },
    {
      id: '2',
      type: 'comment' as const,
      title: 'New comment',
      message: 'Jane Smith commented on your post',
      created_at: '2024-03-06T09:00:00Z',
      read: false,
    },
    {
      id: '3',
      type: 'follow' as const,
      title: 'New follower',
      message: 'Bob Johnson started following you',
      created_at: '2024-03-05T15:00:00Z',
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-4 text-glow-cyan">
            New Components Showcase
          </h1>
          <p className="text-xl text-cyber-muted">
            Demonstrating the latest additions to CyberPress Platform
          </p>
        </motion.div>

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div />
          <div className="flex items-center gap-4">
            <SearchOverlay
              placeholder="Search components..."
              recentSearches={['Comment', 'Dashboard', 'Notification']}
              trendingSearches={['Next.js', 'TypeScript', 'Tailwind']}
              popularTags={['react', 'vue', 'angular']}
            />
            <NotificationPanel notifications={mockNotifications} />
          </div>
        </div>

        {/* User Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">User Dashboard</h2>
          <UserDashboard
            user={mockUser}
            stats={mockStats}
            recentActivity={mockActivity}
            notifications={3}
          />
        </motion.section>

        {/* Lazy Images Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Lazy Image Loading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LazyImage
                key={i}
                src={`https://picsum.photos/800/600?random=${i}`}
                alt={`Demo image ${i + 1}`}
                width={800}
                height={600}
                priority={i < 3}
                className="aspect-video"
              />
            ))}
          </div>
        </motion.section>

        {/* Comment System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Comment System</h2>
          <CommentSystemEnhanced
            postId="demo-post-123"
            userId={mockUser.id}
            allowNested
            maxDepth={3}
            showReplies
            autoLoadReplies
            enableModeration
            enableRealtime={false}
          />
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center text-cyber-muted"
        >
          <p className="text-sm">
            Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS
          </p>
          <p className="text-xs mt-2">
            Part of the CyberPress Platform • © 2024
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
