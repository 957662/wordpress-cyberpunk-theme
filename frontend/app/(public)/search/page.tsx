/**
 * 搜索页面
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useDebounce } from '@/hooks';
import { useSearch } from '@/lib/wordpress/queries';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const { data: searchResults, isLoading, error } = useSearch(
    debouncedQuery,
    { per_page: 20 },
    { enabled: debouncedQuery.length >= 2 }
  );

  // 更新 URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }, [query]);

  // 获取最近搜索
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (value && !recentSearches.includes(value)) {
      const updated = [value, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 搜索头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-6">
            搜索
          </h1>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="搜索文章、页面..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg"
            />
          </div>

          {/* 筛选选项 */}
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        {/* 搜索结果 */}
        {query && query.length >= 2 && (
          <div className="space-y-4">
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400">搜索中...</p>
              </div>
            )}

            {error && (
              <Card className="p-6 border-cyber-pink/30 bg-cyber-pink/10">
                <p className="text-cyber-pink">搜索出错，请稍后再试</p>
              </Card>
            )}

            {!isLoading && !error && searchResults && (
              <>
                <div className="text-sm text-gray-400">
                  找到 {searchResults.total} 个结果
                </div>

                {searchResults.data.length === 0 ? (
                  <Card className="p-12 text-center border-cyber-cyan/30">
                    <p className="text-gray-400 text-lg mb-2">未找到相关内容</p>
                    <p className="text-gray-500">请尝试其他关键词</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResults.data.map((result: any) => (
                      <Card
                        key={result.id}
                        className="p-6 border-cyber-cyan/30 hover:border-cyber-cyan transition-all cursor-pointer"
                        onClick={() => (window.location.href = result.url)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple">
                                {result.type === 'post' ? '文章' : '页面'}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-200 hover:text-cyber-cyan transition-colors">
                              {result.title}
                            </h3>
                            {result.excerpt && (
                              <p
                                className="text-gray-400 mt-2 line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: result.excerpt }}
                              />
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 最近搜索 */}
        {!query && recentSearches.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                最近搜索
              </h2>
              <button
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem('recentSearches');
                }}
                className="text-sm text-gray-500 hover:text-cyber-pink transition-colors"
              >
                清除
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="px-4 py-2 rounded-lg border border-cyber-cyan/30 text-gray-300 hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
