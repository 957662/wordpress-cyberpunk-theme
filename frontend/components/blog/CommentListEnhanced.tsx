'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Heart, Trash2, Reply, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt?: string;
  parentId?: number;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface CommentListEnhancedProps {
  comments: Comment[];
  onReply?: (content: string, parentId: number) => void;
  onDelete?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  isLoading?: boolean;
  currentUserId?: number;
  maxDepth?: number;
}

export function CommentListEnhanced({
  comments,
  onReply,
  onDelete,
  onLike,
  isLoading = false,
  currentUserId,
  maxDepth = 2
}: CommentListEnhancedProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showReplies, setShowReplies] = useState<Set<number>>(new Set());

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const toggleShowReplies = (commentId: number) => {
    setShowReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet);
    });
  };

  const renderComment = (comment: Comment, depth: number = 0): React.ReactNode => {
    const isOwnComment = currentUserId === comment.author.id;
    const canReply = depth < maxDepth;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isShowingReplies = showReplies.has(comment.id);
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt));

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-12 mt-4' : 'mb-6'}`}>
        <Card className="p-4">
          <div className="flex gap-3">
            {/* 头像 */}
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={comment.author.avatarUrl} />
              <AvatarFallback>
                {comment.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* 内容区域 */}
            <div className="flex-1 min-w-0">
              {/* 作者信息和操作 */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    {comment.author.fullName || comment.author.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo}
                  </span>
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      (edited)
                    </span>
                  )}
                </div>

                {/* 操作菜单 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canReply && onReply && (
                      <DropdownMenuItem onClick={() => handleReply(comment.id)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                    )}
                    {isOwnComment && onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(comment.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 评论内容 */}
              <p className="text-sm mb-3 whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              {/* 操作按钮 */}
              <div className="flex items-center gap-4">
                {/* 点赞 */}
                {onLike && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike(comment.id)}
                    className={`h-8 px-2 ${
                      comment.isLiked ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-1 ${
                        comment.isLiked ? 'fill-current' : ''
                      }`}
                    />
                    {comment.likes || 0}
                  </Button>
                )}

                {/* 回复 */}
                {canReply && onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    className="h-8 px-2"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                )}

                {/* 显示回复 */}
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleShowReplies(comment.id)}
                    className="h-8 px-2"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {isShowingReplies ? 'Hide' : 'Show'} {comment.replies?.length}{' '}
                    {comment.replies?.length === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>

              {/* 回复表单 */}
              {replyingTo === comment.id && (
                <div className="mt-4 pt-4 border-t">
                  <CommentReplyForm
                    onSubmit={(content) => {
                      onReply?.(content, comment.id);
                      setReplyingTo(null);
                    }}
                    onCancel={handleCancelReply}
                    isLoading={isLoading}
                    replyTo={comment.author.username}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 子评论 */}
        {hasReplies && isShowingReplies && (
          <div className="space-y-4 mt-4">
            {comment.replies?.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => renderComment(comment))}
    </div>
  );
}

// 回复表单组件
function CommentReplyForm({
  onSubmit,
  onCancel,
  isLoading,
  replyTo
}: {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  replyTo: string;
}) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Reply className="w-4 h-4" />
        Replying to <span className="font-medium">{replyTo}</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        className="w-full min-h-[80px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!content.trim() || isLoading}>
          {isLoading ? 'Posting...' : 'Post Reply'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default CommentListEnhanced;
