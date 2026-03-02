/**
 * Home Page
 * 首页 - 展示新创建的组件
 */

import React from 'react';
import { BlogCard } from '@/components/blog';
import { 
  LoadingSpinner, 
  ProgressBar, 
  Badge, 
  Tabs, 
  Modal,
  Tooltip 
} from '@/components/ui';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const samplePost = {
    id: 1,
    title: '欢迎使用 CyberPress Platform',
    excerpt: '这是一个使用 Next.js 14、React 18、TypeScript 和 Tailwind CSS 构建的现代化内容管理平台。',
    slug: 'welcome-to-cyberpress',
    date: new Date().toISOString(),
    author: { name: 'CyberPress Team' },
    categories: [
      { id: 1, name: '技术', slug: 'tech' },
      { id: 2, name: '教程', slug: 'tutorial' }
    ],
    featuredImage: null,
    readingTime: 5,
  };

  const tabsData = [
    {
      id: 'overview',
      label: '概述',
      content: (
        <div className="text-gray-300">
          <p>CyberPress Platform 是一个功能丰富的内容管理系统，提供了丰富的组件和工具。</p>
        </div>
      ),
    },
    {
      id: 'features',
      label: '功能',
      content: (
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>现代化 UI 组件库</li>
          <li>响应式设计</li>
          <li>赛博朋克风格主题</li>
          <li>丰富的动画效果</li>
        </ul>
      ),
    },
    {
      id: 'tech',
      label: '技术栈',
      content: (
        <div className="flex flex-wrap gap-2">
          {['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map(tech => (
            <Badge key={tech} variant="primary">{tech}</Badge>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            CyberPress Platform
          </h1>
          <p className="text-xl text-gray-400">
            现代化内容管理系统组件展示
          </p>
        </div>

        {/* Component Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Loading Spinners */}
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Loading 组件</h2>
            <div className="flex flex-wrap gap-8 items-center">
              <LoadingSpinner variant="default" size="md" />
              <LoadingSpinner variant="dots" size="md" />
              <LoadingSpinner variant="pulse" size="md" />
              <LoadingSpinner variant="cyber" size="md" />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Progress 组件</h2>
            <div className="space-y-4">
              <ProgressBar value={progress} variant="default" />
              <ProgressBar value={progress} variant="gradient" />
              <ProgressBar value={progress} variant="cyber" />
            </div>
          </div>

          {/* Badges */}
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Badge 组件</h2>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="primary" dot>Animated</Badge>
            </div>
          </div>

          {/* Tooltips */}
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Tooltip 组件</h2>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="这是一个提示">
                <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                  悬停查看
                </button>
              </Tooltip>
              <Tooltip content="顶部提示" placement="top">
                <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600">
                  顶部
                </button>
              </Tooltip>
              <Tooltip content="底部提示" placement="bottom">
                <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                  底部
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Tabs 组件</h2>
          <Tabs tabs={tabsData} defaultTab="overview" variant="default" />
        </div>

        {/* Blog Card */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">BlogCard 组件</h2>
          <div className="max-w-2xl">
            <BlogCard post={samplePost} />
          </div>
        </div>

        {/* Modal Trigger */}
        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            打开模态框
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal 示例"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            这是一个使用 Modal 组件创建的对话框。您可以在这里放置任何内容。
          </p>
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              取消
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              确认
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
