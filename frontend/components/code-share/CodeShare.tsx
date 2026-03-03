'use client';

/**
 * CodeShare - 代码分享组件
 * 支持语法高亮、复制、下载等功能
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Code2,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeShareProps {
  /** 代码内容 */
  code: string;
  /** 编程语言 */
  language?: string;
  /** 文件名 */
  filename?: string;
  /** 是否显示文件名 */
  showFilename?: boolean;
  /** 主题 */
  theme?: 'dark' | 'synthwave';
  /** 起始行号 */
  startingLineNumber?: number;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

export function CodeShare({
  code,
  language = 'typescript',
  filename = 'example.ts',
  showFilename = true,
  theme = 'dark',
  startingLineNumber = 1,
  showLineNumbers = true,
  className = '',
}: CodeShareProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const themeStyle = theme === 'synthwave' ? synthwave84 : vscDarkPlus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cyber-card overflow-hidden ${className}`}
    >
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-dark/80 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-cyber-cyan" />
          {showFilename && (
            <span className="text-sm font-mono text-gray-300">
              {filename}
            </span>
          )}
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 复制按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-colors group relative"
            aria-label="复制代码"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-cyber-cyan" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* 下载按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-cyber-purple/10 transition-colors"
            aria-label="下载代码"
          >
            <Download className="w-4 h-4 text-gray-400 hover:text-cyber-purple" />
          </motion.button>

          {/* 展开/收起按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-cyber-pink/10 transition-colors"
            aria-label={isExpanded ? '收起代码' : '展开代码'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4 text-gray-400 hover:text-cyber-pink" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-400 hover:text-cyber-pink" />
            )}
          </motion.button>
        </div>
      </div>

      {/* 代码内容 */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-none' : 'max-h-96 overflow-y-auto'
        }`}
      >
        <SyntaxHighlighter
          language={language}
          style={themeStyle}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: 'rgba(10, 10, 15, 0.95)',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Fira Code', 'Consolas', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* 底部渐变遮罩（仅收起状态显示） */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-cyber-dark to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
}

export default CodeShare;
