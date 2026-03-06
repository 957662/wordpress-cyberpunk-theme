'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import TagCloud from '@/components/tags/TagCloud';
import { tagsApi } from '@/services/api';

interface Tag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
  weight?: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popular'>('name');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    let filtered = tags;

    // Search filter
    if (search) {
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'popular') {
      filtered = [...filtered].sort(
        (a, b) => (b.posts_count || 0) - (a.posts_count || 0)
      );
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTags(filtered);
  }, [search, sortBy, tags]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await tagsApi.getAll();
      setTags(response.data);
      setFilteredTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            文章标签
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            通过标签发现相关内容,探索你感兴趣的话题
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索标签..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'popular')}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            >
              <option value="name">按名称排序</option>
              <option value="popular">按热度排序</option>
            </select>
          </div>
        </motion.div>

        {/* Tags Cloud */}
        {loading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : filteredTags.length > 0 ? (
          <TagCloud tags={filteredTags} variant="default" />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {search ? '未找到匹配的标签' : '暂无标签'}
            </p>
          </div>
        )}

        {/* Popular Tags */}
        {!loading && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                热门标签
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags
                .sort((a, b) => (b.posts_count || 0) - (a.posts_count || 0))
                .slice(0, 10)
                .map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full"
                  >
                    <span>{tag.name}</span>
                    <span className="text-sm opacity-60">({tag.posts_count})</span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
