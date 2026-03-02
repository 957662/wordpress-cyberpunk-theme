import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { PWAInstallPrompt } from '@/components/pwa';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'CyberPress - 赛博朋克博客平台',
    template: '%s | CyberPress',
  },
  description: '一个基于 WordPress + Next.js 的赛博朋克风格博客平台',
  keywords: ['cyberpunk', 'blog', 'wordpress', 'next.js', '赛博朋克'],
  authors: [{ name: 'CyberPress Team' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'CyberPress',
  },
  manifest: '/manifest.json',
  themeColor: '#00f0ff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CyberPress',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-152x152.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <meta name="theme-color" content="#00f0ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        {/* 扫描线效果 */}
        <div className="scanlines fixed inset-0 pointer-events-none z-50" />

        {/* 粒子背景 */}
        <div className="particles-bg" />

        {/* 主内容 */}
        <div className="relative z-10">
          {children}
        </div>

        {/* PWA 安装提示 */}
        <PWAInstallPrompt />

        {/* Service Worker 注册 */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                  (registration) => {
                    console.log('SW registered: ', registration);
                  },
                  (registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
