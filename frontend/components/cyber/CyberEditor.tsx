/**
 * CyberEditor - 赛博朋克风格的富文本编辑器
 * 支持Markdown、实时预览、代码高亮、拖拽上传等功能
 *
 * @version 1.0.0
 * @author CyberPress Team
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Code,
  Link,
  Image as ImageIcon,
  Save,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
  Type,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// =====================================================
// 类型定义
// =====================================================

export interface EditorTool {
  name: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  isActive?: boolean;
}

export interface MediaUpload {
  file: File;
  preview: string;
  id: string;
}

export interface CyberEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => Promise<void>;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  showPreview?: boolean;
  allowUpload?: boolean;
  uploadHandler?: (file: File) => Promise<string>;
  autoFocus?: boolean;
  readOnly?: boolean;
  className?: string;
  tools?: EditorTool[];
}

// =====================================================
// 主组件
// =====================================================

export const CyberEditor: React.FC<CyberEditorProps> = ({
  value = '',
  onChange,
  onSave,
  placeholder = '开始写作...',
  minHeight = '400px',
  maxHeight = '600px',
  showPreview: initialShowPreview = true,
  allowUpload = true,
  uploadHandler,
  autoFocus = false,
  readOnly = false,
  className,
  tools: customTools,
}) => {
  // 状态管理
  const [content, setContent] = useState(value);
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<MediaUpload[]>([]);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // 同步外部 value
  useEffect(() => {
    setContent(value);
  }, [value]);

  // =====================================================
  // 工具栏配置
  // =====================================================

  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    setContent(newText);
    onChange?.(newText);

    // 恢复焦点
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);

    // 添加到历史记录
    addToHistory(newText);
  }, [content, onChange]);

  const defaultTools: EditorTool[] = [
    {
      name: '粗体',
      icon: Bold,
      action: () => insertText('**', '**', '粗体文本'),
      shortcut: 'Ctrl+B',
    },
    {
      name: '斜体',
      icon: Italic,
      action: () => insertText('*', '*', '斜体文本'),
      shortcut: 'Ctrl+I',
    },
    {
      name: '标题1',
      icon: Heading1,
      action: () => insertText('# ', '', '标题1'),
    },
    {
      name: '标题2',
      icon: Heading2,
      action: () => insertText('## ', '', '标题2'),
    },
    {
      name: '列表',
      icon: List,
      action: () => insertText('- ', '', '列表项'),
    },
    {
      name: '代码',
      icon: Code,
      action: () => insertText('```\n', '\n```', '代码'),
      shortcut: 'Ctrl+K',
    },
    {
      name: '链接',
      icon: Link,
      action: () => insertText('[', '](url)', '链接文本'),
      shortcut: 'Ctrl+L',
    },
  ];

  const tools = customTools || defaultTools;

  // =====================================================
  // 历史记录管理
  // =====================================================

  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      onChange?.(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      onChange?.(history[newIndex]);
    }
  };

  // =====================================================
  // 文件上传处理
  // =====================================================

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !allowUpload) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // 创建预览
      const preview = URL.createObjectURL(file);
      const upload: MediaUpload = {
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9),
      };

      setUploads(prev => [...prev, upload]);

      // 上传文件
      if (uploadHandler) {
        setIsUploading(true);
        try {
          const url = await uploadHandler(file);
          // 插入图片 Markdown
          const imageMarkdown = `![${file.name}](${url})\n`;
          const newContent = content + imageMarkdown;
          setContent(newContent);
          onChange?.(newContent);
        } catch (error) {
          console.error('Upload failed:', error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  // =====================================================
  // 拖拽上传
  // =====================================================

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }

    const files = e.dataTransfer.files;
    await handleFileSelect(files);
  };

  // =====================================================
  // 保存处理
  // =====================================================

  const handleSave = async () => {
    if (onSave) {
      await onSave(content);
    }
  };

  // =====================================================
  // 快捷键处理
  // =====================================================

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    // Ctrl+Z 撤销
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }

    // Ctrl+Shift+Z 或 Ctrl+Y 重做
    if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
      e.preventDefault();
      handleRedo();
    }

    // Tab 缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ', '');
    }
  };

  // =====================================================
  // 渲染
  // =====================================================

  return (
    <div
      className={cn(
        'cyber-editor',
        'bg-dark-bg border border-cyber-cyan/30 rounded-lg overflow-hidden',
        'transition-all duration-300',
        isFullscreen && 'fixed inset-4 z-50 rounded-xl',
        className
      )}
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-bg/50 border-b border-cyber-cyan/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyber-cyan" />
          <div className="h-6 w-px bg-cyber-cyan/30 mx-2" />
          {tools.map((tool) => (
            <motion.button
              key={tool.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={tool.action}
              disabled={readOnly}
              className={cn(
                'p-2 rounded-lg transition-all',
                'hover:bg-cyber-cyan/20 hover:text-cyber-cyan',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                tool.isActive && 'bg-cyber-cyan/20 text-cyber-cyan'
              )}
              title={`${tool.name}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            >
              <tool.icon className="w-4 h-4" />
            </motion.button>
          ))}

          {allowUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={readOnly || isUploading}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  'hover:bg-cyber-cyan/20 hover:text-cyber-cyan',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="插入图片"
              >
                <ImageIcon className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 撤销/重做 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUndo}
            disabled={historyIndex === 0 || readOnly}
            className={cn(
              'p-2 rounded-lg transition-all',
              'hover:bg-cyber-cyan/20 hover:text-cyber-cyan',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="撤销 (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1 || readOnly}
            className={cn(
              'p-2 rounded-lg transition-all',
              'hover:bg-cyber-cyan/20 hover:text-cyber-cyan',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="重做 (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </motion.button>

          <div className="h-6 w-px bg-cyber-cyan/30 mx-2" />

          {/* 预览切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              'p-2 rounded-lg transition-all',
              'hover:bg-cyber-cyan/20 hover:text-cyber-cyan',
              showPreview && 'bg-cyber-cyan/20 text-cyber-cyan'
            )}
            title={showPreview ? '隐藏预览' : '显示预览'}
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </motion.button>

          {/* 全屏切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={cn(
              'p-2 rounded-lg transition-all',
              'hover:bg-cyber-cyan/20 hover:text-cyber-cyan'
            )}
            title={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>

          {/* 保存按钮 */}
          {onSave && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={readOnly}
              className={cn(
                'px-4 py-2 rounded-lg transition-all',
                'bg-gradient-to-r from-cyber-cyan to-blue-500',
                'text-white font-semibold hover:shadow-neon',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title="保存 (Ctrl+S)"
            >
              <Save className="w-4 h-4 inline mr-2" />
              保存
            </motion.button>
          )}
        </div>
      </div>

      {/* 编辑区域 */}
      <div
        className={cn(
          'flex',
          showPreview ? 'divide-x divide-cyber-cyan/30' : ''
        )}
        style={{ minHeight, maxHeight }}
      >
        {/* 编辑器 */}
        <div className={cn('flex-1 overflow-auto', showPreview ? 'w-1/2' : 'w-full')}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={readOnly}
            className={cn(
              'w-full h-full p-4 bg-transparent text-white',
              'focus:outline-none resize-none font-mono text-sm',
              'placeholder:text-gray-600',
              'leading-relaxed'
            )}
            style={{ minHeight: maxHeight }}
          />
        </div>

        {/* 预览区域 */}
        {showPreview && (
          <div className="w-1/2 overflow-auto p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
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
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mb-3 mt-5 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-white mb-2 mt-4 first:mt-0">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-cyber-cyan hover:text-cyber-purple underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-cyber-cyan pl-4 italic text-gray-400 my-4">
                    {children}
                  </blockquote>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="rounded-lg my-4 max-w-full h-auto border border-cyber-cyan/30"
                  />
                ),
              }}
            >
              {content || '*开始写作，支持 Markdown 语法...*'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-bg/50 border-t border-cyber-cyan/30 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{content.length} 字符</span>
          <span>{content.split(/\s+/).filter(Boolean).length} 词</span>
          <span>{content.split('\n').length} 行</span>
        </div>
        <div className="flex items-center gap-2">
          {isUploading && (
            <span className="text-cyber-cyan flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
              上传中...
            </span>
          )}
          {readOnly && (
            <span className="text-gray-600 flex items-center gap-1">
              <Type className="w-3 h-3" />
              只读模式
            </span>
          )}
        </div>
      </div>

      {/* 拖拽上传提示 */}
      {allowUpload && (
        <div
          className={cn(
            'absolute inset-0 bg-cyber-cyan/10 border-2 border-dashed border-cyber-cyan/50 rounded-lg',
            'flex items-center justify-center pointer-events-none',
            'opacity-0 transition-opacity duration-300',
            'drag-over:opacity-100'
          )}
        >
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-cyber-cyan" />
            <p className="text-xl font-semibold text-cyber-cyan">拖拽文件到这里上传</p>
            <p className="text-sm text-gray-400 mt-2">支持图片、PDF、Word 文档</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberEditor;
