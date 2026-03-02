'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CyberCard } from '@/components/ui/CyberCard';
import { Alert } from '@/components/ui/Alert';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Monitor,
  Save,
  Trash2,
  Download
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 账户设置表单
  const [accountForm, setAccountForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    commentNotifications: true,
    mentionNotifications: true,
  });

  // 隐私设置
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    allowMessages: true,
  });

  const handlePasswordChange = async () => {
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      setMessage({ type: 'error', text: '密码不匹配' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: accountForm.currentPassword,
          newPassword: accountForm.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '修改失败');
      }

      setMessage({ type: 'success', text: '密码已修改' });
      setAccountForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '修改失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('/api/user/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings),
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      setMessage({ type: 'success', text: '通知设置已保存' });
    } catch (err) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySave = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('/api/user/settings/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacySettings),
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      setMessage({ type: 'success', text: '隐私设置已保存' });
    } catch (err) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/export-data');
      const data = await response.json();

      // 创建下载链接
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyberpress-data-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '数据已导出' });
    } catch (err) {
      setMessage({ type: 'error', text: '导出失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (!confirm('确定要删除您的账户吗？此操作不可撤销！')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/account', { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 清除本地状态
      useAuthStore.getState().logout();
      window.location.href = '/';
    } catch (err) {
      setMessage({ type: 'error', text: '删除失败' });
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-gray-400">请先登录</p>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: '账户', icon: Settings },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'privacy', label: '隐私', icon: Lock },
    { id: 'appearance', label: '外观', icon: Eye },
    { id: 'data', label: '数据', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 页面标题 */}
          <div>
            <h1 className="text-3xl font-bold text-white">设置</h1>
            <p className="text-gray-400 mt-1">管理您的账户设置和偏好</p>
          </div>

          {/* 消息提示 */}
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          {/* 标签页导航 */}
          <div className="flex overflow-x-auto gap-2 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 内容区域 */}
          <CyberCard className="p-8">
            {/* 账户设置 */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white">修改密码</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      当前密码
                    </label>
                    <Input
                      type="password"
                      value={accountForm.currentPassword}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, currentPassword: e.target.value })
                      }
                      placeholder="输入当前密码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      新密码
                    </label>
                    <Input
                      type="password"
                      value={accountForm.newPassword}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, newPassword: e.target.value })
                      }
                      placeholder="输入新密码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      确认新密码
                    </label>
                    <Input
                      type="password"
                      value={accountForm.confirmPassword}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, confirmPassword: e.target.value })
                      }
                      placeholder="再次输入新密码"
                    />
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                  >
                    修改密码
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white">通知偏好</h3>
                <div className="space-y-4">
                  {Object.entries({
                    emailNotifications: '邮件通知',
                    pushNotifications: '推送通知',
                    weeklyDigest: '每周摘要',
                    commentNotifications: '评论通知',
                    mentionNotifications: '提及通知',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-white">{label}</span>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: !notificationSettings[key as keyof typeof notificationSettings],
                          })
                        }
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationSettings[key as keyof typeof notificationSettings]
                            ? 'bg-cyber-cyan'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            notificationSettings[key as keyof typeof notificationSettings]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleNotificationSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                >
                  保存设置
                </Button>
              </motion.div>
            )}

            {/* 隐私设置 */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white">隐私设置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      资料可见性
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) =>
                        setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="public">公开</option>
                      <option value="registered">仅注册用户</option>
                      <option value="private">私密</option>
                    </select>
                  </div>
                  {Object.entries({
                    showEmail: '显示邮箱地址',
                    showActivity: '显示活动状态',
                    allowMessages: '允许接收私信',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-white">{label}</span>
                      <button
                        onClick={() =>
                          setPrivacySettings({
                            ...privacySettings,
                            [key]: !privacySettings[key as keyof typeof privacySettings],
                          })
                        }
                        className={`w-12 h-6 rounded-full transition-colors ${
                          privacySettings[key as keyof typeof privacySettings]
                            ? 'bg-cyber-cyan'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            privacySettings[key as keyof typeof privacySettings]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handlePrivacySave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                >
                  保存设置
                </Button>
              </motion.div>
            )}

            {/* 外观设置 */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white">主题设置</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-cyber-cyan bg-cyber-cyan/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-white text-center">浅色</p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-cyber-cyan bg-cyber-cyan/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-white text-center">深色</p>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'system'
                        ? 'border-cyber-cyan bg-cyber-cyan/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-white text-center">系统</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 数据管理 */}
            {activeTab === 'data' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white">数据管理</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-white font-medium">导出数据</p>
                      <p className="text-gray-400 text-sm">下载您的所有个人数据</p>
                    </div>
                    <Button
                      onClick={handleDataExport}
                      disabled={isLoading}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      导出
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                    <div>
                      <p className="text-red-400 font-medium">删除账户</p>
                      <p className="text-gray-400 text-sm">永久删除您的账户和所有数据</p>
                    </div>
                    <Button
                      onClick={handleAccountDelete}
                      disabled={isLoading}
                      variant="danger"
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
