'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, Fire, Clock, Eye } from 'lucide-react'
import Link from 'next/link'

export default function TrendingPage() {
  const [trending, setTrending] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch('/api/trending?type=all&limit=10')
        const data = await response.json()
        setTrending(data.data)
      } catch (error) {
        console.error('Failed to fetch trending:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

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
          <div className="flex items-center gap-3 mb-8">
            <Fire className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold font-orbitron text-glow-cyan">
              热门趋势
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card variant="elevated">
                <CardBody>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-[var(--cyber-cyan)]" />
                    <h2 className="text-2xl font-bold text-gray-100">热门文章</h2>
                  </div>

                  <div className="space-y-4">
                    {trending?.posts?.map((post: any, index: number) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={`/blog/${post.id}`}>
                          <Card hover padding="md">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] rounded-lg text-white font-bold">
                                  #{index + 1}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-100 mb-2 hover:text-[var(--cyber-cyan)] transition-colors">
                                  {post.title}
                                </h3>

                                <p className="text-sm text-gray-400 mb-3 line-clamp-1">
                                  {post.excerpt}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.views.toLocaleString()}</span>
                                  </div>

                                  <Badge variant="info" size="sm">
                                    {post.category}
                                  </Badge>

                                  {post.trend === 'up' && (
                                    <span className="flex items-center gap-1 text-green-400">
                                      <TrendingUp className="w-3 h-3" />
                                      {post.trendValue}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="elevated">
                <CardBody>
                  <h3 className="text-xl font-bold text-gray-100 mb-4">热门标签</h3>

                  <div className="flex flex-wrap gap-2">
                    {trending?.tags?.map((tag: any) => (
                      <Badge
                        key={tag.name}
                        variant="default"
                        className="cursor-pointer hover:border-[var(--cyber-cyan)]"
                      >
                        #{tag.name}
                        <span className="ml-1 text-gray-400">({tag.count})</span>
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card variant="elevated">
                <CardBody>
                  <h3 className="text-xl font-bold text-gray-100 mb-4">热门作者</h3>

                  <div className="space-y-3">
                    {trending?.authors?.map((author: any) => (
                      <Link key={author.name} href={`/authors/${author.name}`}>
                        <div className="flex items-center gap-3 p-3 bg-[var(--cyber-muted)] rounded-lg hover:bg-[var(--cyber-border)] transition-colors cursor-pointer">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] rounded-full flex items-center justify-center text-white font-medium">
                            {author.name[0]}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-gray-100">{author.name}</h4>
                            <p className="text-sm text-gray-400">
                              {author.posts} 篇文章
                            </p>
                          </div>

                          <div className="text-sm text-gray-400">
                            {author.followers} 关注者
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
