/**
 * 组件展示页面
 * 展示所有新创建的组件的使用方法
 */

'use client';

import { useState } from 'react';
import { Code, Users, TrendingUp, Zap } from 'lucide-react';
import { QuickStartGuide, QuickStartCard } from '@/components/quickstart/QuickStartGuide';
import { AIChatAssistant, AIQuickAction } from '@/components/ai-assistant/AIChatAssistant';
import { CodeEditor, CodePreview } from '@/components/code-editor/CodeEditor';
import { StatCard, StatsGrid, ActivityFeed, QuickActions } from '@/components/dashboard/DashboardStats';
import { formatDate, calculateReadingTime } from '@/lib/utils/date';
import { validateEmail, validatePassword } from '@/lib/utils/validation';

export default function ShowcasePage() {
  const [code, setCode] = useState(`// 示例代码
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`);

  // 快速开始指南的步骤
  const quickStartSteps = [
    {
      id: 'step1',
      title: '欢迎使用 CyberPress',
      description: '探索平台的核心功能和特性',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            CyberPress 是一个现代化的博客平台，采用赛博朋克风格设计，
            结合了最新的 Web 技术栈。
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">🚀 高性能</h4>
              <p className="text-sm text-gray-400">
                Next.js 14 + FastAPI，提供极致的性能体验
              </p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-purple-400 mb-2">🎨 独特设计</h4>
              <p className="text-sm text-gray-400">
                赛博朋克风格，霓虹色彩和流畅动画
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      title: '创建你的第一篇文章',
      description: '学习如何使用 Markdown 编辑器',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            支持完整的 Markdown 语法，包括代码高亮、图片上传等功能。
          </p>
          <div className="p-4 bg-gray-800 rounded-lg font-mono text-sm">
            <p className="text-cyan-400"># 标题</p>
            <p className="text-gray-300">这是一段文字...</p>
            <p className="text-purple-400">```javascript</p>
            <p className="text-gray-300">console.log('Hello');</p>
            <p className="text-purple-400">```</p>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      title: '个性化你的空间',
      description: '配置头像、简介和社交链接',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            完善你的个人资料，让其他用户更好地了解你。
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>上传头像</li>
            <li>填写个人简介</li>
            <li>添加社交媒体链接</li>
            <li>选择主题颜色</li>
          </ul>
        </div>
      ),
    },
  ];

  // 示例统计数据
  const stats = [
    {
      title: '总文章数',
      value: '1,234',
      change: 12,
      changeType: 'increase' as const,
      icon: <Code className="w-6 h-6" />,
      description: '比上月增长',
    },
    {
      title: '活跃用户',
      value: '5,678',
      change: 8,
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6" />,
      description: '比上月增长',
    },
    {
      title: '页面浏览量',
      value: '12.5K',
      change: 15,
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      description: '比上月增长',
    },
    {
      title: '平均响应时间',
      value: '120ms',
      change: 5,
      changeType: 'decrease' as const,
      icon: <Zap className="w-6 h-6" />,
      description: '比上月提升',
    },
  ];

  // 示例活动记录
  const activities = [
    {
      id: '1',
      type: 'post' as const,
      title: '发布了新文章',
      description: '《Next.js 14 新特性详解》',
      timestamp: formatDate(Date.now(), 'relative'),
    },
    {
      id: '2',
      type: 'like' as const,
      title: '获得了点赞',
      description: '你的文章《TypeScript 最佳实践》被点赞',
      timestamp: formatDate(Date.now() - 3600000, 'relative'),
    },
    {
      id: '3',
      type: 'comment' as const,
      title: '收到新评论',
      description: '用户在文章中留言了',
      timestamp: formatDate(Date.now() - 7200000, 'relative'),
    },
  ];

  // 快速操作
  const quickActions = [
    {
      id: 'new-post',
      label: '新建文章',
      icon: <Code className="w-4 h-4" />,
      onClick: () => alert('创建新文章'),
      variant: 'primary' as const,
    },
    {
      id: 'upload',
      label: '上传图片',
      icon: <Users className="w-4 h-4" />,
      onClick: () => alert('上传图片'),
    },
    {
      id: 'settings',
      label: '设置',
      icon: <Zap className="w-4 h-4" />,
      onClick: () => alert('打开设置'),
    },
    {
      id: 'help',
      label: '帮助',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => alert('查看帮助'),
    },
  ];

  // AI 建议提示
  const aiSuggestions = [
    '帮我写一篇技术博客',
    '优化这段代码',
    '生成项目文档',
    '解释这个概念',
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            组件展示中心
          </h1>
          <p className="text-gray-400">
            探索所有可用的 UI 组件和功能
          </p>
        </div>

        {/* 快速开始指南 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">快速开始指南</h2>
          <QuickStartGuide
            steps={quickStartSteps}
            onComplete={() => alert('欢迎使用 CyberPress！')}
          />
        </section>

        {/* 统计卡片 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">数据统计</h2>
          <StatsGrid stats={stats} columns={4} />
        </section>

        {/* AI 助手 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">AI 助手</h2>
            <div className="h-[600px]">
              <AIChatAssistant
                suggestions={aiSuggestions}
                onSendMessage={async (msg) => {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  return `这是对"${msg}"的回复。在实际应用中，这里会连接到真实的 AI API。`;
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">活动记录</h2>
            <ActivityFeed activities={activities} />

            <div className="pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                快速操作
              </h3>
              <QuickActions actions={quickActions} />
            </div>
          </div>
        </section>

        {/* 代码编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">代码编辑器</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                独立编辑器
              </h3>
              <CodeEditor
                value={code}
                onChange={setCode}
                language="typescript"
                minHeight="300px"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                编辑器 + 预览
              </h3>
              <CodePreview
                value={code}
                onEditorChange={setCode}
                language="typescript"
              />
            </div>
          </div>
        </section>

        {/* 快速开始卡片 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">功能卡片</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickStartCard
              title="创建文章"
              description="使用 Markdown 编辑器撰写你的第一篇博客文章"
              icon={<Code className="w-6 h-6" />}
              actionLabel="开始创作"
              onAction={() => alert('创建文章')}
            />
            <QuickStartCard
              title="设置个人资料"
              description="完善你的个人信息，让其他用户更好地了解你"
              icon={<Users className="w-6 h-6" />}
              actionLabel="前往设置"
              onAction={() => alert('打开设置')}
            />
            <QuickStartCard
              title="探索社区"
              description="浏览其他用户的文章，发现有趣的内容"
              icon={<TrendingUp className="w-6 h-6" />}
              actionLabel="开始探索"
              completed
              onAction={() => alert('探索社区')}
            />
          </div>
        </section>

        {/* 工具函数示例 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">工具函数</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">日期格式化</h3>
              <p className="text-sm text-gray-400 mb-2">
                {formatDate(Date.now(), 'long')}
              </p>
              <p className="text-xs text-gray-500">
                相对时间: {formatDate(Date.now(), 'relative')}
              </p>
            </div>

            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">阅读时间计算</h3>
              <p className="text-sm text-gray-400 mb-2">
                本段文字需要阅读{' '}
                {calculateReadingTime('这是一段示例文字。' .repeat(50))} 分钟
              </p>
              <p className="text-xs text-gray-500">
                基于平均阅读速度 200 字/分钟
              </p>
            </div>

            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">表单验证</h3>
              <p className="text-sm text-gray-400 mb-2">
                {validateEmail('user@example.com').isValid
                  ? '邮箱格式正确'
                  : '邮箱格式错误'}
              </p>
              <p className="text-xs text-gray-500">
                密码强度:{' '}
                {validatePassword('MyP@ssw0rd').strength || '未测试'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
