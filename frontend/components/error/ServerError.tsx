'use client';

/**
 * 服务器错误页面组件
 */

import Link from 'next/link';

export function ServerError({ title = '服务器错误', message = '服务器遇到了一些问题' }: { title?: string; message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-[120px] font-bold text-cyber-pink leading-none mb-8">500</h1>
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-cyber-muted mb-8">{message}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <button className="px-6 py-3 bg-cyber-cyan text-cyber-dark font-bold rounded hover:bg-cyber-cyan/80 transition-all">
              返回首页
            </button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-cyber-purple text-cyber-purple font-bold rounded hover:bg-cyber-purple/20 transition-all"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerError;
