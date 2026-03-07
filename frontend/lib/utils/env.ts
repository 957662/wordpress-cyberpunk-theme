/**
 * Environment Variables Utility
 *
 * Helper functions for safely accessing environment variables
 */

/**
 * Get required environment variable
 * @throws Error if variable is not defined
 */
export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get optional environment variable with default value
 */
export function getEnvVarOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Get boolean environment variable
 */
export function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
export function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Environment configuration object
 */
export const env = {
  // API Configuration
  wordpressUrl: getEnvVarOrDefault('NEXT_PUBLIC_WORDPRESS_URL', ''),
  wordpressApiVersion: getEnvVarOrDefault('NEXT_PUBLIC_WORDPRESS_API_VERSION', 'wp/v2'),

  // Site Configuration
  siteName: getEnvVarOrDefault('NEXT_PUBLIC_SITE_NAME', 'CyberPress'),
  siteDescription: getEnvVarOrDefault('NEXT_PUBLIC_SITE_DESCRIPTION', 'Cyberpunk Blog Platform'),
  siteUrl: getEnvVarOrDefault('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),

  // Feature Flags
  enableAnalytics: getEnvBool('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
  enableComments: getEnvBool('NEXT_PUBLIC_ENABLE_COMMENTS', true),
  enableSearch: getEnvBool('NEXT_PUBLIC_ENABLE_SEARCH', true),
  enableNewsletter: getEnvBool('NEXT_PUBLIC_ENABLE_NEWSLETTER', true),

  // API Keys
  googleAnalyticsId: getEnvVarOrDefault('NEXT_PUBLIC_GA_ID', ''),

  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // API Timeouts
  apiTimeout: getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 10000),

  // Cache Configuration
  cacheEnabled: getEnvBool('NEXT_PUBLIC_CACHE_ENABLED', true),
  cacheTTL: getEnvNumber('NEXT_PUBLIC_CACHE_TTL', 300000), // 5 minutes
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const requiredVars: Array<keyof typeof env> = [
    'wordpressUrl',
  ];

  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!env[varName]) {
      missing.push(varName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Log environment configuration (development only)
 */
export function logEnvConfig(): void {
  if (env.isDevelopment) {
    console.table({
      'WordPress URL': env.wordpressUrl || 'Not configured',
      'Site Name': env.siteName,
      'Site URL': env.siteUrl,
      'Analytics': env.enableAnalytics,
      'Comments': env.enableComments,
      'Search': env.enableSearch,
      'Newsletter': env.enableNewsletter,
      'Cache': env.cacheEnabled,
    });
  }
}
