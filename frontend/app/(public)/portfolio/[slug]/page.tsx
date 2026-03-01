'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  Clock,
  User,
  Tag,
  Code2
} from 'lucide-react';
import { HolographicCard } from '@/components/effects/HolographicCard';
import { GlitchText } from '@/components/effects/GlitchText';
import { TypewriterText } from '@/components/effects/TypewriterText';

// 模拟作品数据
const portfolioItems: Record<string, any> = {
  'cyberpress-platform': {
    id: 1,
    title: 'CyberPress Platform',
    slug: 'cyberpress-platform',
    excerpt: '基于 WordPress + Next.js 的赛博朋克风格博客平台',
    description: '一个现代化的博客平台，采用 Headless CMS 架构',
    content: `
## 项目概述

CyberPress 是一个基于 WordPress REST API 和 Next.js 14 构建的现代化博客平台。项目采用赛博朋克设计风格，提供了流畅的动画效果和极致的用户体验。

### 核心特性

- **Next.js 14** - 采用最新的 App Router，享受极致性能
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS** - 灵活的样式系统
- **Framer Motion** - 丝滑的动画效果
- **WordPress REST API** - Headless CMS 架构

### 技术架构

\`\`\`typescript
// 核心架构示例
interface CyberPressConfig {
  framework: 'Next.js 14';
  language: 'TypeScript';
  styling: 'Tailwind CSS';
  cms: 'WordPress REST API';
  animation: 'Framer Motion';
}
\`\`\`

### 实现亮点

1. **服务端渲染 (SSR)** - 首屏极速加载
2. **静态生成 (SSG)** - 博客文章预渲染
3. **增量静态再生成 (ISR)** - 定时更新内容
4. **图片优化** - 自动 WebP 转换和懒加载
5. **SEO 优化** - 完善的元数据和结构化数据
    `,
    featured_image: '/images/portfolio/cyberpress.jpg',
    images: [
      '/images/portfolio/cyberpress-1.jpg',
      '/images/portfolio/cyberpress-2.jpg',
      '/images/portfolio/cyberpress-3.jpg'
    ],
    technologies: [
      { name: 'Next.js', icon: '⚛️', color: '#000000' },
      { name: 'TypeScript', icon: '📘', color: '#3178C6' },
      { name: 'WordPress', icon: '📝', color: '#21759B' },
      { name: 'Tailwind CSS', icon: '🎨', color: '#06B6D4' },
      { name: 'Framer Motion', icon: '🎬', color: '#FF0080' }
    ],
    github_url: 'https://github.com',
    demo_url: 'https://demo.cyberpress.dev',
    featured: true,
    date: '2024-01-15',
    client: 'Open Source',
    role: 'Full Stack Developer',
    duration: '3 个月',
    status: '已完成',
    category: 'Web 应用'
  },
  'ai-chat-assistant': {
    id: 2,
    title: 'AI Chat Assistant',
    slug: 'ai-chat-assistant',
    excerpt: '智能聊天助手，支持多模态交互',
    description: '下一代 AI 聊天应用',
    content: `
## 项目概述

一个功能强大的 AI 聊天助手，支持文本、图像等多种输入方式。采用流式响应技术，提供实时的对话体验。

### 核心功能

- **多模态输入** - 支持文本、图像、语音
- **流式响应** - 实时显示 AI 回复
- **上下文记忆** - 智能对话历史管理
- **多语言支持** - 中英文无缝切换

### 技术实现

\`\`\`typescript
// AI 流式响应示例
async function* streamChat(message: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  });

  const reader = response.body!.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield new TextDecoder().decode(value);
  }
}
\`\`\`
    `,
    featured_image: '/images/portfolio/ai-chat.jpg',
    images: [
      '/images/portfolio/ai-chat-1.jpg',
      '/images/portfolio/ai-chat-2.jpg'
    ],
    technologies: [
      { name: 'React', icon: '⚛️', color: '#61DAFB' },
      { name: 'OpenAI API', icon: '🤖', color: '#00A67E' },
      { name: 'Node.js', icon: '🟢', color: '#339933' },
      { name: 'MongoDB', icon: '🍃', color: '#47A248' },
      { name: 'Socket.io', icon: '⚡', color: '#010101' }
    ],
    github_url: 'https://github.com',
    demo_url: 'https://ai-chat.demo',
    featured: true,
    date: '2024-02-01',
    role: 'Frontend Developer',
    duration: '2 个月',
    status: '开发中',
    category: 'AI 应用'
  }
};

export default function PortfolioDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = portfolioItems[slug];

  if (!project) {
    return (
      <main className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">项目未找到</h1>
          <Link
            href="/portfolio"
            className="text-cyber-cyan hover:text-cyber-purple transition-colors"
          >
            返回作品集
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border sticky top-0 bg-cyber-dark/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link
              href="/portfolio"
              className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回作品集</span>
            </Link>
            <Link href="/" className="text-xl font-display font-bold">
              <span className="text-cyber-cyan">CYBER</span>
              <span className="text-cyber-purple">PRESS</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* Category */}
            <span className="inline-block px-3 py-1 text-xs font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full mb-4">
              {project.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              <GlitchText text={project.title} />
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-400 mb-8 max-w-3xl">
              <TypewriterText text={project.excerpt} speed={30} />
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {project.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {project.duration}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {project.role}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-cyan text-cyber-dark font-medium rounded hover:bg-cyber-cyan/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  查看演示
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-cyber-border text-gray-300 font-medium rounded hover:border-cyber-purple hover:text-cyber-purple transition-colors"
                >
                  <Github className="w-4 h-4" />
                  源代码
                </a>
              )}
            </div>
          </motion.header>

          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <HolographicCard className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center">
                <Code2 className="w-24 h-24 text-cyber-cyan/50" />
              </div>
            </HolographicCard>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Tag className="w-6 h-6 text-cyber-cyan" />
              技术栈
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech: any) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-colors cursor-default"
                >
                  <span>{tech.icon}</span>
                  <span className="text-sm font-medium">{tech.name}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <HolographicCard className="p-8">
              <div className="prose prose-invert prose-cyber max-w-none">
                <div dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br/>') }} />
              </div>
            </HolographicCard>
          </motion.div>

          {/* Project Gallery */}
          {project.images && project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">项目截图</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-video bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 rounded-lg border border-cyber-border"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Project Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <HolographicCard className="p-6">
              <h3 className="text-sm font-mono text-cyber-cyan mb-2">客户</h3>
              <p className="text-white font-medium">{project.client}</p>
            </HolographicCard>
            <HolographicCard className="p-6">
              <h3 className="text-sm font-mono text-cyber-cyan mb-2">角色</h3>
              <p className="text-white font-medium">{project.role}</p>
            </HolographicCard>
            <HolographicCard className="p-6">
              <h3 className="text-sm font-mono text-cyber-cyan mb-2">状态</h3>
              <p className="text-white font-medium">{project.status}</p>
            </HolographicCard>
          </motion.div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-cyber-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CyberPress. 由 AI 开发团队自动构建 🤖
          </p>
        </div>
      </footer>
    </main>
  );
}
