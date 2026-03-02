'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeBlockProps {
  /**
   * 代码内容
   */
  code: string;

  /**
   * 编程语言
   */
  language?: string;

  /**
   * 是否显示行号
   */
  showLineNumbers?: boolean;

  /**
   * 是否显示文件名
   */
  filename?: string;

  /**
   * 是否可复制
   */
  allowCopy?: boolean;

  /**
   * 是否可下载
   */
  allowDownload?: boolean;

  /**
   * 是否可展开
   */
  allowExpand?: boolean;

  /**
   * 最大高度（折叠时）
   */
  maxHeight?: string;

  /**
   * 主题
   */
  theme?: 'dark' | 'light' | 'cyber';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 高亮行号（从1开始）
   */
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  filename,
  allowCopy = true,
  allowDownload = false,
  allowExpand = false,
  maxHeight = '400px',
  theme = 'cyber',
  className = '',
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const lines = code.split('\n');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [code, filename, language]);

  const getThemeClasses = () => {
    const themes = {
      dark: 'bg-gray-900 border-gray-700',
      light: 'bg-gray-50 border-gray-300',
      cyber: 'bg-cyber-dark/80 border-cyber-cyan/30',
    };
    return themes[theme];
  };

  const getLanguageColor = () => {
    const colors: Record<string, string> = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      java: 'text-red-400',
      cpp: 'text-blue-500',
      css: 'text-pink-400',
      html: 'text-orange-400',
      json: 'text-purple-400',
      bash: 'text-gray-400',
      sql: 'text-cyan-400',
    };
    return colors[language] || 'text-gray-400';
  };

  return (
    <div className={`rounded-lg border overflow-hidden ${getThemeClasses()} ${className}`}>
      {/* 头部 */}
      {(filename || allowCopy || allowDownload) && (
        <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-black/20">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm text-gray-400 font-mono">{filename}</span>
            )}
            {language && !filename && (
              <span className={`text-sm font-medium ${getLanguageColor()}`}>
                {language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {allowCopy && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title={copied ? '已复制!' : '复制代码'}
              >
                {copied ? (
                  <Check className="text-green-400" size={16} />
                ) : (
                  <Copy className="text-gray-400 hover:text-white" size={16} />
                )}
              </motion.button>
            )}
            {allowDownload && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="下载代码"
              >
                <Download className="text-gray-400 hover:text-white" size={16} />
              </motion.button>
            )}
            {allowExpand && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title={isExpanded ? '收起' : '展开'}
              >
                {isExpanded ? (
                  <Minimize2 className="text-gray-400 hover:text-white" size={16} />
                ) : (
                  <Maximize2 className="text-gray-400 hover:text-white" size={16} />
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* 代码内容 */}
      <div
        className={`overflow-auto ${!isExpanded && allowExpand ? 'max-h-' + maxHeight : ''}`}
        style={isExpanded ? {} : { maxHeight: isExpanded ? 'none' : maxHeight }}
      >
        <pre className="p-4 text-sm font-mono">
          <code>
            {showLineNumbers ? (
              <div className="flex">
                {/* 行号 */}
                <div className="flex-shrink-0 pr-4 text-gray-600 select-none text-right">
                  {lines.map((_, index) => (
                    <div
                      key={index}
                      className={`h-5 ${
                        highlightLines.includes(index + 1) ? 'text-cyber-cyan font-bold' : ''
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                {/* 代码 */}
                <div className="flex-1">
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className={`h-5 ${
                        highlightLines.includes(index + 1)
                          ? 'bg-cyber-cyan/10 -mx-4 px-4'
                          : ''
                      }`}
                    >
                      <span className="text-gray-300">{line || ' '}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              lines.map((line, index) => (
                <div
                  key={index}
                  className={`h-5 ${
                    highlightLines.includes(index + 1) ? 'bg-cyber-cyan/10 -mx-4 px-4' : ''
                  }`}
                >
                  <span className="text-gray-300">{line || ' '}</span>
                </div>
              ))
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * 代码对比组件
 */
interface CodeDiffProps {
  /**
   * 原始代码
   */
  original: string;

  /**
   * 修改后的代码
   */
  modified: string;

  /**
   * 编程语言
   */
  language?: string;

  /**
   * 是否显示行号
   */
  showLineNumbers?: boolean;

  /**
   * 主题
   */
  theme?: 'dark' | 'light' | 'cyber';
}

export function CodeDiff({
  original,
  modified,
  language = 'javascript',
  showLineNumbers = true,
  theme = 'cyber',
}: CodeDiffProps) {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  const maxLines = Math.max(originalLines.length, modifiedLines.length);

  const getThemeClasses = () => {
    const themes = {
      dark: 'bg-gray-900 border-gray-700',
      light: 'bg-gray-50 border-gray-300',
      cyber: 'bg-cyber-dark/80 border-cyber-cyan/30',
    };
    return themes[theme];
  };

  return (
    <div className={`rounded-lg border overflow-hidden ${getThemeClasses()}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-black/20">
        <div className="flex items-center gap-4">
          <span className="text-sm text-red-400 font-medium">原始版本</span>
          <span className="text-sm text-green-400 font-medium">修改版本</span>
        </div>
        <span className={`text-sm font-medium text-gray-400`}>{language}</span>
      </div>

      {/* 代码对比 */}
      <div className="overflow-auto max-h-[600px]">
        <div className="flex">
          {/* 原始代码 */}
          <div className="flex-1 border-r border-black/20">
            <div className="p-4 text-sm font-mono">
              {originalLines.map((line, index) => (
                <div key={index} className="flex h-5">
                  {showLineNumbers && (
                    <div className="w-8 text-gray-600 select-none text-right pr-2">
                      {index + 1}
                    </div>
                  )}
                  <div className="flex-1 bg-red-500/10 -mx-2 px-2">
                    <span className="text-gray-300">{line || ' '}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 修改后的代码 */}
          <div className="flex-1">
            <div className="p-4 text-sm font-mono">
              {modifiedLines.map((line, index) => (
                <div key={index} className="flex h-5">
                  {showLineNumbers && (
                    <div className="w-8 text-gray-600 select-none text-right pr-2">
                      {index + 1}
                    </div>
                  )}
                  <div className="flex-1 bg-green-500/10 -mx-2 px-2">
                    <span className="text-gray-300">{line || ' '}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 终端模拟组件
 */
interface TerminalProps {
  /**
   * 终端内容
   */
  commands: Array<{
    command: string;
    output?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
  }>;

  /**
   * 终端标题
   */
  title?: string;

  /**
   * 是否显示时间戳
   */
  showTimestamp?: boolean;

  /**
   * 主题
   */
  theme?: 'dark' | 'cyber';
}

export function Terminal({
  commands,
  title = 'Terminal',
  showTimestamp = false,
  theme = 'cyber',
}: TerminalProps) {
  const getThemeClasses = () => {
    const themes = {
      dark: 'bg-gray-900 border-gray-700',
      cyber: 'bg-cyber-dark border-cyber-cyan/30',
    };
    return themes[theme];
  };

  const getOutputColor = (type?: string) => {
    const colors = {
      success: 'text-green-400',
      error: 'text-red-400',
      info: 'text-blue-400',
      warning: 'text-yellow-400',
    };
    return colors[type as keyof typeof colors] || 'text-gray-300';
  };

  return (
    <div className={`rounded-lg border overflow-hidden ${getThemeClasses()}`}>
      {/* 终端头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400 ml-2">{title}</span>
        </div>
      </div>

      {/* 终端内容 */}
      <div className="p-4 font-mono text-sm space-y-2">
        {commands.map((cmd, index) => (
          <div key={index}>
            {/* 命令 */}
            <div className="flex items-center gap-2">
              <span className="text-cyber-cyan">$</span>
              <span className="text-white">{cmd.command}</span>
            </div>

            {/* 输出 */}
            {cmd.output && (
              <div className={`ml-4 mt-1 ${getOutputColor(cmd.type)}`}>
                {cmd.output}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeBlock;
