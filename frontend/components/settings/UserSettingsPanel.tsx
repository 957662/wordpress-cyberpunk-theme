'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Keyboard,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// 设置类型定义
interface UserSettings {
  // 个人资料
  profile: {
    username: string;
    email: string;
    bio: string;
    avatar: string;
    website: string;
    location: string;
  };

  // 通知设置
  notifications: {
    email: boolean;
    push: boolean;
    mentions: boolean;
    comments: boolean;
    likes: boolean;
    follows: boolean;
    weekly: boolean;
    marketing: boolean;
  };

  // 隐私设置
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    searchable: boolean;
  };

  // 外观设置
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    language: string;
    timezone: string;
    dateFormat: string;
    reducedMotion: boolean;
  };

  // 账户安全
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    activeSessions: number;
    lastPasswordChange: string;
  };
}

// 默认设置
const defaultSettings: UserSettings = {
  profile: {
    username: '',
    email: '',
    bio: '',
    avatar: '',
    website: '',
    location: '',
  },
  notifications: {
    email: true,
    push: true,
    mentions: true,
    comments: true,
    likes: false,
    follows: true,
    weekly: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showLocation: false,
    allowMessages: true,
    searchable: true,
  },
  appearance: {
    theme: 'dark',
    fontSize: 'medium',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    reducedMotion: false,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    activeSessions: 1,
    lastPasswordChange: '',
  },
};

// 设置面板组件
interface SettingSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="p-6 rounded-lg border border-white/10 bg-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

// 开关组件
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}> = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        {label && <p className="text-sm font-medium text-gray-200">{label}</p>}
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-cyan-500' : 'bg-gray-700'
        )}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ left: checked ? '26px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
};

