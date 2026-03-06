/**
 * 作品集页面
 */

import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: '作品集',
  description: '我的开源项目和个人作品展示',
};

// 模拟作品数据（实际应从 API 获取）
const portfolioItems = [
  {
    id: 1,
    title: 'CyberPress Platform',
    slug: 'cyberpress-platform',
    excerpt: '基于 WordPress + Next.js 的赛博朋克风格博客平台，融合未来科技感与极致用户体验。',
    description: '一个现代化的博客平台，采用 Headless CMS 架构',
    content: '<p>CyberPress 是一个基于 WordPress REST API 和 Next.js 14 构建的现代化博客平台。项目采用赛博朋克设计风格，提供了流畅的动画效果和极致的用户体验。</p>',
    featured_image: '/images/portfolio/cyberpress.jpg',
    technologies: ['Next.js', 'TypeScript', 'WordPress', 'Tailwind CSS', 'Framer Motion'],
    github_url: 'https://github.com',
    demo_url: 'https://demo.cyberpress.dev',
    featured: true,
    date: '2024-01-15',
    client: 'Open Source',
    role: 'Full Stack Developer',
    duration: '3 个月',
  },
  {
    id: 2,
    title: 'AI Chat Assistant',
    slug: 'ai-chat-assistant',
    excerpt: '智能聊天助手，支持多模态交互，基于 GPT-4 API 开发。',
    description: '下一代 AI 聊天应用',
    content: '<p>一个功能强大的 AI 聊天助手，支持文本、图像等多种输入方式。采用流式响应技术，提供实时的对话体验。</p>',
    featured_image: '/images/portfolio/ai-chat.jpg',
    technologies: ['React', 'OpenAI API', 'Node.js', 'MongoDB', 'Socket.io'],
    github_url: 'https://github.com',
    demo_url: 'https://ai-chat.demo',
    featured: true,
    date: '2024-02-01',
    role: 'Frontend Developer',
    duration: '2 个月',
  },
  {
    id: 3,
    title: 'E-Commerce Dashboard',
    slug: 'ecommerce-dashboard',
    excerpt: '电商管理后台，提供数据可视化、订单管理、库存追踪等功能。',
    description: '现代化的电商管理解决方案',
    content: '<p>一个功能完善的电商管理后台，包含数据可视化大屏、订单管理系统、库存追踪等功能。采用响应式设计，支持多终端访问。</p>',
    featured_image: '/images/portfolio/dashboard.jpg',
    technologies: ['Vue.js', 'TypeScript', 'ECharts', 'Express', 'PostgreSQL'],
    github_url: 'https://github.com',
    featured: false,
    date: '2024-01-20',
    role: 'Full Stack Developer',
    duration: '4 个月',
  },
  {
    id: 4,
    title: 'Mobile Fitness App',
    slug: 'fitness-app',
    excerpt: '健身追踪应用，支持运动记录、饮食管理、健康数据分析。',
    description: '你的私人健身教练',
    content: '<p>一款功能丰富的健身追踪应用，提供运动记录、饮食管理、健康数据分析等功能。使用 React Native 开发，支持 iOS 和 Android 平台。</p>',
    featured_image: '/images/portfolio/fitness.jpg',
    technologies: ['React Native', 'Redux', 'Firebase', 'HealthKit'],
    github_url: 'https://github.com',
    demo_url: 'https://apps.apple.com',
    featured: false,
    date: '2024-01-10',
    role: 'Mobile Developer',
    duration: '5 个月',
  },
  {
    id: 5,
    title: 'Real-time Collaboration Tool',
    slug: 'collaboration-tool',
    excerpt: '实时协作工具，支持多人在线编辑、视频会议、文件共享。',
    description: '团队协作的最佳选择',
    content: '<p>一个实时协作平台，支持多人同时编辑文档、在线视频会议、文件共享等功能。采用 WebRTC 技术实现低延迟的视频通信。</p>',
    featured_image: '/images/portfolio/collaboration.jpg',
    technologies: ['Next.js', 'Socket.io', 'WebRTC', 'AWS S3', 'Redis'],
    github_url: 'https://github.com',
    demo_url: 'https://collab.demo',
    featured: true,
    date: '2024-02-15',
    role: 'Full Stack Developer',
    duration: '6 个月',
  },
  {
    id: 6,
    title: 'Crypto Portfolio Tracker',
    slug: 'crypto-tracker',
    excerpt: '加密货币投资组合追踪器，实时更新价格，支持多个交易所。',
    description: '掌控你的数字资产',
    content: '<p>一个加密货币投资组合追踪工具，支持多个交易所的账户整合，实时更新价格，提供详细的投资分析和收益报告。</p>',
    featured_image: '/images/portfolio/crypto.jpg',
    technologies: ['React', 'TypeScript', 'Web3.js', 'GraphQL', 'PostgreSQL'],
    github_url: 'https://github.com',
    featured: false,
    date: '2024-01-25',
    role: 'Blockchain Developer',
    duration: '3 个月',
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6">
              <span className="text-glow-cyan text-cyber-cyan">作品</span>
              <span className="text-glow-purple text-cyber-purple">集</span>
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              <TypewriterText text="展示我的开源项目和个人作品" speed={50} />
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              这里收集了我开发和参与的各种项目，涵盖 Web 应用、移动应用、
              区块链等多个领域。每个项目都体现了对技术的不懈追求和对用户体验的极致关注。
            </p>
          </motion.div>

          {/* Portfolio Grid */}
          <PortfolioGrid items={portfolioItems} filter={true} />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-cyber-card border border-cyber-border rounded-lg">
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl mb-2">
                  有有趣的项目想法？
                </h3>
                <p className="text-gray-400">
                  让我们一起把想法变成现实
                </p>
              </div>
              <a
                href="mailto:hello@cyberpress.dev"
                className="px-6 py-3 bg-cyber-cyan text-cyber-dark font-medium rounded hover:bg-cyber-cyan/90 transition-colors whitespace-nowrap"
              >
                联系我
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
