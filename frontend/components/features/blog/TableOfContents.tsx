'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocItem[];
  activeId?: string;
  className?: string;
}

export function TableOfContents({ headings, activeId, className }: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Update active heading
            }
          });
        },
        { rootMargin: '-100px 0px -66%' }
      );

      headingElements.forEach((element) => {
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsMobileOpen(false);
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg',
            isMobileOpen
              ? 'bg-cyber-pink hover:bg-cyber-pink/80'
              : 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-black'
          )}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* TOC Container */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'fixed right-4 top-24 z-40 w-72 hidden lg:block',
          className
        )}
      >
        <Card className="bg-cyber-dark/90 backdrop-blur-sm border-cyber-cyan/20 shadow-xl">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer border-b border-cyber-cyan/20"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className="flex items-center gap-2 text-cyber-cyan font-semibold">
              <List className="w-5 h-5" />
              <span>目录</span>
            </div>
            <motion.div
              animate={{ rotate: isCollapsed ? -90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <nav className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <ul className="space-y-2">
                    {headings.map((heading) => {
                      const isActive = activeId === heading.id;
                      const paddingLeft = (heading.level - 1) * 16;

                      return (
                        <motion.li
                          key={heading.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            onClick={() => handleClick(heading.id)}
                            className={cn(
                              'block w-full text-left py-1.5 px-2 rounded text-sm transition-all duration-200 hover:bg-cyber-cyan/10',
                              isActive
                                ? 'text-cyber-cyan font-semibold bg-cyber-cyan/10 border-l-2 border-cyber-cyan'
                                : 'text-gray-400 hover:text-gray-200',
                              heading.level > 2 && 'text-xs'
                            )}
                            style={{ paddingLeft: `${paddingLeft + 8}px` }}
                          >
                            {heading.text}
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Mobile TOC */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="h-full bg-cyber-dark/95 backdrop-blur-sm border-l border-cyber-cyan/20">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/20">
                  <div className="flex items-center gap-2 text-cyber-cyan font-semibold">
                    <List className="w-5 h-5" />
                    <span>目录</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                  <ul className="space-y-2">
                    {headings.map((heading) => {
                      const isActive = activeId === heading.id;
                      const paddingLeft = (heading.level - 1) * 16;

                      return (
                        <li key={heading.id}>
                          <button
                            onClick={() => handleClick(heading.id)}
                            className={cn(
                              'block w-full text-left py-2 px-3 rounded text-sm transition-all duration-200',
                              isActive
                                ? 'text-cyber-cyan font-semibold bg-cyber-cyan/10 border-l-2 border-cyber-cyan'
                                : 'text-gray-400 hover:text-gray-200'
                            )}
                            style={{ paddingLeft: `${paddingLeft + 12}px` }}
                          >
                            {heading.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook to extract headings from content
export function useHeadings(content: string): TocItem[] {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings: TocItem[] = Array.from(headingElements).map((heading) => {
      const element = heading as HTMLElement;
      return {
        id: element.id || `heading-${Math.random().toString(36).substr(2, 9)}`,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
      };
    });

    setHeadings(extractedHeadings);
  }, [content]);

  return headings;
}

// Hook to track active heading
export function useActiveHeading(headings: TocItem[]): string | undefined {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    if (headings.length === 0) return;

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
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

export default TableOfContents;
