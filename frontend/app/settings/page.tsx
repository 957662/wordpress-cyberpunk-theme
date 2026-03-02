'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Mail,
  Save,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance' | 'privacy';

interface NotificationSettings {
  email: {
    newPost: boolean;
    newComment: boolean;
    newFollower: boolean;
    weeklyDigest: boolean;
  };
  push: {
    enabled: boolean;
    newPost: boolean;
    newComment: boolean;
    mentions: boolean;
  };
}

interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  allowMessages: 'everyone' | 'followers' | 'none';
  dataSharing: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saveMessage, setSaveMessage] = useState('');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      newPost: true,
      newComment: true,
      newFollower: true,
      weeklyDigest: false
    },
    push: {
      enabled: true,
      newPost: true,
      newComment: true,
      mentions: true
    }
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: 'everyone',
    dataSharing: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'dark' as 'light' | 'dark' | 'auto',
    accentColor: 'cyan' as 'cyan' | 'purple' | 'pink' | 'green',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    reducedMotion: false
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    activeSessions: 3
  });

  const tabs = [
    { id: 'profile' as SettingsTab, label: '个人资料', icon: User },
    { id: 'notifications' as SettingsTab, label: '通知设置', icon: Bell },
    { id: 'security' as SettingsTab, label: '安全设置', icon: Shield },
    { id: 'appearance' as SettingsTab, label: '外观设置', icon: Palette },
    { id: 'privacy' as SettingsTab, label: '隐私设置', icon: Lock }
  ];

  const handleSave = () => {
    setSaveMessage('设置已保存');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const updateNotification = (category: 'email' | 'push', key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 页头 */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Settings className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">系统设置</h1>
              <p className="text-gray-400 mt-1">管理您的账户设置和偏好</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧导航 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 sticky top-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
            >
              {/* 个人资料设置 */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">个人资料设置</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        显示名称
                      </label>
                      <input
                        type="text"
                        defaultValue="Cyber Ninja"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        用户名
                      </label>
                      <input
                        type="text"
                        defaultValue="cyber_ninja"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        电子邮件
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          defaultValue="user@cyberpress.dev"
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                        />
                        <button className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-lg transition-all flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          验证
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        个人简介
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="全栈开发者 | 赛博朋克爱好者 | 探索未来科技"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        所在地区
                      </label>
                      <input
                        type="text"
                        defaultValue="数字空间"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        个人网站
                      </label>
                      <input
                        type="url"
                        defaultValue="https://cyberpress.dev"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 通知设置 */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">通知设置</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        邮件通知
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(notifications.email).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
                          >
                            <span className="text-gray-300">
                              {key === 'newPost' && '新文章发布'}
                              {key === 'newComment' && '收到新评论'}
                              {key === 'newFollower' && '新增关注者'}
                              {key === 'weeklyDigest' && '每周摘要'}
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => updateNotification('email', key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        推送通知
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
                          <span className="text-gray-300">启用推送通知</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={notifications.push.enabled}
                              onChange={(e) =>
                                setNotifications(prev => ({
                                  ...prev,
                                  push: { ...prev.push, enabled: e.target.checked }
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                          </div>
                        </label>

                        {notifications.push.enabled && (
                          <div className="ml-4 space-y-3">
                            {Object.entries(notifications.push)
                              .filter(([key]) => key !== 'enabled')
                              .map(([key, value]) => (
                                <label
                                  key={key}
                                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all cursor-pointer"
                                >
                                  <span className="text-gray-300">
                                    {key === 'newPost' && '新文章发布'}
                                    {key === 'newComment' && '收到新评论'}
                                    {key === 'mentions' && '@ 提及'}
                                  </span>
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={value}
                                      onChange={(e) =>
                                        updateNotification('push', key, e.target.checked)
                                      }
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                                  </div>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 安全设置 */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">安全设置</h2>

                  <div className="space-y-6">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">两步验证</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        为您的账户添加额外的安全层
                      </p>
                      <button
                        className={`px-4 py-2 rounded-lg transition-all ${
                          security.twoFactorEnabled
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
                        }`}
                        onClick={() =>
                          setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
                        }
                      >
                        {security.twoFactorEnabled ? '已启用 ✓' : '启用两步验证'}
                      </button>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">登录提醒</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        当有新设备登录时发送通知
                      </p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={security.loginAlerts}
                            onChange={(e) =>
                              setSecurity(prev => ({ ...prev, loginAlerts: e.target.checked }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                        </div>
                        <span className="text-gray-300">启用登录提醒</span>
                      </label>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">活跃会话</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        当前有 {security.activeSessions} 个活跃设备
                      </p>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all">
                        注销所有设备
                      </button>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">修改密码</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            当前密码
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                            placeholder="输入当前密码"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            新密码
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                            placeholder="输入新密码"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            确认新密码
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                            placeholder="再次输入新密码"
                          />
                        </div>
                        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-all">
                          更新密码
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 外观设置 */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">外观设置</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">主题模式</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {(['light', 'dark', 'auto'] as const).map((theme) => (
                          <button
                            key={theme}
                            onClick={() => setAppearance(prev => ({ ...prev, theme }))}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              appearance.theme === theme
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="text-2xl mb-2">
                              {theme === 'light' && '☀️'}
                              {theme === 'dark' && '🌙'}
                              {theme === 'auto' && '🔄'}
                            </div>
                            <div className="text-sm font-medium text-gray-300">
                              {theme === 'light' && '浅色'}
                              {theme === 'dark' && '深色'}
                              {theme === 'auto' && '自动'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">强调色</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {(['cyan', 'purple', 'pink', 'green'] as const).map((color) => (
                          <button
                            key={color}
                            onClick={() => setAppearance(prev => ({ ...prev, accentColor: color }))}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              appearance.accentColor === color
                                ? `border-${color}-500 bg-${color}-500/10`
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 mx-auto rounded-full bg-${color}-500 mb-2`}
                            />
                            <div className="text-sm font-medium text-gray-300 capitalize">
                              {color}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">字体大小</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setAppearance(prev => ({ ...prev, fontSize: size }))}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              appearance.fontSize === size
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div
                              className={`mb-2 ${
                                size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'
                              } text-gray-300`}
                            >
                              Aa
                            </div>
                            <div className="text-sm font-medium text-gray-300">
                              {size === 'small' && '小'}
                              {size === 'medium' && '中'}
                              {size === 'large' && '大'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h3 className="text-lg font-semibold text-white">减少动画</h3>
                          <p className="text-sm text-gray-400 mt-1">减少页面动画效果</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={appearance.reducedMotion}
                            onChange={(e) =>
                              setAppearance(prev => ({ ...prev, reducedMotion: e.target.checked }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 隐私设置 */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">隐私设置</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">资料可见性</h3>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) =>
                          setPrivacy(prev => ({
                            ...prev,
                            profileVisibility: e.target.value as PrivacySettings['profileVisibility']
                          }))
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white transition-all"
                      >
                        <option value="public">公开 - 所有人可见</option>
                        <option value="followers">关注者 - 仅关注者可见</option>
                        <option value="private">私密 - 仅自己可见</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
                        <div>
                          <span className="text-gray-300">显示电子邮件</span>
                          <p className="text-sm text-gray-500 mt-1">在个人资料中显示您的邮箱</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={privacy.showEmail}
                            onChange={(e) =>
                              setPrivacy(prev => ({ ...prev, showEmail: e.target.checked }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
                        <div>
                          <span className="text-gray-300">显示所在地区</span>
                          <p className="text-sm text-gray-500 mt-1">在个人资料中显示您的位置</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={privacy.showLocation}
                            onChange={(e) =>
                              setPrivacy(prev => ({ ...prev, showLocation: e.target.checked }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                        </div>
                      </label>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">允许私信</h3>
                      <select
                        value={privacy.allowMessages}
                        onChange={(e) =>
                          setPrivacy(prev => ({
                            ...prev,
                            allowMessages: e.target.value as PrivacySettings['allowMessages']
                          }))
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white transition-all"
                      >
                        <option value="everyone">所有人</option>
                        <option value="followers">仅关注者</option>
                        <option value="none">不允许</option>
                      </select>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h3 className="text-lg font-semibold text-red-400">数据共享</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            允许匿名使用数据来改进服务
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={privacy.dataSharing}
                            onChange={(e) =>
                              setPrivacy(prev => ({ ...prev, dataSharing: e.target.checked }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 保存按钮 */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-800">
                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-green-400"
                  >
                    <Check className="w-5 h-5" />
                    <span>{saveMessage}</span>
                  </motion.div>
                )}
                <div className="ml-auto flex gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
                  >
                    重置
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    保存设置
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
