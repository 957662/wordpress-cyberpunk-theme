/**
 * TagCloud Component
 * 标签云组件
 */

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberBadge } from '@/components/ui/CyberBadge';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface TagCloudProps {
  tags: Tag[];
  selectedTag?: string;
  maxDisplay?: number;
}

export function TagCloud({ tags, selectedTag, maxDisplay = 20 }: TagCloudProps) {
  const searchParams = useSearchParams();

  if (tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxDisplay);

  // 根据数量计算大小
  const getSizeClass = (count: number) => {
    const maxCount = Math.max(...tags.map((t) => t.count));
    const ratio = count / maxCount;

    if (ratio > 0.7) return 'text-lg';
    if (ratio > 0.4) return 'text-base';
    return 'text-sm';
  };

  return (
    <CyberCard>
      <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
        <Hash className="w-5 h-5 text-cyber-purple" />
        标签云
      </h3>

      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => {
          const isSelected = selectedTag === tag.slug;
          const sizeClass = getSizeClass(tag.count);

          return (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CyberBadge
                  variant={isSelected ? 'cyan' : 'outline'}
                  className={`${sizeClass} cursor-pointer ${
                    isSelected ? 'bg-cyber-cyan text-cyber-dark' : ''
                  }`}
                >
                  #{tag.name}
                  <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                </CyberBadge>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {tags.length > maxDisplay && (
        <Link href="/blog">
          <button className="mt-4 text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors">
            查看全部 {tags.length} 个标签 →
          </button>
        </Link>
      )}
    </CyberCard>
  );
}
