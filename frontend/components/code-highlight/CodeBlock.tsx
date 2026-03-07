'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, atomDark, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  lineNumbers?: boolean;
  theme?: 'dark' | 'atom' | 'tomorrow';
  showCopyButton?: boolean;
  maxHeight?: string;
  filename?: string;
}

const themes = {
  dark: vscDarkPlus,
  atom: atomDark,
  tomorrow: tomorrow,
};

const languageAliases: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  yml: 'yaml',
  json: 'json',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sql: 'sql',
  md: 'markdown',
  txt: 'text',
};

export default function CodeBlock({
  code,
  language = 'javascript',
  title,
  lineNumbers = true,
  theme = 'dark',
  showCopyButton = true,
  maxHeight = '600px',
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightLines, setHighlightLines] = useState<Set<number>>(new Set());

  const normalizedLanguage = languageAliases[language] || language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleLineClick = (lineNumber: number) => {
    setHighlightLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber);
      } else {
        newSet.add(lineNumber);
      }
      return newSet;
    });
  };

  const lineProps = (lineNumber: number) => {
    const isHighlighted = highlightLines.has(lineNumber);
    return {
      style: {
        display: 'block',
        cursor: 'pointer',
        backgroundColor: isHighlighted ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
        transition: 'background-color 0.2s ease',
      },
      onClick: () => handleLineClick(lineNumber),
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-6 rounded-lg overflow-hidden border border-cyber-cyan/30 bg-cyber-dark/50 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-muted/50 border-b border-cyber-cyan/30">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyber-cyan" />
          <span className="text-sm text-cyber-cyan font-mono">
            {filename || title || normalizedLanguage}
          </span>
        </div>

        {showCopyButton && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-sm">{copied ? '已复制' : '复制代码'}</span>
          </motion.button>
        )}
      </div>

      {/* Code Content */}
      <div
        className="overflow-auto"
        style={{ maxHeight: `${maxHeight}` }}
      >
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={themes[theme]}
          showLineNumbers={lineNumbers}
          lineProps={lineProps}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
          lineNumberStyle={{
            color: '#00f0ff',
            fontSize: '0.75rem',
            padding: '0 1rem',
            minWidth: '2.5rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-cyber-muted/30 border-t border-cyber-cyan/20 flex items-center justify-between text-xs text-cyber-cyan/60">
        <span>{normalizedLanguage}</span>
        <span>{code.split('\n').length} lines</span>
      </div>
    </motion.div>
  );
}

// Inline Code Component
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-2 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan font-mono text-sm border border-cyber-cyan/20">
      {children}
    </code>
  );
}

// Pre-formatted Code Block (for markdown content)
export function PreCode({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <pre className={`bg-cyber-dark/80 border border-cyber-cyan/30 rounded-lg p-4 overflow-x-auto ${className}`}>
      <code className="text-sm text-cyber-cyan/90 font-mono">{children}</code>
    </pre>
  );
}
