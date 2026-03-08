/**
 * AI Summary Service
 * AI 内容摘要服务
 * 使用 OpenAI API 生成文章摘要
 */

interface SummaryRequest {
  content: string;
  maxLength?: number;
  language?: 'zh' | 'en';
  style?: 'concise' | 'detailed' | 'bullet-points';
}

interface SummaryResponse {
  summary: string;
  keyPoints: string[];
  keywords: string[];
  readingTime?: number;
}

interface AISummaryConfig {
  apiKey?: string;
  apiUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

class AISummaryService {
  private config: AISummaryConfig;
  private cache: Map<string, SummaryResponse>;
  private cacheExpiry: number = 30 * 60 * 1000; // 30 minutes

  constructor(config: AISummaryConfig = {}) {
    this.config = {
      apiUrl: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.7,
      ...config,
    };
    this.cache = new Map();
    this.initializeFromEnv();
  }

  private initializeFromEnv() {
    if (typeof window === 'undefined') {
      // Server-side: use environment variables
      this.config.apiKey = process.env.OPENAI_API_KEY || this.config.apiKey;
    } else {
      // Client-side: use window env or session storage
      const clientKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (clientKey) {
        this.config.apiKey = clientKey;
      }
    }
  }

  /**
   * 生成文章摘要
   */
  async generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
    const cacheKey = this.getCacheKey(request);

    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.config.apiKey) {
      // Fallback to simple summary if no API key
      return this.generateSimpleSummary(request);
    }

    try {
      const prompt = this.buildPrompt(request);
      const response = await fetch(this.config.apiUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(request.style || 'concise'),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const summaryText = data.choices[0]?.message?.content || '';

      const result = this.parseSummaryResponse(summaryText, request);

      // Cache the result
      this.setToCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('AI Summary failed:', error);
      // Fallback to simple summary
      return this.generateSimpleSummary(request);
    }
  }

  /**
   * 获取系统提示词
   */
  private getSystemPrompt(style: string): string {
    const basePrompt = 'You are a helpful assistant that summarizes articles. ';
    const stylePrompts = {
      'concise': 'Provide a concise summary in 2-3 sentences.',
      'detailed': 'Provide a detailed summary covering all main points.',
      'bullet-points': 'Provide a summary using bullet points for key information.',
    };

    return basePrompt + (stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.concise);
  }

  /**
   * 构建用户提示词
   */
  private buildPrompt(request: SummaryRequest): string {
    const { content, maxLength = 200, language = 'zh' } = request;

    const truncatedContent = content.slice(0, 3000);

    const prompts = {
      zh: `请为以下文章生成一个摘要（不超过${maxLength}字）：

${truncatedContent}

请提供：
1. 简洁的摘要
2. 3-5个关键点
3. 关键词标签`,
      en: `Please generate a summary for the following article (max ${maxLength} words):

${truncatedContent}

Please provide:
1. A concise summary
2. 3-5 key points
3. Keyword tags`,
    };

    return prompts[language];
  }

  /**
   * 解析 AI 响应
   */
  private parseSummaryResponse(text: string, request: SummaryRequest): SummaryResponse {
    // Try to parse structured response
    const lines = text.split('\n').filter(line => line.trim());

    let summary = text;
    const keyPoints: string[] = [];
    const keywords: string[] = [];

    let currentSection: 'summary' | 'points' | 'keywords' | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.includes('摘要') || trimmedLine.toLowerCase().includes('summary')) {
        currentSection = 'summary';
        continue;
      }

      if (trimmedLine.includes('关键点') || trimmedLine.toLowerCase().includes('key point')) {
        currentSection = 'points';
        continue;
      }

      if (trimmedLine.includes('关键词') || trimmedLine.toLowerCase().includes('keyword')) {
        currentSection = 'keywords';
        continue;
      }

      if (currentSection === 'points') {
        const point = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        if (point) keyPoints.push(point);
      } else if (currentSection === 'keywords') {
        const keyword = trimmedLine.replace(/^[-*•,]\s*/, '').trim();
        if (keyword) keywords.push(keyword);
      }
    }

    // If no structured response found, use the whole text as summary
    if (keyPoints.length === 0 && keywords.length === 0) {
      summary = text;
    }

    return {
      summary,
      keyPoints,
      keywords,
      readingTime: this.calculateReadingTime(request.content),
    };
  }

  /**
   * 生成简单摘要（无 AI API）
   */
  private generateSimpleSummary(request: SummaryRequest): SummaryResponse {
    const { content, maxLength = 200 } = request;

    // Extract first paragraph or sentences
    const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
    const summarySentences = sentences.slice(0, 3);
    const summary = summarySentences.join('。') + '。';

    // Extract potential key points (sentences with common patterns)
    const keyPointPatterns = [
      /(?:首先|第一|首先|需要注意的是|值得注意的是|关键|重要)/,
      /(?:因此|所以|综上|总之|结论)/,
    ];

    const keyPoints = sentences
      .filter(s => keyPointPatterns.some(pattern => pattern.test(s)))
      .slice(0, 5)
      .map(s => s.trim());

    // Extract potential keywords (words that appear frequently)
    const words = content.split(/\s+/);
    const wordFrequency = new Map<string, number>();

    words.forEach(word => {
      const cleaned = word.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '');
      if (cleaned.length >= 2) {
        wordFrequency.set(cleaned, (wordFrequency.get(cleaned) || 0) + 1);
      }
    });

    const keywords = Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return {
      summary: summary.slice(0, maxLength),
      keyPoints,
      keywords,
      readingTime: this.calculateReadingTime(content),
    };
  }

  /**
   * 计算阅读时间
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(request: SummaryRequest): string {
    return `${request.content.slice(0, 100)}-${request.maxLength}-${request.language}-${request.style}`;
  }

  /**
   * 从缓存获取
   */
  private getFromCache(key: string): SummaryResponse | null {
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }
    return null;
  }

  /**
   * 设置缓存
   */
  private setToCache(key: string, value: SummaryResponse): void {
    this.cache.set(key, value);

    // Set expiry
    setTimeout(() => {
      this.cache.delete(key);
    }, this.cacheExpiry);
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * 批量生成摘要
   */
  async generateBatchSummaries(requests: SummaryRequest[]): Promise<SummaryResponse[]> {
    const promises = requests.map(req => this.generateSummary(req));
    return Promise.all(promises);
  }
}

// Create singleton instance
export const aiSummaryService = new AISummaryService();

export default AISummaryService;
