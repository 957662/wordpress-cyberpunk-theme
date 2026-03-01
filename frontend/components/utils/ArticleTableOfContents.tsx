'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, MenuIcon } from '../icons';

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface ArticleTableOfContentsProps {
  content: string;
  className?: string;
  position?: 'left' | 'right';
  offset?: number;
}

export default function ArticleTableOfContents({
  content,
  className = '',
  position = 'right',
  offset = 100,
}: ArticleTableOfContentsProps) {
  const [headings, setHeadings] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 从内容中提取标题
  useEffect(() => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3, h4');

    const items: TableOfContentsItem[] = Array.from(headingElements).map((heading) => {
      const id = heading.textContent
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fa5]/g, '') || `heading-${Math.random().toString(36).substr(2, 9)}`;

      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(items);

    // 为实际页面中的标题添加 ID
    const actualHeadings = document.querySelectorAll('article h2, article h3, article h4');
    actualHeadings.forEach((heading, index) => {
      if (items[index]) {
        heading.id = items[index].id;
      }
    });
  }, [content]);

  // 监听滚动，更新活动标题
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

      const scrollPosition = window.scrollY + offset;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, offset]);

  // 点击标题平滑滚动
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* 桌面端目录 */}
      <motion.div
        initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          hidden lg:block fixed top-24 ${position}-8
          w-64 max-h-[calc(100vh-8rem)] overflow-y-auto
          ${className}
        `}
      >
        <div className="cyber-card">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-cyber-cyan flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              目录导航
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-cyber-cyan/10 transition-colors"
            >
              <ChevronRightIcon
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
              />
            </motion.button>
          </div>

          {/* 目录列表 */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                {headings.map((heading) => (
                  <motion.button
                    key={heading.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleClick(heading.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${heading.level === 2 ? '' : 'ml-4'}
                      ${activeId === heading.id
                        ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-cyber-muted/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {activeId === heading.id && (
                        <div className="w-1 h-1 rounded-full bg-cyber-cyan animate-pulse" />
                      )}
                      <span className="line-clamp-2">{heading.text}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* 进度指示器 */}
          <div className="mt-4 pt-4 border-t border-cyber-border">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>阅读进度</span>
              <span className="font-mono text-cyber-cyan">
                {Math.round((headings.findIndex(h => h.id === activeId) + 1) / headings.length * 100)}%
              </span>
            </div>
            <div className="h-1 bg-cyber-darker rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                initial={{ width: 0 }}
                animate={{
                  width: `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 移动端悬浮按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-24 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple text-white shadow-neon-cyan flex items-center justify-center"
      >
        <MenuIcon className="w-6 h-6" />
      </motion.button>

      {/* 移动端目录抽屉 */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* 抽屉 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-full bg-cyber-dark border-l border-cyber-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* 头部 */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-bold text-cyber-cyan flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                    目录导航
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-cyber-muted transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* 目录列表 */}
                <nav className="space-y-2">
                  {headings.map((heading, index) => (
                    <motion.button
                      key={heading.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        handleClick(heading.id);
                        setIsMobileOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                        ${heading.level === 2 ? '' : 'ml-4'}
                        ${activeId === heading.id
                          ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-cyber-muted/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {activeId === heading.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                        )}
                        <span className="line-clamp-2">{heading.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </nav>

                {/* 进度指示器 */}
                <div className="mt-6 pt-6 border-t border-cyber-border">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>阅读进度</span>
                    <span className="font-mono text-cyber-cyan">
                      {Math.round((headings.findIndex(h => h.id === activeId) + 1) / headings.length * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// 自动提取目录的 Hook
export function useTableOfContents() {
  const [headings, setHeadings] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    const headingElements = document.querySelectorAll('article h2, article h3, article h4');

    const items: TableOfContentsItem[] = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(items);
  }, []);

  return headings;
}
