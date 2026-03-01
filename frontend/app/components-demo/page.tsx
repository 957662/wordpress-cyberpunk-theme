/**
 * UI 组件演示页面
 * 展示所有 UI 组件的使用
 */

'use client';

import {
  Avatar,
  Skeleton,
  SkeletonList,
  Dropdown,
  Tabs,
  Divider,
  AnimatedDivider,
  Chip,
  ChipGroup,
  Progress,
  CircularProgress,
  Timeline,
  Accordion,
  Rating,
  Carousel,
} from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function ComponentsDemoPage() {
  const dropdownOptions = [
    { value: 'option1', label: '选项一', icon: '🚀' },
    { value: 'option2', label: '选项二', icon: '⚡' },
    { value: 'option3', label: '选项三', icon: '✨' },
    { value: 'option4', label: '禁用选项', disabled: true },
  ];

  const tabs = [
    {
      value: 'tab1',
      label: '首页',
      icon: '🏠',
      children: (
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">首页内容</h3>
          <p className="text-gray-400">这是首页标签页的内容区域。</p>
        </div>
      ),
    },
    {
      value: 'tab2',
      label: '博客',
      icon: '📝',
      badge: 5,
      children: (
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">博客内容</h3>
          <p className="text-gray-400">这是博客标签页的内容区域。</p>
        </div>
      ),
    },
    {
      value: 'tab3',
      label: '关于',
      icon: 'ℹ️',
      children: (
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">关于内容</h3>
          <p className="text-gray-400">这是关于标签页的内容区域。</p>
        </div>
      ),
    },
  ];

  const timelineItems = [
    {
      id: '1',
      title: '项目启动',
      description: 'CyberPress 项目正式立项',
      date: '2024-01-01',
      tags: ['里程碑'],
    },
    {
      id: '2',
      title: '前端开发',
      description: '完成 Next.js 项目搭建',
      date: '2024-01-15',
      tags: ['开发', '前端'],
    },
    {
      id: '3',
      title: '后端集成',
      description: '集成 WordPress REST API',
      date: '2024-02-01',
      tags: ['开发', '后端'],
    },
    {
      id: '4',
      title: 'UI 设计',
      description: '赛博朋克主题设计完成',
      date: '2024-02-15',
      tags: ['设计', 'UI'],
    },
  ];

  const accordionItems = [
    {
      id: '1',
      title: '什么是 CyberPress？',
      content: 'CyberPress 是一个基于 WordPress + Next.js 的现代化博客平台，采用赛博朋克风格设计。',
    },
    {
      id: '2',
      title: '如何使用组件？',
      content: '所有组件都可以通过 @/components/ui 导入使用。每个组件都有完整的 TypeScript 类型支持。',
    },
    {
      id: '3',
      title: '性能优化',
      content: '平台使用了多种性能优化技术，包括 SSR、图片优化、代码分割等，确保最佳的用户体验。',
    },
  ];

  const carouselItems = [
    {
      id: '1',
      title: 'Next.js 14',
      description: '最新的 React 框架',
      image: '',
    },
    {
      id: '2',
      title: 'TypeScript',
      description: '类型安全的 JavaScript',
      image: '',
    },
    {
      id: '3',
      title: 'Tailwind CSS',
      description: '实用优先的 CSS 框架',
      image: '',
    },
  ];

  return (
    <main className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold mb-4 text-white">
            UI 组件库
          </h1>
          <p className="text-gray-400 text-lg">
            完整的赛博朋克风格组件集合
          </p>
        </motion.div>

        {/* 组件展示 */}
        <div className="space-y-12">
          {/* Avatar */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              头像组件
            </h2>
            <div className="flex items-center gap-6 flex-wrap">
              <Avatar size="sm" bordered />
              <Avatar size="md" bordered borderColor="purple" />
              <Avatar size="lg" bordered borderColor="pink" />
              <Avatar size="xl" bordered borderColor="yellow" online />
              <Avatar size="lg">AB</Avatar>
            </div>
          </section>

          {/* Skeleton */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              骨架屏
            </h2>
            <SkeletonList count={3} />
          </section>

          {/* Dropdown */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              下拉菜单
            </h2>
            <div className="max-w-xs">
              <Dropdown options={dropdownOptions} placeholder="选择一个选项" />
            </div>
          </section>

          {/* Tabs */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              标签页
            </h2>
            <Tabs tabs={tabs} />
          </section>

          {/* Divider */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              分割线
            </h2>
            <div className="space-y-6">
              <Divider />
              <Divider label="分隔文本" />
              <AnimatedDivider color="cyan" />
              <AnimatedDivider label="动画分割线" scan />
            </div>
          </section>

          {/* Chip */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              芯片标签
            </h2>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Chip label="React" color="cyan" />
                <Chip label="TypeScript" color="purple" />
                <Chip label="Tailwind" color="pink" />
                <Chip label="Next.js" color="yellow" deletable />
              </div>
              <ChipGroup
                chips={[
                  { label: 'React', color: 'cyan' },
                  { label: 'Vue', color: 'purple' },
                  { label: 'Angular', color: 'pink' },
                  { label: 'Svelte', color: 'yellow' },
                ]}
                multiple
              />
            </div>
          </section>

          {/* Progress */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              进度条
            </h2>
            <div className="space-y-6">
              <Progress value={75} showPercentage />
              <Progress value={45} color="purple" size="lg" />
              <Progress value={90} color="pink" />
              <div className="flex items-center gap-8">
                <CircularProgress value={75} />
                <CircularProgress value={45} color="purple" />
                <CircularProgress value={90} color="pink" size={150} />
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              时间线
            </h2>
            <Timeline items={timelineItems} color="cyan" />
          </section>

          {/* Accordion */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              手风琴
            </h2>
            <Accordion items={accordionItems} color="cyan" />
          </section>

          {/* Rating */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              评分组件
            </h2>
            <div className="space-y-4">
              <Rating value={4.5} />
              <Rating value={3.7} color="purple" size="lg" />
              <Rating value={5} color="pink" interactive showValue={false} />
              <Rating value={2.5} color="yellow" readonly />
            </div>
          </section>

          {/* Carousel */}
          <section className="cyber-card">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              轮播图
            </h2>
            <Carousel
              items={carouselItems}
              autoplay
              interval={3000}
              showDots
              showArrows
              className="h-64"
            />
          </section>
        </div>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 cyber-card"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            使用说明
          </h2>
          <div className="space-y-4 text-gray-400">
            <div>
              <h3 className="text-cyber-cyan font-semibold mb-2">导入方式</h3>
              <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                <code className="text-cyber-cyan">
                  {`import { Button, Card, Avatar } from '@/components/ui';`}
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-cyber-cyan font-semibold mb-2">自定义主题</h3>
              <p>所有组件都支持通过 props 自定义颜色、大小等属性，完美适配赛博朋克主题。</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
