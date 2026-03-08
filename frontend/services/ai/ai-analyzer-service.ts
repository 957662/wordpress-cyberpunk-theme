/**
 * AI Analyzer Service
 * AI 内容分析服务 - 使用 AI 分析文章内容、生成摘要等
 */

export interface AnalysisResult {
  summary: string;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  readingTime: number;
  language: string;
  suggestedTags: string[];
  suggestedCategory?: string;
}

export interface ContentQuality {
  score: number;
  readability: number;
  engagement: number;
  seo: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
  }>;
}

export interface RelatedContent {
  posts: Array<{
    id: number;
    title: string;
    excerpt: string;
    similarity: number;
  }>;
}

export interface SEOAnalysis {
  titleScore: number;
  descriptionScore: number;
  contentScore: number;
  keywords: Array<{
    keyword: string;
    density: number;
    position: 'title' | 'content' | 'both';
  }>;
  suggestions: string[];
}

export interface TextGenerationOptions {
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  length?: 'short' | 'medium' | 'long';
  language?: string;
}

class AIAnalyzerService {
  private apiEndpoint: string;
  private apiKey?: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(config: { apiEndpoint: string; apiKey?: string }) {
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
    this.cache = new Map();
  }

  private getCacheKey(method: string, content: string): string {
    return `${method}:${content.substring(0, 100)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async request(endpoint: string, body: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.apiEndpoint}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Analyze content and generate insights
   */
  async analyzeContent(content: string, title?: string): Promise<AnalysisResult> {
    const cacheKey = this.getCacheKey('analyze', content);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.request('/analyze', {
        content,
        title,
      });

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to analyze content:', error);

      // Fallback to basic analysis
      return this.basicAnalysis(content);
    }
  }

  /**
   * Basic analysis without AI
   */
  private basicAnalysis(content: string): AnalysisResult {
    const words = content.split(/\s+/);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Extract keywords (simple frequency-based)
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      if (clean.length > 3) {
        wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
      }
    });

    const keywords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Generate summary (first paragraph)
    const summary = content.split('\n\n')[0].substring(0, 200) + '...';

    return {
      summary,
      keywords,
      sentiment: 'neutral',
      topics: [],
      readingTime,
      language: 'en',
      suggestedTags: keywords.slice(0, 5),
    };
  }

  /**
   * Check content quality
   */
  async checkQuality(content: string, title?: string): Promise<ContentQuality> {
    const cacheKey = this.getCacheKey('quality', content);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.request('/quality', {
        content,
        title,
      });

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to check quality:', error);
      return this.basicQualityCheck(content, title);
    }
  }

  /**
   * Basic quality check without AI
   */
  private basicQualityCheck(content: string, title?: string): ContentQuality {
    const issues: ContentQuality['issues'] = [];

    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push({
        type: 'warning',
        message: 'Content is too short',
        suggestion: 'Consider adding more detail to reach at least 300 words',
      });
    }

    // Check title length
    if (title) {
      if (title.length < 30) {
        issues.push({
          type: 'warning',
          message: 'Title is too short',
          suggestion: 'Aim for 30-60 characters for better SEO',
        });
      }
      if (title.length > 60) {
        issues.push({
          type: 'warning',
          message: 'Title is too long',
          suggestion: 'Keep titles under 60 characters for optimal display',
        });
      }
    }

    // Check for paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length < 3) {
      issues.push({
        type: 'info',
        message: 'Consider using more paragraphs',
        suggestion: 'Break content into multiple paragraphs for better readability',
      });
    }

    // Calculate scores
    const readability = Math.min(100, Math.max(0, 100 - (issues.length * 10)));
    const engagement = Math.min(100, Math.max(0, 70 + (wordCount > 500 ? 20 : 0)));
    const seo = Math.min(100, Math.max(0, 80 - (issues.filter(i => i.type === 'warning').length * 15)));
    const score = Math.round((readability + engagement + seo) / 3);

    return {
      score,
      readability,
      engagement,
      seo,
      issues,
    };
  }

  /**
   * Find related content
   */
  async findRelatedPosts(postId: number, content: string, limit: number = 5): Promise<RelatedContent> {
    const cacheKey = this.getCacheKey('related', content);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.request('/related', {
        post_id: postId,
        content,
        limit,
      });

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to find related posts:', error);
      return { posts: [] };
    }
  }

  /**
   * Analyze SEO
   */
  async analyzeSEO(content: string, title: string, metaDescription?: string): Promise<SEOAnalysis> {
    const cacheKey = this.getCacheKey('seo', content + title);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.request('/seo', {
        content,
        title,
        meta_description: metaDescription,
      });

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to analyze SEO:', error);
      return this.basicSEOAnalysis(content, title, metaDescription);
    }
  }

  /**
   * Basic SEO analysis without AI
   */
  private basicSEOAnalysis(content: string, title: string, metaDescription?: string): SEOAnalysis {
    const suggestions: string[] = [];
    const keywords: SEOAnalysis['keywords'] = [];

    // Title analysis
    let titleScore = 100;
    if (title.length < 30 || title.length > 60) {
      titleScore = 50;
      suggestions.push('Optimize title length to 30-60 characters');
    }

    // Description analysis
    let descriptionScore = 100;
    if (!metaDescription) {
      descriptionScore = 0;
      suggestions.push('Add a meta description');
    } else if (metaDescription.length < 120 || metaDescription.length > 160) {
      descriptionScore = 50;
      suggestions.push('Optimize meta description length to 120-160 characters');
    }

    // Content analysis
    let contentScore = 100;
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      contentScore = 50;
      suggestions.push('Content should be at least 300 words');
    }

    // Extract keywords from title and content
    const titleWords = title.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);
    const allWords = [...titleWords, ...contentWords];

    const wordFreq = new Map<string, number>();
    allWords.forEach(word => {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean.length > 3 && !this.isStopWord(clean)) {
        wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
      }
    });

    const topKeywords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, freq]) => ({
        keyword: word,
        density: (freq / allWords.length) * 100,
        position: titleWords.includes(word) ? 'title' : 'content' as 'title' | 'content',
      }));

    keywords.push(...topKeywords);

    return {
      titleScore,
      descriptionScore,
      contentScore,
      keywords,
      suggestions,
    };
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has'];
    return stopWords.includes(word);
  }

  /**
   * Generate summary
   */
  async generateSummary(content: string, maxLength: number = 200): Promise<string> {
    const cacheKey = this.getCacheKey('summary', content);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.request('/summarize', {
        content,
        max_length: maxLength,
      });

      this.setCache(cacheKey, result.summary);
      return result.summary;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      return content.substring(0, maxLength) + '...';
    }
  }

  /**
   * Suggest tags
   */
  async suggestTags(content: string, title?: string, limit: number = 10): Promise<string[]> {
    const analysis = await this.analyzeContent(content, title);
    return analysis.suggestedTags.slice(0, limit);
  }

  /**
   * Generate excerpt
   */
  async generateExcerpt(content: string, maxLength: number = 160): Promise<string> {
    const summary = await this.generateSummary(content, maxLength);
    return summary.substring(0, maxLength);
  }

  /**
   * Improve content
   */
  async improveContent(content: string, options: TextGenerationOptions = {}): Promise<string> {
    try {
      const result = await this.request('/improve', {
        content,
        ...options,
      });
      return result.improved_content;
    } catch (error) {
      console.error('Failed to improve content:', error);
      return content;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Create singleton instance
let aiAnalyzerService: AIAnalyzerService | null = null;

export function initAIAnalyzer(config: { apiEndpoint: string; apiKey?: string }): AIAnalyzerService {
  if (!aiAnalyzerService) {
    aiAnalyzerService = new AIAnalyzerService(config);
  }
  return aiAnalyzerService;
}

export function getAIAnalyzer(): AIAnalyzerService | null {
  return aiAnalyzerService;
}

export default AIAnalyzerService;
