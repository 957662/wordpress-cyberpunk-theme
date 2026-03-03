/**
 * 通知设置组件
 * 配置邮件和推送通知偏好
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notificationService, NotificationSettings } from '@/services/notificationService';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  className?: string;
}

export function NotificationSettings({ className }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailFollow: true,
    emailLike: true,
    emailComment: true,
    emailMention: true,
    emailSystem: true,
    pushFollow: true,
    pushLike: true,
    pushComment: true,
    pushMention: true,
    pushSystem: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotificationSettings();
      setSettings(data);
    } catch (error) {
      toast.error('加载设置失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      setIsSaving(true);
      await notificationService.updateNotificationSettings(newSettings);
      toast.success('设置已保存');
    } catch (error) {
      toast.error('保存失败');
      // 恢复原设置
      setSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleItem = ({
    icon: Icon,
    label,
    description,
    value,
    onChange,
  }: {
    icon: typeof Bell;
    label: string;
    description: string;
    value: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-start justify-between rounded-lg border border-cyber-border/50 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-cyber-primary/10 p-2">
          <Icon className="h-5 w-5 text-cyber-primary" />
        </div>
        <div>
          <h4 className="font-semibold">{label}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        disabled={isSaving}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:ring-offset-2',
          value ? 'bg-cyber-primary' : 'bg-gray-600'
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200',
            value ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyber-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">通知设置</h2>
        <p className="mt-2 text-muted-foreground">
          选择您希望接收通知的方式
        </p>
      </div>

      {/* 邮件通知 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-cyber-primary" />
          <h3 className="text-lg font-semibold">邮件通知</h3>
        </div>
        <div className="space-y-3">
          <ToggleItem
            icon={Bell}
            label="关注通知"
            description="当有人关注您时发送邮件"
            value={settings.emailFollow}
            onChange={() => handleToggle('emailFollow')}
          />
          <ToggleItem
            icon={Bell}
            label="点赞通知"
            description="当有人点赞您的内容时发送邮件"
            value={settings.emailLike}
            onChange={() => handleToggle('emailLike')}
          />
          <ToggleItem
            icon={Bell}
            label="评论通知"
            description="当有人评论您的内容时发送邮件"
            value={settings.emailComment}
            onChange={() => handleToggle('emailComment')}
          />
          <ToggleItem
            icon={Bell}
            label="提及通知"
            description="当有人提及您时发送邮件"
            value={settings.emailMention}
            onChange={() => handleToggle('emailMention')}
          />
          <ToggleItem
            icon={Bell}
            label="系统通知"
            description="接收系统重要通知邮件"
            value={settings.emailSystem}
            onChange={() => handleToggle('emailSystem')}
          />
        </div>
      </div>

      {/* 推送通知 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-cyber-primary" />
          <h3 className="text-lg font-semibold">推送通知</h3>
        </div>
        <div className="space-y-3">
          <ToggleItem
            icon={Bell}
            label="关注通知"
            description="当有人关注您时推送通知"
            value={settings.pushFollow}
            onChange={() => handleToggle('pushFollow')}
          />
          <ToggleItem
            icon={Bell}
            label="点赞通知"
            description="当有人点赞您的内容时推送通知"
            value={settings.pushLike}
            onChange={() => handleToggle('pushLike')}
          />
          <ToggleItem
            icon={Bell}
            label="评论通知"
            description="当有人评论您的内容时推送通知"
            value={settings.pushComment}
            onChange={() => handleToggle('pushComment')}
          />
          <ToggleItem
            icon={Bell}
            label="提及通知"
            description="当有人提及您时推送通知"
            value={settings.pushMention}
            onChange={() => handleToggle('pushMention')}
          />
          <ToggleItem
            icon={Bell}
            label="系统通知"
            description="接收系统重要推送通知"
            value={settings.pushSystem}
            onChange={() => handleToggle('pushSystem')}
          />
        </div>
      </div>
    </div>
  );
}
