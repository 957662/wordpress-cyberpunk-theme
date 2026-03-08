'use client';

/**
 * CommentSystem - 评论系统组件
 * 支持评论、回复、点赞、时间线显示
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Reply, User, Clock } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSystemProps {
  postId: string;
  comments?: Comment[];
  className?: string;
}

export function CommentSystem({ postId, comments = [], className }: CommentSystemProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // 提交新评论
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: '访客用户', // 实际项目中从用户状态获取
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setLocalComments([comment, ...localComments]);
    setNewComment('');
  };

  // 提交回复
  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      author: {
        name: '访客用户',
      },
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      })
    );

    setReplyContent('');
    setReplyTo(null);
  };

  // 点赞评论
  const handleLikeComment = (commentId: string) => {
    setLocalComments(prev =>
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

  // 格式化时间
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    return `${diffDays} 天前`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
        <MessageCircle className="w-6 h-6 text-cyber-cyan" />
        <div>
          <h3 className="text-xl font-bold text-white">评论</h3>
          <p className="text-sm text-gray-500">
            {localComments.length} 条评论
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      <div className="cyber-card p-4 border border-cyber-border">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="发表你的看法..."
          className="w-full min-h-[100px] p-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 resize-none"
          rows={4}
        />
        <div className="flex justify-end mt-3">
          <CyberButton
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            variant="primary"
            size="sm"
          >
            发表评论
          </CyberButton>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {localComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Comment */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{comment.author.name}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(comment.createdAt)}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed">{comment.content}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-sm transition-colors',
                      comment.isLiked ? 'text-cyber-pink' : 'text-gray-500 hover:text-cyber-pink'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', comment.isLiked && 'fill-current')} />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-cyber-cyan transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>回复</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            {replyTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ml-13"
              >
                <div className="cyber-card p-4 border border-cyber-border">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`回复 ${comment.author.name}...`}
                    className="w-full min-h-[80px] p-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <CyberButton
                      onClick={() => {
                        setReplyTo(null);
                        setReplyContent('');
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      取消
                    </CyberButton>
                    <CyberButton
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                      variant="primary"
                      size="sm"
                    >
                      回复
                    </CyberButton>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-13 space-y-4 border-l-2 border-cyber-border pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{reply.author.name}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(reply.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300">{reply.content}</p>

                      <button
                        onClick={() => handleLikeComment(reply.id)}
                        className={cn(
                          'flex items-center gap-1 text-xs transition-colors',
                          reply.isLiked ? 'text-cyber-pink' : 'text-gray-500 hover:text-cyber-pink'
                        )}
                      >
                        <Heart className={cn('w-3 h-3', reply.isLiked && 'fill-current')} />
                        <span>{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {localComments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">还没有评论，快来发表第一条评论吧！</p>
        </div>
      )}
    </div>
  );
}

export default CommentSystem;
