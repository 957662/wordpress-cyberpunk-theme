'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils/debounce';

interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date: string;
  featured_media?: string;
}

interface ArticleSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function ArticleSearch({
  className,
  placeholder = '搜索文章...',
  onSearch
}: ArticleSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 加载最近搜索
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  }, []);

  // 执行搜索
  const performSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      // 这里应该调用实际的搜索 API
      // const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();

      // 模拟搜索结果
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockResults: SearchResult[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        slug: `article-${i + 1}`,
        title: `包含 "${searchQuery}" 的搜索结果 ${i + 1}`,
        excerpt: `这是一篇关于 ${searchQuery} 的文章摘要，包含了相关的详细内容...`,
        category: ['技术', '教程', '观点'][i % 3],
        date: new Date().toISOString(),
        featured_media: undefined
      }));

      setResults(mockResults);
      setShowResults(true);

      // 保存到搜索历史
      if (!recentSearches.includes(searchQuery)) {
        const updated = [searchQuery, ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        try {
          localStorage.setItem('recent_searches', JSON.stringify(updated));
        } catch (error) {
          console.error('保存搜索历史失败:', error);
        }
      }

      if (onSearch) {
        onSearch(searchQuery);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  // 处理输入变化
  useEffect(() => {
    performSearch(query);
  }, [query]);

  // 点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 清除搜索
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // 使用最近搜索
  const useRecentSearch = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-cyber-darker border border-cyber-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-cyber-cyan/10 text-gray-400 hover:text-cyber-cyan transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 cyber-card overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">搜索中...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                {/* 搜索结果列表 */}
                <div className="divide-y divide-cyber-border">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/blog/${result.slug}`}
                        onClick={() => setShowResults(false)}
                        className="block px-6 py-4 hover:bg-cyber-cyan/5 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {/* 缩略图 */}
                          {result.featured_media && (
                            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-cyber-darker">
                              <img
                                src={result.featured_media}
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors line-clamp-2 mb-1">
                              {result.title}
                            </h4>

                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                              {result.excerpt}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {result.category && (
                                <span className="text-cyber-cyan">{result.category}</span>
                              )}
                              <span>·</span>
                              <span>{new Date(result.date).toLocaleDateString('zh-CN')}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* 查看更多 */}
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setShowResults(false)}
                  className="block px-6 py-3 text-center text-sm text-cyber-cyan hover:bg-cyber-cyan/5 transition-colors border-t border-cyber-border"
                >
                  查看所有结果 →
                </Link>
              </>
            ) : query ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">未找到相关文章</p>
              </div>
            ) : (
              <>
                {/* 最近搜索 */}
                {recentSearches.length > 0 && (
                  <div className="p-4 border-b border-cyber-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <h4 className="text-sm font-medium text-gray-400">最近搜索</h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => useRecentSearch(term)}
                          className="px-3 py-1.5 text-sm bg-cyber-darker border border-cyber-border rounded-lg text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 热门搜索 */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-cyber-pink" />
                    <h4 className="text-sm font-medium text-gray-400">热门搜索</h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'AI', 'Web3'].map((term) => (
                      <button
                        key={term}
                        onClick={() => useRecentSearch(term)}
                        className="px-3 py-1.5 text-sm bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg text-cyber-pink hover:bg-cyber-pink/20 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 全屏搜索模式
export function FullScreenSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-cyber-dark/95 backdrop-blur-sm z-50 flex items-start justify-center pt-32 px-4"
    >
      <div className="w-full max-w-3xl">
        {/* 搜索输入 */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、标签、分类..."
            autoFocus
            className="w-full pl-16 pr-16 py-5 bg-cyber-darker border-2 border-cyber-border rounded-2xl text-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-all"
          />
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-cyber-cyan/10 text-gray-400 hover:text-cyber-cyan transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 搜索结果 */}
        {query && (
          <div className="cyber-card overflow-hidden">
            {results.length > 0 ? (
              <div className="divide-y divide-cyber-border">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/blog/${result.slug}`}
                    onClick={onClose}
                    className="block px-6 py-4 hover:bg-cyber-cyan/5 transition-colors"
                  >
                    <h4 className="text-lg font-medium text-gray-300 hover:text-cyber-cyan transition-colors line-clamp-2 mb-2">
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{result.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500">暂无搜索结果</p>
              </div>
            )}
          </div>
        )}

        {/* 快捷键提示 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          按 <kbd className="px-2 py-1 bg-cyber-darker rounded border border-cyber-border">ESC</kbd> 关闭搜索
        </div>
      </div>
    </motion.div>
  );
}
