'use client';

/**
 * Code Editor Component
 * 赛博朋克风格代码编辑器组件
 * 支持语法高亮、行号、代码折叠等功能
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Settings,
  Play,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CodeEditorProps {
  /** 初始代码内容 */
  defaultValue?: string;
  /** 代码内容 */
  value?: string;
  /** 代码语言 */
  language?: string;
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 主题 */
  theme?: 'cyber-dark' | 'cyber-light' | 'monokai' | 'dracula';
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 内容变化回调 */
  onChange?: (value: string) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认是否折叠 */
  defaultCollapsed?: boolean;
}

export function CodeEditor({
  defaultValue = '',
  value,
  language = 'typescript',
  readOnly = false,
  showLineNumbers = true,
  theme = 'cyber-dark',
  fullscreen = false,
  onChange,
  className = '',
  placeholder = '在此输入代码...',
  collapsible = false,
  defaultCollapsed = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(value || defaultValue);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [isCopied, setIsCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setCode(value);
    }
  }, [value]);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCode(newValue);
    onChange?.(newValue);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `.${language},.txt,.md`;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setCode(content);
          onChange?.(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    setCode('');
    onChange?.('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newValue);
      onChange?.(newValue);

      // 恢复光标位置
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    }
  };

  const renderLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => (
      <div key={i} className="text-right pr-3 text-cyber-cyan/50 select-none">
        {i + 1}
      </div>
    ));
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={`cyber-card ${className}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyber-cyan" />
            <span className="text-sm text-gray-400">{language}</span>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
          >
            展开代码
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={editorRef}
      className={`cyber-card overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} ${className}`}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border bg-cyber-dark/50">
        <div className="flex items-center gap-3">
          {/* 语言标识 */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm text-cyber-cyan font-mono">{language}</span>
          </div>

          {/* 代码统计 */}
          <div className="text-xs text-gray-500">
            {code.length} 字符 · {lineCount} 行
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 运行按钮 */}
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Run code')}
              className="text-green-400"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}

          {/* 清空按钮 */}
          {!readOnly && code.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          {/* 上传按钮 */}
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpload}
              title="上传代码"
            >
              <Upload className="w-4 h-4" />
            </Button>
          )}

          {/* 下载按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            title="下载代码"
          >
            <Download className="w-4 h-4" />
          </Button>

          {/* 复制按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title={isCopied ? '已复制!' : '复制代码'}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>

          {/* 全屏按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>

          {/* 折叠按钮 */}
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              title="折叠"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}

          {/* 设置按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            title="设置"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 py-3 border-b border-cyber-border bg-cyber-dark/30"
        >
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => {
                  // 这里可以添加切换行号的逻辑
                }}
                className="rounded"
              />
              <span className="text-gray-400">显示行号</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* 编辑器区域 */}
      <div className="flex overflow-hidden">
        {/* 行号 */}
        {showLineNumbers && (
          <div className="py-4 pl-4 pr-2 bg-cyber-dark/30 font-mono text-sm select-none border-r border-cyber-border">
            {renderLineNumbers()}
          </div>
        )}

        {/* 代码编辑器 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleTabKey}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`
              w-full h-96 p-4 bg-transparent text-gray-300 font-mono text-sm
              resize-none focus:outline-none
              ${readOnly ? 'cursor-default' : ''}
              ${isFullscreen ? 'h-[calc(100vh-120px)]' : ''}
            `}
            style={{
              minHeight: isFullscreen ? 'calc(100vh - 120px)' : '400px',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* 状态栏 */}
      <div className="px-4 py-2 border-t border-cyber-border bg-cyber-dark/30 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>{language}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>{readOnly ? '只读' : '可编辑'}</span>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
