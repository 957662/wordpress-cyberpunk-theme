'use client';

/**
 * UserProfile - 用户个人中心组件
 * 展示用户信息、统计数据、设置选项
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit,
  Settings,
  Camera,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { ImageOptimizer } from '@/components/performance/core/ImageOptimizer';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email?: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    location?: string;
    website?: string;
    joinedDate?: string;
    stats?: {
      posts: number;
      followers: number;
      following: number;
    };
  };
  isOwner?: boolean;
  className?: string;
}

export function UserProfile({ user, isOwner = false, className }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 overflow-hidden rounded-lg border border-cyber-border">
        {user.coverImage ? (
          <ImageOptimizer
            src={user.coverImage}
            alt={`${user.name}'s cover`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20" />
        )}

        {isOwner && (
          <button
            className="absolute top-4 right-4 p-2 bg-cyber-dark/80 backdrop-blur-sm rounded-lg text-white hover:bg-cyber-dark transition-colors"
            title="更改封面"
          >
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative -mt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cyber-dark overflow-hidden bg-cyber-dark/50 backdrop-blur-sm">
                {user.avatar ? (
                  <ImageOptimizer
                    src={user.avatar}
                    alt={user.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyber-cyan to-cyber-purple">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {isOwner && (
                <button
                  className="absolute bottom-2 right-2 p-2 bg-cyber-dark/80 backdrop-blur-sm rounded-lg text-white hover:bg-cyber-dark transition-colors"
                  title="更改头像"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Name & Actions */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
              {user.bio && (
                <p className="text-gray-400 mb-3">{user.bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    网站
                  </a>
                )}
                {user.joinedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {user.joinedDate}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwner ? (
                <>
                  <CyberButton
                    variant="outline"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => setIsEditing(true)}
                  >
                    编辑资料
                  </CyberButton>
                  <CyberButton
                    variant="ghost"
                    icon={<Settings className="w-4 h-4" />}
                  >
                    设置
                  </CyberButton>
                </>
              ) : (
                <>
                  <CyberButton variant="primary">
                    关注
                  </CyberButton>
                  <CyberButton variant="outline">
                    私信
                  </CyberButton>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          {user.stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cyber-card p-4 text-center border border-cyber-border"
              >
                <div className="text-2xl font-bold text-white">{user.stats.posts}</div>
                <div className="text-sm text-gray-500">文章</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cyber-card p-4 text-center border border-cyber-border"
              >
                <div className="text-2xl font-bold text-white">{user.stats.followers}</div>
                <div className="text-sm text-gray-500">关注者</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cyber-card p-4 text-center border border-cyber-border"
              >
                <div className="text-2xl font-bold text-white">{user.stats.following}</div>
                <div className="text-sm text-gray-500">正在关注</div>
              </motion.div>
            </div>
          )}

          {/* Additional Info */}
          {user.email && (
            <div className="cyber-card p-4 border border-cyber-border">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
