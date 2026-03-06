/**
 * AI 聊天助手组件
 * 提供智能对话、代码生成、文章优化等功能
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  placeholder?: string;
  className?: string;
  onSendMessage?: (message: string) => Promise<string>;
  systemPrompt?: string;
  showSuggestions?: boolean;
  suggestions?: string[];
}

export function AIChatAssistant({
  placeholder = '输入您的问题...',
  className,
  onSendMessage,
  systemPrompt = '你是一个有帮助的AI助手。',
  showSuggestions = true,
  suggestions = ['写一篇博客文章', '优化这段代码', '解释一个概念', '生成创意点子'],
}: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是AI助手，有什么可以帮助您的吗？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;

      if (onSendMessage) {
        response = await onSendMessage(userMessage.content);
      } else {
        // 模拟 AI 响应
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = `这是对"${userMessage.content}"的模拟回复。在实际应用中，这里会连接到真实的AI API（如OpenAI、Claude等）。`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后再试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col h-full bg-gray-900/50 border border-gray-800 rounded-lg', className)}>
      {/* 头部 */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI 助手</h3>
          <p className="text-xs text-gray-400">智能对话与创作助手</p>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* 头像 */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                    : 'bg-gray-800'
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-cyan-400" />
                )}
              </div>

              {/* 消息内容 */}
              <div
                className={cn(
                  'max-w-[70%] rounded-lg p-3',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-100'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* 操作按钮 */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="复制"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                    <button
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="有帮助"
                    >
                      <ThumbsUp className="w-3 h-3 text-gray-400" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="没帮助"
                    >
                      <ThumbsDown className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 加载动画 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 建议提示 */}
      {showSuggestions && messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-2">试试这些：</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className={cn(
              'flex-1 resize-none px-4 py-2',
              'bg-gray-800 border border-gray-700 rounded-lg',
              'text-white placeholder-gray-400',
              'focus:outline-none focus:border-cyan-500',
              'transition-all duration-200',
              'max-h-32'
            )}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={cn(
              'px-4 py-2 rounded-lg',
              'bg-gradient-to-r from-cyan-500 to-purple-500',
              'text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:shadow-lg hover:shadow-cyan-500/25',
              'transition-all duration-200',
              'flex items-center gap-2'
            )}
          >
            {isLoading ? (
              <span className="text-sm">发送中...</span>
            ) : (
              <>
                <span className="hidden sm:inline text-sm">发送</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
}

/**
 * AI 快速操作按钮
 */
interface AIQuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export function AIQuickAction({ icon, label, onClick, className }: AIQuickActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4',
        'bg-gray-900/50 border border-gray-800 rounded-lg',
        'hover:border-cyan-500/50 hover:bg-gray-900',
        'transition-all duration-200',
        className
      )}
    >
      <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
        {icon}
      </div>
      <span className="text-xs text-gray-300">{label}</span>
    </motion.button>
  );
}
