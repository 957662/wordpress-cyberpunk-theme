/**
 * BlogContent Component
 * 博客文章内容渲染组件 - 支持markdown、代码高亮、阅读进度
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/clipboard/CopyButton';

export interface BlogContentProps {
  content: string;
  className?: string;
  enableCopyCode?: boolean;
  enableLineNumbers?: boolean;
  onProgress?: (progress: number) => void;
}

export function BlogContent({
  content,
  className,
  enableCopyCode = true,
  enableLineNumbers = false,
  onProgress,
}: BlogContentProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // 阅读进度追踪
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const scrollTop = window.scrollY;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      // 计算阅读进度
      const progress = Math.min(
        100,
        Math.max(
          0,
          ((scrollTop - elementTop + windowHeight) / elementHeight) * 100
        )
      );

      setReadingProgress(progress);
      onProgress?.(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgress]);

  return (
    <div className="relative">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-cyber-border z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 内容容器 */}
      <div
        ref={contentRef}
        className={cn(
          'prose prose-lg dark:prose-invert max-w-none',
          'prose-headings:font-display prose-headings:font-bold',
          'prose-h1:text-4xl prose-h1:text-cyber-cyan prose-h1:mb-6',
          'prose-h2:text-3xl prose-h2:text-cyber-purple prose-h2:mt-12 prose-h2:mb-4',
          'prose-h3:text-2xl prose-h3:text-cyber-pink prose-h3:mt-8 prose-h3:mb-3',
          'prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4',
          'prose-a:text-cyber-cyan prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-cyber-cyan prose-strong:font-semibold',
          'prose-code:text-cyber-pink prose-code:bg-cyber-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-cyber-dark prose-pre:border prose-pre:border-cyber-border',
          'prose-blockquote:border-l-4 prose-blockquote:border-cyber-cyan prose-blockquote:bg-cyber-muted/30 prose-blockquote:py-2 prose-blockquote:px-4',
          'prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2',
          'prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2',
          'prose-li:text-gray-300',
          'prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-cyber-border',
          'prose-hr:border-cyber-border prose-hr:my-8',
          className
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // 代码块渲染
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const codeString = String(children).replace(/\n$/, '');

              return !inline && language ? (
                <div className="relative group">
                  <div className="flex items-center justify-between px-4 py-2 bg-cyber-muted/50 border-b border-cyber-border">
                    <span className="text-xs text-gray-400 font-mono">
                      {language}
                    </span>
                    {enableCopyCode && (
                      <CopyButton
                        content={codeString}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="!mt-0 !rounded-t-none"
                    showLineNumbers={enableLineNumbers}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },

            // 图片渲染
            img({ src, alt, ...props }) {
              return (
                <div className="relative my-8">
                  <motion.img
                    src={src}
                    alt={alt}
                    className="rounded-lg shadow-lg border border-cyber-border"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    {...props}
                  />
                  {alt && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {alt}
                    </p>
                  )}
                </div>
              );
            },

            // 链接渲染
            a({ href, children, ...props }) {
              const isExternal = href?.startsWith('http');
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-cyber-cyan hover:text-cyber-pink transition-colors underline"
                  {...props}
                >
                  {children}
                  {isExternal && (
                    <span className="inline-block ml-1 text-xs">↗</span>
                  )}
                </a>
              );
            },

            // 表格渲染
            table({ children, ...props }) {
              return (
                <div className="overflow-x-auto my-8 rounded-lg border border-cyber-border">
                  <table
                    className="min-w-full divide-y divide-cyber-border"
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              );
            },

            thead({ children, ...props }) {
              return (
                <thead className="bg-cyber-muted/50" {...props}>
                  {children}
                </thead>
              );
            },

            tbody({ children, ...props }) {
              return (
                <tbody className="bg-cyber-dark divide-y divide-cyber-border">
                  {children}
                </tbody>
              );
            },

            tr({ children, ...props }) {
              return (
                <tr className="hover:bg-cyber-muted/20 transition-colors">
                  {children}
                </tr>
              );
            },

            th({ children, ...props }) {
              return (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {children}
                </th>
              );
            },

            td({ children, ...props }) {
              return (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {children}
                </td>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default BlogContent;
