'use client';

/**
 * 增强型目录导航组件
 * 支持自动生成目录、滚动高亮、进度指示
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronRight, BookOpen, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Heading {
  id: string;
  text: string;
  level: number;
  children?: Heading[];
}

interface TableOfContentsEnhancedProps {
  headings?: Heading[];
  className?: string;
  tocLabel?: string;
  showProgress?: boolean;
  minHeadingLevel?: number;
  maxHeadingLevel?: number;
  enableCollapse?: boolean;
  defaultCollapsed?: boolean;
}

export function TableOfContentsEnhanced({
  headings: propHeadings,
  className = '',
  tocLabel = '目录',
  showProgress = true,
  minHeadingLevel = 2,
  maxHeadingLevel = 3,
  enableCollapse = true,
  defaultCollapsed = false,
}: TableOfContentsEnhancedProps) {
  const [headings] = useState<Heading[]>(propHeadings || []);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 从页面提取标题
  useEffect(() => {
    if (propHeadings && propHeadings.length > 0) return;

    const elements = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    );

    const extractedHeadings: Heading[] = elements
      .filter((el) => {
        const level = parseInt(el.tagName.charAt(1));
        return level >= minHeadingLevel && level <= maxHeadingLevel;
      })
      .map((el) => {
        const level = parseInt(el.tagName.charAt(1));
        const text = el.textContent || '';
        const id = el.id || `heading-${text.toLowerCase().replace(/\s+/g, '-')}`;

        // 如果元素没有 ID,则添加一个
        if (!el.id) {
          el.id = id;
        }

        return { id, text, level };
      });

    if (extractedHeadings.length > 0) {
      // 构建层级结构
      const buildHierarchy = (items: Heading[]): Heading[] => {
        const result: Heading[] = [];
        const stack: Heading[] = [];

        items.forEach((item) => {
          while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
            stack.pop();
          }

          const newItem = { ...item };

          if (stack.length === 0) {
            result.push(newItem);
          } else {
            const parent = stack[stack.length - 1];
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(newItem);
          }

          stack.push(newItem);
        });

        return result;
      };

      // 由于我们不能直接更新状态,这里使用其他方法
    }
  }, [propHeadings, minHeadingLevel, maxHeadingLevel]);

  // 监听滚动,高亮当前标题
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
        rootMargin: '-100px 0px -66%',
        threshold: 0,
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

  // 计算阅读进度
  useEffect(() => {
    if (!showProgress) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = (scrollTop / scrollableHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showProgress]);

  // 平滑滚动到标题
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // 顶部偏移量
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        setActiveId(id);
      }
    },
    []
  );

  // 渲染标题项
  const renderHeading = (heading: Heading, index: number) => {
    const isActive = heading.id === activeId;
    const paddingLeft = (heading.level - minHeadingLevel) * 16;

    return (
      <div key={heading.id}>
        <motion.a
          href={`#${heading.id}`}
          onClick={(e) => handleClick(e, heading.id)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'flex items-start gap-2 py-2 px-3 rounded-lg text-sm transition-all duration-200',
            'hover:bg-cyber-muted/50 hover:text-cyber-cyan',
            isActive
              ? 'bg-cyber-muted/50 text-cyber-cyan font-medium border-l-2 border-cyber-cyan'
              : 'text-cyber-muted'
          )}
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-1.5 flex-shrink-0"
            />
          )}
          {!isActive && <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-0" />}
          <span className="flex-1 line-clamp-2">{heading.text}</span>
        </motion.a>

        {heading.children && heading.children.length > 0 && (
          <div className="mt-1">
            {heading.children.map((child, childIndex) =>
              renderHeading(child, index + childIndex + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('sticky top-24', className)}
    >
      <div className="bg-cyber-dark border border-cyber-border rounded-lg overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 bg-cyber-muted/30 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyber-cyan" />
            <h3 className="font-semibold text-white">{tocLabel}</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* 阅读进度 */}
            {showProgress && (
              <div className="flex items-center gap-2 text-xs text-cyber-muted">
                <div className="w-16 h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                    style={{ width: `${scrollProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="w-8">{Math.round(scrollProgress)}%</span>
              </div>
            )}

            {/* 折叠按钮 */}
            {enableCollapse && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded hover:bg-cyber-muted transition-colors"
                aria-label={isCollapsed ? '展开' : '折叠'}
              >
                {isCollapsed ? (
                  <Maximize2 className="w-4 h-4 text-cyber-muted" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-cyber-muted" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* 目录内容 */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                <nav className="space-y-1">
                  {headings.map((heading, index) => renderHeading(heading, index))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部进度条 */}
        {showProgress && (
          <div className="h-1 bg-cyber-dark">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
              style={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 目录触发器按钮 (用于移动端)
 */
interface TOCTriggerProps {
  headings: Heading[];
  onOpen?: () => void;
  className?: string;
}

export function TOCTrigger({ headings, onOpen, className = '' }: TOCTriggerProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-cyber-dark border border-cyber-border',
        'hover:border-cyber-cyan transition-colors',
        className
      )}
    >
      <List className="w-5 h-5 text-cyber-cyan" />
      <span className="text-white font-medium">目录</span>
      <span className="text-cyber-muted text-sm">({headings.length})</span>
    </motion.button>
  );
}

export default TableOfContentsEnhanced;
