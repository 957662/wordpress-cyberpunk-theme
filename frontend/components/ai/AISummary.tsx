'use client';

/**
 * AI Article Summary Component
 * AI 文章摘要组件 - 自动生成文章摘要
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface AISummaryProps {
  content: string;
  className?: string;
  autoGenerate?: boolean;
}

export function AISummary({ content, className = '', autoGenerate = true }: AISummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (autoGenerate && content) {
      generateSummary();
    }
  }, [content, autoGenerate]);

  const generateSummary = async () => {
    setIsGenerating(true);
    // 模拟 AI 生成摘要
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 简单的摘要生成逻辑（实际应调用 AI API）
    const sentences = content.split(/[。！？]/).filter(Boolean);
    const keySentences = sentences.slice(0, 3);
    setSummary(keySentences.join('。') + '。');
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cyber-card p-6 border-2 border-cyber-purple/30 ${className}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-purple/20">
            <Sparkles className="w-5 h-5 text-cyber-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI 摘要</h3>
            <p className="text-xs text-gray-400">智能提取文章要点</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && summary && (
            <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
              {summary}
            </span>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {isGenerating ? (
                <div className="space-y-3">
                  <div className="h-4 bg-cyber-dark rounded animate-pulse" />
                  <div className="h-4 bg-cyber-dark rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-cyber-dark rounded animate-pulse w-1/2" />
                  <p className="text-sm text-gray-400 text-center pt-2">AI 正在生成摘要...</p>
                </div>
              ) : (
                <>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">{summary}</p>
                  </div>

                  {/* Key Points */}
                  <div className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-border">
                    <h4 className="text-sm font-semibold text-cyber-purple mb-3">关键要点</h4>
                    <ul className="space-y-2">
                      {summary.split('。').filter(Boolean).slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyber-purple/20 text-cyber-purple flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span>{point}。</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-cyber-dark border border-cyber-border hover:border-cyber-purple/50 transition-colors text-sm text-gray-400 hover:text-cyber-purple"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-cyber-green" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          复制摘要
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateSummary}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 hover:bg-cyber-purple/30 transition-colors text-sm text-cyber-purple"
                    >
                      <Sparkles className="w-4 h-4" />
                      重新生成
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AISummary;
