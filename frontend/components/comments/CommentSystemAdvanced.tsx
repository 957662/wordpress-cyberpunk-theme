'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Reply, ThumbsUp, ThumbsDown, Send, Trash2, Flag } from 'lucide-react';
import { CyberInput } from '../cyber/cyber-input';
import { CyberButton } from '../cyber/cyber-button';
import { CyberAvatar } from '../cyber/CyberAvatar';
import { CyberToast } from '../ui/CyberToast';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  date: string;
  parentId?: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

interface CommentSystemProps {
  postId: number;
  apiUrl?: string;
}

export function CommentSystemAdvanced({ postId, apiUrl = '/api/comments' }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${apiUrl}?post_id=${postId}`);
      const data = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      showToast('error', '加载评论失败');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !authorName.trim() || !authorEmail.trim()) {
      showToast('error', '请填写所有必填字段');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          author_name: authorName,
          author_email: authorEmail,
          content: commentText,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText('');
        showToast('success', '评论提交成功！等待审核');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      showToast('error', '提交失败，请稍后重试');
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          author_name: authorName,
          author_email: authorEmail,
          content: replyText,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setComments(comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          return comment;
        }));
        setReplyText('');
        setReplyingTo(null);
        showToast('success', '回复提交成功！');
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
      showToast('error', '回复失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="cyber-loader" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <CyberToast type={toast.type} message={toast.message} />}

      <div className="cyber-card p-6">
        <h3 className="text-xl font-bold mb-4 text-cyber-cyan">发表评论</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CyberInput
              placeholder="你的名字"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <CyberInput
              type="email"
              placeholder="邮箱地址"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
            />
          </div>
          <textarea
            className="cyber-textarea"
            rows={4}
            placeholder="写下你的评论..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <CyberButton onClick={handleSubmitComment} disabled={!commentText.trim()}>
            <Send className="w-4 h-4 mr-2" />
            发表评论
          </CyberButton>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cyber-cyan">
          评论 ({comments.length})
        </h3>

        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={() => setReplyingTo(comment.id)}
              isReplying={replyingTo === comment.id}
              replyText={replyText}
              onReplyChange={setReplyText}
              onSubmitReply={() => handleSubmitReply(comment.id)}
              onCancelReply={() => setReplyingTo(null)}
            />
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>还没有评论，快来抢沙发吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
  isReplying: boolean;
  replyText: string;
  onReplyChange: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

function CommentItem({
  comment,
  onReply,
  isReplying,
  replyText,
  onReplyChange,
  onSubmitReply,
  onCancelReply,
}: CommentItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="cyber-card p-4 space-y-3"
    >
      <div className="flex items-start space-x-3">
        <CyberAvatar
          src={comment.author.avatar}
          alt={comment.author.name}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-cyber-cyan">
              {comment.author.name}
            </h4>
            <span className="text-xs text-gray-500">{comment.date}</span>
          </div>
          <p className="mt-2 text-gray-300 whitespace-pre-wrap">{comment.content}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <button
          onClick={onReply}
          className="flex items-center space-x-1 text-gray-400 hover:text-cyber-cyan transition-colors"
        >
          <Reply className="w-4 h-4" />
          <span>回复</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-400 hover:text-cyber-pink transition-colors">
          <Flag className="w-4 h-4" />
          <span>举报</span>
        </button>
      </div>

      {isReplying && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <textarea
            className="cyber-textarea"
            rows={3}
            placeholder="写下你的回复..."
            value={replyText}
            onChange={(e) => onReplyChange(e.target.value)}
          />
          <div className="flex space-x-2">
            <CyberButton onClick={onSubmitReply} size="sm">
              <Send className="w-4 h-4 mr-2" />
              提交回复
            </CyberButton>
            <CyberButton onClick={onCancelReply} variant="outline" size="sm">
              取消
            </CyberButton>
          </div>
        </motion.div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l-2 border-cyber-purple pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="cyber-card p-3">
              <div className="flex items-start space-x-2">
                <CyberAvatar
                  src={reply.author.avatar}
                  alt={reply.author.name}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-semibold text-sm text-cyber-purple">
                      {reply.author.name}
                    </h5>
                    <span className="text-xs text-gray-500">{reply.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-300">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
