'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { copyToClipboard } from '@/lib/utils/browser';
import toast, { Toaster } from 'react-hot-toast';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  const handleCopyCode = (code: string) => {
    copyToClipboard(code).then(() => {
      toast.success('代码已复制到剪贴板', {
        style: {
          background: isDark ? '#1a1a2e' : '#ffffff',
          color: isDark ? '#ffffff' : '#1a1a2e',
          border: `2px solid ${isDark ? '#00f0ff' : '#9d00ff'}`,
          borderRadius: '8px',
        },
      });
    });
  };

  const components: Components = {
    // 标题样式
    h1: ({ children, ...props }) => (
      <h1
        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-3xl md:text-4xl font-bold mb-4 mt-8 text-cyan-400 neon-text"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-2xl md:text-3xl font-bold mb-3 mt-6 text-purple-400"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-xl md:text-2xl font-bold mb-2 mt-4 text-pink-400"
        {...props}
      >
        {children}
      </h4>
    ),

    // 段落样式
    p: ({ children, ...props }) => (
      <p
        className="mb-4 leading-relaxed text-gray-300 dark:text-gray-300 text-gray-700"
        {...props}
      >
        {children}
      </p>
    ),

    // 链接样式
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-pink-400 transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-pink-400"
        {...props}
      >
        {children}
      </a>
    ),

    // 列表样式
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="pl-2 before:content-['▹'] before:mr-2 before:text-cyan-400" {...props}>
        {children}
      </li>
    ),

    // 代码块样式
    code: ({ className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');

      // 内联代码
      if (!match) {
        return (
          <code
            className="px-2 py-1 bg-purple-500/20 rounded text-purple-400 font-mono text-sm border border-purple-500/30"
            {...props}
          >
            {children}
          </code>
        );
      }

      // 代码块
      return (
        <div className="relative group mb-6">
          <div className="flex items-center justify-between bg-gray-800/50 px-4 py-2 rounded-t-lg border border-gray-700">
            <span className="text-sm text-gray-400 font-mono">{language}</span>
            <button
              onClick={() => handleCopyCode(codeString)}
              className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              复制
            </button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
            }}
            className="rounded-b-lg"
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    },

    // 引用块样式
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-cyan-400 pl-4 py-2 my-4 bg-cyan-400/10 rounded-r-lg italic text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // 水平线样式
    hr: (props) => (
      <hr
        className="my-8 border-t-2 border-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
        {...props}
      />
    ),

    // 表格样式
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto mb-6">
        <table
          className="min-w-full border-collapse rounded-lg overflow-hidden border border-gray-700"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-gray-700" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="hover:bg-cyan-400/5 transition-colors" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-3 text-left text-cyan-400 font-bold border-b border-gray-700" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-gray-300" {...props}>
        {children}
      </td>
    ),

    // 图片样式
    img: ({ src, alt, ...props }) => (
      <img
        src={src}
        alt={alt}
        className="rounded-lg my-6 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 max-w-full h-auto"
        loading="lazy"
        {...props}
      />
    ),

    // 删除线
    del: ({ children, ...props }) => (
      <del className="text-gray-500 line-through decoration-2 decoration-pink-500" {...props}>
        {children}
      </del>
    ),

    // 强调
    strong: ({ children, ...props }) => (
      <strong className="font-bold text-cyan-400" {...props}>
        {children}
      </strong>
    ),

    // 斜体
    em: ({ children, ...props }) => (
      <em className="italic text-purple-400" {...props}>
        {children}
      </em>
    ),
  };

  return (
    <>
      <div className={`markdown-body prose prose-invert max-w-none ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};

export default MarkdownRenderer;
