'use client';

/**
 * AI 聊天面板组件
 * 可嵌入到页面的侧边栏或模态框中
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Bot, User, Copy, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  error?: boolean;
}

interface AIChatPanelProps {
  /**
   * 对话标题
   */
  title?: string;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 最大高度
   */
  maxHeight?: string;

  /**
   * 显示时间戳
   */
  showTimestamp?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 发送消息
   */
  onSend: (message: string, history: ChatMessage[]) => Promise<string>;

  /**
   * 重新生成
   */
  onRegenerate?: (messageId: string) => Promise<string>;

  /**
   * 清空对话
   */
  onClear?: () => void;
}

export function AIChatPanel({
  title = 'AI 对话',
  placeholder = '输入你的问题...',
  maxHeight = '600px',
  showTimestamp = true,
  className,
  onSend,
  onRegenerate,
  onClear,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await onSend(inputValue, messages);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉,发生了错误。请稍后再试。',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (!onRegenerate || isLoading) return;

    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // 删除这条消息及之后的所有消息
    setMessages(prev => prev.slice(0, messageIndex));
    setIsLoading(true);

    try {
      const response = await onRegenerate(messageId);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '重新生成失败,请稍后再试。',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn('bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-400">AI 智能助手</p>
          </div>
        </div>
        {onClear && messages.length > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            清空对话
          </button>
        )}
      </div>

      {/* 消息列表 */}
      <div
        className="overflow-y-auto p-6 space-y-6"
        style={{ maxHeight: 'calc(' + maxHeight + ' - 140px)' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 mb-4">
              <Bot className="w-12 h-12 text-cyan-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">开始对话</h4>
            <p className="text-sm text-gray-400 max-w-xs">
              向 AI 提问任何问题,我会尽力帮助你
            </p>
          </div>
        ) : (
          messages.map(message => (
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
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 group relative',
                  message.role === 'user'
                    ? 'bg-cyan-500 text-white'
                    : message.error
                    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                {showTimestamp && (
                  <p
                    className={cn(
                      'text-xs mt-2',
                      message.role === 'user' ? 'text-cyan-100/60' : 'text-gray-500'
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                )}

                {/* 操作按钮 */}
                {message.role === 'assistant' && !message.error && (
                  <div className="absolute -bottom-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                      title="复制"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {onRegenerate && (
                      <button
                        onClick={() => handleRegenerate(message.id)}
                        className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                        title="重新生成"
                        disabled={isLoading}
                      >
                        <RefreshCw className={cn('w-4 h-4 text-gray-400', isLoading && 'animate-spin')} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="p-2 rounded-lg bg-cyan-500 flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {/* 加载状态 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
              <div className="flex gap-1">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3
                border border-gray-700 focus:border-cyan-500 focus:outline-none
                placeholder:text-gray-500 transition-colors resize-none
                focus:ring-2 focus:ring-cyan-500/20"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 rounded-xl text-white font-medium
              bg-gradient-to-r from-cyan-500 to-purple-500
              hover:from-cyan-600 hover:to-purple-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>发送</span>
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          按 Enter 发送,Shift + Enter 换行
        </p>
      </div>
    </div>
  );
}

export default AIChatPanel;
