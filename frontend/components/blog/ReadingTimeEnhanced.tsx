'use client'

import { useState, useEffect } from 'react'
import { Clock, Eye, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ReadingTimeEnhancedProps {
  content: string
  wordsPerMinute?: number
  className?: string
  showViews?: boolean
  viewCount?: number
}

export function ReadingTimeEnhanced({
  content,
  wordsPerMinute = 200,
  className,
  showViews = false,
  viewCount = 0,
}: ReadingTimeEnhancedProps) {
  const [readingTime, setReadingTime] = useState<number>(0)
  const [wordCount, setWordCount] = useState<number>(0)

  useEffect(() => {
    // 计算字数（中文按字符计算，英文按单词计算）
    const text = content.replace(/<[^>]*>/g, '') // 移除HTML标签
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0
    const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0
    const totalWords = chineseChars + englishWords

    const time = Math.ceil(totalWords / wordsPerMinute)

    setWordCount(totalWords)
    setReadingTime(time)
  }, [content, wordsPerMinute])

  const formatReadingTime = (minutes: number): string => {
    if (minutes < 1) {
      return '少于1分钟'
    } else if (minutes < 60) {
      return `${minutes}分钟`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0
        ? `${hours}小时${remainingMinutes}分钟`
        : `${hours}小时`
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 text-sm text-gray-400',
        'cyber-badge',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[var(--cyber-cyan)]" />
        <span>{wordCount} 字</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[var(--cyber-purple)]" />
        <span>{formatReadingTime(readingTime)}</span>
      </div>

      {showViews && viewCount > 0 && (
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[var(--cyber-pink)]" />
          <span>{viewCount.toLocaleString()} 阅读</span>
        </div>
      )}
    </div>
  )
}

// 骨架屏版本
export function ReadingTimeEnhancedSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="h-5 w-20 bg-[var(--cyber-muted)] rounded" />
      <div className="h-5 w-24 bg-[var(--cyber-muted)] rounded" />
      <div className="h-5 w-20 bg-[var(--cyber-muted)] rounded" />
    </div>
  )
}
