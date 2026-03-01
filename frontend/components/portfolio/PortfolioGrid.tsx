/**
 * 作品集网格组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioCard } from './PortfolioCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { PortfolioItem } from './PortfolioCard';

export interface PortfolioGridProps {
  items: PortfolioItem[];
  filter?: boolean;
}

export function PortfolioGrid({ items, filter = true }: PortfolioGridProps) {
  const [selectedTech, setSelectedTech] = useState<string | 'all'>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured'>('all');

  // 提取所有技术标签
  const allTechnologies = Array.from(
    new Set(items.flatMap((item) => item.technologies))
  ).sort();

  // 过滤项目
  const filteredItems = items.filter((item) => {
    const matchFeatured =
      selectedFilter === 'all' || (selectedFilter === 'featured' && item.featured);
    const matchTech =
      selectedTech === 'all' || item.technologies.includes(selectedTech);
    return matchFeatured && matchTech;
  });

  return (
    <div className="space-y-8">
      {/* Filters */}
      {filter && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Featured Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">筛选:</span>
            <div className="flex gap-2">
              <Badge
                variant={selectedFilter === 'all' ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => setSelectedFilter('all')}
              >
                全部
              </Badge>
              <Badge
                variant={selectedFilter === 'featured' ? 'warning' : 'default'}
                className="cursor-pointer"
                onClick={() => setSelectedFilter('featured')}
              >
                精选项目
              </Badge>
            </div>
          </div>

          {/* Technology Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-400">技术:</span>
            <Badge
              variant={selectedTech === 'all' ? 'primary' : 'default'}
              className="cursor-pointer"
              onClick={() => setSelectedTech('all')}
            >
              全部
            </Badge>
            {allTechnologies.map((tech) => (
              <Badge
                key={tech}
                variant={selectedTech === tech ? 'secondary' : 'default'}
                className="cursor-pointer"
                onClick={() => setSelectedTech(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        显示 {filteredItems.length} / {items.length} 个项目
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <Card variant="glass" className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display font-bold text-xl mb-2">没有找到项目</h3>
          <p className="text-gray-400">尝试其他筛选条件</p>
        </Card>
      )}
    </div>
  );
}
