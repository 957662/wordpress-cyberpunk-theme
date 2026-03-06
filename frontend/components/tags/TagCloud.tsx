'use client'

import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'
import Link from 'next/link'

interface TagItem {
  name: string
  slug: string
  count?: number
}

interface TagCloudProps {
  tags: TagItem[]
  maxTags?: number
  layout?: 'cloud' | 'list' | 'grid'
  className?: string
  variant?: 'default' | 'neon' | 'minimal'
}

/**
 * TagCloud - 标签云组件
 * 以不同布局展示标签，支持多种视觉风格
 */
export function TagCloud({
  tags,
  maxTags = 50,
  layout = 'cloud',
  className = '',
  variant = 'default',
}: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags)

  if (displayTags.length === 0) {
    return null
  }

  const variants = {
    default: 'bg-cyber-muted border border-cyber-border hover:border-cyber-cyan/50',
    neon: 'bg-transparent border border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]',
    minimal: 'bg-transparent border-0 hover:bg-cyber-muted/50',
  }

  const getTagStyle = (index: number, count: number = 0) => {
    // 根据索引和计数生成随机但一致的样式
    const colors = [
      'text-cyber-cyan',
      'text-cyber-purple',
      'text-cyber-pink',
      'text-cyber-green',
      'text-cyber-yellow',
    ]
    const color = colors[index % colors.length]

    // 根据文章数量调整字体大小
    const sizeClass = count > 10 ? 'text-lg' : count > 5 ? 'text-base' : 'text-sm'

    return { color, sizeClass }
  }

  if (layout === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-lg font-bold text-white">Tags</h3>
        </div>
        <div className="space-y-2">
          {displayTags.map((tag, index) => {
            const { color, sizeClass } = getTagStyle(index, tag.count)
            return (
              <motion.div
                key={tag.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  href={`/tags/${tag.slug}`}
                  className={`flex items-center justify-between p-2 rounded-lg ${variants[variant]} transition-all group`}
                >
                  <span className={`${color} ${sizeClass} font-medium`}>
                    {tag.name}
                  </span>
                  {tag.count !== undefined && (
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">
                      {tag.count}
                    </span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  if (layout === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ${className}`}>
        {displayTags.map((tag, index) => {
          const { color } = getTagStyle(index, tag.count)
          return (
            <motion.div
              key={tag.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link
                href={`/tags/${tag.slug}`}
                className={`block p-3 rounded-lg ${variants[variant]} transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${color} font-medium text-sm truncate`}>
                    {tag.name}
                  </span>
                  {tag.count !== undefined && (
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">
                      {tag.count}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // 默认云布局
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag, index) => {
        const { color, sizeClass } = getTagStyle(index, tag.count)
        return (
          <motion.div
            key={tag.slug}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href={`/tags/${tag.slug}`}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${variants[variant]} transition-all group`}
            >
              <Tag className={`w-3 h-3 ${color}`} />
              <span className={`${color} ${sizeClass} font-medium`}>
                {tag.name}
              </span>
              {tag.count !== undefined && (
                <span className="text-xs text-gray-500 group-hover:text-gray-400">
                  {tag.count}
                </span>
              )}
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * PopularTags - 热门标签组件
 * 显示最常用的标签
 */
interface PopularTagsProps {
  tags: TagItem[]
  maxTags?: number
  className?: string
}

export function PopularTags({
  tags,
  maxTags = 10,
  className = '',
}: PopularTagsProps) {
  // 按文章数量排序并取前N个
  const popularTags = [...tags]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, maxTags)

  return (
    <div className={`cyber-card p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
        <h3 className="text-lg font-bold text-white">Popular Tags</h3>
      </div>
      <TagCloud tags={popularTags} layout="cloud" variant="neon" />
    </div>
  )
}

/**
 * RelatedTags - 相关标签组件
 * 显示与当前文章相关的标签
 */
interface RelatedTagsProps {
  tags: TagItem[]
  currentTag?: string
  className?: string
}

export function RelatedTags({
  tags,
  currentTag,
  className = '',
}: RelatedTagsProps) {
  const relatedTags = tags.filter((tag) => tag.slug !== currentTag)

  if (relatedTags.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-sm text-gray-400">Related:</span>
      <div className="flex flex-wrap gap-2">
        {relatedTags.slice(0, 5).map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors underline decoration-cyber-cyan/30 hover:decoration-cyber-cyan/60 underline-offset-4"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

/**
 * TagList - 标签列表组件
 * 用于侧边栏或页脚
 */
export function TagList({
  tags,
  className = '',
}: {
  tags: TagItem[]
  className?: string
}) {
  return (
    <div className={className}>
      <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
        All Tags
      </h4>
      <TagCloud tags={tags} layout="list" variant="minimal" />
    </div>
  )
}

export default TagCloud
