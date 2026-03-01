/**
 * 搜索页面模板
 */

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout';
import { SearchBar, BlogCard } from '@/components';
import { SearchIcon } from '@/components/icons';
import { useDebounce } from '@/hooks';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // TODO: 实现搜索逻辑
  // useEffect(() => {
  //   if (debouncedQuery) {
  //     setIsLoading(true);
  //     searchPosts(debouncedQuery).then(setResults).finally(() => setIsLoading(false));
  //   }
  // }, [debouncedQuery]);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="搜索"
        description="搜索您感兴趣的内容"
        icon={<SearchIcon className="w-8 h-8" />}
      />

      <div className="container mx-auto px-4 py-12">
        {/* 搜索栏 */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索文章、标签、分类..."
            size="lg"
          />
        </div>

        {/* 搜索结果 */}
        {isLoading && (
          <div className="text-center text-cyber-muted">
            搜索中...
          </div>
        )}

        {!isLoading && searchQuery && results.length === 0 && (
          <div className="text-center text-cyber-muted">
            未找到相关内容
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center text-cyber-muted">
            请输入搜索关键词
          </div>
        )}
      </div>
    </div>
  );
}
