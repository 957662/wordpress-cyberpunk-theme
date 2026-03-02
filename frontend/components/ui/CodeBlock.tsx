'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  theme?: 'dark' | 'cyber' | 'monokai' | 'github';
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  filename,
  showLineNumbers = true,
  highlightLines = [],
  theme = 'cyber',
  className = ''
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeClasses = {
    dark: 'bg-gray-900 border-gray-800',
    cyber: 'bg-gradient-to-br from-gray-900 via-gray-900 to-black border-cyan-500/30',
    monokai: 'bg-[#272822] border-[#3e3d32]',
    github: 'bg-[#0d1117] border-[#30363d]'
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-400',
      typescript: 'bg-blue-400',
      python: 'bg-green-400',
      java: 'bg-orange-400',
      cpp: 'bg-blue-500',
      rust: 'bg-orange-500',
      go: 'bg-cyan-400',
      php: 'bg-purple-400',
      ruby: 'bg-red-400',
      sql: 'bg-blue-300'
    };
    return colors[lang.toLowerCase()] || 'bg-gray-400';
  };

  return (
    <div className={\`rounded-lg overflow-hidden border \${themeClasses[theme]} \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Mac 风格窗口按钮 */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* 文件名或标题 */}
          {filename && (
            <span className="text-sm text-gray-400 ml-2 font-mono">{filename}</span>
          )}
          {title && !filename && (
            <span className="text-sm text-gray-300 font-medium">{title}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* 语言标签 */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 rounded">
            <div className={\`w-2 h-2 rounded-full \${getLanguageColor(language)}\`} />
            <span className="text-xs text-gray-400">{language}</span>
          </div>

          {/* 复制按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-1.5 hover:bg-gray-800/50 rounded transition-colors group relative"
            title="复制代码"
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
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <pre className={\`p-4 text-sm font-mono \${theme === 'cyber' ? 'text-cyan-100' : 'text-gray-100'}\`}>
          <code>
            {lines.map((line, index) => (
              <div
                key={index}
                className={\`\${highlightLines.includes(index + 1) ? 'bg-cyan-500/10 -mx-4 px-4' : ''}\`}
              >
                {showLineNumbers && (
                  <span className="inline-block w-8 text-gray-600 select-none mr-4 text-right">
                    {index + 1}
                  </span>
                )}
                <span className={highlightLines.includes(index + 1) ? 'text-cyan-300' : ''}>
                  {line || ' '}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer info */}
      <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
        <span>{lines.length} lines</span>
        <span>{code.length} characters</span>
      </div>
    </div>
  );
}

// 内联代码组件
interface InlineCodeProps {
  children: React.ReactNode;
  variant?: 'default' | 'cyber' | 'subtle';
  className?: string;
}

export function InlineCode({ children, variant = 'cyber', className = '' }: InlineCodeProps) {
  const variantClasses = {
    default: 'bg-gray-800 text-cyan-400 border border-gray-700',
    cyber: 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30',
    subtle: 'bg-gray-800/50 text-gray-300'
  };

  return (
    <code className={\`px-1.5 py-0.5 rounded text-sm font-mono \${variantClasses[variant]} \${className}\`}>
      {children}
    </code>
  );
}

// 命令行组件
interface TerminalBlockProps {
  commands: string[];
  output?: string;
  className?: string;
}

export function TerminalBlock({ commands, output, className = '' }: TerminalBlockProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={\`rounded-lg overflow-hidden bg-black border border-gray-800 \${className}\`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-sm text-gray-400">Terminal</span>
      </div>

      <div className="p-4 space-y-2 font-mono text-sm">
        {commands.map((command, index) => (
          <div key={index} className="flex items-start gap-2 group">
            <span className="text-green-400 select-none">$</span>
            <code className="flex-1 text-gray-100">{command}</code>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCopy(command, index)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-800 rounded transition-all"
            >
              {copiedIndex === index ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-500" />
              )}
            </motion.button>
          </div>
        ))}

        {output && (
          <div className="text-gray-400 whitespace-pre-wrap mt-2 pl-4 border-l-2 border-gray-700">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}

// 文件树组件
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  icon?: React.ReactNode;
}

interface FileTreeProps {
  files: FileNode[];
  className?: string;
}

export function FileTree({ files, className = '' }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const renderNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.name);
    const paddingLeft = depth * 16 + 8;

    if (node.type === 'folder') {
      return (
        <div key={node.name}>
          <div
            className="flex items-center gap-2 py-1 hover:bg-gray-800/50 px-2 cursor-pointer rounded"
            style={{ paddingLeft }}
            onClick={() => toggleFolder(node.name)}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▶
            </motion.div>
            {node.icon || <span className="text-yellow-400">📁</span>}
            <span className="text-gray-300 text-sm">{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div className="mt-1">
              {node.children.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.name}
        className="flex items-center gap-2 py-1 hover:bg-gray-800/50 px-2 rounded"
        style={{ paddingLeft }}
      >
        <span className="w-3" />
        {node.icon || <span className="text-blue-400">📄</span>}
        <span className="text-gray-300 text-sm">{node.name}</span>
      </div>
    );
  };

  return (
    <div className={\`bg-gray-900/50 border border-gray-800 rounded-lg p-3 \${className}\`}>
      {files.map(file => renderNode(file))}
    </div>
  );
}

export default CodeBlock;
