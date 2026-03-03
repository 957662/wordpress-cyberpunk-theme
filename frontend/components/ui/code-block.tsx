/**
 * 代码块组件
 * 带复制按钮和语法高亮的代码展示组件
 */

'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
  className,
  maxHeight = '400px',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div
      className={cn(
        'my-4 overflow-hidden rounded-lg border border-cyber-border bg-[#1e1e1e]',
        className
      )}
    >
      {/* 头部 */}
      {(title || language) && (
        <div className="flex items-center justify-between border-b border-cyber-border/50 bg-[#252526] px-4 py-2">
          <div className="flex items-center gap-2">
            {language && (
              <span className="rounded bg-cyber-primary/20 px-2 py-0.5 text-xs text-cyber-primary">
                {language}
              </span>
            )}
            {title && (
              <span className="text-sm text-gray-300">{title}</span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'rounded-lg p-1.5 transition-all',
              'hover:bg-cyber-primary/20',
              copied ? 'text-green-500' : 'text-gray-400'
            )}
            title={copied ? '已复制!' : '复制代码'}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* 代码 */}
      <div style={{ maxHeight }} className="overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: 'transparent',
            padding: '1rem',
          }}
          lineNumberStyle={{
            color: '#858585',
            paddingRight: '1rem',
            fontSize: '0.875rem',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
