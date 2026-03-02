'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantChatProps {
  className?: string;
  initialMessage?: string;
  onMessageSend?: (message: string) => Promise<string>;
  context?: string;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  className = '',
  initialMessage = '你好！我是 AI 助手，有什么可以帮助你的吗？',
  onMessageSend,
  context = 'general'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response = '';
      if (onMessageSend) {
        response = await onMessageSend(input);
      } else {
        // 模拟 AI 响应
        await new Promise((resolve) => setTimeout(resolve, 1000));
        response = generateMockResponse(input);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userInput: string): string => {
    const responses = [
      `关于 "${userInput}" 的理解...\n\n这是一个很好的问题！根据我的分析，我可以提供以下见解：\n\n1. **技术角度**：这个话题涉及到现代 Web 开发的核心概念\n2. **实践应用**：在实际项目中，我们可以这样实现...\n3. **最佳实践**：建议关注性能优化和用户体验`,
      `我理解你想了解 "${userInput}"。\n\n让我为你详细解答：\n\n• **核心概念**：这是前端开发中的重要主题\n• **实现方式**：可以使用 React/Next.js 来构建\n• **优化建议**：注意代码可维护性和性能\n\n需要我进一步解释吗？`,
      `"${userInput}" 是一个有趣的话题！\n\n根据我的知识库：\n\n1️⃣ 首先，我们需要理解基础概念\n2️⃣ 然后，掌握核心技术栈\n3️⃣ 最后，通过实践来巩固知识\n\n你想深入了解哪个方面？`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        fixed bottom-6 right-6 z-50
        ${isMinimized ? 'w-auto' : 'w-96'}
        ${className}
      `}
    >
      <div className="bg-dark-bg border border-cyber-cyan/30 rounded-2xl shadow-neon-cyan overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 p-4 border-b border-cyber-cyan/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-6 h-6 text-cyber-cyan" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-cyber-pink" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI 助手</h3>
                <p className="text-xs text-gray-400">在线 · 随时为您服务</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-cyber-cyan/20 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="h-96 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-3
                      ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white'
                          : 'bg-dark-bg/80 border border-dark-border text-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex-shrink-0 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <span className="text-xs opacity-60 mt-2 block">
                      {message.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyber-pink to-cyber-purple flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-dark-bg/80 border border-dark-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-2 bg-cyber-cyan rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                        className="w-2 h-2 bg-cyber-purple rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                        className="w-2 h-2 bg-cyber-pink rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 border-t border-cyber-cyan/30"
            >
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="输入你的问题..."
                  rows={1}
                  className="
                    flex-1 bg-dark-bg/50 border border-dark-border
                    rounded-xl px-4 py-3 text-sm text-white
                    placeholder-gray-500 resize-none
                    focus:outline-none focus:border-cyber-cyan/50
                    transition-colors
                  "
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="
                    px-4 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple
                    rounded-xl text-white font-medium
                    hover:shadow-neon-cyan transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                按 Enter 发送，Shift + Enter 换行
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AIAssistantChat;
