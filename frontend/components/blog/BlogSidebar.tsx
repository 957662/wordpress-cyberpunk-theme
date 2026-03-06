/**
 * 博客侧边栏组件
 */

'use client';

import { motion } from 'framer-motion';
import { Search, Tag, Folder, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface RecentPost {
  id: string;
  title: string;
  publishedAt: string;
}

export interface BlogSidebarProps {
  categories?: Category[];
  tags?: Tag[];
  recentPosts?: RecentPost[];
  showSearch?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showRecentPosts?: boolean;
  className?: string;
}

export function BlogSidebar({
  categories = [],
  tags = [],
  recentPosts = [],
  showSearch = true,
  showCategories = true,
  showTags = true,
  showRecentPosts = true,
  className,
}: BlogSidebarProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <aside className={cn('space-y-6', className)}>
      {/* Search Widget */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-cyber-cyan" />
              搜索文章
            </h3>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-3"
            >
              <Input
                type="search"
                placeholder="输入关键词搜索..."
                className="bg-cyber-muted border-cyber-border"
              />
              <Button variant="primary" size="sm" fullWidth>
                搜索
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Categories Widget */}
      {showCategories && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-cyber-purple" />
              分类
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/blog?category=${category.slug}`}
                    className="flex items-center justify-between text-gray-400 hover:text-cyber-cyan transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {category.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-cyber-muted rounded text-gray-500">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Tags Widget */}
      {showTags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-cyber-pink" />
              标签云
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="px-3 py-1.5 bg-cyber-muted border border-cyber-border rounded text-sm text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all hover:-translate-y-0.5"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Posts Widget */}
      {showRecentPosts && recentPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyber-yellow" />
              最近文章
            </h3>
            <ul className="space-y-3">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.id}`}
                    className="block group"
                  >
                    <h4 className="text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Newsletter Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="neon" glowColor="cyan">
          <h3 className="font-display font-bold text-white mb-2">
            订阅更新
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            获取最新文章和项目动态
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-3"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              className="bg-cyber-muted border-cyber-border"
            />
            <Button variant="primary" size="sm" fullWidth>
              订阅
            </Button>
          </form>
        </Card>
      </motion.div>
    </aside>
  );
}

export default BlogSidebar;
