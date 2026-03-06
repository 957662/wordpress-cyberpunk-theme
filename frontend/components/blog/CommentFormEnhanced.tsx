'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

export interface CommentFormEnhancedProps {
  onSubmit: (content: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  replyTo?: {
    id: number;
    author: string;
  };
  onCancelReply?: () => void;
  autoFocus?: boolean;
}

export function CommentFormEnhanced({
  onSubmit,
  isLoading = false,
  placeholder = 'Write a comment...',
  replyTo,
  onCancelReply,
  autoFocus = false
}: CommentFormEnhancedProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter 或 Cmd+Enter 提交
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mr-4">
          Please log in to comment
        </p>
        <Button onClick={() => router.push('/login')}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 回复提示 */}
      {replyTo && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            Replying to <span className="font-medium">{replyTo.author}</span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 输入区域 */}
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[100px] resize-none"
            disabled={isLoading || isSubmitting}
          />
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to submit
            </p>
            <Button
              type="submit"
              disabled={!content.trim() || isLoading || isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CommentFormEnhanced;
