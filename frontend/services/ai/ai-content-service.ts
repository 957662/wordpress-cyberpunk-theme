/**
 * AI 内容服务
 * 提供AI摘要、标签生成、内容建议等功能
 */

export interface AISummaryRequest {
  content: string
  maxLength?: number
  language?: 'zh' | 'en'
}

export interface AISummaryResponse {
  summary: string
  keyPoints: string[]
  readingTime: number
  confidence: number
}

export interface AITagRequest {
  content: string
  title: string
  maxTags?: number
}

export interface AITagResponse {
  tags: string[]
  categories: string[]
  confidence: number
}

export interface AIContentSuggestion {
  type: 'related' | 'trending' | 'continue'
  title: string
  reason: string
  confidence: number
}

class AIContentService {
  private apiBaseUrl: string
  private apiKey?: string

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai'
  }

  /**
   * 生成文章摘要
   */
  async generateSummary(request: AISummaryRequest): Promise<AISummaryResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      return await response.json()
    } catch (error) {
      console.error('Error generating summary:', error)
      return this.getMockSummary(request)
    }
  }

  /**
   * 生成文章标签
   */
  async generateTags(request: AITagRequest): Promise<AITagResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to generate tags')
      }

      return await response.json()
    } catch (error) {
      console.error('Error generating tags:', error)
      return this.getMockTags(request)
    }
  }

  /**
   * 获取内容建议
   */
  async getContentSuggestions(
    articleId: string | number,
    currentTags: string[]
  ): Promise<AIContentSuggestion[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/suggestions/${articleId}?tags=${currentTags.join(',')}`,
        {
          headers: {
            ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting suggestions:', error)
      return this.getMockSuggestions()
    }
  }

  /**
   * 分析文章情感
   */
  async analyzeSentiment(content: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
    confidence: number
  }> {
    // 简单实现
    const positiveWords = ['优秀', '很好', '棒', '成功', '出色']
    const negativeWords = ['差', '不好', '失败', '糟糕', '问题']
    
    let positiveCount = 0
    let negativeCount = 0
    
    positiveWords.forEach(word => {
      if (content.includes(word)) positiveCount++
    })
    
    negativeWords.forEach(word => {
      if (content.includes(word)) negativeCount++
    })
    
    if (positiveCount > negativeCount) {
      return { sentiment: 'positive', score: 0.7, confidence: 0.8 }
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'negative', score: 0.3, confidence: 0.7 }
    } else {
      return { sentiment: 'neutral', score: 0.5, confidence: 0.6 }
    }
  }

  /**
   * 提取关键点
   */
  extractKeyPoints(content: string, maxPoints = 5): string[] {
    const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 10)
    
    // 简单算法：选择较长的句子
    return sentences
      .sort((a, b) => b.length - a.length)
      .slice(0, maxPoints)
      .map(s => s.trim())
  }

  /**
   * 模拟摘要生成
   */
  private getMockSummary(request: AISummaryRequest): AISummaryResponse {
    const content = request.content.slice(0, 200)
    const keyPoints = this.extractKeyPoints(request.content, 3)
    
    return {
      summary: `这是一篇关于${content.slice(0, 50)}...的文章。主要讨论了相关话题的核心内容，包括${keyPoints[0]?.slice(0, 20)}...等要点。`,
      keyPoints,
      readingTime: Math.ceil(request.content.length / 200),
      confidence: 0.85,
    }
  }

  /**
   * 模拟标签生成
   */
  private getMockTags(request: AITagRequest): AITagResponse {
    const commonTags = [
      '技术', '编程', '前端', '后端', '数据库',
      'AI', '机器学习', '云计算', 'DevOps', '安全',
      '架构', '性能优化', '最佳实践', '教程', '案例分析'
    ]
    
    const shuffled = commonTags.sort(() => Math.random() - 0.5)
    const tags = shuffled.slice(0, request.maxTags || 5)
    
    return {
      tags,
      categories: ['技术', '编程'],
      confidence: 0.8,
    }
  }

  /**
   * 模拟内容建议
   */
  private getMockSuggestions(): AIContentSuggestion[] {
    return [
      {
        type: 'related',
        title: '深入理解 Next.js 14',
        reason: '与当前文章主题相关',
        confidence: 0.9,
      },
      {
        type: 'trending',
        title: 'React Server Components 最佳实践',
        reason: '最近热门文章',
        confidence: 0.85,
      },
      {
        type: 'continue',
        title: 'TypeScript 高级类型系统',
        reason: '继续深入学习',
        confidence: 0.8,
      },
    ]
  }

  /**
   * 优化内容
   */
  async optimizeContent(content: string): Promise<{
    optimized: string
    improvements: string[]
  }> {
    const improvements: string[] = []
    let optimized = content

    // 检查段落长度
    const paragraphs = content.split('\n\n')
    if (paragraphs.some(p => p.length > 500)) {
      improvements.push('建议将长段落拆分为更短的段落')
    }

    // 检查句子长度
    const sentences = content.split(/[。！？.!?]/)
    if (sentences.some(s => s.length > 100)) {
      improvements.push('部分句子过长，建议拆分')
    }

    // 检查标题层级
    const headings = content.match(/^#{1,3}\s/gm)
    if (!headings || headings.length < 3) {
      improvements.push('建议添加更多标题以改善可读性')
    }

    return { optimized, improvements }
  }

  /**
   * 检测内容质量
   */
  async checkQuality(content: string): Promise<{
    score: number
    issues: string[]
    suggestions: string[]
  }> {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // 检查字数
    if (content.length < 500) {
      issues.push('文章内容过短')
      score -= 20
    }

    // 检查标题
    if (!content.match(/^#\s/)) {
      issues.push('缺少主标题')
      score -= 10
    }

    // 检查段落结构
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    if (paragraphs.length < 3) {
      suggestions.push('建议增加段落以提高可读性')
      score -= 5
    }

    // 检查代码块
    if (content.includes('```')) {
      suggestions.push('文章包含代码块，建议添加说明')
    }

    return { score: Math.max(0, score), issues, suggestions }
  }
}

// 导出单例实例
export const aiContentService = new AIContentService()

export default AIContentService
