'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, atomDark, nord, dracula, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  theme?: 'vsc-dark-plus' | 'atom-dark' | 'nord' | 'dracula' | 'one-dark';
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  wrapLongLines?: boolean;
  className?: string;
  title?: string;
}

const themes = {
  'vsc-dark-plus': vscDarkPlus,
  'atom-dark': atomDark,
  'nord': nord,
  'dracula': dracula,
  'one-dark': oneDark,
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  theme = 'vsc-dark-plus',
  showLineNumbers = true,
  startingLineNumber = 1,
  wrapLongLines = false,
  className,
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const languageDisplay = language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <div className={cn('rounded-lg overflow-hidden bg-gray-900', className)}>
      {/* 头部 */}
      {(title || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyber-cyan" />
            <span className="text-sm font-medium text-gray-300">
              {title || languageDisplay}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-md transition-all',
              'text-sm font-medium',
              'bg-gray-700 hover:bg-gray-600',
              copied ? 'text-green-400' : 'text-gray-300'
            )}
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
          </button>
        </div>
      )}

      {/* 代码区域 */}
      <div className={cn(
        'overflow-auto',
        wrapLongLines ? 'whitespace-pre-wrap' : 'whitespace-pre'
      )}>
        <SyntaxHighlighter
          language={language}
          style={themes[theme]}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            background: '#0a0a0f',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Fira Code, Monaco, Consolas, "Courier New", monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
