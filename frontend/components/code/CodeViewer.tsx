'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import SyntaxHighlighterComponent, { languages } from './SyntaxHighlighter';

interface CodeViewerProps {
  code: string;
  language?: string;
  filename?: string;
  theme?: 'dark' | 'dracula' | 'light';
  showLineNumbers?: boolean;
  className?: string;
  onCopy?: () => void;
}

export default function CodeViewer({
  code,
  language = 'javascript',
  filename,
  theme = 'dark',
  showLineNumbers = true,
  className = '',
  onCopy,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  }, [code, onCopy]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, filename, language]);

  return (
    <div
      className={`code-viewer relative group ${
        expanded ? 'fixed inset-4 z-50' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-cyber-cyan/20 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="text-sm text-gray-400 ml-2 font-mono">
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className={expanded ? 'flex-1 overflow-auto' : ''}>
        <SyntaxHighlighterComponent
          code={code}
          language={language}
          theme={theme}
          showLineNumbers={showLineNumbers}
        />
      </div>
    </div>
  );
}
