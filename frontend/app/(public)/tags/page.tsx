/**
 * 标签页面
 * 展示所有文章标签
 */

import { wpClient } from '@/lib/wordpress/client';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import Link from 'next/link';

async function getTags() {
  try {
    const tags = await wpClient.getTags();
    return tags;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 mb-6">
            <Tag className="w-4 h-4 text-cyber-cyan" />
            <span className="text-cyber-cyan text-sm font-mono">TAGS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-glow-cyan text-white mb-4">
            文章标签
          </h1>
          <p className="text-xl text-gray-400">
            探索 {tags.length} 个主题标签
          </p>
        </motion.div>

        {/* 标签云 */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog?tag=${tag.slug}`}>
                <Card variant="default" hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Tag className="w-5 h-5 text-cyber-cyan" />
                      <span className="text-xs font-mono text-gray-500">
                        {tag.count} 篇
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {tag.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      /{tag.slug}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {tags.length === 0 && (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-cyber-border mx-auto mb-4" />
            <p className="text-gray-400 text-lg">暂无标签</p>
          </div>
        )}
      </div>
    </div>
  );
}
