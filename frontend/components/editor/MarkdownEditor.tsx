'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Code,
  Link,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Type,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
  showPreview?: boolean;
  onSave?: (value: string) => void;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  placeholder = '开始写作...',
  height = '500px',
  readOnly = false,
  showPreview: initialShowPreview = true,
  onSave,
  className,
}) => {
  const [content, setContent] = useState(value);
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setContent(newValue);
    onChange?.(newValue);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    handleChange(newText);

    // Set cursor position
    setTimeout(() => {
      const newPosition = start + before.length;
      textarea.setSelectionRange(newPosition + selectedText.length, newPosition + selectedText.length);
      textarea.focus();
    }, 0);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      handleChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      handleChange(history[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave?.(content);
    }

    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ');
    }
  };

  const toolbarButtons = [
    [
      { icon: Heading1, tooltip: '标题 1', action: () => insertText('# ', '') },
      { icon: Heading2, tooltip: '标题 2', action: () => insertText('## ', '') },
      { icon: Heading3, tooltip: '标题 3', action: () => insertText('### ', '') },
    ],
    [
      { icon: Bold, tooltip: '粗体 (Ctrl+B)', action: () => insertText('**', '**', '粗体文本') },
      { icon: Italic, tooltip: '斜体 (Ctrl+I)', action: () => insertText('*', '*', '斜体文本') },
      { icon: Type, tooltip: '行内代码', action: () => insertText('`', '`', '代码') },
    ],
    [
      { icon: Link, tooltip: '链接', action: () => insertText('[', '](url)', '链接文本') },
      { icon: ImageIcon, tooltip: '图片', action: () => insertText('![alt](', ')', '图片描述') },
      { icon: Code, tooltip: '代码块', action: () => insertText('```\n', '\n```', '代码') },
    ],
    [
      { icon: List, tooltip: '无序列表', action: () => insertText('- ', '') },
      { icon: ListOrdered, tooltip: '有序列表', action: () => insertText('1. ', '') },
      { icon: Quote, tooltip: '引用', action: () => insertText('> ', '') },
    ],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border border-cyber-purple/30 bg-cyber-dark/95 shadow-[0_0_30px_rgba(157,0,255,0.2)]',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-cyber-purple/20 bg-cyber-muted/5 p-3">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((group, groupIndex) => (
            <div key={groupIndex} className="flex gap-1 pr-2">
              {group.map((button, buttonIndex) => (
                <ToolbarButton
                  key={buttonIndex}
                  icon={button.icon}
                  tooltip={button.tooltip}
                  onClick={button.action}
                  disabled={readOnly}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ToolbarButton
            icon={Undo}
            tooltip="撤销 (Ctrl+Z)"
            onClick={handleUndo}
            disabled={readOnly || historyIndex === 0}
          />
          <ToolbarButton
            icon={Redo}
            tooltip="重做 (Ctrl+Y)"
            onClick={handleRedo}
            disabled={readOnly || historyIndex === history.length - 1}
          />
          <div className="h-6 w-px bg-cyber-purple/30" />
          <ToolbarButton
            icon={showPreview ? Eye : EyeOff}
            tooltip={showPreview ? '隐藏预览' : '显示预览'}
            onClick={() => setShowPreview(!showPreview)}
          />
          <ToolbarButton
            icon={isFullscreen ? Minimize2 : Maximize2}
            tooltip={isFullscreen ? '退出全屏' : '全屏'}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
          {onSave && (
            <>
              <div className="h-6 w-px bg-cyber-purple/30" />
              <ToolbarButton
                icon={Save}
                tooltip="保存 (Ctrl+S)"
                onClick={() => onSave(content)}
                variant="primary"
              />
            </>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex" style={{ height: isFullscreen ? 'calc(100% - 60px)' : height }}>
        {/* Text Editor */}
        <div className={cn('flex-1 border-r border-cyber-purple/20', !showPreview && 'w-full')}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-cyber-cyan outline-none placeholder:text-cyber-muted/30"
            style={{
              lineHeight: '1.6',
            }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-cyber-muted/5 p-4">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface ToolbarButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  disabled = false,
  variant = 'default',
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg p-2 transition-all',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        variant === 'default'
          ? 'text-cyber-muted hover:bg-cyber-purple/10 hover:text-cyber-cyan'
          : 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white hover:shadow-[0_0_15px_rgba(157,0,255,0.5)]'
      )}
      title={tooltip}
    >
      <Icon size={16} />
    </motion.button>
  );
};

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-cyber max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={cn(
                  'rounded bg-cyber-purple/10 px-1.5 py-0.5 text-sm text-cyber-pink',
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-cyber-cyan mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-cyber-purple mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-cyber-pink mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-cyber-muted/80 mb-4 leading-relaxed">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-cyber-cyan hover:text-cyber-purple underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyber-purple pl-4 italic text-cyber-muted/70">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-cyber-muted/80 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-cyber-muted/80 mb-4 space-y-2">
              {children}
            </ol>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg border border-cyber-purple/20 my-4"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownEditor;
