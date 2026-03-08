'use client';

/**
 * User Settings Page
 * 用户设置页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Save,
  Camera,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberInput } from '@/components/ui/CyberInput';
import { toast } from 'react-hot-toast';
import { CyberTabs } from '@/components/ui/CyberTabs';

type TabValue = 'profile' | 'account' | 'notifications' | 'appearance' | 'security';

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('profile');
  const [loading, setLoading] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: 'CyberPress User',
    username: 'cyberuser',
    bio: '热爱技术，热爱生活',
    location: '中国 · 北京',
    website: 'https://cyberpress.com',
    avatar: null,
  });

  // Account Settings
  const [account, setAccount] = useState({
    email: 'user@cyberpress.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email: {
      newPost: true,
      comment: true,
      reply: true,
      mention: true,
      newsletter: false,
    },
    push: {
      newPost: true,
      comment: true,
      reply: true,
      mention: true,
    },
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    fontSize: 'medium',
    language: 'zh-CN',
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    activeSessions: [
      { id: 1, device: 'Chrome on Windows', ip: '192.168.1.1', lastActive: '当前', current: true },
      { id: 2, device: 'Safari on iPhone', ip: '192.168.1.2', lastActive: '2小时前', current: false },
    ],
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('个人资料已更新！');
    } catch (error) {
      toast.error('更新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = async () => {
    if (account.newPassword !== account.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('账号设置已更新！');
      setAccount({ ...account, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('更新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('通知设置已更新！');
    } catch (error) {
      toast.error('更新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('外观设置已更新！');
    } catch (error) {
      toast.error('更新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { value: 'profile', label: '个人资料', icon: User },
    { value: 'account', label: '账号', icon: Mail },
    { value: 'notifications', label: '通知', icon: Bell },
    { value: 'appearance', label: '外观', icon: Palette },
    { value: 'security', label: '安全', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border bg-cyber-dark/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">设置</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <CyberTabs
            tabs={tabs}
            value={activeTab}
            onChange={(value) => setActiveTab(value as TabValue)}
          />
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-6"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">个人资料</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-cyber-cyan rounded-full flex items-center justify-center hover:bg-cyber-cyan/80 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                  <p className="text-sm text-gray-400">@{profile.username}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    显示名称
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    所在地区
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    个人网站
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  个人简介
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end">
                <CyberButton
                  variant="primary"
                  size="lg"
                  onClick={handleSaveProfile}
                  loading={loading}
                  icon={<Save className="w-5 h-5" />}
                >
                  保存更改
                </CyberButton>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">账号设置</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                />
              </div>

              <div className="border-t border-cyber-border pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">修改密码</h3>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      当前密码
                    </label>
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      value={account.currentPassword}
                      onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      className="absolute right-3 top-10 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      新密码
                    </label>
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      value={account.newPassword}
                      onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      className="absolute right-3 top-10 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      确认新密码
                    </label>
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={account.confirmPassword}
                      onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      className="absolute right-3 top-10 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <CyberButton
                  variant="primary"
                  size="lg"
                  onClick={handleSaveAccount}
                  loading={loading}
                  icon={<Save className="w-5 h-5" />}
                >
                  保存更改
                </CyberButton>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">通知设置</h2>

              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyber-cyan" />
                  邮件通知
                </h3>
                <div className="space-y-3">
                  {Object.entries(notifications.email).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg cursor-pointer hover:bg-cyber-dark/70 transition-colors"
                    >
                      <span className="text-gray-300">
                        {key === 'newPost' && '新文章发布'}
                        {key === 'comment' && '新评论'}
                        {key === 'reply' && '评论回复'}
                        {key === 'mention' && '提及我'}
                        {key === 'newsletter' && '订阅通讯'}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            email: { ...notifications.email, [key]: e.target.checked },
                          })
                        }
                        className="w-5 h-5 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan focus:ring-offset-0"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div className="border-t border-cyber-border pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyber-purple" />
                  推送通知
                </h3>
                <div className="space-y-3">
                  {Object.entries(notifications.push).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg cursor-pointer hover:bg-cyber-dark/70 transition-colors"
                    >
                      <span className="text-gray-300">
                        {key === 'newPost' && '新文章发布'}
                        {key === 'comment' && '新评论'}
                        {key === 'reply' && '评论回复'}
                        {key === 'mention' && '提及我'}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            push: { ...notifications.push, [key]: e.target.checked },
                          })
                        }
                        className="w-5 h-5 rounded border-cyber-border text-cyber-purple focus:ring-cyber-purple focus:ring-offset-0"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <CyberButton
                  variant="primary"
                  size="lg"
                  onClick={handleSaveNotifications}
                  loading={loading}
                  icon={<Save className="w-5 h-5" />}
                >
                  保存更改
                </CyberButton>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">外观设置</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  主题
                </label>
                <select
                  value={appearance.theme}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                >
                  <option value="dark">深色</option>
                  <option value="light">浅色</option>
                  <option value="auto">跟随系统</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  字体大小
                </label>
                <select
                  value={appearance.fontSize}
                  onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  语言
                </label>
                <select
                  value={appearance.language}
                  onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div className="flex justify-end">
                <CyberButton
                  variant="primary"
                  size="lg"
                  onClick={handleSaveAppearance}
                  loading={loading}
                  icon={<Save className="w-5 h-5" />}
                >
                  保存更改
                </CyberButton>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">安全设置</h2>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">双因素认证</h3>
                <label className="flex items-center justify-between p-4 bg-cyber-dark/50 rounded-lg cursor-pointer hover:bg-cyber-dark/70 transition-colors">
                  <div>
                    <p className="text-gray-300 font-medium">启用双因素认证</p>
                    <p className="text-sm text-gray-500">增加账户安全性</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.twoFactor}
                    onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                    className="w-5 h-5 rounded border-cyber-border text-cyber-green focus:ring-cyber-green focus:ring-offset-0"
                  />
                </label>
              </div>

              <div className="border-t border-cyber-border pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">活跃会话</h3>
                <div className="space-y-3">
                  {security.activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border ${
                        session.current
                          ? 'bg-cyber-cyan/10 border-cyber-cyan/30'
                          : 'bg-cyber-dark/50 border-cyber-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {session.device}
                            {session.current && (
                              <span className="px-2 py-0.5 text-xs bg-cyber-cyan/20 text-cyber-cyan rounded">
                                当前
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            IP: {session.ip} · {session.lastActive}
                          </p>
                        </div>
                        {!session.current && (
                          <button className="text-red-400 hover:text-red-300 text-sm">
                            撤销
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-cyber-border pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">其他设置</h3>
                <label className="flex items-center justify-between p-4 bg-cyber-dark/50 rounded-lg cursor-pointer hover:bg-cyber-dark/70 transition-colors">
                  <div>
                    <p className="text-gray-300 font-medium">登录提醒</p>
                    <p className="text-sm text-gray-500">新设备登录时发送通知</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.loginAlerts}
                    onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                    className="w-5 h-5 rounded border-cyber-border text-cyber-yellow focus:ring-cyber-yellow focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
