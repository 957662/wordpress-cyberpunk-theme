/**
 * 登录页面
 * 提供登录和注册功能
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';
import { GlitchText } from '@/components/effects/GlitchText';
import { ParticleBackground } from '@/components/effects/ParticleBackground';

export const metadata: Metadata = {
  title: '登录 - CyberPress',
  description: '登录到 CyberPress 平台',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cyber-dark relative overflow-hidden">
      {/* 背景效果 */}
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-transparent to-cyber-purple/5" />

      {/* 内容 */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold font-display mb-4">
            <GlitchText text="CYBERPRESS" />
          </h1>
          <p className="text-gray-400 text-lg">
            欢迎回到未来
          </p>
        </div>

        {/* 认证模态框（默认打开登录） */}
        <Suspense fallback={<div className="text-center text-gray-400">加载中...</div>}>
          <AuthModal
            isOpen={true}
            onClose={() => {}}
            defaultMode="login"
            onSuccess={(user) => {
              // 登录成功后重定向
              if (typeof window !== 'undefined') {
                const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
                window.location.href = callbackUrl || '/admin';
              }
            }}
          />
        </Suspense>

        {/* 底部链接 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>登录即表示您同意我们的</p>
          <div className="flex justify-center gap-2 mt-2">
            <a href="/terms" className="text-cyber-cyan hover:underline">
              服务条款
            </a>
            <span>和</span>
            <a href="/privacy" className="text-cyber-cyan hover:underline">
              隐私政策
            </a>
          </div>
        </div>
      </div>

      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyber-purple/10 rounded-full blur-3xl" />
    </main>
  );
}
