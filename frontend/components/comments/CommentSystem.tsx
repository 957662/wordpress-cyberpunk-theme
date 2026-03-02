'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, Reply, MoreVertical, Flag, Trash2, Edit2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Image from 'next/image';

export interface Comment {
  id: string;
  postId: string;
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  replies?: Comment[];
  isLiked?: boolean;
}

export interface CommentSystemProps {
  postId: string;
  comments: Comment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onUpdateComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
  allowReplies?: boolean;
  allowLikes?: boolean;
  allowAnonymous?: boolean;
  sortBy?: 'latest' | 'oldest' | 'popular';
}

export const CommentSystem: React.FC<CommentSystemProps> = ({
  postId,
  comments: initialComments,
  currentUser,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
  allowReplies = true,
  allowLikes = true,
  allowAnonymous = true,
  sortBy = 'latest'
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showAllReplies, setShowAllReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;

    if (!content.trim()) return;

    try {
      await onAddComment(content, replyingTo || undefined);
      setReplyingTo(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('提交评论失败:', error);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await onUpdateComment?.(commentId, editContent);
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('更新评论失败:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      await onDeleteComment?.(commentId);
    } catch (error) {
      console.error('删除评论失败:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await onLikeComment?.(commentId);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const toggleShowAllReplies = (commentId: string) => {
    setShowAllReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const CommentItem: React.FC<{
    comment: Comment;
    depth?: number;
  }> = ({ comment, depth = 0 }) => {
    const [showMenu, setShowMenu] = useState(false);
    const isOwner = currentUser?.id === comment.authorId;
    const canModerate = currentUser?.role === 'administrator' || currentUser?.role === 'editor';
    const maxDepth = 3;
    const canReply = allowReplies && depth < maxDepth;

    const displayedReplies = showAllReplies.has(comment.id)
      ? comment.replies
      : comment.replies?.slice(0, 2);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${depth > 0 ? 'ml-12 mt-4' : 'mb-6'}`}
      >
        <div className="bg-dark-bg/50 border border-dark-border rounded-lg p-4">
          {/* 评论头部 */}
          <div className="flex items-start gap-3">
            {/* 头像 */}
            <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-cyber-cyan to-cyber-purple">
              {comment.authorAvatar ? (
                <Image
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-white font-semibold">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{comment.authorName}</span>
                {isOwner && (
                  <span className="px-2 py-0.5 rounded text-xs bg-cyber-cyan/20 text-cyber-cyan">
                    作者
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: zhCN
                  })}
                </span>
              </div>

              {editingId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-cyber-cyan focus:outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="px-3 py-1 rounded bg-cyber-cyan text-white text-sm hover:bg-cyber-cyan/80 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="px-3 py-1 rounded bg-dark-bg border border-dark-border text-gray-400 text-sm hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
              )}
            </div>

            {/* 操作菜单 */}
            {(isOwner || canModerate) && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded hover:bg-dark-bg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-dark-bg border border-dark-border rounded-lg shadow-xl z-10 min-w-[120px]">
                    {isOwner && onUpdateComment && (
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:text-cyber-cyan hover:bg-dark-bg/50 transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        编辑
                      </button>
                    )}
                    {(isOwner || canModerate) && onDeleteComment && (
                      <button
                        onClick={() => {
                          handleDelete(comment.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-dark-bg/50 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dark-border">
            {allowLikes && onLikeComment && (
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.isLiked
                    ? 'text-cyber-pink'
                    : 'text-gray-500 hover:text-cyber-pink'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                <span>{comment.likeCount > 0 ? comment.likeCount : '赞'}</span>
              </button>
            )}

            {canReply && (
              <button
                onClick={() => {
                  if (replyingTo === comment.id) {
                    setReplyingTo(null);
                  } else {
                    setReplyingTo(comment.id);
                  }
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-cyber-cyan transition-colors"
              >
                <Reply className="w-4 h-4" />
                回复
              </button>
            )}

            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-cyber-yellow transition-colors">
              <Flag className="w-4 h-4" />
              举报
            </button>
          </div>

          {/* 回复输入框 */}
          {replyingTo === comment.id && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mt-4"
            >
              <input type="hidden" name="parentId" value={comment.id} />
              <div className="flex gap-3">
                {currentUser?.avatar && (
                  <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    name="content"
                    placeholder={`回复 @${comment.authorName}...`}
                    className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none resize-none"
                    rows={2}
                    required
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1 rounded text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded bg-gradient-to-r from-cyber-cyan to-blue-500 text-white text-sm hover:shadow-neon transition-shadow"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </div>
            </motion.form>
          )}

          {/* 回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {displayedReplies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}

              {comment.replies.length > 2 && !showAllReplies.has(comment.id) && (
                <button
                  onClick={() => toggleShowAllReplies(comment.id)}
                  className="text-sm text-cyber-cyan hover:text-cyber-purple transition-colors"
                >
                  查看全部 {comment.replies.length} 条回复
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const rootComments = comments.filter(c => !c.parentId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 评论统计 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyber-cyan" />
          评论 ({rootComments.length})
        </h2>
      </div>

      {/* 发表评论表单 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-dark-bg/50 border border-dark-border rounded-lg p-4">
          <div className="flex gap-3 mb-3">
            {currentUser?.avatar ? (
              <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <textarea
              name="content"
              placeholder={currentUser ? '发表你的看法...' : '登录后参与评论...'}
              className="flex-1 px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none resize-none"
              rows={3}
              disabled={!currentUser && !allowAnonymous}
              required
            />
          </div>

          {!currentUser && allowAnonymous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                name="guestName"
                placeholder="你的名字"
                className="px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
                required
              />
              <input
                type="email"
                name="guestEmail"
                placeholder="邮箱地址"
                className="px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
                required
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!currentUser && !allowAnonymous}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyber-cyan to-blue-500 text-white font-semibold hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发表评论
            </button>
          </div>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {rootComments.length > 0 ? (
            rootComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>还没有评论，快来抢沙发吧！</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentSystem;
