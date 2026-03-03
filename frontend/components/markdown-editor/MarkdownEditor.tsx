'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Bold,
  Italic,
  Code,
  Link,
  Image,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Strikethrough,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  Undo,
  Redo
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showPreview?: boolean;
  toolbar?: boolean;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your markdown here...',
  height = '500px',
  showPreview: initialShowPreview = true,
  toolbar = true,
  className = '',
}) => {
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const insertMarkdown = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newValue =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newValue);

    // 添加到历史记录
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // 恢复焦点
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  }, [value, onChange, history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  }, [history, historyIndex, onChange]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  }, [history, historyIndex, onChange]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      // 可以添加 toast 提示
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [value]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [value]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  }, [onChange]);

  // 简单的 Markdown 预览渲染
  const previewHTML = useMemo(() => {
    let html = value
      // 标题
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      // 代码
      .replace(/`([^`]+)`/gim, '<code class="inline-code">$1</code>')
      .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
      // 链接和图片
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // 列表
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // 换行
      .replace(/\n/gim, '<br />');

    return html;
  }, [value]);

  const toolbarButtons = [
    { icon: Heading1, action: () => insertMarkdown('# ', ''), title: 'Heading 1' },
    { icon: Heading2, action: () => insertMarkdown('## ', ''), title: 'Heading 2' },
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), title: 'Italic' },
    { icon: Strikethrough, action: () => insertMarkdown('~~', '~~', 'strikethrough'), title: 'Strikethrough' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), title: 'Inline Code' },
    { icon: Link, action: () => insertMarkdown('[', '](url)', 'link text'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')', 'image-url'), title: 'Image' },
    { icon: List, action: () => insertMarkdown('* ', ''), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', ''), title: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('> ', ''), title: 'Quote' },
  ];

  return (
    <div className={`markdown-editor ${className}`}>
      {toolbar && (
        <div className="flex items-center gap-2 p-3 bg-gray-900/50 border-b border-gray-800 rounded-t-lg">
          <div className="flex items-center gap-1 flex-1">
            {toolbarButtons.map((button, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.action}
                className="p-2 hover:bg-cyber-cyan/20 rounded-md transition-colors group"
                title={button.title}
              >
                <button.icon className="w-4 h-4 text-gray-400 group-hover:text-cyber-cyan" />
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50"
              title="Undo"
            >
              <Undo className="w-4 h-4 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50"
              title="Redo"
            >
              <Redo className="w-4 h-4 text-gray-400" />
            </motion.button>
            <div className="w-px h-6 bg-gray-700 mx-2" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </motion.button>
            <label className="p-2 hover:bg-gray-800 rounded-md transition-colors cursor-pointer" title="Upload">
              <Upload className="w-4 h-4 text-gray-400" />
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 hover:bg-cyber-cyan/20 rounded-md transition-colors ml-2"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? (
              <Eye className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>
        </div>
      )}

      <div className="grid grid-cols-1 divide-x divide-gray-800" style={{ height }}>
        <textarea
          id="markdown-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full p-4 bg-gray-900/30 text-gray-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          style={{ height }}
        />

        {showPreview && (
          <div
            className="w-full h-full p-4 overflow-auto prose prose-invert max-w-none"
            style={{ height }}
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        )}
      </div>

      <style jsx>{`
        .markdown-editor {
          border: 1px solid #1f2937;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .prose :global(h1) {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          color: #00f0ff;
        }

        .prose :global(h2) {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          color: #9d00ff;
        }

        .prose :global(h3) {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        .prose :global(code) {
          background: #1f2937;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }

        .prose :global(pre) {
          background: #1f2937;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
        }

        .prose :global(blockquote) {
          border-left: 4px solid #00f0ff;
          padding-left: 1em;
          margin: 1em 0;
          color: #9ca3af;
        }

        .prose :global(a) {
          color: #00f0ff;
          text-decoration: underline;
        }

        .prose :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
        }

        .prose :global(li) {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};

export default MarkdownEditor;
