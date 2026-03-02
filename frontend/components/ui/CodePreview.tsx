'use client';

/**
 * 代码预览组件
 * 带有语法高亮、复制功能、行号显示
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Code, Play, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  showPreview?: boolean;
  previewComponent?: React.ReactNode;
  className?: string;
}

export function CodePreview({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
  showCopy = true,
  showPreview = false,
  previewComponent,
  className,
}: CodePreviewProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  const syntaxHighlight = (line: string) => {
    // 简单的语法高亮（实际项目中可以使用更复杂的库如 prism.js）
    return line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|class|interface|type)\b/g, '<span class="text-cyber-purple">$1</span>')
      .replace(/\b(string|number|boolean|void|any|never)\b/g, '<span class="text-cyber-green">$1</span>')
      .replace(/(['"`])((?:\\.|[^\\])*?)\1/g, '<span class="text-cyber-yellow">$1$2$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-cyber-cyan">$1</span>');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-cyber-dark/80 backdrop-blur-sm border-2 border-cyber-border rounded-2xl overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-muted border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-cyber-cyan" />
          {title && <h3 className="font-semibold text-white">{title}</h3>}
          {!title && (
            <div className="flex items-center gap-2">
              <span className={cn('px-2 py-1 rounded text-xs font-medium', language === 'typescript' && 'bg-blue-500/20 text-blue-400')}>
                {language}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          {showCopy && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                isCopied ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-muted text-gray-400 hover:text-white'
              )}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? '已复制' : '复制'}
            </motion.button>
          )}

          {/* Expand Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-cyber-muted transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      {showPreview && previewComponent && (
        <div className="flex items-center gap-1 px-4 py-2 bg-cyber-darker border-b border-cyber-border">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
            onClick={() => setActiveTab('code')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'code'
                ? 'bg-cyber-cyan/10 text-cyber-cyan'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <Code className="w-4 h-4" />
            代码
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
            onClick={() => setActiveTab('preview')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'preview'
                ? 'bg-cyber-cyan/10 text-cyber-cyan'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <Play className="w-4 h-4" />
            预览
          </motion.button>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative overflow-auto',
              isExpanded ? 'max-h-[600px]' : 'max-h-[400px]'
            )}
          >
            <div className="flex">
              {/* Line Numbers */}
              {showLineNumbers && (
                <div className="flex-shrink-0 py-4 px-3 bg-cyber-darker border-r border-cyber-border select-none">
                  <div className="text-sm font-mono text-gray-600 text-right leading-6">
                    {lines.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Content */}
              <div className="flex-1 py-4 px-4 overflow-auto">
                <pre className="text-sm font-mono leading-6">
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className="hover:bg-cyber-cyan/5 -mx-4 px-4 rounded"
                      dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) || '&nbsp;' }}
                    />
                  ))}
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'preview' && previewComponent && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'p-6 bg-cyber-darker/50',
              isExpanded ? 'max-h-[600px]' : 'max-h-[400px]'
            )}
            style={{ overflowY: 'auto' }}
          >
            {previewComponent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-4 py-2 bg-cyber-muted border-t border-cyber-border">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{lines.length} 行</span>
          <span>{code.length} 字符</span>
        </div>
      </div>
    </motion.div>
  );
}

export default CodePreview;
