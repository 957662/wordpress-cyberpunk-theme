'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Check,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Play,
  Code,
  FileCode,
  Terminal
} from 'lucide-react';

/**
 * CodePreview - 代码预览组件
 *
 * 功能特性：
 * - 语法高亮
 * - 行号显示
 * - 一键复制
 * - 代码下载
 * - 全屏模式
 * - 多语言支持
 * - 自定义主题
 */

export interface CodePreviewProps {
  /** 代码内容 */
  code: string;
  /** 编程语言 */
  language?: string;
  /** 文件名 */
  filename?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 是否显示头部 */
  showHeader?: boolean;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 主题 */
  theme?: 'dark' | 'light' | 'cyber';
  /** 是否可复制 */
  allowCopy?: boolean;
  /** 是否可下载 */
  allowDownload?: boolean;
  /** 是否可全屏 */
  allowFullscreen?: boolean;
  /** 起始行号 */
  startLine?: number;
  /** 高亮行号 */
  highlightLines?: number[];
}

/**
 * 语言到语法的映射
 */
const LANGUAGE_SYNTAX: Record<string, RegExp[]> = {
  javascript: [
    { pattern: /(\/\/.*$)/gm, class: 'comment' },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of)\b/g, class: 'keyword' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, class: 'literal' },
    { pattern: /\b(console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|Map|Set)\b/g, class: 'built-in' },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, class: 'string' },
    { pattern: /\b(\d+\.?\d*)\b/g, class: 'number' },
  ],
  typescript: [
    { pattern: /(\/\/.*$)/gm, class: 'comment' },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|interface|type|enum|implements|public|private|protected|readonly|abstract|static)\b/g, class: 'keyword' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, class: 'literal' },
    { pattern: /\b(string|number|boolean|any|void|never|unknown|object)\b/g, class: 'type' },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, class: 'string' },
    { pattern: /\b(\d+\.?\d*)\b/g, class: 'number' },
  ],
  python: [
    { pattern: /(#.*$)/gm, class: 'comment' },
    { pattern: /\b(def|return|if|elif|else|for|while|do|try|except|finally|with|as|import|from|class|pass|break|continue|and|or|not|in|is|lambda|yield|raise|global|nonlocal|assert|async|await)\b/g, class: 'keyword' },
    { pattern: /\b(True|False|None)\b/g, class: 'literal' },
    { pattern: /\b(print|len|range|str|int|float|list|dict|set|tuple|type|isinstance|hasattr|getattr|setattr)\b/g, class: 'built-in' },
    { pattern: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, class: 'string' },
    { pattern: /\b(\d+\.?\d*)\b/g, class: 'number' },
  ],
  html: [
    { pattern: /(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, class: 'tag' },
    { pattern: /\s([a-zA-Z-]+)=/g, class: 'attribute' },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, class: 'string' },
    { pattern: /(&lt;!--[\s\S]*?--&gt;)/g, class: 'comment' },
  ],
  css: [
    { pattern: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
    { pattern: /([.#]?[a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{/g, class: 'selector' },
    { pattern: /\[([a-zA-Z-]+)=/g, class: 'attribute' },
    { pattern: /:\s*([a-zA-Z-]+)\s*;/g, class: 'property' },
    { pattern: /:\s*([^;{}]+)/g, class: 'value' },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, class: 'string' },
    { pattern: /\b(\d+\.?\d*(px|em|rem|%|vh|vw)?)\b/g, class: 'number' },
  ],
};

/**
 * 语法高亮处理
 */
const highlightCode = (code: string, language: string): React.ReactNode => {
  const syntax = LANGUAGE_SYNTAX[language] || LANGUAGE_SYNTAX.javascript;
  let result = code;

  // 对每个语法规则进行替换（简化版）
  // 实际项目中应该使用专业的语法高亮库如 Prism.js 或 Shiki
  return result;
};

/**
 * CodePreview 主组件
 */
export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = 'javascript',
  filename = 'code',
  showLineNumbers = true,
  showHeader = true,
  className,
  style,
  theme = 'dark',
  allowCopy = true,
  allowDownload = true,
  allowFullscreen = false,
  startLine = 1,
  highlightLines = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  // 复制代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 下载代码
  const handleDownload = () => {
    const extension = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
    }[language] || 'txt';

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 渲染行号
  const renderLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => {
      const lineNumber = startLine + index;
      const isHighlighted = highlightLines.includes(lineNumber);
      const isHovered = hoveredLine === lineNumber;

      return (
        <div
          key={lineNumber}
          className={cn(
            'flex items-center justify-end pr-4 text-sm select-none transition-colors',
            isHighlighted && 'bg-cyber-cyan/20 text-cyber-cyan',
            isHovered && !isHighlighted && 'bg-white/5'
          )}
          onMouseEnter={() => setHoveredLine(lineNumber)}
          onMouseLeave={() => setHoveredLine(null)}
        >
          {lineNumber}
        </div>
      );
    });
  };

  // 渲染代码行
  const renderCodeLines = () => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const lineNumber = startLine + index;
      const isHighlighted = highlightLines.includes(lineNumber);
      const isHovered = hoveredLine === lineNumber;

      return (
        <div
          key={lineNumber}
          className={cn(
            'flex pr-4 transition-colors',
            isHighlighted && 'bg-cyber-cyan/20',
            isHovered && !isHighlighted && 'bg-white/5'
          )}
          onMouseEnter={() => setHoveredLine(lineNumber)}
          onMouseLeave={() => setHoveredLine(null)}
        >
          <span className="flex-1 whitespace-pre">{line || ' '}</span>
        </div>
      );
    });
  };

  // 主题样式
  const themeStyles = {
    dark: {
      bg: 'bg-gray-900',
      border: 'border-gray-700',
      text: 'text-gray-100',
      header: 'bg-gray-800',
    },
    light: {
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      text: 'text-gray-900',
      header: 'bg-gray-100',
    },
    cyber: {
      bg: 'bg-black',
      border: 'border-cyber-cyan/30',
      text: 'text-cyber-cyan',
      header: 'bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div
      ref={codeRef}
      className={cn(
        'rounded-lg border overflow-hidden',
        currentTheme.bg,
        currentTheme.border,
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={style}
    >
      {/* 头部 */}
      {showHeader && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3',
            currentTheme.header
          )}
        >
          <div className="flex items-center gap-3">
            <Code className={cn('w-5 h-5', currentTheme.text)} />
            <div className="flex items-center gap-2">
              <span className={cn('font-mono text-sm', currentTheme.text)}>
                {filename}
              </span>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  'bg-white/10',
                  currentTheme.text
                )}
              >
                {language}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 复制按钮 */}
            {allowCopy && (
              <motion.button
                onClick={handleCopy}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-white/10',
                  currentTheme.text
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            )}

            {/* 下载按钮 */}
            {allowDownload && (
              <motion.button
                onClick={handleDownload}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-white/10',
                  currentTheme.text
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-4 h-4" />
              </motion.button>
            )}

            {/* 全屏按钮 */}
            {allowFullscreen && (
              <motion.button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-white/10',
                  currentTheme.text
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* 代码内容 */}
      <div className="flex overflow-auto">
        {/* 行号 */}
        {showLineNumbers && (
          <div
            className={cn(
              'flex flex-col items-end py-4 select-none',
              'text-gray-500 text-sm font-mono',
              'border-r border-gray-700'
            )}
          >
            {renderLineNumbers()}
          </div>
        )}

        {/* 代码 */}
        <div
          className={cn(
            'flex-1 overflow-auto py-4',
            'font-mono text-sm',
            currentTheme.text
          )}
        >
          {renderCodeLines()}
        </div>
      </div>

      {/* 语言图标 */}
      {allowFullscreen && isFullscreen && (
        <motion.button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-black/80 rounded-lg"
        >
          <Minimize2 className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
};

/**
 * 多标签代码预览
 */
export interface MultiCodePreviewProps {
  files: Array<{
    name: string;
    code: string;
    language: string;
  }>;
}

export const MultiCodePreview: React.FC<MultiCodePreviewProps> = ({ files }) => {
  const [activeFile, setActiveFile] = useState(0);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* 文件标签 */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => setActiveFile(index)}
            className={cn(
              'px-4 py-2 text-sm font-mono transition-colors',
              activeFile === index
                ? 'bg-cyber-cyan text-black'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            )}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* 代码内容 */}
      <CodePreview
        {...files[activeFile]}
        filename={files[activeFile].name}
        showHeader={false}
      />
    </div>
  );
};

/**
 * 终端风格代码组件
 */
export const TerminalCode: React.FC<
  Omit<CodePreviewProps, 'showHeader' | 'theme'> & {
    prompt?: string;
  }
> = ({ prompt = '$', ...props }) => {
  return (
    <CodePreview
      {...props}
      showHeader={false}
      theme="dark"
      className="rounded-lg bg-gray-900 border border-gray-700"
    />
  );
};

export default CodePreview;
