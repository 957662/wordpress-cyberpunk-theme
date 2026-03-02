/**
 * UserSettings - 用户设置页面组件
 * 包含账号设置、隐私设置、通知设置等
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Globe,
  Save,
  Camera,
} from 'lucide-react';
import { CyberButton } from '@/components/cyber/CyberButton';
import { CyberInput } from '@/components/cyber/CyberInput';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type TabType = 'profile' | 'account' | 'notifications' | 'privacy' | 'appearance';

interface SettingsTab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsTabs: SettingsTab[] = [
  { id: 'profile', label: '个人资料', icon: User },
  { id: 'account', label: '账号设置', icon: Key },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'privacy', label: '隐私设置', icon: Shield },
  { id: 'appearance', label: '外观设置', icon: Palette },
];

export function UserSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('设置已保存');
      setHasChanges(false);
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">账号设置</h1>
          <p className="text-gray-400">管理您的账号设置和偏好</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏导航 */}
          <div className="lg:col-span-1">
            <nav className="sticky top-8 space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all',
                      activeTab === tab.id
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* 设置内容区域 */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6"
            >
              {activeTab === 'profile' && <ProfileSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'account' && <AccountSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'notifications' && <NotificationSettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'privacy' && <PrivacySettings onChange={() => setHasChanges(true)} />}
              {activeTab === 'appearance' && <AppearanceSettings onChange={() => setHasChanges(true)} />}

              {/* 保存按钮 */}
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-gray-800 flex justify-end"
                >
                  <CyberButton
                    color="cyan"
                    onClick={handleSave}
                    loading={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存更改
                  </CyberButton>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 个人资料设置
function ProfileSettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">个人资料</h2>
        <p className="text-gray-400 text-sm mb-6">
          更新您的个人资料信息和公开资料
        </p>
      </div>

      {/* 头像上传 */}
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-3xl font-bold text-white">
          U
        </div>
        <div>
          <CyberButton color="cyan" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            更换头像
          </CyberButton>
          <p className="text-xs text-gray-500 mt-2">推荐尺寸: 400x400px</p>
        </div>
      </div>

      {/* 表单字段 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            显示名称
          </label>
          <CyberInput
            placeholder="输入显示名称"
            defaultValue="用户名"
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            用户名
          </label>
          <CyberInput
            placeholder="输入用户名"
            defaultValue="username"
            onChange={onChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            个人简介
          </label>
          <textarea
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors resize-none"
            rows={4}
            placeholder="介绍一下自己..."
            defaultValue="这是我的个人简介"
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            网站
          </label>
          <CyberInput
            type="url"
            placeholder="https://example.com"
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            位置
          </label>
          <CyberInput
            placeholder="城市, 国家"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

// 账号设置
function AccountSettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">账号设置</h2>
        <p className="text-gray-400 text-sm mb-6">
          管理您的账号安全和登录选项
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            电子邮箱
          </label>
          <CyberInput
            type="email"
            placeholder="your@email.com"
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            当前密码
          </label>
          <CyberInput
            type="password"
            placeholder="输入当前密码"
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            新密码
          </label>
          <CyberInput
            type="password"
            placeholder="输入新密码"
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            确认新密码
          </label>
          <CyberInput
            type="password"
            placeholder="再次输入新密码"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

// 通知设置
function NotificationSettings({ onChange }: { onChange: () => void }) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">通知设置</h2>
        <p className="text-gray-400 text-sm mb-6">
          选择您希望接收通知的方式
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">邮件通知</h3>

        {[
          '新评论提醒',
          '新粉丝通知',
          '文章被点赞',
          '每周精选',
          '系统更新',
        ].map((item) => (
          <label key={item} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
            <span className="text-gray-300">{item}</span>
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan bg-gray-700"
              defaultChecked={emailNotifications}
              onChange={(e) => {
                setEmailNotifications(e.target.checked);
                onChange();
              }}
            />
          </label>
        ))}

        <h3 className="text-lg font-medium text-white pt-4">推送通知</h3>

        {[
          '实时评论',
          '关注动态',
          '系统消息',
        ].map((item) => (
          <label key={item} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
            <span className="text-gray-300">{item}</span>
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan bg-gray-700"
              defaultChecked={pushNotifications}
              onChange={(e) => {
                setPushNotifications(e.target.checked);
                onChange();
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

// 隐私设置
function PrivacySettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">隐私设置</h2>
        <p className="text-gray-400 text-sm mb-6">
          控制您的个人信息可见性和数据隐私
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <div className="text-white font-medium">公开个人资料</div>
            <div className="text-sm text-gray-400">让所有人都能查看您的个人资料</div>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan bg-gray-700"
            defaultChecked
            onChange={onChange}
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <div className="text-white font-medium">显示邮箱地址</div>
            <div className="text-sm text-gray-400">在个人资料中显示您的邮箱</div>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan bg-gray-700"
            onChange={onChange}
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <div className="text-white font-medium">允许搜索引擎索引</div>
            <div className="text-sm text-gray-400">让搜索引擎收录您的内容</div>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan bg-gray-700"
            defaultChecked
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
}

// 外观设置
function AppearanceSettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">外观设置</h2>
        <p className="text-gray-400 text-sm mb-6">
          自定义您的界面外观和体验
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            主题模式
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['light', 'dark', 'auto'].map((theme) => (
              <button
                key={theme}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all',
                  theme === 'dark'
                    ? 'border-cyber-cyan bg-gray-800'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                )}
                onClick={onChange}
              >
                <div className="text-center">
                  <div className={cn(
                    'w-12 h-12 rounded-lg mx-auto mb-2',
                    theme === 'light' && 'bg-gray-200',
                    theme === 'dark' && 'bg-gray-700',
                    theme === 'auto' && 'bg-gradient-to-r from-gray-200 to-gray-700'
                  )} />
                  <div className="text-sm text-white capitalize">{theme}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            强调色
          </label>
          <div className="grid grid-cols-5 gap-3">
            {['cyan', 'purple', 'pink', 'yellow', 'green'].map((color) => (
              <button
                key={color}
                className={cn(
                  'w-full aspect-square rounded-lg transition-all',
                  `bg-cyber-${color}`,
                  color === 'cyan' ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'hover:scale-105'
                )}
                onClick={onChange}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            字体大小
          </label>
          <select
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyber-cyan"
            onChange={onChange}
          >
            <option value="sm">小</option>
            <option value="md" selected>中</option>
            <option value="lg">大</option>
          </select>
        </div>
      </div>
    </div>
  );
}
