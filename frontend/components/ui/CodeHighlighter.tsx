'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  className?: string;
  maxHeight?: string;
}

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language = 'typescript',
  showLineNumbers = true,
  startingLineNumber = 1,
  className = '',
  maxHeight = '500px',
}) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('代码已复制', {
        duration: 2000,
        style: {
          background: isDark ? '#1a1a2e' : '#ffffff',
          color: isDark ? '#ffffff' : '#1a1a2e',
          border: `2px solid ${isDark ? '#00f0ff' : '#9d00ff'}`,
          borderRadius: '8px',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('复制失败');
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-t-lg">
        <span className="text-sm text-gray-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} />
              已复制
            </>
          ) : (
            <>
              <Copy size={14} />
              复制代码
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <div
        className="overflow-auto rounded-b-lg border-x border-b border-gray-700"
        style={{ maxHeight }}
      >
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '0.875rem',
          }}
          codeTagProps={{
            style: {
              fontFamily: '"Fira Code", "JetBrains Mono", Consolas, Monaco, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Inline code component
export const InlineCode: React.FC<{ children: string; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <code
      className={`px-2 py-1 rounded bg-purple-500/20 text-purple-400 font-mono text-sm border border-purple-500/30 ${className}`}
    >
      {children}
    </code>
  );
};

// Code block component for markdown
export const CodeBlock: React.FC<{
  children: string;
  language?: string;
  className?: string;
}> = ({ children, language = 'typescript', className = '' }) => {
  return (
    <div className={`my-6 ${className}`}>
      <CodeHighlighter code={children} language={language} />
    </div>
  );
};

export default CodeHighlighter;
