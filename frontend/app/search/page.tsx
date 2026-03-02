'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BlogCard, SkeletonLoader } from '@/components/blog';
import { SearchSuggestions } from '@/components/ui';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  image?: string;
}

/**
 * 搜索页面内容组件
 */
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 执行搜索
  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setHasSearched(true);

    try {
      // 这里调用实际的搜索 API
      // 示例: const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();

      // 模拟搜索结果
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 模拟数据 - 实际应用中从 API 获取
      const mockResults: SearchResult[] = Array.from({ length: 5 }, (_, i) => ({
        id: `result-${i}`,
        title: `Search Result ${i + 1} for "${searchQuery}"`,
        excerpt: `This is a mock search result demonstrating the search functionality. In a real application, this would contain actual content matching your search query.`,
        slug: `search-result-${i + 1}`,
        date: new Date().toISOString(),
        author: 'CyberPress',
        category: 'Technology',
        image: `https://picsum.photos/800/400?random=${i}`,
      }));

      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`);
      performSearch(newQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Search
            </h1>
            <SearchSuggestions
              query={query}
              onSearch={handleSearch}
              suggestions={[]}
              placeholder="Search for posts, categories, tags..."
              className="max-w-3xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-800 rounded w-4/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* No Query State */}
          {!loading && !hasSearched && !query && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Start Your Search
              </h2>
              <p className="text-gray-400">
                Enter keywords to search through our content
              </p>
            </motion.div>
          )}

          {/* No Results State */}
          {!loading && hasSearched && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                No Results Found
              </h2>
              <p className="text-gray-400 mb-6">
                We couldn't find anything matching "{query}"
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Search tips:</p>
                <ul className="space-y-1">
                  <li>• Try different keywords</li>
                  <li>• Check your spelling</li>
                  <li>• Use more general terms</li>
                  <li>• Browse our categories instead</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Results List */}
          {!loading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  Found <span className="text-cyan-400 font-semibold">{results.length}</span>{' '}
                  results for "{query}"
                </p>
              </div>

              {/* Results */}
              <div className="grid gap-6">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlogCard
                      post={{
                        id: result.id,
                        title: result.title,
                        excerpt: result.excerpt,
                        slug: result.slug,
                        date: result.date,
                        author: { name: result.author },
                        category: { name: result.category },
                        featured_media: result.image,
                      }}
                      className="w-full"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Popular Searches */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="container mx-auto px-4 pb-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'React',
                  'TypeScript',
                  'Next.js',
                  'Cyberpunk',
                  'Web Development',
                  'AI',
                  'Blockchain',
                  'Design',
                ].map((term, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSearch(term)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * 搜索页面主组件
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

/**
 * 搜索页面加载状态
 */
function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 bg-gray-800 rounded animate-pulse mb-4 w-48 mx-auto" />
            <div className="h-12 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
