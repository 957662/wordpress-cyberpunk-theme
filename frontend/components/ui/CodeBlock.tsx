'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  variant?: 'default' | 'neon' | 'cyber';
  showLineNumbers?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  maxHeight?: string;
  className?: string;
}

const languageColors: Record<string, string> = {
  javascript: 'text-yellow-400',
  typescript: 'text-blue-400',
  python: 'text-green-400',
  java: 'text-orange-400',
  cpp: 'text-blue-500',
  go: 'text-cyan-400',
  rust: 'text-orange-500',
  php: 'text-purple-400',
  ruby: 'text-red-400',
  sql: 'text-pink-400',
  html: 'text-orange-500',
  css: 'text-blue-500',
  json: 'text-yellow-500',
  markdown: 'text-white',
  bash: 'text-gray-300',
  shell: 'text-gray-300',
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  filename,
  title,
  variant = 'default',
  showLineNumbers = true,
  collapsible = false,
  defaultCollapsed = false,
  maxHeight = '400px',
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  const containerStyles = {
    default: 'bg-gray-900 border border-gray-800',
    neon: 'bg-gray-900 border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    cyber: 'bg-gray-900 border-2 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        containerStyles[variant],
        className
      )}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {(filename || title) && (
            <span className="ml-2 text-sm text-gray-400">
              {filename || title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {language && (
            <span
              className={cn(
                'text-xs font-medium',
                languageColors[language] || 'text-gray-400'
              )}
            >
              {language}
            </span>
          )}

          {collapsible && (
            <motion.button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              animate={{ rotate: collapsed ? -180 : 0 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              'bg-gray-700 hover:bg-gray-600 text-gray-300',
              'border border-gray-600'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                复制
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* 代码内容 */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="relative overflow-auto"
              style={{ maxHeight }}
            >
              <pre className="flex p-4 text-sm">
                {showLineNumbers && (
                  <div className="flex-shrink-0 pr-4 text-gray-600 select-none border-r border-gray-800">
                    {lines.map((_, index) => (
                      <div key={index} className="text-right leading-6">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                )}
                <code className="flex-1 pl-4 font-mono leading-6 text-gray-300">
                  {code}
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeBlock;
