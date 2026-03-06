'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  theme = 'dark',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syntaxTheme = theme === 'dark' ? vscDarkPlus : tomorrow;

  return (
    <div className={`relative group ${className}`}>
      {/* Header with filename and copy button */}
      {(filename || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark/80 border border-cyber-cyan/30 rounded-t-lg backdrop-blur-sm">
          {filename && (
            <span className="text-sm font-mono text-cyber-cyan">
              {filename}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-cyber-purple/20 hover:bg-cyber-purple/30 border border-cyber-purple/50 rounded text-cyber-purple transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Code block */}
      <div className="rounded-b-lg overflow-hidden border border-cyber-cyan/30 border-t-0">
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            background: theme === 'dark' ? '#0a0a0f' : '#ffffff',
          }}
          lineNumberStyle={{
            color: '#00f0ff',
            fontSize: '0.875rem',
            paddingRight: '1rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
