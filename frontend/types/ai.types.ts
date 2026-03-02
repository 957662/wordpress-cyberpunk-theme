/**
 * AI 相关类型定义
 */

import { Message } from '@/components/ai/ChatAssistant';
import { GenerationConfig, GeneratedImage } from '@/components/ai/ImageGenerator';
import { CodeSuggestion } from '@/components/ai/CodeAssistant';

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
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

/**
 * 聊天完成响应
 */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
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
 * 流式聊天块
 */
export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

/**
 * 图片生成请求
 */
export interface ImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  style?: 'vivid' | 'natural';
  quality?: 'standard' | 'hd';
}

/**
 * 图片生成响应
 */
export interface ImageGenerationResponse {
  id: string;
  object: string;
  created: number;
  data: Array<{
    url: string;
    revised_prompt?: string;
    b64_json?: string;
  }>;
}

/**
 * 图片编辑请求
 */
export interface ImageEditRequest {
  image: string | File;
  mask?: string | File;
  prompt: string;
  n?: number;
  size?: string;
}

/**
 * 图片变体请求
 */
export interface ImageVariationRequest {
  image: string | File;
  n?: number;
  size?: string;
}

/**
 * 嵌入请求
 */
export interface EmbeddingRequest {
  input: string | string[];
  model?: string;
}

/**
 * 嵌入响应
 */
export interface EmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * 音频转文字请求
 */
export interface AudioTranscriptionRequest {
  file: File;
  model?: string;
  language?: string;
  prompt?: string;
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  temperature?: number;
}

/**
 * 音频转文字响应
 */
export interface AudioTranscriptionResponse {
  text: string;
  task?: string;
  language?: string;
  duration?: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

/**
 * 文字转音频请求
 */
export interface AudioSpeechRequest {
  input: string;
  model?: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac';
  speed?: number;
}

/**
 * 内容审核请求
 */
export interface ModerationRequest {
  input: string | string[];
  model?: string;
}

/**
 * 内容审核响应
 */
export interface ModerationResponse {
  id: string;
  model: string;
  results: Array<{
    flagged: boolean;
    categories: {
      hate: boolean;
      'hate/threatening': boolean;
      'self-harm': boolean;
      sexual: boolean;
      'sexual/minors': boolean;
      violence: boolean;
      'violence/graphic': boolean;
    };
    category_scores: {
      hate: number;
      'hate/threatening': number;
      'self-harm': number;
      sexual: number;
      'sexual/minors': number;
      violence: number;
      'violence/graphic': number;
    };
  }>;
}

/**
 * AI 错误类型
 */
export interface AIError {
  message: string;
  type: string;
  code?: string;
  param?: string;
}

/**
 * AI 使用情况
 */
export interface AIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * AI 模型信息
 */
export interface AIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

/**
 * 模型列表响应
 */
export interface ModelsResponse {
  object: string;
  data: AIModel[];
}

/**
 * AI 工具定义
 */
export interface AITool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: {
      type: string;
      properties?: Record<string, any>;
      required?: string[];
    };
  };
}

/**
 * 函数调用
 */
export interface FunctionCall {
  name: string;
  arguments: string;
}

/**
 * 助手创建请求
 */
export interface AssistantCreateRequest {
  model: string;
  name?: string;
  description?: string;
  instructions?: string;
  tools?: AITool[];
  file_ids?: string[];
}

/**
 * 助手对象
 */
export interface Assistant {
  id: string;
  object: string;
  created_at: number;
  name?: string;
  description?: string;
  model: string;
  instructions?: string;
  tools: AITool[];
  file_ids: string[];
}

/**
 * 线程创建请求
 */
export interface ThreadCreateRequest {
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
    file_ids?: string[];
  }>;
}

/**
 * 线程对象
 */
export interface Thread {
  id: string;
  object: string;
  created_at: number;
  metadata?: Record<string, string>;
}

/**
 * 运行创建请求
 */
export interface RunCreateRequest {
  assistant_id: string;
  model?: string;
  instructions?: string;
  tools?: AITool[];
}

/**
 * 运行对象
 */
export interface Run {
  id: string;
  object: string;
  created_at: number;
  assistant_id: string;
  thread_id: string;
  status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired';
  required_action?: any;
  last_error?: any;
  expires_at?: number;
  started_at?: number;
  cancelled_at?: number;
  failed_at?: number;
  completed_at?: number;
  model?: string;
  instructions?: string;
  tools?: AITool[];
  file_ids?: string[];
}

/**
 * AI 流式回调
 */
export interface AIStreamCallbacks {
  onToken?: (token: string) => void;
  onDone?: () => void;
  onError?: (error: AIError) => void;
}

/**
 * AI 响应选项
 */
export interface AIResponseOptions {
  stream?: boolean;
  onData?: (data: any) => void;
  onError?: (error: AIError) => void;
  onDone?: () => void;
}
