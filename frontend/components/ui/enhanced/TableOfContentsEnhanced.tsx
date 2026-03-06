'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsEnhancedProps {
  content: string;
  className?: string;
  stickToTop?: boolean;
  offsetTop?: number;
}

const TableOfContentsEnhanced: React.FC<TableOfContentsEnhancedProps> = ({
  content,
  className = '',
  stickToTop = true,
  offsetTop = 80,
}) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Parse headings from content
  useEffect(() => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const items: TocItem[] = Array.from(headingElements).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setHeadings(items);

    // Add IDs to headings in the actual content
    const contentElement = document.querySelector('.prose, .markdown, article');
    if (contentElement) {
      const actualHeadings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      actualHeadings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
      });
    }
  }, [content]);

  // Intersection Observer for active heading
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
        rootMargin: `-${offsetTop}px 0px -80% 0px`,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, offsetTop]);

  // Sticky effect
  useEffect(() => {
    if (!stickToTop) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > offsetTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickToTop, offsetTop]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offsetTop;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`table-of-contents-enhanced ${className} ${isSticky ? 'sticky' : ''}`}
      style={{
        position: stickToTop ? 'sticky' : 'relative',
        top: stickToTop ? `${offsetTop}px` : 'auto',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        className="toc-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(157, 0, 255, 0.1) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '8px',
          cursor: 'pointer',
          userSelect: 'none',
          marginBottom: isCollapsed ? '0' : '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📑</span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contents
          </span>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: '12px', color: '#00f0ff' }}
        >
          ▼
        </motion.div>
      </div>

      {/* TOC List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="toc-list"
            style={{
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '8px',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{
                    marginLeft: `${(heading.level - 1) * 16}px`,
                    marginBottom: '8px',
                  }}
                >
                  <motion.a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`toc-item ${activeId === heading.id ? 'active' : ''}`}
                    style={{
                      display: 'block',
                      padding: '6px 12px',
                      fontSize: '13px',
                      color: activeId === heading.id ? '#00f0ff' : 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      borderLeft: `2px solid ${activeId === heading.id ? '#00f0ff' : 'transparent'}`,
                      background: activeId === heading.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                      borderRadius: '0 4px 4px 0',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    whileHover={{ x: 4 }}
                  >
                    {heading.text}
                    {activeId === heading.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          background: 'linear-gradient(180deg, #00f0ff 0%, #9d00ff 100%)',
                          boxShadow: '0 0 10px #00f0ff',
                        }}
                      />
                    )}
                  </motion.a>
                </li>
              ))}
            </ul>

            {/* Progress Indicator */}
            <div
              className="toc-progress"
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(0, 240, 255, 0.2)',
                fontSize: '11px',
                color: '#00f0ff',
                opacity: 0.7,
                textAlign: 'center',
              }}
            >
              {activeId ? (
                <>
                  Reading: {headings.find(h => h.id === activeId)?.text}
                </>
              ) : (
                'Scroll to track progress'
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .table-of-contents-enhanced {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .table-of-contents-enhanced.sticky {
          backdrop-filter: blur(10px);
        }

        .toc-item {
          position: relative;
          transition: all 0.2s ease;
        }

        .toc-item:hover {
          color: #00f0ff !important;
          background: rgba(0, 240, 255, 0.05);
        }

        .toc-item.active {
          font-weight: 600;
        }

        /* Custom Scrollbar */
        .table-of-contents-enhanced ::-webkit-scrollbar {
          width: 4px;
        }

        .table-of-contents-enhanced ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .table-of-contents-enhanced ::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 2px;
        }

        .table-of-contents-enhanced ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.6);
        }

        /* Gradient Fade at Bottom */
        .toc-list::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
          pointer-events: none;
        }
      `}</style>
    </motion.nav>
  );
};

export default TableOfContentsEnhanced;
