'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AISummaryToggleProps {
  summary?: string
  onGenerate?: () => Promise<string>
  isLoading?: boolean
  className?: string
}

export function AISummaryToggle({
  summary: initialSummary,
  onGenerate,
  isLoading = false,
  className,
}: AISummaryToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [summary, setSummary] = useState(initialSummary || '')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!onGenerate || isGenerating) return

    setIsGenerating(true)
    try {
      const generated = await onGenerate()
      setSummary(generated)
      setIsOpen(true)
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={cn('rounded-lg border border-[var(--cyber-border)]', className)}>
      {/* 标题栏 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'bg-gradient-to-r from-[var(--cyber-card-bg)] to-transparent',
          'hover:from-[var(--cyber-muted)] transition-all duration-200'
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5 text-[var(--cyber-purple)]" />
          </motion.div>
          <span className="font-semibold text-white">AI 摘要</span>
          {summary && (
            <span className="px-2 py-0.5 text-xs bg-[var(--cyber-primary)] bg-opacity-20 rounded-full text-[var(--cyber-cyan)]">
              已生成
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!summary && onGenerate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleGenerate()
              }}
              disabled={isGenerating || isLoading}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                'bg-[var(--cyber-primary)] text-white',
                'hover:opacity-90 transition-opacity',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isGenerating || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>生成摘要</span>
                </>
              )}
            </motion.button>
          )}

          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </motion.button>

      {/* 内容区域 */}
      <AnimatePresence>
        {isOpen && summary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-[var(--cyber-border)] bg-[var(--cyber-card-bg)] bg-opacity-50">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{summary}</p>
              </div>

              {/* 关键点提取 */}
              <div className="mt-4 pt-4 border-t border-[var(--cyber-border)]">
                <h4 className="text-sm font-semibold text-[var(--cyber-cyan)] mb-2">
                  关键要点
                </h4>
                <ul className="space-y-2">
                  {extractKeyPoints(summary).map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <span className="text-[var(--cyber-purple)] mt-1">•</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 提取关键点的辅助函数
function extractKeyPoints(summary: string): string[] {
  // 简单实现：按句号分割并返回前3句
  const sentences = summary
    .split(/[。！？.!?]/)
    .filter((s) => s.trim().length > 10)
  return sentences.slice(0, 3).map((s) => s.trim())
}

// 内联版本 - 直接显示摘要
export function AISummaryInline({
  summary,
  isLoading,
}: {
  summary?: string
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)]">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--cyber-purple)]" />
        <span className="text-sm text-gray-400">AI 正在生成摘要...</span>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--cyber-purple)]/10 to-[var(--cyber-cyan)]/10 border border-[var(--cyber-border)]">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-[var(--cyber-purple)]" />
        <span className="text-sm font-semibold text-[var(--cyber-purple)]">
          AI 摘要
        </span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
    </div>
  )
}
