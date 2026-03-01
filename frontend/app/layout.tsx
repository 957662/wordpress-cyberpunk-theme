import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
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
      </body>
    </html>
  );
}
