'use client';

/**
 * CyberPress Platform - Homepage
 * 赛博朋克风格博客平台首页
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Zap,
  Github,
  Twitter,
  Mail,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { ArticleCard } from '@/components/blog/ArticleCard';

// 模拟数据 - 后续会从 WordPress API 获取
const featuredPosts = [
  {
    id: 1,
    title: '探索赛博朋克设计美学',
    excerpt: '从《银翼杀手》到《赛博朋克2077》，深入解析赛博朋克风格的视觉元素与设计原则。',
    slug: 'exploring-cyberpunk-aesthetics',
    date: '2024-03-01',
    readTime: 8,
    category: { name: '设计', slug: 'design', color: '#00f0ff' },
    author: { name: 'CyberPress Team', avatar: null },
    featuredImage: null,
    tags: ['设计', '赛博朋克', 'UI/UX'],
  },
  {
    id: 2,
    title: 'Next.js 14 完全指南',
    excerpt: 'Server Components、App Router、Server Actions - 全面掌握 Next.js 14 的革命性特性。',
    slug: 'nextjs-14-complete-guide',
    date: '2024-02-28',
    readTime: 12,
    category: { name: '技术', slug: 'tech', color: '#9d00ff' },
    author: { name: 'Tech Editor', avatar: null },
    featuredImage: null,
    tags: ['Next.js', 'React', 'Web开发'],
  },
  {
    id: 3,
    title: '构建无头 CMS 博客系统',
    excerpt: '使用 WordPress 作为无头 CMS，Next.js 构建前端，打造现代化的内容管理解决方案。',
    slug: 'building-headless-cms-blog',
    date: '2024-02-25',
    readTime: 10,
    category: { name: '教程', slug: 'tutorial', color: '#ff0080' },
    author: { name: 'Dev Team', avatar: null },
    featuredImage: null,
    tags: ['WordPress', 'Headless CMS', 'Next.js'],
  },
];

const latestPosts = [
  {
    id: 4,
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握条件类型、映射类型、模板字面量类型等高级特性。',
    slug: 'typescript-advanced-types',
    date: '2024-03-02',
    readTime: 6,
    category: { name: '技术', slug: 'tech', color: '#9d00ff' },
    author: { name: 'TypeScript Master', avatar: null },
    featuredImage: null,
    tags: ['TypeScript', '前端'],
  },
  {
    id: 5,
    title: 'Framer Motion 动画艺术',
    excerpt: '创建令人惊叹的动画效果，提升用户体验。',
    slug: 'framer-motion-animations',
    date: '2024-03-01',
    readTime: 7,
    category: { name: '设计', slug: 'design', color: '#00f0ff' },
    author: { name: 'Motion Designer', avatar: null },
    featuredImage: null,
    tags: ['动画', 'React', 'Framer Motion'],
  },
  {
    id: 6,
    title: 'Tailwind CSS 最佳实践',
    excerpt: '构建可维护、可扩展的 Tailwind CSS 项目。',
    slug: 'tailwind-css-best-practices',
    date: '2024-02-28',
    readTime: 5,
    category: { name: '技术', slug: 'tech', color: '#9d00ff' },
    author: { name: 'CSS Expert', avatar: null },
    featuredImage: null,
    tags: ['Tailwind CSS', 'CSS', '前端'],
  },
];

const stats = [
  { label: '文章', value: '100+', icon: Sparkles },
  { label: '分类', value: '20+', icon: TrendingUp },
  { label: '标签', value: '50+', icon: Zap },
];

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-display font-bold"
              >
                <span className="text-cyber-cyan group-hover:text-cyber-pink transition-colors">
                  CYBER
                </span>
                <span className="text-cyber-purple group-hover:text-cyber-cyan transition-colors">
                  PRESS
                </span>
              </motion.div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/blog"
                className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors"
              >
                博客
              </Link>
              <Link
                href="/portfolio"
                className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors"
              >
                作品集
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors"
              >
                关于
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors"
              >
                联系
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Link href="/search">
                <CyberButton variant="ghost" size="sm">
                  搜索
                </CyberButton>
              </Link>
              <Link href="/newsletter">
                <CyberButton variant="primary" size="sm">
                  订阅
                </CyberButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-pink/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                <span className="text-sm text-cyber-cyan">
                  探索科技与美学的无限边界
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                <span className="text-white">欢迎来到</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-300% animate-gradient">
                  CyberPress
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                一个融合赛博朋克美学与现代技术的博客平台。探索前沿技术、设计趋势与创意灵感的汇聚之地。
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/blog">
                  <CyberButton variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    开始阅读
                  </CyberButton>
                </Link>
                <Link href="/about">
                  <CyberButton variant="outline" size="lg">
                    了解更多
                  </CyberButton>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-cyber-border">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <stat.icon className="w-6 h-6 text-cyber-cyan mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Featured Post Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="cyber-card p-6 border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all duration-300">
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyber-pink text-white text-xs font-bold rounded-full">
                  精选
                </div>

                <Link href={`/blog/${featuredPosts[0].slug}`}>
                  <div className="mb-4">
                    <span
                      className="inline-block px-3 py-1 text-xs font-mono rounded-full"
                      style={{
                        backgroundColor: `${featuredPosts[0].category.color}20`,
                        color: featuredPosts[0].category.color,
                        border: `1px solid ${featuredPosts[0].category.color}40`,
                      }}
                    >
                      {featuredPosts[0].category.name}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 hover:text-cyber-cyan transition-colors">
                    {featuredPosts[0].title}
                  </h2>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {featuredPosts[0].excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPosts[0].readTime} 分钟
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 px-4 bg-cyber-dark/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">精选文章</h2>
              <p className="text-gray-400">深度内容，值得一读</p>
            </div>
            <Link href="/blog?featured=true">
              <CyberButton variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
                查看全部
              </CyberButton>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ArticleCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">最新发布</h2>
              <p className="text-gray-400">保持更新，持续学习</p>
            </div>
            <Link href="/blog">
              <CyberButton variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
                查看全部
              </CyberButton>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ArticleCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">探索分类</h2>
            <p className="text-gray-400">按主题浏览文章</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '技术', slug: 'tech', color: 'cyber-cyan', icon: '💻' },
              { name: '设计', slug: 'design', color: 'cyber-purple', icon: '🎨' },
              { name: '教程', slug: 'tutorial', color: 'cyber-pink', icon: '📚' },
              { name: '随笔', slug: 'thoughts', color: 'cyber-yellow', icon: '✨' },
            ].map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="block cyber-card p-6 text-center group"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-8 md:p-12 text-center border border-cyber-cyan/30"
          >
            <div className="w-16 h-16 bg-cyber-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-cyber-cyan" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">订阅我们的新闻通讯</h2>
            <p className="text-gray-400 mb-8">
              每周精选文章、技术趋势和设计灵感，直接发送到您的收件箱
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
                required
              />
              <CyberButton type="submit" variant="primary">
                订阅
              </CyberButton>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">
                <span className="text-cyber-cyan">CYBER</span>
                <span className="text-cyber-purple">PRESS</span>
              </h3>
              <p className="text-gray-400 text-sm">
                赛博朋克风格的现代博客平台
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-cyber-cyan text-sm">博客</Link></li>
                <li><Link href="/portfolio" className="text-gray-400 hover:text-cyber-cyan text-sm">作品集</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-cyber-cyan text-sm">关于</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-cyber-cyan text-sm">联系</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-semibold mb-4">分类</h4>
              <ul className="space-y-2">
                <li><Link href="/categories/tech" className="text-gray-400 hover:text-cyber-cyan text-sm">技术</Link></li>
                <li><Link href="/categories/design" className="text-gray-400 hover:text-cyber-cyan text-sm">设计</Link></li>
                <li><Link href="/categories/tutorial" className="text-gray-400 hover:text-cyber-cyan text-sm">教程</Link></li>
                <li><Link href="/categories/thoughts" className="text-gray-400 hover:text-cyber-cyan text-sm">随笔</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4">关注我们</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-cyber-border text-center text-sm text-gray-500">
            <p>© 2024 CyberPress. 由 AI 开发团队构建 🤖</p>
            <p className="mt-2">
              当前时间: {currentTime.toLocaleString('zh-CN')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
