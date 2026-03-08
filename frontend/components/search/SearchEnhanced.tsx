'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, FileText, Tag, User } from 'lucide-react'
import { cn, debounce } from '@/lib/utils'
import { useClickOutside } from '@/hooks/use-click-outside'

// 搜索结果类型定义
export interface SearchResult {
  id: string
  type: 'post' | 'category' | 'tag' | 'user'
  title: string
  description?: string
  url: string
  meta?: {
    views?: number
    likes?: number
    date?: string
  }
}

interface SearchEnhancedProps {
  onSearch: (query: string) => Promise<SearchResult[]>
  placeholder?: string
  className?: string
  autoFocus?: boolean
  recentSearches?: string[]
  trendingSearches?: string[]
  onSaveRecent?: (query: string) => void
  onClearRecent?: () => void
}

export const SearchEnhanced: React.FC<SearchEnhancedProps> = ({
  onSearch,
  placeholder = '搜索文章、标签、用户...',
  className,
  autoFocus = false,
  recentSearches = [],
  trendingSearches = [],
  onSaveRecent,
  onClearRecent,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useClickOutside(searchRef, () => {
    if (!query) setIsOpen(false)
  })

  // 搜索函数
  const performSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const searchResults = await onSearch(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, 300)

  useEffect(() => {
    performSearch(query)
    setSelectedIndex(-1)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          window.location.href = results[selectedIndex].url
        } else if (query.trim()) {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSaveRecent?.(query)
      // 导航到搜索结果页面
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'post': return FileText
      case 'category': return TrendingUp
      case 'tag': return Tag
      case 'user': return User
      default: return FileText
    }
  }

  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'post': return 'text-cyan-400'
      case 'category': return 'text-purple-400'
      case 'tag': return 'text-green-400'
      case 'user': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'post': return '文章'
      case 'category': return '分类'
      case 'tag': return '标签'
      case 'user': return '用户'
      default: return type
    }
  }

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <motion.div
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className={cn(
                'w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg',
                'focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20',
                'text-white placeholder-gray-500 transition-all',
                isOpen && 'border-cyan-500/50 ring-2 ring-cyan-500/20'
              )}
            />
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setQuery('')
                  setResults([])
                  inputRef.current?.focus()
                }}
                className="absolute right-3 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* 搜索结果下拉框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden z-50 max-h-[500px]"
          >
            {/* 搜索结果 */}
            {query && (
              <div className="p-2">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result, index) => {
                      const Icon = getResultIcon(result.type)
                      const color = getResultColor(result.type)

                      return (
                        <motion.a
                          key={result.id}
                          href={result.url}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-lg transition-all',
                            'hover:bg-cyan-500/10 cursor-pointer',
                            index === selectedIndex && 'bg-cyan-500/20'
                          )}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-white truncate">
                                {result.title}
                              </span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {getTypeLabel(result.type)}
                              </span>
                            </div>
                            {result.description && (
                              <p className="text-xs text-gray-400 line-clamp-2">
                                {result.description}
                              </p>
                            )}
                            {result.meta && (
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                {result.meta.views && (
                                  <span>{result.meta.views} 浏览</span>
                                )}
                                {result.meta.likes && (
                                  <span>{result.meta.likes} 喜欢</span>
                                )}
                                {result.meta.date && (
                                  <span>{result.meta.date}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.a>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">没有找到相关结果</p>
                  </div>
                )}
              </div>
            )}

            {/* 历史搜索和热门搜索 */}
            {!query && (
              <div className="p-4">
                {/* 历史搜索 */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        最近搜索
                      </h4>
                      {onClearRecent && (
                        <button
                          onClick={onClearRecent}
                          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                        >
                          清除
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setQuery(search)}
                          className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 热门搜索 */}
                {trendingSearches.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3 h-3" />
                      热门搜索
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.slice(0, 5).map((search, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setQuery(search)}
                          className="px-3 py-1.5 text-sm bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors border border-cyan-500/20"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 快捷键提示 */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>↑↓ 导航</span>
                <span>Enter 选择</span>
                <span>Esc 关闭</span>
              </div>
              {query && (
                <span className="text-cyan-400">找到 {results.length} 个结果</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchEnhanced
