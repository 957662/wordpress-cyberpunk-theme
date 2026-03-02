'use client';

/**
 * CategoriesGrid - 分类网格组件
 *
 * 功能特性：
 * - 网格布局
 * - 悬停动画
 * - 图标显示
 * - 文章数量
 * - 响应式设计
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  count?: number;
}

interface CategoriesGridProps {
  categories?: Category[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
}

const defaultCategories: Category[] = [
  { name: '技术', slug: 'tech', icon: '💻', color: 'cyber-cyan', count: 45 },
  { name: '设计', slug: 'design', icon: '🎨', color: 'cyber-purple', count: 32 },
  { name: '教程', slug: 'tutorial', icon: '📚', color: 'cyber-pink', count: 28 },
  { name: '随笔', slug: 'thoughts', icon: '✨', color: 'cyber-yellow', count: 15 },
];

export function CategoriesGrid({
  categories = defaultCategories,
  title = '探索分类',
  subtitle = '按主题浏览文章',
  columns = 4,
}: CategoriesGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </motion.div>

        {/* 分类网格 */}
        <div className={`grid grid-cols-2 ${gridCols} gap-4`}>
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="block cyber-card p-6 text-center group"
              >
                {/* 图标 */}
                {category.icon && (
                  <div className="text-4xl mb-3">{category.icon}</div>
                )}

                {/* 名称 */}
                <h3 className="text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors mb-2">
                  {category.name}
                </h3>

                {/* 文章数量 */}
                {category.count !== undefined && (
                  <div className="text-sm text-gray-500">
                    {category.count} 篇文章
                  </div>
                )}

                {/* 箭头指示器 */}
                <div className="mt-4 flex justify-center">
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-cyber-cyan transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * CategoryCard - 单个分类卡片组件
 */
interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const colorClasses: Record<string, string> = {
    'cyber-cyan': 'text-cyber-cyan border-cyber-cyan/30 hover:border-cyber-cyan/60',
    'cyber-purple': 'text-cyber-purple border-cyber-purple/30 hover:border-cyber-purple/60',
    'cyber-pink': 'text-cyber-pink border-cyber-pink/30 hover:border-cyber-pink/60',
    'cyber-yellow': 'text-cyber-yellow border-cyber-yellow/30 hover:border-cyber-yellow/60',
  };

  const colorClass = colorClasses[category.color || 'cyber-cyan'] || colorClasses['cyber-cyan'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className={`block cyber-card p-6 border ${colorClass} transition-all duration-300 group`}
      >
        {category.icon && (
          <div className="text-5xl mb-4">{category.icon}</div>
        )}

        <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-cyan transition-colors">
          {category.name}
        </h3>

        {category.count !== undefined && (
          <p className="text-sm text-gray-500">
            {category.count} 篇文章
          </p>
        )}
      </Link>
    </motion.div>
  );
}

export default CategoriesGrid;
