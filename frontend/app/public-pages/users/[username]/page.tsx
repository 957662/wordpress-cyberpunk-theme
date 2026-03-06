'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Link as LinkIcon, Calendar, Users, UserCheck, Edit, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import FollowButton from '@/components/social/FollowButton'

interface UserProfile {
  id: number
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  website_url: string | null
  created_at: string
  is_following: boolean
  is_followed_by: boolean
  followers_count: number
  following_count: number
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [username])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取用户基本信息
      const userResponse = await fetch(`/api/users/${username}`)
      if (!userResponse.ok) throw new Error('User not found')

      const userData = await userResponse.json()

      // 获取关注状态
      let followStatus = { is_following: false, is_followed_by: false }
      try {
        const statusResponse = await fetch(`/api/follows/check/${userData.id}`)
        if (statusResponse.ok) {
          followStatus = await statusResponse.json()
        }
      } catch (e) {
        // 忽略关注状态获取失败
      }

      // 获取关注统计
      let stats = { followers_count: 0, following_count: 0 }
      try {
        const statsResponse = await fetch(`/api/follows/stats/${userData.id}`)
        if (statsResponse.ok) {
          stats = await statsResponse.json()
        }
      } catch (e) {
        // 忽略统计获取失败
      }

      setUser({
        ...userData,
        ...followStatus,
        ...stats
      })
    } catch (err) {
      setError('用户不存在')
    } finally {
      setLoading(false)
    }
  }

  const handleFollowChange = (isFollowing: boolean) => {
    if (user) {
      setUser({
        ...user,
        is_following: isFollowing,
        followers_count: isFollowing ? user.followers_count + 1 : user.followers_count - 1
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyber-cyan animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-2">{error || '用户不存在'}</h1>
          <p className="text-gray-500">请检查用户名是否正确</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Cover & Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-cyber-purple/30 via-cyber-cyan/30 to-cyber-pink/30" />

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 mb-8">
            {/* Avatar */}
            <div className="flex items-end gap-6">
              <div className="flex-shrink-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-36 h-36 rounded-2xl border-4 border-cyber-dark shadow-xl"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-2xl border-4 border-cyber-dark shadow-xl bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center text-white text-5xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name & Actions */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {user.full_name || user.username}
                    </h1>
                    <p className="text-cyber-cyan/80">@{user.username}</p>
                  </div>

                  <FollowButton
                    userId={user.id}
                    initialFollowing={user.is_following}
                    onFollowChange={handleFollowChange}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Bio & Details */}
            <div className="mt-6 space-y-4">
              {user.bio && (
                <p className="text-gray-300 text-lg">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {user.website_url && (
                  <a
                    href={user.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-cyber-cyan transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {user.website_url.replace(/^https?:\/\//, '')}
                  </a>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  加入于 {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-4">
                <a
                  href={`/users/${user.username}/followers`}
                  className="flex items-center gap-2 hover:text-cyber-cyan transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{user.followers_count}</span>
                  <span className="text-gray-400">粉丝</span>
                </a>

                <a
                  href={`/users/${user.username}/following`}
                  className="flex items-center gap-2 hover:text-cyber-cyan transition-colors"
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="font-semibold">{user.following_count}</span>
                  <span className="text-gray-400">关注</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-cyber-muted/30 to-cyber-dark/30 border border-cyber-cyan/20 rounded-xl p-8">
          <div className="text-center py-12">
            <Edit className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">用户动态</h2>
            <p className="text-gray-500">这里将显示用户的最新文章和活动</p>
          </div>
        </div>
      </div>
    </div>
  )
}
