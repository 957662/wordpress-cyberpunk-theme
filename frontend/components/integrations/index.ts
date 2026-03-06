/**
 * 集成组件导出
 */

export { GitHubProfile } from './GitHubProfile';
export type { GitHubProfileProps } from './GitHubProfile';

export {
  SocialShare,
  FloatingShareButtons,
  InlineShareButtons
} from './SocialShare';
export type {
  SocialShareProps,
  SocialPlatform
} from './SocialShare';

// Analytics
export { GoogleAnalytics } from './GoogleAnalytics';
export {
  trackEvent as trackGAEvent,
  trackPageView as trackGAView,
  setUserProperties,
  setUserId,
  trackException
} from './GoogleAnalytics';

export { UmamiAnalytics } from './UmamiAnalytics';
export {
  trackUmamiEvent,
  trackUmamiPageView,
  identifyUmamiUser
} from './UmamiAnalytics';

export { PlausibleAnalytics, usePlausible, PlausibleEvent } from './PlausibleAnalytics';

// Comments
export { DisqusComments, DisqusCommentCount } from './DisqusComments';
export { GiscusComments, getGiscusConfig, giscusThemes } from './GiscusComments';

// Integrations
export { default as GitHubIntegration } from './GitHubIntegration';
export { default as GitHubRepoCard } from './GitHubRepoCard';
export { default as TwitterTimeline } from './TwitterTimeline';
