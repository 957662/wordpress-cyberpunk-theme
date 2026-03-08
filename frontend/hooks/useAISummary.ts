'use client'

import { useState, useCallback } from 'react'
import { aiContentService } from '@/services/ai/ai-content-service'
import type { AISummaryResponse } from '@/services/ai/ai-content-service'

export interface UseAISummaryOptions {
  articleId: string | number
  content: string
  enabled?: boolean
  maxLength?: number
}

export function useAISummary({
  articleId,
  content,
  enabled = true,
  maxLength = 200,
}: UseAISummaryOptions) {
  const [summary, setSummary] = useState<string>('')
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGenerated, setIsGenerated] = useState(false)

  const generateSummary = useCallback(async () => {
    if (!enabled || !content || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response: AISummaryResponse = await aiContentService.generateSummary({
        content,
        maxLength,
        language: 'zh',
      })

      setSummary(response.summary)
      setKeyPoints(response.keyPoints)
      setIsGenerated(true)
    } catch (err) {
      console.error('Error generating summary:', err)
      setError('生成摘要失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }, [content, enabled, isLoading, maxLength])

  const resetSummary = useCallback(() => {
    setSummary('')
    setKeyPoints([])
    setError(null)
    setIsGenerated(false)
  }, [])

  return {
    summary,
    keyPoints,
    isLoading,
    error,
    isGenerated,
    generateSummary,
    resetSummary,
  }
}
