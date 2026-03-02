'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'neon' | 'cyber';
  copyable?: boolean;
  maxHeight?: string;
}

/**
 * CodeBlock - 代码块显示组件
 *
 * 支持语法高亮、行号、复制功能等
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code="console.log('Hello World');"
 *   language="typescript"
 *   title="example.ts"
 *   showLineNumbers={true}
 *   copyable={true}
 * />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  showLineNumbers = false,
  theme = 'cyber',
  copyable = true,
  maxHeight = '400px',
}) => {
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

  const lines = code.split('\n');

  const themes = {
    dark: {
      bg: 'bg-gray-900',
      header: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-gray-100',
      lineNumbers: 'text-gray-500',
      copy: 'hover:bg-gray-700',
    },
    neon: {
      bg: 'bg-purple-900/30',
      header: 'bg-purple-800/40',
      border: 'border-purple-500/50',
      text: 'text-purple-100',
      lineNumbers: 'text-purple-400/60',
      copy: 'hover:bg-purple-700/50',
    },
    cyber: {
      bg: 'bg-[#0a0a0f]',
      header: 'bg-[#1a1a2e]',
      border: 'border-cyber-cyan/30',
      text: 'text-cyber-cyan',
      lineNumbers: 'text-cyber-purple/60',
      copy: 'hover:bg-cyber-purple/20',
    },
  };

  const currentTheme = themes[theme];

  // 简单的语法高亮（实际项目应使用 prism.js 或类似库）
  const highlightCode = (line: string) => {
    // 关键词
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'default', 'from', 'class', 'interface', 'type'];
    let highlighted = line;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-cyber-pink font-semibold">${keyword}</span>`);
    });

    // 字符串
    highlighted = highlighted.replace(/(['"`])((?:\\.|[^\\])*?)\1/g, '<span class="text-cyber-green">$&</span>');

    // 注释
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$&</span>');

    return highlighted;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border-2 ${currentTheme.border} ${currentTheme.bg} overflow-hidden`}
    >
      {/* Header */}
      {(title || copyable) && (
        <div className={`flex items-center justify-between px-4 py-2 ${currentTheme.header} border-b ${currentTheme.border}`}>
          {title && (
            <div className="flex items-center gap-2">
              <Code2 className={`w-4 h-4 ${currentTheme.text}`} />
              <span className={`text-sm font-medium ${currentTheme.text}`}>{title}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {language && (
              <span className={`text-xs px-2 py-1 rounded ${currentTheme.bg} ${currentTheme.lineNumbers}`}>
                {language}
              </span>
            )}
            {copyable && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`p-2 rounded transition-colors ${currentTheme.copy} ${currentTheme.text}`}
                title={copied ? 'Copied!' : 'Copy code'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-cyber-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Code Content */}
      <div
        className={`overflow-auto ${maxHeight === 'none' ? '' : 'max-h-' + maxHeight}`}
        style={maxHeight !== 'none' ? { maxHeight } : {}}
      >
        <pre className={`p-4 text-sm ${currentTheme.text}`}>
          <code>
            {lines.map((line, index) => (
              <div key={index} className="table-row">
                {showLineNumbers && (
                  <span className={`table-cell text-right pr-4 select-none ${currentTheme.lineNumbers}`}>
                    {index + 1}
                  </span>
                )}
                <span
                  className="table-cell"
                  dangerouslySetInnerHTML={{ __html: highlightCode(line) || '&nbsp;'}}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer - Line count */}
      <div className={`px-4 py-2 ${currentTheme.header} border-t ${currentTheme.border}`}>
        <span className={`text-xs ${currentTheme.lineNumbers}`}>
          {lines.length} {lines.length === 1 ? 'line' : 'lines'}
        </span>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
