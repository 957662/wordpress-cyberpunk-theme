import { Metadata } from 'next';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { TeamMembers, Timeline, Skills } from '@/components/about';
import { GlitchText } from '@/components/effects/GlitchText';
import { motion } from 'framer-motion';
import { Rocket, Heart, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: '关于 - CyberPress Platform',
  description: '了解更多关于 CyberPress Platform 的信息',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border-2 border-cyber-cyan"
            >
              <Rocket className="w-10 h-10 text-cyber-cyan" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              <GlitchText text="关于我们" />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
            >
              致力于打造最优秀的赛博朋克风格博客平台
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 使命陈述 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="p-8 md:p-12 rounded-2xl border border-cyber-border bg-cyber-card/30 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                我们的使命
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                CyberPress Platform 是一个基于现代化技术栈构建的博客平台，
                我们致力于为用户提供最佳的写作和阅读体验。
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                平台采用赛博朋克风格设计，融合未来科技感与极致用户体验。
                我们相信，技术应该服务于创意，而不是限制它。
              </p>

              {/* 核心价值 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Zap, title: '创新', desc: '不断探索新技术' },
                  { icon: Heart, title: '用户至上', desc: '以用户体验为核心' },
                  { icon: Rocket, title: '高性能', desc: '追求极致速度' },
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-xl border border-cyber-border bg-cyber-muted/50 hover:border-cyber-cyan/50 transition-all"
                  >
                    <value.icon className="w-8 h-8 text-cyber-cyan mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-400">{value.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 技术栈 */}
      <Skills />

      {/* 发展历程 */}
      <Timeline />

      {/* 团队成员 */}
      <TeamMembers />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl border border-cyber-border bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10 backdrop-blur-sm"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              加入我们的旅程
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              无论你是开发者、设计师，还是内容创作者，
              都欢迎加入我们，一起创造更美好的未来。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-cyber-dark font-semibold shadow-lg shadow-cyber-cyan/20"
              >
                联系我们
              </motion.a>
              <motion.a
                href="/blog"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan rounded-lg font-semibold hover:bg-cyber-cyan/10 transition-colors"
              >
                阅读博客
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
