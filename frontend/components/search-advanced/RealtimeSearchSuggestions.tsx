'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Clock, TrendingUp, FileText, Tag, User, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { debounce } from 'lodash'

export interface SuggestionItem {
  id: string
  type: 'post' | 'tag' | 'category' | 'author' | 'history'
  title: string
  slug?: string
  subtitle?: string
  thumbnail?: string
  views?: number
  category?: string
  author?: string
}

export interface RealtimeSearchSuggestionsProps {
  onSearch?: (query: string) => void
  onSelect?: (item: SuggestionItem) => void
  placeholder?: string
  className?: string
  showHistory?: boolean
  showTrending?: boolean
  maxSuggestions?: number
}

export function RealtimeSearchSuggestions({
  onSearch,
  onSelect,
  placeholder = '搜索文章、标签、作者...',
  className = '',
  showHistory = true,
  showTrending = true,
  maxSuggestions = 8,
}: RealtimeSearchSuggestionsProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 获取搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // 获取热门搜索
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])

  useEffect(() => {
    setTrendingSearches([
      'Next.js 14',
      'TypeScript',
      'React Server Components',
      'Tailwind CSS',
      'Framer Motion',
      '赛博朋克设计',
    ])
  }, [])

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=${maxSuggestions}`
        )
        const data = await response.json()
        setSuggestions(data.data || [])
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        // 生成模拟数据
        setSuggestions(generateMockSuggestions(searchQuery))
      } finally {
        setLoading(false)
      }
    }, 300),
    [maxSuggestions]
  )

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query)
    } else {
      setSuggestions([])
    }
  }, [query, debouncedSearch])

  const generateMockSuggestions = (searchQuery: string): SuggestionItem[] => {
    const mockSuggestions: SuggestionItem[] = [
      {
        id: '1',
        type: 'post',
        title: `${searchQuery} - 完整开发指南`,
        subtitle: '前端开发',
        slug: `${searchQuery}-guide`,
        views: 15234,
        category: '前端开发',
        author: '张三',
      },
      {
        id: '2',
        type: 'post',
        title: `${searchQuery} 最佳实践`,
        subtitle: '技术分享',
        slug: `${searchQuery}-best-practices`,
        views: 8921,
        category: '技术分享',
        author: '李四',
      },
      {
        id: '3',
        type: 'tag',
        title: searchQuery,
        slug: searchQuery,
        subtitle: '标签',
      },
      {
        id: '4',
        type: 'category',
        title: searchQuery,
        slug: searchQuery,
        subtitle: '分类',
      },
      {
        id: '5',
        type: 'author',
        title: `${searchQuery}作者`,
        slug: `${searchQuery}-author`,
        subtitle: '作者',
      },
    ]

    return mockSuggestions.slice(0, maxSuggestions)
  }

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex])
          } else if (query.trim()) {
            handleSearch(query)
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedIndex(-1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, suggestions, selectedIndex, query])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // 保存到搜索历史
    const newHistory = [
      searchQuery,
      ...searchHistory.filter((item) => item !== searchQuery),
    ].slice(0, 10)

    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    onSearch?.(searchQuery)
    setShowSuggestions(false)
  }

  const handleSelect = (item: SuggestionItem) => {
    onSelect?.(item)
    setShowSuggestions(false)
    setQuery('')

    // 保存到搜索历史
    if (item.title && !searchHistory.includes(item.title)) {
      const newHistory = [item.title, ...searchHistory].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const getSuggestionIcon = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'post':
        return FileText
      case 'tag':
        return Tag
      case 'category':
        return Tag
      case 'author':
        return User
      case 'history':
        return Clock
      default:
        return Search
    }
  }

  const getSuggestionColor = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'post':
        return 'cyan'
      case 'tag':
        return 'purple'
      case 'category':
        return 'green'
      case 'author':
        return 'yellow'
      case 'history':
        return 'gray'
      default:
        return 'gray'
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索建议 */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2"
          >
            <Card variant="elevated" className="overflow-hidden">
              {/* 搜索结果 */}
              {query.trim() && (
                <div className="p-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => {
                        const Icon = getSuggestionIcon(suggestion.type)
                        const color = getSuggestionColor(suggestion.type)
                        const isSelected = selectedIndex === index

                        return (
                          <motion.button
                            key={suggestion.id}
                            onClick={() => handleSelect(suggestion)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                              isSelected
                                ? `bg-${color}-500/20 border border-${color}-500/30`
                                : 'hover:bg-gray-800/50'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 text-${color}-400`} />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-100">
                                  {suggestion.title}
                                </span>
                                <Badge variant="info" size="sm">
                                  {suggestion.subtitle}
                                </Badge>
                              </div>

                              {suggestion.views && (
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                  <span>{suggestion.views.toLocaleString()} 次浏览</span>
                                  {suggestion.category && (
                                    <>
                                      <span>•</span>
                                      <span>{suggestion.category}</span>
                                    </>
                                  )}
                                  {suggestion.author && (
                                    <>
                                      <span>•</span>
                                      <span>{suggestion.author}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            <ArrowRight className="flex-shrink-0 w-5 h-5 text-gray-500" />
                          </motion.button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>未找到相关内容</p>
                    </div>
                  )}
                </div>
              )}

              {/* 搜索历史和热门搜索 */}
              {!query.trim() && (
                <div className="p-4">
                  {/* 搜索历史 */}
                  {showHistory && searchHistory.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                          <Clock className="w-4 h-4" />
                          搜索历史
                        </div>
                        <button
                          onClick={clearHistory}
                          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          清除
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {searchHistory.slice(0, 8).map((item, index) => (
                          <motion.button
                            key={index}
                            onClick={() => {
                              setQuery(item)
                              handleSearch(item)
                            }}
                            className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {item}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 热门搜索 */}
                  {showTrending && trendingSearches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-300">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        热门搜索
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((item, index) => (
                          <motion.button
                            key={index}
                            onClick={() => {
                              setQuery(item)
                              handleSearch(item)
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-gray-300 hover:text-white rounded-lg text-sm transition-all border border-cyan-500/20 hover:border-cyan-500/40"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-cyan-400 font-bold">#{index + 1}</span>
                              {item}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 快捷键提示 */}
              <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↓</kbd>
                    导航
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Enter</kbd>
                    选择
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Esc</kbd>
                    关闭
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RealtimeSearchSuggestions
