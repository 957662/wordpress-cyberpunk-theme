/**
 * TableOfContentsAuto - 自动生成的目录
 * 从文章内容中自动提取标题
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

export interface TableOfContentsAutoProps {
  content: string;
  className?: string;
  maxDepth?: number;
  minWidth?: number;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const TableOfContentsAuto: React.FC<TableOfContentsAutoProps> = ({
  content,
  className,
  maxDepth = 3,
  minWidth = 250,
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 提取标题
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const extractedHeadings: Heading[] = Array.from(headingElements)
      .filter((el) => parseInt(el.tagName[1]) <= maxDepth)
      .map((el, index) => {
        const text = el.textContent || '';
        const level = parseInt(el.tagName[1]);
        const id = `heading-${index}`;

        // 在实际内容中添加 ID
        el.id = id;

        return { id, text, level };
      });

    setHeadings(extractedHeadings);
  }, [content, maxDepth]);

  // 监听滚动，高亮当前标题
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

  // 点击滚动到标题
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // 偏移量，避免被固定头部遮挡
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
        'sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto',
        'bg-deep-black/80 backdrop-blur-sm',
        'border border-cyber-cyan/20 rounded-lg p-4',
        className
      )}
      style={{ minWidth }}
    >
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyber-cyan/20">
        <List className="w-4 h-4 text-cyber-cyan" />
        <h3 className="text-sm font-semibold text-white">目录</h3>
      </div>

      <ul className="space-y-2">
        <AnimatePresence>
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const paddingLeft = (heading.level - 1) * 16;

            return (
              <motion.li
                key={heading.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => handleClick(heading.id)}
                  className={cn(
                    'flex items-start gap-2 text-left w-full',
                    'py-1.5 px-2 rounded transition-all duration-200',
                    'hover:bg-cyber-cyan/10',
                    isActive
                      ? 'text-cyber-cyan bg-cyber-cyan/10 font-medium'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                  style={{ paddingLeft: `${paddingLeft + 8}px` }}
                >
                  {isActive && (
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm line-clamp-2">{heading.text}</span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.nav>
  );
};

export default TableOfContentsAuto;
