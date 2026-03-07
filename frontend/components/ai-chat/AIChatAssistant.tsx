'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  initialMessage?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'cyber' | 'neon' | 'holo';
  onMessageSend?: (message: string) => Promise<string>;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  initialMessage = '你好！我是 AI 助手，有什么可以帮你的吗？',
  position = 'bottom-right',
  theme = 'cyber',
  onMessageSend,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟 AI 响应或使用传入的回调
    let response = '';
    if (onMessageSend) {
      try {
        response = await onMessageSend(inputValue);
      } catch (error) {
        response = '抱歉，我遇到了一些问题。请稍后再试。';
      }
    } else {
      // 默认模拟响应
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = generateMockResponse(inputValue);
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const generateMockResponse = (input: string): string => {
    const responses = [
      '这是一个很有趣的问题！让我来帮你分析一下...',
      '根据我的理解，你可以尝试这样做...',
      '我明白你的需求了。这里有一些建议...',
      '让我为你提供一些相关信息...',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };
    return positions[position];
  };

  const getThemeClasses = () => {
    const themes = {
      cyber: 'bg-cyber-dark/95 border-cyber-cyan/50 shadow-cyber-cyan/20',
      neon: 'bg-purple-900/95 border-cyber-pink/50 shadow-cyber-pink/20',
      holo: 'bg-cyan-900/95 border-cyber-cyan/50 shadow-cyber-cyan/20',
    };
    return themes[theme];
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-cyber-dark to-cyber-muted border-2 border-cyber-cyan rounded-full p-4 hover:border-cyber-purple transition-all duration-300">
              <Bot className="w-6 h-6 text-cyber-cyan" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-pink rounded-full animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`w-96 h-[600px] rounded-2xl border-2 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden ${getThemeClasses()}`}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-cyber-muted/50 to-cyber-dark/50 border-b border-cyber-cyan/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyber-green rounded-full border-2 border-cyber-dark" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">AI 助手</h3>
                    <p className="text-cyber-cyan text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      在线
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-cyber-cyan/20 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-cyber-cyan" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-cyber-cyan" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-cyber-pink/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-cyber-pink" />
                  </button>
                </div>
              </div>

              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent pointer-events-none" />
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyber-cyan/30 scrollbar-track-transparent">
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-cyber-purple/50 border border-cyber-purple'
                          : 'bg-cyber-cyan/20 border border-cyber-cyan'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-cyber-purple" />
                        ) : (
                          <Bot className="w-4 h-4 text-cyber-cyan" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-[75%] ${
                        message.role === 'user' ? 'text-right' : ''
                      }`}>
                        <div className={`inline-block px-4 py-2 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-cyber-purple to-cyber-pink text-white'
                            : 'bg-cyber-muted/50 border border-cyber-cyan/30 text-cyber-cyan'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p className="text-xs text-cyber-cyan/50 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-cyan/20 border border-cyber-cyan flex items-center justify-center">
                        <Bot className="w-4 h-4 text-cyber-cyan" />
                      </div>
                      <div className="bg-cyber-muted/50 border border-cyber-cyan/30 px-4 py-2 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-cyber-cyan/30 p-4 bg-cyber-dark/30">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入你的消息..."
                      className="flex-1 bg-cyber-muted/30 border border-cyber-cyan/30 rounded-xl px-4 py-3 text-white placeholder-cyber-cyan/50 focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white p-3 rounded-xl hover:shadow-lg hover:shadow-cyber-cyan/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatAssistant;
