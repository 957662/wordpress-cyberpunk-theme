/**
 * AI Service
 * AI 服务，集成多种 AI 功能
 */

// Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onError?: (error: Error) => void;
}

export interface TextCompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageGenerationOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  style?: 'vivid' | 'natural';
  quality?: 'standard' | 'hd';
}

export interface GeneratedImage {
  url: string;
  revisedPrompt?: string;
}

export interface SummarizationOptions {
  maxLength?: number;
  format?: 'paragraph' | 'bullets' | 'numbered';
  language?: string;
}

export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  emotions?: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
}

export interface KeywordExtractionResult {
  keywords: Array<{
    text: string;
    score: number;
    count: number;
  }>;
}

/**
 * AI Service Class
 */
class AIService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai';
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
  }

  /**
   * 聊天对话
   */
  async chat(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<AsyncGenerator<string, void, unknown> | string> {
    const {
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 1000,
      stream = true,
      onError,
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.statusText}`);
      }

      // 流式响应
      if (stream) {
        return this.parseStreamResponse(response.body!);
      }

      // 非流式响应
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  }

  /**
   * 解析流式响应
   */
  private async *parseStreamResponse(
    stream: ReadableStream<Uint8Array>
  ): AsyncGenerator<string, void, unknown> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                yield content;
              }
            } catch (e) {
              // 跳过无效 JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 文本补全
   */
  async completeText(
    prompt: string,
    options: ChatCompletionOptions = {}
  ): Promise<TextCompletionResponse> {
    try {
      const messages: ChatMessage[] = [
        { role: 'user', content: prompt },
      ];

      const content = await this.chat(messages, { ...options, stream: false });

      return {
        text: content as string,
        usage: {
          promptTokens: prompt.length / 4, // 估算
          completionTokens: (content as string).length / 4,
          totalTokens: (prompt.length + (content as string).length) / 4,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 文本摘要
   */
  async summarizeText(
    text: string,
    options: SummarizationOptions = {}
  ): Promise<string> {
    const { maxLength = 200, format = 'paragraph', language = '中文' } = options;

    const formatInstruction = {
      paragraph: '段落形式',
      bullets: '项目符号列表',
      numbered: '编号列表',
    };

    const prompt = `请用${language}将以下文本总结为${maxLength}字以内，使用${formatInstruction[format]}：\n\n${text}`;

    const result = await this.completeText(prompt, { temperature: 0.3 });
    return result.text;
  }

  /**
   * 情感分析
   */
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    const prompt = `分析以下文本的情感倾向，返回 JSON 格式：
{
  "sentiment": "positive|neutral|negative",
  "score": -1到1之间的数字,
  "confidence": 0到1之间的数字,
  "emotions": {
    "joy": 0到1之间的数字,
    "sadness": 0到1之间的数字,
    "anger": 0到1之间的数字,
    "fear": 0到1之间的数字,
    "surprise": 0到1之间的数字
  }
}

文本：${text}`;

    try {
      const result = await this.completeText(prompt, { temperature: 0.1 });
      const parsed = JSON.parse(result.text);
      return parsed;
    } catch (error) {
      // 返回默认值
      return {
        sentiment: 'neutral',
        score: 0,
        confidence: 0.5,
      };
    }
  }

  /**
   * 关键词提取
   */
  async extractKeywords(text: string, topK: number = 10): Promise<KeywordExtractionResult> {
    const prompt = `从以下文本中提取前${topK}个关键词，返回 JSON 格式：
{
  "keywords": [
    { "text": "关键词", "score": 相关性分数, "count": 出现次数 }
  ]
}

文本：${text}`;

    try {
      const result = await this.completeText(prompt, { temperature: 0.2 });
      const parsed = JSON.parse(result.text);
      return parsed;
    } catch (error) {
      return { keywords: [] };
    }
  }

  /**
   * 图像生成
   */
  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage[]> {
    const { prompt, size = '1024x1024', style = 'vivid', quality = 'standard' } = options;

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          size,
          style,
          quality,
          n: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`图像生成失败: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 文本翻译
   */
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    const sourceInstruction = sourceLanguage ? `从${sourceLanguage}` : '';
    const prompt = `请${sourceInstruction}翻译为${targetLanguage}：\n\n${text}`;

    const result = await this.completeText(prompt, { temperature: 0.1 });
    return result.text;
  }

  /**
   * 语法检查
   */
  async checkGrammar(text: string): Promise<{
    correctedText: string;
    suggestions: Array<{
      original: string;
      correction: string;
      explanation: string;
    }>;
  }> {
    const prompt = `检查以下文本的语法和拼写错误，返回 JSON 格式：
{
  "correctedText": "修正后的文本",
  "suggestions": [
    {
      "original": "原文",
      "correction": "修正",
      "explanation": "解释"
    }
  ]
}

文本：${text}`;

    try {
      const result = await this.completeText(prompt, { temperature: 0.1 });
      return JSON.parse(result.text);
    } catch (error) {
      return {
        correctedText: text,
        suggestions: [],
      };
    }
  }

  /**
   * 代码生成
   */
  async generateCode(
    description: string,
    language: string = 'javascript'
  ): Promise<string> {
    const prompt = `请用${language}编写以下功能的代码，只返回代码，不需要解释：\n\n${description}`;

    const result = await this.completeText(prompt, { temperature: 0.3 });
    return result.text;
  }

  /**
   * 代码解释
   */
  async explainCode(code: string, language?: string): Promise<string> {
    const lang = language ? `的${language}` : '';
    const prompt = `请详细解释以下${lang}代码的功能：\n\n\`\`\`\n${code}\n\`\`\``;

    const result = await this.completeText(prompt, { temperature: 0.3 });
    return result.text;
  }

  /**
   * 文本重写
   */
  async rewriteText(
    text: string,
    tone: 'formal' | 'casual' | 'professional' | 'friendly' = 'professional'
  ): Promise<string> {
    const toneMap = {
      formal: '正式',
      casual: '随意',
      professional: '专业',
      friendly: '友好',
    };

    const prompt = `请将以下文本重写为${toneMap[tone]}的语气：\n\n${text}`;

    const result = await this.completeText(prompt, { temperature: 0.5 });
    return result.text;
  }
}

// 导出单例
export const aiService = new AIService();

// 默认导出
export default AIService;
