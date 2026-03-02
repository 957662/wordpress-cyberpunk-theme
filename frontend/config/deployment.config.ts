/**
 * 部署配置文件
 * 用于不同环境的部署配置
 */

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  cdnUrl?: string;
  analyticsId?: string;
  sentryDsn?: string;
  features: {
    enableAnalytics: boolean;
    enableErrorTracking: boolean;
    enablePerformanceMonitoring: boolean;
    enableServiceWorker: boolean;
  };
}

const configs: Record<string, DeploymentConfig> = {
  development: {
    environment: 'development',
    apiUrl: 'http://localhost:8000/api',
    analyticsId: '',
    sentryDsn: '',
    features: {
      enableAnalytics: false,
      enableErrorTracking: false,
      enablePerformanceMonitoring: false,
      enableServiceWorker: false,
    },
  },
  staging: {
    environment: 'staging',
    apiUrl: 'https://staging-api.cyberpress.com/api',
    cdnUrl: 'https://staging-cdn.cyberpress.com',
    analyticsId: 'UA-STAGING-1',
    sentryDsn: 'https://staging@sentry.io/12345',
    features: {
      enableAnalytics: true,
      enableErrorTracking: true,
      enablePerformanceMonitoring: true,
      enableServiceWorker: true,
    },
  },
  production: {
    environment: 'production',
    apiUrl: 'https://api.cyberpress.com/api',
    cdnUrl: 'https://cdn.cyberpress.com',
    analyticsId: 'UA-PRODUCTION-1',
    sentryDsn: 'https://production@sentry.io/12345',
    features: {
      enableAnalytics: true,
      enableErrorTracking: true,
      enablePerformanceMonitoring: true,
      enableServiceWorker: true,
    },
  },
};

export function getConfig(): DeploymentConfig {
  const env = (process.env.NEXT_PUBLIC_ENVIRONMENT || 'development') as keyof typeof configs;
  return configs[env] || configs.development;
}

export default getConfig();
