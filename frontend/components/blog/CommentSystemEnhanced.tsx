'use client';

import React, { useState } from 'react';
import { CommentFormEnhanced } from './CommentFormEnhanced';
import { CommentListEnhanced } from './CommentListEnhanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

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

export interface CommentSystemEnhancedProps {
  postId: number;
  initialComments?: Comment[];
  allowComments?: boolean;
  showTitle?: boolean;
}

export function CommentSystemEnhanced({
  postId,
  initialComments = [],
  allowComments = true,
  showTitle = true
}: CommentSystemEnhancedProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleAddComment = async (content: string, parentId?: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          postId,
          content,
          parentId
        })
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const newComment = await response.json();

      if (parentId) {
        // 更新回复
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        }));
      } else {
        // 添加新评论
        setComments(prev => [newComment, ...prev]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      // 从列表中移除评论
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/v1/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to like comment');

      // 更新评论点赞状态
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: (comment.likes || 0) + (comment.isLiked ? -1 : 1)
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  if (!allowComments) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Comments are disabled for this post
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* 评论表单 */}
        <CommentFormEnhanced
          onSubmit={(content) => handleAddComment(content)}
          isLoading={isLoading}
          placeholder="Share your thoughts..."
        />

        {/* 评论列表 */}
        <CommentListEnhanced
          comments={comments}
          onReply={(content, parentId) => handleAddComment(content, parentId)}
          onDelete={handleDeleteComment}
          onLike={handleLikeComment}
          isLoading={isLoading}
          currentUserId={user?.id}
        />
      </CardContent>
    </Card>
  );
}

export default CommentSystemEnhanced;
