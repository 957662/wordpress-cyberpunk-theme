'use client';

/**
 * AI Chat Assistant Component
 * AI聊天助手组件，支持流式响应、多轮对话、上下文记忆
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface AIChatAssistantProps {
  /**
   * API端点
   */
  endpoint?: string;
  /**
   * 初始消息
   */
  initialMessage?: string;
  /**
   * 最大消息数
   */
  maxMessages?: number;
  /**
   * 是否显示会话历史
   */
  showSessions?: boolean;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 主题颜色
   */
  themeColor?: string;
  /**
   * 完全展开
   */
  defaultExpanded?: boolean;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  endpoint = '/api/ai/chat',
  initialMessage = '你好！我是AI助手，有什么可以帮助你的吗？',
  maxMessages = 50,
  showSessions = true,
  className,
  themeColor = '#00f0ff',
  defaultExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 保存会话
  useEffect(() => {
    const session: ChatSession = {
      id: currentSessionId,
      title: messages.find(m => m.role === 'user')?.content.slice(0, 30) + '...' || '新对话',
      messages,
      createdAt: new Date(),
    };

    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== currentSessionId);
      return [session, ...filtered].slice(0, 10);
    });
  }, [messages, currentSessionId]);

  // 发送消息
  const sendMessage = async () => {
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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('API请求失败');

      // 创建流式消息
      const assistantMessageId = Date.now().toString() + '-assistant';
      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (reader) {
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

                accumulatedContent += content;

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              } catch (e) {
                console.error('解析流式数据失败:', e);
              }
            }
          }
        }
      }

      // 完成流式传输
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '-error',
          role: 'assistant',
          content: '抱歉，我遇到了一些问题。请稍后再试。',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 开始新会话
  const startNewSession = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([
      {
        id: 'welcome-' + newSessionId,
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date(),
      },
    ]);
  };

  // 切换会话
  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  // 键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg',
            'bg-gradient-to-r from-cyan-500 to-purple-600',
            'hover:shadow-cyan-500/50 transition-shadow',
            'group'
          )}
          style={{ boxShadow: `0 0 20px ${themeColor}40` }}
        >
          <Bot className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </motion.button>
      )}

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]',
              'bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30',
              'flex flex-col overflow-hidden',
              className
            )}
            style={{ borderColor: themeColor + '4d' }}
          >
            {/* 头部 */}
            <div
              className="flex items-center justify-between p-4 border-b border-cyan-500/20"
              style={{ borderBottomColor: themeColor + '33' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-6 h-6 text-cyan-400" />
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI助手</h3>
                  <p className="text-xs text-gray-400">在线</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* 会话列表 */}
            {showSessions && !isMinimized && sessions.length > 1 && (
              <div className="p-2 border-b border-cyan-500/10 flex gap-2 overflow-x-auto">
                <button
                  onClick={startNewSession}
                  className="px-3 py-1.5 text-sm bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors whitespace-nowrap"
                >
                  + 新对话
                </button>
                {sessions.slice(0, 3).map(session => (
                  <button
                    key={session.id}
                    onClick={() => switchSession(session.id)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap',
                      session.id === currentSessionId
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    {session.title.slice(0, 15)}...
                  </button>
                ))}
              </div>
            )}

            {/* 消息列表 */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                          : 'bg-white/10 text-gray-100'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block ml-1 w-2 h-4 bg-cyan-400 animate-pulse" />
                        )}
                      </p>
                      <p className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/10 rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* 输入框 */}
            {!isMinimized && (
              <div className="p-4 border-t border-cyan-500/20">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息..."
                    rows={1}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none overflow-hidden"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      'p-2 rounded-xl transition-all',
                      input.trim() && !isLoading
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105'
                        : 'bg-white/10 cursor-not-allowed opacity-50'
                    )}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
