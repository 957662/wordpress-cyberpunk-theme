'use client';

/**
 * CodeHighlightEnhanced
 *
 * 增强的代码高亮组件
 * 支持语法高亮、行号、复制代码、语言标签
 */

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeHighlightEnhancedProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  className?: string;
}

export function CodeHighlightEnhanced({
  code,
  language = 'typescript',
  showLineNumbers = true,
  startingLineNumber = 1,
  className = '',
}: CodeHighlightEnhancedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // 语言标签映射
  const languageLabels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    csharp: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    bash: 'Bash',
    shell: 'Shell',
    markdown: 'Markdown',
  };

  const languageLabel = languageLabels[language] || language;

  return (
    <div className={`relative group rounded-lg overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-darker border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-cyan" />
          <span className="text-sm text-gray-400">{languageLabel}</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="
            flex items-center gap-2 px-3 py-1.5
            bg-cyber-dark border border-cyber-border rounded
            text-sm text-gray-400
            hover:border-cyber-cyan hover:text-cyber-cyan
            transition-all
          "
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-cyber-green" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              复制代码
            </>
          )}
        </button>
      </div>

      {/* Code Block */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#0a0a0f',
            fontSize: '0.875rem',
            lineHeight: '1.7',
          }}
          lineNumberStyle={{
            color: '#4b5563',
            fontSize: '0.75rem',
            paddingRight: '1rem',
            minWidth: '2.5rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Footer Bar */}
      <div className="px-4 py-2 bg-cyber-darker border-t border-cyber-border">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{code.split('\n').length} 行</span>
          <span>{code.length} 字符</span>
        </div>
      </div>
    </div>
  );
}

/**
 * InlineCode Component
 * 内联代码样式
 */
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="
        px-2 py-1
        bg-cyber-pink/10 border border-cyber-pink/30
        text-cyber-pink rounded
        font-mono text-sm
        before:content-none after:content-none
      "
    >
      {children}
    </code>
  );
}

/**
 * CodeBlock Component
 * 简化的代码块组件
 */
export function CodeBlock({
  children,
  language = 'typescript',
}: {
  children: string;
  language?: string;
}) {
  return <CodeHighlightEnhanced code={children} language={language} />;
}
