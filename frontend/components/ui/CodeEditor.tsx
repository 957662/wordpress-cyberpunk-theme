'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * CodeEditor - 代码编辑器组件
 * 支持语法高亮、行号、主题切换、代码格式化
 */

export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'sql'
  | 'html'
  | 'css'
  | 'json'
  | 'xml'
  | 'yaml'
  | 'markdown'
  | 'bash';

export interface EditorTheme {
  name: string;
  background: string;
  foreground: string;
  lineNumbers: string;
  selection: string;
  cursor: string;
  keywords: string;
  strings: string;
  comments: string;
  functions: string;
  numbers: string;
  operators: string;
}

export const editorThemes: Record<string, EditorTheme> = {
  dark: {
    name: 'Dark',
    background: '#1a1a2e',
    foreground: '#eee',
    lineNumbers: '#666',
    selection: 'rgba(0, 240, 255, 0.1)',
    cursor: '#00f0ff',
    keywords: '#ff79c6',
    strings: '#f1fa8c',
    comments: '#6272a4',
    functions: '#50fa7b',
    numbers: '#bd93f9',
    operators: '#ff79c6',
  },
  monokai: {
    name: 'Monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    lineNumbers: '#90908a',
    selection: 'rgba(255, 255, 255, 0.1)',
    cursor: '#f8f8f0',
    keywords: '#f92672',
    strings: '#e6db74',
    comments: '#75715e',
    functions: '#a6e22e',
    numbers: '#ae81ff',
    operators: '#f92672',
  },
  github: {
    name: 'GitHub',
    background: '#ffffff',
    foreground: '#24292e',
    lineNumbers: '#1b1f234d',
    selection: 'rgba(0, 109, 248, 0.1)',
    cursor: '#24292e',
    keywords: '#d73a49',
    strings: '#032f62',
    comments: '#6a737d',
    functions: '#6f42c1',
    numbers: '#005cc5',
    operators: '#d73a49',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    background: '#0a0a0f',
    foreground: '#00f0ff',
    lineNumbers: '#9d00ff',
    selection: 'rgba(0, 240, 255, 0.15)',
    cursor: '#00f0ff',
    keywords: '#ff0080',
    strings: '#f0ff00',
    comments: '#666',
    functions: '#00f0ff',
    numbers: '#9d00ff',
    operators: '#ff0080',
  },
};

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: Language;
  theme?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  minimap?: boolean;
  fontSize?: number;
  tabSize?: number;
  height?: string | number;
  width?: string | number;
  placeholder?: string;
  className?: string;
  onCopy?: () => void;
  onDownload?: () => void;
  showHeader?: boolean;
  filename?: string;
}

