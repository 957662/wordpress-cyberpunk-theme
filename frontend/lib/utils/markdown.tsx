import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from './cn';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn('prose prose-invert max-w-none', className)}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          return !inline && language ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language}
              PreTag="div"
              className="rounded-lg"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className={cn(
                'px-1.5 py-0.5 rounded bg-cyber-muted text-cyber-cyan font-mono text-sm',
                className
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
        a({ node, children, href, ...props }: any) {
          return (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-cyber-cyan hover:text-cyber-pink transition-colors underline"
              {...props}
            >
              {children}
            </a>
          );
        },
        blockquote({ node, children, ...props }: any) {
          return (
            <blockquote
              className="border-l-4 border-cyber-cyan pl-4 py-2 my-4 bg-cyber-cyan/5"
              {...props}
            >
              {children}
            </blockquote>
          );
        },
        h1({ node, children, ...props }: any) {
          return (
            <h1 className="text-4xl font-bold text-white mb-6 mt-8 first:mt-0" {...props}>
              {children}
            </h1>
          );
        },
        h2({ node, children, ...props }: any) {
          return (
            <h2 className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0" {...props}>
              {children}
            </h2>
          );
        },
        h3({ node, children, ...props }: any) {
          return (
            <h3 className="text-2xl font-bold text-white mb-3 mt-4 first:mt-0" {...props}>
              {children}
            </h3>
          );
        },
        ul({ node, children, ...props }: any) {
          return (
            <ul className="list-disc list-inside space-y-2 my-4 text-gray-300" {...props}>
              {children}
            </ul>
          );
        },
        ol({ node, children, ...props }: any) {
          return (
            <ol className="list-decimal list-inside space-y-2 my-4 text-gray-300" {...props}>
              {children}
            </ol>
          );
        },
        img({ node, src, alt, ...props }: any) {
          return (
            <img
              src={src}
              alt={alt}
              className="rounded-lg my-4 w-full h-auto"
              loading="lazy"
              {...props}
            />
          );
        },
        table({ node, children, ...props }: any) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-cyber-border" {...props}>
                {children}
              </table>
            </div>
          );
        },
        thead({ node, children, ...props }: any) {
          return (
            <thead className="bg-cyber-muted" {...props}>
              {children}
            </thead>
          );
        },
        tbody({ node, children, ...props }: any) {
          return (
            <tbody className="divide-y divide-cyber-border" {...props}>
              {children}
            </tbody>
          );
        },
        tr({ node, children, ...props }: any) {
          return <tr className="hover:bg-cyber-muted/50" {...props}>{children}</tr>;
        },
        th({ node, children, ...props }: any) {
          return (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" {...props}>
              {children}
            </th>
          );
        },
        td({ node, children, ...props }: any) {
          return (
            <td className="px-4 py-3 text-sm text-gray-300" {...props}>
              {children}
            </td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default Markdown;
