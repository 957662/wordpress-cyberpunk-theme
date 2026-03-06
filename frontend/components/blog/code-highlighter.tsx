'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeHighlighter({
  code,
  language = 'typescript',
  className,
  showLineNumbers = true,
}: CodeHighlighterProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={cn('relative group my-6', className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark/80 border border-cyber-cyan/30 rounded-t-lg">
        <span className="text-sm text-cyber-cyan font-mono">{language}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-sm text-cyber-cyan hover:text-cyber-pink transition-colors"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </motion.button>
      </div>

      {/* Code block */}
      <div className="relative overflow-x-auto bg-cyber-dark/95 border border-cyber-cyan/30 border-t-0 rounded-b-lg">
        <pre
          className={cn(
            '!m-0 !p-4 !bg-transparent',
            showLineNumbers && 'line-numbers'
          )}
        >
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>

      {/* Neon glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </div>
  );
}

// Helper function to extract code from markdown code blocks
export function extractCodeFromMarkdown(markdown: string): Array<{
  code: string;
  language: string;
}> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeBlocks: Array<{ code: string; language: string }> = [];

  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    codeBlocks.push({
      code: match[2].trim(),
      language: match[1] || 'typescript',
    });
  }

  return codeBlocks;
}
