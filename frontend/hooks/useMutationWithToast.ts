/**
 * useMutationWithToast Hook
 * 带Toast提示的Mutation Hook
 */

import { useCallback } from 'react';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'onSuccess' | 'onError'> {
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
  showToast?: boolean;
}

export function useMutationWithToast<
  TData = unknown,
  TError = Error,
  TVariables = void
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TError, TVariables>
) {
  {
    const {
      successMessage,
      errorMessage,
      showToast = true,
      ...mutationOptions
    } = options || {};

    const mutation = useMutation({
      mutationFn,
      onSuccess: (data, variables, context) => {
        if (showToast && successMessage) {
          const message = typeof successMessage === 'function'
            ? successMessage(data)
            : successMessage;
          toast.success(message);
        }
        mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        if (showToast) {
          const message = errorMessage
            ? typeof errorMessage === 'function'
              ? errorMessage(error)
              : errorMessage
            : error instanceof Error
              ? error.message
              : 'An error occurred';
          toast.error(message);
        }
        mutationOptions?.onError?.(error, variables, context);
      },
      ...mutationOptions,
    });

    return mutation;
  }
}

// 导出便捷Hook
export function useLikeMutation() {
  return useMutationWithToast(
    async ({ type, id }: { type: 'post' | 'comment'; id: string }) => {
      const response = await fetch(`/api/v1/social/like/${type}/${id}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like');
      return response.json();
    },
    {
      successMessage: 'Liked successfully!',
      errorMessage: 'Failed to like',
    }
  );
}

export function useBookmarkMutation() {
  return useMutationWithToast(
    async ({ postId, folder, notes }: {
      postId: string;
      folder?: string;
      notes?: string;
    }) => {
      const response = await fetch('/api/v1/social/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, folder, notes }),
      });
      if (!response.ok) throw new Error('Failed to bookmark');
      return response.json();
    },
    {
      successMessage: 'Added to bookmarks!',
      errorMessage: 'Failed to add bookmark',
    }
  );
}

export function useFollowMutation() {
  return useMutationWithToast(
    async ({ userId, action }: {
      userId: string;
      action: 'follow' | 'unfollow';
    }) => {
      const response = await fetch(`/api/v1/social/follow/${userId}`, {
        method: action === 'follow' ? 'POST' : 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to ${action}`);
      return response.json();
    },
    {
      successMessage: ({ action }) =>
        action === 'follow' ? 'Following user!' : 'Unfollowed user',
      errorMessage: 'Failed to update follow status',
    }
  );
}

export function useCommentMutation() {
  return useMutationWithToast(
    async (data: {
      post_id: string;
      content: string;
      parent_id?: string;
    }) => {
      const response = await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to post comment');
      return response.json();
    },
    {
      successMessage: 'Comment posted!',
      errorMessage: 'Failed to post comment',
    }
  );
}
