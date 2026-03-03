'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Code,
  List,
  Link,
  Image,
  Smile,
  AtSign,
  Clock,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursor?: {
    x: number;
    y: number;
  };
  selection?: {
    start: number;
    end: number;
  };
}

interface Version {
  id: string;
  timestamp: Date;
  author: string;
  changes: string;
}

interface CollaborativeEditorProps {
  className?: string;
  initialContent?: string;
  onSave?: (content: string) => Promise<void>;
  collaborators?: Collaborator[];
  currentUser?: Collaborator;
  autoSave?: boolean;
  autoSaveInterval?: number;
  readOnly?: boolean;
  placeholder?: string;
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: 'Bold', action: 'bold' },
  { icon: Italic, label: 'Italic', action: 'italic' },
  { icon: Code, label: 'Code', action: 'code' },
  { icon: List, label: 'List', action: 'list' },
  { icon: Link, label: 'Link', action: 'link' },
  { icon: Image, label: 'Image', action: 'image' },
];

export function CollaborativeEditor({
  className,
  initialContent = '',
  onSave,
  collaborators = [],
  currentUser = { id: 'local', name: 'You', color: '#00f0ff' },
  autoSave = true,
  autoSaveInterval = 30000,
  readOnly = false,
  placeholder = '开始输入...'
}: CollaborativeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showCursors, setShowCursors] = useState(true);
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 自动保存
  useEffect(() => {
    if (!autoSave || !isDirty || readOnly) return;

    const timer = setTimeout(async () => {
      await handleSave();
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [content, autoSave, autoSaveInterval, isDirty, readOnly]);

  // 处理内容变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsDirty(true);

    // 添加到历史记录
    if (newContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  // 保存内容
  const handleSave = async () => {
    if (!isDirty || readOnly) return;

    setIsSaving(true);
    try {
      await onSave?.(content);
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 撤销
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      setIsDirty(true);
    }
  };

  // 重做
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      setIsDirty(true);
    }
  };

  // 工具栏操作
  const handleToolbarAction = (action: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    let cursorOffset = 0;

    switch (action) {
      case 'bold':
        newText = `**${selectedText || '粗体文本'}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'italic':
        newText = `_${selectedText || '斜体文本'}_`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'code':
        newText = `\`${selectedText || '代码'}\``;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'list':
        newText = `- ${selectedText || '列表项'}`;
        break;
      case 'link':
        newText = `[${selectedText || '链接文本'}](url)`;
        cursorOffset = selectedText ? -1 : -5;
        break;
      case 'image':
        newText = `![${selectedText || '图片描述'}](url)`;
        cursorOffset = selectedText ? -1 : -5;
        break;
      default:
        return;
    }

    const newContent =
      content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    setIsDirty(true);

    // 恢复光标位置
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newText.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // 快捷键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + S 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    // Ctrl/Cmd + Z 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }

    // Ctrl/Cmd + Shift + Z 重做
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      handleRedo();
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn(
      'flex flex-col bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden',
      'shadow-[0_0_40px_rgba(0,240,255,0.1)]',
      className
    )}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-purple-950/20">
        {/* 格式化工具 */}
        <div className="flex items-center gap-1">
          {TOOLBAR_BUTTONS.map((button) => (
            <motion.button
              key={button.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolbarAction(button.action)}
              disabled={readOnly}
              className={cn(
                'p-2 rounded-lg transition-all duration-300',
                'hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>

        {/* 协作者 & 状态 */}
        <div className="flex items-center gap-4">
          {/* 协作者 */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="flex -space-x-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="relative group"
                >
                  {collaborator.avatar ? (
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      className="w-7 h-7 rounded-full border-2 border-black"
                      style={{ borderColor: collaborator.color }}
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {collaborator.name[0]}
                    </div>
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {collaborator.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 撤销/重做 */}
          <div className="flex items-center gap-1 border-l border-cyan-500/20 pl-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUndo}
              disabled={historyIndex === 0 || readOnly}
              className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="撤销"
            >
              <Undo className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1 || readOnly}
              className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="重做"
            >
              <Redo className="w-4 h-4" />
            </motion.button>
          </div>

          {/* 保存状态 */}
          <div className="flex items-center gap-2 border-l border-cyan-500/20 pl-4">
            {isSaving ? (
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Save className="w-4 h-4" />
                </motion.div>
                <span>保存中...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatTime(lastSaved)} 保存</span>
                {isDirty && (
                  <span className="text-cyan-400">• 未保存</span>
                )}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={readOnly || !isDirty}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>保存</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            'w-full h-full min-h-[500px] p-6 bg-transparent',
            'focus:outline-none resize-none',
            'text-gray-300 placeholder:text-gray-600',
            'font-mono text-sm leading-relaxed'
          )}
        />

        {/* 只读模式覆盖 */}
        {readOnly && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            <span>只读模式</span>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-cyan-500/20 bg-gray-900/30">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{content.length} 字符</span>
          <span>•</span>
          <span>{content.split(/\s+/).filter((w) => w).length} 词</span>
          <span>•</span>
          <span>{content.split('\n').length} 行</span>
        </div>

        <div className="flex items-center gap-2">
          {collaborators.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span>{collaborators.length} 人在线</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
