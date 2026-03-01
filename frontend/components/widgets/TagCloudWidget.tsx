/**
 * 标签云 Widget
 * 显示文章标签，标签大小根据使用频率变化
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TagIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
  link?: string;
}

export interface TagCloudWidgetProps {
  /** 标签列表 */
  tags: Tag[];
  /** 最小字体大小 (rem) */
  minSize?: number;
  /** 最大字体大小 (rem) */
  maxSize?: number;
  /** 是否显示数量 */
  showCount?: boolean;
  /** Widget 标题 */
  title?: string;
  /** 自定义类名 */
  className?: string;
}

export function TagCloudWidget({
  tags,
  minSize = 0.75,
  maxSize = 1.25,
  showCount = false,
  title = '标签云',
  className,
}: TagCloudWidgetProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // 计算标签使用频率
  const counts = tags.map(tag => tag.count);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  // 根据频率计算字体大小
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return maxSize;
    const ratio = (count - minCount) / (maxCount - minCount);
    return minSize + ratio * (maxSize - minSize);
  };

  // 根据频率选择颜色
  const getColor = (count: number) => {
    if (maxCount === minCount) return 'text-cyber-cyan';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) return 'text-cyber-pink';
    if (ratio > 0.4) return 'text-cyber-purple';
    return 'text-cyber-cyan';
  };

  return (
    <Widget
      title={title}
      icon={<TagIcon className="w-5 h-5" />}
      className={className}
    >
      <div className="flex flex-wrap gap-2 p-2">
        {tags.map((tag, index) => {
          const fontSize = getFontSize(tag.count);
          const color = getColor(tag.count);

          return (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/blog?tag=${tag.slug}`}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md bg-cyber-dark/50 border border-cyber-border hover:border-cyber-cyan transition-all duration-300 hover:shadow-neon-cyan',
                  color
                )}
                style={{ fontSize: `${fontSize}rem` }}
              >
                <span>{tag.name}</span>
                {showCount && (
                  <span className="text-xs text-gray-500">
                    ({tag.count})
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Widget>
  );
}
