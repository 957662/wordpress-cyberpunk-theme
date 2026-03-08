'use client'

import { motion } from 'framer-motion'
import { FileX, Search, Inbox, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  type?: 'empty' | 'search' | 'error' | 'no-data'
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  type = 'empty',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const configs = {
    empty: {
      icon: FileX,
      defaultTitle: '暂无内容',
      defaultDescription: '还没有任何内容，快来创建第一条吧！',
    },
    search: {
      icon: Search,
      defaultTitle: '未找到结果',
      defaultDescription: '尝试使用其他关键词搜索',
    },
    error: {
      icon: AlertCircle,
      defaultTitle: '出错了',
      defaultDescription: '加载内容时出现问题，请稍后重试',
    },
    'no-data': {
      icon: Inbox,
      defaultTitle: '暂无数据',
      defaultDescription: '当前没有可显示的数据',
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 bg-[var(--cyber-muted)] rounded-full flex items-center justify-center mb-4"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Icon className="w-8 h-8 text-gray-400" />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-100 mb-2">
        {title || config.defaultTitle}
      </h3>

      <p className="text-gray-400 mb-6 max-w-md">
        {description || config.defaultDescription}
      </p>

      {action && (
        <motion.button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-purple)] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--cyber-cyan)]/25 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
