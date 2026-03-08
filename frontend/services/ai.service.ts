/**
 * AI 服务
 */

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  message: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

class AIService {
  private baseUrl = '/api/ai'

  /**
   * 发送聊天消息
   */
  async sendMessage(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      return {
        message: data.message || '抱歉，我无法理解您的问题。',
        usage: data.usage
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return {
        message: '抱歉，服务暂时不可用，请稍后再试。'
      }
    }
  }

  /**
   * 生成文本摘要
   */
  async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, maxLength })
      })

      if (!response.ok) throw new Error('Failed to generate summary')

      const data = await response.json()
      return data.summary || ''
    } catch (error) {
      console.error('Error generating summary:', error)
      return ''
    }
  }

  /**
   * 分析文本情感
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error('Failed to analyze sentiment')

      const data = await response.json()
      return {
        sentiment: data.sentiment || 'neutral',
        score: data.score || 0
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      return {
        sentiment: 'neutral',
        score: 0
      }
    }
  }

  /**
   * 生成关键词标签
   */
  async generateKeywords(text: string, count: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, count })
      })

      if (!response.ok) throw new Error('Failed to generate keywords')

      const data = await response.json()
      return data.keywords || []
    } catch (error) {
      console.error('Error generating keywords:', error)
      return []
    }
  }
}

export const aiService = new AIService()
