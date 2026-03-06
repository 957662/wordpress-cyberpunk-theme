'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'cyber';
  className?: string;
}

const languageColors: { [key: string]: string } = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#007396',
  cpp: '#00599c',
  rust: '#000000',
  go: '#00add8',
  html: '#e34f26',
  css: '#1572b6',
  json: '#000000',
  markdown: '#083fa1',
  bash: '#4eaa25',
  sql: '#cc2927',
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  theme = 'cyber',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  const themeClasses = {
    dark: {
      container: 'bg-gray-900 border-gray-700',
      header: 'bg-gray-800',
      body: 'bg-gray-900 text-gray-100',
      line: 'hover:bg-gray-800',
      lineNumbers: 'text-gray-600',
    },
    cyber: {
      container: 'bg-gray-800/50 border-cyan-500/30',
      header: 'bg-gray-800/80',
      body: 'bg-transparent text-gray-100',
      line: 'hover:bg-white/5',
      lineNumbers: 'text-gray-600',
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className={cn(
        'relative rounded-lg border overflow-hidden',
        currentTheme.container,
        className
      )}
    >
      {/* Header */}
      {(filename || language) && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2 border-b border-white/10',
            currentTheme.header
          )}
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            {filename && (
              <span className="text-sm text-gray-300">{filename}</span>
            )}
            {language && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">{language}</span>
              </>
            )}
          </div>

          {/* Language Indicator */}
          {language && languageColors[language] && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: languageColors[language] }}
            />
          )}
        </div>
      )}

      {/* Code Body */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className={cn('transition-colors', currentTheme.line)}>
                {showLineNumbers && (
                  <td
                    className={cn(
                      'sticky left-0 px-4 py-1 text-right select-none',
                      'border-r border-white/10',
                      currentTheme.lineNumbers
                    )}
                  >
                    {index + 1}
                  </td>
                )}
                <td className={cn('px-4 py-1', currentTheme.body)}>
                  <pre className="font-mono whitespace-pre">
                    {line || ' '}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Copy Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className={cn(
          'absolute top-2 right-2 p-2 rounded-lg',
          'bg-gray-700/80 hover:bg-gray-600/80',
          'backdrop-blur-sm transition-colors',
          'flex items-center gap-2'
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-gray-300" />
            <span className="text-xs text-gray-300">Copy</span>
          </>
        )}
      </motion.button>

      {/* Corner Decorations */}
      {theme === 'cyber' && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-purple-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-pink-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-400" />
        </>
      )}
    </div>
  );
};

export default CodeBlock;
