import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'CyberPress Platform',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.com',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    features: {
      analytics: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
      comments: process.env.NEXT_PUBLIC_COMMENTS_ENABLED === 'true',
      search: process.env.NEXT_PUBLIC_SEARCH_ENABLED === 'true',
      newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true',
    },
    theme: {
      defaultTheme: 'dark',
      availableThemes: ['dark', 'neon', 'hologram'],
    },
  };

  return NextResponse.json(config);
}
