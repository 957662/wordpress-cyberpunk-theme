/**
 * Markdown 编辑器组件
 * 支持实时预览、语法高亮、快捷键等功能
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Link,
  Image,
  Quote,
  SplitView,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  showPreview?: boolean;
  className?: string;
  readOnly?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = '开始输入 Markdown 内容...',
  minHeight = '300px',
  maxHeight = '600px',
  showPreview: initialShowPreview = true,
  className,
  readOnly = false,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const [selectedText, setSelectedText] = useState('');

  const textareaRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (node) {
      node.style.height = minHeight;
      node.style.height = node.scrollHeight + 'px';
    }
  }, [minHeight]);

  const insertMarkdown = useCallback(
    (before: string, after: string = '', placeholder: string = '') => {
      const textarea = document.querySelector(
        'textarea[data-markdown-editor]'
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = value;
      const selected = text.substring(start, end) || placeholder;

      const newValue =
        text.substring(0, start) + before + selected + after + text.substring(end);
      onChange(newValue);

      // 设置光标位置
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selected.length
        );
      }, 0);
    },
    [value, onChange]
  );

  const ToolbarButton = ({
    icon: Icon,
    label,
    onClick,
    disabled = false,
  }: {
    icon: typeof Bold;
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || readOnly}
      className={cn(
        'rounded-lg p-2 transition-colors',
        'hover:bg-cyber-primary/20 hover:text-cyber-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        disabled ? 'opacity-50' : ''
      )}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </motion.button>
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd + B: 粗体
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        insertMarkdown('**', '**', '粗体文本');
      }
      // Ctrl/Cmd + I: 斜体
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        insertMarkdown('*', '*', '斜体文本');
      }
      // Ctrl/Cmd + K: 链接
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        insertMarkdown('[', '](url)', '链接文本');
      }
      // Tab: 插入两个空格
      if (e.key === 'Tab') {
        e.preventDefault();
        insertMarkdown('  ');
      }
    },
    [insertMarkdown]
  );

  return (
    <div className={cn('flex flex-col gap-2 rounded-xl border border-cyber-border bg-card/50 backdrop-blur-sm', className)}>
      {/* 工具栏 */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 border-b border-cyber-border p-2">
          <ToolbarButton
            icon={Bold}
            label="粗体 (Ctrl+B)"
            onClick={() => insertMarkdown('**', '**', '粗体文本')}
          />
          <ToolbarButton
            icon={Italic}
            label="斜体 (Ctrl+I)"
            onClick={() => insertMarkdown('*', '*', '斜体文本')}
          />
          <div className="mx-1 h-6 w-px bg-cyber-border" />
          <ToolbarButton
            icon={Heading1}
            label="一级标题"
            onClick={() => insertMarkdown('# ', '', '标题 1')}
          />
          <ToolbarButton
            icon={Heading2}
            label="二级标题"
            onClick={() => insertMarkdown('## ', '', '标题 2')}
          />
          <div className="mx-1 h-6 w-px bg-cyber-border" />
          <ToolbarButton
            icon={List}
            label="无序列表"
            onClick={() => insertMarkdown('- ', '', '列表项')}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="有序列表"
            onClick={() => insertMarkdown('1. ', '', '列表项')}
          />
          <div className="mx-1 h-6 w-px bg-cyber-border" />
          <ToolbarButton
            icon={Code}
            label="代码块"
            onClick={() => insertMarkdown('```\n', '\n```', '代码')}
          />
          <ToolbarButton
            icon={Quote}
            label="引用"
            onClick={() => insertMarkdown('> ', '', '引用内容')}
          />
          <ToolbarButton
            icon={Link}
            label="链接 (Ctrl+K)"
            onClick={() => insertMarkdown('[', '](url)', '链接文本')}
          />
          <ToolbarButton
            icon={Image}
            label="图片"
            onClick={() => insertMarkdown('![alt](', ')', '图片描述')}
          />
          <div className="flex-1" />
          <ToolbarButton
            icon={showPreview ? Eye : EyeOff}
            label={showPreview ? '隐藏预览' : '显示预览'}
            onClick={() => setShowPreview(!showPreview)}
          />
        </div>
      )}

      {/* 编辑器和预览 */}
      <div className={cn('flex', showPreview && 'flex-col md:flex-row')}>
        {/* 编辑区域 */}
        <div
          className={cn(
            'flex-1',
            showPreview && 'md:w-1/2 md:border-r border-cyber-border'
          )}
        >
          <textarea
            ref={textareaRef}
            data-markdown-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            className={cn(
              'w-full resize-none bg-transparent p-4 font-mono text-sm',
              'focus:outline-none',
              'min-h-[300px] md:min-h-full'
            )}
            style={{
              minHeight: !showPreview ? minHeight : undefined,
              maxHeight: !showPreview ? maxHeight : undefined,
            }}
          />
        </div>

        {/* 预览区域 */}
        {showPreview && (
          <div className="md:w-1/2">
            <div
              className={cn(
                'prose prose-sm dark:prose-invert max-w-none',
                'overflow-auto p-4',
                'min-h-[300px] md:min-h-full'
              )}
              style={{
                maxHeight: maxHeight,
              }}
            >
              {value ? (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {value}
                </ReactMarkdown>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>预览区域</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
