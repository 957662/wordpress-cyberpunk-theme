'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ArticleContentProps {
  content: string;
  className?: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 解析内容中的标题
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4');

    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setHeadings(extractedHeadings);

    // 监听滚动以更新活动标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* 目录导航 */}
      {headings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-64 max-h-[60vh] overflow-y-auto cyber-card p-4"
        >
          <h4 className="text-cyber-cyan font-orbitron mb-3 text-sm font-bold uppercase tracking-wider">
            目录导航
          </h4>
          <nav>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 text-sm',
                    activeId === heading.id
                      ? 'text-cyber-cyan font-bold neon-glow'
                      : 'text-gray-400 hover:text-cyber-cyan',
                    heading.level > 2 && 'pl-4'
                  )}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}

      {/* 文章内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="prose prose-invert prose-cyber max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
