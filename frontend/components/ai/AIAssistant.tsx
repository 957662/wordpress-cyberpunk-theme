'use client';

/**
 * AIAssistant - AI 助手组件
 * 提供智能对话和辅助功能
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Minimize2,
  Maximize2,
  MessageCircle,
  Lightbulb,
  Code,
  FileText,
  Image,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  /** 是否默认打开 */
  defaultOpen?: boolean;
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 建议的问题 */
  suggestions?: string[];
  /** 自定义样式类名 */
  className?: string;
}

export function AIAssistant({
  defaultOpen = false,
  welcomeMessage = '你好！我是 AI 助手，有什么可以帮助你的吗？',
  suggestions = [
    '如何优化 React 性能？',
    '解释 TypeScript 泛型',
    'Tailwind CSS 最佳实践',
    'Next.js 14 新特性',
  ],
  className = '',
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 模拟 AI 回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (query: string): string => {
    // 简单的模拟回复逻辑
    const responses = [
      '这是一个很好的问题！让我来详细解释...',
      '根据我的理解，这里有几个关键点需要注意...',
      '我建议你可以尝试以下方法...',
      '这是一个常见的问题，解决方案如下...',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const quickActions = [
    { icon: Lightbulb, label: '创意', color: 'text-yellow-400' },
    { icon: Code, label: '代码', color: 'text-cyber-cyan' },
    { icon: FileText, label: '总结', color: 'text-cyber-purple' },
    { icon: Image, label: '分析', color: 'text-cyber-pink' },
  ];

  return (
    <>
      {/* 浮动按钮 */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full shadow-lg shadow-cyber-cyan/30 flex items-center justify-center ${className}`}
        >
          <Bot className="w-7 h-7 text-white" />
        </motion.button>
      )}

      {/* 助手面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-8 right-8 z-50 cyber-card overflow-hidden ${isMinimized ? 'h-auto' : 'w-96 md:w-[450px]'} ${className}`}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border-b border-cyber-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-cyan/20 rounded-lg">
                  <Bot className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI 助手</h3>
                  <p className="text-xs text-gray-400">随时为你服务</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            {!isMinimized && (
              <>
                {/* 快捷操作 */}
                <div className="px-6 py-4 border-b border-cyber-border">
                  <div className="grid grid-cols-4 gap-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAction(action.label)}
                        className={`p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-cyber-cyan/50 transition-colors flex flex-col items-center gap-1 ${selectedAction === action.label ? 'border-cyber-cyan' : ''}`}
                      >
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                        <span className="text-xs text-gray-400">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 消息列表 */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white'
                            : 'bg-cyber-dark/50 border border-cyber-border text-gray-300'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-60 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* 正在输入指示器 */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-cyber-dark/50 border border-cyber-border rounded-2xl px-4 py-3 flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 建议问题 */}
                {messages.length === 1 && (
                  <div className="px-6 py-4 border-t border-cyber-border">
                    <p className="text-xs text-gray-500 mb-3">试试这些问题：</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 bg-cyber-dark/50 border border-cyber-border rounded-full text-xs text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 输入区域 */}
                <div className="p-4 border-t border-cyber-border">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="输入你的问题..."
                      className="flex-1 px-4 py-2 bg-cyber-dark/50 border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="p-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIAssistant;
