'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Clock, BookOpen, Trash2, Calendar, Filter, Search, TrendingUp, Eye } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export interface ReadingHistoryItem {
  id: string
  postId: string
  title: string
  slug: string
  excerpt: string
  thumbnail?: string
  category: string
  author: string
  readAt: Date
  progress: number // 阅读进度 0-100
  readingTime: number // 阅读时长(分钟)
  viewCount: number
  tags: string[]
}

export interface ReadingHistoryProps {
  userId?: string
  limit?: number
  showFilters?: boolean
  showSearch?: boolean
  emptyMessage?: string
  className?: string
}

export function ReadingHistory({
  userId,
  limit = 20,
  showFilters = true,
  showSearch = true,
  emptyMessage = '暂无阅读记录',
  className = '',
}: ReadingHistoryProps) {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'title'>('recent')

  useEffect(() => {
    fetchReadingHistory()
  }, [userId, limit])

  const fetchReadingHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/reading-history?limit=${limit}`)
      const data = await response.json()
      setHistory(data.data || [])
    } catch (error) {
      console.error('Failed to fetch reading history:', error)
      // 生成模拟数据
      setHistory(generateMockHistory())
    } finally {
      setLoading(false)
    }
  }

  const generateMockHistory = (): ReadingHistoryItem[] => {
    const mockHistory: ReadingHistoryItem[] = [
      {
        id: '1',
        postId: 'post-1',
        title: 'Next.js 14 App Router 完全指南',
        slug: 'nextjs-14-app-router-guide',
        excerpt: '深入了解 Next.js 14 的新特性,包括 App Router、Server Components 等',
        thumbnail: '/images/blog/nextjs.jpg',
        category: '前端开发',
        author: '张三',
        readAt: new Date(Date.now() - 1000 * 60 * 30),
        progress: 100,
        readingTime: 15,
        viewCount: 1,
        tags: ['Next.js', 'React', '前端'],
      },
      {
        id: '2',
        postId: 'post-2',
        title: 'TypeScript 高级类型系统实战',
        slug: 'typescript-advanced-types',
        excerpt: '掌握 TypeScript 的高级类型,提升代码质量和开发效率',
        thumbnail: '/images/blog/typescript.jpg',
        category: '编程语言',
        author: '李四',
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        progress: 65,
        readingTime: 12,
        viewCount: 2,
        tags: ['TypeScript', '类型系统'],
      },
      {
        id: '3',
        postId: 'post-3',
        title: 'React Server Components 深度解析',
        slug: 'react-server-components',
        excerpt: '探索 React Server Components 的原理和最佳实践',
        category: '前端开发',
        author: '王五',
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        progress: 30,
        readingTime: 8,
        viewCount: 1,
        tags: ['React', 'Server Components'],
      },
      {
        id: '4',
        postId: 'post-4',
        title: 'Tailwind CSS 实用技巧大全',
        slug: 'tailwind-css-tips',
        excerpt: '100个实用的 Tailwind CSS 技巧,让你的样式开发更高效',
        thumbnail: '/images/blog/tailwind.jpg',
        category: 'CSS',
        author: '赵六',
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        progress: 100,
        readingTime: 20,
        viewCount: 3,
        tags: ['Tailwind CSS', 'CSS'],
      },
      {
        id: '5',
        postId: 'post-5',
        title: 'Framer Motion 动画开发指南',
        slug: 'framer-motion-guide',
        excerpt: '从零开始学习 Framer Motion,创建精美的动画效果',
        category: '动画',
        author: '孙七',
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        progress: 45,
        readingTime: 10,
        viewCount: 2,
        tags: ['Framer Motion', '动画'],
      },
    ]

    return mockHistory
  }

  const deleteHistoryItem = async (id: string) => {
    try {
      await fetch(`/api/user/reading-history/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Failed to delete history item:', error)
    }

    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAllHistory = async () => {
    if (!confirm('确定要清空所有阅读记录吗?')) return

    try {
      await fetch('/api/user/reading-history/clear', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to clear history:', error)
    }

    setHistory([])
  }

  const formatReadTime = (minutes: number) => {
    if (minutes < 1) return '少于1分钟'
    if (minutes < 60) return `${minutes}分钟`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'green'
    if (progress >= 50) return 'cyan'
    if (progress >= 20) return 'yellow'
    return 'gray'
  }

  const getProgressLabel = (progress: number) => {
    if (progress === 100) return '已完成'
    if (progress >= 50) return '阅读中'
    if (progress > 0) return '开始'
    return '未开始'
  }

  // 过滤和排序
  let filteredHistory = history

  // 搜索过滤
  if (searchQuery) {
    filteredHistory = filteredHistory.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  // 状态过滤
  if (filter === 'in-progress') {
    filteredHistory = filteredHistory.filter((item) => item.progress > 0 && item.progress < 100)
  } else if (filter === 'completed') {
    filteredHistory = filteredHistory.filter((item) => item.progress === 100)
  }

  // 排序
  if (sortBy === 'recent') {
    filteredHistory = [...filteredHistory].sort((a, b) => b.readAt.getTime() - a.readAt.getTime())
  } else if (sortBy === 'progress') {
    filteredHistory = [...filteredHistory].sort((a, b) => b.progress - a.progress)
  } else if (sortBy === 'title') {
    filteredHistory = [...filteredHistory].sort((a, b) => a.title.localeCompare(b.title))
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                    <div className="h-2 bg-gray-800 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-gray-100">阅读历史</h2>
              <p className="text-sm text-gray-400">
                共 {history.length} 篇文章,
                {history.filter((h) => h.progress === 100).length} 篇已完成
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllHistory}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空
              </Button>
            )}
          </div>
        </div>

        {/* 搜索和过滤器 */}
        {(showFilters || showSearch) && (
          <div className="space-y-4">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文章标题、分类或标签..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">状态:</span>
                </div>

                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                    filter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilter('in-progress')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                    filter === 'in-progress'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  阅读中
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                    filter === 'completed'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  已完成
                </button>

                <div className="flex-1" />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="recent">最近阅读</option>
                  <option value="progress">阅读进度</option>
                  <option value="title">标题排序</option>
                </select>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardBody>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => {
              const progressColor = getProgressColor(item.progress)
              const progressLabel = getProgressLabel(item.progress)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blog/${item.slug}`}>
                    <Card hover padding="md">
                      <div className="flex gap-4">
                        {/* 缩略图 */}
                        {item.thumbnail && (
                          <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-100 mb-1 hover:text-cyan-400 transition-colors line-clamp-1">
                                {item.title}
                              </h3>

                              <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                                <Badge variant="info" size="sm">
                                  {item.category}
                                </Badge>
                                <span>{item.author}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {item.viewCount} 次阅读
                                </span>
                              </div>

                              <p className="text-sm text-gray-500 line-clamp-1">{item.excerpt}</p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                deleteHistoryItem(item.id)
                              }}
                              className="flex-shrink-0 p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                            </button>
                          </div>

                          {/* 进度条和元信息 */}
                          <div className="space-y-2">
                            {/* 进度条 */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                  className={`h-full bg-gradient-to-r from-${progressColor}-500 to-${progressColor}-400`}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-300">
                                {item.progress}%
                              </span>
                            </div>

                            {/* 底部信息 */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-3">
                                <Badge variant={item.progress === 100 ? 'success' : 'default'} size="sm">
                                  {progressLabel}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatReadTime(item.readingTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatTimeAgo(item.readAt)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {item.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-gray-600">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default ReadingHistory
