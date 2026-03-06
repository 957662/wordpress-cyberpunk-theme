'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bookmark, Heart, MessageCircle, TrendingUp, Calendar, Clock, Eye, Edit2, LogOut, Bell, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface UserDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: 'admin' | 'user' | 'moderator';
    bio?: string;
    location?: string;
    website?: string;
    joined_at: string;
  };
  stats?: {
    posts?: number;
    comments?: number;
    likes?: number;
    views?: number;
    bookmarks?: number;
  };
  recentActivity?: Array<{
    id: string;
    type: 'post' | 'comment' | 'like' | 'bookmark';
    title: string;
    date: string;
    link?: string;
  }>;
  notifications?: number;
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = 'cyan', href }) => {
  const colorStyles = {
    cyan: 'from-cyber-cyan/20 to-cyber-cyan/5 border-cyber-cyan/30 text-cyber-cyan',
    purple: 'from-cyber-purple/20 to-cyber-purple/5 border-cyber-purple/30 text-cyber-purple',
    pink: 'from-cyber-pink/20 to-cyber-pink/5 border-cyber-pink/30 text-cyber-pink',
    green: 'from-cyber-green/20 to-cyber-green/5 border-cyber-green/30 text-cyber-green',
  };

  const content = (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn('relative overflow-hidden rounded-xl p-6 bg-gradient-to-br border cyber-card transition-all duration-300', colorStyles[color])}
    >
      <div className="mb-4">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-10 blur-2xl" />
    </motion.div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
};

interface ActivityItemProps {
  activity: { id: string; type: 'post' | 'comment' | 'like' | 'bookmark'; title: string; date: string; link?: string };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const icons = {
    post: <Edit2 className="h-4 w-4" />,
    comment: <MessageCircle className="h-4 w-4" />,
    like: <Heart className="h-4 w-4" />,
    bookmark: <Bookmark className="h-4 w-4" />,
  };

  const colors = {
    post: 'text-cyber-cyan bg-cyber-cyan/10',
    comment: 'text-cyber-purple bg-cyber-purple/10',
    like: 'text-cyber-pink bg-cyber-pink/10',
    bookmark: 'text-cyber-green bg-cyber-green/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn('flex items-start gap-3 p-4 rounded-lg cyber-card hover:border-cyber-cyan/50 transition-all duration-300')}
    >
      <div className={cn('p-2 rounded-lg', colors[activity.type])}>{icons[activity.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{activity.title}</p>
        <p className="text-xs text-cyber-muted mt-1">{new Date(activity.date).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  stats = {},
  recentActivity = [],
  notifications = 0,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'activity' as const, label: 'Activity', icon: Clock },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10 border border-cyber-cyan/30"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-cyber-cyan/50" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-3xl font-bold text-white border-4 border-cyber-cyan/50">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-cyber-green rounded-full border-4 border-cyber-dark" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-cyber-muted mb-3">{user.bio || 'No bio yet'}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-cyber-muted">
              {user.email && <span className="flex items-center gap-1"><Globe className="h-4 w-4" />{user.email}</span>}
              {user.location && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{user.location}</span>}
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {new Date(user.joined_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className={cn('relative p-3 rounded-lg cyber-card hover:border-cyber-cyan/50 transition-all duration-300')}>
              <Bell className="h-5 w-5 text-cyber-cyan" />
              {notifications > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink rounded-full text-xs flex items-center justify-center text-white">{notifications}</span>}
            </button>
            <Link href="/settings" className={cn('px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-medium hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300')}>
              Edit Profile
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Edit2 className="h-6 w-6" />} label="Posts" value={stats.posts || 0} color="cyan" href="/dashboard/posts" />
        <StatCard icon={<MessageCircle className="h-6 w-6" />} label="Comments" value={stats.comments || 0} color="purple" href="/dashboard/comments" />
        <StatCard icon={<Heart className="h-6 w-6" />} label="Likes" value={stats.likes || 0} color="pink" href="/dashboard/likes" />
        <StatCard icon={<Bookmark className="h-6 w-6" />} label="Bookmarks" value={stats.bookmarks || 0} color="green" href="/dashboard/bookmarks" />
      </div>

      <div className="border-b border-cyber-muted/20">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-1 pb-4 border-b-2 transition-all duration-300', activeTab === tab.id ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent text-cyber-muted hover:text-white')}
            >
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">{recentActivity.slice(0, 5).map((activity) => <ActivityItem key={activity.id} activity={activity} />)}</div>
            ) : (
              <div className="p-12 text-center text-cyber-muted"><Clock className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No recent activity</p></div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
