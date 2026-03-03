/**
 * 文章目录组件
 * 自动生成文章的目录导航
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface TableOfContentsProps {
  className?: string;
  offset?: number;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({
  className,
  offset = 100,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
    );

    const items: TocItem[] = elements.map((element) => ({
      id: element.id || `heading-${Math.random().toString(36).substr(2, 9)}`,
      text: element.textContent || '',
      level: parseInt(element.tagName.charAt(1)),
    }));

    // 为没有 ID 的标题添加 ID
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = items[index].id;
      }
    });

    setHeadings(items);
  }, []);

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
        rootMargin: `-${offset}px 0px -80% 0px`,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings, offset]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'sticky top-20 space-y-2 overflow-hidden rounded-lg border border-cyber-border/50 bg-card/50 p-4 backdrop-blur-sm',
        className
      )}
    >
      <h3 className="mb-4 font-bold text-foreground">目录</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                'block w-full text-left text-sm transition-colors hover:text-cyber-primary',
                activeId === heading.id
                  ? 'font-medium text-cyber-primary'
                  : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
