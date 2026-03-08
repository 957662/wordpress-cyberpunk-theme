'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ReadingTimeEnhanced,
  ReadingTimeEnhancedSkeleton,
} from '@/components/blog/ReadingTimeEnhanced'
import {
  ReactionBar,
  LikeButton,
} from '@/components/blog/ReactionBar'
import { ArticleHeatmap } from '@/components/blog/ArticleHeatmap'
import { AISummaryToggle, AISummaryInline } from '@/components/blog/AISummaryToggle'
import { ArticleVersionHistory } from '@/components/blog/ArticleVersionHistory'

const MOCK_ARTICLE_CONTENT = \`
# 深入理解 Next.js 14 App Router

Next.js 14 引入了许多令人兴奋的新特性，其中最引人注目的是 App Router。这是一个全新的路由系统，基于 React Server Components 构建，为开发者提供了更强大的工具和更好的性能。
\`

const MOCK_VERSIONS = [
  {
    id: '1',
    version: '1.0',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    author: { name: '张三' },
    changes: ['创建文章初稿'],
    wordCount: 850,
  },
]

export default function BlogDemoPage() {
  const [summary, setSummary] = useState('')

  const handleGenerateSummary = async () => {
    return '本文深入介绍了 Next.js 14 App Router 的核心概念和主要特性。'
  }

  return (
    <div className="min-h-screen bg-[var(--cyber-bg)]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-4">博客功能演示</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div className="p-6 rounded-lg bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)]">
              <h2 className="text-2xl font-bold text-white mb-4">深入理解 Next.js 14</h2>
              <ReadingTimeEnhanced content={MOCK_ARTICLE_CONTENT} showViews viewCount={1234} />
              <div className="mt-6"><AISummaryToggle summary={summary} onGenerate={handleGenerateSummary} /></div>
              <div className="mt-6"><ReactionBar /></div>
            </motion.div>
            <ArticleVersionHistory versions={MOCK_VERSIONS} />
          </div>
          <div className="space-y-8">
            <ArticleHeatmap days={30} />
          </div>
        </div>
      </div>
    </div>
  )
}
