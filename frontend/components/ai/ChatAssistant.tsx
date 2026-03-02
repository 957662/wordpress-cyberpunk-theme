'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Minimize2, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatAssistantProps {
  /**
   * 初始欢迎消息
   */
  welcomeMessage?: string;

  /**
   * 聊天标题
   */
  title?: string;

  /**
   * 发送消息的处理函数
   */
  onSendMessage?: (message: string) => Promise<string>;

  /**
   * 最大展开高度
   */
  maxHeight?: string;

  /**
   * 主题颜色
   */
  themeColor?: 'cyan' | 'purple' | 'pink';

  /**
   * 自定义类名
   */
  className?: string;
}

const themeColors = {
  cyan: {
    primary: 'bg-cyber-cyan',
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan',
    glow: 'shadow-glow-cyan',
  },
  purple: {
    primary: 'bg-cyber-purple',
    text: 'text-cyber-purple',
    border: 'border-cyber-purple',
    glow: 'shadow-glow-purple',
  },
  pink: {
    primary: 'bg-cyber-pink',
    text: 'text-cyber-pink',
    border: 'border-cyber-pink',
    glow: 'shadow-glow-pink',
  },
};

/**
 * AI聊天助手组件
 * 赛博朋克风格的聊天界面
 */
export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  welcomeMessage = '你好！我是AI助手，有什么可以帮助你的吗？',
  title = 'AI 助手',
  onSendMessage,
  maxHeight = '600px',
  themeColor = 'cyan',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const theme = themeColors[themeColor];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (onSendMessage) {
      try {
        const response = await onSendMessage(inputValue);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，我遇到了一些问题。请稍后再试。',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } else {
      // 模拟AI回复
      setTimeout(() => {
        const responses = [
          '这是一个有趣的问题！让我想想...',
          '我理解你的意思了。',
          '这确实需要进一步探讨。',
          '非常好的观点！',
          '让我来帮你分析一下。',
        ];
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            {/* 聊天窗口 */}
            <div
              className={cn(
                'w-96 rounded-lg border-2 overflow-hidden flex flex-col',
                'bg-cyber-card',
                theme.border,
                theme.glow
              )}
              style={{ maxHeight: isMinimized ? 'auto' : maxHeight }}
            >
              {/* 头部 */}
              <div
                className={cn(
                  'flex items-center justify-between px-4 py-3',
                  'bg-cyber-darker border-b-2',
                  theme.border
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      theme.primary,
                      'bg-opacity-20'
                    )}
                  >
                    <Bot className={cn('w-5 h-5', theme.text)} />
                  </div>
                  <div>
                    <h3 className={cn('font-display font-bold text-white', theme.text)}>
                      {title}
                    </h3>
                    <p className="text-xs text-gray-400">AI 驱动</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label={isMinimized ? '展开' : '最小化'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-cyber-pink transition-colors"
                    aria-label="关闭"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* 消息列表 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn(
                            'flex gap-3',
                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          )}
                        >
                          <div
                            className={cn(
                              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                              message.role === 'user'
                                ? 'bg-cyber-purple'
                                : theme.primary
                            )}
                          >
                            {message.role === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-cyber-dark" />
                            )}
                          </div>
                          <div
                            className={cn(
                              'max-w-[70%] px-4 py-2 rounded-lg',
                              message.role === 'user'
                                ? 'bg-cyber-purple text-white'
                                : 'bg-cyber-muted text-gray-200 border',
                              message.role !== 'user' && theme.border
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-50 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* 正在输入指示器 */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                        >
                          <div
                            className={cn(
                              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                              theme.primary
                            )}
                          >
                            <Bot className="w-4 h-4 text-cyber-dark" />
                          </div>
                          <div
                            className={cn(
                              'px-4 py-2 rounded-lg bg-cyber-muted border',
                              theme.border
                            )}
                          >
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 rounded-full bg-cyber-cyan"
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </AnimatePresence>
                  </div>

                  {/* 输入区域 */}
                  <div className="p-4 border-t border-cyber-border">
                    <div className="flex gap-2">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
                        className={cn(
                          'flex-1 px-4 py-2 rounded-lg',
                          'bg-cyber-darker border-2 border-cyber-border',
                          'text-white placeholder:text-gray-500',
                          'focus:outline-none focus:border-cyber-cyan',
                          'resize-none',
                          'min-h-[44px] max-h-[120px]'
                        )}
                        rows={1}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={cn(
                          'px-4 py-2 rounded-lg',
                          theme.primary,
                          'text-cyber-dark font-medium',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'transition-colors'
                        )}
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮动按钮 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center',
          theme.primary,
          theme.glow,
          'shadow-2xl'
        )}
        aria-label={isOpen ? '关闭聊天' : '打开聊天'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-cyber-dark" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-7 h-7 text-cyber-dark" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatAssistant;
