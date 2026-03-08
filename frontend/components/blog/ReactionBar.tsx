'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Fire,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ReactionType = 'like' | 'dislike' | 'love' | 'funny' | 'fire' | 'rocket'

interface Reaction {
  type: ReactionType
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  count: number
  isActive: boolean
}

interface ReactionBarProps {
  initialReactions?: {
    like?: number
    dislike?: number
    love?: number
    funny?: number
    fire?: number
    rocket?: number
  }
  onReaction?: (type: ReactionType) => void
  className?: string
  showLabels?: boolean
  compact?: boolean
}

export function ReactionBar({
  initialReactions = {},
  onReaction,
  className,
  showLabels = false,
  compact = false,
}: ReactionBarProps) {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [reactions, setReactions] = useState<Reaction[]>([
    {
      type: 'like',
      icon: ThumbsUp,
      label: '有用',
      color: 'text-green-400',
      count: initialReactions.like || 0,
      isActive: false,
    },
    {
      type: 'dislike',
      icon: ThumbsDown,
      label: '无用',
      color: 'text-gray-400',
      count: initialReactions.dislike || 0,
      isActive: false,
    },
    {
      type: 'love',
      icon: Heart,
      label: '喜欢',
      color: 'text-pink-400',
      count: initialReactions.love || 0,
      isActive: false,
    },
    {
      type: 'funny',
      icon: Laugh,
      label: '有趣',
      color: 'text-yellow-400',
      count: initialReactions.funny || 0,
      isActive: false,
    },
    {
      type: 'fire',
      icon: Fire,
      label: '热门',
      color: 'text-orange-400',
      count: initialReactions.fire || 0,
      isActive: false,
    },
    {
      type: 'rocket',
      icon: Rocket,
      label: '精彩',
      color: 'text-cyan-400',
      count: initialReactions.rocket || 0,
      isActive: false,
    },
  ])

  const handleReaction = (type: ReactionType) => {
    const updatedReactions = reactions.map((reaction) => {
      if (reaction.type === type) {
        const isActive = !reaction.isActive
        return {
          ...reaction,
          count: reaction.count + (isActive ? 1 : -1),
          isActive,
        }
      }
      // 如果之前有其他反应，清除它
      if (reaction.isActive && userReaction) {
        return {
          ...reaction,
          count: reaction.count - 1,
          isActive: false,
        }
      }
      return reaction
    })

    setReactions(updatedReactions)
    setUserReaction(updatedReactions.find((r) => r.isActive)?.type || null)

    if (onReaction) {
      onReaction(type)
    }
  }

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0)

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg',
        'bg-[var(--cyber-card-bg)]',
        'border border-[var(--cyber-border)]',
        className
      )}
    >
      {reactions.map((reaction) => {
        const Icon = reaction.icon
        const percentage =
          totalReactions > 0 ? (reaction.count / totalReactions) * 100 : 0

        return (
          <motion.button
            key={reaction.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReaction(reaction.type)}
            className={cn(
              'relative group flex items-center gap-2',
              'px-3 py-2 rounded-md transition-all duration-200',
              'hover:bg-[var(--cyber-muted)]',
              reaction.isActive && 'bg-[var(--cyber-primary)] bg-opacity-20',
              compact ? 'px-2 py-1' : 'px-3 py-2'
            )}
          >
            {/* 进度条背景 */}
            {reaction.count > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'absolute bottom-0 left-0 h-0.5',
                  reaction.color.replace('text-', 'bg-')
                )}
              />
            )}

            <Icon
              className={cn(
                'w-4 h-4 transition-colors',
                reaction.isActive ? reaction.color : 'text-gray-400',
                'group-hover:text-white'
              )}
            />

            {!compact && reaction.count > 0 && (
              <span className="text-xs font-medium text-gray-300">
                {reaction.count}
              </span>
            )}

            {showLabels && !compact && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                {reaction.label}
              </span>
            )}

            {/* 悬停提示 */}
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[var(--cyber-bg)] border border-[var(--cyber-border)] rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {reaction.label}
            </span>
          </motion.button>
        )
      })}

      {totalReactions > 0 && !compact && (
        <div className="ml-2 text-xs text-gray-500">
          {totalReactions} 人参与
        </div>
      )}
    </div>
  )
}

// 简化版本 - 只显示点赞
export function LikeButton({
  count = 0,
  isActive = false,
  onClick,
}: {
  count?: number
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'transition-all duration-200',
        'border border-[var(--cyber-border)]',
        'hover:bg-[var(--cyber-muted)]',
        isActive && 'bg-green-500 bg-opacity-20 border-green-500'
      )}
    >
      <ThumbsUp
        className={cn(
          'w-4 h-4',
          isActive ? 'text-green-400' : 'text-gray-400'
        )}
      />
      <span className="text-sm text-gray-300">{count}</span>
    </motion.button>
  )
}