// Syntax highlighting keywords
const languageKeywords: Record<Language, string[]> = {
  javascript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
    'throw', 'new', 'this', 'super', 'typeof', 'instanceof', 'null', 'undefined',
    'true', 'false', 'break', 'continue', 'switch', 'case', 'default', 'do',
  ],
  typescript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
    'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected',
    'readonly', 'abstract', 'static', 'as', 'in', 'of', 'typeof', 'instanceof',
  ],
  python: [
    'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
    'finally', 'with', 'as', 'import', 'from', 'raise', 'pass', 'break', 'continue',
    'and', 'or', 'not', 'in', 'is', 'lambda', 'yield', 'global', 'nonlocal', 'assert',
  ],
  java: [
    'public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface',
    'extends', 'implements', 'package', 'import', 'void', 'int', 'String', 'boolean',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return',
    'new', 'this', 'super', 'try', 'catch', 'finally', 'throw', 'throws', 'instanceof',
  ],
  cpp: [
    'int', 'float', 'double', 'char', 'void', 'bool', 'auto', 'const', 'static',
    'class', 'struct', 'public', 'private', 'protected', 'virtual', 'override',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'return', 'new', 'delete', 'this', 'template', 'typename', 'using', 'namespace',
  ],
  csharp: [
    'public', 'private', 'protected', 'internal', 'static', 'readonly', 'const',
    'class', 'struct', 'interface', 'enum', 'delegate', 'event', 'void', 'int',
    'string', 'bool', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch',
    'case', 'break', 'continue', 'return', 'new', 'this', 'base', 'try', 'catch',
  ],
  go: [
    'func', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'go',
    'select', 'defer', 'go', 'package', 'import', 'return', 'if', 'else', 'for',
    'range', 'switch', 'case', 'break', 'continue', 'fallthrough', 'default',
    'goto', 'nil', 'true', 'false', 'iota',
  ],
  rust: [
    'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait',
    'type', 'where', 'for', 'while', 'loop', 'match', 'if', 'else', 'return',
    'break', 'continue', 'unsafe', 'async', 'await', 'move', 'ref', 'in',
    'dyn', 'crate', 'mod', 'use', 'pub', 'extern',
  ],
  php: [
    'function', 'class', 'interface', 'extends', 'implements', 'public', 'private',
    'protected', 'static', 'final', 'abstract', 'const', 'return', 'if', 'else',
    'elseif', 'foreach', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'new', 'clone', 'try', 'catch', 'finally', 'throw', 'isset', 'empty',
  ],
  ruby: [
    'def', 'class', 'module', 'end', 'if', 'else', 'elsif', 'unless', 'case', 'when',
    'while', 'until', 'for', 'in', 'do', 'begin', 'rescue', 'ensure', 'return',
    'next', 'break', 'redo', 'retry', 'yield', 'super', 'self', 'true', 'false', 'nil',
  ],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER'],
  html: [],
  css: [],
  json: [],
  xml: [],
  yaml: [],
  markdown: [],
  bash: ['if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac', 'function'],
};

