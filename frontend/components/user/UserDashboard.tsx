/**
 * User Dashboard Component
 * 用户仪表板组件
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/services/user-enhanced';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Globe,
  FileText,
  Eye,
  TrendingUp,
  Settings,
  Bell,
  Shield,
  Download,
  Trash2,
  Camera,
} from 'lucide-react';

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const DASHBOARD_TABS: DashboardTab[] = [
  { id: 'overview', label: '概览', icon: <User className="w-4 h-4" /> },
  { id: 'profile', label: '个人资料', icon: <Settings className="w-4 h-4" /> },
  { id: 'security', label: '安全设置', icon: <Shield className="w-4 h-4" /> },
  { id: 'notifications', label: '通知设置', icon: <Bell className="w-4 h-4" /> },
];

export default function UserDashboard() {
  const { user, stats, loading, updateProfile, changePassword, uploadAvatar, formatDisplayName } =
    useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 个人资料表单状态
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    website_url: '',
  });

  // 密码修改表单状态
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        bio: user.bio || '',
        website_url: user.website_url || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateProfile(profileForm);
      toast.success('个人资料更新成功');
    } catch (error) {
      toast.error('更新失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('密码长度至少为8位');
      return;
    }

    setUpdating(true);

    try {
      await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      toast.success('密码修改成功');
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error('密码修改失败，请检查旧密码是否正确');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);

    try {
      await uploadAvatar(file);
      toast.success('头像上传成功');
    } catch (error) {
      toast.error('头像上传失败');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">用户中心</h1>
          <p className="text-gray-400">管理您的账户和个人设置</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">菜单</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {DASHBOARD_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 概览标签页 */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 用户信息卡片 */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">账户概览</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                          {formatDisplayName()?.charAt(0).toUpperCase()}
                        </div>
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-700 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{formatDisplayName()}</h3>
                        <p className="text-gray-400 mb-4">{user?.email}</p>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                            已激活
                          </span>
                          {user?.is_verified && (
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                              已验证
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 统计卡片 */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      icon={<FileText className="w-6 h-6" />}
                      label="文章总数"
                      value={stats.totalPosts}
                      color="cyan"
                    />
                    <StatCard
                      icon={<Eye className="w-6 h-6" />}
                      label="总浏览量"
                      value={stats.totalViews}
                      color="purple"
                    />
                    <StatCard
                      icon={<TrendingUp className="w-6 h-6" />}
                      label="本月文章"
                      value={stats.thisMonthPosts}
                      color="green"
                    />
                    <StatCard
                      icon={<Eye className="w-6 h-6" />}
                      label="本月浏览"
                      value={stats.thisMonthViews}
                      color="orange"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 个人资料标签页 */}
            {activeTab === 'profile' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">编辑个人资料</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <Label htmlFor="username" className="text-gray-300">
                        用户名
                      </Label>
                      <Input
                        id="username"
                        value={user?.username || ''}
                        disabled
                        className="bg-gray-700 border-gray-600 text-gray-400"
                      />
                      <p className="text-sm text-gray-500 mt-1">用户名不能修改</p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-300">
                        邮箱
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-700 border-gray-600 text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="full_name" className="text-gray-300">
                        姓名
                      </Label>
                      <Input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, full_name: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-gray-300">
                        简介
                      </Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website_url" className="text-gray-300">
                        网站地址
                      </Label>
                      <Input
                        id="website_url"
                        type="url"
                        value={profileForm.website_url}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, website_url: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={updating}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {updating ? '保存中...' : '保存更改'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* 安全设置标签页 */}
            {activeTab === 'security' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">修改密码</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <Label htmlFor="old_password" className="text-gray-300">
                        当前密码
                      </Label>
                      <Input
                        id="old_password"
                        type="password"
                        value={passwordForm.old_password}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, old_password: e.target.value })
                        }
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new_password" className="text-gray-300">
                        新密码
                      </Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, new_password: e.target.value })
                        }
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <p className="text-sm text-gray-500 mt-1">密码长度至少为8位</p>
                    </div>

                    <div>
                      <Label htmlFor="confirm_password" className="text-gray-300">
                        确认新密码
                      </Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                        }
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={updating}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {updating ? '修改中...' : '修改密码'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* 通知设置标签页 */}
            {activeTab === 'notifications' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">通知偏好</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <NotificationItem
                      title="邮件通知"
                      description="接收重要更新和通知邮件"
                      defaultChecked
                    />
                    <NotificationItem
                      title="评论通知"
                      description="当有人评论您的文章时收到通知"
                      defaultChecked
                    />
                    <NotificationItem
                      title="每周摘要"
                      description="每周接收活动摘要邮件"
                      defaultChecked
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'cyan' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} border-0`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm opacity-80 mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="text-white opacity-80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// 通知设置项组件
function NotificationItem({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
      <div>
        <h4 className="text-white font-medium mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-cyan-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
