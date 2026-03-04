/**
 * 代码块组件
 * 带语法高亮的代码显示组件
 */

'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  wrapLines = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* 文件名和复制按钮 */}
      {(filename || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-card border-b border-cyber-border">
          {filename && (
            <span className="text-sm text-gray-400 font-mono">{filename}</span>
          )}
          {!filename && <span className="text-sm text-gray-500 font-mono">{language}</span>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-colors"
            style={{
              backgroundColor: copied ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 240, 255, 0.1)',
              color: copied ? '#00ff88' : '#00f0ff',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                复制
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* 代码块 */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        wrapLongLines={wrapLines}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          background: '#0a0a0f',
        }}
        lineNumberStyle={{
          color: '#2a2a4a',
          fontSize: '0.875rem',
          paddingRight: '1rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/**
 * 行内代码组件
 */
export interface InlineCodeProps {
  children: string;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'px-2 py-1 rounded bg-cyber-muted/50 text-cyber-cyan',
        'font-mono text-sm border border-cyber-cyan/20',
        'hover:border-cyber-cyan/40 transition-colors',
        className
      )}
    >
      {children}
    </code>
  );
}
