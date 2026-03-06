'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  term?: string;
  strict?: string;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  theme?: string;
  lang?: string;
  loading?: boolean;
  className?: string;
}

/**
 * Giscus 评论系统集成组件
 * 基于 GitHub Discussions 的评论系统
 */
export const GiscusComments: React.FC<GiscusProps> = ({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  term,
  strict = '0',
  reactionsEnabled = true,
  emitMetadata = true,
  inputPosition = 'bottom',
  theme = 'dark',
  lang = 'en',
  loading = true,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    // 检查是否已加载 Giscus
    const existingScript = document.querySelector('#giscus-script');
    if (existingScript) {
      existingScript.remove();
    }

    // 创建 Giscus 脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', strict);
    script.setAttribute('data-reactions-enabled', String(reactionsEnabled));
    script.setAttribute('data-emit-metadata', String(emitMetadata));
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-loading', String(loading));
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    script.id = 'giscus-script';

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      console.error('Failed to load Giscus');
      setIsLoading(false);
    };

    ref.current.appendChild(script);

    return () => {
      if (ref.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    term,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    theme,
    lang,
    loading
  ]);

  return (
    <div
      ref={ref}
      className={cn('giscus-container', className)}
      style={{ minHeight: loading ? '200px' : undefined }}
    >
      {isLoading && loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-cyber-cyan" />
        </div>
      )}
    </div>
  );
};

interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

/**
 * 获取 Giscus 配置的辅助函数
 */
export const getGiscusConfig = async (repo: string): Promise<GiscusConfig> => {
  try {
    const response = await fetch(`https://giscus.app/api/discussions?repo=${repo}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch Giscus config:', error);
    throw error;
  }
};

/**
 * 主题配置对象
 */
export const giscusThemes = {
  light: 'light',
  dark: 'dark',
  dark_dimmed: 'dark_dimmed',
  dark_high_contrast: 'dark_high_contrast',
  dark_tritanopia: 'dark_tritanopia',
  light_high_contrast: 'light_high_contrast',
  light_tritanopia: 'light_tritanopia',
  transparent_dark: 'transparent_dark',
  cobalt: 'cobalt',
  cyberpunk: 'cyberpunk',
  dracula: 'dracula',
  nord: 'nord',
  tokyo_night: 'tokyo_night'
} as const;

export default GiscusComments;
