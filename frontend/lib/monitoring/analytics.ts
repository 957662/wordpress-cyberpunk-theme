/**
 * Analytics & Monitoring Utility Functions
 *
 * Provides functions for tracking user behavior, page views, and custom events.
 * Integrates with Google Analytics, Plausible, and custom analytics endpoints.
 */

import { useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface PageViewData {
  title: string;
  path: string;
  referrer?: string;
  customDimensions?: Record<string, string>;
}

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

// ============================================================================
// Configuration
// ============================================================================

const ANALYTICS_CONFIG = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  customEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
  enableTracking: process.env.NODE_ENV === 'production',
};

// ============================================================================
// Page View Tracking
// ============================================================================

/**
 * Track page view
 */
export const trackPageView = (data: PageViewData) => {
  if (!ANALYTICS_CONFIG.enableTracking) return;

  // Google Analytics 4
  if (ANALYTICS_CONFIG.googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: data.title,
      page_location: window.location.href,
      page_path: data.path,
      ...data.customDimensions,
    });
  }

  // Plausible Analytics
  if (ANALYTICS_CONFIG.plausibleDomain && typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('pageview', {
      u: data.path,
      d: ANALYTICS_CONFIG.plausibleDomain,
    });
  }

  // Custom analytics endpoint
  if (ANALYTICS_CONFIG.customEndpoint) {
    fetch(ANALYTICS_CONFIG.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
};

/**
 * Hook to track page views on route changes
 */
export const usePageTracking = (pageTitle?: string) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackView = () => {
      trackPageView({
        title: pageTitle || document.title,
        path: window.location.pathname + window.location.search,
        referrer: document.referrer,
      });
    };

    // Track initial page view
    trackView();

    // Track subsequent route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      setTimeout(trackView, 0);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackView, 0);
    };

    window.addEventListener('popstate', trackView);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', trackView);
    };
  }, [pageTitle]);
};

// ============================================================================
// Event Tracking
// ============================================================================

/**
 * Track custom event
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (!ANALYTICS_CONFIG.enableTracking) return;

  // Google Analytics
  if (ANALYTICS_CONFIG.googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      non_interaction: event.nonInteraction,
    });
  }

  // Plausible Analytics
  if (ANALYTICS_CONFIG.plausibleDomain && typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(event.action, {
      props: {
        category: event.category,
        label: event.label,
        value: event.value,
      },
    });
  }

  // Custom analytics endpoint
  if (ANALYTICS_CONFIG.customEndpoint) {
    fetch(ANALYTICS_CONFIG.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event',
        data: event,
        timestamp: Date.now(),
        url: window.location.href,
      }),
    }).catch(console.error);
  }
};

/**
 * Hook for tracking events
 */
export const useEventTracking = () => {
  return useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);
};

// ============================================================================
// Common Event Helpers
// ============================================================================

/**
 * Track search query
 */
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent({
    category: 'Search',
    action: 'search',
    label: query,
    value: resultsCount,
  });
};

/**
 * Track file download
 */
export const trackDownload = (url: string, filename: string) => {
  trackEvent({
    category: 'Download',
    action: 'click',
    label: filename,
  });
};

/**
 * Track social share
 */
export const trackShare = (platform: string, url: string) => {
  trackEvent({
    category: 'Social',
    action: 'share',
    label: platform,
  });
};

/**
 * Track newsletter signup
 */
export const trackSignup = (method: 'footer' | 'popup' | 'inline') => {
  trackEvent({
    category: 'Newsletter',
    action: 'signup',
    label: method,
  });
};

/**
 * Track comment submission
 */
export const trackComment = (postId: number | string) => {
  trackEvent({
    category: 'Engagement',
    action: 'comment',
    label: String(postId),
  });
};

/**
 * Track link click
 */
export const trackLinkClick = (url: string, label: string) => {
  trackEvent({
    category: 'Outbound',
    action: 'click',
    label: label || url,
  });
};

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * Track Web Vitals
 */
export const trackWebVitals = (metrics: PerformanceMetrics) => {
  if (!ANALYTICS_CONFIG.enableTracking) return;

  // Google Analytics
  if (ANALYTICS_CONFIG.googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
    Object.entries(metrics).forEach(([name, value]) => {
      if (value !== undefined) {
        (window as any).gtag('event', name, {
          event_category: 'Web Vitals',
          value: Math.round(value),
          non_interaction: true,
        });
      }
    });
  }

  // Custom analytics endpoint
  if (ANALYTICS_CONFIG.customEndpoint) {
    fetch(ANALYTICS_CONFIG.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'web-vitals',
        data: metrics,
        timestamp: Date.now(),
        url: window.location.href,
      }),
    }).catch(console.error);
  }
};

// ============================================================================
// Error Tracking
// ============================================================================

/**
 * Track JavaScript error
 */
export const trackError = (error: Error, context?: Record<string, any>) => {
  if (!ANALYTICS_CONFIG.enableTracking) return;

  console.error('Error tracked:', error, context);

  // Google Analytics
  if (ANALYTICS_CONFIG.googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'exception', {
      description: error.message,
      fatal: false,
    });
  }

  // Custom analytics endpoint
  if (ANALYTICS_CONFIG.customEndpoint) {
    fetch(ANALYTICS_CONFIG.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'error',
        data: {
          message: error.message,
          stack: error.stack,
          context,
        },
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
};

// ============================================================================
// User Identification
// ============================================================================

/**
 * Identify user
 */
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (!ANALYTICS_CONFIG.enableTracking) return;

  // Google Analytics
  if (ANALYTICS_CONFIG.googleAnalyticsId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', ANALYTICS_CONFIG.googleAnalyticsId, {
      user_id: userId,
    });
  }

  // Plausible Analytics
  if (ANALYTICS_CONFIG.plausibleDomain && typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('identify', {
      userId,
      ...traits,
    });
  }

  // Custom analytics endpoint
  if (ANALYTICS_CONFIG.customEndpoint) {
    fetch(ANALYTICS_CONFIG.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'identify',
        data: { userId, traits },
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }
};

// ============================================================================
// Consent Management
// ============================================================================

let analyticsConsent = false;

/**
 * Set analytics consent
 */
export const setAnalyticsConsent = (consent: boolean) => {
  analyticsConsent = consent;

  // Google Analytics consent
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: consent ? 'granted' : 'denied',
    });
  }

  // Store consent in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics_consent', String(consent));
  }
};

/**
 * Get analytics consent
 */
export const getAnalyticsConsent = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('analytics_consent');
    if (stored !== null) {
      return stored === 'true';
    }
  }
  return analyticsConsent;
};

/**
 * Initialize consent from storage
 */
export const initializeConsent = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('analytics_consent');
    if (stored !== null) {
      setAnalyticsConsent(stored === 'true');
    }
  }
};
