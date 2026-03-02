'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Edit,
  Camera,
  Shield,
  Award
} from 'lucide-react';
import { UserProfileCard } from '@/components/user';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  website: string;
  joinDate: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  stats: {
    posts: number;
    comments: number;
    likes: number;
    followers: number;
    following: number;
  };
  badges: string[];
  achievements: {
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    username: 'cyber_ninja',
    email: 'user@cyberpress.dev',
    displayName: 'Cyber Ninja',
    bio: '全栈开发者 | 赛博朋克爱好者 | 探索未来科技',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber',
    coverImage: 'https://images.unsplash.com/photo-1535868463750-c78d9543614f?w=1200&h=400&fit=crop',
    location: '数字空间',
    website: 'https://cyberpress.dev',
    joinDate: '2024-01-01',
    socialLinks: {
      github: 'https://github.com/cyberninja',
      twitter: 'https://twitter.com/cyberninja',
      linkedin: 'https://linkedin.com/in/cyberninja'
    },
    stats: {
      posts: 128,
      comments: 456,
      likes: 1234,
      followers: 89,
      following: 42
    },
    badges: ['早期用户', '活跃贡献者', '代码大师'],
    achievements: [
      {
        title: '首次发布',
        description: '发布了第一篇文章',
        icon: '📝',
        earnedAt: '2024-01-15'
      },
      {
        title: '社交达人',
        description: '获得100个关注者',
        icon: '🌟',
        earnedAt: '2024-02-20'
      },
      {
        title: '评论专家',
        description: '发表超过100条评论',
        icon: '💬',
        earnedAt: '2024-03-10'
      }
    ]
  });

  const handleSaveProfile = (updatedProfile: Partial<UserProfile>) => {
    setUser({ ...user, ...updatedProfile });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 顶部横幅 */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${user.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/50 backdrop-blur-sm transition-all flex items-center gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4" />
          {isEditing ? '取消编辑' : '编辑资料'}
        </motion.button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：个人资料卡 */}
          <div className="lg:col-span-1">
            <UserProfileCard
              user={user}
              isEditing={isEditing}
              onSave={handleSaveProfile}
            />
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 统计卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {[
                { label: '文章', value: user.stats.posts, color: 'cyan' },
                { label: '评论', value: user.stats.comments, color: 'purple' },
                { label: '获赞', value: user.stats.likes, color: 'pink' },
                { label: '关注者', value: user.stats.followers, color: 'yellow' },
                { label: '关注中', value: user.stats.following, color: 'green' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-lg blur-sm group-hover:blur-md transition-all`} />
                  <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 group-hover:border-gray-600 transition-all">
                    <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 基本信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                基本信息
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">个人简介</label>
                  <p className="text-gray-200">{user.bio}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>加入于 {new Date(user.joinDate).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{user.email}</span>
                  </div>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>{user.website}</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 社交链接 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                社交链接
              </h2>
              <div className="flex flex-wrap gap-4">
                {user.socialLinks.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all group"
                  >
                    <Github className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
                    <span className="text-gray-300 group-hover:text-white">GitHub</span>
                  </a>
                )}
                {user.socialLinks.twitter && (
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all group"
                  >
                    <Twitter className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
                    <span className="text-gray-300 group-hover:text-white">Twitter</span>
                  </a>
                )}
                {user.socialLinks.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
                    <span className="text-gray-300 group-hover:text-white">LinkedIn</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* 徽章与成就 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                徽章与成就
              </h2>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">我的徽章</h3>
                <div className="flex flex-wrap gap-3">
                  {user.badges.map((badge, index) => (
                    <motion.span
                      key={badge}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-500/30 text-sm font-medium"
                    >
                      🏆 {badge}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">成就解锁</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/30 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(achievement.earnedAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
