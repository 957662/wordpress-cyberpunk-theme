/**
 * UserProfileCard - 用户个人资料卡片
 * 显示用户头像、名称、简介等信息
 */

'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Link as LinkIcon, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface UserProfileCardProps {
  user: {
    id: number;
    username: string;
    displayName: string;
    avatar?: string;
    bio?: string;
    website?: string;
    location?: string;
    joinedAt: string;
    stats?: {
      posts: number;
      followers: number;
      following: number;
    };
  };
  isOwner?: boolean;
  onEdit?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export function UserProfileCard({
  user,
  isOwner = false,
  onEdit,
  className,
  variant = 'default',
}: UserProfileCardProps) {
  const containerStyles = {
    default: 'p-6',
    compact: 'p-4',
    detailed: 'p-8',
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-gradient-to-br from-gray-900 to-gray-800',
        'border border-cyber-cyan/20',
        containerStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-cyber-purple/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* 头部：头像和编辑按钮 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-cyber-cyan/50 ring-offset-2 ring-offset-gray-900">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.displayName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {/* 在线状态指示器 */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {user.displayName}
              </h2>
              <p className="text-sm text-cyber-cyan">@{user.username}</p>
            </div>
          </div>

          {isOwner && onEdit && (
            <motion.button
              onClick={onEdit}
              className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* 简介 */}
        {user.bio && variant !== 'compact' && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* 元信息 */}
        {(user.website || user.location || user.joinedAt) && variant !== 'compact' && (
          <div className="space-y-2 mb-4">
            {user.location && (
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {user.location}
              </div>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-cyber-cyan hover:underline"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              加入于 {new Date(user.joinedAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
        )}

        {/* 统计信息 */}
        {user.stats && variant !== 'compact' && (
          <div className="flex items-center space-x-6 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{user.stats.posts}</div>
              <div className="text-xs text-gray-400">文章</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{user.stats.followers}</div>
              <div className="text-xs text-gray-400">粉丝</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{user.stats.following}</div>
              <div className="text-xs text-gray-400">关注</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 紧凑版本
export function UserProfileCardCompact(props: UserProfileCardProps) {
  return <UserProfileCard {...props} variant="compact" />;
}

// 详细版本
export function UserProfileCardDetailed(props: UserProfileCardProps) {
  return <UserProfileCard {...props} variant="detailed" />;
}
