/**
 * 分类 Widget
 * 显示博客分类列表
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderIcon, ArrowIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
  parent?: number;
}

export interface CategoryWidgetProps {
  /** 分类列表 */
  categories: Category[];
  /** 是否显示数量 */
  showCount?: boolean;
  /** 是否显示描述 */
  showDescription?: boolean;
  /** Widget 标题 */
  title?: string;
  /** 自定义类名 */
  className?: string;
}

export function CategoryWidget({
  categories,
  showCount = true,
  showDescription = false,
  title = '分类',
  className,
}: CategoryWidgetProps) {
  // 过滤掉顶级分类（没有父级的）
  const topLevelCategories = categories.filter(cat => !cat.parent);

  return (
    <Widget
      title={title}
      icon={<FolderIcon className="w-5 h-5" />}
      className={className}
    >
      <div className="space-y-2">
        {topLevelCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/blog?category=${category.slug}`}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-cyber-cyan transition-all duration-300 group',
                'hover:shadow-neon-cyan hover:translate-x-1'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-cyber-cyan/10 text-cyber-cyan">
                  <FolderIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-white group-hover:text-cyber-cyan transition-colors">
                    {category.name}
                  </h4>
                  {showDescription && category.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {showCount && (
                  <span className="text-xs text-gray-500 bg-cyber-muted px-2 py-1 rounded">
                    {category.count}
                  </span>
                )}
                <ArrowIcon className="w-4 h-4 text-gray-500 group-hover:text-cyber-cyan transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}

        {topLevelCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>暂无分类</p>
          </div>
        )}
      </div>
    </Widget>
  );
}
