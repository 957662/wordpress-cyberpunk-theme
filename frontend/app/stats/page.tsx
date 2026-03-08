'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Eye, Users, FileText, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats?type=overview')
        const data = await response.json()
        setStats(data.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: '总浏览量',
      value: stats?.totalViews || 0,
      growth: stats?.growth?.views || 0,
      icon: Eye,
      color: 'cyan',
    },
    {
      title: '访客数',
      value: stats?.totalVisitors || 0,
      growth: stats?.growth?.visitors || 0,
      icon: Users,
      color: 'purple',
    },
    {
      title: '文章数',
      value: stats?.totalPosts || 0,
      growth: stats?.growth?.posts || 0,
      icon: FileText,
      color: 'green',
    },
    {
      title: '评论数',
      value: stats?.totalComments || 0,
      growth: stats?.growth?.comments || 0,
      icon: MessageSquare,
      color: 'yellow',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--cyber-cyan)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cyber-bg)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          <h1 className="text-4xl font-bold font-orbitron text-glow-cyan mb-8">
            数据统计
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover>
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          stat.growth >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {stat.growth >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(stat.growth)}%
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-100 mb-1">
                      {stat.value.toLocaleString()}
                    </h3>

                    <p className="text-gray-400">{stat.title}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader
                title="热门文章"
                subtitle="浏览量最高的文章"
              />
              <CardBody>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-[var(--cyber-muted)] rounded-lg hover:bg-[var(--cyber-border)] transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium text-gray-100">
                          示例文章标题 {i}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {15000 - i * 2000} 次浏览
                        </p>
                      </div>
                      <div className="text-[var(--cyber-cyan)]">#{i}</div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="热门分类"
                subtitle="文章最多的分类"
              />
              <CardBody>
                <div className="space-y-4">
                  {[
                    { name: '前端开发', count: 45, percentage: 35 },
                    { name: '后端技术', count: 32, percentage: 25 },
                    { name: 'DevOps', count: 18, percentage: 15 },
                    { name: '数据库', count: 15, percentage: 12 },
                    { name: '算法', count: 12, percentage: 10 },
                  ].map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-100">{category.name}</span>
                        <span className="text-gray-400">{category.count} 篇</span>
                      </div>
                      <div className="h-2 bg-[var(--cyber-muted)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-purple)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
