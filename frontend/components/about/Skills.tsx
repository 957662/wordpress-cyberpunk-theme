/**
 * 技能栈展示组件
 * 动态展示项目使用的技术
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  icon: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  color: string;
  description?: string;
}

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: '前端技术',
    description: '构建现代化用户界面',
    icon: '🎨',
    skills: [
      { name: 'React', level: 95, color: '#61DAFB', description: '组件化开发' },
      { name: 'Next.js', level: 90, color: '#000000', description: 'SSR/SSG框架' },
      { name: 'TypeScript', level: 85, color: '#3178C6', description: '类型安全' },
      { name: 'Tailwind CSS', level: 92, color: '#06B6D4', description: '原子化CSS' },
      { name: 'Framer Motion', level: 80, color: '#FF0080', description: '动画效果' },
    ],
  },
  {
    id: 'backend',
    name: '后端技术',
    description: '强大的服务端支持',
    icon: '⚙️',
    skills: [
      { name: 'WordPress', level: 88, color: '#21759B', description: '内容管理' },
      { name: 'Node.js', level: 82, color: '#339933', description: '服务端运行时' },
      { name: 'REST API', level: 90, color: '#009688', description: 'API设计' },
      { name: 'JWT', level: 78, color: '#F59E0B', description: '身份认证' },
    ],
  },
  {
    id: 'tools',
    name: '开发工具',
    description: '提升开发效率',
    icon: '🛠️',
    skills: [
      { name: 'Git', level: 90, color: '#F05032', description: '版本控制' },
      { name: 'Docker', level: 75, color: '#2496ED', description: '容器化部署' },
      { name: 'VS Code', level: 95, color: '#007ACC', description: '代码编辑器' },
      { name: 'Figma', level: 85, color: '#F24E1E', description: '界面设计' },
    ],
  },
  {
    id: 'concepts',
    name: '核心概念',
    description: '重要的技术理念',
    icon: '💡',
    skills: [
      { name: 'Headless CMS', level: 92, color: '#00F0FF', description: '无头架构' },
      { name: 'JAMstack', level: 88, color: '#9D00FF', description: '现代Web架构' },
      { name: 'PWA', level: 80, color: '#FF0080', description: '渐进式Web应用' },
      { name: 'SSR/SSG', level: 90, color: '#F0FF00', description: '服务端渲染' },
    ],
  },
];

interface SkillBarProps {
  skill: Skill;
  delay: number;
}

function SkillBar({ skill, delay }: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: skill.color }}
          />
          {skill.name}
        </span>
        <span className="text-sm text-gray-400">{skill.level}%</span>
      </div>

      {/* 进度条容器 */}
      <div className="h-2 bg-cyber-muted rounded-full overflow-hidden border border-cyber-border">
        {/* 进度条 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${skill.level}%` : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: skill.color }}
        >
          {/* 发光效果 */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
              animation: 'shimmer 2s infinite',
            }}
          />
        </motion.div>
      </div>

      {/* 描述 */}
      {skill.description && (
        <p className="text-xs text-gray-500">{skill.description}</p>
      )}
    </div>
  );
}

export function Skills() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].id);

  const activeCategoryData = skillCategories.find(
    (cat) => cat.id === activeCategory
  );

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            技术栈
          </h2>
          <p className="text-gray-400 text-lg">
            采用最新、最强大的技术构建
          </p>
        </motion.div>

        {/* 分类选择器 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {skillCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-all',
                'flex items-center gap-2',
                activeCategory === category.id
                  ? 'bg-cyber-cyan text-cyber-dark shadow-neon-cyan'
                  : 'bg-cyber-muted text-gray-300 border border-cyber-border hover:border-cyber-cyan'
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* 技能详情 */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          {/* 分类信息 */}
          <div className="text-center mb-8">
            <motion.div
              key={`icon-${activeCategory}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-6xl mb-4"
            >
              {activeCategoryData?.icon}
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              {activeCategoryData?.name}
            </h3>
            <p className="text-gray-400">{activeCategoryData?.description}</p>
          </div>

          {/* 技能条 */}
          <div className="space-y-6">
            {activeCategoryData?.skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} delay={index * 100} />
            ))}
          </div>
        </motion.div>

        {/* 技术统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: '技术栈', value: '20+', color: 'cyber-cyan' },
            { label: '开源依赖', value: '50+', color: 'cyber-purple' },
            { label: '代码覆盖率', value: '90%+', color: 'cyber-pink' },
            { label: '性能评分', value: '95+', color: 'cyber-yellow' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm text-center group"
            >
              <div
                className={`text-4xl font-display font-bold text-${stat.color} mb-2 group-hover:scale-110 transition-transform`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
