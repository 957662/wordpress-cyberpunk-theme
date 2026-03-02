/**
 * AI 集成服务
 * 提供文本生成、摘要、分类等功能
 */

import { logger } from '@/lib/utils/logger';

export interface AIGenerateOptions {
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3';
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SummaryResult {
  summary: string;
  keywords: string[];
  readingTime: number;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  tags: string[];
}

/**
 * AI 服务类
 */
class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = '';
  private isMock: boolean = true;

  constructor() {
    // 从环境变量读取配置
    if (typeof window !== 'undefined') {
      this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || localStorage.getItem('ai_api_key');
      this.baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || '';
      this.isMock = !this.apiKey;
    }
  }

  /**
   * 生成文章摘要
   */
  async generateSummary(content: string, maxLength: number = 200): Promise<AIResponse<SummaryResult>> {
    try {
      if (this.isMock) {
        return this.mockSummary(content, maxLength);
      }

      const response = await fetch(`${this.baseUrl}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          content,
          maxLength,
        }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      logger.error('Generate summary error:', error);
      return { success: false, error: 'Failed to generate summary' };
    }
  }

  /**
   * 文本分类
   */
  async classifyText(text: string): Promise<AIResponse<ClassificationResult>> {
    try {
      if (this.isMock) {
        return this.mockClassification(text);
      }

      const response = await fetch(`${this.baseUrl}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      logger.error('Classify text error:', error);
      return { success: false, error: 'Failed to classify text' };
    }
  }

  /**
   * 生成内容推荐
   */
  async generateRecommendations(
    currentPost: { title: string; content: string; tags: string[] },
    allPosts: Array<{ title: string; content: string; tags: string[] }>,
    limit: number = 3
  ): Promise<AIResponse<string[]>> {
    try {
      if (this.isMock) {
        return this.mockRecommendations(currentPost, allPosts, limit);
      }

      const response = await fetch(`${this.baseUrl}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ currentPost, allPosts, limit }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      return { success: true, data: data.recommendations };
    } catch (error) {
      logger.error('Generate recommendations error:', error);
      return { success: false, error: 'Failed to generate recommendations' };
    }
  }

  /**
   * 文本生成
   */
  async generateText(
    prompt: string,
    options: AIGenerateOptions = {}
  ): Promise<AIResponse<string>> {
    try {
      if (this.isMock) {
        return {
          success: true,
          data: `这是基于提示 "${prompt}" 生成的模拟文本。在实际使用中，这里会调用真实的 AI API 来生成内容。`,
        };
      }

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ prompt, ...options }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      return { success: true, data: data.text };
    } catch (error) {
      logger.error('Generate text error:', error);
      return { success: false, error: 'Failed to generate text' };
    }
  }

  /**
   * 语法检查
   */
  async checkGrammar(text: string): Promise<AIResponse<Array<{ offset: number; length: number; message: string; suggestion: string }>>> {
    try {
      if (this.isMock) {
        return {
          success: true,
          data: [],
        };
      }

      const response = await fetch(`${this.baseUrl}/grammar-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      return { success: true, data: data.issues };
    } catch (error) {
      logger.error('Check grammar error:', error);
      return { success: false, error: 'Failed to check grammar' };
    }
  }

  /**
   * 提取关键词
   */
  async extractKeywords(text: string, limit: number = 10): Promise<AIResponse<string[]>> {
    try {
      if (this.isMock) {
        const words = text.split(/\s+/).filter(w => w.length > 3);
        const uniqueWords = [...new Set(words)].slice(0, limit);
        return { success: true, data: uniqueWords };
      }

      const response = await fetch(`${this.baseUrl}/keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text, limit }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      return { success: true, data: data.keywords };
    } catch (error) {
      logger.error('Extract keywords error:', error);
      return { success: false, error: 'Failed to extract keywords' };
    }
  }

  // Mock 方法
  private mockSummary(content: string, maxLength: number): AIResponse<SummaryResult> {
    const words = content.split(/\s+/);
    const summary = words.slice(0, Math.min(maxLength, words.length)).join(' ');
    const keywords = words
      .filter(w => w.length > 4)
      .slice(0, 5)
      .map(w => w.toLowerCase().replace(/[^\w]/g, ''));

    return {
      success: true,
      data: {
        summary: summary + (words.length > maxLength ? '...' : ''),
        keywords,
        readingTime: Math.ceil(words.length / 200),
      },
    };
  }

  private mockClassification(text: string): AIResponse<ClassificationResult> {
    const categories = ['技术', '生活', '设计', '开发', '其他'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const tags = text
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 5)
      .map(w => w.toLowerCase());

    return {
      success: true,
      data: {
        category,
        confidence: Math.random() * 0.3 + 0.7,
        tags,
      },
    };
  }

  private mockRecommendations(
    currentPost: { title: string; tags: string[] },
    allPosts: Array<{ title: string; tags: string[] }>,
    limit: number
  ): AIResponse<string[]> {
    const recommendations = allPosts
      .filter(post => post.title !== currentPost.title)
      .filter(post => post.tags.some(tag => currentPost.tags.includes(tag)))
      .slice(0, limit)
      .map(post => post.title);

    return {
      success: true,
      data: recommendations.length > 0 ? recommendations : allPosts.slice(0, limit).map(p => p.title),
    };
  }

  /**
   * 设置 API 密钥
   */
  setApiKey(key: string) {
    this.apiKey = key;
    this.isMock = !key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_api_key', key);
    }
  }

  /**
   * 检查服务是否可用
   */
  isAvailable(): boolean {
    return !this.isMock;
  }
}

// 导出单例
export const aiService = new AIService();

// 导出类型
export type { AIService };
