/**
 * 用户资料页面
 * 显示和编辑用户信息
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, MapPin, Link as LinkIcon, Edit } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth, usePermissions } from '@/lib/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GlitchText } from '@/components/effects/GlitchText';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const { canEdit, canUpload } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
  });

  // 密码修改表单
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: '资料更新成功！' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.error || '更新失败' });
    }

    setIsLoading(false);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await changePassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (result.success) {
      setMessage({ type: 'success', text: '密码修改成功！' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } else {
      setMessage({ type: 'error', text: result.error || '密码修改失败' });
    }

    setIsLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cyber-dark py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-display mb-2">
              <GlitchText text="用户资料" />
            </h1>
            <p className="text-gray-400">管理您的个人信息和账户设置</p>
          </div>

          {/* 消息提示 */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* 主要内容 */}
          <div className="grid gap-6">
            {/* 用户信息卡片 */}
            <Card className="p-6 border-cyber-cyan/20">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">基本信息</h2>
                {!isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
                )}
              </div>

              {/* 头像区域 */}
              <div className="flex items-center gap-6 mb-6">
                <Avatar
                  src={user.avatar}
                  alt={user.name || user.username}
                  size="xl"
                  className="ring-4 ring-cyber-cyan/30"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {user.name || user.username}
                  </h3>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
              </div>

              {/* 信息展示 */}
              {!isEditing ? (
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-cyber-cyan" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="w-5 h-5 text-cyber-purple" />
                    <div className="flex gap-2">
                      {user.roles?.map(role => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {user.id && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <User className="w-5 h-5 text-cyber-cyan" />
                      <span>ID: {user.id}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* 编辑表单 */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      显示名称
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="输入显示名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱地址
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="输入邮箱地址"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      个人简介
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="介绍一下自己"
                      rows={3}
                      className="w-full px-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      所在地
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="城市，国家"
                      icon={<MapPin className="w-5 h-5" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      个人网站
                    </label>
                    <Input
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      icon={<LinkIcon className="w-5 h-5" />}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      variant="primary"
                    >
                      {isLoading ? '保存中...' : '保存更改'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          bio: '',
                          location: '',
                          website: '',
                        });
                      }}
                      variant="outline"
                      disabled={isLoading}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* 密码修改卡片 */}
            <Card className="p-6 border-cyber-cyan/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">安全设置</h2>
                {!showPasswordForm && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    修改密码
                  </Button>
                )}
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      当前密码
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="输入当前密码"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      新密码
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="输入新密码（至少8个字符）"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      确认新密码
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="再次输入新密码"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      variant="primary"
                    >
                      {isLoading ? '修改中...' : '确认修改'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      variant="outline"
                      disabled={isLoading}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* 权限信息卡片 */}
            {(canEdit() || canUpload()) && (
              <Card className="p-6 border-cyber-purple/20">
                <h2 className="text-xl font-semibold text-white mb-4">权限信息</h2>
                <div className="grid grid-cols-2 gap-4">
                  {canEdit() && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-4 h-4" />
                      <span>内容编辑</span>
                    </div>
                  )}
                  {canUpload() && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-4 h-4" />
                      <span>文件上传</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
