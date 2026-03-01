'use client';

/**
 * 高级组件使用示例
 * 展示新创建的5个组件的实际应用
 */

import React, { useState } from 'react';
import {
  BarChart,
  LineChart,
  StatCard,
  StatsGrid,
  DashboardOverview,
} from '@/components/admin/DataCharts';
import {
  useNotificationCenter,
  NotificationBell,
  NotificationCenter,
} from '@/components/admin/NotificationCenter';
import { FormBuilder } from '@/components/ui/FormBuilder';
import { CodeEditor, CodeBlock } from '@/components/ui/CodeEditor';
import { AvatarUpload, AvatarGroup, ProfileCard } from '@/components/ui/AvatarUpload';

export default function AdvancedComponentsExample() {
  // ==================== 通知中心示例 ====================
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    unreadCount,
  } = useNotificationCenter();

  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // 模拟通知数据
  const mockNotifications = [
    {
      id: '1',
      type: 'success' as const,
      priority: 'high' as const,
      title: '文章发布成功',
      message: '您的文章《React性能优化》已成功发布！',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'warning' as const,
      priority: 'medium' as const,
      title: '存储空间不足',
      message: '您的存储空间已使用 85%，建议清理不必要的文件。',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ];

  // ==================== 数据图表示例 ====================
  const barChartData = [
    { label: '一月', value: 120 },
    { label: '二月', value: 150 },
    { label: '三月', value: 180 },
    { label: '四月', value: 220 },
    { label: '五月', value: 260 },
  ];

  const lineChartData = [
    { date: '2026-01', value: 100 },
    { date: '2026-02', value: 150 },
    { date: '2026-03', value: 200 },
    { date: '2026-04', value: 280 },
    { date: '2026-05', value: 350 },
  ];

  const stats = [
    {
      title: '总访问量',
      value: '12.5K',
      change: 15,
      changeType: 'increase' as const,
      color: 'cyan' as const,
      icon: '👁️',
    },
    {
      title: '文章数',
      value: '48',
      change: 5,
      changeType: 'increase' as const,
      color: 'pink' as const,
      icon: '📝',
    },
    {
      title: '评论数',
      value: '256',
      change: -3,
      changeType: 'decrease' as const,
      color: 'purple' as const,
      icon: '💬',
    },
    {
      title: '收入',
      value: '$3,240',
      change: 22,
      changeType: 'increase' as const,
      color: 'green' as const,
      icon: '💰',
    },
  ];

  // ==================== 表单示例 ====================
  const [formCode, setFormCode] = useState(`
// React 表单示例
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: '',
});

const handleSubmit = async (e) => {
  e.preventDefault();
  await submitForm(formData);
};
  `);

  const contactFormConfig = {
    fields: [
      {
        id: 'name',
        type: 'text' as const,
        name: 'name',
        label: '姓名',
        placeholder: '请输入您的姓名',
        required: true,
        validation: { minLength: 2, maxLength: 50 },
      },
      {
        id: 'email',
        type: 'email' as const,
        name: 'email',
        label: '邮箱',
        placeholder: 'example@email.com',
        required: true,
      },
      {
        id: 'topic',
        type: 'select' as const,
        name: 'topic',
        label: '主题',
        required: true,
        options: [
          { label: '技术交流', value: 'tech' },
          { label: '商务合作', value: 'business' },
          { label: '其他', value: 'other' },
        ],
      },
      {
        id: 'message',
        type: 'textarea' as const,
        name: 'message',
        label: '留言内容',
        placeholder: '请输入您的留言...',
        required: true,
        validation: { minLength: 10, maxLength: 500 },
      },
    ],
    title: '联系我们',
    description: '欢迎您的留言，我们会尽快回复',
    submitLabel: '发送消息',
    onSubmit: async (data) => {
      console.log('表单提交:', data);
      addNotification({
        type: 'success',
        priority: 'medium',
        title: '消息已发送',
        message: '感谢您的留言，我们会尽快回复！',
        timestamp: new Date(),
        duration: 3000,
      });
    },
    layout: 'vertical' as const,
  };

  // ==================== 代码编辑器示例 ====================
  const [code, setCode] = useState(`
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
  `);

  // ==================== 头像上传示例 ====================
  const [avatar, setAvatar] = useState<string | undefined>('/placeholder-avatar.jpg');

  const handleAvatarUpload = async (file: File) => {
    // 模拟上传
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const url = URL.createObjectURL(file);
    setAvatar(url);
    addNotification({
      type: 'success',
      priority: 'low',
      title: '头像上传成功',
      message: '您的新头像已更新！',
      timestamp: new Date(),
    });
  };

  const avatarGroupData = [
    { src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
    { src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana' },
    { src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            高级组件展示
          </h1>
          <p className="text-gray-400 text-lg">
            CyberPress Platform 最新创建的 5 个高级组件
          </p>
        </div>

        {/* ==================== 1. 数据可视化 ==================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-cyan-400">
              📊 数据可视化图表
            </h2>
            <button
              onClick={() => addNotification({
                type: 'info',
                priority: 'low',
                title: '数据已刷新',
                message: '图表数据已更新为最新',
                timestamp: new Date(),
              })}
              className="px-4 py-2 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm"
            >
              刷新数据
            </button>
          </div>

          {/* 统计卡片 */}
          <StatsGrid stats={stats} columns={4} />

          {/* 图表行 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
              <BarChart
                data={barChartData}
                title="月度访问量"
                height={200}
                showValues
              />
            </div>

            <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
              <LineChart
                data={lineChartData}
                title="访问趋势"
                height={200}
                showArea
              />
            </div>
          </div>
        </section>

        {/* ==================== 2. 通知中心 ==================== */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">
            🔔 通知中心
          </h2>

          <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
            <div className="flex items-center gap-4 mb-4">
              <NotificationBell
                unreadCount={unreadCount}
                onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => addNotification({
                    type: 'success',
                    priority: 'high',
                    title: '操作成功',
                    message: '您的操作已成功完成',
                    timestamp: new Date(),
                    duration: 3000,
                  })}
                  className="px-3 py-1.5 text-sm rounded bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all"
                >
                  成功通知
                </button>

                <button
                  onClick={() => addNotification({
                    type: 'error',
                    priority: 'urgent',
                    title: '错误警告',
                    message: '发生了一个错误，请重试',
                    timestamp: new Date(),
                  })}
                  className="px-3 py-1.5 text-sm rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  错误通知
                </button>

                <button
                  onClick={() => addNotification({
                    type: 'cyber',
                    priority: 'medium',
                    title: '系统消息',
                    message: '欢迎来到 CyberPress！',
                    timestamp: new Date(),
                    duration: 5000,
                  })}
                  className="px-3 py-1.5 text-sm rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                >
                  赛博通知
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              当前未读: {unreadCount} 条通知
            </p>

            {showNotificationCenter && (
              <NotificationCenter
                notifications={mockNotifications}
                onMarkAsRead={markAsRead}
                onDismiss={removeNotification}
                isOpen={showNotificationCenter}
                onClose={() => setShowNotificationCenter(false)}
              />
            )}
          </div>
        </section>

        {/* ==================== 3. 动态表单 ==================== */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">
            📝 动态表单构建器
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
              <FormBuilder {...contactFormConfig} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                表单配置示例
              </h3>

              <CodeBlock
                code={formCode}
                language="javascript"
                theme="monokai"
                showLineNumbers
                filename="form-example.js"
              />

              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
                <h4 className="font-semibold text-white">功能特性：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>支持 10+ 种字段类型</li>
                  <li>实时验证和错误提示</li>
                  <li>多种布局选项（垂直/水平/网格）</li>
                  <li>自定义验证规则</li>
                  <li>加载状态和禁用支持</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. 代码编辑器 ==================== */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">
            💻 代码编辑器
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                可编辑编辑器
              </h3>
              <CodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
                theme="cyberpunk"
                height="300px"
                filename="quicksort.js"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                代码展示块
              </h3>
              <CodeBlock
                code={code}
                language="javascript"
                theme="monokai"
                showLineNumbers
                filename="quicksort.js"
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">支持的特性：</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">语法高亮</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">行号显示</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">多主题</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">15+ 语言</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">复制代码</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">下载文件</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">Tab 支持</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span className="text-gray-300">只读模式</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 5. 头像上传 ==================== */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">
            👤 头像上传系统
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 头像上传 */}
            <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                头像上传
              </h3>
              <div className="flex justify-center">
                <AvatarUpload
                  currentAvatar={avatar}
                  onUpload={handleAvatarUpload}
                  onRemove={() => setAvatar(undefined)}
                  size={128}
                  shape="circle"
                  maxSize={5}
                />
              </div>
            </div>

            {/* 头像组 */}
            <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                头像组
              </h3>
              <div className="flex justify-center">
                <AvatarGroup
                  avatars={avatarGroupData}
                  size={48}
                  max={5}
                  overlap={16}
                />
              </div>
              <p className="text-sm text-gray-400 text-center mt-4">
                显示 5 位成员，剩余 1 位
              </p>
            </div>

            {/* 用户资料卡片 */}
            <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                用户资料卡片
              </h3>
              <ProfileCard
                name="张三"
                username="zhangsan"
                avatar={avatar}
                bio="全栈开发者 | React 爱好者 | 赛博朋克粉丝"
                location="北京，中国"
                website="https://example.com"
                stats={[
                  { label: '文章', value: 48 },
                  { label: '关注者', value: '1.2K' },
                  { label: '关注', value: 234 },
                ]}
                editable
                onEdit={() => addNotification({
                  type: 'info',
                  priority: 'low',
                  title: '编辑资料',
                  message: '点击了编辑资料按钮',
                  timestamp: new Date(),
                })}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            CyberPress Platform © 2026 | 赛博朋克风格组件库
          </p>
        </footer>
      </div>
    </div>
  );
}
