/**
 * 实时协作编辑器
 * 支持多人同时编辑、光标同步、操作历史
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Share2,
  Lock,
  Unlock,
  MessageSquare,
  History,
  Download,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWebSocket } from '@/lib/services/websocket';
import { AdvancedEditor } from '@/components/editor/AdvancedEditor';

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  isOnline: boolean;
  lastSeen: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  position: {
    line: number;
    column: number;
  };
  timestamp: Date;
  resolved: boolean;
}

export interface Operation {
  type: 'insert' | 'delete' | 'replace';
  position: { line: number; column: number };
  content?: string;
  length?: number;
  userId: string;
  timestamp: Date;
}

export interface RealtimeEditorProps {
  documentId: string;
  userId: string;
  userName: string;
  userColor?: string;
  wsUrl?: string;
  readOnly?: boolean;
  showCollaborators?: boolean;
  showComments?: boolean;
  showHistory?: boolean;
  enableVoiceChat?: boolean;
  onCollaboratorJoin?: (collaborator: Collaborator) => void;
  onCollaboratorLeave?: (collaboratorId: string) => void;
  onContentChange?: (content: string, operations: Operation[]) => void;
  className?: string;
}

export function RealtimeEditor({
  documentId,
  userId,
  userName,
  userColor = '#00f0ff',
  wsUrl = 'ws://localhost:3001',
  readOnly = false,
  showCollaborators = true,
  showComments = true,
  showHistory = true,
  enableVoiceChat = false,
  onCollaboratorJoin,
  onCollaboratorLeave,
  onContentChange,
  className,
}: RealtimeEditorProps) {
  // 协作者状态
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  // 内容状态
  const [content, setContent] = useState<string>('');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [undoStack, setUndoStack] = useState<Operation[][]>([]);
  const [redoStack, setRedoStack] = useState<Operation[][]>([]);

  // 评论状态
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ line: number; column: number } | null>(null);

  // UI 状态
  const [isConnected, setIsConnected] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [documentLocked, setDocumentLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);

  // WebSocket 连接
  const { state, send, on, ws } = useWebSocket({
    url: wsUrl,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    enableMessageQueue: true,
  });

  // 初始化 WebSocket 事件监听
  useEffect(() => {
    if (!ws) return;

    // 连接成功
    const unsubscribeConnected = on('connected', () => {
      setIsConnected(true);

      // 加入文档协作
      send('join_document', {
        documentId,
        user: {
          id: userId,
          name: userName,
          color: userColor,
        },
      });
    });

    // 断开连接
    const unsubscribeDisconnected = on('disconnected', () => {
      setIsConnected(false);
    });

    // 新协作者加入
    const unsubscribeUserJoined = on('user_joined', (data: { user: Collaborator }) => {
      setCollaborators(prev => [...prev, data.user]);
      setActiveUsers(prev => prev + 1);

      if (onCollaboratorJoin) {
        onCollaboratorJoin(data.user);
      }
    });

    // 协作者离开
    const unsubscribeUserLeft = on('user_left', (data: { userId: string }) => {
      setCollaborators(prev => prev.filter(c => c.id !== data.userId));
      setActiveUsers(prev => prev - 1);

      if (onCollaboratorLeave) {
        onCollaboratorLeave(data.userId);
      }
    });

    // 接收内容更新
    const unsubscribeContentUpdate = on('content_update', (data: { operation: Operation }) => {
      applyOperation(data.operation);
    });

    // 接收光标位置
    const unsubscribeCursorUpdate = on('cursor_update', (data: { userId: string; cursor: Collaborator['cursor'] }) => {
      setCollaborators(prev =>
        prev.map(c =>
          c.id === data.userId ? { ...c, cursor: data.cursor } : c
        )
      );
    });

    // 接收选择范围
    const unsubscribeSelectionUpdate = on('selection_update', (data: { userId: string; selection: Collaborator['selection'] }) => {
      setCollaborators(prev =>
        prev.map(c =>
          c.id === data.userId ? { ...c, selection: data.selection } : c
        )
      );
    });

    // 文档锁定状态
    const unsubscribeDocumentLocked = on('document_locked', (data: { locked: boolean; lockedBy?: string }) => {
      setDocumentLocked(data.locked);
      setLockedBy(data.lockedBy || null);
    });

    // 接收评论
    const unsubscribeNewComment = on('new_comment', (data: { comment: Comment }) => {
      setComments(prev => [...prev, data.comment]);
    });

    // 评论已解决
    const unsubscribeCommentResolved = on('comment_resolved', (data: { commentId: string }) => {
      setComments(prev =>
        prev.map(c =>
          c.id === data.commentId ? { ...c, resolved: true } : c
        )
      );
    });

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribeContentUpdate();
      unsubscribeCursorUpdate();
      unsubscribeSelectionUpdate();
      unsubscribeDocumentLocked();
      unsubscribeNewComment();
      unsubscribeCommentResolved();
    };
  }, [ws, on, send, documentId, userId, userName, userColor, onCollaboratorJoin, onCollaboratorLeave]);

  // 应用操作
  const applyOperation = useCallback((operation: Operation) => {
    setOperations(prev => [...prev, operation]);

    // 根据操作类型更新内容
    let newContent = content;

    switch (operation.type) {
      case 'insert':
        // 在指定位置插入内容
        const lines = newContent.split('\n');
        if (operation.position.line < lines.length) {
          const line = lines[operation.position.line];
          lines[operation.position.line] =
            line.slice(0, operation.position.column) +
            (operation.content || '') +
            line.slice(operation.position.column);
          newContent = lines.join('\n');
        }
        break;

      case 'delete':
        // 删除指定位置的内容
        const deleteLines = newContent.split('\n');
        if (operation.position.line < deleteLines.length) {
          const deleteLine = deleteLines[operation.position.line];
          deleteLines[operation.position.line] =
            deleteLine.slice(0, operation.position.column) +
            deleteLine.slice(operation.position.column + (operation.length || 0));
          newContent = deleteLines.join('\n');
        }
        break;

      case 'replace':
        // 替换指定位置的内容
        const replaceLines = newContent.split('\n');
        if (operation.position.line < replaceLines.length) {
          const replaceLine = replaceLines[operation.position.line];
          replaceLines[operation.position.line] =
            replaceLine.slice(0, operation.position.column) +
            (operation.content || '') +
            replaceLine.slice(operation.position.column + (operation.length || 0));
          newContent = replaceLines.join('\n');
        }
        break;
    }

    setContent(newContent);

    if (onContentChange) {
      onContentChange(newContent, [...operations, operation]);
    }
  }, [content, operations, onContentChange]);

  // 发送操作
  const sendOperation = useCallback((operation: Operation) => {
    applyOperation(operation);
    send('content_update', { documentId, operation });
  }, [applyOperation, send, documentId]);

  // 处理内容变化
  const handleContentChange = useCallback((newContent: string) => {
    // 计算差异并发送操作
    // 这里简化处理，实际应该使用更复杂的差异算法
    const operation: Operation = {
      type: 'replace',
      position: { line: 0, column: 0 },
      content: newContent,
      length: content.length,
      userId,
      timestamp: new Date(),
    };

    sendOperation(operation);
  }, [content, userId, sendOperation]);

  // 发送光标位置
  const sendCursorPosition = useCallback((cursor: Collaborator['cursor']) => {
    send('cursor_update', { documentId, userId, cursor });
  }, [send, documentId, userId]);

  // 添加评论
  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !selectedPosition) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId,
      userName,
      content: newComment,
      position: selectedPosition,
      timestamp: new Date(),
      resolved: false,
    };

    setComments(prev => [...prev, comment]);
    send('new_comment', { documentId, comment });

    setNewComment('');
    setSelectedPosition(null);
  }, [newComment, selectedPosition, userId, userName, send, documentId]);

  // 解决评论
  const handleResolveComment = useCallback((commentId: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId ? { ...c, resolved: true } : c
      )
    );
    send('comment_resolved', { documentId, commentId });
  }, [send, documentId]);

  // 撤销操作
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const lastOperations = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastOperations]);

    // 反向应用操作
    lastOperations.reverse().forEach(op => {
      const reverseOp: Operation = {
        ...op,
        type: op.type === 'insert' ? 'delete' : 'insert',
      };
      applyOperation(reverseOp);
    });
  }, [undoStack, applyOperation]);

  // 重做操作
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    const lastOperations = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastOperations]);

    lastOperations.forEach(op => {
      applyOperation(op);
    });
  }, [redoStack, applyOperation]);

  return (
    <div className={cn('relative flex h-full', className)}>
      {/* 主编辑区域 */}
      <div className="flex-1 overflow-hidden">
        <AdvancedEditor
          initialValue={content}
          onContentChange={handleContentChange}
          readOnly={readOnly || documentLocked}
          className="h-full"
        />

        {/* 协作者光标 */}
        <svg className="absolute inset-0 pointer-events-none">
          {collaborators.map(collaborator => (
            collaborator.cursor && (
              <g key={collaborator.id}>
                {/* 光标线 */}
                <line
                  x1="0"
                  y1={collaborator.cursor.line * 20}
                  x2="100%"
                  y2={collaborator.cursor.line * 20}
                  stroke={collaborator.color}
                  strokeWidth="2"
                  opacity="0.5"
                />
                {/* 用户标签 */}
                <text
                  x={collaborator.cursor.column * 8}
                  y={collaborator.cursor.line * 20 - 5}
                  fill={collaborator.color}
                  fontSize="12"
                  fontWeight="bold"
                >
                  {collaborator.name}
                </text>
              </g>
            )
          ))}
        </svg>

        {/* 选中区域高亮 */}
        {collaborators.map(collaborator => (
          collaborator.selection && (
            <div
              key={collaborator.id}
              className="absolute pointer-events-none opacity-20"
              style={{
                backgroundColor: collaborator.color,
                top: `${collaborator.selection.start.line * 20}px`,
                left: `${collaborator.selection.start.column * 8}px`,
                width: `${(collaborator.selection.end.column - collaborator.selection.start.column) * 8}px`,
                height: `${(collaborator.selection.end.line - collaborator.selection.start.line) * 20}px`,
              }}
            />
          )
        ))}
      </div>

      {/* 协作者面板 */}
      {showCollaborators && (
        <div className="absolute top-4 right-4 w-64 bg-cyber-dark/95 border border-cyber-cyan/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-cyber-cyan flex items-center gap-2">
              <Users size={16} />
              Collaborators ({activeUsers})
            </h3>
            {isConnected && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>

          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <motion.div
                key={collaborator.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-cyber-muted/50 hover:bg-cyber-muted"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{collaborator.name}</p>
                  <p className="text-xs text-gray-400">
                    {collaborator.isOnline ? 'Online' : 'Away'}
                  </p>
                </div>
                {collaborator.isOnline && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </motion.div>
            ))}
          </div>

          {/* 分享按钮 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
            }}
            className="w-full mt-4 px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg text-cyber-cyan text-sm font-medium hover:bg-cyber-cyan/30 flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            Share Document
          </motion.button>
        </div>
      )}

      {/* 评论面板 */}
      {showComments && showCommentsPanel && (
        <div className="absolute top-4 left-4 w-80 bg-cyber-dark/95 border border-cyber-purple/30 rounded-lg p-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-cyber-purple flex items-center gap-2">
              <MessageSquare size={16} />
              Comments ({comments.filter(c => !c.resolved).length})
            </h3>
            <button
              onClick={() => setShowCommentsPanel(false)}
              className="p-1 hover:bg-cyber-purple/20 rounded"
            >
              ✕
            </button>
          </div>

          {/* 新评论输入 */}
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 bg-cyber-muted border border-cyber-purple/30 rounded-lg text-sm resize-none focus:outline-none focus:border-cyber-purple"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="mt-2 w-full px-4 py-2 bg-cyber-purple text-white rounded-lg text-sm font-medium hover:bg-cyber-purple/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>

          {/* 评论列表 */}
          <div className="space-y-3">
            {comments.map(comment => (
              <div
                key={comment.id}
                className={cn(
                  'p-3 rounded-lg border',
                  comment.resolved
                    ? 'bg-gray-900/50 border-gray-700 opacity-60'
                    : 'bg-cyber-muted/50 border-cyber-purple/30'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyber-purple flex items-center justify-center text-xs">
                      {comment.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{comment.userName}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mb-2">{comment.content}</p>
                {!comment.resolved && comment.userId === userId && (
                  <button
                    onClick={() => handleResolveComment(comment.id)}
                    className="text-xs text-cyber-purple hover:text-cyber-purple/80"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 文档锁定提示 */}
      {documentLocked && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center gap-2 text-yellow-500">
          <Lock size={16} />
          <span className="text-sm">
            Document locked by {lockedBy}
          </span>
        </div>
      )}

      {/* 连接状态提示 */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-500"
          >
            <AlertCircle size={16} />
            <span className="text-sm">
              Reconnecting...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RealtimeEditor;
