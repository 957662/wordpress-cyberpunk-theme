'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

export function Hero() {
  return (
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

            <div className="flex flex-wrap gap-4 mb-12">
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
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-cyber-border">
              {[
                { label: '文章', value: '100+', icon: Sparkles },
                { label: '分类', value: '20+', icon: Zap },
                { label: '读者', value: '10K+', icon: Sparkles },
              ].map((stat) => (
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

          {/* Right: Decorative Element */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="cyber-card p-8 border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all duration-300">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyber-pink text-white text-xs font-bold rounded-full">
                热门
              </div>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-xs font-mono rounded-full bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40">
                  精选内容
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                探索赛博朋克设计美学
              </h2>

              <p className="text-gray-400 mb-6">
                从《银翼杀手》到《赛博朋克2077》，深入解析赛博朋克风格的视觉元素与设计原则。
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">2024-03-01</span>
                <Link
                  href="/blog/exploring-cyberpunk-aesthetics"
                  className="text-cyber-cyan hover:text-cyber-purple transition-colors flex items-center gap-2"
                >
                  阅读更多
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
