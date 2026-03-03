'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Check, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSettings {
  email: {
    enabled: boolean;
    onNewFollower: boolean;
    onLike: boolean;
    onComment: boolean;
    onMention: boolean;
    onBookmark: boolean;
    digest: 'none' | 'daily' | 'weekly';
  };
  push: {
    enabled: boolean;
    onNewFollower: boolean;
    onLike: boolean;
    onComment: boolean;
    onMention: boolean;
    onBookmark: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      onNewFollower: true,
      onLike: false,
      onComment: true,
      onMention: true,
      onBookmark: false,
      digest: 'daily',
    },
    push: {
      enabled: true,
      onNewFollower: true,
      onLike: true,
      onComment: true,
      onMention: true,
      onBookmark: false,
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: keyof NotificationSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">通知设置</h1>
          <p className="text-gray-400">管理您希望接收通知的方式</p>
        </div>

        <motion.button
          onClick={saveSettings}
          disabled={isSaving}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
            'bg-gradient-to-r from-cyan-500 to-purple-500 text-white',
            'shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              保存中...
            </>
          ) : saveSuccess ? (
            <>
              <Check size={18} />
              已保存
            </>
          ) : (
            <>
              <Save size={18} />
              保存设置
            </>
          )}
        </motion.button>
      </div>

      {/* 邮件通知 */}
      <SettingSection
        icon={<Mail className="text-blue-500" size={24} />}
        title="邮件通知"
        description="接收关于您账户活动的邮件更新"
      >
        <ToggleItem
          label="启用邮件通知"
          checked={settings.email.enabled}
          onChange={(checked) => updateSetting('email', 'enabled', checked)}
        />
        {settings.email.enabled && (
          <div className="space-y-4 mt-4 pl-4 border-l-2 border-gray-700">
            <ToggleItem
              label="新粉丝通知"
              checked={settings.email.onNewFollower}
              onChange={(checked) => updateSetting('email', 'onNewFollower', checked)}
            />
            <ToggleItem
              label="点赞通知"
              checked={settings.email.onLike}
              onChange={(checked) => updateSetting('email', 'onLike', checked)}
            />
            <ToggleItem
              label="评论通知"
              checked={settings.email.onComment}
              onChange={(checked) => updateSetting('email', 'onComment', checked)}
            />
            <ToggleItem
              label="提及通知"
              checked={settings.email.onMention}
              onChange={(checked) => updateSetting('email', 'onMention', checked)}
            />
            <ToggleItem
              label="收藏通知"
              checked={settings.email.onBookmark}
              onChange={(checked) => updateSetting('email', 'onBookmark', checked)}
            />

            {/* 摘要设置 */}
            <div className="pt-4">
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                邮件摘要
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'daily', 'weekly'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting('email', 'digest', option)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      settings.email.digest === option
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    )}
                  >
                    {option === 'none' ? '不发送' : option === 'daily' ? '每日摘要' : '每周摘要'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </SettingSection>

      {/* 推送通知 */}
      <SettingSection
        icon={<Bell className="text-purple-500" size={24} />}
        title="推送通知"
        description="在浏览器中接收实时通知"
      >
        <ToggleItem
          label="启用推送通知"
          checked={settings.push.enabled}
          onChange={(checked) => updateSetting('push', 'enabled', checked)}
        />
        {settings.push.enabled && (
          <div className="space-y-4 mt-4 pl-4 border-l-2 border-gray-700">
            <ToggleItem
              label="新粉丝通知"
              checked={settings.push.onNewFollower}
              onChange={(checked) => updateSetting('push', 'onNewFollower', checked)}
            />
            <ToggleItem
              label="点赞通知"
              checked={settings.push.onLike}
              onChange={(checked) => updateSetting('push', 'onLike', checked)}
            />
            <ToggleItem
              label="评论通知"
              checked={settings.push.onComment}
              onChange={(checked) => updateSetting('push', 'onComment', checked)}
            />
            <ToggleItem
              label="提及通知"
              checked={settings.push.onMention}
              onChange={(checked) => updateSetting('push', 'onMention', checked)}
            />
            <ToggleItem
              label="收藏通知"
              checked={settings.push.onBookmark}
              onChange={(checked) => updateSetting('push', 'onBookmark', checked)}
            />
          </div>
        )}
      </SettingSection>

      {/* 应用内通知 */}
      <SettingSection
        icon={<Bell className="text-cyan-500" size={24} />}
        title="应用内通知"
        description="控制应用内通知的行为"
      >
        <div className="space-y-4">
          <ToggleItem
            label="启用应用内通知"
            checked={settings.inApp.enabled}
            onChange={(checked) => updateSetting('inApp', 'enabled', checked)}
          />
          {settings.inApp.enabled && (
            <>
              <ToggleItem
                label="通知声音"
                checked={settings.inApp.sound}
                onChange={(checked) => updateSetting('inApp', 'sound', checked)}
              />
              <ToggleItem
                label="桌面通知"
                checked={settings.inApp.desktop}
                onChange={(checked) => updateSetting('inApp', 'desktop', checked)}
              />
            </>
          )}
        </div>
      </SettingSection>
    </div>
  );
}

// 设置区块组件
function SettingSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gray-800 border border-gray-700">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// 开关项组件
function ToggleItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <motion.button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-700'
        )}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ left: checked ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}
