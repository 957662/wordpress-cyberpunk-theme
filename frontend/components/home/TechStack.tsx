'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Layout, Server, Zap, Shield } from 'lucide-react';

const techCategories = [
  {
    title: '前端框架',
    icon: Layout,
    items: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: '状态管理',
    icon: Zap,
    items: ['Zustand', 'React Query', 'React Hook Form'],
  },
  {
    title: '动画效果',
    icon: Code2,
    items: ['Framer Motion', 'GSAP', 'CSS Animations'],
  },
  {
    title: '后端服务',
    icon: Server,
    items: ['WordPress REST API', 'Node.js', 'JWT Auth'],
  },
  {
    title: '数据库',
    icon: Database,
    items: ['MySQL', 'Redis', 'PostgreSQL'],
  },
  {
    title: '部署运维',
    icon: Shield,
    items: ['Docker', 'Vercel', 'Nginx'],
  },
];

export function TechStack() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* 背景效果 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-cyber-card-bg/30" />
        <div className="absolute inset-0 bg-[url('/patterns/scanlines.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-cyan">
            技术栈
          </h2>
          <p className="text-cyber-text-secondary text-lg max-w-2xl mx-auto">
            采用业界最新技术，打造极致性能体验
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cyber-card group"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyber-card-bg border border-cyber-cyan/30">
                    <category.icon className="w-6 h-6 text-cyber-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-glow-cyan">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 rounded-lg bg-cyber-bg/50 border border-cyber-cyan/10 group-hover:border-cyber-cyan/30 transition-all duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                      <span className="text-cyber-text-secondary group-hover:text-cyber-cyan transition-colors duration-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 技术特性 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: '99.9%',
              subtitle: '正常运行时间',
              description: '企业级稳定性保障',
            },
            {
              title: '<100ms',
              subtitle: '页面响应时间',
              description: '极致加载速度',
            },
            {
              title: '100+',
              subtitle: '性能优化点',
              description: '全面性能提升',
            },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="cyber-card text-center p-8 group"
            >
              <div className="text-4xl font-bold text-glow-cyan mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.title}
              </div>
              <div className="text-cyber-cyan font-medium mb-2">
                {stat.subtitle}
              </div>
              <div className="text-cyber-text-secondary text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
