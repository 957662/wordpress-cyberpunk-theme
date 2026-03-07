'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Terminal, Code2, Maximize2, Minimize2, Download, Sun, Moon } from 'lucide-react';

interface EnhancedCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light' | 'cyber';
  maxHeight?: string;
  allowExpand?: boolean;
  onCopy?: () => void;
}

export const EnhancedCodeBlock: React.FC<EnhancedCodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  title,
  showLineNumbers = true,
  theme = 'cyber',
  maxHeight = '400px',
  allowExpand = true,
  onCopy,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'cyber'>(theme);

  const lines = code.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getThemeClasses = () => {
    const themes = {
      dark: 'bg-gray-900 border-gray-700',
      light: 'bg-white border-gray-300',
      cyber: 'bg-cyber-dark/90 border-cyber-cyan/30',
    };
    return themes[currentTheme];
  };

  const getLanguageColor = () => {
    const colors: Record<string, string> = {
      typescript: 'bg-blue-500',
      javascript: 'bg-yellow-500',
      python: 'bg-green-500',
      rust: 'bg-orange-500',
      go: 'bg-cyan-500',
      java: 'bg-red-500',
      cpp: 'bg-blue-600',
      html: 'bg-orange-600',
      css: 'bg-blue-400',
      json: 'bg-purple-500',
      markdown: 'bg-gray-500',
    };
    return colors[language] || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 overflow-hidden ${getThemeClasses()} backdrop-blur-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-current border-opacity-20 bg-black/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {title && (
            <span className="text-sm font-semibold text-cyber-cyan">{title}</span>
          )}
          {filename && (
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/20">
              <Code2 className="w-3 h-3 text-cyber-cyan/70" />
              <span className="text-xs text-cyber-cyan/70 font-mono">{filename}</span>
            </div>
          )}
          <div className={`w-2 h-2 rounded-full ${getLanguageColor()}`} />
          <span className="text-xs text-cyber-cyan/50 uppercase">{language}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setCurrentTheme(currentTheme === 'cyber' ? 'dark' : currentTheme === 'dark' ? 'light' : 'cyber')}
            className="p-1.5 rounded-lg hover:bg-cyber-cyan/20 transition-colors group"
            title="切换主题"
          >
            {currentTheme === 'light' ? (
              <Moon className="w-4 h-4 text-cyber-cyan/70 group-hover:text-cyber-cyan" />
            ) : (
              <Sun className="w-4 h-4 text-cyber-cyan/70 group-hover:text-cyber-cyan" />
            )}
          </button>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              copied
                ? 'bg-cyber-green/20 text-cyber-green'
                : 'bg-cyber-cyan/20 text-cyber-cyan hover:bg-cyber-cyan/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                复制
              </>
            )}
          </motion.button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg hover:bg-cyber-cyan/20 transition-colors group"
            title="下载代码"
          >
            <Download className="w-4 h-4 text-cyber-cyan/70 group-hover:text-cyber-cyan" />
          </button>

          {/* Expand Button */}
          {allowExpand && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-cyber-cyan/20 transition-colors group"
              title={isExpanded ? '收起' : '展开'}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-cyber-cyan/70 group-hover:text-cyber-cyan" />
              ) : (
                <Maximize2 className="w-4 h-4 text-cyber-cyan/70 group-hover:text-cyber-cyan" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div
        className={`overflow-auto ${isExpanded ? '' : 'max-h-' + maxHeight}`}
        style={isExpanded ? {} : { maxHeight }}
      >
        <pre className="p-4 m-0">
          <code className={`text-sm font-mono leading-relaxed ${
            currentTheme === 'light' ? 'text-gray-900' : 'text-cyber-cyan'
          }`}>
            {showLineNumbers ? (
              <div className="flex">
                {/* Line Numbers */}
                <div className={`flex-shrink-0 pr-4 text-right select-none border-r border-current border-opacity-20 ${
                  currentTheme === 'light' ? 'text-gray-400' : 'text-cyber-cyan/30'
                }`}>
                  {lines.map((_, index) => (
                    <div key={index} className="leading-relaxed">
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Code */}
                <div className="flex-1 pl-4">
                  {lines.map((line, index) => (
                    <div key={index} className="leading-relaxed">
                      {line || ' '}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              lines.map((line, index) => (
                <div key={index} className="leading-relaxed">
                  {line || ' '}
                </div>
              ))
            )}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-current border-opacity-20 bg-black/10 flex items-center justify-between text-xs text-cyber-cyan/50">
        <span>{lines.length} 行</span>
        <span>{code.length} 字符</span>
      </div>

      {/* Glowing Border Effect */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-xl border-2 border-cyber-green pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Inline Code Component
export const InlineCode: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-cyber-muted/50 text-cyber-cyan border-cyber-cyan/30',
    success: 'bg-green-900/30 text-cyber-green border-cyber-green/30',
    warning: 'bg-yellow-900/30 text-cyber-yellow border-cyber-yellow/30',
    error: 'bg-red-900/30 text-cyber-pink border-cyber-pink/30',
  };

  return (
    <code
      className={`px-2 py-0.5 rounded text-sm font-mono border ${variants[variant]}`}
    >
      {children}
    </code>
  );
};

// Code Preview Component
export const CodePreview: React.FC<{
  code: string;
  language?: string;
  render?: (code: string) => React.ReactNode;
}> = ({ code, language = 'tsx', render }) => {
  const [showCode, setShowCode] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-cyan" />
          <span className="text-sm font-semibold text-cyber-cyan">代码预览</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showCode
                ? 'bg-cyber-cyan/20 text-cyber-cyan'
                : 'bg-cyber-muted/20 text-cyber-cyan/50 hover:bg-cyber-muted/30'
            }`}
          >
            代码
          </button>
          <button
            onClick={() => setShowCode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !showCode
                ? 'bg-cyber-cyan/20 text-cyber-cyan'
                : 'bg-cyber-muted/20 text-cyber-cyan/50 hover:bg-cyber-muted/30'
            }`}
          >
            预览
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showCode ? (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <EnhancedCodeBlock code={code} language={language} />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-xl border-2 border-cyber-cyan/30 bg-cyber-dark/50"
          >
            {render ? render(code) : <p className="text-cyber-cyan/50 text-sm">预览功能需要提供 render 函数</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedCodeBlock;
