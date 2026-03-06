'use client';

import React, { useMemo } from 'react';
import { diffLines } from 'diff';

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  language?: string;
  filename?: string;
  className?: string;
}

interface DiffLine {
  added?: boolean;
  removed?: boolean;
  value: string;
}

export default function DiffViewer({
  oldCode,
  newCode,
  language = 'text',
  filename,
  className = '',
}: DiffViewerProps) {
  const diff = useMemo(() => {
    return diffLines(oldCode, newCode);
  }, [oldCode, newCode]);

  const getLineClass = (line: DiffLine): string => {
    if (line.added) return 'bg-green-500/20';
    if (line.removed) return 'bg-red-500/20';
    return '';
  };

  const getLineNumber = (index: number, line: DiffLine): string => {
    if (line.added) return '+';
    if (line.removed) return '-';
    return ' ';
  };

  return (
    <div className={`diff-viewer ${className}`}>
      {/* Header */}
      {filename && (
        <div className="px-4 py-2 bg-gray-900/50 border-b border-cyber-cyan/20 rounded-t-lg">
          <span className="text-sm text-gray-400 font-mono">{filename}</span>
        </div>
      )}

      {/* Diff Content */}
      <div className="overflow-auto bg-gray-950 rounded-b-lg">
        <pre className="text-sm font-mono">
          {diff.map((line, index) => {
            const lineClass = getLineClass(line);
            const linePrefix = getLineNumber(index, line);

            return (
              <div
                key={index}
                className={`flex ${lineClass} hover:bg-opacity-30 transition-colors`}
              >
                <span className="inline-block w-8 text-right pr-3 text-gray-600 select-none">
                  {linePrefix}
                </span>
                <code className="flex-1">{line.value || '\u00a0'}</code>
              </div>
            );
          })}
        </pre>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/20 rounded" />
          <span>Added</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/20 rounded" />
          <span>Removed</span>
        </div>
      </div>
    </div>
  );
}
