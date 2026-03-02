'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
  maxHeight?: string;
  enableCopy?: boolean;
}

/**
 * 增强的代码块组件
 * 支持语法高亮、行号、文件名、复制功能
 */
export function EnhancedCodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  theme = 'dark',
  maxHeight = '600px',
  enableCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('代码已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  const syntaxTheme = theme === 'dark' ? vscDarkPlus : tomorrow;

  return (
    <div className="cyber-card overflow-hidden my-6">
      {/* 头部：文件名和复制按钮 */}
      {(filename || enableCopy) && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-darker border-b border-cyber-border">
          {filename && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-400 font-mono">{filename}</span>
            </div>
          )}
          {enableCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-card hover:bg-cyber-cyan/10 transition-colors border border-cyber-border hover:border-cyber-cyan/50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-cyber-green" />
                  <span className="text-sm text-cyber-green">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">复制代码</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* 代码内容 */}
      <div
        className="overflow-auto"
        style={{ maxHeight: maxHeight !== 'none' ? maxHeight : undefined }}
      >
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.714',
          }}
          lineNumberStyle={{
            color: '#4a5568',
            marginRight: '1rem',
            minWidth: '2rem',
            textAlign: 'right',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* 底部语言标签 */}
      <div className="px-4 py-2 bg-cyber-darker border-t border-cyber-border flex items-center justify-between">
        <span className="text-xs text-cyber-cyan uppercase tracking-wider font-semibold">
          {language}
        </span>
        <span className="text-xs text-gray-500">
          {code.split('\n').length} lines
        </span>
      </div>
    </div>
  );
}

/**
 * 内联代码组件
 */
export function InlineCode({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <code
      className={`px-1.5 py-0.5 rounded bg-cyber-muted text-cyber-cyan font-mono text-sm border border-cyber-border ${className}`}
    >
      {children}
    </code>
  );
}

/**
 * 代码组组件（并排显示多个代码块）
 */
interface CodeGroupProps {
  children: React.ReactNode;
  titles: string[];
}

export function CodeGroup({ children, titles }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="cyber-card overflow-hidden my-6">
      {/* 标签切换 */}
      <div className="flex border-b border-cyber-border bg-cyber-darker">
        {titles.map((title, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-cyber-border first:border-l-0 ${
              activeTab === index
                ? 'text-cyber-cyan bg-cyber-card border-b-2 border-b-cyber-cyan'
                : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-muted/50'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* 代码内容 */}
      <div className="overflow-auto">
        {Array.isArray(children) ? children[activeTab] : children}
      </div>
    </div>
  );
}

/**
 * 命令行代码块组件
 */
export function TerminalBlock({
  commands,
  output,
}: {
  commands: string[];
  output?: string[];
}) {
  return (
    <div className="cyber-card overflow-hidden my-6">
      <div className="bg-cyber-darker px-4 py-2 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400 font-mono">Terminal</span>
        </div>
      </div>

      <div className="p-4 bg-[#1e1e1e] font-mono text-sm">
        {commands.map((command, index) => (
          <div key={index} className="mb-2">
            <span className="text-cyber-green">$</span>
            <span className="ml-2 text-gray-200">{command}</span>
          </div>
        ))}

        {output && (
          <div className="mt-3 text-gray-400 whitespace-pre-wrap">{output.join('\n')}</div>
        )}
      </div>
    </div>
  );
}
