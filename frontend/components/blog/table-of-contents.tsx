'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, List } from 'lucide-react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Extract headings from the document
    const elements = Array.from(
      document.querySelectorAll('article h2, article h3, article h4')
    );

    const items: TocItem[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    }));

    setHeadings(items);

    // Add IDs to headings if they don't have them
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `heading-${index}`;
      }
    });
  }, []);

  useEffect(() => {
    // Intersection Observer to track active heading
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

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Fixed header offset
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

  if (headings.length === 0) {
    return null;
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'fixed right-8 top-32 w-64 z-40 hidden xl:block',
        className
      )}
    >
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-12 top-0 p-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-cyber-cyan hover:text-cyber-pink transition-colors"
      >
        <List size={20} />
      </motion.button>

      {/* TOC Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <ChevronRight size={18} />
              Contents
            </h3>

            <nav className="space-y-2">
              {headings.map((heading) => (
                <motion.button
                  key={heading.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleClick(heading.id)}
                  className={cn(
                    'block w-full text-left transition-all duration-200',
                    'hover:text-cyber-pink',
                    activeId === heading.id
                      ? 'text-cyber-cyan font-semibold border-l-2 border-cyber-cyan pl-3'
                      : 'text-gray-400 pl-4',
                    heading.level === 3 && 'pl-8 text-sm',
                    heading.level === 4 && 'pl-12 text-xs'
                  )}
                  style={{
                    paddingLeft: `${heading.level * 0.75}rem`,
                  }}
                >
                  {heading.text}
                </motion.button>
              ))}
            </nav>

            {/* Progress indicator */}
            <div className="mt-4 pt-4 border-t border-cyber-cyan/20">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Reading Progress</span>
                <span>
                  {Math.round(
                    (headings.findIndex((h) => h.id === activeId) /
                      headings.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-1 bg-cyber-dark rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(headings.findIndex((h) => h.id === activeId) / headings.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neon glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-lg blur -z-10"
        animate={{
          opacity: isCollapsed ? 0 : 0.5,
        }}
      />
    </motion.aside>
  );
}

// Hook to use TOC in blog posts
export function useTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('article h2, article h3, article h4')
    );

    const items: TocItem[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    }));

    setHeadings(items);
  }, []);

  return headings;
}
