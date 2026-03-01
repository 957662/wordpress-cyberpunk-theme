/**
 * CyberPress Illustration Showcase
 *
 * 展示所有赛博朋克风格插图素材
 */

'use client';

import React from 'react';
import Image from 'next/image';

const illustrations = [
  {
    name: 'Server Rack',
    file: '/illustrations/server-rack.svg',
    description: '服务器机架插图，展示4U服务器单元和数据流动画',
    usage: '技术架构页、关于页面',
  },
  {
    name: 'Circuit Board',
    file: '/illustrations/circuit-board.svg',
    description: '电路板插图，带节点连接和数据脉冲动画',
    usage: '技术背景、装饰插图',
  },
  {
    name: 'Code Screen',
    file: '/illustrations/code-screen.svg',
    description: '代码终端窗口，带语法高亮和闪烁光标',
    usage: '开发者页面、技术文档',
  },
  {
    name: 'Network Globe',
    file: '/illustrations/network-globe.svg',
    description: '网络地球仪，轨道卫星和数据传输动画',
    usage: '全球化展示、分布式系统',
  },
];

export const IllustrationShowcase: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* 标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-4">
          CyberPress Illustrations
        </h1>
        <p className="text-cyber-gray-200 text-lg">
          赛博朋克风格插图素材展示
        </p>
      </div>

      {/* 插图网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {illustrations.map((illustration) => (
          <div
            key={illustration.name}
            className="group relative bg-cyber-card border border-cyber-border rounded-lg overflow-hidden hover:border-cyber-cyan transition-all duration-300"
          >
            {/* 插图预览 */}
            <div className="relative aspect-[4/3] bg-cyber-black">
              <Image
                src={illustration.file}
                alt={illustration.name}
                fill
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />

              {/* 悬浮发光效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* 插图信息 */}
            <div className="p-6">
              <h3 className="text-2xl font-display font-bold text-cyber-cyan mb-2">
                {illustration.name}
              </h3>
              <p className="text-cyber-gray-300 mb-4">
                {illustration.description}
              </p>

              {/* 使用场景标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {illustration.usage.split('、').map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-cyber-muted text-cyber-purple rounded-full border border-cyber-purple/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 使用代码 */}
              <div className="p-3 bg-cyber-black rounded border border-cyber-border">
                <code className="text-xs text-cyber-gray-400 font-mono">
                  {`<Image src="${illustration.file}" alt="${illustration.name}" width={400} height={300} />`}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logo 展示 */}
      <div className="mt-16">
        <h2 className="text-3xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-yellow mb-8">
          Logo 系列
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 主 Logo */}
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan transition-all duration-300">
            <div className="aspect-[300/80] mb-4 flex items-center justify-center">
              <Image
                src="/logo-main.svg"
                alt="Main Logo"
                width={300}
                height={80}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">Main Logo</h3>
            <p className="text-sm text-cyber-gray-300 mb-3">
              300x80 - 页面头部、品牌展示
            </p>
            <code className="text-xs text-cyber-gray-400 font-mono">
              /logo-main.svg
            </code>
          </div>

          {/* 图标 Logo */}
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-purple transition-all duration-300">
            <div className="aspect-square mb-4 flex items-center justify-center">
              <Image
                src="/logo-favicon.svg"
                alt="Favicon Logo"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-cyber-purple mb-2">Favicon Logo</h3>
            <p className="text-sm text-cyber-gray-300 mb-3">
              64x64 - 浏览器标签、小图标
            </p>
            <code className="text-xs text-cyber-gray-400 font-mono">
              /logo-favicon.svg
            </code>
          </div>

          {/* 方形 Logo */}
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-pink transition-all duration-300">
            <div className="aspect-square mb-4 flex items-center justify-center">
              <Image
                src="/logo-square.svg"
                alt="Square Logo"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-cyber-pink mb-2">Square Logo</h3>
            <p className="text-sm text-cyber-gray-300 mb-3">
              512x512 - 社交媒体头像、应用图标
            </p>
            <code className="text-xs text-cyber-gray-400 font-mono">
              /logo-square.svg
            </code>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-12 p-6 bg-cyber-card border border-cyber-border rounded-lg">
        <h2 className="text-2xl font-display font-bold text-cyber-purple mb-4">
          使用说明
        </h2>
        <div className="space-y-4 text-cyber-gray-200">
          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">使用 Next.js Image 组件</h3>
            <div className="p-4 bg-cyber-black rounded border border-cyber-border">
              <code className="text-sm text-cyber-gray-400 font-mono">
                {`import Image from 'next/image';

// Logo
<Image src="/logo-main.svg" alt="CyberPress" width={300} height={80} />

// 插图
<Image src="/illustrations/server-rack.svg" alt="Server" width={400} height={300} />`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">作为背景使用</h3>
            <div className="p-4 bg-cyber-black rounded border border-cyber-border">
              <code className="text-sm text-cyber-gray-400 font-mono">
                {`<div className="relative">
  <Image
    src="/illustrations/circuit-board.svg"
    alt=""
    fill
    className="object-cover opacity-10"
  />
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</div>`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">响应式使用</h3>
            <div className="p-4 bg-cyber-black rounded border border-cyber-border">
              <code className="text-sm text-cyber-gray-400 font-mono">
                {`<div className="relative w-full h-64 md:h-96">
  <Image
    src="/illustrations/network-globe.svg"
    alt="Network"
    fill
    className="object-contain"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">文件位置</h3>
            <ul className="list-disc list-inside space-y-1 text-cyber-gray-300">
              <li>Logo 文件: <code className="text-cyber-pink">frontend/public/</code></li>
              <li>插图文件: <code className="text-cyber-pink">frontend/public/illustrations/</code></li>
              <li>组件文件: <code className="text-cyber-pink">frontend/components/icons/</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IllustrationShowcase;
