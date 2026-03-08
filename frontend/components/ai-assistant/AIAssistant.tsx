'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  Copy,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIAssistantProps {
  title?: string
  placeholder?: string
  initialMessage?: string
  onSend?: (message: string) => Promise<string>
  className?: string
}

export function AIAssistant({
  title = 'AI 助手',
  placeholder = '请输入您的问题...',
  initialMessage,
  onSend,
  className
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = onSend
        ? await onSend(input)
        : '这是一个模拟的 AI 回复。实际使用时需要接入真实的 AI API。'

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，处理您的请求时出现了错误。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <>
      {/* 浮动按钮 */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={cn('fixed bottom-6 right-6 z-50', className)}
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:shadow-neon-cyan"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* AI 助手面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn('fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]', className)}
          >
            <Card className="shadow-2xl border-cyber-cyan">
              <CardBody className="p-0">
                {/* 头部 */}
                <div className="flex items-center justify-between p-4 border-b border-cyber-border bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100">{title}</h3>
                      <p className="text-xs text-gray-400">在线</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* 消息列表 */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && initialMessage && (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-cyber-cyan mx-auto mb-4" />
                      <p className="text-gray-400">{initialMessage}</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {/* 头像 */}
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center',
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-cyber-purple to-cyber-pink'
                            : 'bg-gradient-to-br from-cyber-cyan to-cyber-blue'
                        )}
                      >
                        {message.role === 'user' ? (
                          <span className="text-white text-sm font-medium">你</span>
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* 消息内容 */}
                      <div className="flex-1 max-w-[80%]">
                        <div
                          className={cn(
                            'rounded-lg p-3 relative group',
                            message.role === 'user'
                              ? 'bg-cyber-purple/20 text-gray-100 ml-auto'
                              : 'bg-cyber-muted text-gray-100'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>

                          {/* 复制按钮 */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* 加载动画 */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-cyber-muted rounded-lg p-3">
                        <Loader2 className="w-4 h-4 text-cyber-cyan animate-spin" />
                      </div>
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
                      size="icon"
                      className="px-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:shadow-neon-cyan"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
