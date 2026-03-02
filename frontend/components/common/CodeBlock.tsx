'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  lineNumbers?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxHeight?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title,
  filename,
  lineNumbers = true,
  collapsible = false,
  defaultExpanded = true,
  maxHeight = '500px',
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = title || filename;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('cyber-card overflow-hidden', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-darker border-b border-cyber-border">
        <div className="flex items-center gap-2">
          {displayName && (
            <>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-400 font-mono">{displayName}</span>
            </>
          )}
          {!displayName && (
            <span className="text-xs text-cyber-cyan font-mono uppercase">
              {language}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {collapsible && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-cyber-dark transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-cyber-dark transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Code */}
      {isExpanded && (
        <div
          className="overflow-auto"
          style={{ maxHeight: collapsible ? maxHeight : 'none' }}
        >
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers={lineNumbers}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
            lineNumberStyle={{
              color: '#4b5563',
              marginRight: '1rem',
              fontSize: '0.75rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </motion.div>
  );
};

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export const InlineCode: React.FC<InlineCodeProps> = ({ children, className }) => {
  return (
    <code
      className={cn(
        'px-2 py-1 rounded bg-cyber-dark border border-cyber-border',
        'text-cyber-cyan font-mono text-sm',
        'hover:border-cyber-cyan transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </code>
  );
};

interface CommandBlockProps {
  command: string;
  description?: string;
  copyable?: boolean;
  className?: string;
}

export const CommandBlock: React.FC<CommandBlockProps> = ({
  command,
  description,
  copyable = true,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('cyber-card p-4', className)}>
      {description && (
        <p className="text-sm text-gray-400 mb-2">{description}</p>
      )}
      <div className="flex items-center gap-2 bg-cyber-dark rounded-lg p-3 border border-cyber-border">
        <span className="text-cyber-cyan font-mono text-sm select-all">
          {command}
        </span>
        {copyable && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="ml-auto p-2 rounded hover:bg-cyber-darker transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};
