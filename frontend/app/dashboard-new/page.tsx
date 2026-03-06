'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';
import { StatCard } from '@/components/charts/StatCard';
import { QuickActions } from '@/components/quick-actions/QuickActions';
import { ChartCard } from '@/components/charts/ChartCard';
import { Timeline } from '@/components/timeline/Timeline';

export default function DashboardPage() {
  // Sample data
  const stats = [
    {
      title: 'Total Users',
      value: '12,345',
      change: 12.5,
      changeType: 'increase' as const,
      icon: Users,
      color: 'cyan' as const,
      sparkline: [40, 60, 45, 80, 55, 70, 65],
    },
    {
      title: 'Total Posts',
      value: '1,234',
      change: 8.2,
      changeType: 'increase' as const,
      icon: FileText,
      color: 'purple' as const,
      sparkline: [30, 50, 40, 70, 60, 80, 75],
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: -2.4,
      changeType: 'decrease' as const,
      icon: DollarSign,
      color: 'green' as const,
      sparkline: [50, 70, 60, 90, 80, 95, 85],
    },
    {
      title: 'Engagement Rate',
      value: '67.8%',
      change: 5.1,
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'pink' as const,
      sparkline: [20, 40, 35, 60, 50, 65, 60],
    },
  ];

  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 700 },
    { name: 'Sun', value: 900 },
  ];

  const timelineData = [
    {
      id: '1',
      title: 'New User Registration',
      description: 'User John Doe created an account',
      date: '2024-03-07',
      time: '10:30 AM',
      icon: Users,
      color: 'cyan' as const,
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Post Published',
      description: '"Getting Started with Next.js" was published',
      date: '2024-03-07',
      time: '09:15 AM',
      icon: FileText,
      color: 'purple' as const,
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'System Update',
      description: 'Security patch v2.3.1 installed',
      date: '2024-03-06',
      time: '11:45 PM',
      icon: Clock,
      color: 'green' as const,
      status: 'in-progress' as const,
    },
    {
      id: '4',
      title: 'Database Backup',
      description: 'Scheduled daily backup',
      date: '2024-03-06',
      time: '02:00 AM',
      icon: Calendar,
      color: 'yellow' as const,
      status: 'pending' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Quick Actions */}
      <QuickActions position="bottom-right" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 border-b border-white/10"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChartCard
              title="Weekly Traffic"
              type="bar"
              data={chartData}
              color="cyan"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ChartCard
              title="User Growth"
              type="line"
              data={chartData}
              color="purple"
            />
          </motion.div>
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <Timeline
              items={timelineData}
              layout="vertical"
              size="md"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
