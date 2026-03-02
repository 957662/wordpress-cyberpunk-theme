/**
 * 分类页面
 * 展示所有文章分类
 */

import { wpClient } from '@/lib/wordpress/client';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import Link from 'next/link';

async function getCategories() {
  try {
    const categories = await wpClient.getCategories();
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-purple/30 bg-cyber-purple/10 mb-6">
            <Folder className="w-4 h-4 text-cyber-purple" />
            <span className="text-cyber-purple text-sm font-mono">CATEGORIES</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-glow-purple text-white mb-4">
            文章分类
          </h1>
          <p className="text-xl text-gray-400">
            探索 {categories.length} 个内容分类
          </p>
        </motion.div>

        {/* 分类列表 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog?category=${category.slug}`}>
                <Card variant="neon" neonColor="purple" hover className="h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <Folder className="w-8 h-8 text-cyber-purple" />
                      <span className="text-sm font-mono text-gray-500">
                        {category.count} 篇文章
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-400 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-cyber-border">
                      <span className="text-sm font-mono text-cyber-purple">
                        /{category.slug}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {categories.length === 0 && (
          <div className="text-center py-20">
            <Folder className="w-16 h-16 text-cyber-border mx-auto mb-4" />
            <p className="text-gray-400 text-lg">暂无分类</p>
          </div>
        )}
      </div>
    </div>
  );
}
