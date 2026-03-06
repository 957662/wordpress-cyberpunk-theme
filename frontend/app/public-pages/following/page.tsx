'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Following {
  id: number
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  followed_at: string
}

export default function FollowingPage() {
  const [following, setFollowing] = useState<Following[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchFollowing()
  }, [page])

  const fetchFollowing = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/follows/me/following?page=${page}&page_size=${pageSize}`)
      if (!response.ok) throw new Error('Failed to fetch following')

      const data = await response.json()
      setFollowing(data.following || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching following:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (userId: number) => {
    if (!confirm('确定要取消关注吗？')) return

    try {
      const response = await fetch(`/api/follows/unfollow/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // 刷新列表
        fetchFollowing()
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border-b border-cyber-purple/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyber-purple/20 rounded-xl">
              <UserCheck className="w-8 h-8 text-cyber-purple" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">我的关注</h1>
              <p className="text-cyber-purple/80 mt-1">共关注 {total} 位用户</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyber-purple animate-spin" />
          </div>
        ) : following.length > 0 ? (
          <>
            {/* Following Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {following.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-cyber-muted/50 to-cyber-dark/50 border border-cyber-purple/20 rounded-xl p-6 hover:border-cyber-purple/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Link href={`/users/${user.username}`}>
                      <div className="flex-shrink-0">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-16 h-16 rounded-full border-2 border-cyber-purple/30 hover:border-cyber-purple/60 transition-colors"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/users/${user.username}`}>
                        <h3 className="text-lg font-semibold text-white hover:text-cyber-purple transition-colors truncate">
                          {user.full_name || user.username}
                        </h3>
                      </Link>
                      <p className="text-sm text-cyber-purple/60">@{user.username}</p>

                      {user.bio && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {user.bio}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        关注于 {new Date(user.followed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleUnfollow(user.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      取消关注
                    </button>
                    <Link
                      href={`/users/${user.username}`}
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
            <UserCheck className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无关注</p>
            <p className="text-gray-600 text-sm mt-2">发现有趣的作者，开始关注吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}
