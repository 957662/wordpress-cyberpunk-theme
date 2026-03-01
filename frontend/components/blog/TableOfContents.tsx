'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('h2, h3, h4')
    ) as HTMLHeadingElement[];

    const newHeadings = elements.map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
    }));

    setHeadings(newHeadings);

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

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`sticky top-24 bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4 ${className}`}
    >
      <h4 className="text-cyan-100 font-bold mb-4">Table of Contents</h4>

      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`text-sm block py-1 transition-colors hover:text-cyan-300 ${
                activeId === heading.id
                  ? 'text-cyan-400 font-semibold border-l-2 border-cyan-400 pl-2'
                  : 'text-cyan-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
