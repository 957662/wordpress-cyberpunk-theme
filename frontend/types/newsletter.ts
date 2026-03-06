/**
 * Newsletter Type Definitions
 */

export interface NewsletterSubscription {
  email: string;
  tags?: string[];
  firstName?: string;
  lastName?: string;
  source?: 'popup' | 'widget' | 'section' | 'footer';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tags: string[];
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  metadata?: {
    source?: string;
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  bouncedCount: number;
  newSubscribersThisWeek: number;
  newSubscribersThisMonth: number;
  unsubscribeRate: number;
  averageOpenRate: number;
  averageClickRate: number;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
  };
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSegment {
  id: string;
  name: string;
  description?: string;
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in';
    value: string | string[];
  }[];
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterAutomation {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: 'subscription' | 'date' | 'event';
    config: Record<string, unknown>;
  };
  actions: {
    type: 'send_email' | 'wait' | 'add_tag' | 'remove_tag';
    config: Record<string, unknown>;
  }[];
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterAnalytics {
  period: string;
  subscribers: {
    total: number;
    new: number;
    unsubscribed: number;
    bounced: number;
  };
  engagement: {
    totalOpens: number;
    totalClicks: number;
    averageOpenRate: number;
    averageClickRate: number;
  };
  campaigns: {
    sent: number;
    scheduled: number;
    draft: number;
  };
  growth: {
    current: number;
    previous: number;
    change: number;
    changePercentage: number;
  };
}

export interface NewsletterSettings {
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  defaultSender?: {
    email: string;
    name: string;
  };
  branding?: {
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
    };
    footer?: string;
  };
  features?: {
    doubleOptIn?: boolean;
    welcomeEmail?: boolean;
    goodbyeEmail?: boolean;
    analytics?: boolean;
  };
  limits?: {
    maxSubscribers?: number;
    maxEmailsPerMonth?: number;
  };
}

export interface NewsletterEvent {
  id: string;
  type: 'subscription' | 'unsubscription' | 'open' | 'click' | 'bounce' | 'complaint';
  subscriberId: string;
  subscriberEmail: string;
  campaignId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// API Response Types

export interface SubscribeResponse {
  success: boolean;
  subscriber?: NewsletterSubscriber;
  message?: string;
}

export interface UnsubscribeResponse {
  success: boolean;
  message?: string;
}

export interface CheckStatusResponse {
  subscribed: boolean;
  subscriber?: NewsletterSubscriber;
}

export interface GetSubscribersResponse {
  items: NewsletterSubscriber[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetCampaignsResponse {
  items: NewsletterCampaign[];
  total: number;
}

export interface GetStatsResponse extends NewsletterStats {}

export interface GetAnalyticsResponse {
  daily: NewsletterAnalytics[];
  weekly: NewsletterAnalytics[];
  monthly: NewsletterAnalytics[];
}

// Component Props Types

export interface NewsletterSectionProps {
  className?: string;
  title?: string;
  description?: string;
  successMessage?: string;
  errorMessage?: string;
  placeholder?: string;
  buttonText?: string;
  showTags?: boolean;
  tags?: string[];
}

export interface NewsletterPopupProps {
  delay?: number;
  showAgainAfter?: number;
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export interface NewsletterWidgetProps {
  className?: string;
  compact?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  orientation?: 'horizontal' | 'vertical';
}

// Error Types

export class NewsletterError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'NewsletterError';
  }
}

export const NewsletterErrorCodes = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type NewsletterErrorCode = typeof NewsletterErrorCodes[keyof typeof NewsletterErrorCodes];
