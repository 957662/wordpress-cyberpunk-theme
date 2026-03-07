'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, synaxOneLight, atomDark, dracula, tomorrow, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Theme options
const themes = {
  dark: {
    name: 'Dark',
    style: vscDarkPlus,
  },
  atom: {
    name: 'Atom',
    style: atomDark,
  },
  dracula: {
    name: 'Dracula',
    style: dracula,
  },
  light: {
    name: 'Light',
    style: synaxOneLight,
  },
  github: {
    name: 'GitHub',
    style: github,
  },
  tomorrow: {
    name: 'Tomorrow',
    style: tomorrow,
  },
};

export interface CodeHighlightProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  wrapLines?: boolean;
  className?: string;
}

export function CodeHighlight({
  code,
  language = 'javascript',
  filename,
  showLineNumbers = true,
  startingLineNumber = 1,
  wrapLines = false,
  className
}: CodeHighlightProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('dark');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentTheme = themes[selectedTheme];

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark border-b border-cyber-cyan/20">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-sm text-cyber-cyan font-mono">{filename}</span>
          )}
          <span className="px-2 py-0.5 text-xs bg-cyber-purple/20 text-cyber-purple rounded">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as keyof typeof themes)}
            className="px-2 py-1 text-xs bg-cyber-dark border border-cyber-cyan/30 rounded text-gray-300 focus:outline-none focus:border-cyber-cyan"
          >
            {Object.entries(themes).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 p-0 text-gray-400 hover:text-cyber-cyan"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="h-8 w-8 p-0 text-gray-400 hover:text-cyber-cyan"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Block */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={currentTheme.style}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          wrapLines={wrapLines}
          lineNumberStyle={{
            color: '#4a5568',
            fontSize: '0.875rem',
            paddingRight: '1rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.875rem',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
}

// Inline code component
export interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'px-1.5 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple font-mono text-sm border border-cyber-purple/30',
        className
      )}
    >
      {children}
    </code>
  );
}

// Code block with copy button (for markdown rendering)
export interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  // Extract language from className (e.g., "language-javascript")
  const language = className?.replace('language-', '') || 'text';
  const code = typeof children === 'string' ? children : String(children);

  return <CodeHighlight code={code} language={language} />;
}

export default CodeHighlight;
