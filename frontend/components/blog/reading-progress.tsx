'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReadingProgressProps {
  className?: string;
  color?: string;
  height?: number;
}

export function ReadingProgress({
  className,
  color = 'from-cyber-cyan to-cyber-purple',
  height = 3,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = documentHeight - windowHeight;
      const progress = scrollTop / trackLength;

      setProgress(Math.min(progress, 1));
    };

    // Throttle the scroll event
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn('fixed top-0 left-0 right-0 z-50', className)}
      style={{ height: `${height}px` }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
        style={{
          width: `${progress * 100}%`,
          background: color.includes('from-') ? undefined : color,
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// Article reading time estimator
interface ArticleReadingTimeProps {
  content: string;
  className?: string;
}

export function ArticleReadingTime({
  content,
  className,
}: ArticleReadingTimeProps) {
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(content);

  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-400', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>{readingTime} min read</span>
    </div>
  );
}

// Scroll progress indicator for table of contents
interface TOCProgressProps {
  className?: string;
}

export function TOCProgress({ className }: TOCProgressProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [sections, setSections] = useState<Array<{ id: string; progress: number }>>([]);

  useEffect(() => {
    const headings = document.querySelectorAll('article h2, article h3, article h4');
    const sectionData = Array.from(headings).map((heading) => ({
      id: heading.id,
      progress: 0,
    }));
    setSections(sectionData);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          const progress = (scrollTop - elementTop + windowHeight / 2) / (rect.height);

          if (progress >= 0 && progress <= 1) {
            setSections((prev) =>
              prev.map((s) =>
                s.id === section.id ? { ...s, progress: Math.max(0, Math.min(1, progress)) } : s
              )
            );
          }
        }
      });

      // Determine active section
      const activeSection = sections.find((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top < windowHeight / 2;
        }
        return false;
      });

      if (activeSection) {
        setActiveSection(activeSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div className={cn('space-y-2', className)}>
      {sections.map((section) => (
        <div key={section.id} className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-cyber-dark/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              initial={{ width: 0 }}
              animate={{ width: `${section.progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span
            className={cn(
              'text-xs transition-colors',
              activeSection === section.id ? 'text-cyber-cyan font-semibold' : 'text-gray-500'
            )}
          >
            {Math.round(section.progress * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}
