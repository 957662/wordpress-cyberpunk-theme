'use client'

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TagInputProps {
  /** 当前标签值 */
  value?: string[]
  /** 标签变化回调 */
  onChange?: (tags: string[]) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 最大标签数量 */
  maxTags?: number
  /** 标签最大长度 */
  maxLength?: number
  /** 标签验证函数 */
  validate?: (tag: string) => boolean
  /** 标签重复时是否允许添加 */
  allowDuplicates?: boolean
  /** 自定义标签渲染函数 */
  renderTag?: (tag: string, onRemove: () => void) => React.ReactNode
  /** 自动补全建议 */
  suggestions?: string[]
  /** 自定义样式类名 */
  className?: string
  /** 分隔符（用于批量添加） */
  delimiters?: string[]
}

/**
 * 标签输入组件
 *
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   placeholder="输入标签后按回车..."
 *   suggestions={['React', 'Vue', 'Angular']}
 * />
 * ```
 */
export function TagInput({
  value = [],
  onChange,
  placeholder = '输入标签后按回车...',
  disabled = false,
  maxTags = 10,
  maxLength = 20,
  validate,
  allowDuplicates = false,
  renderTag,
  suggestions = [],
  className,
  delimiters = ['Enter', ','],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !value.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  )

  useEffect(() => {
    // 点击外部关闭建议
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()

    // 验证标签
    if (!trimmedTag) return
    if (trimmedTag.length > maxLength) {
      alert(`标签长度不能超过 ${maxLength} 个字符`)
      return
    }
    if (value.length >= maxTags) {
      alert(`最多只能添加 ${maxTags} 个标签`)
      return
    }
    if (!allowDuplicates && value.includes(trimmedTag)) {
      alert('标签已存在')
      return
    }
    if (validate && !validate(trimmedTag)) {
      alert('标签格式不正确')
      return
    }

    const newTags = [...value, trimmedTag]
    onChange?.(newTags)
    setInputValue('')
    setShowSuggestions(false)
    setFocusedIndex(-1)
  }

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index)
    onChange?.(newTags)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 处理建议导航
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        return
      }
      if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        addTag(filteredSuggestions[focusedIndex])
        return
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false)
        setFocusedIndex(-1)
        return
      }
    }

    // 处理分隔符
    if (delimiters.includes(e.key)) {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    }

    // 处理退格键
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (e.target.value && suggestions.length > 0) {
      setShowSuggestions(true)
      setFocusedIndex(-1)
    } else {
      setShowSuggestions(false)
    }
  }

  const defaultRenderTag = (tag: string, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-md"
    >
      <Tag className="w-3 h-3 text-cyber-cyan" />
      <span className="text-sm text-cyber-cyan">{tag}</span>
      {!disabled && (
        <button
          onClick={() => removeTag(index)}
          className="ml-1 p-0.5 text-cyber-cyan hover:text-cyber-pink transition-colors"
          aria-label={`删除 ${tag}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  )

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* 标签输入区域 */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 p-3 bg-cyber-card border border-cyber-border rounded-lg',
          'focus-within:border-cyber-cyan focus-within:ring-2 focus-within:ring-cyber-cyan/20',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* 已添加的标签 */}
        <AnimatePresence>
          {value.map((tag, index) =>
            renderTag ? (
              <div key={index}>
                {renderTag(tag, () => removeTag(index))}
              </div>
            ) : (
              defaultRenderTag(tag, index)
            )
          )}
        </AnimatePresence>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            inputValue && suggestions.length > 0 && setShowSuggestions(true)
          }
          disabled={disabled || value.length >= maxTags}
          placeholder={value.length === 0 ? placeholder : ''}
          className={cn(
            'flex-1 min-w-[120px] bg-transparent outline-none text-gray-300',
            'placeholder:text-gray-500'
          )}
        />
      </div>

      {/* 标签计数 */}
      {maxTags && (
        <div className="mt-1 text-xs text-gray-500">
          {value.length} / {maxTags}
        </div>
      )}

      {/* 自动补全建议 */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-cyber-card border border-cyber-border rounded-lg shadow-lg overflow-hidden"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                onClick={() => addTag(suggestion)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm text-gray-300',
                  'flex items-center gap-2',
                  index === focusedIndex && 'bg-cyber-cyan/10'
                )}
              >
                <Tag className="w-3 h-3 text-cyber-cyan" />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * 标签云组件（只读展示）
 */
export interface TagCloudProps {
  /** 标签列表 */
  tags: string[]
  /** 点击标签回调 */
  onTagClick?: (tag: string) => void
  /** 自定义样式类名 */
  className?: string
  /** 最大显示数量 */
  maxVisible?: number
}

/**
 * 标签云组件，用于展示标签集合
 *
 * @example
 * ```tsx
 * <TagCloud
 *   tags={['React', 'Vue', 'Angular', 'Next.js']}
 *   onTagClick={(tag) => console.log(tag)}
 * />
 * ```
 */
export function TagCloud({
  tags,
  onTagClick,
  className,
  maxVisible,
}: TagCloudProps) {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags
  const hasMore = maxVisible && tags.length > maxVisible

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleTags.map((tag, index) => (
        <motion.button
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTagClick?.(tag)}
          className="px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-md text-sm text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
        >
          #{tag}
        </motion.button>
      ))}
      {hasMore && (
        <span className="px-3 py-1.5 text-sm text-gray-500">
          +{tags.length - maxVisible}
        </span>
      )}
    </div>
  )
}

export default TagInput
