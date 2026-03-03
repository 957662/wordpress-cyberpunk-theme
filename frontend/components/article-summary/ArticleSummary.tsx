'use client';

/**
 * ArticleSummary - 文章总结组件
 * 使用 AI 生成文章摘要
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

interface ArticleSummaryProps {
  /** 文章内容 */
  content: string;
  /** 自定义样式类名 */
  className?: string;
  /** 默认展开 */
  defaultExpanded?: boolean;
}

interface SummaryData {
  short: string;
  keyPoints: string[];
  takeaways: string[];
}

export function ArticleSummary({
  content,
  className = '',
  defaultExpanded = false,
}: ArticleSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isExpanded && !summary) {
      generateSummary();
    }
  }, [isExpanded]);

  const generateSummary = async () => {
    setIsLoading(true);
    
    // 模拟 AI 生成摘要（实际项目中应该调用 AI API）
    setTimeout(() => {
      const mockSummary: SummaryData = {
        short: '本文详细介绍了相关主题的核心概念和实践方法，适合希望深入了解该领域的开发者阅读。',
        keyPoints: [
          '介绍了核心概念和基本原理',
          '提供了实践案例和最佳实践',
          '分析了常见问题和解决方案',
          '展望了未来发展趋势',
        ],
        takeaways: [
          '掌握关键技术要点和实现方法',
          '了解行业最佳实践和设计模式',
          '学习如何避免常见陷阱和错误',
        ],
      };
      setSummary(mockSummary);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = async () => {
    if (!summary) return;
    
    const text = `
摘要：${summary.short}

关键点：
${summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

主要收获：
${summary.takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`cyber-card ${className}`}>
      {/* 标题栏 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-cyber-cyan/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-cyan/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-cyber-cyan" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">AI 文章摘要</h3>
            <p className="text-sm text-gray-500">
              {isExpanded ? '收起' : '点击展开查看 AI 生成的文章总结'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* 内容区域 */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-cyber-border"
        >
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">AI 正在生成摘要...</p>
                </div>
              </div>
            ) : summary ? (
              <div className="space-y-6">
                {/* 简短摘要 */}
                <div>
                  <h4 className="text-sm font-medium text-cyber-cyan mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    简短摘要
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{summary.short}</p>
                </div>

                {/* 关键点 */}
                <div>
                  <h4 className="text-sm font-medium text-cyber-purple mb-3">关键点</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-cyber-purple/20 text-cyber-purple rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* 主要收获 */}
                <div>
                  <h4 className="text-sm font-medium text-cyber-pink mb-3">主要收获</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {summary.takeaways.map((takeaway, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-cyber-pink">✦</span>
                          <span className="text-sm text-gray-300">{takeaway}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end pt-4 border-t border-cyber-border">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-sm text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制摘要
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ArticleSummary;
