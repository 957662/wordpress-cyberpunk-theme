'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Link,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  readonly?: boolean;
  showPreview?: boolean;
  toolbar?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

const colorClasses = {
  cyan: {
    border: 'border-cyan-500/30 focus:border-cyan-500',
    button: 'hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300',
    glow: 'focus:shadow-[0_0_10px_rgba(0,240,255,0.3)]',
  },
  purple: {
    border: 'border-purple-500/30 focus:border-purple-500',
    button: 'hover:bg-purple-500/20 text-purple-400 hover:text-purple-300',
    glow: 'focus:shadow-[0_0_10px_rgba(157,0,255,0.3)]',
  },
  pink: {
    border: 'border-pink-500/30 focus:border-pink-500',
    button: 'hover:bg-pink-500/20 text-pink-400 hover:text-pink-300',
    glow: 'focus:shadow-[0_0_10px_rgba(255,0,128,0.3)]',
  },
  green: {
    border: 'border-green-500/30 focus:border-green-500',
    button: 'hover:bg-green-500/20 text-green-400 hover:text-green-300',
    glow: 'focus:shadow-[0_0_10px_rgba(0,255,65,0.3)]',
  },
};

const toolbarButtons = [
  { icon: Bold, label: '粗体', action: 'bold' },
  { icon: Italic, label: '斜体', action: 'italic' },
  { icon: Heading1, label: '标题1', action: 'h1' },
  { icon: Heading2, label: '标题2', action: 'h2' },
  { icon: Link, label: '链接', action: 'link' },
  { icon: ImageIcon, label: '图片', action: 'image' },
  { icon: Code, label: '代码', action: 'code' },
  { icon: List, label: '列表', action: 'ul' },
  { icon: ListOrdered, label: '有序列表', action: 'ol' },
  { icon: Quote, label: '引用', action: 'quote' },
];

export function MarkdownEditor({
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = '在此输入 Markdown 内容...',
  minHeight = '200px',
  maxHeight = '500px',
  readonly = false,
  showPreview: controlledShowPreview,
  toolbar = true,
  color = 'cyan',
  className,
}: MarkdownEditorProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue ?? internalValue;
  const colors = colorClasses[color];

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const insertMarkdown = (action: string) => {
    if (readonly || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let insertion = '';
    let cursorOffset = 0;

    switch (action) {
      case 'bold':
        insertion = `**${selectedText || '粗体文本'}**`;
        cursorOffset = selectedText ? insertion.length : 2;
        break;
      case 'italic':
        insertion = `*${selectedText || '斜体文本'}*`;
        cursorOffset = selectedText ? insertion.length : 1;
        break;
      case 'h1':
        insertion = `# ${selectedText || '标题1'}`;
        cursorOffset = insertion.length;
        break;
      case 'h2':
        insertion = `## ${selectedText || '标题2'}`;
        cursorOffset = insertion.length;
        break;
      case 'link':
        insertion = `[${selectedText || '链接文本'}](url)`;
        cursorOffset = selectedText ? insertion.length - 4 : 1;
        break;
      case 'image':
        insertion = `![${selectedText || '图片描述'}](image-url)`;
        cursorOffset = selectedText ? insertion.length - 10 : 2;
        break;
      case 'code':
        insertion = selectedText.includes('\n')
          ? `\`\`\`\n${selectedText || '代码'}\n\`\`\``
          : `\`${selectedText || '代码'}\``;
        cursorOffset = selectedText ? insertion.length : 1;
        break;
      case 'ul':
        insertion = `- ${selectedText || '列表项'}`;
        cursorOffset = insertion.length;
        break;
      case 'ol':
        insertion = `1. ${selectedText || '列表项'}`;
        cursorOffset = insertion.length;
        break;
      case 'quote':
        insertion = `> ${selectedText || '引用内容'}`;
        cursorOffset = insertion.length;
        break;
      default:
        return;
    }

    const newValue =
      value.substring(0, start) + insertion + value.substring(end);
    handleChange(newValue);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  // Simple markdown parser for preview
  const parseMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      // Bold & Italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links & Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2" />')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">$1</a>')
      // Code
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 p-4 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-cyan-400">$1</code>')
      // Quotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 italic my-2">$1</blockquote>')
      // Lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return html;
  };

  return (
    <div className={cn('rounded-xl overflow-hidden', className)}>
      {/* Toolbar */}
      {toolbar && !readonly && (
        <div className="flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.action}
                type="button"
                onClick={() => insertMarkdown(btn.action)}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  colors.button
                )}
                title={btn.label}
              >
                <btn.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              'p-2 rounded-lg transition-all',
              colors.button
            )}
            title={showPreview ? '隐藏预览' : '显示预览'}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Editor & Preview */}
      <div className={cn('flex', showPreview && 'border-t border-gray-700')}>
        {/* Textarea */}
        <div className={cn(showPreview ? 'w-1/2' : 'w-full')}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readonly}
            className={cn(
              'w-full p-4 bg-gray-900/50 text-gray-100 rounded-none resize-none',
              'outline-none transition-all font-mono text-sm leading-relaxed',
              'custom-scrollbar',
              colors.border,
              colors.glow,
              readonly && 'cursor-default'
            )}
            style={{
              minHeight,
              maxHeight,
            }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-700 p-4 bg-gray-900/30 overflow-y-auto custom-scrollbar prose prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
              className="markdown-content"
            />
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 text-xs text-gray-400">
        <span>{value.length} 字符</span>
        <span>{value.split(/\s+/).filter(Boolean).length} 词</span>
        <span>{value.split('\n').length} 行</span>
      </div>
    </div>
  );
}
