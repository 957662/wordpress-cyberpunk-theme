/**
 * 代码编辑器组件
 * 支持语法高亮、代码补全、实时预览等功能
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Upload, Maximize2, Minimize2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 简化的代码语言类型
type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'html' | 'css' | 'json';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: CodeLanguage;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  allowFullscreen?: boolean;
  onRun?: () => void;
  className?: string;
  minHeight?: string;
}

const languageColors: Record<CodeLanguage, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#007396',
  cpp: '#00599c',
  html: '#e34c26',
  css: '#563d7c',
  json: '#292929',
};

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  showLineNumbers = true,
  showHeader = true,
  allowFullscreen = true,
  onRun,
  className,
  minHeight = '200px',
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算行数
  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<CodeLanguage, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      json: 'json',
    };

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 支持 Tab 缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange?.(newValue);

      // 恢复光标位置
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const handleScroll = () => {
    const textarea = textareaRef.current;
    const lineNumbers = containerRef.current?.querySelector('[data-line-numbers]');
    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  };

  // 生成行号
  const renderLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => (
      <div
        key={i}
        className="text-right text-gray-500 text-sm select-none pr-3"
        style={{ lineHeight: '1.5rem' }}
      >
        {i + 1}
      </div>
    ));
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColors[language] }}
            />
            <span className="text-sm font-medium text-gray-200 capitalize">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onRun && (
              <button
                onClick={onRun}
                className={cn(
                  'flex items-center gap-1 px-3 py-1',
                  'bg-green-500/20 text-green-400 rounded',
                  'hover:bg-green-500/30',
                  'transition-colors'
                )}
              >
                <Play className="w-3 h-3" />
                <span className="text-xs">运行</span>
              </button>
            )}

            {allowFullscreen && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title={isFullscreen ? '退出全屏' : '全屏'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="复制代码"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleDownload}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="下载代码"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex relative" style={{ minHeight }}>
        {/* 行号 */}
        {showLineNumbers && (
          <div
            data-line-numbers
            className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 overflow-hidden select-none border-r border-gray-800"
            style={{ paddingTop: '12px' }}
          >
            {renderLineNumbers()}
          </div>
        )}

        {/* 编辑器 */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          readOnly={readOnly}
          className={cn(
            'flex-1 w-full p-3 bg-transparent resize-none',
            'font-mono text-sm text-gray-100',
            'focus:outline-none',
            showLineNumbers && 'pl-14',
            readOnly && 'cursor-default'
          )}
          style={{
            minHeight: 'inherit',
            lineHeight: '1.5rem',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}

/**
 * 代码预览组件（编辑器 + 预览）
 */
interface CodePreviewProps extends Omit<CodeEditorProps, 'onChange'> {
  previewContent?: string;
  onEditorChange?: (value: string) => void;
  layout?: 'horizontal' | 'vertical';
}

export function CodePreview({
  value,
  previewContent = value,
  onEditorChange,
  layout = 'horizontal',
  ...editorProps
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-lg overflow-hidden',
        layout === 'horizontal' ? 'grid grid-cols-2' : 'grid grid-rows-2'
      )}
    >
      {/* 编辑器 */}
      <div className="border-r border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <span className="text-sm font-medium text-gray-200">编辑器</span>
          <div className="flex gap-2">
            <button
              onClick={() => onEditorChange?.('// 添加你的代码')}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              清空
            </button>
          </div>
        </div>
        <CodeEditor
          value={value}
          onChange={onEditorChange}
          showHeader={false}
          minHeight="300px"
          {...editorProps}
        />
      </div>

      {/* 预览 */}
      <div>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <span className="text-sm font-medium text-gray-200">预览</span>
          <button
            onClick={() => onEditorChange?.(value)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            刷新
          </button>
        </div>
        <div className="p-4 bg-white text-gray-900 min-h-[300px] overflow-auto">
          {previewContent ? (
            <pre className="text-sm">
              <code>{previewContent}</code>
            </pre>
          ) : (
            <p className="text-gray-500">预览内容将显示在这里...</p>
          )}
        </div>
      </div>
    </div>
  );
}
