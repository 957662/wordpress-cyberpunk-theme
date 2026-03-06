'use client';

import React, { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, dracula, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  theme?: 'dark' | 'dracula' | 'light';
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  className?: string;
}

const themes = {
  dark: vscDarkPlus,
  dracula: dracula,
  light: tomorrow,
};

export default function SyntaxHighlighterComponent({
  code,
  language = 'javascript',
  theme = 'dark',
  showLineNumbers = true,
  startingLineNumber = 1,
  className = '',
}: SyntaxHighlighterProps) {
  const themeStyle = useMemo(() => themes[theme], [theme]);

  return (
    <div className={`syntax-highlighter-wrapper ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={themeStyle}
        showLineNumbers={showLineNumbers}
        startingLineNumber={startingLineNumber}
        customStyle={{
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.6',
          margin: 0,
          padding: '1.5rem',
          background: theme === 'dark' ? '#0a0a0f' : undefined,
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// Pre-defined language support
export const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'markdown',
  'bash',
  'sql',
  'docker',
] as const;

export type SupportedLanguage = typeof languages[number];
