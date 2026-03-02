'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CyberCard } from '@/components/ui/CyberCard';
import { AvatarUpload } from '@/components/ui/AvatarUpload';
import { Alert } from '@/components/ui/Alert';
import { User, Mail, MapPin, Calendar, Link as LinkIcon, Edit, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '更新失败');
      }

      setMessage({ type: 'success', text: '个人资料已更新' });
      setIsEditing(false);

      // 更新用户信息
      // useAuthStore.getState().updateProfile(result.user);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '更新失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '上传失败');
      }

      setMessage({ type: 'success', text: '头像已更新' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '上传失败' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-gray-400">请先登录</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">个人资料</h1>
              <p className="text-gray-400 mt-1">管理您的个人信息</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'secondary' : 'primary'}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>取消</>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  编辑资料
                </>
              )}
            </Button>
          </div>

          {/* 消息提示 */}
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          {/* 头像区域 */}
          <CyberCard className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <AvatarUpload
                currentAvatar={user.avatar}
                onUpload={handleAvatarUpdate}
                editable={isEditing}
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400 mt-1">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    加入于 {new Date(user.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CyberCard>

          {/* 基本信息 */}
          <CyberCard className="p-8">
            <h3 className="text-xl font-bold text-white mb-6">基本信息</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 用户名 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  用户名
                </label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="输入用户名"
                  />
                ) : (
                  <p className="text-white">{user.name}</p>
                )}
              </div>

              {/* 邮箱 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  邮箱地址
                </label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="输入邮箱"
                  />
                ) : (
                  <p className="text-white">{user.email}</p>
                )}
              </div>

              {/* 位置 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  位置
                </label>
                {isEditing ? (
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="城市, 国家"
                  />
                ) : (
                  <p className="text-white">{user.location || '未设置'}</p>
                )}
              </div>

              {/* 网站 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  个人网站
                </label>
                {isEditing ? (
                  <Input
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <p className="text-white">
                    {user.website ? (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyber-cyan hover:underline"
                      >
                        {user.website}
                      </a>
                    ) : (
                      '未设置'
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* 个人简介 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                个人简介
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent"
                  placeholder="介绍一下自己..."
                />
              ) : (
                <p className="text-white whitespace-pre-wrap">{user.bio || '未设置'}</p>
              )}
            </div>

            {/* 保存按钮 */}
            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                >
                  {isLoading ? (
                    <>保存中...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      保存更改
                    </>
                  )}
                </Button>
              </div>
            )}
          </CyberCard>

          {/* 账户统计 */}
          <CyberCard className="p-8">
            <h3 className="text-xl font-bold text-white mb-6">账户统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyber-cyan">{user.stats?.posts || 0}</p>
                <p className="text-gray-400 mt-1">文章</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyber-purple">{user.stats?.comments || 0}</p>
                <p className="text-gray-400 mt-1">评论</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyber-pink">{user.stats?.likes || 0}</p>
                <p className="text-gray-400 mt-1">点赞</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyber-green">{user.stats?.followers || 0}</p>
                <p className="text-gray-400 mt-1">关注者</p>
              </div>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
