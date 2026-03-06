import { MetadataRoute } from 'next'

/**
 * Web App Manifest
 * 用于 PWA 安装
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CyberPress - 赛博朋克博客平台',
    short_name: 'CyberPress',
    description: '基于 FastAPI + Next.js 的赛博朋克风格博客平台',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#00f0ff',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['blog', 'technology', 'cyberpunk'],
    shortcuts: [
      {
        name: '最新文章',
        short_name: '文章',
        description: '浏览最新博客文章',
        url: '/blog',
        icons: [{ src: '/icons/blog-icon.png', sizes: '96x96' }],
      },
      {
        name: '关于我们',
        short_name: '关于',
        description: '了解 CyberPress',
        url: '/about',
        icons: [{ src: '/icons/about-icon.png', sizes: '96x96' }],
      },
    ],
  }
}
