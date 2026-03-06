'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisqusCommentsProps {
  shortname: string;
  identifier?: string;
  title?: string;
  url?: string;
  categoryId?: string;
  language?: string;
  className?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Disqus 评论系统集成组件
 */
export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  shortname,
  identifier,
  title,
  url,
  categoryId,
  language = 'en',
  className,
  loadingComponent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    // 只在客户端加载
    if (typeof window === 'undefined') return;

    // 防止重复加载
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: () => {
          if (identifier) {
            this.page.identifier = identifier;
          }
          if (title) {
            this.page.title = title;
          }
          if (url) {
            this.page.url = url;
          }
          if (categoryId) {
            this.page.category_id = categoryId;
          }
          this.language = language;
        }
      });
      setIsLoaded(true);
      return;
    }

    // 加载 Disqus 脚本
    const script = document.createElement('script');
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', Date.now().toString());
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Disqus comments');
    };

    document.head.appendChild(script);

    return () => {
      // 清理
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread && disqusThread.parentNode) {
        disqusThread.innerHTML = '';
      }
    };
  }, [shortname, identifier, title, url, categoryId, language]);

  return (
    <div ref={containerRef} className={cn('disqus-container', className)}>
      {!isLoaded && !loadingComponent && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-cyber-cyan" />
        </div>
      )}
      {!isLoaded && loadingComponent && loadingComponent}
      <div id="disqus_thread" />
    </div>
  );
};

/**
 * Disqus 评论计数组件
 */
interface DisqusCommentCountProps {
  shortname: string;
  identifier?: string;
  url?: string;
  className?: string;
}

export const DisqusCommentCount: React.FC<DisqusCommentCountProps> = ({
  shortname,
  identifier,
  url,
  className
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 加载 Disqus count 脚本
    const script = document.createElement('script');
    script.id = 'dsq-count-scr';
    script.src = `https://${shortname}.disqus.com/count.js`;
    script.async = true;

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('dsq-count-scr');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [shortname]);

  return (
    <span
      className={cn('disqus-comment-count', className)}
      data-disqus-identifier={identifier}
      data-disqus-url={url}
    >
      Comments
    </span>
  );
};

// TypeScript 类型声明
declare global {
  interface Window {
    DISQUS?: {
      reset: (config: any) => void;
    };
  }
}

export default DisqusComments;
