'use client';

import React from 'react';
import {
  Logo,
  NeonText,
  CyberGlow,
  CyberBorderGlow,
  HolographicEffect,
  DecorativePattern,
  GlitchEffect
} from '@/components/graphics';
import Image from 'next/image';

/**
 * 图形组件使用示例
 *
 * 这个页面展示了所有图形组件的实际用法
 */
export default function GraphicsDemoPage() {
  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100 p-8">
      {/* 背景装饰图案 */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <DecorativePattern type="grid" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* 页面标题 */}
        <header className="mb-12 text-center">
          <NeonText color="cyan" size="3xl" as="h1">
            CyberPress 图形组件演示
          </NeonText>
          <p className="mt-4 text-cyber-purple">
            赛博朋克风格的图形组件库
          </p>
        </header>

        {/* Logo 演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">Logo 组件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-sm text-gray-400 mb-4">横向 Logo</h3>
              <div className="flex justify-center">
                <Logo variant="horizontal" size={120} />
              </div>
            </div>

            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-sm text-gray-400 mb-4">图标 Logo</h3>
              <div className="flex justify-center">
                <Logo variant="icon" size={80} />
              </div>
            </div>

            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-sm text-gray-400 mb-4">垂直 Logo</h3>
              <div className="flex justify-center">
                <Logo variant="vertical" size={100} />
              </div>
            </div>
          </div>
        </section>

        {/* 霓虹文字演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">霓虹文字</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-cyber-card rounded-lg">
              <NeonText color="cyan" size="xl">
                霓虹青色
              </NeonText>
            </div>
            <div className="p-6 bg-cyber-card rounded-lg">
              <NeonText color="purple" size="xl">
                赛博紫色
              </NeonText>
            </div>
            <div className="p-6 bg-cyber-card rounded-lg">
              <NeonText color="pink" size="xl">
                激光粉色
              </NeonText>
            </div>
            <div className="p-6 bg-cyber-card rounded-lg">
              <NeonText color="yellow" size="xl">
                电压黄色
              </NeonText>
            </div>
            <div className="p-6 bg-cyber-card rounded-lg">
              <NeonText color="green" size="xl">
                霓虹绿色
              </NeonText>
            </div>
            <div className="p-6 bg-cyber-card rounded-lg">
              <NeonText color="cyan" size="xl" intensity="high">
                高强度发光
              </NeonText>
            </div>
          </div>
        </section>

        {/* 发光效果演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">发光效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CyberGlow color="cyan" intensity="medium" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold mb-2">容器发光效果</h3>
              <p className="text-gray-400">
                整个容器都有霓虹发光效果，适合突出重要内容。
              </p>
            </CyberGlow>

            <CyberGlow color="purple" intensity="medium" hover={true} className="p-6 bg-cyber-card rounded-lg cursor-pointer">
              <h3 className="text-lg font-bold mb-2">悬停发光效果</h3>
              <p className="text-gray-400">
                鼠标悬停时才显示发光效果，节省视觉资源。
              </p>
            </CyberGlow>
          </div>
        </section>

        {/* 边框发光演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">边框发光</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CyberBorderGlow color="cyan" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold">青色边框</h3>
            </CyberBorderGlow>
            <CyberBorderGlow color="purple" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold">紫色边框</h3>
            </CyberBorderGlow>
            <CyberBorderGlow color="pink" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold">粉色边框</h3>
            </CyberBorderGlow>
          </div>
        </section>

        {/* 全息效果演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">全息效果</h2>
          <HolographicEffect className="p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-cyber-cyan">
              全息投影卡片
            </h3>
            <p className="text-gray-300 mb-4">
              这是一种具有全息投影效果的卡片，带有半透明背景和发光边框。
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded font-bold hover:opacity-80 transition-opacity">
                确认
              </button>
              <button className="px-4 py-2 border border-cyber-purple text-cyber-purple rounded font-bold hover:bg-cyber-purple hover:text-cyber-dark transition-colors">
                取消
              </button>
            </div>
          </HolographicEffect>
        </section>

        {/* 故障效果演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">故障效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlitchEffect intensity="low" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold">低强度故障</h3>
              <p className="text-sm text-gray-400 mt-2">偶尔出现故障效果</p>
            </GlitchEffect>
            <GlitchEffect intensity="medium" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold">中强度故障</h3>
              <p className="text-sm text-gray-400 mt-2">较频繁的故障效果</p>
            </GlitchEffect>
            <GlitchEffect intensity="high" className="p-6 bg-cyber-card rounded-lg">
              <h3 className="text-lg font-bold">高强度故障</h3>
              <p className="text-sm text-gray-400 mt-2">频繁的故障效果</p>
            </GlitchEffect>
          </div>
        </section>

        {/* 装饰图案演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">装饰图案</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-40 bg-cyber-card rounded-lg overflow-hidden">
              <DecorativePattern type="grid" opacity={0.3} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">网格图案</span>
              </div>
            </div>
            <div className="relative h-40 bg-cyber-card rounded-lg overflow-hidden">
              <DecorativePattern type="circuit" opacity={0.3} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">电路图案</span>
              </div>
            </div>
            <div className="relative h-40 bg-cyber-card rounded-lg overflow-hidden">
              <DecorativePattern type="hexagon" opacity={0.3} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">六边形图案</span>
              </div>
            </div>
            <div className="relative h-40 bg-cyber-card rounded-lg overflow-hidden">
              <DecorativePattern type="dots" opacity={0.3} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">点状图案</span>
              </div>
            </div>
          </div>
        </section>

        {/* SVG 图标演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">赛博朋克图标</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              'cloud-sync',
              'security-lock',
              'code-terminal',
              'dashboard',
              'analytics',
              'api',
              'deployment',
              'database-cluster',
              'ai-neural',
              'optimization'
            ].map((icon) => (
              <div key={icon} className="p-4 bg-cyber-card rounded-lg flex flex-col items-center">
                <Image
                  src={`/icons/cyberpunk/${icon}.svg`}
                  alt={icon}
                  width={32}
                  height={32}
                  className="mb-2"
                />
                <span className="text-xs text-gray-400">{icon}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 插画演示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">插画素材</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cyber-card rounded-lg overflow-hidden">
              <Image
                src="/illustrations/hero-cyber-city.svg"
                alt="赛博城市"
                width={800}
                height={400}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-bold">赛博城市夜景</h3>
                <p className="text-sm text-gray-400">800x400 - 首页 Hero 区域</p>
              </div>
            </div>
            <div className="bg-cyber-card rounded-lg overflow-hidden">
              <Image
                src="/illustrations/server-room.svg"
                alt="服务器机房"
                width={400}
                height={300}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-bold">服务器机房</h3>
                <p className="text-sm text-gray-400">400x300 - 技术页面</p>
              </div>
            </div>
            <div className="bg-cyber-card rounded-lg overflow-hidden">
              <Image
                src="/illustrations/coding-workspace.svg"
                alt="编码工作区"
                width={400}
                height={300}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-bold">编码工作区</h3>
                <p className="text-sm text-gray-400">400x300 - 开发文档</p>
              </div>
            </div>
            <div className="bg-cyber-card rounded-lg overflow-hidden">
              <Image
                src="/illustrations/cloud-storage.svg"
                alt="云存储"
                width={400}
                height={250}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-bold">云存储同步</h3>
                <p className="text-sm text-gray-400">400x250 - 产品功能</p>
              </div>
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="mt-16 pt-8 border-t border-cyber-border text-center text-gray-400">
          <p>CyberPress Platform - 图形组件库演示</p>
          <p className="mt-2 text-sm">版本 2.0.0 | 2026-03-06</p>
        </footer>
      </div>
    </div>
  );
}
