'use client';

/**
 * TableOfContents - 文章目录导航组件
 * 自动提取标题，支持滚动高亮
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 提取文章标题
  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h1, h2, h3, h4');
    const items: TocItem[] = Array.from(elements).map((element) => {
      const id = element.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
      if (!element.id) {
        element.id = id;
      }
      return {
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName.substring(1)),
      };
    });

    setHeadings(items);
  }, []);

  // 监听滚动，高亮当前章节
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  // 点击平滑滚动到标题
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
        <Menu className="w-5 h-5 text-cyber-cyan" />
        <span>目录</span>
      </div>

      <nav className="space-y-2">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  'w-full text-left text-sm transition-all duration-200',
                  'hover:text-cyber-cyan',
                  activeId === heading.id
                    ? 'text-cyber-cyan font-medium border-l-2 border-cyber-cyan pl-3'
                    : 'text-gray-400 hover:pl-3 border-l-2 border-transparent pl-3'
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Progress Indicator */}
      {activeId && (
        <div className="pt-4 border-t border-cyber-border">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>正在阅读</span>
            <span className="text-cyber-cyan">
              {headings.find(h => h.id === activeId)?.text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableOfContents;
