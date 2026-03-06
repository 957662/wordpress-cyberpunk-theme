'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    sort: 'relevance',
  });

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/search?q=${encodeURIComponent(query)}&type=${filters.type}&sort=${filters.sort}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                defaultValue={query}
                placeholder="Search posts, users, tags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-cyan/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const url = new URL(window.location.href);
                    url.searchParams.set('q', e.currentTarget.value);
                    window.location.href = url.toString();
                  }
                }}
              />
            </div>
            <button className="px-6 py-3 bg-cyber-cyan text-cyber-dark rounded-lg font-semibold hover:bg-cyber-cyan/80 transition-colors flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              {results.length} results for "{query}"
            </span>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg text-white"
            >
              <option value="all">All Types</option>
              <option value="posts">Posts</option>
              <option value="users">Users</option>
              <option value="tags">Tags</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-4 py-2 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg text-white"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-6">
            {results.map((result: any) => (
              <div
                key={result.id}
                className="p-6 bg-gray-900/50 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-colors"
              >
                {result.type === 'post' ? (
                  <Link href={`/blog/${result.slug}`}>
                    <h3 className="text-xl font-semibold text-cyber-cyan mb-2">
                      {result.title}
                    </h3>
                    <p className="text-gray-400 mb-3">{result.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <Link
                        href={`/${result.author_username}`}
                        className="hover:text-cyber-cyan"
                      >
                        @{result.author_username}
                      </Link>
                      <span>{new Date(result.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ) : result.type === 'user' ? (
                  <Link href={`/${result.username}`}>
                    <div className="flex items-center gap-4">
                      {result.avatar_url && (
                        <img
                          src={result.avatar_url}
                          alt={result.username}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-cyber-cyan">
                          @{result.username}
                        </h3>
                        {result.bio && (
                          <p className="text-gray-400">{result.bio}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/tags/${result.slug}`}>
                    <h3 className="text-xl font-semibold text-cyber-cyan">
                      #{result.name}
                    </h3>
                    <p className="text-gray-400">{result.posts_count} posts</p>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Enter a search query to find content</p>
          </div>
        )}
      </div>
    </div>
  );
}
