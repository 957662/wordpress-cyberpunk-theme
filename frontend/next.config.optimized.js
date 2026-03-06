/** @type {import('next').NextConfig} */
const nextConfig = {
  // ==================== 图片优化 ====================
  images: {
    // 允许的图片域名
    domains: [
      'localhost',
      'cyberpress.dev',
      'images.cyberpress.dev',
      'cdn.cyberpress.dev',
    ],
    // 支持的图片格式
    formats: ['image/avif', 'image/webp'],
    // 设备尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // 最小化缓存时间（秒）
    minimumCacheTTL: 60,
    // 启用模糊占位符
    placeholder: 'blur',
  },

  // ==================== 编译优化 ====================
  swcMinify: true, // 使用 SWC 压缩
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ==================== 实验性功能 ====================
  experimental: {
    // 优化包导入
    optimizePackageImports: [
      '@/components/ui',
      'lucide-react',
      'framer-motion',
    ],
    // 启用 App Router 优化
    appDir: true,
  },

  // ==================== 压缩优化 ====================
  compress: true, // 启用 gzip 压缩

  // ==================== 生产优化 ====================
  productionBrowserSourceMaps: false, // 不生成 source maps

  // ==================== 输出优化 ====================
  output: 'standalone', // 独立输出模式

  // ==================== 静态文件优化 ====================
  trailingSlash: false, // 不使用尾部斜杠

  // ==================== 性能监控 ====================
  poweredByHeader: false, // 移除 X-Powered-By 头

  // ==================== 重定向 ====================
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // ==================== 重写规则 ====================
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ];
  },

  // ==================== Headers ====================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ==================== Webpack 配置 ====================
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // 框架代码
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // React 库
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                return match ? `lib.${match[1].replace('@', '')}` : 'lib';
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // 共同代码
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
