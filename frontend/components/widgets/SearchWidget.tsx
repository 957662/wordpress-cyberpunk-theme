/**
 * 搜索 Widget
 * 侧边栏搜索框
 */

'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SearchIcon, XIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface SearchWidgetProps {
  /** 占位符文本 */
  placeholder?: string;
  /** Widget 标题 */
  title?: string;
  /** 自定义类名 */
  className?: string;
}

export function SearchWidget({
  placeholder = '搜索文章...',
  title = '搜索',
  className,
}: SearchWidgetProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <Widget
      title={title}
      icon={<SearchIcon className="w-5 h-5" />}
      className={className}
    >
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-cyber-cyan transition-colors"
              aria-label="清除搜索"
            >
              <XIcon className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!query.trim()}
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          搜索
        </Button>
      </form>

      {/* 热门搜索标签 */}
      <div className="mt-4 pt-4 border-t border-cyber-border">
        <p className="text-xs text-gray-500 mb-2">热门搜索：</p>
        <div className="flex flex-wrap gap-2">
          {['Next.js', 'TypeScript', 'Tailwind CSS', 'React'].map((term) => (
            <motion.button
              key={term}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setQuery(term);
                router.push(`/search?q=${encodeURIComponent(term)}`);
              }}
              className="text-xs px-2 py-1 rounded bg-cyber-muted text-gray-400 hover:bg-cyber-cyan hover:text-cyber-dark transition-colors"
            >
              {term}
            </motion.button>
          ))}
        </div>
      </div>
    </Widget>
  );
}
