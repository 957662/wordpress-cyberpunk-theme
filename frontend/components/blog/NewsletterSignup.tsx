'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check, Sparkles, ArrowRight } from 'lucide-react'

interface NewsletterSignupProps {
  title?: string
  description?: string
  buttonText?: string
  placeholder?: string
  onSuccess?: (email: string) => void
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

/**
 * NewsletterSignup - Newsletter订阅组件
 * 带有赛博朋克风格的邮件订阅表单
 */
export function NewsletterSignup({
  title = 'Stay in the Loop',
  description = 'Get the latest posts delivered straight to your inbox',
  buttonText = 'Subscribe',
  placeholder = 'Enter your email',
  onSuccess,
  className = '',
  variant = 'default',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    // 模拟API调用
    try {
      // 这里应该调用实际的API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus('success')
      setMessage('Thanks for subscribing! Check your inbox soon.')
      onSuccess?.(email)
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  const variants = {
    default: 'cyber-card p-8',
    compact: 'cyber-card p-6',
    minimal: 'p-0',
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      {/* 装饰元素 */}
      {variant !== 'minimal' && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyber-cyan/10 to-transparent rounded-full blur-xl" />
      )}

      <div className="relative">
        {/* 标题 */}
        {title && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyber-cyan" />
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            {description && (
              <p className="text-gray-400 text-sm">{description}</p>
            )}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={status === 'loading' || status === 'success'}
                className="w-full pl-10 pr-4 py-3 bg-cyber-muted border border-cyber-border rounded-lg focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan focus:outline-none text-white placeholder-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <motion.button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-cyber-cyan text-cyber-dark font-bold rounded-lg hover:bg-cyber-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyber-dark/30 border-t-cyber-dark rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>

          {/* 状态消息 */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-sm ${
                  status === 'success' ? 'text-cyber-green' : 'text-cyber-pink'
                }`}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 隐私说明 */}
          {variant !== 'minimal' && (
            <p className="text-xs text-gray-500 mt-4">
              No spam, unsubscribe anytime. Read our{' '}
              <a href="/privacy" className="text-cyber-cyan hover:underline">
                Privacy Policy
              </a>
            </p>
          )}
        </form>

        {/* 赛博朋克装饰边框 */}
        {variant !== 'minimal' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan/30" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * InlineNewsletter - 内联Newsletter组件
 * 用于文章底部或侧边栏
 */
export function InlineNewsletter({ className = '' }: { className?: string }) {
  return (
    <NewsletterSignup
      title="Enjoyed this post?"
      description="Subscribe to get more content like this delivered to your inbox"
      buttonText="Subscribe"
      variant="compact"
      className={className}
    />
  )
}

/**
 * MinimalNewsletter - 最小化Newsletter组件
 * 用于页脚或其他紧凑空间
 */
export function MinimalNewsletter({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus('success')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        disabled={status === 'loading' || status === 'success'}
        className="flex-1 px-4 py-2 bg-cyber-muted border border-cyber-border rounded focus:border-cyber-cyan focus:outline-none text-white placeholder-gray-500 transition-all text-sm disabled:opacity-50"
      />
      <motion.button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-cyber-cyan text-cyber-dark font-bold rounded hover:bg-cyber-cyan/90 transition-all text-sm disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'success' ? <Check className="w-4 h-4" /> : 'Join'}
      </motion.button>
    </form>
  )
}

export default NewsletterSignup
