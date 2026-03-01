/**
 * 侧边栏组件
 */

'use client';

import { motion } from 'framer-motion';
import { CalendarIcon, TagIcon, UserIcon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export interface SidebarProps {
  categories?: Array<{ id: number; name: string; slug: string; count: number }>;
  tags?: Array<{ id: number; name: string; slug: string; count: number }>;
  recentPosts?: Array<{ id: number; title: string; slug: string; date: string }>;
}

export function Sidebar({ categories = [], tags = [], recentPosts = [] }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* About Widget */}
      <Card variant="glass" className="p-6">
        <h3 className="font-display font-bold text-xl mb-4 text-glow-cyan">
          关于
        </h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple p-0.5">
            <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white">CyberPress</h4>
            <p className="text-sm text-gray-400">赛博朋克博客平台</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          探索科技、设计、编程与未来主义。用代码构建梦想，用创意点亮未来。
        </p>
      </Card>

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <Card variant="glass" className="p-6">
          <h3 className="font-display font-bold text-xl mb-4 text-glow-cyan">
            最新文章
          </h3>
          <ul className="space-y-4">
            {recentPosts.map((post, index) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <h4 className="font-medium text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(post.date)}
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </Card>
      )}

      {/* Categories Widget */}
      {categories.length > 0 && (
        <Card variant="glass" className="p-6">
          <h3 className="font-display font-bold text-xl mb-4 text-glow-cyan">
            分类
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/blog?category=${category.slug}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-cyber-purple/30 transition-colors"
                >
                  {category.name}
                  <span className="ml-1 opacity-60">({category.count})</span>
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Tags Widget */}
      {tags.length > 0 && (
        <Card variant="glass" className="p-6">
          <h3 className="font-display font-bold text-xl mb-4 text-glow-cyan">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge
                  variant="primary"
                  size="sm"
                  className="cursor-pointer hover:bg-cyber-cyan/30 transition-colors"
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </aside>
  );
}
