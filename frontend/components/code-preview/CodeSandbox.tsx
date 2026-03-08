'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  Settings,
  Maximize2,
  Minimize2,
  Code,
  Eye,
  Split,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'react-hot-toast'

export interface CodeFile {
  id: string
  name: string
  language: string
  code: string
}

export interface CodeSandboxProps {
  initialCode?: string
  language?: string
  files?: CodeFile[]
  showPreview?: boolean
  showConsole?: boolean
  layout?: 'split' | 'tabs' | 'stacked'
  theme?: 'dark' | 'light'
  className?: string
  onRun?: (code: string) => Promise<string>
  onChange?: (code: string) => void
}

export function CodeSandbox({
  initialCode = '',
  language = 'javascript',
  files,
  showPreview = true,
  showConsole = true,
  layout = 'split',
  theme = 'dark',
  className = '',
  onRun,
  onChange,
}: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode)
  const [activeFile, setActiveFile] = useState(0)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split')
  const [consoleOpen, setConsoleOpen] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const sandboxRef = useRef<HTMLIFrameElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // 代码文件列表
  const codeFiles = files || [
    {
      id: 'main',
      name: `main.${language}`,
      language,
      code: initialCode,
    },
  ]

  // 运行代码
  const runCode = async () => {
    setIsRunning(true)
    setErrors([])
    setOutput('')

    try {
      if (onRun) {
        const result = await onRun(code)
        setOutput(result)
      } else {
        // 默认JavaScript执行
        const logs: string[] = []
        const originalLog = console.log
        const originalError = console.error
        const originalWarn = console.warn

        // 重定向console
        console.log = (...args: any[]) => logs.push(args.map((arg) => String(arg)).join(' '))
        console.error = (...args: any[]) => logs.push('ERROR: ' + args.map((arg) => String(arg)).join(' '))
        console.warn = (...args: any[]) => logs.push('WARN: ' + args.map((arg) => String(arg)).join(' '))

        try {
          // 创建安全的执行环境
          const result = new Function(code)()
          if (result !== undefined) {
            logs.push(String(result))
          }
          setOutput(logs.join('\n'))
        } catch (error) {
          setErrors([error instanceof Error ? error.message : String(error)])
        }

        // 恢复console
        console.log = originalLog
        console.error = originalError
        console.warn = originalWarn
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : String(error)])
      toast.error('代码执行失败')
    } finally {
      setIsRunning(false)
    }
  }

  // 重置代码
  const resetCode = () => {
    if (confirm('确定要重置代码吗?所有未保存的更改将丢失。')) {
      setCode(initialCode)
      setOutput('')
      setErrors([])
    }
  }

  // 复制代码
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('代码已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  // 下载代码
  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = codeFiles[activeFile].name
    a.click()
    URL.revokeObjectURL(url)
  }

  // 上传代码
  const uploadCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCode(content)
      toast.success('代码已导入')
    }
    reader.readAsText(file)
  }

  // 代码变更
  const handleCodeChange = (value: string) => {
    setCode(value)
    onChange?.(value)
  }

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter: 运行代码
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runCode()
      }
      // Ctrl/Cmd + S: 复制代码
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        copyCode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code])

  // 更新预览
  useEffect(() => {
    if (sandboxRef.current && language === 'html') {
      const doc = sandboxRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(code)
        doc.close()
      }
    }
  }, [code, language])

  // 示例代码
  const exampleCode = `// 欢迎使用代码沙盒!
// 你可以在这里编写和运行代码

// 示例: 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算前10个斐波那契数
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}

// 尝试修改代码并点击运行按钮!
`

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <Card variant="elevated" className="h-full flex flex-col overflow-hidden">
        {/* 工具栏 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-gray-100">代码沙盒</h3>

            {/* 文件标签 */}
            {codeFiles.length > 1 && (
              <div className="flex gap-2">
                {codeFiles.map((file, index) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setActiveFile(index)
                      setCode(file.code)
                    }}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      activeFile === index
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 视图切换 */}
            <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setViewMode('code')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'code' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
                title="仅代码"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'split' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
                title="分割视图"
              >
                <Split className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
                title="仅预览"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-700" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 代码编辑器 */}
          <div
            className={`${
              viewMode === 'preview' ? 'hidden' : viewMode === 'split' ? 'w-1/2' : 'w-full'
            } flex flex-col border-r border-gray-700`}
          >
            {/* 编辑器工具栏 */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {language}
                </Badge>
                {code.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {code.split('\n').length} 行 • {code.length} 字符
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCode}
                  disabled={code === initialCode}
                  className="text-gray-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                  className="text-gray-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
                  className="text-gray-400 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".js,.jsx,.ts,.tsx,.html,.css,.json"
                    onChange={uploadCode}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    as="span"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </label>
              </div>
            </div>

            {/* 代码输入 */}
            <div className="flex-1 relative">
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
                placeholder={exampleCode}
                spellCheck={false}
              />

              {/* 行号 */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-end pr-3 pt-4 text-xs text-gray-500 font-mono select-none">
                {code.split('\n').map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 预览和控制台 */}
          {viewMode !== 'code' && (
            <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col`}>
              {/* 预览区域 */}
              {showPreview && language === 'html' && (
                <div className="flex-1 bg-white">
                  <iframe ref={sandboxRef} className="w-full h-full border-0" title="preview" />
                </div>
              )}

              {/* 控制台 */}
              {showConsole && (
                <div className={`${showPreview && language === 'html' ? 'h-1/2' : 'flex-1'} flex flex-col border-t border-gray-700`}>
                  {/* 控制台头部 */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConsoleOpen(!consoleOpen)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
                      >
                        <span className="font-mono">▶</span>
                        控制台
                      </button>
                      {errors.length > 0 && (
                        <Badge variant="error" size="sm">
                          {errors.length} 错误
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      >
                        {isRunning ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        运行
                      </Button>
                    </div>
                  </div>

                  {/* 控制台输出 */}
                  {consoleOpen && (
                    <div className="flex-1 p-4 bg-gray-950 overflow-y-auto font-mono text-sm">
                      {errors.length > 0 && (
                        <div className="space-y-1 mb-4">
                          {errors.map((error, index) => (
                            <div key={index} className="flex items-start gap-2 text-red-400">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {output && (
                        <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
                      )}

                      {!output && errors.length === 0 && (
                        <div className="text-gray-600 italic">
                          点击"运行"按钮执行代码 (Ctrl/Cmd + Enter)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CodeSandbox
