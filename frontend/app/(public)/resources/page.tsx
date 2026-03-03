/**
 * 资源页面
 * 展示有用的工具、库和资源
 */

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Book, Code, Palette, Zap, ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '资源 - CyberPress Platform',
  description: '有用的开发工具、设计资源和学习材料',
};

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  resources: Resource[];
}

interface Resource {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  featured?: boolean;
}

const resourceCategories: ResourceCategory[] = [
  {
    id: 'frontend',
    title: '前端开发',
    description: '现代化的前端技术和工具',
    icon: <Code className="w-6 h-6" />,
    color: 'cyber-cyan',
    resources: [
      {
        id: 'nextjs',
        name: 'Next.js',
        description: 'React 生产级框架，支持 SSR、SSG 和 API Routes',
        url: 'https://nextjs.org',
        tags: ['React', 'SSR', 'Framework'],
        featured: true,
      },
      {
        id: 'tailwind',
        name: 'Tailwind CSS',
        description: '原子化 CSS 框架，快速构建现代 UI',
        url: 'https://tailwindcss.com',
        tags: ['CSS', 'Utility-first'],
        featured: true,
      },
      {
        id: 'framer-motion',
        name: 'Framer Motion',
        description: '强大的 React 动画库',
        url: 'https://www.framer.com/motion/',
        tags: ['Animation', 'React'],
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        description: 'JavaScript 的超集，添加静态类型',
        url: 'https://www.typescriptlang.org',
        tags: ['Type Safety', 'JavaScript'],
      },
    ],
  },
  {
    id: 'design',
    title: '设计资源',
    description: 'UI/UX 设计工具和灵感',
    icon: <Palette className="w-6 h-6" />,
    color: 'cyber-purple',
    resources: [
      {
        id: 'figma',
        name: 'Figma',
        description: '协作式界面设计工具',
        url: 'https://www.figma.com',
        tags: ['UI Design', 'Collaboration'],
        featured: true,
      },
      {
        id: 'dribbble',
        name: 'Dribbble',
        description: '设计师社区和作品展示平台',
        url: 'https://dribbble.com',
        tags: ['Inspiration', 'Showcase'],
      },
      {
        id: 'coolors',
        name: 'Coolors',
        description: '快速生成配色方案',
        url: 'https://coolors.co',
        tags: ['Colors', 'Generator'],
      },
    ],
  },
  {
    id: 'learning',
    title: '学习资源',
    description: '提升编程技能的学习材料',
    icon: <Book className="w-6 h-6" />,
    color: 'cyber-pink',
    resources: [
      {
        id: 'mdn',
        name: 'MDN Web Docs',
        description: '权威的 Web 开发文档',
        url: 'https://developer.mozilla.org',
        tags: ['Documentation', 'Reference'],
        featured: true,
      },
      {
        id: 'freecodecamp',
        name: 'freeCodeCamp',
        description: '免费的编程学习平台',
        url: 'https://www.freecodecamp.org',
        tags: ['Learning', 'Certification'],
      },
      {
        id: 'css-tricks',
        name: 'CSS-Tricks',
        description: 'Web 开发技巧和教程',
        url: 'https://css-tricks.com',
        tags: ['CSS', 'Tutorials'],
      },
    ],
  },
  {
    id: 'tools',
    title: '开发工具',
    description: '提高开发效率的工具',
    icon: <Zap className="w-6 h-6" />,
    color: 'cyber-yellow',
    resources: [
      {
        id: 'vscode',
        name: 'VS Code',
        description: '强大的代码编辑器',
        url: 'https://code.visualstudio.com',
        tags: ['Editor', 'IDE'],
        featured: true,
      },
      {
        id: 'git',
        name: 'Git',
        description: '分布式版本控制系统',
        url: 'https://git-scm.com',
        tags: ['Version Control'],
      },
      {
        id: 'github',
        name: 'GitHub',
        description: '代码托管和协作平台',
        url: 'https://github.com',
        tags: ['Git', 'Hosting'],
      },
    ],
  },
];

function ResourceCard({ resource, color }: { resource: Resource; color: string }) {
  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5 }}
      className="group relative block p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm hover:border-cyber-cyan/50 transition-all"
    >
      {/* 特色标签 */}
      {resource.featured && (
        <div className="absolute top-4 right-4">
          <Star className="w-4 h-4 text-cyber-yellow fill-cyber-yellow" />
        </div>
      )}

      {/* 标题 */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
        {resource.name}
      </h3>

      {/* 描述 */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {resource.description}
      </p>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2">
        {resource.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded bg-cyber-muted text-gray-300 border border-cyber-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 外部链接图标 */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-4 h-4 text-cyber-cyan" />
      </div>
    </motion.a>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-cyber-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            资源库
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            精选的开发工具、设计资源和学习材料，
            帮助你更好地构建 Web 应用
          </p>
        </motion.div>

        {/* 资源分类 */}
        {resourceCategories.map((category, categoryIndex) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-16"
          >
            {/* 分类标题 */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-lg bg-${category.color}/10 text-${category.color}`}>
                {category.icon}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  {category.title}
                </h2>
                <p className="text-sm text-gray-400">{category.description}</p>
              </div>
            </div>

            {/* 资源网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.resources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ResourceCard resource={resource} color={category.color} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* 提交资源 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="p-8 rounded-2xl border border-cyber-border bg-cyber-card/30 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              发现了有用的资源？
            </h2>
            <p className="text-gray-400 mb-6">
              帮助我们改进这个资源列表，提交你觉得有用的工具和资料
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-cyber-dark font-semibold"
              >
                提交资源
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
