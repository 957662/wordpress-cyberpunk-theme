'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, List, X } from 'lucide-react';

/**
 * TableOfContents - 文章目录导航组件
 *
 * 功能特性：
 * - 自动扫描文章标题生成目录
 * - 平滑滚动到对应章节
 * - 高亮当前阅读位置
 * - 可折叠侧边栏
 * - 支持多层嵌套标题
 * - 响应式设计
 */

export interface Heading {
  id: string;
  text: string;
  level: number;
  children?: Heading[];
}

export interface TableOfContentsProps {
  /** 目录位置 */
  position?: 'left' | 'right';
  /** 是否固定定位 */
  sticky?: boolean;
  /** 最大显示深度 */
  maxDepth?: number;
  /** 是否显示序号 */
  showNumbers?: boolean;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否默认展开 */
  defaultOpen?: boolean;
  /** 是否在移动端显示 */
  showOnMobile?: boolean;
  /** 标题 */
  title?: string;
  /** 滚动偏移量 */
  scrollOffset?: number;
}

/**
 * 从DOM中提取标题
 */
const extractHeadings = (root: Element, maxDepth: number = 3): Heading[] => {
  const selectors = Array.from({ length: maxDepth }, (_, i) =>
    `article h${i + 1}`
  ).join(', ');

  const headingElements = root.querySelectorAll(selectors);

  const headings: Heading[] = [];
  const stack: Heading[] = [];

  headingElements.forEach((element) => {
    const level = parseInt(element.tagName[1]);
    const id = element.id || `heading-${headings.length}`;
    const text = element.textContent || '';

    if (!element.id) {
      element.id = id;
    }

    const heading: Heading = { id, text, level };

    // 建立层级关系
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(heading);
    } else {
      headings.push(heading);
    }

    stack.push(heading);
  });

  return headings;
};

/**
 * 目录项组件
 */
interface TOCItemProps {
  heading: Heading;
  activeId: string;
  onClick: (id: string) => void;
  showNumbers?: boolean;
  depth?: number;
}

const TOCItem: React.FC<TOCItemProps> = ({
  heading,
  activeId,
  onClick,
  showNumbers = false,
  depth = 0,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = heading.children && heading.children.length > 0;
  const isActive = activeId === heading.id;
  const paddingLeft = depth * 16 + 8;

  return (
    <div className="relative">
      {/* 当前项 */}
      <motion.button
        onClick={() => {
          onClick(heading.id);
          if (hasChildren) setIsOpen(!isOpen);
        }}
        className={cn(
          'w-full text-left py-2 px-3 rounded-lg transition-all duration-200',
          'flex items-center gap-2 group',
          'hover:bg-white/5',
          isActive
            ? 'bg-cyber-cyan/10 text-cyber-cyan font-medium'
            : 'text-gray-400 hover:text-gray-200'
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        {/* 展开/收起图标 */}
        {hasChildren && (
          <motion.span
            className="flex-shrink-0"
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.span>
        )}

        {/* 序号 */}
        {showNumbers && !hasChildren && (
          <span className="flex-shrink-0 text-xs opacity-50">
            {depth + 1}.
          </span>
        )}

        {/* 标题文本 */}
        <span
          className={cn(
            'flex-1 truncate text-sm',
            isActive && 'font-medium'
          )}
        >
          {heading.text}
        </span>

        {/* 活跃指示器 */}
        {isActive && (
          <motion.div
            className="absolute left-0 w-1 h-full bg-cyber-cyan rounded-r"
            layoutId="activeIndicator"
            initial={false}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>

      {/* 子项 */}
      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {heading.children!.map((child) => (
              <TOCItem
                key={child.id}
                heading={child}
                activeId={activeId}
                onClick={onClick}
                showNumbers={showNumbers}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * TableOfContents 主组件
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({
  position = 'right',
  sticky = true,
  maxDepth = 3,
  showNumbers = false,
  className,
  style,
  defaultOpen = true,
  showOnMobile = false,
  title = '目录',
  scrollOffset = 80,
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 提取标题
  useEffect(() => {
    const article = document.querySelector('article');
    if (article) {
      const extractedHeadings = extractHeadings(article, maxDepth);
      setHeadings(extractedHeadings);
    }
  }, [maxDepth]);

  // 滚动监听，高亮当前标题
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('article h1, article h2, article h3');
      let currentId = '';

      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= scrollOffset) {
          currentId = element.id;
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollOffset]);

  // 点击标题滚动
  const handleClickHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      setIsMobileOpen(false); // 移动端点击后关闭
    }
  };

  // 移动端触发器
  const MobileTrigger = () => (
    <motion.button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className={cn(
        'lg:hidden fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-full',
        'bg-cyber-cyan text-black',
        'shadow-lg shadow-cyber-cyan/50',
        'flex items-center justify-center'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isMobileOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <List className="w-6 h-6" />
      )}
    </motion.button>
  );

  if (headings.length === 0) return null;

  return (
    <>
      {/* 移动端触发器 */}
      {showOnMobile && <MobileTrigger />}

      {/* 目录容器 */}
      <motion.div
        initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'hidden lg:block',
          sticky && 'sticky top-24',
          position === 'right' ? 'float-right' : 'float-left',
          'w-64 flex-shrink-0',
          className
        )}
        style={style}
      >
        {/* 桌面端目录 */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          {/* 标题栏 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.span>
          </button>

          {/* 目录列表 */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <nav className="space-y-1">
                  {headings.map((heading) => (
                    <TOCItem
                      key={heading.id}
                      heading={heading}
                      activeId={activeId}
                      onClick={handleClickHeading}
                      showNumbers={showNumbers}
                    />
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 移动端目录 */}
      {showOnMobile && (
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* 遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />

              {/* 移动端面板 */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed right-0 top-0 bottom-0 w-80 z-50"
              >
                <div className="h-full bg-black/95 backdrop-blur-md border-l border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
                    {headings.map((heading) => (
                      <TOCItem
                        key={heading.id}
                        heading={heading}
                        activeId={activeId}
                        onClick={handleClickHeading}
                        showNumbers={showNumbers}
                      />
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

/**
 * 便捷Hook：使用目录
 */
export const useTableOfContents = (maxDepth: number = 3) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const article = document.querySelector('article');
    if (article) {
      const extractedHeadings = extractHeadings(article, maxDepth);
      setHeadings(extractedHeadings);
    }
  }, [maxDepth]);

  return headings;
};

export default TableOfContents;
