/**
 * Code Diff Viewer Component
 * 代码差异查看器组件
 *
 * 赛博朋克风格的代码对比和差异显示组件
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, GitBranch, ArrowRight } from 'lucide-react';

export interface DiffLine {
  lineNumber: number;
  content: string;
  type: 'added' | 'removed' | 'unchanged' | 'header';
}

interface CodeDiffProps {
  oldCode: string;
  newCode: string;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
  splitView?: boolean;
}

export function CodeDiff({
  oldCode,
  newCode,
  language = 'typescript',
  filename = 'example.ts',
  className = '',
  showLineNumbers = true,
  splitView = false,
}: CodeDiffProps) {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>(
    splitView ? 'split' : 'unified'
  );

  // 计算差异
  const computeDiff = (oldStr: string, newStr: string): DiffLine[] => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    const diff: DiffLine[] = [];

    // 简单的行对行比较（实际应用中应使用更复杂的算法）
    const maxLines = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === newLine) {
        diff.push({
          lineNumber: i + 1,
          content: oldLine || '',
          type: 'unchanged',
        });
      } else {
        if (oldLine !== undefined) {
          diff.push({
            lineNumber: i + 1,
            content: oldLine,
            type: 'removed',
          });
        }
        if (newLine !== undefined && newLine !== oldLine) {
          diff.push({
            lineNumber: i + 1,
            content: newLine,
            type: 'added',
          });
        }
      }
    }

    return diff;
  };

  const diffLines = computeDiff(oldCode, newCode);

  // 统一视图
  const UnifiedView = () => (
    <div className="font-mono text-sm">
      <div className="sticky top-0 bg-cyber-dark/95 backdrop-blur border-b border-cyber-border/50 px-4 py-2 z-10">
        <div className="flex items-center gap-4">
          <GitBranch className="w-4 h-4 text-cyber-cyan" />
          <span className="text-white font-semibold">{filename}</span>
          <div className="flex gap-4 text-xs">
            <span className="text-green-500 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {diffLines.filter(l => l.type === 'added').length} 行添加
            </span>
            <span className="text-red-500 flex items-center gap-1">
              <X className="w-3 h-3" />
              {diffLines.filter(l => l.type === 'removed').length} 行删除
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-cyber-border/30">
        {diffLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: line.type === 'added' ? 20 : line.type === 'removed' ? -20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex group hover:bg-cyber-cyan/5 transition-colors ${
              line.type === 'added' ? 'bg-green-500/10' :
              line.type === 'removed' ? 'bg-red-500/10' :
              ''
            }`}
          >
            {/* 行号 */}
            {showLineNumbers && (
              <div className="flex-shrink-0 w-16 py-2 px-2 text-right text-gray-600 select-none border-r border-cyber-border/30">
                {line.lineNumber}
              </div>
            )}

            {/* 状态图标 */}
            <div className="flex-shrink-0 w-8 py-2 px-2 flex items-center justify-center">
              {line.type === 'added' && (
                <Check className="w-4 h-4 text-green-500" />
              )}
              {line.type === 'removed' && (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>

            {/* 代码内容 */}
            <div className={`flex-1 py-2 px-4 overflow-x-auto whitespace-pre ${
              line.type === 'added' ? 'text-green-400' :
              line.type === 'removed' ? 'text-red-400 line-through opacity-70' :
              'text-gray-300'
            }`}>
              {line.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 分屏视图
  const SplitView = () => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);

    return (
      <div className="font-mono text-sm grid grid-cols-2 divide-x divide-cyber-border/50">
        {/* 旧代码 */}
        <div>
          <div className="sticky top-0 bg-red-500/10 border-b border-cyber-border/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-500" />
              <span className="text-white font-semibold">原始版本</span>
            </div>
          </div>

          <div className="divide-y divide-cyber-border/30">
            {oldLines.map((line, index) => (
              <motion.div
                key={`old-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`flex group hover:bg-red-500/5 transition-colors ${
                  newLines[index] !== line ? 'bg-red-500/10' : ''
                }`}
              >
                {showLineNumbers && (
                  <div className="flex-shrink-0 w-16 py-2 px-2 text-right text-gray-600 select-none">
                    {index + 1}
                  </div>
                )}
                <div className={`flex-1 py-2 px-4 overflow-x-auto whitespace-pre ${
                  newLines[index] !== line ? 'text-red-400 line-through opacity-70' : 'text-gray-300'
                }`}>
                  {line}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 新代码 */}
        <div>
          <div className="sticky top-0 bg-green-500/10 border-b border-cyber-border/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-white font-semibold">新版本</span>
            </div>
          </div>

          <div className="divide-y divide-cyber-border/30">
            {newLines.map((line, index) => (
              <motion.div
                key={`new-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`flex group hover:bg-green-500/5 transition-colors ${
                  oldLines[index] !== line ? 'bg-green-500/10' : ''
                }`}
              >
                {showLineNumbers && (
                  <div className="flex-shrink-0 w-16 py-2 px-2 text-right text-gray-600 select-none">
                    {index + 1}
                  </div>
                )}
                <div className={`flex-1 py-2 px-4 overflow-x-auto whitespace-pre ${
                  oldLines[index] !== line ? 'text-green-400' : 'text-gray-300'
                }`}>
                  {line}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`cyber-card overflow-hidden ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-border/50 bg-cyber-dark/50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">代码差异</h3>
          <span className="text-sm text-gray-400">{filename}</span>
        </div>

        <div className="flex items-center gap-2 bg-cyber-dark/50 rounded-lg p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('unified')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === 'unified'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            统一视图
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('split')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            分屏视图
          </motion.button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="overflow-auto max-h-[600px]">
        <AnimatePresence mode="wait">
          {viewMode === 'unified' ? (
            <motion.div
              key="unified"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <UnifiedView />
            </motion.div>
          ) : (
            <motion.div
              key="split"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SplitView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 统计信息 */}
      <div className="p-4 border-t border-cyber-border/50 bg-cyber-dark/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-gray-400">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span>{diffLines.filter(l => l.type === 'added').length} 行添加</span>
            </span>
            <span className="flex items-center gap-2 text-gray-400">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span>{diffLines.filter(l => l.type === 'removed').length} 行删除</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-cyber-cyan">
            <span className="text-gray-400">总计变更:</span>
            <span className="font-semibold">
              {diffLines.filter(l => l.type !== 'unchanged').length} 行
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 使用示例
export function CodeDiffExample() {
  const oldCode = `// 计算斐波那契数列
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

  const newCode = `// 计算斐波那契数列（优化版）
function fibonacci(n: number, memo: Record<number, number> = {}): number {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(100)); // 现在可以计算更大的数字`;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CodeDiff
        oldCode={oldCode}
        newCode={newCode}
        filename="fibonacci.ts"
        language="typescript"
      />
    </div>
  );
}
