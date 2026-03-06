'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Clock,
  BookOpen,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingHistoryItem {
  /** 历史记录ID */
  id: string;
  /** 文章ID */
  articleId: string;
  /** 文章标题 */
  title: string;
  /** 文章链接 */
  slug: string;
  /** 阅读进度百分比 */
  progress: number;
  /** 阅读时长（秒） */
  readingTime: number;
  /** 最后阅读时间 */
  lastReadAt: string;
  /** 是否已完成 */
  isCompleted: boolean;
  /** 文章封面图 */
  coverImage?: string;
}

interface ReadingHistoryProps {
  /** 历史记录列表 */
  historyItems: ReadingHistoryItem[];
  /** 删除历史记录回调 */
  onDelete?: (id: string) => void;
  /** 清空历史记录回调 */
  onClear?: () => void;
  /** 自定义样式类名 */
  className?: string;
  /** 最大显示数量 */
  maxItems?: number;
}

type FilterType = 'all' | 'in-progress' | 'completed';
type SortType = 'recent' | 'progress' | 'title';

/**
 * 阅读历史记录组件
 *
 * 显示用户的文章阅读历史，包括阅读进度、阅读时间等信息
 *
 * @example
 * ```tsx
 * <ReadingHistory
 *   historyItems={[
 *     {
 *       id: '1',
 *       articleId: '123',
 *       title: '如何使用 React Hooks',
 *       slug: 'react-hooks-guide',
 *       progress: 75,
 *       readingTime: 300,
 *       lastReadAt: '2024-03-06T10:30:00Z',
 *       isCompleted: false
 *     }
 *   ]}
 *   onDelete={(id) => console.log('删除', id)}
 * />
 * ```
 */
export const ReadingHistory: React.FC<ReadingHistoryProps> = ({
  historyItems,
  onDelete,
  onClear,
  className,
  maxItems = 10,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  // 过滤和排序历史记录
  const filteredItems = React.useMemo(() => {
    let items = [...historyItems];

    // 搜索过滤
    if (searchQuery) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 状态过滤
    if (filter === 'in-progress') {
      items = items.filter(item => !item.isCompleted);
    } else if (filter === 'completed') {
      items = items.filter(item => item.isCompleted);
    }

    // 排序
    items.sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime();
      } else if (sort === 'progress') {
        return b.progress - a.progress;
      } else if (sort === 'title') {
        return a.title.localeCompare(b.title, 'zh-CN');
      }
      return 0;
    });

    return items.slice(0, maxItems);
  }, [historyItems, filter, sort, searchQuery, maxItems]);

  // 格式化阅读时间
  const formatReadingTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分钟`;
  };

  // 格式化最后阅读时间
  const formatLastReadTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            阅读历史
          </h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {filteredItems.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="筛选"
          >
            <Filter className="h-4 w-4" />
          </button>

          {onClear && historyItems.length > 0 && (
            <button
              onClick={onClear}
              className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
              aria-label="清空历史"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label={isExpanded ? '收起' : '展开'}
          >
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform',
              !isExpanded && '-rotate-90'
            )} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 搜索和筛选 */}
            {showFilter && (
              <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索文章..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['all', 'in-progress', 'completed'] as FilterType[]).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                        filter === filterType
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      {filterType === 'all' && '全部'}
                      {filterType === 'in-progress' && '阅读中'}
                      {filterType === 'completed' && '已完成'}
                    </button>
                  ))}

                  <div className="ml-auto">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortType)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="recent">最近阅读</option>
                      <option value="progress">阅读进度</option>
                      <option value="title">标题排序</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 历史记录列表 */}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? '没有找到匹配的文章' : '暂无阅读历史'}
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      {/* 进度指示器 */}
                      <div className="relative mt-1 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <svg className="absolute inset-0" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${item.progress}, 100`}
                            className={cn(
                              item.isCompleted ? 'text-green-500' : 'text-blue-500'
                            )}
                          />
                        </svg>
                      </div>

                      {/* 内容 */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <a
                          href={`/blog/${item.slug}`}
                          className="mb-1 truncate text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                        >
                          {item.title}
                        </a>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatReadingTime(item.readingTime)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span>进度 {item.progress}%</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span>{formatLastReadTime(item.lastReadAt)}</span>
                          </div>

                          {item.isCompleted && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              已完成
                            </span>
                          )}
                        </div>

                        {/* 进度条 */}
                        {!item.isCompleted && (
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* 删除按钮 */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="删除记录"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingHistory;
