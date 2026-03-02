'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScroll } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('h2, h3, h4')
    ) as HTMLElement[];

    const newHeadings: Heading[] = elements.map((elem) => ({
      id: elem.id || `heading-${Math.random().toString(36).substr(2, 9)}`,
      text: elem.textContent || '',
      level: parseInt(elem.tagName.charAt(1)),
    }));

    // 给没有 ID 的标题添加 ID
    elements.forEach((elem, index) => {
      if (!elem.id) {
        elem.id = newHeadings[index].id;
      }
    });

    setHeadings(newHeadings);
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
      { rootMargin: '-100px 0px -66%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={`space-y-1 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        目录
      </h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <motion.a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              className={`block text-sm py-1 border-l-2 transition-all ${
                activeId === heading.id
                  ? 'border-cyber-cyan text-cyber-cyan font-medium pl-3'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600 pl-3'
              }`}
              whileHover={{ x: 4 }}
            >
              {heading.text}
            </motion.a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
