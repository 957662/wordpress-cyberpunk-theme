'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';

interface CyberCodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'dark' | 'light';
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  showActions?: boolean;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onUpload?: (file: File) => void;
  className?: string;
}

const languageMap: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  markdown: 'Markdown',
  bash: 'Bash',
  sql: 'SQL',
  rust: 'Rust',
  go: 'Go',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  xml: 'XML',
  yaml: 'YAML',
};

export function CyberCodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  showLineNumbers = true,
  showHeader = true,
  showActions = true,
  height = '400px',
  minHeight = '200px',
  maxHeight = '800px',
  placeholder = '输入代码...',
  onCopy,
  onDownload,
  onUpload,
  className = '',
}: CyberCodeEditorProps) {
  const [code, setCode] = useState(value);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCode(newValue);
    onChange?.(newValue);

    // Sync scroll
    if (highlightsRef.current) {
      highlightsRef.current.scrollTop = e.target.scrollTop;
      highlightsRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleDownload = () => {
    const extension = languageMap[language]?.toLowerCase() || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        onChange?.(content);
        onUpload?.(file);
      };
      reader.readAsText(file);
    }
  };

  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="text-right pr-4 text-gray-500 select-none">
        {index + 1}
      </div>
    ));
  };

  const highlightSyntax = (text: string) => {
    // Basic syntax highlighting
    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Keywords
    const keywords = [
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'class',
      'import',
      'export',
      'from',
      'default',
      'async',
      'await',
      'try',
      'catch',
      'throw',
      'new',
      'this',
      'true',
      'false',
      'null',
      'undefined',
    ];

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #c678dd">${keyword}</span>`
      );
    });

    // Strings
    highlighted = highlighted.replace(
      /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,
      '<span style="color: #98c379">$&</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b\d+\b/g,
      '<span style="color: #d19a66">$&</span>'
    );

    // Comments
    highlighted = highlighted.replace(
      /\/\/.*$/gm,
      '<span style="color: #5c6370; font-style: italic">$&</span>'
    );
    highlighted = highlighted.replace(
      /\/\*[\s\S]*?\*\//g,
      '<span style="color: #5c6370; font-style: italic">$&</span>'
    );

    // Functions
    highlighted = highlighted.replace(
      /\b([a-zA-Z_]\w*)\s*\(/g,
      '<span style="color: #61afef">$1</span>('
    );

    return highlighted;
  };

  const themeStyles = {
    dark: {
      background: '#1a1a2e',
      border: '#00f0ff40',
      text: '#e0e0e0',
      lineNumbers: '#5c6370',
      placeholder: '#7f848e',
    },
    light: {
      background: '#f5f5f5',
      border: '#00f0ff60',
      text: '#2c3e50',
      lineNumbers: '#95a5a6',
      placeholder: '#bdc3c7',
    },
  };

  const styles = themeStyles[currentTheme];

  return (
    <motion.div
      className={`rounded-lg overflow-hidden border ${className}`}
      style={{
        borderColor: styles.border,
        boxShadow: `0 0 20px ${styles.border}40`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      {showHeader && (
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#0a0a0f' : '#ffffff',
            borderBottom: `1px solid ${styles.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span
              className="text-sm font-medium px-2 py-1 rounded"
              style={{
                color: currentTheme === 'dark' ? '#00f0ff' : '#0066cc',
                backgroundColor: currentTheme === 'dark' ? '#00f0ff10' : '#0066cc10',
              }}
            >
              {languageMap[language] || language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showActions && (
              <>
                <motion.button
                  onClick={handleCopy}
                  className="p-2 rounded transition-all duration-300"
                  style={{
                    color: currentTheme === 'dark' ? '#00f0ff' : '#0066cc',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  onClick={handleDownload}
                  className="p-2 rounded transition-all duration-300"
                  style={{
                    color: currentTheme === 'dark' ? '#00f0ff' : '#0066cc',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded transition-all duration-300"
                  style={{
                    color: currentTheme === 'dark' ? '#00f0ff' : '#0066cc',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Upload className="w-4 h-4" />
                </motion.button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.html,.css,.json,.md,.sh,.sql,.rs,.go,.php,.rb,.swift,.kt,.xml,.yaml,.yml"
                  onChange={handleUpload}
                  className="hidden"
                />

                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded transition-all duration-300"
                  style={{
                    color: currentTheme === 'dark' ? '#00f0ff' : '#0066cc',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  onClick={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded transition-all duration-300"
                  style={{
                    color: currentTheme === 'dark' ? '#00f0ff' : '#0066cc',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {currentTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </motion.button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        className="relative"
        style={{
          height: isExpanded ? '90vh' : height,
          minHeight: isExpanded ? undefined : minHeight,
          maxHeight: isExpanded ? undefined : maxHeight,
          backgroundColor: styles.background,
        }}
      >
        <div className="absolute inset-0 flex overflow-hidden">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div
              className="py-4 text-sm select-none overflow-hidden"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#0d0d15' : '#e8e8e8',
                color: styles.lineNumbers,
                fontFamily: 'monospace',
                minWidth: '50px',
                textAlign: 'right',
                paddingRight: '10px',
                paddingTop: '16px',
                userSelect: 'none',
              }}
            >
              {getLineNumbers()}
            </div>
          )}

          {/* Code Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* Highlights */}
            <div
              ref={highlightsRef}
              className="absolute inset-0 p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto pointer-events-none"
              style={{
                color: styles.text,
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(code || placeholder),
              }}
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleChange}
              placeholder={placeholder}
              readOnly={readOnly}
              className="absolute inset-0 w-full h-full p-4 text-sm font-mono bg-transparent resize-none outline-none overflow-auto whitespace-pre-wrap break-words"
              style={{
                color: 'transparent',
                caretColor: '#00f0ff',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                zIndex: 1,
              }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CyberCodeEditor;
