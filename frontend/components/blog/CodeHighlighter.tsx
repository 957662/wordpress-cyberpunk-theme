'use client';

/**
 * 代码高亮组件
 * 支持多种编程语言的语法高亮
 * 带有复制代码功能和行号显示
 */

import { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, tomorrow, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

// 支持的编程语言
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'bash',
  'powershell',
  'docker',
] as const;

// 支持的主题
export const THEMES = {
  dark: vscDarkPlus,
  dracula,
  tomorrow,
  atomDark,
} as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type ThemeName = keyof typeof THEMES;

interface CodeHighlighterProps {
  code: string;
  language?: SupportedLanguage;
  theme?: ThemeName;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  wrapLongLines?: boolean;
  showCopyButton?: boolean;
  showLanguageLabel?: boolean;
  className?: string;
  maxHeight?: string;
}

export function CodeHighlighter({
  code,
  language = 'typescript',
  theme = 'dark',
  showLineNumbers = true,
  startingLineNumber = 1,
  wrapLongLines = false,
  showCopyButton = true,
  showLanguageLabel = true,
  className = '',
  maxHeight = '600px',
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('代码已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('复制失败');
      console.error('复制代码失败:', error);
    }
  }, [code]);

  const themeStyle = THEMES[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative group rounded-lg overflow-hidden border border-cyber-border ${className}`}
      style={{
        maxHeight,
        background: themeStyle?.['pre']?.background || '#1e1e1e',
      }}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-muted/50 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyber-cyan" />
          {showLanguageLabel && (
            <span className="text-sm font-medium text-cyber-cyan capitalize">
              {language}
            </span>
          )}
        </div>

        {showCopyButton && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-dark hover:bg-cyber-muted transition-colors"
            aria-label="复制代码"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-cyber-green" />
                  <span className="text-sm text-cyber-green">已复制</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-cyber-muted group-hover:text-cyber-cyan transition-colors" />
                  <span className="text-sm text-cyber-muted group-hover:text-cyber-cyan transition-colors">
                    复制代码
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      {/* 代码区域 */}
      <div
        className="overflow-auto"
        style={{ maxHeight: `calc(${maxHeight} - 48px)` }}
      >
        <SyntaxHighlighter
          language={language}
          style={themeStyle}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          wrapLongLines={wrapLongLines}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.714',
          }}
          lineNumberStyle={{
            color: '#8b949e',
            fontSize: '0.875rem',
            paddingRight: '1rem',
            minWidth: '2.5rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '0.875rem',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* 霓虹边框效果 */}
      <div className="absolute inset-0 pointer-events-none rounded-lg">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

/**
 * 内联代码组件
 */
interface InlineCodeProps {
  children: string;
  className?: string;
}

export function InlineCode({ children, className = '' }: InlineCodeProps) {
  return (
    <code
      className={`px-2 py-1 rounded bg-cyber-muted text-cyber-cyan font-mono text-sm border border-cyber-border ${className}`}
    >
      {children}
    </code>
  );
}

/**
 * 代码块预览组件
 */
interface CodePreviewProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function CodePreview({
  children,
  title = '预览',
  className = '',
}: CodePreviewProps) {
  return (
    <div className={`my-6 ${className}`}>
      <div className="mb-2 text-sm font-medium text-cyber-cyan">{title}</div>
      <div className="p-4 rounded-lg border border-cyber-border bg-cyber-muted/30">
        {children}
      </div>
    </div>
  );
}

/**
 * 代码示例展示组件
 */
interface CodeExampleProps {
  code: string;
  language?: SupportedLanguage;
  preview?: React.ReactNode;
  title?: string;
  description?: string;
}

export function CodeExample({
  code,
  language = 'typescript',
  preview,
  title = '示例',
  description,
}: CodeExampleProps) {
  return (
    <div className="my-8 space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        {description && (
          <p className="text-cyber-muted text-sm mb-4">{description}</p>
        )}
      </div>

      <CodeHighlighter code={code} language={language} />

      {preview && <CodePreview>{preview}</CodePreview>}
    </div>
  );
}

export default CodeHighlighter;
