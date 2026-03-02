'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'dark' | 'cyber'
  readOnly?: boolean
  className?: string
  placeholder?: string
  minHeight?: string
  maxHeight?: string
  syntaxHighlight?: boolean
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'cyber',
  readOnly = false,
  className,
  placeholder = 'Enter code here...',
  minHeight = '200px',
  maxHeight = '600px',
  syntaxHighlight = true,
}: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  // 计算行数
  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(lines)
  }, [value])

  // 同步滚动
  const handleScroll = useCallback(() => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  // 处制代码
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      // 可以添加 toast 通知
      console.log('Code copied!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [value])

  // 简单的语法高亮
  const highlightCode = (code: string) => {
    if (!syntaxHighlight) return code

    // 转义 HTML
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // 关键词高亮
    const keywords = [
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'class',
      'import',
      'export',
      'from',
      'default',
      'async',
      'await',
      'try',
      'catch',
      'throw',
    ]

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(
        regex,
        `<span class="text-cyber-purple font-semibold">${keyword}</span>`,
      )
    })

    // 字符串高亮
    highlighted = highlighted.replace(
      /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
      '<span class="text-cyber-green">$&</span>',
    )

    // 注释高亮
    highlighted = highlighted.replace(
      /(\/\/.*$)/gm,
      '<span class="text-gray-500">$1</span>',
    )

    // 数字高亮
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="text-cyber-cyan">$1</span>',
    )

    return highlighted
  }

  const themeClasses = {
    dark: 'bg-gray-900 border-gray-700',
    cyber: 'bg-cyber-darker border-cyber-border',
  }

  return (
    <div
      className={cn(
        'relative border rounded-lg overflow-hidden',
        themeClasses[theme],
        className,
      )}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-black/50 border-b border-cyber-border">
        <span className="text-sm text-cyber-cyan font-mono">{language}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{lineCount} lines</span>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded hover:bg-cyber-cyan/20 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="relative">
        {/* 行号 */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-cyber-black/30 text-right pr-3 pt-4 text-gray-600 font-mono text-sm select-none overflow-hidden">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* 高亮显示层 */}
        {syntaxHighlight && (
          <div
            ref={highlightRef}
            className="absolute left-12 top-0 right-0 bottom-0 p-4 pt-4 font-mono text-sm leading-6 pointer-events-none overflow-auto whitespace-pre-wrap break-words"
            style={{ minHeight, maxHeight }}
          >
            <pre
              dangerouslySetInnerHTML={{
                __html: highlightCode(value) || `<span class="text-gray-600">${placeholder}</span>`,
              }}
            />
          </div>
        )}

        {/* 文本输入 */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          className="absolute left-12 top-0 right-0 bottom-0 p-4 pt-4 font-mono text-sm leading-6 bg-transparent text-transparent caret-white resize-none outline-none overflow-auto whitespace-pre-wrap break-words"
          style={{ minHeight, maxHeight }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

// 带实时预览的代码编辑器
interface CodeEditorWithPreviewProps extends Omit<CodeEditorProps, 'onChange'> {
  previewTitle?: string
  runCode?: (code: string) => string
}

export function CodeEditorWithPreview({
  value,
  onChange,
  language = 'javascript',
  previewTitle = 'Output',
  runCode,
  ...rest
}: CodeEditorWithPreviewProps) {
  const [output, setOutput] = useState<string>('')

  const handleRun = useCallback(() => {
    if (runCode) {
      try {
        const result = runCode(value)
        setOutput(result)
      } catch (error) {
        setOutput(error instanceof Error ? error.message : 'Error')
      }
    }
  }, [value, runCode])

  const clearOutput = useCallback(() => {
    setOutput('')
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CodeEditor
        value={value}
        onChange={onChange}
        language={language}
        {...rest}
      />

      <div className="border border-cyber-border rounded-lg bg-cyber-darker">
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-border">
          <span className="text-sm text-cyber-cyan font-mono">{previewTitle}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRun}
              className="px-3 py-1 text-xs bg-cyber-cyan text-cyber-black font-semibold rounded hover:bg-cyber-cyan/80 transition-colors"
            >
              Run
            </button>
            <button
              onClick={clearOutput}
              className="px-3 py-1 text-xs bg-cyber-purple text-white rounded hover:bg-cyber-purple/80 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <pre className="p-4 font-mono text-sm text-gray-300 overflow-auto h-full min-h-[200px]">
          {output || <span className="text-gray-600">Output will appear here...</span>}
        </pre>
      </div>
    </div>
  )
}

// 使用示例
export function CodeEditorExample() {
  const [code, setCode] = useState(`// 示例代码
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`)

  const runCode = (codeToRun: string) => {
    try {
      // 捕获 console.log 输出
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => logs.push(args.join(' '))

      // 执行代码
      const result = eval(codeToRun)

      // 恢复 console.log
      console.log = originalLog

      return logs.length > 0 ? logs.join('\n') : String(result)
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyber-cyan">
        Code Editor Demo
      </h2>
      <CodeEditorWithPreview
        value={code}
        onChange={setCode}
        language="javascript"
        runCode={runCode}
        minHeight="300px"
      />
    </div>
  )
}
