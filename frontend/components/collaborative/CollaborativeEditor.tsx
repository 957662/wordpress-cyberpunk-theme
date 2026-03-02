'use client';

/**
 * Collaborative Editor Component
 * 实时协作编辑器组件，支持多人同时编辑、光标同步
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Save, Share, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface UserCursor {
  userId: string;
  userName: string;
  color: string;
  position: { line: number; column: number };
  selection?: { start: { line: number; column: number }; end: { line: number; column: number } };
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  position: { line: number; column: number };
  resolved: boolean;
}

interface CollaborativeEditorProps {
  /**
   * 文档内容
   */
  content: string;
  /**
   * 内容变更回调
   */
  onChange: (content: string) => void;
  /**
   * 保存回调
   */
  onSave?: () => void;
  /**
   * 当前用户
   */
  currentUser: {
    id: string;
    name: string;
    color: string;
  };
  /**
   * 在线用户
   */
  onlineUsers?: Array<{ id: string; name: string; color: string }>;
  /**
   * 其他用户的光标
   */
  remoteCursors?: UserCursor[];
  /**
   * 评论
   */
  comments?: Comment[];
  /**
   * 添加评论回调
   */
  onAddComment?: (content: string, position: { line: number; column: number }) => void;
  /**
   * 解决评论回调
   */
  onResolveComment?: (commentId: string) => void;
  /**
   * 语言模式
   */
  language?: string;
  /**
   * 只读模式
   */
  readOnly?: boolean;
  /**
   * 是否显示行号
   */
  showLineNumbers?: boolean;
  /**
   * 自定义样式
   */
  className?: string;
}

// 颜色生成器
const generateColor = (userId: string): string => {
  const colors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00', '#00ff88'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  content,
  onChange,
  onSave,
  currentUser,
  onlineUsers = [],
  remoteCursors = [],
  comments = [],
  onAddComment,
  onResolveComment,
  language = 'text',
  readOnly = false,
  showLineNumbers = true,
  className,
}) => {
  const [localContent, setLocalContent] = useState(content);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showUsers, setShowUsers] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showComments, setShowComments] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorsLayerRef = useRef<HTMLDivElement>(null);

  // 同步内容
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // 处理内容变更
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onChange(newContent);
    updateCursorPosition();
  };

  // 更新光标位置
  const updateCursorPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.value.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    setCursorPosition({ line, column });
  }, []);

  // 处理选择变更
  const handleSelectionChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      setSelectedText(textarea.value.substring(start, end));
    } else {
      setSelectedText('');
    }
  }, []);

  // 处理键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    // Ctrl/Cmd + / 添加评论
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      if (selectedText && onAddComment) {
        onAddComment(selectedText, cursorPosition);
        setSelectedText('');
      }
    }
  };

  // 保存文档
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave?.();
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  // 渲染远程光标
  const renderRemoteCursors = () => {
    if (!textareaRef.current || !cursorsLayerRef.current) return null;

    const textarea = textareaRef.current;
    const layer = cursorsLayerRef.current;

    // 计算文本区域的样式
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);

    return remoteCursors.map((cursor) => {
      // 计算光标位置（简化版）
      const top = paddingTop + (cursor.position.line - 1) * lineHeight;
      const left = paddingLeft + cursor.position.column * 8; // 假设字符宽度

      return (
        <motion.div
          key={cursor.userId}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none"
          style={{
            top,
            left,
            color: cursor.color,
          }}
        >
          {/* 光标线 */}
          <div className="w-0.5 h-5 bg-current" />

          {/* 用户名标签 */}
          <div
            className="px-2 py-0.5 text-xs text-white rounded whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </motion.div>
      );
    });
  };

  // 渲染评论
  const renderComments = () => {
    if (!textareaRef.current) return null;

    return comments
      .filter(c => !c.resolved || showComments)
      .map((comment) => {
        const computedStyle = window.getComputedStyle(textareaRef.current!);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const top = (comment.position.line - 1) * lineHeight;

        return (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-0 w-64 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-3"
            style={{ top }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: generateColor(comment.userId) }}
                >
                  {comment.userName[0].toUpperCase()}
                </div>
                <span className="text-sm text-white">{comment.userName}</span>
              </div>
              {!comment.resolved && onResolveComment && (
                <button
                  onClick={() => onResolveComment(comment.id)}
                  className="text-xs text-cyan-500 hover:text-cyan-400"
                >
                  解决
                </button>
              )}
            </div>
            <p className="text-sm text-gray-300">{comment.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.timestamp).toLocaleString()}
            </p>
          </motion.div>
        );
      });
  };

  return (
    <div className={cn('relative bg-black/50 rounded-2xl border border-cyan-500/30 overflow-hidden', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/20 bg-black/50">
        <div className="flex items-center gap-3">
          {/* 在线用户 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{onlineUsers.length}</span>
            </button>

            <AnimatePresence>
              {showUsers && onlineUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center -space-x-2"
                >
                  {onlineUsers.map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.name[0].toUpperCase()}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 光标位置 */}
          <div className="px-3 py-1.5 bg-white/5 rounded-lg">
            <span className="text-xs text-gray-500">
              行 {cursorPosition.line}, 列 {cursorPosition.column}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 评论切换 */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showComments ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-400'
            )}
            title="显示/隐藏评论"
          >
            {showComments ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* 分享按钮 */}
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <Share className="w-4 h-4 text-gray-400" />
          </button>

          {/* 保存按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving || readOnly}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all',
              isSaving
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90'
            )}
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">{isSaving ? '已保存' : '保存'}</span>
          </motion.button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div
        ref={containerRef}
        className="relative flex"
        onClick={() => textareaRef.current?.focus()}
      >
        {/* 行号 */}
        {showLineNumbers && (
          <div className="py-4 px-3 bg-black/30 text-right select-none border-r border-cyan-500/20">
            {localContent.split('\n').map((_, i) => (
              <div
                key={i}
                className="text-xs text-gray-600 leading-6"
                style={{ minHeight: '24px' }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* 文本区域 */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={localContent}
            onChange={handleChange}
            onSelect={handleSelectionChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="w-full h-96 p-4 bg-transparent text-white resize-none focus:outline-none font-mono text-sm leading-6"
            style={{ caretColor: currentUser.color }}
            spellCheck={false}
          />

          {/* 光标层 */}
          <div
            ref={cursorsLayerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {renderRemoteCursors()}
            {renderComments()}
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-t border-cyan-500/20">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{language}</span>
          {selectedText && (
            <span className="text-xs text-cyan-500">
              已选择 {selectedText.length} 个字符 (Ctrl+/ 添加评论)
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">
            {localContent.split('\n').length} 行
          </span>
          <span className="text-xs text-gray-500">
            {localContent.length} 字符
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
