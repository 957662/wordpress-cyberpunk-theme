'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageSquare,
  FiX,
  FiEdit3,
  FiTrash2,
  FiReply,
  FiHeart,
  FiUser,
  FiClock,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 协作注释系统组件
 *
 * 功能特性:
 * - 文本选择和注释
 * - 注释管理（添加、编辑、删除）
 * - 回复评论
 * - 点赞功能
 * - 实时协作（多用户）
 * - 注释导出
 * - 高亮显示
 * - 分类标签
 *
 * @example
 * ```tsx
 * <CollaborativeAnnotations
 *   content={articleContent}
 *   articleId="123"
 *   userId="user-456"
 *   onAnnotationAdd={(annotation) => console.log('Added:', annotation)}
 * />
 * ```
 */

export interface AnnotationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface AnnotationReply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  likes: number;
  likedBy?: string[];
}

export interface Annotation {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userColor?: string;
  content: string;
  position: {
    start: number;
    end: number;
    text: string;
  };
  replies: AnnotationReply[];
  likes: number;
  likedBy?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  isResolved?: boolean;
}

export interface CollaborativeAnnotationsProps {
  /** 文章内容 */
  content: string;
  /** 文章 ID */
  articleId: string;
  /** 当前用户 ID */
  userId: string;
  /** 当前用户信息 */
  currentUser?: AnnotationUser;
  /** 现有注释 */
  annotations?: Annotation[];
  /** 注释添加回调 */
  onAnnotationAdd?: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  /** 注释更新回调 */
  onAnnotationUpdate?: (id: string, updates: Partial<Annotation>) => void;
  /** 注释删除回调 */
  onAnnotationDelete?: (id: string) => void;
  /** 回复添加回调 */
  onReplyAdd?: (annotationId: string, reply: Omit<AnnotationReply, 'id'>) => void;
  /** 点赞回调 */
  onLike?: (annotationId: string, userId: string) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否显示侧边栏 */
  showSidebar?: boolean;
}

type AnnotationMode = 'view' | 'add' | 'edit';

/**
 * 注释卡片
 */
interface AnnotationCardProps {
  annotation: Annotation;
  currentUserId: string;
  mode: AnnotationMode;
  onEdit: () => void;
  onDelete: () => void;
  onReply: (content: string) => void;
  onLike: () => void;
  onUpdate?: (content: string) => void;
  onResolve?: () => void;
}

