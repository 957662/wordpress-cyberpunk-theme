'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  query: string;
  results?: any[];
  total?: number;
  loading?: boolean;
  onFilterChange?: (filters: any) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results = [],
  total = 0,
  loading = false,
  onFilterChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { id: 'all', label: '全部', count: total },
    { id: 'posts', label: '文章', count: results.filter((r) => r.type === 'post').length },
    { id: 'users', label: '用户', count: results.filter((r) => r.type === 'user').length },
    { id: 'tags', label: '标签', count: results.filter((r) => r.type === 'tag').length },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.({ type: filterId });
  };

  return (
    <div className="w-full">
      {/* 搜索头部 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-cyber-cyan mb-2">
              搜索结果
            </h2>
            <p className="text-gray-400">
              找到 <span className="text-cyber-purple font-semibold">{total}</span> 个与 "
              <span className="text-cyber-yellow">{query}</span>" 相关的结果
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              "border border-cyber-cyan/30 hover:border-cyber-cyan",
              "hover:bg-cyber-cyan/10"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
        </div>

        {/* 筛选按钮 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={cn(
                "px-4 py-2 rounded-lg transition-all whitespace-nowrap",
                "border flex items-center gap-2",
                activeFilter === filter.id
                  ? "border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan"
                  : "border-gray-700 hover:border-gray-600 text-gray-400"
              )}
            >
              {filter.label}
              <span className={cn(
                "px-2 py-0.5 rounded text-xs",
                activeFilter === filter.id
                  ? "bg-cyber-cyan text-black"
                  : "bg-gray-800 text-gray-300"
              )}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 筛选面板 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 border border-cyber-purple/30 rounded-lg bg-cyber-purple/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">时间范围</label>
                <select className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:border-cyber-cyan focus:outline-none">
                  <option>全部时间</option>
                  <option>过去24小时</option>
                  <option>过去一周</option>
                  <option>过去一个月</option>
                  <option>过去一年</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">排序方式</label>
                <select className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:border-cyber-cyan focus:outline-none">
                  <option>相关性</option>
                  <option>最新发布</option>
                  <option>最多浏览</option>
                  <option>最多点赞</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">内容类型</label>
                <select className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:border-cyber-cyan focus:outline-none">
                  <option>全部类型</option>
                  <option>仅文章</option>
                  <option>仅页面</option>
                  <option>仅媒体</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">搜索中...</span>
          </div>
        </div>
      )}

      {/* 结果列表 */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-4 border rounded-lg transition-all hover:border-cyber-cyan/50",
                  "bg-black/40 backdrop-blur-sm",
                  "cursor-pointer group"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* 图标/缩略图 */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20 flex items-center justify-center">
                    {result.type === 'post' && (
                      <Search className="w-6 h-6 text-cyber-cyan" />
                    )}
                    {result.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-cyber-purple" />
                    )}
                    {result.type === 'tag' && (
                      <span className="text-cyber-yellow font-bold">#</span>
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors mb-1">
                      {result.title || result.name}
                    </h3>
                    {result.excerpt && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                        {result.excerpt}
                      </p>
                    )}
                    {result.type === 'post' && result.category && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 rounded bg-cyber-purple/20 text-cyber-purple">
                          {result.category.name}
                        </span>
                        <span>•</span>
                        <span>{result.view_count || 0} 次浏览</span>
                      </div>
                    )}
                  </div>

                  {/* 箭头 */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                      <span className="text-cyber-cyan">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 空状态 */}
      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            未找到相关结果
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            试试调整搜索关键词或使用其他筛选条件
          </p>
        </div>
      )}

      {/* 分页 */}
      {!loading && results.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <button
              disabled
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-500 cursor-not-allowed"
            >
              上一页
            </button>
            <button className="px-4 py-2 rounded-lg border border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan">
              1
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600">
              2
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600">
              3
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600">
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
