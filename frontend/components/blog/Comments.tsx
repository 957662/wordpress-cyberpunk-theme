/**
 * Comments Component
 * 评论组件 - 显示文章评论和评论表单
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, Reply, Trash2, Send, User } from 'lucide-react';
import { useWordPressPosts } from '@/hooks/useWordPressPosts';
import { createComment, buildCommentTree, type Comment } from '@/lib/api/comments';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberInput } from '@/components/ui/CyberInput';
import { CyberTextarea } from '@/components/ui/CyberTextarea';
import { formatRelativeTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

interface CommentsProps {
  postId: number;
  className?: string;
}

interface CommentNode extends Comment {
  replies?: CommentNode[];
}

export function Comments({ postId, className }: CommentsProps) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });

  // 加载评论
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/comments?post=${postId}&per_page=100&order=asc`
      );
      const data: Comment[] = await response.json();
      const tree = buildCommentTree(data);
      setComments(tree);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    try {
      setIsSubmitting(true);
      await createComment({
        post: postId,
        content: formData.content,
        parent: replyTo || undefined,
        author: formData.name || '匿名用户',
        author_email: formData.email,
      });

      // 重置表单
      setFormData({ name: formData.name, email: formData.email, content: '' });
      setReplyTo(null);

      // 重新加载评论
      await loadComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    // 滚动到表单
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 评论标题 */}
      <div className="flex items-center gap-3 border-b border-cyber-cyan/20 pb-4">
        <MessageSquare className="w-6 h-6 text-cyber-cyan" />
        <h2 className="text-2xl font-bold text-white">评论</h2>
        <span className="text-cyber-cyan">({comments.length})</span>
      </div>

      {/* 评论表单 */}
      <div id="comment-form" className="cyber-card p-6">
        <h3 className="text-lg font-bold text-cyber-cyan mb-4">
          {replyTo ? '回复评论' : '发表评论'}
        </h3>

        {replyTo && (
          <div className="mb-4 p-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-cyber-purple">正在回复评论 #{replyTo}</span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-xs text-cyber-cyan hover:text-cyber-pink transition-colors"
              >
                取消回复
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CyberInput
              label="昵称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="你的昵称"
              required
            />
            <CyberInput
              type="email"
              label="邮箱"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <CyberTextarea
            label="评论内容"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="写下你的评论..."
            rows={5}
            required
          />

          <div className="flex justify-end">
            <CyberButton
              type="submit"
              variant="cyan"
              disabled={isSubmitting || !formData.content.trim()}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  发表评论
                </>
              )}
            </CyberButton>
          </div>
        </form>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
            <p className="mt-4 text-gray-400">加载评论中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 cyber-card">
            <MessageSquare className="w-16 h-16 text-cyber-cyan/50 mx-auto mb-4" />
            <p className="text-gray-400">还没有评论，快来抢沙发吧！</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                depth={0}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: CommentNode;
  onReply: (commentId: number) => void;
  depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const maxDepth = 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'cyber-card p-4',
        depth > 0 && 'ml-8 mt-4',
        depth > 0 && 'border-l-2 border-l-cyber-cyan/30'
      )}
    >
      <div className="flex gap-4">
        {/* 头像 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {/* 头部信息 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-bold text-cyber-cyan">
              {comment.author_name || '匿名用户'}
            </span>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(comment.date)}
            </span>
          </div>

          {/* 评论内容 */}
          <div
            className="text-gray-300 mb-3 prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: comment.content?.rendered || '' }}
          />

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-cyber-cyan hover:text-cyber-pink transition-colors"
            >
              <Reply className="w-3 h-3" />
              回复
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyber-cyan transition-colors"
              >
                {isExpanded ? '收起' : '展开'}回复 ({comment.replies.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 子评论 */}
      {isExpanded && comment.replies && comment.replies.length > 0 && depth < maxDepth && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
