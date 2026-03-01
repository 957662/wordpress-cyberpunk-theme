/**
 * 关于页面
 */

import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: '关于',
  description: '关于 CyberPress 赛博朋克博客平台',
};

const skills = [
  { name: 'Next.js', level: 90, color: 'cyan' },
  { name: 'TypeScript', level: 85, color: 'purple' },
  { name: 'WordPress', level: 80, color: 'pink' },
  { name: 'Tailwind CSS', level: 95, color: 'yellow' },
  { name: 'Framer Motion', level: 75, color: 'green' },
  { name: 'React Query', level: 85, color: 'cyan' },
];

const stats = [
  { value: '100+', label: '博客文章' },
  { value: '50+', label: '开源项目' },
  { value: '1000+', label: 'GitHub Stars' },
  { value: '5000+', label: '月访问量' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="primary" className="mb-4">关于我们</Badge>
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6">
              <span className="text-glow-cyan text-cyber-cyan">CYBER</span>
              <span className="text-glow-purple text-cyber-purple">PRESS</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              打造最酷的赛博朋克风格博客平台
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} variant="neon" glowColor="cyan" className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                >
                  <div className="font-display font-bold text-4xl text-cyber-cyan mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              </Card>
            ))}
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card variant="glass" className="p-8">
              <h2 className="font-display font-bold text-3xl mb-6 text-glow-cyan">
                我们的故事
              </h2>
              <div className="prose prose-invert max-w-none space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  CyberPress 诞生于对赛博朋克美学和现代 Web 技术的热爱。
                  我们相信，技术博客不应该只是枯燥的文字堆砌，而应该是一场视觉盛宴。
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  通过结合 WordPress 的强大内容管理能力和 Next.js 的极致性能，
                  我们创造了一个既美观又实用的博客平台。每一个像素都经过精心设计，
                  每一行代码都追求极致性能。
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  我们的目标是让技术分享变得更加有趣，让每个访问者都能感受到
                  赛博朋克文化的独特魅力。
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card variant="glass" className="p-8">
              <h2 className="font-display font-bold text-3xl mb-8 text-glow-purple">
                技术栈
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="mb-2">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">{skill.name}</span>
                        <span className="text-cyber-cyan">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-cyber-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full bg-gradient-to-r from-cyber-${skill.color} to-cyber-${skill.color}/50`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-center text-glow-pink">
              平台特色
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: '赛博朋克设计',
                  description: '独特的视觉风格，霓虹色彩与故障艺术完美融合',
                  icon: '🎨',
                },
                {
                  title: '极致性能',
                  description: 'Next.js 14 + React Query，毫秒级页面加载',
                  icon: '⚡',
                },
                {
                  title: '响应式布局',
                  description: '完美适配各种设备，提供一致的用户体验',
                  icon: '📱',
                },
                {
                  title: '流畅动画',
                  description: 'Framer Motion 驱动的丝滑交互体验',
                  icon: '✨',
                },
                {
                  title: 'SEO 优化',
                  description: '内置 SEO 最佳实践，助力内容排名',
                  icon: '🔍',
                },
                {
                  title: '易于扩展',
                  description: '模块化架构，轻松添加新功能',
                  icon: '🔧',
                },
              ].map((feature, index) => (
                <Card key={feature.title} hover className="text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
