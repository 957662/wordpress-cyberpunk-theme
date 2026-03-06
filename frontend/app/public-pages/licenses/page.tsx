/**
 * 开源许可证页面
 */

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Code, Heart, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: '开源许可证 | CyberPress',
  description: 'CyberPress 使用的开源项目和许可证',
};

const licenses = [
  {
    name: 'Next.js',
    version: '14.2.0',
    license: 'MIT',
    description: 'React 框架，用于构建 Web 应用',
    url: 'https://github.com/vercel/next.js',
  },
  {
    name: 'React',
    version: '18.2.0',
    license: 'MIT',
    description: '用于构建用户界面的 JavaScript 库',
    url: 'https://github.com/facebook/react',
  },
  {
    name: 'TypeScript',
    version: '5.4.0',
    license: 'Apache-2.0',
    description: 'JavaScript 的超集，添加了类型系统',
    url: 'https://github.com/microsoft/TypeScript',
  },
  {
    name: 'Tailwind CSS',
    version: '3.4.0',
    license: 'MIT',
    description: '实用优先的 CSS 框架',
    url: 'https://github.com/tailwindlabs/tailwindcss',
  },
  {
    name: 'Framer Motion',
    version: '11.0.0',
    license: 'MIT',
    description: 'React 的动画库',
    url: 'https://github.com/framer/motion',
  },
  {
    name: 'Zustand',
    version: '4.5.0',
    license: 'MIT',
    description: '小型、快速且可扩展的状态管理解决方案',
    url: 'https://github.com/pmndrs/zustand',
  },
  {
    name: 'TanStack Query',
    version: '5.28.0',
    license: 'MIT',
    description: '强大的数据同步和状态管理库',
    url: 'https://github.com/TanStack/query',
  },
  {
    name: 'Lucide React',
    version: '0.363.0',
    license: 'ISC',
    description: '基于 Feather 图标的 React 图标库',
    url: 'https://github.com/lucide-icons/lucide',
  },
  {
    name: 'React Hook Form',
    version: '7.49.0',
    license: 'MIT',
    description: '高性能、灵活的表单库',
    url: 'https://github.com/react-hook-form/react-hook-form',
  },
  {
    name: 'Zod',
    version: '3.22.0',
    license: 'MIT',
    description: 'TypeScript-first 的模式验证库',
    url: 'https://github.com/colinhacks/zod',
  },
  {
    name: 'date-fns',
    version: '3.6.0',
    license: 'MIT',
    description: '现代 JavaScript 日期工具库',
    url: 'https://github.com/date-fns/date-fns',
  },
  {
    name: 'Axios',
    version: '1.6.0',
    license: 'MIT',
    description: '基于 Promise 的 HTTP 客户端',
    url: 'https://github.com/axios/axios',
  },
  {
    name: 'React Hot Toast',
    version: '2.4.0',
    license: 'MIT',
    description: '优雅的通知组件',
    url: 'https://github.com/timolins/react-hot-toast',
  },
  {
    name: 'next-themes',
    version: '0.3.0',
    license: 'MIT',
    description: 'Next.js 的主题切换 Hook',
    url: 'https://github.com/pacocoursey/next-themes',
  },
];

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center"
            >
              <Code className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              开源许可证
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              CyberPress 的构建离不开这些优秀的开源项目。
              我们感谢所有贡献者的辛勤工作！
            </p>
          </div>

          {/* Thank You Card */}
          <Card variant="neon" glowColor="purple" className="mb-8">
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-cyber-pink mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                感谢开源社区
              </h2>
              <p className="text-gray-300">
                开源让世界变得更好，我们致力于回馈社区
              </p>
            </div>
          </Card>

          {/* Licenses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {licenses.map((lib, index) => (
              <motion.div
                key={lib.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card hover>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1">
                        {lib.name}
                      </h3>
                      <p className="text-sm text-gray-500">v{lib.version}</p>
                    </div>
                    <span className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs font-mono rounded border border-cyber-cyan/30">
                      {lib.license}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {lib.description}
                  </p>
                  <a
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    查看项目
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="mt-8">
            <h3 className="text-xl font-display font-bold text-cyber-cyan mb-4">
              关于许可证
            </h3>
            <div className="space-y-3 text-gray-300">
              <p>
                CyberPress 本身采用{' '}
                <span className="text-cyber-cyan font-semibold">MIT 许可证</span>{' '}
                开源，这意味着您可以自由地使用、修改和分发本项目的代码。
              </p>
              <p>
                我们使用的第三方库各自遵循其原有的许可证条款。
                如果您使用本项目的代码，请确保遵守相关许可证的要求。
              </p>
              <p className="text-sm text-gray-400">
                完整的许可证文本可以在每个项目的代码仓库中找到。
              </p>
            </div>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center text-gray-500 text-sm mt-12"
          >
            © {new Date().getFullYear()} CyberPress. Built with{' '}
            <Heart className="w-4 h-4 inline text-cyber-pink" /> using Open Source
          </motion.p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
