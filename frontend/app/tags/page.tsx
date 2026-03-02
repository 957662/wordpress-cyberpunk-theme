/**
 * Tags Page
 * 标签页面 - 显示所有文章标签
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { CyberTag } from '@/components/ui';

// 模拟标签数据
const mockTags = [
  { name: 'Next.js', count: 25, color: 'cyan' as const },
  { name: 'React', count: 32, color: 'purple' as const },
  { name: 'TypeScript', count: 18, color: 'pink' as const },
  { name: 'Tailwind CSS', count: 22, color: 'yellow' as const },
  { name: '赛博朋克', count: 12, color: 'cyan' as const },
  { name: 'UI/UX', count: 15, color: 'purple' as const },
  { name: '前端开发', count: 28, color: 'pink' as const },
  { name: 'WordPress', count: 9, color: 'yellow' as const },
  { name: 'Framer Motion', count: 11, color: 'cyan' as const },
  { name: '动画', count: 14, color: 'purple' as const },
  { name: '设计模式', count: 8, color: 'pink' as const },
  { name: '性能优化', count: 16, color: 'yellow' as const },
  { name: 'CSS', count: 20, color: 'cyan' as const },
  { name: 'JavaScript', count: 26, color: 'purple' as const },
  { name: 'Node.js', count: 13, color: 'pink' as const },
  { name: '数据库', count: 7, color: 'yellow' as const },
  { name: 'API', count: 19, color: 'cyan' as const },
  { name: 'REST', count: 10, color: 'purple' as const },
  { name: 'GraphQL', count: 6, color: 'pink' as const },
  { name: 'Docker', count: 8, color: 'yellow' as const },
  { name: 'DevOps', count: 5, color: 'cyan' as const },
  { name: '测试', count: 9, color: 'purple' as const },
  { name: 'Jest', count: 7, color: 'pink' as const },
  { name: 'Cypress', count: 4, color: 'yellow' as const },
];

export default function TagsPage() {
  // 按文章数量排序
  const sortedTags = [...mockTags].sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold">
                <span className="text-cyber-cyan">CYBER</span>
                <span className="text-cyber-purple">PRESS</span>
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/blog" className="text-sm text-gray-300 hover:text-cyber-cyan">
                博客
              </Link>
              <Link href="/tags" className="text-sm text-cyber-cyan">
                标签
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyber-cyan/20 rounded-lg">
              <Tag className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">标签云</h1>
              <p className="text-gray-400 mt-1">
                浏览所有 {mockTags.length} 个标签,发现感兴趣的内容
              </p>
            </div>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: '总标签数', value: mockTags.length, color: 'cyber-cyan' },
            { label: '最多文章', value: `${sortedTags[0]?.count || 0} 篇`, color: 'cyber-purple' },
            { label: '本月新增', value: '+5', color: 'cyber-pink' },
            { label: '活跃标签', value: '18', color: 'cyber-yellow' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="cyber-card bg-cyber-dark/50 border border-cyber-border/50 p-6 text-center"
            >
              <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tags Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card bg-cyber-dark/50 border border-cyber-border/50 p-8"
        >
          <div className="flex flex-wrap gap-3">
            {sortedTags.map((tag, index) => (
              <motion.div
                key={tag.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.02 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/tags/${tag.name}`}>
                  <CyberTag
                    variant="glow"
                    color={tag.color}
                    size="lg"
                  >
                    {tag.name}
                    <span className="ml-1 opacity-60">({tag.count})</span>
                  </CyberTag>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">热门标签</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sortedTags.slice(0, 6).map((tag, index) => (
              <motion.div
                key={tag.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <Link href={`/tags/${tag.name}`}>
                  <div className="cyber-card bg-cyber-dark/50 border border-cyber-border/30 hover:border-cyber-cyan/50 p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-${tag.color === 'cyan' ? 'cyber-cyan' : tag.color === 'purple' ? 'cyber-purple' : tag.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}`}
                      />
                      <span className="text-white group-hover:text-cyber-cyan transition-colors">
                        {tag.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {tag.count} 篇文章
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 CyberPress. 由 AI 开发团队构建 🤖</p>
        </div>
      </footer>
    </div>
  );
}
