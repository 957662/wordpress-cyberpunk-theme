import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wpClient, wpKeys } from './client'

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { postId: number; content: string; author: string; email?: string }) => {
      // TODO: Implement actual API call when WordPress comment endpoint is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true })
        }, 1000)
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: wpKeys.all })
    },
  })
}

export function useSubscribeToNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      // TODO: Implement actual newsletter subscription
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true })
        }, 500)
      })
    },
  })
}
