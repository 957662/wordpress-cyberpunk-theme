/**
 * 用户设置页面
 * 账户偏好设置
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, Palette, Globe, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GlitchText } from '@/components/effects/GlitchText';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    commentNotifications: true,
    weeklyDigest: false,
    productUpdates: true,
  });

  // 隐私设置
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    allowMessages: true,
    showOnlineStatus: false,
  });

  // 显示设置
  const [displaySettings, setDisplaySettings] = useState({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
  });

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyToggle = (key: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessage({ type: 'success', text: '设置已保存！' });
    setIsLoading(false);
  };

  const themes = [
    { id: 'cyber', name: '赛博朋克', color: 'bg-cyber-cyan' },
    { id: 'neon', name: '霓虹夜色', color: 'bg-cyber-purple' },
    { id: 'matrix', name: '矩阵绿', color: 'bg-green-500' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cyber-dark py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-display mb-2">
              <GlitchText text="账户设置" />
            </h1>
            <p className="text-gray-400">自定义您的账户偏好和体验</p>
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

          <div className="grid gap-6">
            {/* 外观设置 */}
            <Card className="p-6 border-cyber-cyan/20">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-cyber-cyan" />
                <h2 className="text-xl font-semibold text-white">外观设置</h2>
              </div>

              <div className="space-y-6">
                {/* 主题选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    主题风格
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          theme === t.id
                            ? 'border-cyber-cyan bg-cyber-cyan/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-full h-16 rounded ${t.color} mb-3 opacity-80`} />
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        {theme === t.id && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="success" size="sm">当前</Badge>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 通知设置 */}
            <Card className="p-6 border-cyber-purple/20">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-cyber-purple" />
                <h2 className="text-xl font-semibold text-white">通知设置</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">邮件通知</p>
                    <p className="text-sm text-gray-400">接收重要更新的邮件通知</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">评论通知</p>
                    <p className="text-sm text-gray-400">当有人评论您的内容时通知</p>
                  </div>
                  <Switch
                    checked={notificationSettings.commentNotifications}
                    onCheckedChange={() => handleNotificationToggle('commentNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">每周摘要</p>
                    <p className="text-sm text-gray-400">每周发送活动摘要邮件</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">产品更新</p>
                    <p className="text-sm text-gray-400">接收新功能和产品更新通知</p>
                  </div>
                  <Switch
                    checked={notificationSettings.productUpdates}
                    onCheckedChange={() => handleNotificationToggle('productUpdates')}
                  />
                </div>
              </div>
            </Card>

            {/* 隐私设置 */}
            <Card className="p-6 border-cyber-pink/20">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-cyber-pink" />
                <h2 className="text-xl font-semibold text-white">隐私设置</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">公开资料</p>
                    <p className="text-sm text-gray-400">让其他人可以查看您的资料</p>
                  </div>
                  <Switch
                    checked={privacySettings.profileVisible}
                    onCheckedChange={() => handlePrivacyToggle('profileVisible')}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">显示邮箱</p>
                    <p className="text-sm text-gray-400">在资料中公开显示邮箱地址</p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={() => handlePrivacyToggle('showEmail')}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">允许私信</p>
                    <p className="text-sm text-gray-400">允许其他用户向您发送私信</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowMessages}
                    onCheckedChange={() => handlePrivacyToggle('allowMessages')}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">在线状态</p>
                    <p className="text-sm text-gray-400">显示您的在线状态</p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={() => handlePrivacyToggle('showOnlineStatus')}
                  />
                </div>
              </div>
            </Card>

            {/* 显示设置 */}
            <Card className="p-6 border-cyber-cyan/20">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-cyber-cyan" />
                <h2 className="text-xl font-semibold text-white">显示设置</h2>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    语言
                  </label>
                  <select
                    value={displaySettings.language}
                    onChange={(e) => setDisplaySettings({ ...displaySettings, language: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan text-white"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                    <option value="ja-JP">日本語</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    时区
                  </label>
                  <select
                    value={displaySettings.timezone}
                    onChange={(e) => setDisplaySettings({ ...displaySettings, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan text-white"
                  >
                    <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
                    <option value="Asia/Tokyo">日本标准时间 (UTC+9)</option>
                    <option value="America/New_York">美东时间 (UTC-5)</option>
                    <option value="America/Los_Angeles">美西时间 (UTC-8)</option>
                    <option value="Europe/London">格林威治时间 (UTC+0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    日期格式
                  </label>
                  <select
                    value={displaySettings.dateFormat}
                    onChange={(e) => setDisplaySettings({ ...displaySettings, dateFormat: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan text-white"
                  >
                    <option value="YYYY-MM-DD">2024-03-02</option>
                    <option value="MM/DD/YYYY">03/02/2024</option>
                    <option value="DD/MM/YYYY">02/03/2024</option>
                    <option value="YYYY年MM月DD日">2024年03月02日</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* 保存按钮 */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="lg">
                取消
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                variant="primary"
                size="lg"
              >
                {isLoading ? '保存中...' : '保存设置'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
