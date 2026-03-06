/**
 * Analytics hooks
 */

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDebounce } from '../useDebounce';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface PageViewOptions {
  title?: string;
  customDimensions?: Record<string, string>;
}

/**
 * Track page views
 */
export function usePageTracking(options: PageViewOptions = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedPath = useRef<string>();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    // Only track if the path has changed
    if (trackedPath.current !== url) {
      trackedPath.current = url;

      // Track page view
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: options.title || document.title,
          page_location: window.location.href,
          page_path: pathname,
          ...options.customDimensions
        });
      }
    }
  }, [pathname, searchParams, options]);
}

/**
 * Track custom events
 */
export function useAnalytics() {
  const trackEvent = (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction
      });
    }
  };

  const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: url
      });
    }
  };

  const trackTiming = (category: string, variable: string, value: number, label?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: Math.round(value),
        event_category: category,
        event_label: label
      });
    }
  };

  const trackException = (description: string, fatal = false) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description,
        fatal
      });
    }
  };

  const trackSocial = (network: string, action: string, target: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'social', {
        social_network: network,
        social_action: action,
        social_target: target
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackTiming,
    trackException,
    trackSocial
  };
}

/**
 * Track scroll depth
 */
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 90, 100]) {
  const { trackEvent } = useAnalytics();
  const trackedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.current.has(threshold)) {
          trackedThresholds.current.add(threshold);
          trackEvent({
            category: 'Scroll',
            action: 'Scroll Depth',
            label: `${threshold}%`,
            nonInteraction: true
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds, trackEvent]);
}

/**
 * Track time on page
 */
export function useTimeOnPage() {
  const startTime = useRef(Date.now());
  const { trackTiming } = useAnalytics();

  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTime.current;
      trackTiming('Engagement', 'Time on Page', timeSpent);
    };
  }, [trackTiming]);
}

/**
 * Track outbound links
 */
export function useOutboundLinkTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.hostname !== window.location.hostname) {
        trackEvent({
          category: 'Outbound Link',
          action: 'Click',
          label: link.href
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackEvent]);
}

/**
 * Track file downloads
 */
export function useDownloadTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const extension = link.href.split('.').pop()?.toLowerCase();
        const fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'exe'];

        if (extension && fileExtensions.includes(extension)) {
          trackEvent({
            category: 'Download',
            action: 'File Download',
            label: link.href,
            nonInteraction: true
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackEvent]);
}

/**
 * Track form interactions
 */
export function useFormTracking(formName: string) {
  const { trackEvent } = useAnalytics();

  const trackFormStart = () => {
    trackEvent({
      category: 'Form',
      action: 'Form Start',
      label: formName,
      nonInteraction: true
    });
  };

  const trackFormSubmit = () => {
    trackEvent({
      category: 'Form',
      action: 'Form Submit',
      label: formName
    });
  };

  const trackFormError = (error: string) => {
    trackEvent({
      category: 'Form',
      action: 'Form Error',
      label: `${formName} - ${error}`
    });
  };

  const trackFormComplete = () => {
    trackEvent({
      category: 'Form',
      action: 'Form Complete',
      label: formName
    });
  };

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackFormComplete
  };
}