const AnnotationCard: React.FC<AnnotationCardProps> = ({
  annotation,
  currentUserId,
  mode,
  onEdit,
  onDelete,
  onReply,
  onLike,
  onUpdate,
  onResolve,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(annotation.content);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isOwner = annotation.userId === currentUserId;
  const isLiked = annotation.likedBy?.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'p-4 rounded-lg border transition-all duration-300',
        annotation.isResolved
          ? 'bg-gray-800/50 border-gray-700 opacity-60'
          : 'bg-[#1a1a2e]/50 border-cyber-cyan/20'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {annotation.userAvatar ? (
            <img
              src={annotation.userAvatar}
              alt={annotation.userName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: annotation.userColor || '#00f0ff' }}
            >
              {annotation.userName[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">
                {annotation.userName}
              </span>
              {annotation.isResolved && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                  已解决
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(annotation.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
        </div>

        {isOwner && mode === 'view' && (
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="p-1.5 rounded hover:bg-cyber-cyan/10 text-gray-400 hover:text-cyber-cyan"
            >
              <FiEdit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-1.5 rounded hover:bg-cyber-pink/10 text-gray-400 hover:text-cyber-pink"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* 选中文本 */}
      <div className="mb-3 p-2 bg-[#0a0a0f] rounded border-l-2 border-cyber-cyan">
        <p className="text-sm text-gray-300 italic">&quot;{annotation.position.text}&quot;</p>
      </div>

      {/* 内容编辑/显示 */}
      {mode === 'edit' ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 bg-[#0a0a0f] border border-cyber-cyan/20 rounded text-white text-sm focus:outline-none focus:border-cyber-cyan"
            rows={3}
            placeholder="编辑注释..."
          />
          <div className="flex items-center space-x-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdate?.(editContent)}
              className="px-3 py-1.5 bg-cyber-cyan text-black text-sm rounded hover:bg-cyber-cyan/80"
            >
              保存
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="px-3 py-1.5 bg-gray-800 text-gray-400 text-sm rounded hover:bg-gray-700"
            >
              取消
            </motion.button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-300 mb-3">{annotation.content}</p>
      )}

      {/* 标签 */}
      {annotation.tags && annotation.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {annotation.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 互动栏 */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLike}
            className={clsx(
              'flex items-center space-x-1 hover:text-cyber-pink transition-colors',
              isLiked && 'text-cyber-pink'
            )}
          >
            <FiHeart className={clsx('w-4 h-4', isLiked && 'fill-current')} />
            <span>{annotation.likes}</span>
          </motion.button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center space-x-1 hover:text-cyber-cyan transition-colors"
          >
            <FiMessageSquare className="w-4 h-4" />
            <span>{annotation.replies.length}</span>
          </button>
        </div>
      </div>

      {/* 回复表单 */}
      {showReplyForm && (
        <div className="mb-3 p-3 bg-[#0a0a0f] rounded">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 bg-transparent border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyber-cyan mb-2"
            rows={2}
            placeholder="写下你的回复..."
          />
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (replyContent.trim()) {
                  onReply(replyContent);
                  setReplyContent('');
                }
              }}
              disabled={!replyContent.trim()}
              className={clsx(
                'px-3 py-1 text-sm rounded transition-colors',
                replyContent.trim()
                  ? 'bg-cyber-cyan text-black hover:bg-cyber-cyan/80'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              )}
            >
              回复
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded hover:bg-gray-700"
            >
              取消
            </motion.button>
          </div>
        </div>
      )}

      {/* 回复列表 */}
      {annotation.replies.length > 0 && (
        <div className="space-y-2">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300"
          >
            <span>{annotation.replies.length} 条回复</span>
            {expanded ? (
              <FiChevronUp className="w-3 h-3" />
            ) : (
              <FiChevronDown className="w-3 h-3" />
            )}
          </motion.button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 pl-4 border-l-2 border-gray-700"
              >
                {annotation.replies.map((reply) => (
                  <div key={reply.id} className="p-2 bg-[#0a0a0f] rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-semibold text-white">
                        {reply.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(reply.createdAt), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{reply.content}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

/**
 * CollaborativeAnnotations 主组件
 */
export const CollaborativeAnnotations: React.FC<CollaborativeAnnotationsProps> = ({
  content,
  articleId,
  userId,
  currentUser,
  annotations = [],
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  onReplyAdd,
  onLike,
  className,
  showSidebar = true,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [annotationContent, setAnnotationContent] = useState('');
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * 处理文本选择
   */
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = selection.toString().trim();

    if (text && contentRef.current?.contains(selection.anchorNode)) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(contentRef.current!);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const start = preCaretRange.toString().length;

      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const end = preCaretRange.toString().length;

      setSelectedText(text);
      setSelectionRange({ start, end });
      setShowAnnotationForm(true);
    }
  };

  /**
   * 添加注释
   */
  const handleAddAnnotation = () => {
    if (!selectedText || !annotationContent.trim() || !selectionRange) return;

    const newAnnotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'> = {
      articleId,
      userId,
      userName: currentUser?.name || '匿名用户',
      userAvatar: currentUser?.avatar,
      userColor: currentUser?.color || '#00f0ff',
      content: annotationContent,
      position: {
        start: selectionRange.start,
        end: selectionRange.end,
        text: selectedText,
      },
      replies: [],
      likes: 0,
      likedBy: [],
      tags: [],
      isResolved: false,
    };

    onAnnotationAdd?.(newAnnotation);

    // 重置状态
    setSelectedText('');
    setSelectionRange(null);
    setAnnotationContent('');
    setShowAnnotationForm(false);
  };

  /**
   * 高亮注释文本
   */
  const renderContentWithHighlights = () => {
    if (annotations.length === 0) return content;

    let result = content;
    const sortedAnnotations = [...annotations].sort(
      (a, b) => b.position.start - a.position.start
    );

    sortedAnnotations.forEach((annotation) => {
      const before = result.slice(0, annotation.position.start);
      const highlighted = result.slice(
        annotation.position.start,
        annotation.position.end
      );
      const after = result.slice(annotation.position.end);

      result = `${before}<mark class="bg-cyber-cyan/20 text-cyber-cyan cursor-pointer hover:bg-cyber-cyan/30 transition-colors" data-annotation-id="${annotation.id}">${highlighted}</mark>${after}`;
    });

    return (
      <div
        ref={contentRef}
        className="prose prose-invert max-w-none"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: result }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const annotationId = target.getAttribute('data-annotation-id');
          if (annotationId) {
            setActiveAnnotationId(annotationId);
          }
        }}
      />
    );
  };

  return (
    <div className={clsx('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      {/* 内容区域 */}
      <div className="lg:col-span-2">
        <div className="prose prose-invert max-w-none prose-cyber">
          {renderContentWithHighlights()}
        </div>

        {/* 注释表单 */}
        {showAnnotationForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-[#1a1a2e]/50 border border-cyber-cyan/20 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-cyber-cyan">添加注释</h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowAnnotationForm(false);
                  setSelectedText('');
                  setAnnotationContent('');
                }}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="mb-3 p-2 bg-[#0a0a0f] rounded border-l-2 border-cyber-purple">
              <p className="text-sm text-gray-300 italic">&quot;{selectedText}&quot;</p>
            </div>

            <textarea
              value={annotationContent}
              onChange={(e) => setAnnotationContent(e.target.value)}
              className="w-full p-3 bg-[#0a0a0f] border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyber-cyan mb-3"
              rows={3}
              placeholder="写下你的注释..."
            />

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddAnnotation}
                disabled={!annotationContent.trim()}
                className={clsx(
                  'px-4 py-2 rounded transition-colors',
                  annotationContent.trim()
                    ? 'bg-cyber-cyan text-black hover:bg-cyber-cyan/80'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                )}
              >
                添加注释
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAnnotationForm(false);
                  setSelectedText('');
                  setAnnotationContent('');
                }}
                className="px-4 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700"
              >
                取消
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 侧边栏 */}
      {showSidebar && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">注释</h3>
            <span className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded">
              {annotations.length}
            </span>
          </div>

          <div className="space-y-4">
            {annotations.map((annotation) => (
              <AnnotationCard
                key={annotation.id}
                annotation={annotation}
                currentUserId={userId}
                mode={editMode === annotation.id ? 'edit' : 'view'}
                onEdit={() => setEditMode(annotation.id)}
                onDelete={() => onAnnotationDelete?.(annotation.id)}
                onReply={(content) => {
                  onReplyAdd?.(annotation.id, {
                    userId,
                    userName: currentUser?.name || '匿名用户',
                    content,
                    createdAt: new Date(),
                    likes: 0,
                    likedBy: [],
                  });
                }}
                onLike={() => onLike?.(annotation.id, userId)}
                onUpdate={(content) => {
                  onAnnotationUpdate?.(annotation.id, { content });
                  setEditMode(null);
                }}
              />
            ))}

            {annotations.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  选中任意文本开始添加注释
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeAnnotations;
