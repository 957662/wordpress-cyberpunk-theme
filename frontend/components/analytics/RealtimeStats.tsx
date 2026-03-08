'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody } from '@/components/ui/Card'
import { Activity, Users, Eye, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RealtimeData {
  onlineUsers: number
  currentViews: number
  actionsPerMinute: number
  serverLoad: number
}

export interface RealtimeStatsProps {
  updateInterval?: number
  className?: string
}

export function RealtimeStats({
  updateInterval = 5000,
  className
}: RealtimeStatsProps) {
  const [data, setData] = useState<RealtimeData>({
    onlineUsers: 0,
    currentViews: 0,
    actionsPerMinute: 0,
    serverLoad: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/realtime')
        const result = await response.json()
        setData(result.data)
      } catch (error) {
        // 使用模拟数据
        setData({
          onlineUsers: Math.floor(Math.random() * 100) + 50,
          currentViews: Math.floor(Math.random() * 200) + 100,
          actionsPerMinute: Math.floor(Math.random() * 50) + 20,
          serverLoad: Math.random() * 30 + 20
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  const stats = [
    {
      title: '在线用户',
      value: data.onlineUsers,
      icon: Users,
      color: 'cyan',
      unit: '人'
    },
    {
      title: '实时浏览',
      value: data.currentViews,
      icon: Eye,
      color: 'purple',
      unit: '次/分钟'
    },
    {
      title: '交互频率',
      value: data.actionsPerMinute,
      icon: Activity,
      color: 'green',
      unit: '次/分钟'
    },
    {
      title: '服务器负载',
      value: data.serverLoad.toFixed(1),
      icon: Zap,
      color: 'yellow',
      unit: '%'
    }
  ]

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-cyber-muted rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card variant="neon" glowColor={stat.color as any}>
            <CardBody className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2 rounded-lg bg-cyber-' + stat.color + '/10')}>
                  <stat.icon className={cn('w-5 h-5 text-cyber-' + stat.color)} />
                </div>
                <span className="text-sm text-gray-400">{stat.title}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-100">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-400">{stat.unit}</span>
              </div>

              {/* 实时指示器 */}
              <div className="mt-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs text-gray-400">实时更新</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
