'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Loader2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISummaryProps {
  content: string;
  className?: string;
}

export function AISummary({ content, className }: AISummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 生成 AI 摘要
  const generateSummary = async () => {
    if (summary) return;

    setIsLoading(true);

    try {
      // 模拟 AI 生成摘要（实际应该调用 AI API）
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 简单的摘要生成逻辑（实际应该使用 AI）
      const plainText = content.replace(/<[^>]*>/g, '');
      const sentences = plainText.split(/[。！？]/).filter(s => s.trim().length > 10);
      const summaryText = sentences.slice(0, 3).join('。') + '。';

      setSummary(summaryText);
    } catch (error) {
      console.error('生成摘要失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换展开/收起
  const toggleExpand = async () => {
    if (!isExpanded && !summary) {
      await generateSummary();
    }
    setIsExpanded(!isExpanded);
  };

  // 复制摘要
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div className={cn('cyber-card overflow-hidden', className)}>
      {/* 标题栏 */}
      <button
        onClick={toggleExpand}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-cyber-cyan/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-bold text-white">AI 智能摘要</h3>
            <p className="text-xs text-gray-500">
              {isExpanded ? '收起摘要' : '点击生成文章摘要'}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* 摘要内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-cyber-border overflow-hidden"
          >
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
                    <p className="text-sm text-gray-400">AI 正在生成摘要...</p>
                  </div>
                </div>
              ) : summary ? (
                <div className="space-y-4">
                  {/* 摘要文本 */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-gray-300 leading-relaxed">{summary}</p>
                  </div>

                  {/* 关键点提取 */}
                  <div className="bg-cyber-darker/50 rounded-lg p-4 border border-cyber-border">
                    <h4 className="text-sm font-medium text-cyber-cyan mb-2">关键要点</h4>
                    <ul className="space-y-2">
                      {extractKeyPoints(summary).map((point, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-cyber-cyan mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between pt-4 border-t border-cyber-border">
                    <p className="text-xs text-gray-500">
                      由 AI 自动生成，仅供参考
                    </p>
                    <button
                      onClick={copySummary}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>复制</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">生成摘要失败，请重试</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 提取关键点的辅助函数
function extractKeyPoints(summary: string): string[] {
  const sentences = summary.split(/[。！？]/).filter(s => s.trim().length > 5);
  return sentences.slice(0, 3);
}

// 内联版本（用于文章详情页）
export function AISummaryInline({ content, className }: AISummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    if (summary) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const plainText = content.replace(/<[^>]*>/g, '');
      const sentences = plainText.split(/[。！？]/).filter(s => s.trim().length > 10);
      const summaryText = sentences.slice(0, 2).join('。') + '。';

      setSummary(summaryText);
    } catch (error) {
      console.error('生成摘要失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 p-4', className)}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {summary ? (
            <div>
              <h4 className="text-sm font-medium text-cyber-purple mb-2">AI 摘要</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-medium text-cyber-purple mb-2">AI 摘要</h4>
              <button
                onClick={generateSummary}
                disabled={isLoading}
                className="text-sm text-gray-400 hover:text-cyber-purple transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </span>
                ) : (
                  '点击生成摘要'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
