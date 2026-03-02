/**
 * 富文本内容编辑器
 * 支持 Markdown 和实时预览
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image,
  Eye,
  EyeOff,
  Save,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface ContentEditorProps {
  initialValue?: string;
  placeholder?: string;
  onSave?: (content: string) => Promise<void>;
  onChange?: (content: string) => void;
  autoFocus?: boolean;
}

export function ContentEditor({
  initialValue = '',
  placeholder = '开始写作...',
  onSave,
  onChange,
  autoFocus = false,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setContent(initialValue);
    setHistory([initialValue]);
  }, [initialValue]);

  useEffect(() => {
    // 计算字数
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);

    // 触发 onChange
    onChange?.(content);
  }, [content, onChange]);

  const handleContentChange = (value: string) => {
    setContent(value);
    // 添加到历史记录
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(value);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(content);
    } finally {
      setIsSaving(false);
    }
  };

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    handleContentChange(newText);

    // 恢复焦点并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: '一级标题',
      action: () => insertText('# ', ''),
    },
    {
      icon: Heading2,
      label: '二级标题',
      action: () => insertText('## ', ''),
    },
    {
      icon: Heading3,
      label: '三级标题',
      action: () => insertText('### ', ''),
    },
    { divider: true },
    {
      icon: Bold,
      label: '粗体',
      action: () => insertText('**', '**', '粗体文本'),
    },
    {
      icon: Italic,
      label: '斜体',
      action: () => insertText('*', '*', '斜体文本'),
    },
    {
      icon: Underline,
      label: '下划线',
      action: () => insertText('<u>', '</u>', '下划线文本'),
    },
    { divider: true },
    {
      icon: List,
      label: '无序列表',
      action: () => insertText('- ', ''),
    },
    {
      icon: ListOrdered,
      label: '有序列表',
      action: () => insertText('1. ', ''),
    },
    {
      icon: Quote,
      label: '引用',
      action: () => insertText('> ', ''),
    },
    {
      icon: Code,
      label: '代码',
      action: () => insertText('`', '`', '代码'),
    },
    { divider: true },
    {
      icon: LinkIcon,
      label: '链接',
      action: () => insertText('[', '](url)', '链接文本'),
    },
    {
      icon: Image,
      label: '图片',
      action: () => insertText('![alt](', ')', '图片URL'),
    },
  ];

  // 简单的 Markdown 解析（用于预览）
  const parseMarkdown = (text: string) => {
    let html = text;

    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

    // 粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // 代码
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-cyber-cyan/10 px-1 rounded">$1</code>');

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-cyber-cyan hover:underline">$1</a>');

    // 图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg my-4" />');

    // 引用
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-cyber-cyan pl-4 italic my-4">$1</blockquote>');

    // 列表
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>');

    // 段落
    html = html.replace(/\n\n/g, '</p><p class="my-4">');
    html = `<p class="my-4">${html}</p>`;

    return html;
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <Card variant="glass" className="p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            if ('divider' in button) {
              return (
                <div key={`divider-${index}`} className="w-px h-6 bg-cyber-border mx-2" />
              );
            }

            const Icon = button.icon;
            return (
              <button
                key={button.label}
                onClick={button.action}
                className="p-2 rounded hover:bg-cyber-cyan/10 transition-colors group"
                title={button.label}
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-cyber-cyan" />
              </button>
            );
          })}

          <div className="flex-1" />

          {/* 撤销/重做 */}
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 rounded hover:bg-cyber-cyan/10 transition-colors disabled:opacity-50"
            title="撤销"
          >
            <Undo className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className="p-2 rounded hover:bg-cyber-cyan/10 transition-colors disabled:opacity-50"
            title="重做"
          >
            <Redo className="w-4 h-4 text-gray-400" />
          </button>

          <div className="w-px h-6 bg-cyber-border mx-2" />

          {/* 预览切换 */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded hover:bg-cyber-cyan/10 transition-colors"
            title={showPreview ? '隐藏预览' : '显示预览'}
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* 保存按钮 */}
          {onSave && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="ml-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? '保存中...' : '保存'}
            </Button>
          )}
        </div>
      </Card>

      {/* 编辑器和预览 */}
      <div className={`grid gap-4 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* 编辑器 */}
        <Card className="overflow-hidden">
          <textarea
            id="editor-textarea"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full h-96 p-4 bg-transparent border-none resize-none focus:outline-none font-mono text-sm"
          />
        </Card>

        {/* 预览 */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-auto"
          >
            <Card className="p-4 prose prose-invert max-w-none h-96 overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
            </Card>
          </motion.div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <Badge variant="outline">{wordCount} 字</Badge>
        <Badge variant="outline">{content.length} 字符</Badge>
        <Badge variant="outline">{content.split('\n').length} 行</Badge>
      </div>
    </div>
  );
}

export default ContentEditor;
