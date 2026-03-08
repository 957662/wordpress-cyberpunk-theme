'use client';

/**
 * Portfolio Page
 * 作品集页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Filter, Search } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import Image from 'next/image';

// 模拟项目数据
const projects = [
  {
    id: 1,
    title: 'CyberPress Platform',
    description: '基于 Next.js 14 和 WordPress 的赛博朋克风格博客平台',
    image: null,
    tags: ['Next.js', 'TypeScript', 'WordPress', 'Tailwind CSS'],
    category: 'web',
    github: 'https://github.com/cyberpress/platform',
    demo: 'https://cyberpress.dev',
    featured: true
  },
  {
    id: 2,
    title: 'AI Chat Assistant',
    description: '基于 GPT-4 的智能对话助手，支持多模态交互',
    image: null,
    tags: ['React', 'OpenAI', 'Node.js', 'WebSocket'],
    category: 'ai',
    github: 'https://github.com/ai/chat-assistant',
    demo: 'https://chat-ai.dev',
    featured: true
  },
  {
    id: 3,
    title: 'Data Visualization Dashboard',
    description: '实时数据可视化仪表板，支持多种图表类型',
    image: null,
    tags: ['Vue.js', 'D3.js', 'ECharts', 'WebSocket'],
    category: 'data',
    github: 'https://github.com/data/viz-dashboard',
    demo: 'https://dataviz.dev',
    featured: false
  },
  {
    id: 4,
    title: 'E-commerce Platform',
    description: '现代化的电商平台，支持多商户和即时通讯',
    image: null,
    tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
    category: 'web',
    github: 'https://github.com/ecom/platform',
    demo: 'https://ecom.dev',
    featured: false
  },
  {
    id: 5,
    title: 'Mobile App UI Kit',
    description: '跨平台移动应用 UI 组件库',
    image: null,
    tags: ['React Native', 'TypeScript', 'Storybook'],
    category: 'mobile',
    github: 'https://github.com/mobile/ui-kit',
    demo: 'https://mobile-ui.dev',
    featured: false
  },
  {
    id: 6,
    title: 'DevOps Automation Tools',
    description: 'CI/CD 自动化工具集，提升开发效率',
    image: null,
    tags: ['Docker', 'Kubernetes', 'GitHub Actions'],
    category: 'devops',
    github: 'https://github.com/devops/tools',
    demo: null,
    featured: false
  }
];

const categories = [
  { id: 'all', name: '全部', icon: '🎯' },
  { id: 'web', name: 'Web 应用', icon: '🌐' },
  { id: 'ai', name: 'AI/ML', icon: '🤖' },
  { id: 'data', name: '数据可视化', icon: '📊' },
  { id: 'mobile', name: '移动应用', icon: '📱' },
  { id: 'devops', name: 'DevOps', icon: '⚙️' }
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="text-white">我们的</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
                作品集
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              探索我们的创新项目，见证技术与创意的完美融合
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { label: '完成项目', value: '50+' },
                { label: '活跃客户', value: '30+' },
                { label: '代码贡献', value: '100K+' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="cyber-card p-4 text-center"
                >
                  <div className="text-2xl font-bold text-cyber-cyan">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 border-y border-cyber-border/50 sticky top-0 bg-cyber-dark/95 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50'
                        : 'bg-cyber-card text-gray-400 border border-cyber-border/50 hover:border-cyber-cyan/30'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-card border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card overflow-hidden group hover:border-cyber-cyan/50 transition-all"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-cyber-pink text-white text-xs font-bold rounded-full">
                    精选
                  </div>
                )}

                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-6xl">🚀</div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs rounded border border-cyber-cyan/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 cyber-button text-sm py-2 text-center"
                      >
                        <Github className="w-4 h-4 inline mr-1" />
                        代码
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 cyber-button text-sm py-2 text-center"
                      >
                        <ExternalLink className="w-4 h-4 inline mr-1" />
                        演示
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">没有找到项目</h3>
              <p className="text-gray-400">尝试调整搜索条件或选择其他分类</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-12 border border-cyber-purple/30"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              有项目想法？
            </h2>
            <p className="text-gray-400 mb-8">
              让我们一起将您的想法变为现实。联系我们讨论您的下一个项目。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CyberButton variant="primary" size="lg" icon={<Github className="w-5 h-5" />}>
                查看GitHub
              </CyberButton>
              <CyberButton variant="outline" size="lg">
                联系我们
              </CyberButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