// 输入框组件
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  error?: string;
}> = ({ label, value, onChange, type = 'text', placeholder, icon: Icon, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          type={showPassword ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-2.5 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all',
            Icon ? 'pl-10' : '',
            error ? 'border-red-500/50' : 'border-white/10',
            type === 'password' && 'pr-10'
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

// 主组件
interface UserSettingsPanelProps {
  initialSettings?: Partial<UserSettings>;
  onSave?: (settings: UserSettings) => Promise<void>;
  className?: string;
}

export const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({
  initialSettings,
  onSave,
  className,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    ...defaultSettings,
    ...initialSettings,
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  // 检测变更
  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(defaultSettings));
  }, [settings]);

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      await onSave?.(settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // 重置设置
  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  // 更新设置
  const updateSettings = <K extends keyof UserSettings>(
    section: K,
    updates: Partial<UserSettings[K]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  };

  // 标签页配置
  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'privacy', label: '隐私', icon: Shield },
    { id: 'appearance', label: '外观', icon: Palette },
    { id: 'security', label: '安全', icon: Shield },
  ] as const;

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">设置</h1>
        <p className="text-gray-400">管理您的账户设置和偏好</p>
      </div>

      {/* 标签页导航 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 设置内容 */}
      <div className="space-y-6">
        {/* 个人资料 */}
        {activeTab === 'profile' && (
          <SettingSection
            icon={User}
            title="个人资料"
            description="更新您的个人信息"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                  {settings.profile.username.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium">
                    更换头像
                  </button>
                  <p className="text-xs text-gray-400 mt-1">推荐尺寸：200x200px</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="用户名"
                  value={settings.profile.username}
                  onChange={(value) => updateSettings('profile', { username: value })}
                  placeholder="输入用户名"
                  icon={User}
                />
                <InputField
                  label="邮箱"
                  value={settings.profile.email}
                  onChange={(value) => updateSettings('profile', { email: value })}
                  type="email"
                  placeholder="your@email.com"
                  icon={User}
                />
              </div>

              <InputField
                label="个人简介"
                value={settings.profile.bio}
                onChange={(value) => updateSettings('profile', { bio: value })}
                placeholder="介绍一下自己..."
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="网站"
                  value={settings.profile.website}
                  onChange={(value) => updateSettings('profile', { website: value })}
                  placeholder="https://yourwebsite.com"
                />
                <InputField
                  label="位置"
                  value={settings.profile.location}
                  onChange={(value) => updateSettings('profile', { location: value })}
                  placeholder="城市, 国家"
                />
              </div>
            </div>
          </SettingSection>
        )}

        {/* 通知设置 */}
        {activeTab === 'notifications' && (
          <SettingSection
            icon={Bell}
            title="通知设置"
            description="选择您想接收的通知"
          >
            <div className="space-y-4">
              <ToggleSwitch
                checked={settings.notifications.email}
                onChange={(checked) => updateSettings('notifications', { email: checked })}
                label="邮件通知"
                description="接收重要更新的邮件通知"
              />
              <ToggleSwitch
                checked={settings.notifications.push}
                onChange={(checked) => updateSettings('notifications', { push: checked })}
                label="推送通知"
                description="在浏览器中接收推送通知"
              />
              <ToggleSwitch
                checked={settings.notifications.mentions}
                onChange={(checked) => updateSettings('notifications', { mentions: checked })}
                label="提及通知"
                description="当有人提及您时接收通知"
              />
              <ToggleSwitch
                checked={settings.notifications.comments}
                onChange={(checked) => updateSettings('notifications', { comments: checked })}
                label="评论通知"
                description="当有人评论您的内容时接收通知"
              />
              <ToggleSwitch
                checked={settings.notifications.likes}
                onChange={(checked) => updateSettings('notifications', { likes: checked })}
                label="点赞通知"
                description="当有人点赞您的内容时接收通知"
              />
              <ToggleSwitch
                checked={settings.notifications.follows}
                onChange={(checked) => updateSettings('notifications', { follows: checked })}
                label="关注通知"
                description="当有人关注您时接收通知"
              />
              <ToggleSwitch
                checked={settings.notifications.weekly}
                onChange={(checked) => updateSettings('notifications', { weekly: checked })}
                label="每周摘要"
                description="接收每周活动摘要邮件"
              />
              <ToggleSwitch
                checked={settings.notifications.marketing}
                onChange={(checked) => updateSettings('notifications', { marketing: checked })}
                label="营销邮件"
                description="接收产品更新和促销信息"
              />
            </div>
          </SettingSection>
        )}

        {/* 隐私设置 */}
        {activeTab === 'privacy' && (
          <SettingSection
            icon={Shield}
            title="隐私设置"
            description="控制您的隐私和数据"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  资料可见性
                </label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) =>
                    updateSettings('privacy', {
                      profileVisibility: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="public">公开</option>
                  <option value="private">私密</option>
                  <option value="friends">仅好友可见</option>
                </select>
              </div>

              <ToggleSwitch
                checked={settings.privacy.showEmail}
                onChange={(checked) => updateSettings('privacy', { showEmail: checked })}
                label="显示邮箱"
                description="在个人资料中显示您的邮箱地址"
              />
              <ToggleSwitch
                checked={settings.privacy.showLocation}
                onChange={(checked) => updateSettings('privacy', { showLocation: checked })}
                label="显示位置"
                description="在个人资料中显示您的位置"
              />
              <ToggleSwitch
                checked={settings.privacy.allowMessages}
                onChange={(checked) => updateSettings('privacy', { allowMessages: checked })}
                label="允许私信"
                description="允许其他用户向您发送私信"
              />
              <ToggleSwitch
                checked={settings.privacy.searchable}
                onChange={(checked) => updateSettings('privacy', { searchable: checked })}
                label="可被搜索"
                description="允许其他用户通过搜索找到您"
              />
            </div>
          </SettingSection>
        )}

        {/* 外观设置 */}
        {activeTab === 'appearance' && (
          <SettingSection
            icon={Palette}
            title="外观设置"
            description="自定义应用的外观"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">主题</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSettings('appearance', { theme })}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all',
                        settings.appearance.theme === theme
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-white/10 bg-gray-800/50 hover:border-white/20'
                      )}
                    >
                      <p className="font-medium text-white capitalize">
                        {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  字体大小
                </label>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) =>
                    updateSettings('appearance', {
                      fontSize: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">语言</label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) =>
                    updateSettings('appearance', {
                      language: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <ToggleSwitch
                checked={settings.appearance.reducedMotion}
                onChange={(checked) =>
                  updateSettings('appearance', { reducedMotion: checked })
                }
                label="减少动画"
                description="减少动画效果以提高性能"
              />
            </div>
          </SettingSection>
        )}

        {/* 安全设置 */}
        {activeTab === 'security' && (
          <SettingSection
            icon={Shield}
            title="安全设置"
            description="保护您的账户安全"
          >
            <div className="space-y-4">
              <ToggleSwitch
                checked={settings.security.twoFactor}
                onChange={(checked) => updateSettings('security', { twoFactor: checked })}
                label="两步验证"
                description="添加额外的安全层保护您的账户"
              />
              <ToggleSwitch
                checked={settings.security.loginAlerts}
                onChange={(checked) => updateSettings('security', { loginAlerts: checked })}
                label="登录提醒"
                description="当检测到新登录时发送通知"
              />

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">活跃会话</p>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">当前会话</p>
                    <p className="text-xs text-gray-400">
                      {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    活跃
                  </span>
                </div>
              </div>

              <button className="w-full px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                修改密码
              </button>
            </div>
          </SettingSection>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="mt-8 flex items-center justify-between p-4 rounded-lg border border-white/10 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <>
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">设置已保存</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <X className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400">保存失败，请重试</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium',
              hasChanges
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium',
              hasChanges && !isSaving
                ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            )}
          >
            <Save className="w-4 h-4" />
            {isSaving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPanel;
