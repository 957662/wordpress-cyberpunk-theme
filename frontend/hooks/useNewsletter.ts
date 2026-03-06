'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface NewsletterSubscription {
  email: string;
  tags?: string[];
  firstName?: string;
  lastName?: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tags: string[];
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
}

interface UseNewsletterOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

// Subscribe to newsletter
export function useSubscribeToNewsletter(options?: UseNewsletterOptions) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const mutation = useMutation({
    mutationFn: async (subscription: NewsletterSubscription) => {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to subscribe');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setIsSubscribed(true);
      // Store subscription in localStorage
      localStorage.setItem('newsletterSubscribed', 'true');
      localStorage.setItem('newsletterEmail', data.email);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  return {
    subscribe: mutation.mutate,
    subscribeAsync: mutation.mutateAsync,
    isSubscribed,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: () => {
      setIsSubscribed(false);
      mutation.reset();
    },
  };
}

// Unsubscribe from newsletter
export function useUnsubscribeFromNewsletter(options?: UseNewsletterOptions) {
  const mutation = useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unsubscribe');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem('newsletterSubscribed');
      localStorage.removeItem('newsletterEmail');
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  return {
    unsubscribe: mutation.mutate,
    unsubscribeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Check subscription status
export function useNewsletterStatus(email?: string) {
  const query = useQuery({
    queryKey: ['newsletter-status', email],
    queryFn: async () => {
      if (!email) return null;

      const response = await fetch(`/api/newsletter/status?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error('Failed to check subscription status');
      }

      return response.json() as Promise<{ subscribed: boolean; subscriber?: NewsletterSubscriber }>;
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    status: query.data,
    isSubscribed: query.data?.subscribed || false,
    subscriber: query.data?.subscriber,
    isLoading: query.isLoading,
    error: query.error,
  };
}

// Get subscriber profile (for admin)
export function useSubscriberProfile(subscriberId: string) {
  const query = useQuery({
    queryKey: ['newsletter-subscriber', subscriberId],
    queryFn: async () => {
      const response = await fetch(`/api/newsletter/subscribers/${subscriberId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch subscriber profile');
      }

      return response.json() as Promise<NewsletterSubscriber>;
    },
    enabled: !!subscriberId,
  });

  return {
    subscriber: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// Update subscriber preferences
export function useUpdateSubscriberPreferences(options?: UseNewsletterOptions) {
  const mutation = useMutation({
    mutationFn: async ({ subscriberId, tags }: { subscriberId: string; tags: string[] }) => {
      const response = await fetch(`/api/newsletter/subscribers/${subscriberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update preferences');
      }

      return response.json();
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });

  return {
    updatePreferences: mutation.mutate,
    updatePreferencesAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Custom hook for newsletter popup behavior
export function useNewsletterPopup(delay: number = 5000, showAgainAfter: number = 7) {
  const [showPopup, setShowPopup] = useState(false);

  const checkShouldShow = useCallback(() => {
    const lastShown = localStorage.getItem('newsletterPopupLastShown');
    const hasSubscribed = localStorage.getItem('newsletterPopupSubscribed');

    if (hasSubscribed === 'true') {
      return false;
    }

    if (lastShown) {
      const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastShown < showAgainAfter) {
        return false;
      }
    }

    return true;
  }, [showAgainAfter]);

  const dismiss = useCallback(() => {
    setShowPopup(false);
    localStorage.setItem('newsletterPopupLastShown', Date.now().toString());
  }, []);

  const subscribe = useCallback(() => {
    setShowPopup(false);
    localStorage.setItem('newsletterPopupSubscribed', 'true');
  }, []);

  return {
    showPopup,
    checkShouldShow,
    dismiss,
    subscribe,
    setShowPopup,
  };
}

// Custom hook for newsletter subscription management
export function useNewsletterSubscription() {
  const [email, setEmail] = useState<string | null>(null);

  // Load subscription status from localStorage
  useState(() => {
    const savedEmail = localStorage.getItem('newsletterEmail');
    const isSubscribed = localStorage.getItem('newsletterSubscribed') === 'true';

    if (isSubscribed && savedEmail) {
      setEmail(savedEmail);
    }
  });

  const subscribeMutation = useSubscribeToNewsletter({
    onSuccess: (data) => {
      setEmail(data.email);
    },
  });

  const unsubscribeMutation = useUnsubscribeFromNewsletter();

  return {
    email,
    isSubscribed: !!email,
    subscribe: subscribeMutation.subscribe,
    unsubscribe: (token: string) => {
      if (email) {
        unsubscribeMutation.unsubscribe({ email, token });
      }
    },
    isLoading: subscribeMutation.isLoading || unsubscribeMutation.isLoading,
    error: subscribeMutation.error || unsubscribeMutation.error,
  };
}
