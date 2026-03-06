'use client';

import { motion } from 'framer-motion';
import { FileText, Users, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  href: string;
  color: 'cyan' | 'purple' | 'pink' | 'green';
}

function StatCard({ title, value, change, icon: Icon, href, color }: StatCardProps) {
  const colorMap = {
    cyan: 'text-cyber-cyan border-cyber-cyan/30 hover:border-cyber-cyan/50',
    purple: 'text-cyber-purple border-cyber-purple/30 hover:border-cyber-purple/50',
    pink: 'text-cyber-pink border-cyber-pink/30 hover:border-cyber-pink/50',
    green: 'text-green-400 border-green-400/30 hover:border-green-400/50',
  };

  const bgMap = {
    cyan: 'bg-cyber-cyan/10',
    purple: 'bg-cyber-purple/10',
    pink: 'bg-cyber-pink/10',
    green: 'bg-green-400/10',
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className={`cyber-card p-6 border ${colorMap[color]} transition-all duration-300`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-flex p-3 rounded-lg ${bgMap[color]} mb-4`}>
              <Icon className={`w-6 h-6 ${colorMap[color].split(' ')[0]}`} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            <p className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {change}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

interface QuickStatsProps {
  stats: {
    posts: { total: number; change: string };
    users: { total: number; change: string };
    views: { total: number; change: string };
    comments: { total: number; change: string };
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      title: '文章总数',
      value: stats.posts.total,
      change: stats.posts.change,
      icon: FileText,
      href: '/admin/posts',
      color: 'cyan' as const,
    },
    {
      title: '用户数量',
      value: stats.users.total,
      change: stats.users.change,
      icon: Users,
      href: '/admin/users',
      color: 'purple' as const,
    },
    {
      title: '今日访问',
      value: stats.views.total,
      change: stats.views.change,
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'pink' as const,
    },
    {
      title: '评论总数',
      value: stats.comments.total,
      change: stats.comments.change,
      icon: MessageSquare,
      href: '/admin/comments',
      color: 'green' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
