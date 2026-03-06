'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageCircle, Heart, UserPlus, At, Settings, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  comment_notifications: boolean;
  follow_notifications: boolean;
  like_notifications: boolean;
  mention_notifications: boolean;
  system_notifications: boolean;
  digest_frequency: 'daily' | 'weekly' | 'monthly';
}

export const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: false,
    comment_notifications: true,
    follow_notifications: true,
    like_notifications: true,
    mention_notifications: true,
    system_notifications: true,
    digest_frequency: 'daily',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/notification-settings/');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', '加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/v1/notification-settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      showMessage('success', '设置已保存');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', '保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    {
      key: 'email_notifications' as const,
      label: '邮件通知',
      description: '接收重要更新的邮件通知',
      icon: Mail,
      color: 'text-blue-400',
    },
    {
      key: 'push_notifications' as const,
      label: '推送通知',
      description: '在浏览器中接收实时推送',
      icon: Bell,
      color: 'text-cyber-cyan',
    },
    {
      key: 'comment_notifications' as const,
      label: '评论通知',
      description: '当有人评论你的文章时通知',
      icon: MessageCircle,
      color: 'text-green-400',
    },
    {
      key: 'follow_notifications' as const,
      label: '关注通知',
      description: '当有人关注你时通知',
      icon: UserPlus,
      color: 'text-purple-400',
    },
    {
      key: 'like_notifications' as const,
      label: '点赞通知',
      description: '当有人点赞你的内容时通知',
      icon: Heart,
      color: 'text-pink-400',
    },
    {
      key: 'mention_notifications' as const,
      label: '提及通知',
      description: '当有人@你时通知',
      icon: At,
      color: 'text-yellow-400',
    },
    {
      key: 'system_notifications' as const,
      label: '系统通知',
      description: '接收系统重要更新和公告',
      icon: Settings,
      color: 'text-gray-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">通知设置</h2>
        <p className="text-gray-400">管理你的通知偏好</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-4 rounded-lg',
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          )}
        >
          {message.text}
        </motion.div>
      )}

      {/* 通知选项 */}
      <div className="space-y-3">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.key}
              whileHover={{ scale: 1.01 }}
              className={cn(
                'p-4 rounded-lg border transition-all',
                'bg-black/40 backdrop-blur-sm',
                'hover:border-cyber-cyan/50'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center', option.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{option.label}</h3>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </div>

                {/* 开关 */}
                <button
                  onClick={() => handleToggle(option.key)}
                  className={cn(
                    'relative w-14 h-7 rounded-full transition-colors',
                    settings[option.key]
                      ? 'bg-cyber-cyan'
                      : 'bg-gray-700'
                  )}
                >
                  <motion.div
                    animate={{ x: settings[option.key] ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 摘要频率 */}
      <div className={cn(
        'p-4 rounded-lg border transition-all',
        'bg-black/40 backdrop-blur-sm',
        'hover:border-cyber-cyan/50'
      )}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-cyber-yellow">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold">摘要邮件频率</h3>
            <p className="text-sm text-gray-400">选择接收摘要邮件的频率</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(['daily', 'weekly', 'monthly'] as const).map((frequency) => (
            <button
              key={frequency}
              onClick={() => setSettings(prev => ({ ...prev, digest_frequency: frequency }))}
              className={cn(
                'px-4 py-3 rounded-lg border transition-all capitalize',
                settings.digest_frequency === frequency
                  ? 'border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              )}
            >
              {frequency === 'daily' && '每日'}
              {frequency === 'weekly' && '每周'}
              {frequency === 'monthly' && '每月'}
            </button>
          ))}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => fetchSettings()}
          className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 transition-all"
        >
          重置
        </button>
        <button
          onClick={saveSettings}
          disabled={saving}
          className={cn(
            'px-6 py-2 rounded-lg border transition-all flex items-center gap-2',
            'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan',
            'hover:bg-cyber-cyan/30',
            saving && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Save className="w-4 h-4" />
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>

      {/* 测试通知 */}
      <div className="pt-6 border-t border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">测试通知</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['email', 'push', 'system'].map((type) => (
            <button
              key={type}
              onClick={async () => {
                try {
                  const response = await fetch('/api/v1/notification-settings/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notification_type: type }),
                  });
                  if (response.ok) {
                    showMessage('success', `测试${type}通知已发送`);
                  }
                } catch (error) {
                  showMessage('error', '发送测试通知失败');
                }
              }}
              className={cn(
                'px-4 py-3 rounded-lg border transition-all',
                'border-gray-700 text-gray-400',
                'hover:border-cyber-purple hover:text-cyber-purple'
              )}
            >
              测试 {type} 通知
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
