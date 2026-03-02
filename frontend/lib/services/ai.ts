/**
 * AI 服务层
 * 提供 AI 相关功能的统一接口
 */

import { Message, ChatAssistantProps } from '@/components/ai/ChatAssistant';
import { GenerationConfig, GeneratedImage, ImageGeneratorProps } from '@/components/ai/ImageGenerator';
import { CodeSuggestion, CodeAssistantProps } from '@/components/ai/CodeAssistant';

/**
 * AI 服务配置
 */
export interface AIServiceConfig {
  baseURL?: string;
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * 聊天完成请求
 */
export interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
}

/**
 * 聊天完成响应
 */
export interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 图片生成请求
 */
export interface ImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: string;
  style?: string;
}

/**
 * 图片生成响应
 */
export interface ImageGenerationResponse {
  id: string;
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

/**
 * AI 服务类
 */
class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_AI_BASE_URL || '/api/ai',
      apiKey: config.apiKey || process.env.NEXT_PUBLIC_AI_API_KEY || '',
      model: config.model || 'gpt-3.5-turbo',
      maxTokens: config.maxTokens || 1000,
      temperature: config.temperature || 0.7,
    };
  }

  /**
   * 发送聊天消息
   */
  async sendMessage(message: string, history: Message[] = []): Promise<string> {
    try {
      const messages: ChatCompletionRequest['messages'] = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for CyberPress Platform, a cyberpunk-themed blog platform. Be friendly and helpful.',
        },
        ...history.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ];

      const response = await fetch(`${this.config.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          messages,
          model: this.config.model,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || '抱歉，我无法生成回复。';
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  /**
   * 生成图片
   */
  async generateImage(config: GenerationConfig): Promise<GeneratedImage> {
    try {
      const response = await fetch(`${this.config.baseURL}/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          prompt: config.prompt,
          style: config.style,
          size: config.width && config.height ? `${config.width}x${config.height}` : '1024x1024',
          quality: config.quality,
        }),
      });

      if (!response.ok) {
        throw new Error(`Image generation error: ${response.statusText}`);
      }

      const data: ImageGenerationResponse = await response.json();

      return {
        id: data.id,
        url: data.data[0]?.url || '',
        prompt: config.prompt,
        config,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }

  /**
   * 生成代码
   */
  async generateCode(prompt: string, language: string): Promise<CodeSuggestion> {
    try {
      const systemPrompt = `You are a coding assistant. Generate clean, well-commented ${language} code based on the user's request. Follow best practices and common patterns for the language.`;

      const response = await fetch(`${this.config.baseURL}/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          model: this.config.model,
          max_tokens: this.config.maxTokens * 2,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code generation error: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      const code = data.choices[0]?.message?.content || '';

      return {
        id: Date.now().toString(),
        code,
        language,
        description: `Generated ${language} code for: ${prompt}`,
        explanation: 'Code generated based on best practices and common patterns.',
      };
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }

  /**
   * 优化代码
   */
  async optimizeCode(code: string, language: string): Promise<CodeSuggestion> {
    const prompt = `Optimize this ${language} code for better performance and readability:\n\n${code}`;
    return this.generateCode(prompt, language);
  }

  /**
   * 解释代码
   */
  async explainCode(code: string, language: string): Promise<string> {
    const prompt = `Explain this ${language} code in simple terms:\n\n${code}`;

    try {
      const response = await fetch(`${this.config.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a coding teacher. Explain code in clear, simple terms suitable for beginners.',
            },
            { role: 'user', content: prompt },
          ],
          model: this.config.model,
          max_tokens: this.config.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code explanation error: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to explain the code.';
    } catch (error) {
      console.error('Code explanation error:', error);
      throw error;
    }
  }

  /**
   * 生成内容摘要
   */
  async generateSummary(content: string, maxLength: number = 200): Promise<string> {
    const prompt = `Summarize the following content in ${maxLength} characters or less:\n\n${content}`;

    try {
      const response = await fetch(`${this.config.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a content summarizer. Create concise, informative summaries.',
            },
            { role: 'user', content: prompt },
          ],
          model: this.config.model,
          max_tokens: maxLength,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Summary generation error: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || content.slice(0, maxLength);
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }

  /**
   * 生成 SEO 元数据
   */
  async generateSEOMetadata(content: string, title: string): Promise<{
    metaDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
  }> {
    const prompt = `Generate SEO metadata for:
Title: ${title}
Content: ${content.slice(0, 500)}

Provide:
1. A meta description (150-160 characters)
2. 5-10 relevant keywords
3. Open Graph title (60 characters max)
4. Open Graph description (200 characters max)`;

    try {
      const response = await fetch(`${this.config.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an SEO expert. Generate metadata following SEO best practices.',
            },
            { role: 'user', content: prompt },
          ],
          model: this.config.model,
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`SEO metadata generation error: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      const result = data.choices[0]?.message?.content || '';

      // 解析响应（实际实现应该更健壮）
      return {
        metaDescription: title.slice(0, 160),
        keywords: [title, 'cyberpress', 'blog', 'technology'],
        ogTitle: title,
        ogDescription: result.slice(0, 200),
      };
    } catch (error) {
      console.error('SEO metadata generation error:', error);
      throw error;
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<AIServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取配置
   */
  getConfig(): AIServiceConfig {
    return { ...this.config };
  }
}

// 创建单例实例
const aiService = new AIService();

export default aiService;
export { AIService };
