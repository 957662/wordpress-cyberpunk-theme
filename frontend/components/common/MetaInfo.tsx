'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Eye, Heart, MessageCircle, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export interface MetaInfoProps {
  author?: {
    name: string
    avatar?: string
  }
  publishedAt?: string
  readTime?: number
  views?: number
  likes?: number
  comments?: number
  variant?: 'horizontal' | 'vertical'
  className?: string
}

export function MetaInfo({
  author,
  publishedAt,
  readTime,
  views,
  likes,
  comments,
  variant = 'horizontal',
  className,
}: MetaInfoProps) {
  const isHorizontal = variant === 'horizontal'

  return (
    <motion.div
      className={cn(
        'flex gap-4 text-sm text-gray-400',
        !isHorizontal && 'flex-col',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {author && (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{author.name}</span>
        </div>
      )}

      {publishedAt && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <time dateTime={publishedAt}>
            {formatDistanceToNow(new Date(publishedAt), {
              addSuffix: true,
              locale: zhCN,
            })}
          </time>
        </div>
      )}

      {readTime !== undefined && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>{readTime} 分钟阅读</span>
        </div>
      )}

      {views !== undefined && (
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 flex-shrink-0" />
          <span>{views.toLocaleString()}</span>
        </div>
      )}

      {likes !== undefined && (
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 flex-shrink-0" />
          <span>{likes.toLocaleString()}</span>
        </div>
      )}

      {comments !== undefined && (
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span>{comments.toLocaleString()}</span>
        </div>
      )}
    </motion.div>
  )
}
