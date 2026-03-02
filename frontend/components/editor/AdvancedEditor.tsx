/**
 * 高级富文本编辑器
 * 支持 Markdown、代码高亮、图片上传、实时预览
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
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
  Download,
  Upload,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type EditorMode = 'wysiwyg' | 'markdown' | 'split';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface EditorToolbarAction {
  name: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  isActive?: boolean;
  disabled?: boolean;
}

export interface EditorContent {
  html: string;
  markdown: string;
  plainText: string;
}

export interface AdvancedEditorProps {
  initialValue?: string;
  mode?: EditorMode;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  showWordCount?: boolean;
  showCharCount?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onContentChange?: (content: EditorContent) => void;
  onSave?: (content: EditorContent) => void;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
  toolbarActions?: EditorToolbarAction[];
}

export function AdvancedEditor({
  initialValue = '',
  mode = 'wysiwyg',
  placeholder = 'Start writing...',
  minHeight = '400px',
  maxHeight = '800px',
  readOnly = false,
  showToolbar = true,
  showWordCount = true,
  showCharCount = true,
  autoSave = false,
  autoSaveDelay = 5000,
  onContentChange,
  onSave,
  onImageUpload,
  className,
  toolbarActions,
}: AdvancedEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [editorMode, setEditorMode] = useState<EditorMode>(mode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 计算字数和字符数
  useEffect(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(plainText.length);
  }, [content]);

  // 自动保存
  useEffect(() => {
    if (autoSave && content && !readOnly) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveDelay);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, autoSave, autoSaveDelay, readOnly]);

  // 执行编辑器命令
  const executeCommand = useCallback((command: string, value: string | undefined = undefined) => {
    if (readOnly) return;

    document.execCommand(command, false, value);
    handleContentChange();
  }, [readOnly]);

  // 处理内容变化
  const handleContentChange = useCallback(() => {
    const html = editorRef.current?.innerHTML || '';
    const plainText = editorRef.current?.innerText || '';
    const markdown = htmlToMarkdown(html);

    setContent(html);

    if (onContentChange) {
      onContentChange({ html, markdown, plainText });
    }
  }, [onContentChange]);

  // 处理 Markdown 变化
  const handleMarkdownChange = useCallback((value: string) => {
    setContent(value);

    if (onContentChange) {
      onContentChange({
        html: markdownToHtml(value),
        markdown: value,
        plainText: value.replace(/[#*`_\[\]]/g, ''),
      });
    }
  }, [onContentChange]);

  // 保存内容
  const handleSave = useCallback(async () => {
    if (readOnly || isSaving) return;

    setIsSaving(true);

    try {
      const html = editorMode === 'markdown'
        ? markdownToHtml(content)
        : content;
      const plainText = content.replace(/<[^>]*>/g, '');
      const markdown = htmlToMarkdown(html);

      const editorContent: EditorContent = { html, markdown, plainText };

      if (onSave) {
        await onSave(editorContent);
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setIsSaving(false);
    }
  }, [content, editorMode, readOnly, isSaving, onSave]);

  // 插入链接
  const insertLink = useCallback(() => {
    if (readOnly) return;

    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [readOnly, executeCommand]);

  // 插入图片
  const insertImage = useCallback(async () => {
    if (readOnly) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        let imageUrl: string;

        if (onImageUpload) {
          imageUrl = await onImageUpload(file);
        } else {
          // 默认使用本地预览
          imageUrl = URL.createObjectURL(file);
        }

        executeCommand('insertImage', imageUrl);
      } catch (error) {
        console.error('Failed to insert image:', error);
      }
    };

    input.click();
  }, [readOnly, onImageUpload, executeCommand]);

  // 默认工具栏操作
  const defaultToolbarActions: EditorToolbarAction[] = [
    { name: 'bold', icon: <Bold size={18} />, action: () => executeCommand('bold'), shortcut: 'Ctrl+B' },
    { name: 'italic', icon: <Italic size={18} />, action: () => executeCommand('italic'), shortcut: 'Ctrl+I' },
    { name: 'underline', icon: <Underline size={18} />, action: () => executeCommand('underline'), shortcut: 'Ctrl+U' },
    { name: 'code', icon: <Code size={18} />, action: () => executeCommand('insertHTML', '<code></code>'), shortcut: 'Ctrl+`' },
    { name: 'link', icon: <Link size={18} />, action: insertLink, shortcut: 'Ctrl+K' },
    { name: 'image', icon: <ImageIcon size={18} />, action: insertImage },
    { name: 'h1', icon: <Heading1 size={18} />, action: () => executeCommand('formatBlock', 'H1') },
    { name: 'h2', icon: <Heading2 size={18} />, action: () => executeCommand('formatBlock', 'H2') },
    { name: 'h3', icon: <Heading3 size={18} />, action: () => executeCommand('formatBlock', 'H3') },
    { name: 'ul', icon: <List size={18} />, action: () => executeCommand('insertUnorderedList') },
    { name: 'ol', icon: <ListOrdered size={18} />, action: () => executeCommand('insertOrderedList') },
    { name: 'quote', icon: <Quote size={18} />, action: () => executeCommand('formatBlock', 'BLOCKQUOTE') },
    { name: 'undo', icon: <Undo size={18} />, action: () => executeCommand('undo'), shortcut: 'Ctrl+Z' },
    { name: 'redo', icon: <Redo size={18} />, action: () => executeCommand('redo'), shortcut: 'Ctrl+Shift+Z' },
  ];

  const actions = toolbarActions || defaultToolbarActions;

  // 全屏切换
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // 模式切换
  const toggleMode = useCallback(() => {
    setEditorMode(prev => {
      if (prev === 'wysiwyg') return 'markdown';
      if (prev === 'markdown') return 'split';
      return 'wysiwyg';
    });
  }, []);

  return (
    <div
      className={cn(
        'cyber-editor relative bg-cyber-dark border border-cyber-cyan/30 rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50 rounded-xl',
        className
      )}
    >
      {/* 工具栏 */}
      {showToolbar && !readOnly && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-muted border-b border-cyber-cyan/30">
          <div className="flex items-center gap-1 flex-wrap">
            {actions.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                disabled={action.disabled || readOnly}
                className={cn(
                  'p-2 rounded-md transition-all duration-200',
                  'hover:bg-cyber-cyan/20 hover:text-cyber-cyan',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  action.isActive && 'bg-cyber-cyan/20 text-cyber-cyan'
                )}
                title={`${action.name}${action.shortcut ? ` (${action.shortcut})` : ''}`}
              >
                {action.icon}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* 预览切换 */}
            {editorMode !== 'split' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 rounded-md hover:bg-cyber-cyan/20 hover:text-cyber-cyan"
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            )}

            {/* 模式切换 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMode}
              className="px-3 py-1 text-sm rounded-md bg-cyber-cyan/20 text-cyber-cyan hover:bg-cyber-cyan/30"
              title="Switch Mode"
            >
              {editorMode.toUpperCase()}
            </motion.button>

            {/* 全屏切换 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="p-2 rounded-md hover:bg-cyber-cyan/20 hover:text-cyber-cyan"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </motion.button>

            {/* 保存按钮 */}
            {!autoSave && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1 text-sm rounded-md bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ⏳
                    </motion.span>
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* 编辑区域 */}
      <div
        className={cn('flex', editorMode === 'split' ? 'divide-x divide-cyber-cyan/30' : '')}
        style={{ minHeight, maxHeight }}
      >
        {/* WYSIWYG 编辑器 */}
        {editorMode === 'wysiwyg' || editorMode === 'split' ? (
          <div
            className={cn(
              'flex-1 overflow-auto',
              editorMode === 'split' ? 'w-1/2' : 'w-full'
            )}
          >
            <div
              ref={editorRef}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={handleContentChange}
              className={cn(
                'w-full h-full p-4 outline-none',
                'prose prose-invert prose-cyber max-w-none',
                'focus:outline-none'
              )}
              style={{ minHeight, maxHeight }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ) : null}

        {/* Markdown 编辑器 */}
        {editorMode === 'markdown' || editorMode === 'split' ? (
          <div
            className={cn(
              'flex-1 overflow-auto',
              editorMode === 'split' ? 'w-1/2' : 'w-full'
            )}
          >
            <textarea
              ref={textareaRef}
              value={typeof content === 'string' ? content : ''}
              onChange={(e) => handleMarkdownChange(e.target.value)}
              placeholder={placeholder}
              readOnly={readOnly}
              className={cn(
                'w-full h-full p-4 bg-transparent border-none outline-none resize-none',
                'font-mono text-sm leading-relaxed',
                'focus:outline-none',
                '[&:empty]:before:content-[attr(placeholder)] [&:empty]:before:text-gray-500'
              )}
              style={{ minHeight, maxHeight }}
            />
          </div>
        ) : null}

        {/* 预览面板 */}
        {showPreview && editorMode !== 'split' && (
          <div className="flex-1 overflow-auto p-4 border-l border-cyber-cyan/30 prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
          </div>
        )}
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-muted border-t border-cyber-cyan/30 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          {showWordCount && <span>{wordCount} words</span>}
          {showCharCount && <span>{charCount} characters</span>}
        </div>

        <div className="flex items-center gap-4">
          {autoSave && lastSaved && (
            <span className="flex items-center gap-1">
              <Check size={14} className="text-cyber-green" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}

          {editorMode === 'markdown' && (
            <span className="text-cyber-cyan">Markdown Mode</span>
          )}
        </div>
      </div>

      {/* 自动保存指示器 */}
      <AnimatePresence>
        {autoSave && isSaving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-4 px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg text-cyber-cyan text-sm"
          >
            Auto-saving...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 工具函数：HTML 转 Markdown
function htmlToMarkdown(html: string): string {
  let markdown = html;

  // 标题
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');

  // 粗体和斜体
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // 代码
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```');

  // 链接和图片
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');

  // 列表
  markdown = markdown.replace(/<ul[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ol>/gi, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // 引用
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n');

  // 段落和换行
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');

  // 清除剩余的 HTML 标签
  markdown = markdown.replace(/<[^>]*>/g, '');

  return markdown.trim();
}

// 工具函数：Markdown 转 HTML
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // 转义 HTML
  html = html.replace(/&/g, '&amp;');
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');

  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 标题
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // 链接和图片
  html = html.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[(.*?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

  // 引用
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // 列表
  html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');

  // 合并相邻列表
  html = html.replace(/<\/ul>\n<ul>/g, '\n');
  html = html.replace(/<\/ol>\n<ol>/g, '\n');

  // 段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  return html;
}

export default AdvancedEditor;
