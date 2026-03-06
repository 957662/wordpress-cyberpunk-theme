'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Reply, Send, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Types
interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: 'user' | 'admin' | 'author';
  };
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  isLiked: boolean;
}

interface CommentSystemProps {
  postId: string;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  initialComments?: Comment[];
  onCommentSubmit?: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>) => void;
  onCommentUpdate?: (id: string, content: string) => void;
  onCommentDelete?: (id: string) => void;
  onCommentLike?: (id: string) => void;
  className?: string;
}

export function CommentSystem({
  postId,
  currentUser,
  initialComments = [],
  onCommentSubmit,
  onCommentUpdate,
  onCommentDelete,
  onCommentLike,
  className
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyTo && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyTo]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUser || isSubmitting) return;

    setIsSubmitting(true);
    const commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'> = {
      content: newComment,
      author: currentUser,
      parentId: replyTo || undefined,
    };

    if (onCommentSubmit) {
      await onCommentSubmit(commentData);
    }

    // Optimistic update
    const newCommentObj: Comment = {
      ...commentData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    if (replyTo) {
      setComments(prev =>
        prev.map(comment => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentObj],
            };
          }
          return comment;
        })
      );
      setReplyContent('');
      setReplyTo(null);
    } else {
      setComments(prev => [newCommentObj, ...prev]);
    }

    setNewComment('');
    setIsSubmitting(false);
  };

  const handleReply = (commentId: string) => {
    if (!currentUser) {
      // Show login prompt
      return;
    }
    setReplyTo(commentId);
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!replyContent.trim() || !currentUser || isSubmitting) return;

    setIsSubmitting(true);
    const commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'> = {
      content: replyContent,
      author: currentUser,
      parentId: commentId,
    };

    if (onCommentSubmit) {
      await onCommentSubmit(commentData);
    }

    // Optimistic update
    const newReply: Comment = {
      ...commentData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );

    setReplyContent('');
    setReplyTo(null);
    setIsSubmitting(false);
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    if (onCommentUpdate) {
      await onCommentUpdate(commentId, editContent);
    }

    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: editContent, updatedAt: new Date().toISOString() };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === commentId ? { ...reply, content: editContent } : reply
            ),
          };
        }
        return comment;
      })
    );

    setEditingId(null);
    setEditContent('');
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!onCommentDelete) return;

    if (confirm('确定要删除这条评论吗？')) {
      await onCommentDelete(commentId);

      setComments(prev =>
        prev.filter(comment => {
          if (comment.id === commentId) return false;
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId),
            };
          }
          return true;
        })
      );
    }
  };

  const handleLike = async (commentId: string) => {
    if (!onCommentLike) return;

    await onCommentLike(commentId);

    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === commentId
                ? {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked,
                  }
                : reply
            ),
          };
        }
        return comment;
      })
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('mb-4', isReply && 'ml-8 pl-4 border-l-2 border-cyber-cyan/30')}
    >
      <Card className="p-4 bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 hover:border-cyber-cyan/40 transition-colors">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-cyber-cyan/50">
            {comment.author.avatar ? (
              <img src={comment.author.avatar} alt={comment.author.name} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
                {comment.author.name.charAt(0)}
              </div>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-cyber-cyan">{comment.author.name}</span>
              {comment.author.role === 'admin' && (
                <span className="px-2 py-0.5 text-xs bg-cyber-purple/20 text-cyber-purple rounded">
                  管理员
                </span>
              )}
              {comment.author.role === 'author' && (
                <span className="px-2 py-0.5 text-xs bg-cyber-green/20 text-cyber-green rounded">
                  作者
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {formatDate(comment.createdAt)}
              </span>
              {comment.updatedAt && (
                <span className="text-xs text-gray-500">(已编辑)</span>
              )}
            </div>

            {editingId === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px] bg-cyber-dark/80"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditSubmit(comment.id)}
                    disabled={isSubmitting}
                    className="bg-cyber-green hover:bg-cyber-green/80"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="border-gray-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-200 whitespace-pre-wrap break-words mb-2">
                {comment.content}
              </p>
            )}

            {editingId !== comment.id && (
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    comment.isLiked ? 'text-cyber-pink' : 'text-gray-400 hover:text-cyber-pink'
                  )}
                >
                  <span className="text-lg">{comment.isLiked ? '❤️' : '🤍'}</span>
                  <span>{comment.likes}</span>
                </button>

                {!isReply && (
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    回复
                  </button>
                )}

                {currentUser && (currentUser.id === comment.author.id || currentUser.role === 'admin') && (
                  <>
                    <button
                      onClick={() => handleEdit(comment)}
                      className="flex items-center gap-1 text-gray-400 hover:text-cyber-green transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-cyber-pink transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply Input */}
        {replyTo === comment.id && (
          <div className="mt-4 ml-12">
            <div className="flex gap-2">
              <Textarea
                ref={replyInputRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`回复 ${comment.author.name}...`}
                className="min-h-[60px] bg-cyber-dark/80"
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={isSubmitting}
                  className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="border-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </Card>
    </motion.div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-cyber-cyan">
          评论 ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* Comment Input */}
      {currentUser ? (
        <Card className="p-4 bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-cyber-cyan/50">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="发表你的看法..."
                className="min-h-[100px] bg-cyber-dark/80 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-black font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? '发送中...' : '发表评论'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/20 text-center">
          <p className="text-gray-400 mb-4">登录后才能发表评论</p>
          <Button className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-black">
            立即登录
          </Button>
        </Card>
      )}

      {/* Comments List */}
      <AnimatePresence>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => renderComment(comment))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">还没有评论，快来抢沙发吧！</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CommentSystem;
