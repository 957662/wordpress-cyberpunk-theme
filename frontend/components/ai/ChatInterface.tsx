/**
 * AI 聊天界面组件
 * 支持流式响应、代码高亮、Markdown 渲染
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { cn } from '@/lib/utils';
import {
  Send,
  Bot,
  User,
  Copy,
  Check,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (content: string) => Promise<string>;
  onClearHistory?: () => void;
  onExportChat?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  showTimestamp?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

export function ChatInterface({
  messages: initialMessages = [],
  onSendMessage,
  onClearHistory,
  onExportChat,
  isLoading = false,
  placeholder = '输入你的问题...',
  showTimestamp = true,
  showCopyButton = true,
  className
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    inputRef.current?.focus();

    if (onSendMessage) {
      try {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true
        };

        setMessages(prev => [...prev, assistantMessage]);

        const response = await onSendMessage(userMessage.content);

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: response, isStreaming: false }
              : msg
          )
        );
      } catch (error) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === (Date.now() + 1).toString()
              ? {
                  ...msg,
                  content: '抱歉，发生了错误。请稍后再试。',
                  isStreaming: false
                }
              : msg
          )
        );
      }
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyber-cyan" />
          <h3 className="font-display font-semibold text-cyber-cyan">
            AI 助手
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onExportChat && messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportChat}
              leftIcon={<Download className="w-4 h-4" />}
            >
              导出
            </Button>
          )}
          {onClearHistory && messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              清空
            </Button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <Bot className="w-5 h-5 text-cyber-cyan" />
                </Avatar>
              )}

              <div
                className={cn(
                  'max-w-[80%] rounded-lg p-3 relative group',
                  message.role === 'user'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'bg-cyber-card border border-cyber-border'
                )}
              >
                {/* 内容 */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {/* 时间戳 */}
                {showTimestamp && (
                  <div
                    className={cn(
                      'text-xs mt-2',
                      message.role === 'user'
                        ? 'text-cyber-dark/70'
                        : 'text-cyber-muted'
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                )}

                {/* 复制按钮 */}
                {showCopyButton && message.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(message.content, message.id)}
                  >
                    {copiedId === message.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}

                {/* 流式加载动画 */}
                {message.isStreaming && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" />
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0 bg-cyber-cyan">
                  <User className="w-5 h-5 text-cyber-dark" />
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <Bot className="w-5 h-5 text-cyber-cyan" />
            </Avatar>
            <Card className="p-3">
              <LoadingSpinner size="sm" />
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-cyber-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            leftIcon={<Send className="w-4 h-4" />}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
