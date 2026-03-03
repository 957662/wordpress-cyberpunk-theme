/**
 * 代码块组件
 * 支持语法高亮、复制代码、行号等功能
 */

'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  startingLineNumber = 1,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLineProps = (lineNumber: number) => {
    const actualLineNumber = lineNumber + startingLineNumber - 1;
    return {
      style: {
        display: 'flex',
        backgroundColor: highlightLines.includes(actualLineNumber)
          ? 'rgba(0, 240, 255, 0.1)'
          : undefined,
        borderLeft: highlightLines.includes(actualLineNumber)
          ? '2px solid #00f0ff'
          : undefined,
      },
    };
  };

  return (
    <div className={cn('relative group', className)}>
      {/* 文件名和复制按钮 */}
      {(filename || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-muted border-b border-cyber-border rounded-t-lg">
          {filename && (
            <span className="text-sm text-gray-400 font-mono">{filename}</span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-cyber-card border border-cyber-border hover:border-cyber-cyan transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">复制代码</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* 代码内容 */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
            background: '#16162a',
            fontSize: '0.875rem',
            lineHeight: '1.7',
          }}
          lineNumberStyle={{
            color: '#4b5563',
            fontSize: '0.75rem',
            minWidth: '2.5rem',
            paddingRight: '1rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
          wrapLines={true}
          lineProps={getLineProps}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default CodeBlock;
