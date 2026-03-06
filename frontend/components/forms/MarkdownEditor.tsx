'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
  showPreview?: boolean
  toolbar?: boolean
  className?: string
}

/**
 * MarkdownEditor - Markdown编辑器组件
 * 支持实时预览、工具栏和快捷键
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
  minHeight = '400px',
  maxHeight = '600px',
  showPreview: initialShowPreview = true,
  toolbar = true,
  className = '',
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(initialShowPreview)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), value])
    setHistoryIndex((prev) => Math.min(prev + 1, history.length))
  }, [value])

  const insertMarkdown = (before: string, after: string = '', placeholder = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || placeholder
    const newValue =
      value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newValue)

    // 恢复焦点和选择
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + B: 粗体
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      insertMarkdown('**', '**', 'bold text')
    }
    // Ctrl/Cmd + I: 斜体
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      insertMarkdown('*', '*', 'italic text')
    }
    // Ctrl/Cmd + K: 链接
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      insertMarkdown('[', '](url)', 'link text')
    }
    // Ctrl/Cmd + Z: 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      handleUndo()
    }
    // Ctrl/Cmd + Shift + Z: 重做
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      handleRedo()
    }
    // Tab: 插入两个空格
    if (e.key === 'Tab') {
      e.preventDefault()
      insertMarkdown('  ', '', '')
    }
  }

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*', 'italic text') },
    { icon: Type, label: 'Heading', action: () => insertMarkdown('## ', '', 'Heading') },
    { icon: List, label: 'Bullet List', action: () => insertMarkdown('- ', '', 'item') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('1. ', '', 'item') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '', 'quote') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`', 'code') },
    {
      icon: LinkIcon,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)', 'link text'),
    },
  ]

  return (
    <div
      className={`cyber-card overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''} ${className}`}
    >
      {/* 工具栏 */}
      {toolbar && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-border bg-cyber-muted/30">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button) => (
              <motion.button
                key={button.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.action}
                className="p-2 rounded hover:bg-cyber-muted transition-colors text-gray-400 hover:text-white"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* 撤销/重做 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-2 rounded hover:bg-cyber-muted transition-colors text-gray-400 hover:text-white disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-2 rounded hover:bg-cyber-muted transition-colors text-gray-400 hover:text-white disabled:opacity-30"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo className="w-4 h-4" />
            </motion.button>

            <div className="w-px h-6 bg-cyber-border" />

            {/* 预览切换 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded hover:bg-cyber-muted transition-colors ${
                showPreview ? 'text-cyber-cyan' : 'text-gray-400'
              }`}
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>

            {/* 全屏切换 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded hover:bg-cyber-muted transition-colors text-gray-400 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* 编辑器和预览 */}
      <div className="flex flex-col md:flex-row">
        {/* 编辑区 */}
        <div className={`flex-1 ${showPreview ? 'md:w-1/2 md:border-r border-cyber-border' : ''}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[400px] p-4 bg-transparent border-0 focus:outline-none text-white font-mono text-sm leading-relaxed resize-none custom-scrollbar"
            style={{
              minHeight: showPreview ? minHeight : undefined,
              maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight,
            }}
          />
        </div>

        {/* 预览区 */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 md:w-1/2 overflow-auto custom-scrollbar"
              style={{
                maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight,
              }}
            >
              <div className="p-6 prose prose-invert prose-cyber max-w-none">
                <ReactMarkdown>{value || '*Start writing to see preview...*'}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-cyber-border bg-cyber-muted/20 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{value.length} characters</span>
          <span>{value.split(/\s+/).filter(Boolean).length} words</span>
          <span>{value.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Markdown supported</span>
          <a
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-cyan hover:underline"
          >
            Syntax Guide
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * SimpleMarkdownEditor - 简化的Markdown编辑器
 * 没有工具栏和预览，适合简单场景
 */
export function SimpleMarkdownEditor({
  value,
  onChange,
  placeholder = 'Write in Markdown...',
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`cyber-card ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-4 bg-transparent border-0 focus:outline-none text-white font-mono text-sm leading-relaxed resize-none custom-scrollbar"
      />
    </div>
  )
}

export default MarkdownEditor
