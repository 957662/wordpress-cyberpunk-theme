'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Check, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationPreference = {
  email: boolean;
  push: boolean;
  in_app: boolean;
};

export type NotificationSettings = {
  follow: NotificationPreference;
  like: NotificationPreference;
  comment: NotificationPreference;
  mention: NotificationPreference;
  system: NotificationPreference;
};

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({
  className
}) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    follow: { email: true, push: true, in_app: true },
    like: { email: false, push: true, in_app: true },
    comment: { email: true, push: true, in_app: true },
    mention: { email: true, push: true, in_app: true },
    system: { email: true, push: true, in_app: true },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/notifications/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (
    category: keyof NotificationSettings,
    type: keyof NotificationPreference
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveMessage({ type: 'success', text: '设置已保存' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: '保存失败，请重试' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const categories: Array<{
    key: keyof NotificationSettings;
    label: string;
    icon: string;
    description: string;
  }> = [
    {
      key: 'follow',
      label: '新粉丝',
      icon: '👤',
      description: '当有人关注你时',
    },
    {
      key: 'like',
      label: '收到点赞',
      icon: '❤️',
      description: '当有人点赞你的内容时',
    },
    {
      key: 'comment',
      label: '新评论',
      icon: '💬',
      description: '当有人评论你的内容时',
    },
    {
      key: 'mention',
      label: '@ 提及',
      icon: '@',
      description: '当有人在内容中提及你时',
    },
    {
      key: 'system',
      label: '系统通知',
      icon: '🔔',
      description: '重要的系统更新和公告',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-purple" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="border-b border-cyber-purple/30 pb-6">
        <h2 className="text-2xl font-bold text-cyber-cyan flex items-center gap-2">
          <Bell size={24} />
          通知设置
        </h2>
        <p className="mt-2 text-sm text-cyber-muted">
          选择你希望接收通知的方式
        </p>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        {categories.map((category) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-cyber-purple/20 bg-cyber-muted/5 p-6"
          >
            <div className="flex items-start gap-4">
              {/* Icon & Info */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyber-purple/20 to-cyber-pink/20 text-2xl">
                {category.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-cyber-muted/70">
                  {category.description}
                </p>

                {/* Toggles */}
                <div className="mt-4 flex flex-wrap gap-4">
                  <Toggle
                    label="邮件通知"
                    icon={<Mail size={16} />}
                    checked={settings[category.key].email}
                    onChange={() => handleToggle(category.key, 'email')}
                  />
                  <Toggle
                    label="推送通知"
                    icon={<Bell size={16} />}
                    checked={settings[category.key].push}
                    onChange={() => handleToggle(category.key, 'push')}
                  />
                  <Toggle
                    label="应用内通知"
                    icon={<Check size={16} />}
                    checked={settings[category.key].in_app}
                    onChange={() => handleToggle(category.key, 'in_app')}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between border-t border-cyber-purple/20 pt-6">
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                'flex items-center gap-2 text-sm',
                saveMessage.type === 'success'
                  ? 'text-cyber-green'
                  : 'text-cyber-pink'
              )}
            >
              {saveMessage.type === 'success' ? (
                <Check size={16} />
              ) : (
                <Bell size={16} />
              )}
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-pink px-6 py-2 font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(157,0,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save size={18} />
              保存设置
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

interface ToggleProps {
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, icon, checked, onChange }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onChange}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-2 transition-all',
        checked
          ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
          : 'border-cyber-purple/30 bg-cyber-muted/5 text-cyber-muted'
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
      <div
        className={cn(
          'ml-2 h-5 w-9 rounded-full p-1 transition-colors',
          checked ? 'bg-cyber-cyan' : 'bg-cyber-muted/50'
        )}
      >
        <motion.div
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="h-3 w-3 rounded-full bg-white"
        />
      </div>
    </motion.button>
  );
};

export default NotificationSettingsComponent;
