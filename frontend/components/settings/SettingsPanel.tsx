'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
  ChevronRight,
  Monitor,
  Smartphone,
  Moon,
  Sun,
  Zap,
  Github,
  Twitter
} from 'lucide-react';

export type SettingsTab = 'profile' | 'account' | 'notifications' | 'privacy' | 'appearance' | 'integrations';

interface SettingsPanelProps {
  defaultTab?: SettingsTab;
  onSave?: (tab: SettingsTab, data: any) => void;
  className?: string;
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'textarea' | 'color' | 'number';
  value: any;
  options?: { label: string; value: any }[];
  icon?: React.ReactNode;
}

const tabs = [
  { id: 'profile' as SettingsTab, label: '个人资料', icon: User },
  { id: 'account' as SettingsTab, label: '账号', icon: Shield },
  { id: 'notifications' as SettingsTab, label: '通知', icon: Bell },
  { id: 'privacy' as SettingsTab, label: '隐私', icon: Lock },
  { id: 'appearance' as SettingsTab, label: '外观', icon: Palette },
  { id: 'integrations' as SettingsTab, label: '集成', icon: Globe }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  defaultTab = 'profile',
  onSave,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    onSave?.(activeTab, {});
  };

  return (
    <div className={`bg-dark-bg/50 border border-cyber-cyan/30 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-bg to-dark-bg/80 border-b border-cyber-cyan/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-xl">
              <Settings className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">设置</h2>
              <p className="text-sm text-gray-400">管理你的账号和偏好设置</p>
            </div>
          </div>
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-white font-medium hover:shadow-neon-cyan transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存更改
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-dark-border p-4">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 text-white shadow-neon-cyan'
                      : 'text-gray-400 hover:bg-dark-bg/50 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'account' && <AccountSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'notifications' && <NotificationSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'privacy' && <PrivacySettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'appearance' && <AppearanceSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'integrations' && <IntegrationSettings onChange={() => setHasChanges(true)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 px-6 py-3 bg-green-400/20 border border-green-400/30 rounded-xl flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">设置已保存</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">个人资料</h3>

      <SettingItem
        id="displayName"
        label="显示名称"
        type="input"
        value="Cyber Developer"
        placeholder="输入显示名称"
        onChange={onChange}
      />

      <SettingItem
        id="username"
        label="用户名"
        type="input"
        value="cyberdev"
        placeholder="输入用户名"
        onChange={onChange}
      />

      <SettingItem
        id="bio"
        label="个人简介"
        description="向其他人介绍你自己"
        type="textarea"
        value="全栈开发者，热爱技术分享"
        placeholder="输入个人简介"
        onChange={onChange}
      />

      <SettingItem
        id="location"
        label="位置"
        type="input"
        value="北京"
        placeholder="输入你的位置"
        onChange={onChange}
      />

      <SettingItem
        id="website"
        label="网站"
        type="input"
        value="https://example.com"
        placeholder="https://example.com"
        onChange={onChange}
      />
    </div>
  );
};

// Account Settings Component
const AccountSettings: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">账号设置</h3>

      <SettingItem
        id="email"
        label="邮箱地址"
        description="用于登录和接收通知"
        type="input"
        value="user@example.com"
        placeholder="输入邮箱地址"
        onChange={onChange}
      />

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">密码</label>
        <div className="relative">
          <input
            type={showEmail ? 'text' : 'password'}
            value="password123"
            readOnly
            className="w-full px-4 py-3 bg-dark-bg/50 border border-dark-border rounded-lg text-white"
          />
          <button
            onClick={() => setShowEmail(!showEmail)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            {showEmail ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <button className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors">
          修改密码
        </button>
      </div>

      <SettingItem
        id="2fa"
        label="双因素认证"
        description="增强账号安全性"
        type="toggle"
        value={false}
        onChange={onChange}
      />
    </div>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">通知设置</h3>

      <SettingItem
        id="email-notifications"
        label="邮件通知"
        description="接收邮件通知更新"
        type="toggle"
        value={true}
        onChange={onChange}
      />

      <SettingItem
        id="push-notifications"
        label="推送通知"
        description="在浏览器中接收推送通知"
        type="toggle"
        value={true}
        onChange={onChange}
      />

      <SettingItem
        id="comment-notifications"
        label="评论通知"
        description="当有人评论你的文章时通知"
        type="toggle"
        value={true}
        onChange={onChange}
      />

      <SettingItem
        id="follower-notifications"
        label="关注者通知"
        description="当有人关注你时通知"
        type="toggle"
        value={false}
        onChange={onChange}
      />

      <SettingItem
        id="mention-notifications"
        label="提及通知"
        description="当有人@你时通知"
        type="toggle"
        value={true}
        onChange={onChange}
      />
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">隐私设置</h3>

      <SettingItem
        id="profile-visibility"
        label="个人资料可见性"
        type="select"
        value="public"
        options={[
          { label: '公开', value: 'public' },
          { label: '仅关注者', value: 'followers' },
          { label: '私密', value: 'private' }
        ]}
        onChange={onChange}
      />

      <SettingItem
        id="show-email"
        label="显示邮箱"
        description="在个人资料中显示邮箱地址"
        type="toggle"
        value={false}
        onChange={onChange}
      />

      <SettingItem
        id="show-activity"
        label="显示活动状态"
        description="显示你在线和最近活动"
        type="toggle"
        value={true}
        onChange={onChange}
      />

      <SettingItem
        id="allow-indexing"
        label="搜索引擎索引"
        description="允许搜索引擎索引你的个人资料"
        type="toggle"
        value={true}
        onChange={onChange}
      />
    </div>
  );
};

// Appearance Settings Component
const AppearanceSettings: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">外观设置</h3>

      <SettingItem
        id="theme"
        label="主题"
        type="select"
        value="dark"
        options={[
          { label: '深色', value: 'dark' },
          { label: '浅色', value: 'light' },
          { label: '跟随系统', value: 'system' }
        ]}
        onChange={onChange}
      />

      <SettingItem
        id="accent-color"
        label="强调色"
        type="select"
        value="cyan"
        options={[
          { label: '赛博青', value: 'cyan' },
          { label: '赛博紫', value: 'purple' },
          { label: '赛博粉', value: 'pink' },
          { label: '绿色', value: 'green' }
        ]}
        onChange={onChange}
      />

      <SettingItem
        id="font-size"
        label="字体大小"
        type="select"
        value="medium"
        options={[
          { label: '小', value: 'small' },
          { label: '中', value: 'medium' },
          { label: '大', value: 'large' }
        ]}
        onChange={onChange}
      />

      <SettingItem
        id="reduce-motion"
        label="减少动画"
        description="减少界面动画效果"
        type="toggle"
        value={false}
        onChange={onChange}
      />

      <SettingItem
        id="compact-mode"
        label="紧凑模式"
        description="使用更紧凑的界面布局"
        type="toggle"
        value={false}
        onChange={onChange}
      />
    </div>
  );
};

// Integration Settings Component
const IntegrationSettings: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">集成设置</h3>

      <div className="p-4 bg-dark-bg/30 border border-dark-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">GitHub</h4>
              <p className="text-xs text-gray-500">连接你的 GitHub 账号</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm hover:border-cyber-cyan/50 transition-colors">
            连接
          </button>
        </div>
      </div>

      <div className="p-4 bg-dark-bg/30 border border-dark-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Twitter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">Twitter</h4>
              <p className="text-xs text-gray-500">连接你的 Twitter 账号</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm hover:border-cyber-cyan/50 transition-colors">
            连接
          </button>
        </div>
      </div>

      <div className="p-4 bg-dark-bg/30 border border-dark-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">API 密钥</h4>
              <p className="text-xs text-gray-500">管理你的 API 密钥</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm hover:border-cyber-cyan/50 transition-colors">
            管理
          </button>
        </div>
      </div>
    </div>
  );
};

// Setting Item Component
interface SettingItemProps {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'textarea' | 'color' | 'number';
  value: any;
  options?: { label: string; value: any }[];
  placeholder?: string;
  onChange: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  type,
  value,
  options,
  placeholder,
  onChange
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    onChange();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-300">{label}</label>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>

        {type === 'toggle' && (
          <button
            onClick={() => handleChange(!localValue)}
            className={`
              relative w-12 h-6 rounded-full transition-colors duration-300
              ${localValue ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple' : 'bg-dark-bg border border-dark-border'}
            `}
          >
            <motion.div
              animate={{ x: localValue ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        )}

        {type === 'select' && (
          <select
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-cyber-cyan/50"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {type === 'input' && (
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-cyber-cyan/50 w-64"
          />
        )}

        {type === 'number' && (
          <input
            type="number"
            value={localValue}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-cyber-cyan/50 w-32"
          />
        )}
      </div>

      {type === 'textarea' && (
        <textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 bg-dark-bg/50 border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-cyber-cyan/50 resize-none"
        />
      )}
    </div>
  );
};

export default SettingsPanel;
