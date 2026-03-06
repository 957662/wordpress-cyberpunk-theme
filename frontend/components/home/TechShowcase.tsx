/**
 * TechShowcase Component
 * 技术栈展示组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

const techStack = [
  {
    name: 'Next.js 14',
    version: '14.2',
    description: 'React 框架',
    icon: '⚡',
    color: 'from-white to-gray-300',
  },
  {
    name: 'React 18',
    version: '18.2',
    description: 'UI 库',
    icon: '⚛️',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    name: 'TypeScript',
    version: '5.4',
    description: '类型安全',
    icon: '📘',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Tailwind CSS',
    version: '3.4',
    description: '样式框架',
    icon: '🎨',
    color: 'from-cyan-400 to-teal-500',
  },
  {
    name: 'WordPress',
    version: '6.4',
    description: '后端 CMS',
    icon: '📝',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    name: 'GraphQL',
    version: 'Latest',
    description: 'API 查询',
    icon: '◈',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Framer Motion',
    version: '11.0',
    description: '动画库',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Zustand',
    version: '4.5',
    description: '状态管理',
    icon: '🔄',
    color: 'from-amber-500 to-orange-500',
  },
];

export const TechShowcase: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {techStack.map((tech, index) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5, scale: 1.05 }}
          className="relative group"
        >
          <div className="relative p-6 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-all duration-300">
            {/* Glow Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300`} />

            {/* Icon */}
            <div className="relative text-4xl mb-4">{tech.icon}</div>

            {/* Name */}
            <h3 className="relative text-lg font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors">
              {tech.name}
            </h3>

            {/* Version Badge */}
            <div className="relative inline-flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-cyber-muted border border-cyber-border rounded text-xs text-gray-400">
                {tech.version}
              </span>
            </div>

            {/* Description */}
            <p className="relative text-sm text-gray-500">
              {tech.description}
            </p>

            {/* Corner Accent */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyber-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TechShowcase;
