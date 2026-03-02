'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileDiff, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DiffChange {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber?: number;
}

export interface DocumentDiffProps {
  originalContent: string;
  modifiedContent: string;
  fileName?: string;
  showLineNumbers?: boolean;
  inlineView?: boolean;
  showStats?: boolean;
  className?: string;
}

// 简单的行差异算法（用于演示）
const computeDiff = (original: string, modified: string): DiffChange[] => {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  const diff: DiffChange[] = [];

  let origIndex = 0;
  let modIndex = 0;

  while (origIndex < originalLines.length || modIndex < modifiedLines.length) {
    const origLine = originalLines[origIndex];
    const modLine = modifiedLines[modIndex];

    if (origLine === modLine) {
      diff.push({
        type: 'unchanged',
        content: origLine || '',
        lineNumber: origIndex + 1,
      });
      origIndex++;
      modIndex++;
    } else {
      // 检查是否是删除
      if (origLine && !modifiedLines.includes(origLine)) {
        diff.push({
          type: 'removed',
          content: origLine,
          lineNumber: origIndex + 1,
        });
        origIndex++;
      }
      // 检查是否是添加
      else if (modLine && !originalLines.includes(modLine)) {
        diff.push({
          type: 'added',
          content: modLine,
          lineNumber: modIndex + 1,
        });
        modIndex++;
      }
      // 都不相同，视为替换
      else {
        if (origLine) {
          diff.push({
            type: 'removed',
            content: origLine,
            lineNumber: origIndex + 1,
          });
          origIndex++;
        }
        if (modLine) {
          diff.push({
            type: 'added',
            content: modLine,
            lineNumber: modIndex + 1,
          });
          modIndex++;
        }
      }
    }
  }

  return diff;
};

export const DocumentDiff: React.FC<DocumentDiffProps> = ({
  originalContent,
  modifiedContent,
  fileName = 'document.txt',
  showLineNumbers = true,
  inlineView = true,
  showStats = true,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'inline' | 'side-by-side'>(
    inlineView ? 'inline' : 'side-by-side'
  );
  const [showUnchanged, setShowUnchanged] = useState(true);

  // 计算差异
  const diff = useMemo(() => {
    return computeDiff(originalContent, modifiedContent);
  }, [originalContent, modifiedContent]);

  // 统计信息
  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;
    return { added, removed, unchanged, total: diff.length };
  }, [diff]);

  // 过滤后的差异
  const filteredDiff = useMemo(() => {
    return showUnchanged ? diff : diff.filter(d => d.type !== 'unchanged');
  }, [diff, showUnchanged]);

  // 渲染行差异
  const renderDiffLine = (change: DiffChange, index: number) => {
    const typeStyles = {
      added: 'bg-green-500/10 border-l-4 border-green-500',
      removed: 'bg-red-500/10 border-l-4 border-red-500',
      unchanged: 'bg-transparent border-l-4 border-transparent',
    };

    const iconStyles = {
      added: 'text-green-500',
      removed: 'text-red-500',
      unchanged: 'text-gray-600',
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: change.type === 'added' ? -10 : change.type === 'removed' ? 10 : 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-start gap-2 p-2 font-mono text-sm',
          typeStyles[change.type]
        )}
      >
        {/* 行号 */}
        {showLineNumbers && change.lineNumber && (
          <span className="text-gray-500 select-none text-right w-8 flex-shrink-0">
            {change.lineNumber}
          </span>
        )}

        {/* 变更图标 */}
        <span className={cn('flex-shrink-0', iconStyles[change.type])}>
          {change.type === 'added' && '+'}
          {change.type === 'removed' && '-'}
          {change.type === 'unchanged' && ' '}
        </span>

        {/* 内容 */}
        <span className={cn(
          'flex-1 whitespace-pre-wrap break-words',
          change.type === 'added' && 'text-green-400',
          change.type === 'removed' && 'text-red-400 line-through',
          change.type === 'unchanged' && 'text-gray-300'
        )}>
          {change.content || '\u00A0'}
        </span>
      </motion.div>
    );
  };

  // 并排视图
  const renderSideBySide = () => {
    const originalLines = originalContent.split('\n');
    const modifiedLines = modifiedContent.split('\n');
    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* 原始版本 */}
        <div className="space-y-1">
          <div className="p-2 rounded-t-lg bg-red-500/20 border border-red-500/30">
            <h3 className="text-sm font-medium text-red-400">原始版本</h3>
          </div>
          <div className="p-2 rounded-b-lg bg-gray-900/50 border border-gray-700 max-h-96 overflow-y-auto">
            {originalLines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-2 p-1 font-mono text-sm',
                  modifiedLines.includes(line) ? 'text-gray-300' : 'text-red-400 bg-red-500/5'
                )}
              >
                {showLineNumbers && (
                  <span className="text-gray-600 select-none text-right w-8 flex-shrink-0">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1 whitespace-pre-wrap">{line || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 修改版本 */}
        <div className="space-y-1">
          <div className="p-2 rounded-t-lg bg-green-500/20 border border-green-500/30">
            <h3 className="text-sm font-medium text-green-400">修改版本</h3>
          </div>
          <div className="p-2 rounded-b-lg bg-gray-900/50 border border-gray-700 max-h-96 overflow-y-auto">
            {modifiedLines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-2 p-1 font-mono text-sm',
                  originalLines.includes(line) ? 'text-gray-300' : 'text-green-400 bg-green-500/5'
                )}
              >
                {showLineNumbers && (
                  <span className="text-gray-600 select-none text-right w-8 flex-shrink-0">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1 whitespace-pre-wrap">{line || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="flex items-center gap-2">
          <FileDiff className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">{fileName}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
            <button
              onClick={() => setViewMode('inline')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                viewMode === 'inline'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              )}
              title="内联视图"
            >
              内联
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                viewMode === 'side-by-side'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              )}
              title="并排视图"
            >
              并排
            </button>
          </div>

          {/* 显示未修改行 */}
          <button
            onClick={() => setShowUnchanged(!showUnchanged)}
            className={cn(
              'p-1.5 rounded transition-colors',
              showUnchanged
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:bg-gray-700/50'
            )}
            title={showUnchanged ? '隐藏未修改的行' : '显示所有行'}
          >
            {showUnchanged ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      {showStats && (
        <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-800/30 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-500"></span>
            <span className="text-gray-400">添加:</span>
            <span className="text-green-400 font-medium">{stats.added}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-500"></span>
            <span className="text-gray-400">删除:</span>
            <span className="text-red-400 font-medium">{stats.removed}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-600"></span>
            <span className="text-gray-400">未修改:</span>
            <span className="text-gray-300 font-medium">{stats.unchanged}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-gray-400">总计:</span>
            <span className="text-white font-medium">{stats.total}</span>
          </div>
        </div>
      )}

      {/* 差异内容 */}
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        {viewMode === 'inline' ? (
          <div className="max-h-96 overflow-y-auto">
            {filteredDiff.length > 0 ? (
              filteredDiff.map((change, index) => renderDiffLine(change, index))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <EyeOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>没有可显示的差异</p>
              </div>
            )}
          </div>
        ) : (
          renderSideBySide()
        )}
      </div>

      {/* 键盘快捷键提示 */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">V</kbd>
        <span>切换视图</span>
        <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">U</kbd>
        <span>显示/隐藏未修改行</span>
      </div>
    </div>
  );
};

export default DocumentDiff;
