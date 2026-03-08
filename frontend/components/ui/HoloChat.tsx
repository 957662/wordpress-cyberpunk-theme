/**
 * Holographic Chat Interface
 * 全息聊天界面组件
 *
 * 赛博朋克风格的 AI 聊天界面，带有全息效果和动画
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Zap,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface HoloChatProps {
  className?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<string>;
  botName?: string;
  botAvatar?: string;
}

export function HoloChat({
  className = '',
  initialMessages = [],
  onSendMessage,
  botName = 'AI Assistant',
  botAvatar,
}: HoloChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 模拟 AI 响应
    if (onSendMessage) {
      try {
        const response = await onSendMessage(input);
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
      }
    } else {
      // 默认响应
      setTimeout(() => {
        const responses = [
          '这是一个很有趣的问题！让我来帮你解答。',
          '我理解你的意思。在赛博朋克的世界里，一切皆有可能。',
          '收到你的消息了！我正在思考最佳答案...',
          '这是一个很棒的想法！让我们一起探索更多可能性。',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);
    }

    setIsTyping(false);
  };

  // 处理复制消息
  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 处理删除消息
  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // 清空所有消息
  const handleClearAll = () => {
    setMessages([]);
  };

  // 键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`cyber-card flex flex-col ${className} ${isMinimized ? 'h-auto' : 'h-[600px]'}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-border/50 bg-cyber-dark/50">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center">
              {botAvatar ? (
                <img src={botAvatar} alt={botName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <Bot className="w-6 h-6 text-white" />
              )}
            </div>
            <motion.div
              className="absolute -inset-1 rounded-full border border-cyber-cyan/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">{botName}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">在线</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClearAll}
            className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
            title="清空聊天"
          >
            <Trash2 className="w-5 h-5 text-gray-400 hover:text-cyber-pink" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
            title={isMinimized ? '展开' : '最小化'}
          >
            {isMinimized ? (
              <Maximize2 className="w-5 h-5 text-gray-400 hover:text-cyber-cyan" />
            ) : (
              <Minimize2 className="w-5 h-5 text-gray-400 hover:text-cyber-cyan" />
            )}
          </motion.button>
        </div>
      </div>

      {/* 消息区域 */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* 头像 */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-cyber-pink to-cyber-orange'
                        : 'bg-gradient-to-br from-cyber-cyan to-cyber-purple'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className="relative group">
                    <div
                      className={`p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-cyber-pink to-cyber-orange text-white'
                          : 'bg-cyber-card border border-cyber-border/50 text-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* 操作按钮 */}
                    <div
                      className={`absolute ${
                        message.role === 'user' ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
                      } top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(message.content, message.id)}
                        className="p-1.5 bg-cyber-dark/80 rounded-lg hover:bg-cyber-cyan/20 transition-colors"
                        title="复制"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(message.id)}
                        className="p-1.5 bg-cyber-dark/80 rounded-lg hover:bg-cyber-pink/20 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </div>

                    {/* 时间戳 */}
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* 正在输入指示器 */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-cyber-card border border-cyber-border/50 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-cyber-cyan rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyber-cyan rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyber-cyan rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 输入区域 */}
      {!isMinimized && (
        <div className="p-4 border-t border-cyber-border/50 bg-cyber-dark/50">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              className="flex-1 px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isTyping ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  思考中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  发送
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* 全息效果装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}

// 使用示例
export function HoloChatExample() {
  const handleSendMessage = async (message: string) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `我收到了你的消息："${message}"。这是一个很棒的问题！`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <HoloChat
        onSendMessage={handleSendMessage}
        botName="Cyber Assistant"
      />
    </div>
  );
}
