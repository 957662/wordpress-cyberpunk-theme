'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleSummaryGeneratorProps {
  title: string;
  content: string;
  maxLength?: number;
  apiKey?: string;
  onSummaryGenerated?: (summary: string) => void;
  className?: string;
}

export const ArticleSummaryGenerator: React.FC<ArticleSummaryGeneratorProps> = ({
  title,
  content,
  maxLength = 150,
  apiKey,
  onSummaryGenerated,
  className = '',
}) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    if (!content) return;

    setLoading(true);

    try {
      // 简单的摘要生成算法（不依赖外部 API）
      const sentences = content
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 20)
        .slice(0, 5);

      let generatedSummary = sentences.join('. ').trim();

      // 添加省略号如果太长
      if (generatedSummary.length > maxLength) {
        generatedSummary = generatedSummary.substring(0, maxLength - 3) + '...';
      }

      // 确保以句号结尾
      if (generatedSummary && !generatedSummary.endsWith('.')) {
        generatedSummary += '.';
      }

      setSummary(generatedSummary);
      onSummaryGenerated?.(generatedSummary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (content && !summary) {
      generateSummary();
    }
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <div className={`article-summary-generator ${className}`}>
      <div className="bg-gradient-to-r from-cyber-purple/10 to-cyber-cyan/10 border border-cyber-purple/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-purple" />
            <h3 className="text-sm font-semibold text-gray-200">AI Summary</h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateSummary}
              disabled={loading}
              className="p-1.5 hover:bg-cyber-cyan/20 rounded-md transition-colors disabled:opacity-50"
              title="Regenerate"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            {summary && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-1.5 hover:bg-cyber-cyan/20 rounded-md transition-colors"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Generating summary...</span>
          </div>
        ) : summary ? (
          <p className="text-sm text-gray-300 leading-relaxed">
            {summary}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No summary available
          </p>
        )}
      </div>
    </div>
  );
};

// Hook 版本
export const useArticleSummary = (content: string, maxLength: number = 150) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!content) {
      setSummary('');
      return;
    }

    setLoading(true);

    const sentences = content
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20)
      .slice(0, 5);

    let generatedSummary = sentences.join('. ').trim();

    if (generatedSummary.length > maxLength) {
      generatedSummary = generatedSummary.substring(0, maxLength - 3) + '...';
    }

    if (generatedSummary && !generatedSummary.endsWith('.')) {
      generatedSummary += '.';
    }

    setSummary(generatedSummary);
    setLoading(false);
  }, [content, maxLength]);

  return { summary, loading };
};

export default ArticleSummaryGenerator;
