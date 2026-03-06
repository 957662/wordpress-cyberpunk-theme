/**
 * 代码高亮组件 - 增强版
 * 支持多种语言和主题，带行号和复制功能
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, vscDarkPlus, dracula, atomDark, nord, solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Download, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeHighlighterProps {
  // 代码内容
  code: string;
  // 语言
  language?: string;
  // 文件名
  filename?: string;
  // 是否显示行号
  showLineNumbers?: boolean;
  // 起始行号
  startingLineNumber?: number;
  // 是否显示文件名
  showFilename?: boolean;
  // 是否显示复制按钮
  showCopyButton?: boolean;
  // 是否显示下载按钮
  showDownloadButton?: boolean;
  // 是否可展开/收起
  expandable?: boolean;
  // 最大高度（可展开）
  maxHeight?: string;
  // 主题
  theme?: 'oneDark' | 'vscDarkPlus' | 'dracula' | 'atomDark' | 'nord' | 'solarizedlight';
  // 自定义样式
  customStyle?: React.CSSProperties;
  // 自定义类名
  className?: string;
}

const themes = {
  oneDark,
  vscDarkPlus,
  dracula,
  atomDark,
  nord,
  solarizedlight,
};

export const CodeHighlighterNew: React.FC<CodeHighlighterProps> = ({
  code,
  language = 'javascript',
  filename,
  showLineNumbers = true,
  startingLineNumber = 1,
  showFilename = true,
  showCopyButton = true,
  showDownloadButton = false,
  expandable = false,
  maxHeight = '400px',
  theme = 'oneDark',
  customStyle = {},
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, filename, language]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const containerStyle: React.CSSProperties = {
    maxHeight: expandable && !expanded ? maxHeight : 'none',
    overflow: expandable && !expanded ? 'hidden' : 'visible',
    ...customStyle,
  };

  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden bg-gray-900',
        className
      )}
    >
      {/* 文件名和工具栏 */}
      {(showFilename && filename) || showCopyButton || showDownloadButton || expandable ? (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          {/* 文件名 */}
          {showFilename && filename && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-300 font-mono">{filename}</span>
            </div>
          )}

          {/* 工具按钮 */}
          <div className="flex items-center gap-2">
            {expandable && (
              <button
                onClick={toggleExpanded}
                className="p-1.5 rounded hover:bg-gray-700 transition-colors"
                title={expanded ? '收起' : '展开'}
              >
                {expanded ? (
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                )}
              </button>
            )}

            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className="p-1.5 rounded hover:bg-gray-700 transition-colors"
                title="下载"
              >
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            )}

            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                title={copied ? '已复制' : '复制'}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">复制</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* 代码内容 */}
      <div style={containerStyle}>
        <SyntaxHighlighter
          language={language}
          style={themes[theme]}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            maxHeight: 'none',
          }}
          lineNumberStyle={{
            color: '#6b7280',
            fontSize: '0.875rem',
            paddingRight: '1rem',
            minWidth: '2.5rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.875rem',
              lineHeight: '1.714',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* 展开提示 */}
      {expandable && !expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent flex items-center justify-center">
          <button
            onClick={toggleExpanded}
            className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
          >
            展开查看全部
          </button>
        </div>
      )}
    </div>
  );
};

// 语言选择器组件
export interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  languages?: string[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  languages = [
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
    'html',
    'css',
    'json',
    'yaml',
    'markdown',
    'bash',
    'sql',
  ],
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-400">语言:</label>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

// 主题选择器组件
export interface ThemeSelectorProps {
  currentTheme: CodeHighlighterProps['theme'];
  onThemeChange: (theme: CodeHighlighterProps['theme']) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: { value: CodeHighlighterProps['theme']; label: string }[] = [
    { value: 'oneDark', label: 'One Dark' },
    { value: 'vscDarkPlus', label: 'VS Code Dark+' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'atomDark', label: 'Atom Dark' },
    { value: 'nord', label: 'Nord' },
    { value: 'solarizedlight', label: 'Solarized Light' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-400">主题:</label>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as CodeHighlighterProps['theme'])}
        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CodeHighlighterNew;