// Simple syntax highlighter
const highlightCode = (code: string, language: Language, theme: EditorTheme): JSX.Element[] => {
  const keywords = languageKeywords[language] || [];
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      return <br key={lineIndex} />;
    }

    // Simple tokenization
    let highlightedLine = line;

    // Highlight strings
    highlightedLine = highlightedLine.replace(
      /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,
      (match) => `<span style="color: ${theme.strings}">${match}</span>`
    );

    // Highlight comments
    const commentMatch = line.match(/(\/\/.*$|#.*$|\/\*.*?\*\/)/);
    if (commentMatch) {
      const beforeComment = line.substring(0, commentMatch.index);
      const comment = commentMatch[0];
      return (
        <span key={lineIndex}>
          {beforeComment && (
            <span dangerouslySetInnerHTML={{ __html: highlightCode(beforeComment, language, theme).join('') }} />
          )}
          <span style={{ color: theme.comments }}>{comment}</span>
        </span>
      );
    }

    // Highlight keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedLine = highlightedLine.replace(
        regex,
        `<span style="color: ${theme.keywords}">${keyword}</span>`
      );
    });

    // Highlight numbers
    highlightedLine = highlightedLine.replace(
      /\b\d+\.?\d*\b/g,
      (match) => `<span style="color: ${theme.numbers}">${match}</span>`
    );

    // Highlight function calls
    highlightedLine = highlightedLine.replace(
      /\b([a-zA-Z_]\w*)\s*\(/g,
      (match, func) => `<span style="color: ${theme.functions}">${func}</span>(`
    );

    return <span key={lineIndex} dangerouslySetInnerHTML={{ __html: highlightedLine }} />;
  });
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  lineNumbers = true,
  minimap = false,
  fontSize = 14,
  tabSize = 2,
  height = '400px',
  width = '100%',
  placeholder = 'Enter your code here...',
  className,
  onCopy,
  onDownload,
  showHeader = true,
  filename = 'untitled',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const currentTheme = editorThemes[theme] || editorThemes.dark;

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const spaces = ' '.repeat(tabSize);

      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);

      // Move cursor
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(start + tabSize, start + tabSize);
      }, 0);
    }
  };

  // Handle input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    updateCursorPosition();
  };

  // Update cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;

    const text = value.substring(0, textareaRef.current.selectionStart);
    const lines = text.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });
  };

  // Scroll sync
  const handleScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Copy code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download code
  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.includes('.') ? filename : `${filename}.${language}`;
    a.click();
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  const lines = value.split('\n');
  const totalLines = lines.length;

  return (
    <motion.div
      className={cn(
        'relative rounded-lg overflow-hidden border',
        'transition-all duration-200',
        isFocused && 'ring-2 ring-cyan-500/50',
        className
      )}
      style={{
        borderColor: isFocused ? currentTheme.cursor : currentTheme.lineNumbers,
        background: currentTheme.background,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        borderColor: isFocused ? currentTheme.cursor : currentTheme.lineNumbers,
      }}
    >
      {/* Header */}
      {showHeader && (
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: currentTheme.lineNumbers }}
        >
          <div className="flex items-center gap-2">
            {/* Mac-style window buttons */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm ml-2" style={{ color: currentTheme.foreground }}>
              {filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language badge */}
            <span
              className="px-2 py-1 text-xs rounded"
              style={{
                background: currentTheme.selection,
                color: currentTheme.foreground,
              }}
            >
              {language}
            </span>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy code"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Download code"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        className="relative overflow-auto"
        style={{ height, width }}
      >
        <div className="flex min-h-full">
          {/* Line numbers */}
          {lineNumbers && (
            <div
              className="flex-shrink-0 py-4 px-2 text-right select-none user-none"
              style={{
                background: currentTheme.selection,
                color: currentTheme.lineNumbers,
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
                fontFamily: 'monospace',
                minWidth: '50px',
              }}
            >
              {Array.from({ length: totalLines }, (_, i) => (
                <div key={i} className="pr-2">
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code area */}
          <div className="relative flex-1 overflow-auto">
            {/* Highlighted code (behind) */}
            <pre
              ref={preRef}
              className="absolute inset-0 py-4 px-4 m-0 pointer-events-none"
              style={{
                color: currentTheme.foreground,
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
                fontFamily: 'monospace',
                whiteSpace: 'pre',
                overflow: 'auto',
              }}
            >
              {value ? (
                highlightCode(value, language, currentTheme)
              ) : (
                <span style={{ color: currentTheme.lineNumbers }}>{placeholder}</span>
              )}
            </pre>

            {/* Textarea (transparent, on top) */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onClick={updateCursorPosition}
              onKeyUp={updateCursorPosition}
              readOnly={readOnly}
              placeholder={placeholder}
              className="absolute inset-0 py-4 px-4 w-full h-full resize-none bg-transparent text-transparent caret-current outline-none overflow-auto"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
                fontFamily: 'monospace',
                whiteSpace: 'pre',
                caretColor: currentTheme.cursor,
              }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t text-xs"
        style={{ borderColor: currentTheme.lineNumbers, color: currentTheme.lineNumbers }}
      >
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          <span>{value.length} chars</span>
          <span>{totalLines} lines</span>
        </div>
        <div>
          {language} • {currentTheme.name}
        </div>
      </div>
    </motion.div>
  );
};

// ==================== Code Block Display Component ====================

export interface CodeBlockProps {
  code: string;
  language?: Language;
  theme?: string;
  showLineNumbers?: boolean;
  filename?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  theme = 'dark',
  showLineNumbers = true,
  filename,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const currentTheme = editorThemes[theme] || editorThemes.dark;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn('relative rounded-lg overflow-hidden', className)}
      style={{ background: currentTheme.background }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: currentTheme.lineNumbers }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="text-sm ml-2" style={{ color: currentTheme.foreground }}>
              {filename}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors hover:bg-white/10"
          style={{ color: currentTheme.foreground }}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="flex overflow-x-auto">
        {showLineNumbers && (
          <div
            className="flex-shrink-0 py-4 px-3 text-right select-none"
            style={{
              background: currentTheme.selection,
              color: currentTheme.lineNumbers,
              fontSize: '14px',
              lineHeight: '1.5',
              fontFamily: 'monospace',
            }}
          >
            {code.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre
          className="py-4 px-4 m-0 overflow-x-auto"
          style={{
            color: currentTheme.foreground,
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'monospace',
          }}
        >
          {highlightCode(code, language, currentTheme)}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
