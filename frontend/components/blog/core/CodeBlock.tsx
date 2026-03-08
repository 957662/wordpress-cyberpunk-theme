'use client';

/**
 * CodeBlock - 代码高亮组件
 * 支持多种语言语法高亮，赛博朋克风格
 */

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [code]);

  const lines = code.split('\n');

  // 语法高亮 - 简化版，实际项目中可以使用 prism.js 或 highlight.js
  const highlightCode = (line: string, lang: string): string => {
    // 基本的关键字高亮
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'default', 'class', 'interface', 'type'];
    let highlighted = line;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-cyber-pink">${keyword}</span>`);
    });

    // 字符串高亮
    highlighted = highlighted.replace(/(['"`])(.*?)\1/g, '<span class="text-cyber-cyan">$1$2$1</span>');

    // 注释高亮
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');

    return highlighted;
  };

  return (
    <div className={cn('relative group my-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark border border-cyber-border rounded-t-lg">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-sm font-mono text-gray-400">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs font-mono px-2 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded">
              {language}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors rounded hover:bg-cyber-cyan/10"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-cyber-cyan" />
              <span className="text-cyber-cyan">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto bg-cyber-dark/50 border border-t-0 border-cyber-border rounded-b-lg">
        <pre className="p-4 m-0">
          <code className={`language-${language} text-sm font-mono`}>
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const isHighlighted = highlightLines.includes(lineNum);

              return (
                <div
                  key={index}
                  className={cn(
                    'table-row',
                    isHighlighted && 'bg-cyber-cyan/10'
                  )}
                >
                  {showLineNumbers && (
                    <span className="table-cell text-right pr-4 text-gray-600 select-none w-12">
                      {lineNum}
                    </span>
                  )}
                  <span
                    className="table-cell"
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line || ' ', language),
                    }}
                  />
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Neon Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
}

export default CodeBlock;
