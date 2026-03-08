'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Diff, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeComparisonProps {
  originalCode: string;
  modifiedCode: string;
  originalLanguage: string;
  modifiedLanguage: string;
  originalTitle?: string;
  modifiedTitle?: string;
  className?: string;
}

export const CodeComparison: React.FC<CodeComparisonProps> = ({
  originalCode,
  modifiedCode,
  originalLanguage,
  modifiedLanguage,
  originalTitle = 'Original',
  modifiedTitle = 'Modified',
  className,
}) => {
  const [copied, setCopied] = useState<'original' | 'modified' | null>(null);

  const handleCopy = async (code: string, type: 'original' | 'modified') => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CodePane: React.FC<{
    code: string;
    language: string;
    title: string;
    type: 'original' | 'modified';
  }> = ({ code, language, title, type }) => (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/20 bg-deep-black/95">
        <div className="flex items-center gap-2">
          <Diff className="w-4 h-4 text-cyber-cyan" />
          <h4 className="font-mono text-sm text-white">{title}</h4>
          <span className="text-xs font-mono px-2 py-1 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
            {language}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCopy(code, type)}
          className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors"
          title="复制代码"
        >
          {copied === type ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto bg-deep-black/90">
        <code className="text-sm font-mono leading-relaxed text-gray-100">
          {code}
        </code>
      </pre>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-cyber-cyan/20 bg-deep-black/95">
        <div className="text-xs text-gray-500 font-mono">
          {code.split('\n').length} lines · {code.length} characters
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-lg border border-cyber-cyan/30 bg-deep-black/80 backdrop-blur-sm overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Original Code */}
        <CodePane
          code={originalCode}
          language={originalLanguage}
          title={originalTitle}
          type="original"
        />

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink" />

        {/* Modified Code */}
        <CodePane
          code={modifiedCode}
          language={modifiedLanguage}
          title={modifiedTitle}
          type="modified"
        />
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan/0 via-cyber-purple/0 to-cyber-pink/0 rounded-lg blur-xl -z-10" />
    </motion.div>
  );
};

export default CodeComparison;
