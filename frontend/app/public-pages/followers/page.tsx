'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Follower {
  id: number
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  followed_at: string
}

export default function FollowersPage() {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchFollowers()
  }, [page])

  const fetchFollowers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/follows/me/followers?page=${page}&page_size=${pageSize}`)
      if (!response.ok) throw new Error('Failed to fetch followers')

      const data = await response.json()
      setFollowers(data.followers || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching followers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: number) => {
    try {
      const response = await fetch(`/api/follows/follow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        // 刷新列表
        fetchFollowers()
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 border-b border-cyber-cyan/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyber-cyan/20 rounded-xl">
              <Users className="w-8 h-8 text-cyber-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">我的粉丝</h1>
              <p className="text-cyber-cyan/80 mt-1">共 {total} 位粉丝</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
          </div>
        ) : followers.length > 0 ? (
          <>
            {/* Followers Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {followers.map((follower, index) => (
                <motion.div
                  key={follower.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-cyber-muted/50 to-cyber-dark/50 border border-cyber-cyan/20 rounded-xl p-6 hover:border-cyber-cyan/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Link href={`/users/${follower.username}`}>
                      <div className="flex-shrink-0">
                        {follower.avatar_url ? (
                          <img
                            src={follower.avatar_url}
                            alt={follower.username}
                            className="w-16 h-16 rounded-full border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-colors"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center text-white text-xl font-bold">
                            {follower.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/users/${follower.username}`}>
                        <h3 className="text-lg font-semibold text-white hover:text-cyber-cyan transition-colors truncate">
                          {follower.full_name || follower.username}
                        </h3>
                      </Link>
                      <p className="text-sm text-cyber-cyan/60">@{follower.username}</p>

                      {follower.bio && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {follower.bio}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        关注于 {new Date(follower.followed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleFollow(follower.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/80 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      回关
                    </button>
                    <Link
                      href={`/users/${follower.username}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-center"
                    >
                      查看
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  上一页
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-cyber-muted/50 rounded-lg">
                  <span className="text-white">
                    第 {page} / {totalPages} 页
                  </span>
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无粉丝</p>
            <p className="text-gray-600 text-sm mt-2">开始发布内容，吸引更多关注者吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}
