'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { RealTimeSearch } from '@/components/features/search/RealTimeSearch';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api.service';
import type { SearchResult } from '@/components/features/search/RealTimeSearch';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    sortBy: 'relevance',
  });

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return [];
    }

    setIsLoading(true);
    try {
      const response = await apiService.search(searchQuery, {
        type: filters.type === 'all' ? undefined : filters.type,
      });
      setResults(response.data);
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="border-b border-cyber-cyan/20 bg-cyber-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-cyber-cyan mb-4">搜索</h1>
            <RealTimeSearch
              onSearch={handleSearch}
              placeholder="搜索文章、标签、分类..."
              maxResults={5}
            />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  筛选
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ type: 'all', sortBy: 'relevance' })}
                  className="text-xs"
                >
                  重置
                </Button>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">内容类型</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 bg-cyber-dark/80 border border-cyber-cyan/30 rounded text-white"
                >
                  <option value="all">全部</option>
                  <option value="post">文章</option>
                  <option value="category">分类</option>
                  <option value="tag">标签</option>
                  <option value="user">用户</option>
                </select>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">
                {query ? `"${query}"` : '搜索结果'}
              </h2>
              <p className="text-sm text-gray-400">
                {results.length > 0 ? `找到 ${results.length} 个结果` : '输入关键词开始搜索'}
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card
                    key={i}
                    className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6 animate-pulse"
                  >
                    <div className="h-6 bg-cyber-cyan/20 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-700 rounded w-2/3" />
                  </Card>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a href={result.url}>
                      <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-6 hover:border-cyber-cyan/40 transition-colors">
                        <div className="flex items-start gap-4">
                          {result.thumbnail && (
                            <img
                              src={result.thumbnail}
                              alt={result.title}
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {result.type === 'post' && '文章'}
                                {result.type === 'category' && '分类'}
                                {result.type === 'tag' && '标签'}
                                {result.type === 'user' && '用户'}
                              </Badge>
                              {result.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.category}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-cyber-cyan mb-2 hover:underline">
                              {result.title}
                            </h3>
                            {result.excerpt && (
                              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                {result.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : query ? (
              <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-12 text-center">
                <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">没有找到结果</h3>
                <p className="text-gray-400 mb-6">尝试使用不同的关键词或调整筛选条件</p>
              </Card>
            ) : (
              <Card className="bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 p-12 text-center">
                <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">开始搜索</h3>
                <p className="text-gray-400">输入关键词搜索文章、标签、分类或用户</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
