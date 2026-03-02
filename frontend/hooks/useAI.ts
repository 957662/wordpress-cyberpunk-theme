/**
 * AI 相关 Hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/components/ai/ChatAssistant';
import { GenerationConfig, GeneratedImage } from '@/components/ai/ImageGenerator';
import { CodeSuggestion } from '@/components/ai/CodeAssistant';
import aiService, { AIServiceConfig } from '@/lib/services/ai';

/**
 * 使用 AI 聊天 Hook
 */
export interface UseAIChatOptions extends AIServiceConfig {
  initialMessages?: Message[];
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (response: string) => void;
}

export interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
}

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const {
    initialMessages = [],
    onMessageSent,
    onMessageReceived,
    ...config
  } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageRef = useRef<string>('');

  // 更新服务配置
  useEffect(() => {
    aiService.updateConfig(config);
  }, [config]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    lastMessageRef.current = message;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    onMessageSent?.(message);

    try {
      const response = await aiService.sendMessage(message, messages);

      // 添加助手回复
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      onMessageReceived?.(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      // 移除用户消息
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, onMessageSent, onMessageReceived]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (!lastMessageRef.current) return;
    await sendMessage(lastMessageRef.current);
  }, [sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
}

/**
 * 使用 AI 图片生成 Hook
 */
export interface UseAIImageOptions extends AIServiceConfig {
  onImageGenerated?: (image: GeneratedImage) => void;
}

export interface UseAIImageReturn {
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
  generateImage: (config: GenerationConfig) => Promise<GeneratedImage | null>;
  clearImages: () => void;
  removeImage: (id: string) => void;
}

export function useAIImage(options: UseAIImageOptions = {}): UseAIImageReturn {
  const { onImageGenerated, ...config } = options;

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (config: GenerationConfig) => {
    setIsGenerating(true);
    setError(null);

    try {
      const image = await aiService.generateImage(config);
      setGeneratedImages((prev) => [image, ...prev]);
      onImageGenerated?.(image);
      return image;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onImageGenerated]);

  const clearImages = useCallback(() => {
    setGeneratedImages([]);
    setError(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  return {
    generatedImages,
    isGenerating,
    error,
    generateImage,
    clearImages,
    removeImage,
  };
}

/**
 * 使用 AI 代码生成 Hook
 */
export interface UseAICodeOptions extends AIServiceConfig {
  onCodeGenerated?: (code: CodeSuggestion) => void;
}

export interface UseAICodeReturn {
  suggestions: CodeSuggestion[];
  isGenerating: boolean;
  error: string | null;
  generateCode: (prompt: string, language: string) => Promise<CodeSuggestion | null>;
  optimizeCode: (code: string, language: string) => Promise<CodeSuggestion | null>;
  explainCode: (code: string, language: string) => Promise<string | null>;
  clearSuggestions: () => void;
  removeSuggestion: (id: string) => void;
}

export function useAICode(options: UseAICodeOptions = {}): UseAICodeReturn {
  const { onCodeGenerated, ...config } = options;

  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = useCallback(async (prompt: string, language: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const suggestion = await aiService.generateCode(prompt, language);
      setSuggestions((prev) => [suggestion, ...prev]);
      onCodeGenerated?.(suggestion);
      return suggestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate code';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onCodeGenerated]);

  const optimizeCode = useCallback(async (code: string, language: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const suggestion = await aiService.optimizeCode(code, language);
      setSuggestions((prev) => [suggestion, ...prev]);
      onCodeGenerated?.(suggestion);
      return suggestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize code';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onCodeGenerated]);

  const explainCode = useCallback(async (code: string, language: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const explanation = await aiService.explainCode(code, language);
      return explanation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to explain code';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  const removeSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    suggestions,
    isGenerating,
    error,
    generateCode,
    optimizeCode,
    explainCode,
    clearSuggestions,
    removeSuggestion,
  };
}

/**
 * 使用 AI 内容生成 Hook
 */
export interface UseAIContentOptions extends AIServiceConfig {
  onContentGenerated?: (content: string, type: 'summary' | 'meta' | 'keywords') => void;
}

export interface UseAIContentReturn {
  isGenerating: boolean;
  error: string | null;
  generateSummary: (content: string, maxLength?: number) => Promise<string | null>;
  generateSEOMetadata: (content: string, title: string) => Promise<any | null>;
}

export function useAIContent(options: UseAIContentOptions = {}): UseAIContentReturn {
  const { onContentGenerated, ...config } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(async (content: string, maxLength = 200) => {
    setIsGenerating(true);
    setError(null);

    try {
      const summary = await aiService.generateSummary(content, maxLength);
      onContentGenerated?.(summary, 'summary');
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onContentGenerated]);

  const generateSEOMetadata = useCallback(async (content: string, title: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const metadata = await aiService.generateSEOMetadata(content, title);
      onContentGenerated?.(JSON.stringify(metadata), 'meta');
      return metadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate SEO metadata';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onContentGenerated]);

  return {
    isGenerating,
    error,
    generateSummary,
    generateSEOMetadata,
  };
}
