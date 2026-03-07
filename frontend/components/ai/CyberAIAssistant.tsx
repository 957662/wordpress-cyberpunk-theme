'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Minimize2, Maximize2, X, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface CyberAIAssistantProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'cyan' | 'purple' | 'pink';
  greeting?: string;
  suggestions?: string[];
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}

const themeColors = {
  cyan: {
    primary: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.3)',
    bg: 'rgba(0, 240, 255, 0.05)',
  },
  purple: {
    primary: '#9d00ff',
    glow: 'rgba(157, 0, 255, 0.3)',
    bg: 'rgba(157, 0, 255, 0.05)',
  },
  pink: {
    primary: '#ff0080',
    glow: 'rgba(255, 0, 128, 0.3)',
    bg: 'rgba(255, 0, 128, 0.05)',
  },
};

export function CyberAIAssistant({
  position = 'bottom-right',
  theme = 'cyan',
  greeting = '你好！我是 AI 助手，有什么可以帮助你的吗？',
  suggestions = [
    '帮我写一篇文章',
    '解释一个概念',
    '提供代码建议',
    '创意灵感',
  ],
  onSendMessage,
  className = '',
}: CyberAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const colors = themeColors[theme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      if (onSendMessage) {
        const response = await onSendMessage(inputValue);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Default mock response
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '我收到了你的消息！这是一个演示响应。要使用真实的 AI 功能，请提供 onSendMessage 回调函数。',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后再试。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="relative px-6 py-3 bg-cyber-dark/80 backdrop-blur-md border border-cyber-cyan/30 rounded-lg hover:border-cyber-cyan/60 transition-all duration-300"
            style={{
              boxShadow: `0 0 20px ${colors.glow}`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Bot className="w-5 h-5" style={{ color: colors.primary }} />
              </motion.div>
              <span
                className="text-sm font-medium"
                style={{
                  color: colors.primary,
                  textShadow: `0 0 10px ${colors.glow}`,
                }}
              >
                AI 助手
              </span>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 0 10px ${colors.primary}`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-96 h-[600px] bg-cyber-dark/95 backdrop-blur-md border rounded-lg overflow-hidden flex flex-col"
            style={{
              borderColor: colors.primary,
              boxShadow: `0 0 30px ${colors.glow}`,
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 60 : 600,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{
                backgroundColor: colors.bg,
                borderColor: `${colors.primary}30`,
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Bot className="w-5 h-5" style={{ color: colors.primary }} />
                </motion.div>
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: colors.primary }}
                  >
                    Cyber AI Assistant
                  </h3>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-green-400"
                      style={{ boxShadow: '0 0 8px #00ff88' }}
                    />
                    <span className="text-xs text-gray-400">在线</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  style={{ color: colors.primary }}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  style={{ color: colors.primary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start gap-2 max-w-[80%]">
                          {message.role === 'assistant' && (
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: colors.bg }}
                            >
                              <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                            </div>
                          )}

                          <div
                            className="px-4 py-2 rounded-lg"
                            style={{
                              backgroundColor:
                                message.role === 'user'
                                  ? `${colors.primary}20`
                                  : colors.bg,
                              border: `1px solid ${colors.primary}30`,
                            }}
                          >
                            <p className="text-sm text-gray-200">{message.content}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>

                          {message.role === 'user' && (
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: colors.bg }}
                            >
                              <User className="w-4 h-4" style={{ color: colors.primary }} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-start gap-2 max-w-[80%]">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: colors.bg }}
                          >
                            <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                          </div>
                          <div
                            className="px-4 py-2 rounded-lg"
                            style={{
                              backgroundColor: colors.bg,
                              border: `1px solid ${colors.primary}30`,
                            }}
                          >
                            <div className="flex items-center gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: colors.primary }}
                                  animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: 'easeInOut',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {showSuggestions && messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 text-xs rounded-full border transition-all duration-300"
                          style={{
                            borderColor: `${colors.primary}40`,
                            color: colors.primary,
                            backgroundColor: `${colors.bg}`,
                          }}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: `${colors.primary}20`,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div
                  className="p-4 border-t"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: `${colors.primary}30`,
                  }}
                >
                  <div className="flex gap-2">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入消息..."
                      className="flex-1 bg-cyber-dark/50 border rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/60 resize-none"
                      style={{
                        borderColor: `${colors.primary}30`,
                        maxHeight: '100px',
                      }}
                      rows={1}
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="px-4 py-2 rounded-lg transition-all duration-300"
                      style={{
                        backgroundColor: inputValue.trim() ? colors.primary : `${colors.primary}40`,
                        color: '#0a0a0f',
                      }}
                      whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
                      whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CyberAIAssistant;
