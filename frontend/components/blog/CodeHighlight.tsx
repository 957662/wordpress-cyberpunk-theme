'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vsDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeHighlightProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
  maxHeight?: string;
}

/**
 * 代码高亮组件
 *
 * 功能特性:
 * - 支持 100+ 种编程语言
 * - 代码复制功能
 * - 文件名显示
 * - 可折叠/展开
 * - 行号显示
 * - 深色/浅色主题
 *
 * @example
 * ```tsx
 * <CodeHighlight
 *   code={sourceCode}
 *   language="typescript"
 *   filename="utils.ts"
 *   showLineNumbers
 * />
 * ```
 */
export const CodeHighlight: React.FC<CodeHighlightProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  theme = 'dark',
  maxHeight = '500px'
}) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          {/* Language indicator */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {filename && (
            <span className="text-sm text-cyan-400 font-mono">{filename}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono">
            {language}
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-cyan-500/10 transition-colors"
            title={copied ? '已复制!' : '复制代码'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Collapse button */}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded hover:bg-cyan-500/10 transition-colors"
            title={isCollapsed ? '展开代码' : '收起代码'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div
        className="overflow-auto"
        style={{
          maxHeight: isCollapsed ? '0px' : maxHeight,
          transition: 'max-height 0.3s ease'
        }}
      >
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? vscDarkPlus : vsDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.6'
          }}
          lineNumberStyle={{
            color: '#6b7280',
            fontSize: '13px',
            paddingRight: '16px'
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

/**
 * 行内代码高亮组件
 */
interface InlineCodeProps {
  children: string;
  className?: string;
}

export const InlineCode: React.FC<InlineCodeProps> = ({ children, className }) => {
  return (
    <code
      className={`
        px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400
        font-mono text-sm border border-cyan-500/20
        ${className || ''}
      `}
    >
      {children}
    </code>
  );
};

/**
 * 代码块组件 (Markdown 风格)
 */
interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language, className }) => {
  return (
    <CodeHighlight
      code={children.trim()}
      language={language || 'typescript'}
      className={className}
    />
  );
};

export default CodeHighlight;
