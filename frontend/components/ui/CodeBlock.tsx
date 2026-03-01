'use client';

/**
 * 代码块组件
 * 支持语法高亮的代码展示
 */

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

// 支持的语言类型
export type Language =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'python'
  | 'java'
  | 'cpp'
  | 'css'
  | 'html'
  | 'bash'
  | 'json'
  | 'markdown';

interface CodeBlockProps {
  code: string;
  language?: Language;
  title?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

// 语言别名映射
const languageAliases: Record<string, Language> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  c: 'cpp',
  sh: 'bash',
  yml: 'yaml',
  xml: 'html',
};

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  fileName,
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 处理复制
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 规范化语言
  const normalizedLanguage = languageAliases[language] || language;

  // 获取标题
  const displayTitle = title || fileName;

  return (
    <div className={cn('relative group', className)}>
      {/* 标题栏 */}
      {displayTitle && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark/80 border-b border-cyber-cyan/30 rounded-t-lg">
          <span className="text-sm text-cyber-cyan">{displayTitle}</span>
          <span className="text-xs text-gray-500 uppercase">{normalizedLanguage}</span>
        </div>
      )}

      {/* 代码区域 */}
      <div className={cn(
        'rounded-lg overflow-hidden',
        !displayTitle && 'border border-cyber-cyan/30',
        displayTitle && 'border-x border-b border-cyber-cyan/30 rounded-t-none'
      )}>
        <SyntaxHighlighter
          language={normalizedLanguage}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: displayLabel ? '0 0 8px 8px' : '8px',
            background: '#0a0a0f',
          }}
          lineNumberStyle={{
            color: '#4b5563',
            fontSize: '0.875rem',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
          wrapLines
          lineProps={(lineNumber) => ({
            style: {
              display: 'block',
              backgroundColor: highlightLines.includes(lineNumber)
                ? 'rgba(0, 240, 255, 0.1)'
                : 'transparent',
            },
          })}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className={cn(
          'absolute top-3 right-3 p-2 rounded-lg transition-all',
          'bg-cyber-cyan/10 backdrop-blur-sm border border-cyber-cyan/30',
          'hover:bg-cyber-cyan/20 hover:border-cyber-cyan',
          'opacity-0 group-hover:opacity-100',
          copied && 'opacity-100'
        )}
        title={copied ? '已复制!' : '复制代码'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-cyber-green" />
        ) : (
          <Copy className="w-4 h-4 text-cyber-cyan" />
        )}
      </button>
    </div>
  );
}

// 内联代码组件
interface InlineCodeProps {
  children: string;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'px-2 py-0.5 rounded text-sm font-mono',
        'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30',
        'before:content-["`"] after:content-["`"]',
        className
      )}
    >
      {children}
    </code>
  );
}

// 命令行组件
interface TerminalProps {
  command: string;
  output?: string;
  className?: string;
}

export function Terminal({ command, output, className }: TerminalProps) {
  return (
    <div className={cn(
      'bg-black rounded-lg border border-cyber-cyan/30 overflow-hidden',
      className
    )}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-cyber-cyan/30">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-sm text-gray-500">Terminal</span>
      </div>
      <div className="p-4 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-cyber-green">$</span>
          <span className="text-gray-200">{command}</span>
        </div>
        {output && (
          <div className="mt-2 text-gray-400 whitespace-pre-wrap">{output}</div>
        )}
      </div>
    </div>
  );
}

export default CodeBlock;
