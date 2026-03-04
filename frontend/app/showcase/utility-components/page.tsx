'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FAQ,
  FAQWithCategories,
  Breadcrumb,
  BackToTop,
  BackToTopWithCircularProgress,
  LanguageSwitcher,
  ThemeSwitcher,
  ThemeToggle,
  TagCloud,
  TagCloud3D,
  TagInput,
  ShareButtons,
  NativeShare,
  ArticleShare,
  Pagination,
  SimplePagination,
  LoadMorePagination,
  PageJumper,
  defaultFAQItems,
  defaultFAQCategories,
  defaultLanguages,
  platformPresets,
} from '@/components/index-new-components';
import { Shield, Globe, Palette, Tag, Share2, ArrowUpDown } from 'lucide-react';

export default function UtilityComponentsShowcase() {
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN');
  const [tags, setTags] = useState(['React', 'TypeScript', 'Next.js']);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const demoTags = [
    { id: '1', name: 'React', slug: 'react', count: 42, color: 'cyan' as const },
    { id: '2', name: 'TypeScript', slug: 'typescript', count: 38, color: 'purple' as const },
    { id: '3', name: 'Next.js', slug: 'nextjs', count: 35, color: 'pink' as const },
    { id: '4', name: 'Tailwind CSS', slug: 'tailwind', count: 28, color: 'green' as const },
    { id: '5', name: 'Framer Motion', slug: 'framer', count: 25, color: 'yellow' as const },
    { id: '6', name: 'Vue.js', slug: 'vue', count: 22, color: 'cyan' as const },
    { id: '7', name: 'Angular', slug: 'angular', count: 18, color: 'purple' as const },
    { id: '8', name: 'Svelte', slug: 'svelte', count: 15, color: 'pink' as const },
    { id: '9', name: 'Node.js', slug: 'node', count: 32, color: 'green' as const },
    { id: '10', name: 'Python', slug: 'python', count: 29, color: 'yellow' as const },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Back to Top Buttons */}
      <BackToTop />
      <BackToTopWithCircularProgress position="bottom-left" color="purple" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-cyber-cyan mb-4">
            实用组件展示
          </h1>
          <p className="text-xl text-gray-400">
            增强用户体验的实用组件集合
          </p>
        </motion.div>

        {/* Breadcrumb */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-cyber-cyan/50 rounded-lg p-6 bg-cyber-dark/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              面包屑导航
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">自动生成路径：</p>
                <Breadcrumb />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">自定义路径：</p>
                <Breadcrumb
                  items={[
                    { label: '首页', href: '/', icon: <Shield className="w-4 h-4" /> },
                    { label: '展示', href: '/showcase' },
                    { label: '实用组件', href: '/showcase/utility-components' },
                  ]}
                  color="purple"
                  showHome={false}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-cyber-purple/50 rounded-lg p-6 bg-cyber-dark/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-cyber-purple mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              常见问题（FAQ）
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-400 mb-4">基础 FAQ：</p>
                <FAQ items={defaultFAQItems} color="purple" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-4">分类 FAQ：</p>
                <FAQWithCategories categories={defaultFAQCategories} color="purple" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Language & Theme Switchers */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-cyber-cyan/50 rounded-lg p-6 bg-cyber-dark/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6" />
              语言与主题切换器
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">下拉菜单：</p>
                  <LanguageSwitcher
                    languages={defaultLanguages}
                    currentLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    color="cyan"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">按钮组：</p>
                  <LanguageSwitcher
                    languages={defaultLanguages.slice(0, 4)}
                    currentLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    displayType="buttons"
                    color="cyan"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">主题切换：</p>
                  <ThemeSwitcher color="cyan" displayType="buttons" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">简单切换按钮：</p>
                  <ThemeToggle size="md" color="cyan" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tag Cloud */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-2 border-cyber-pink/50 rounded-lg p-6 bg-cyber-dark/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-cyber-pink mb-4 flex items-center gap-2">
              <Tag className="w-6 h-6" />
              标签云
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">云状布局：</p>
                <TagCloud tags={demoTags} layout="cloud" color="pink" showCount />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">网格布局：</p>
                <TagCloud tags={demoTags} layout="grid" color="pink" showCount />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">标签输入：</p>
                <TagInput tags={tags} onTagsChange={setTags} maxTags={10} color="pink" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Share Buttons */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-2 border-cyber-green/50 rounded-lg p-6 bg-cyber-dark/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-cyber-green mb-4 flex items-center gap-2">
              <Share2 className="w-6 h-6" />
              分享按钮
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">水平布局：</p>
                <ShareButtons
                  url="https://cyberpress.dev"
                  title="CyberPress Platform"
                  description="一个现代化的赛博朋克风格博客平台"
                  platforms={platformPresets.social}
                  color="green"
                  layout="horizontal"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">垂直布局：</p>
                <ShareButtons
                  url="https://cyberpress.dev"
                  title="CyberPress Platform"
                  platforms={platformPresets.basic}
                  color="green"
                  layout="vertical"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">下拉菜单：</p>
                <ShareButtons
                  url="https://cyberpress.dev"
                  title="CyberPress Platform"
                  platforms={platformPresets.all}
                  color="green"
                  layout="dropdown"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">文章内联分享：</p>
                <ArticleShare
                  url="https://cyberpress.dev/blog/example"
                  title="示例文章标题"
                  description="这是一篇示例文章的描述"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pagination */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-2 border-cyber-cyan/50 rounded-lg p-6 bg-cyber-dark/50 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <ArrowUpDown className="w-6 h-6" />
              分页组件
            </h2>
            <div className="space-y-8">
              <div>
                <p className="text-sm text-gray-400 mb-2">完整分页：</p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                  color="cyan"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">简化分页：</p>
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                  color="cyan"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">加载更多：</p>
                <LoadMorePagination
                  hasNextPage={hasMore}
                  onLoadMore={() => {
                    console.log('Loading more...');
                    setHasMore(false);
                  }}
                  color="cyan"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">页码跳转：</p>
                <PageJumper
                  currentPage={currentPage}
                  totalPages={10}
                  onJump={(page) => setCurrentPage(page)}
                  color="cyan"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Usage Guide */}
        <section className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-2 border-white/20 rounded-lg p-6 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-4">使用指南</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                所有组件都支持以下特性：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>🎨 <strong className="text-cyber-cyan">多种颜色主题</strong>：cyan, purple, pink, green</li>
                <li>✨ <strong className="text-cyber-purple">多种变体风格</strong>：neon, holographic, minimal</li>
                <li>📱 <strong className="text-cyber-pink">响应式设计</strong>：自动适配所有设备</li>
                <li>🔧 <strong className="text-cyber-green">TypeScript 支持</strong>：完整的类型定义</li>
                <li>🎭 <strong className="text-cyber-yellow">Framer Motion 动画</strong>：流畅的交互体验</li>
              </ul>
              <div className="mt-6 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-cyan/30">
                <code className="text-sm text-cyber-cyan">
                  import {'{'} FAQ, Breadcrumb, ShareButtons, Pagination {'}'} from '@/components/index-new-components';
                </code>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
