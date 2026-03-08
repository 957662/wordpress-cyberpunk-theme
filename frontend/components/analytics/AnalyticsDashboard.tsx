'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  avgTimeOnPage: number
  bounceRate: number
  topPages: Array<{
    path: string
    views: number
    trend: 'up' | 'down'
    change: number
  }>
  trafficSources: Array<{
    source: string
    visits: number
    percentage: number
  }>
  deviceStats: Array<{
    device: string
    count: number
    percentage: number
  }>
}

export interface AnalyticsDashboardProps {
  data?: AnalyticsData
  loading?: boolean
  className?: string
}

const mockData: AnalyticsData = {
  totalViews: 125430,
  uniqueVisitors: 45230,
  avgTimeOnPage: 245,
  bounceRate: 42.5,
  topPages: [
    { path: '/blog/getting-started', views: 8532, trend: 'up', change: 12.5 },
    { path: '/blog/advanced-tips', views: 6421, trend: 'up', change: 8.3 },
    { path: '/docs/api-reference', views: 5210, trend: 'down', change: -3.2 },
    { path: '/components/gallery', views: 4892, trend: 'up', change: 15.7 },
    { path: '/tutorials', views: 3654, trend: 'up', change: 6.8 }
  ],
  trafficSources: [
    { source: 'Google', visits: 18500, percentage: 41 },
    { source: 'Direct', visits: 11200, percentage: 25 },
    { source: 'Social Media', visits: 8950, percentage: 20 },
    { source: 'Referral', visits: 6200, percentage: 14 }
  ],
  deviceStats: [
    { device: 'Desktop', count: 26780, percentage: 59 },
    { device: 'Mobile', count: 15840, percentage: 35 },
    { device: 'Tablet', count: 2610, percentage: 6 }
  ]
}

export function AnalyticsDashboard({
  data = mockData,
  loading = false,
  className
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan" />
      </div>
    )
  }

  const metrics = [
    {
      title: '总浏览量',
      value: data.totalViews,
      icon: Eye,
      color: 'cyan',
      trend: 'up',
      change: '+12.5%'
    },
    {
      title: '独立访客',
      value: data.uniqueVisitors,
      icon: Users,
      color: 'purple',
      trend: 'up',
      change: '+8.3%'
    },
    {
      title: '平均停留时间',
      value: `${Math.floor(data.avgTimeOnPage / 60)}:${(data.avgTimeOnPage % 60).toString().padStart(2, '0')}`,
      icon: Clock,
      color: 'green',
      trend: 'up',
      change: '+5.2%'
    },
    {
      title: '跳出率',
      value: `${data.bounceRate}%`,
      icon: Activity,
      color: 'yellow',
      trend: 'down',
      change: '-3.1%'
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* 标题和时间范围选择器 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">分析仪表板</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                timeRange === range
                  ? 'bg-cyber-cyan text-white shadow-neon-cyan'
                  : 'bg-cyber-muted text-gray-400 hover:text-gray-100'
              )}
            >
              {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
            </button>
          ))}
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('p-3 rounded-lg bg-cyber-' + metric.color + '/10')}>
                    <metric.icon className={cn('w-6 h-6 text-cyber-' + metric.color)} />
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-1 text-sm',
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {metric.change}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-100 mb-1">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </h3>

                <p className="text-gray-400">{metric.title}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 热门页面和流量来源 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门页面 */}
        <Card>
          <CardHeader
            title="热门页面"
            subtitle="访问量最高的页面"
          />
          <CardBody>
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-cyber-muted rounded-lg hover:bg-cyber-border transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={cn(
                        'w-6 h-6 rounded flex items-center justify-center text-xs font-bold',
                        index < 3 ? 'bg-cyber-cyan text-white' : 'bg-cyber-border text-gray-400'
                      )}>
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-gray-100 truncate">
                        {page.path}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400 ml-9">
                      {page.views.toLocaleString()} 次浏览
                    </p>
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-1 text-sm',
                      page.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {page.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(page.change)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 流量来源 */}
        <Card>
          <CardHeader
            title="流量来源"
            subtitle="访问来源分布"
          />
          <CardBody>
            <div className="space-y-4">
              {data.trafficSources.map((source, index) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-100">{source.source}</span>
                    <span className="text-gray-400">
                      {source.visits.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-cyber-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 设备统计 */}
      <Card>
        <CardHeader
          title="设备统计"
          subtitle="访客设备类型分布"
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.deviceStats.map((device) => (
              <div
                key={device.device}
                className="text-center p-6 bg-cyber-muted rounded-lg"
              >
                <div className="text-4xl font-bold text-cyber-cyan mb-2">
                  {device.percentage}%
                </div>
                <div className="text-lg font-medium text-gray-100 mb-1">
                  {device.device}
                </div>
                <div className="text-sm text-gray-400">
                  {device.count.toLocaleString()} 次访问
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
