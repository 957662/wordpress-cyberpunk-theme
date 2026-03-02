/**
 * 实时协作编辑器组件
 * 支持多人同时编辑、冲突解决、光标共享
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import {
  Users,
  UserPlus,
  Save,
  Cloud,
  CloudOff,
  Edit,
  Eye,
  Shield
} from 'lucide-react';

export interface UserCursor {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
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

export interface RealTimeEditorProps {
  content: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  currentUser?: {
    id: string;
    name: string;
    color: string;
  };
  connectedUsers?: Array<{
    id: string;
    name: string;
    color: string;
    isOnline: boolean;
  }>;
  cursors?: UserCursor[];
  comments?: Comment[];
  onAddComment?: (content: string, position: { line: number; column: number }) => void;
  onResolveComment?: (commentId: string) => void;
  readOnly?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  showLineNumbers?: boolean;
  className?: string;
}

export function RealTimeEditor({
  content,
  onChange,
  onSave,
  currentUser,
  connectedUsers = [],
  cursors = [],
  comments = [],
  onAddComment,
  onResolveComment,
  readOnly = false,
  autoSave = true,
  autoSaveInterval = 30000,
  showLineNumbers = true,
  className
}: RealTimeEditorProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [isConnected, setIsConnected] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [activeLine, setActiveLine] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout>();

  // 更新内容
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  // 保存内容
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(editorContent);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 自动保存
  useEffect(() => {
    if (autoSave && autoSaveInterval > 0) {
      autoSaveTimer.current = setInterval(() => {
        handleSave();
      }, autoSaveInterval);

      return () => {
        if (autoSaveTimer.current) {
          clearInterval(autoSaveTimer.current);
        }
      };
    }
  }, [editorContent, autoSave, autoSaveInterval]);

  // 同步外部内容
  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  // 计算行号
  const lines = editorContent.split('\n');

  // 处理光标位置
  const handleCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd } = textarea;
      const textBefore = textarea.value.substring(0, selectionStart);
      const lines = textBefore.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setActiveLine(line);
    }
  };

  // 获取在线用户数量
  const onlineUsersCount = connectedUsers.filter(u => u.isOnline).length;

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-3 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          {/* 连接状态 */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Cloud className="w-4 h-4 text-green-500" />
            ) : (
              <CloudOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-cyber-muted">
              {isConnected ? '已连接' : '离线'}
            </span>
          </div>

          {/* 在线用户 */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUsers(!showUsers)}
              className="flex items-center gap-1 px-2 py-1 bg-cyber-card rounded hover:bg-cyber-cyan/10 transition-colors"
            >
              <Users className="w-4 h-4 text-cyber-cyan" />
              <span className="text-xs font-medium">{onlineUsersCount}</span>
            </motion.button>

            {/* 用户头像 */}
            <div className="flex -space-x-2">
              {connectedUsers.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className={cn(
                    'w-6 h-6 border-2 border-cyber-card',
                    !user.isOnline && 'opacity-50'
                  )}
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              ))}
              {connectedUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-cyber-muted border-2 border-cyber-card flex items-center justify-center text-xs">
                  +{connectedUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 只读模式指示 */}
          {readOnly && (
            <div className="flex items-center gap-1 px-2 py-1 bg-cyber-purple/20 rounded">
              <Eye className="w-3 h-3 text-cyber-purple" />
              <span className="text-xs text-cyber-purple">只读</span>
            </div>
          )}

          {/* 保存按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || readOnly}
            leftIcon={isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      {/* 用户列表 */}
      <AnimatePresence>
        {showUsers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-cyber-border bg-cyber-card/50"
          >
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyber-muted">协作者</span>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<UserPlus className="w-3 h-3" />}
                >
                  邀请
                </Button>
              </div>
              <div className="space-y-1">
                {connectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-cyber-cyan/5"
                  >
                    <Avatar
                      className="w-6 h-6"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{user.name}</span>
                        {user.isOnline ? (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                        )}
                      </div>
                    </div>
                    {currentUser?.id === user.id && (
                      <span className="text-xs text-cyber-muted">你</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 编辑器 */}
      <div className="relative flex">
        {/* 行号 */}
        {showLineNumbers && (
          <div className="flex-shrink-0 w-12 py-3 bg-cyber-dark border-r border-cyber-border text-right pr-2 select-none">
            {lines.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'text-xs leading-6',
                  activeLine === index + 1
                    ? 'text-cyber-cyan font-bold'
                    : 'text-cyber-muted'
                )}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}

        {/* 文本区域 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={editorContent}
            onChange={handleContentChange}
            onClick={handleCursorPosition}
            onKeyUp={handleCursorPosition}
            readOnly={readOnly}
            className={cn(
              'w-full h-full min-h-[400px] p-3 bg-transparent resize-none outline-none font-mono text-sm leading-6',
              readOnly && 'cursor-default'
            )}
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
            }}
            placeholder="开始输入..."
          />

          {/* 其他用户的光标 */}
          {cursors.map((cursor) => (
            <div
              key={cursor.id}
              className="absolute pointer-events-none"
              style={{
                left: `${cursor.position.column * 8 + 50}px`,
                top: `${cursor.position.line * 24 - 8}px`,
                color: cursor.userColor
              }}
            >
              <div className="relative">
                <div className="w-0.5 h-5 bg-current" />
                <div
                  className="absolute left-0 -top-5 px-1.5 py-0.5 text-xs text-white rounded whitespace-nowrap"
                  style={{ backgroundColor: cursor.userColor }}
                >
                  {cursor.userName}
                </div>
              </div>
            </div>
          ))}

          {/* 评论标记 */}
          {comments
            .filter(c => !c.resolved)
            .map((comment) => (
              <div
                key={comment.id}
                className="absolute w-4 h-4 rounded-full cursor-pointer"
                style={{
                  left: '40px',
                  top: `${comment.position.line * 24 - 2}px`,
                  backgroundColor: '#f59e0b'
                }}
                title={comment.content}
              />
            ))}
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between px-3 py-2 bg-cyber-dark/50 border-t border-cyber-border text-xs text-cyber-muted">
        <div className="flex items-center gap-4">
          <span>行 {activeLine}</span>
          <span>字符 {editorContent.length}</span>
          <span>单词 {editorContent.split(/\s+/).filter(w => w).length}</span>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <span>
              上次保存: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {autoSave && (
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              自动保存
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
