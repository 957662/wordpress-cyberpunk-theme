'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Globe, Camera, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UserProfile {
  username: string;
  display_name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  avatar_url: string;
  cover_url: string;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    display_name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
    cover_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/users/me');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setAvatarPreview(data.avatar_url);
      setCoverPreview(data.cover_url);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', '加载个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/v1/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      showMessage('success', '个人资料已更新');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', '更新个人资料失败');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // 这里应该上传到服务器
        setProfile(prev => ({ ...prev, avatar_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        setProfile(prev => ({ ...prev, cover_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 头部 */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">编辑个人资料</h1>
              <p className="text-gray-400 mt-1">更新您的个人信息</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                'px-6 py-2 rounded-lg transition-all flex items-center gap-2',
                'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan',
                'hover:bg-cyber-cyan/30',
                saving && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Save className="w-4 h-4" />
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* 消息提示 */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mb-6 p-4 rounded-lg',
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            )}
          >
            {message.text}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* 封面图片 */}
          <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">添加封面图片</span>
              </div>
            )}
            <label className={cn(
              'absolute bottom-4 right-4 px-4 py-2 rounded-lg',
              'bg-black/80 backdrop-blur-sm border border-gray-700',
              'text-white text-sm cursor-pointer hover:bg-black/90 transition-all'
            )}>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <Camera className="w-4 h-4 inline mr-2" />
              更换封面
            </label>
          </div>

          {/* 头像和个人信息 */}
          <div className="flex gap-6">
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-black bg-gray-800">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <label className={cn(
                  'absolute bottom-0 right-0 w-10 h-10 rounded-full',
                  'bg-cyber-cyan border-4 border-black',
                  'flex items-center justify-center cursor-pointer',
                  'hover:bg-cyber-cyan/80 transition-all'
                )}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Camera className="w-5 h-5 text-black" />
                </label>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  显示名称
                </label>
                <input
                  type="text"
                  value={profile.display_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="输入显示名称"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg',
                    'bg-black/60 border border-gray-700',
                    'text-white placeholder-gray-500',
                    'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
                    'transition-all'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="输入用户名"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg',
                    'bg-black/60 border border-gray-700',
                    'text-white placeholder-gray-500',
                    'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
                    'transition-all'
                  )}
                />
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                电子邮件
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-black/60 border border-gray-700',
                  'text-white placeholder-gray-500',
                  'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
                  'transition-all'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                所在地区
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="城市, 国家"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-black/60 border border-gray-700',
                  'text-white placeholder-gray-500',
                  'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
                  'transition-all'
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                个人网站
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-black/60 border border-gray-700',
                  'text-white placeholder-gray-500',
                  'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
                  'transition-all'
                )}
              />
            </div>
          </div>

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              个人简介
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="介绍一下自己..."
              rows={4}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'bg-black/60 border border-gray-700',
                'text-white placeholder-gray-500',
                'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
                'transition-all resize-none'
              )}
            />
            <p className="mt-2 text-xs text-gray-500">
              {profile.bio.length} / 500 字符
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
