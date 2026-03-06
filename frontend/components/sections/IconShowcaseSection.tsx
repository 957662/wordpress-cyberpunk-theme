'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * 图标展示区段组件
 * 用于在页面中展示图标预览
 */
export default function IconShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', count: 70 },
    { id: 'navigation', name: '导航', count: 12 },
    { id: 'functional', name: '功能', count: 25 },
    { id: 'social', name: '社交', count: 7 },
    { id: 'status', name: '状态', count: 10 },
    { id: 'cyber', name: '赛博', count: 8 },
  ];

  return (
    <section className="relative py-20 px-4 bg-cyber-black overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-grid-cyber opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark/50 to-cyber-black"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
              70+ 赛博图标
            </span>
          </h2>
          <p className="text-cyber-gray-200 text-lg max-w-2xl mx-auto">
            完整的赛博朋克风格图标库，支持自定义颜色、尺寸和特效
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-6 py-2 rounded-full border transition-all
                ${
                  activeCategory === category.id
                    ? 'bg-cyber-cyan text-cyber-black border-cyber-cyan neon-glow-cyan'
                    : 'bg-transparent text-cyber-gray-200 border-cyber-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
                }
              `}
            >
              {category.name}
              <span className="ml-2 opacity-70">({category.count})</span>
            </button>
          ))}
        </div>

        {/* 图标预览区 */}
        <div className="bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
            {/* 导航图标 */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">首页</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">搜索</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">菜单</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">博客</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">用户</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">喜欢</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">收藏</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">代码</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-purple" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">GitHub</span>
            </div>

            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 bg-cyber-black rounded-lg flex items-center justify-center group-hover:border group-hover:border-cyber-cyan transition-all">
                <svg className="w-6 h-6 text-cyber-cyan animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-xs text-cyber-gray-300">同步</span>
            </div>
          </div>
        </div>

        {/* 特效展示 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 发光效果 */}
          <div className="bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-cyber-cyan mb-4">霓虹发光</h3>
            <div className="flex flex-wrap gap-4">
              <div className="text-2xl neon-glow-cyan">Cyan</div>
              <div className="text-2xl neon-glow-purple">Purple</div>
              <div className="text-2xl neon-glow-pink">Pink</div>
              <div className="text-2xl neon-glow-yellow">Yellow</div>
            </div>
          </div>

          {/* 渐变效果 */}
          <div className="bg-cyber-dark border border-cyber-purple/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-cyber-purple mb-4">渐变文字</h3>
            <div className="flex flex-wrap gap-4">
              <div className="text-2xl text-gradient-neon">Neon</div>
              <div className="text-2xl text-gradient-heat">Heat</div>
              <div className="text-2xl text-gradient-cyber">Cyber</div>
            </div>
          </div>
        </div>

        {/* CTA 按钮 */}
        <div className="text-center">
          <Link
            href="/icon-gallery"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-neon text-cyber-black font-bold rounded-lg hover:shadow-neon-cyan transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            查看完整图标库
          </Link>
        </div>
      </div>
    </section>
  );
}
