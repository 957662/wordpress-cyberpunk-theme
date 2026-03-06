'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { CyberButton } from '@/components/ui/CyberButton'
import { toast } from '@/components/ui/Toast'

export interface FeedbackFormData {
  type: 'bug' | 'feature' | 'improvement' | 'other'
  title: string
  description: string
  email?: string
  rating?: number
}

export interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => Promise<void>
  className?: string
  showRating?: boolean
}

export function FeedbackForm({
  onSubmit,
  className,
  showRating = true,
}: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'bug',
    title: '',
    description: '',
    email: '',
    rating: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('请填写标题和描述')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setIsSubmitted(true)
      toast.success('感谢您的反馈！')

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          type: 'bug',
          title: '',
          description: '',
          email: '',
          rating: 0,
        })
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      toast.error('提交失败,请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const types = [
    { value: 'bug', label: 'Bug 报告', color: 'red' },
    { value: 'feature', label: '功能请求', color: 'cyan' },
    { value: 'improvement', label: '改进建议', color: 'purple' },
    { value: 'other', label: '其他', color: 'gray' },
  ] as const

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'cyber-card p-8 text-center border-2 border-green-500/30',
          className
        )}
      >
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">反馈已提交</h3>
        <p className="text-gray-400">感谢您的宝贵意见,我们会认真处理</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Feedback Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          反馈类型
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {types.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, type: type.value })}
              className={cn(
                'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                formData.type === type.value
                  ? `border-${type.color}-500 bg-${type.color}-500/20 text-${type.color}-400`
                  : 'border-cyber-border/50 bg-cyber-dark/50 text-gray-400 hover:border-gray-500'
              )}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          标题 *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="简要描述您的反馈..."
          className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-border/50 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          详细描述 *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="请详细描述您的反馈内容..."
          rows={5}
          className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-border/50 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 resize-none"
          required
        />
      </div>

      {/* Email (Optional) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          邮箱 (可选)
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-border/50 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
        />
      </div>

      {/* Submit Button */}
      <CyberButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        icon={<Send className="w-4 h-4" />}
        className="w-full"
      >
        {isSubmitting ? '提交中...' : '提交反馈'}
      </CyberButton>
    </form>
  )
}
