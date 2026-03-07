'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, tomorrow, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '../Button';

interface CodeHighlightEnhancedProps {
  code: string;
  language: string;
  theme?: 'light' | 'dark' | 'dracula' | 'atom';
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  className?: string;
  maxHeight?: string;
}

const themes = {
  light: github,
  dark: vscDarkPlus,
  dracula,
  atom: atomDark,
};

const languageLabels: { [key: string]: string } = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  bash: 'Bash',
  shell: 'Shell',
  tsx: 'TSX',
  jsx: 'JSX',
};

export const CodeHighlightEnhanced: React.FC<CodeHighlightEnhancedProps> = ({
  code,
  language = 'javascript',
  theme = 'dark',
  showLineNumbers = true,
  startingLineNumber = 1,
  className = '',
  maxHeight = '600px',
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'dracula' | 'atom'>(theme);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLanguage = languageLabels[language] || language.toUpperCase();

  return (
    <div className={`code-highlight-enhanced ${className}`} style={{ position: 'relative' }}>
      {/* Header Bar */}
      <div
        className="code-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: 'rgba(0, 240, 255, 0.1)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.3)',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <div className="language-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              padding: '2px 10px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {displayLanguage}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#00f0ff',
              opacity: 0.7,
            }}
          >
            {code.split('\n').length} lines
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Theme Selector */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as any)}
            style={{
              padding: '4px 8px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '4px',
              color: '#00f0ff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="dracula">Dracula</option>
            <option value="atom">Atom</option>
          </select>

          {/* Copy Button */}
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <Button
              variant="ghost"
              size="sm"
              className="copy-btn"
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: '1px solid rgba(0, 240, 255, 0.3)',
              }}
            >
              {copied ? (
                <>
                  <span style={{ marginRight: '4px' }}>✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span style={{ marginRight: '4px' }}>📋</span>
                  Copy
                </>
              )}
            </Button>
          </CopyToClipboard>
        </div>
      </div>

      {/* Code Block */}
      <div
        style={{
          maxHeight,
          overflow: 'auto',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderTop: 'none',
        }}
      >
        <SyntaxHighlighter
          language={language}
          style={themes[selectedTheme]}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
          lineNumberStyle={{
            color: 'rgba(0, 240, 255, 0.5)',
            fontSize: '13px',
            paddingRight: '16px',
            minWidth: '40px',
            textAlign: 'right',
            borderRight: '1px solid rgba(0, 240, 255, 0.2)',
            marginRight: '16px',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Footer Stats */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          borderTop: '1px solid rgba(0, 240, 255, 0.1)',
          fontSize: '11px',
          color: '#00f0ff',
          display: 'flex',
          justifyContent: 'space-between',
          opacity: 0.6,
        }}
      >
        <span>Characters: {code.length}</span>
        <span>Words: {code.split(/\s+/).filter(w => w.length > 0).length}</span>
      </div>

      <style jsx>{`
        .code-highlight-enhanced {
          margin: 16px 0;
          font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        }

        .code-header {
          backdrop-filter: blur(10px);
        }

        .copy-btn:hover {
          background: rgba(0, 240, 255, 0.2);
          border-color: rgba(0, 240, 255, 0.6);
        }

        /* Custom Scrollbar */
        .code-highlight-enhanced ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-highlight-enhanced ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        .code-highlight-enhanced ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
          border-radius: 4px;
        }

        .code-highlight-enhanced ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9d00ff 0%, #00f0ff 100%);
        }

        /* Selection styling */
        .code-highlight-enhanced ::selection {
          background: rgba(0, 240, 255, 0.3);
        }

        /* Line highlight on hover */
        .code-highlight-enhanced :global(.token) {
          transition: all 0.2s ease;
        }

        .code-highlight-enhanced :global(.token:hover) {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CodeHighlightEnhanced;
