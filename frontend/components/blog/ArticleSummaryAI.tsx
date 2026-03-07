'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSparkles, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * 文章摘要 AI 组件
 *
 * 功能特性:
 * - AI 驱动的文章摘要生成
 * - 支持不同长度的摘要（短/中/长）
 * - 关键点提取
 * - 语音朗读支持
 * - 一键复制
 * - 多语言支持
 *
 * @example
 * ```tsx
 * <ArticleSummaryAI
 *   content={articleContent}
 *   title={articleTitle}
 *   onSummaryGenerated={(summary) => console.log(summary)}
 * />
 * ```
 */

export type SummaryLength = 'short' | 'medium' | 'long';

export interface SummaryPoint {
  id: string;
  text: string;
  importance: number; // 0-1
}

export interface ArticleSummary {
  summary: string;
  keyPoints: SummaryPoint[];
  readingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ArticleSummaryAIProps {
  /** 文章内容 */
  content: string;
  /** 文章标题 */
  title?: string;
  /** 摘要长度 */
  length?: SummaryLength;
  /** 是否显示关键点 */
  showKeyPoints?: boolean;
  /** 是否显示朗读按钮 */
  showTTS?: boolean;
  /** 摘要生成回调 */
  onSummaryGenerated?: (summary: ArticleSummary) => void;
  /** 自定义类名 */
  className?: string;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** 语言 */
  language?: 'zh' | 'en';
}

/**
 * 摘要长度配置
 */
const SUMMARY_LENGTH_CONFIG: Record<SummaryLength, { maxWords: number; label: string }> = {
  short: { maxWords: 50, label: '简短' },
  medium: { maxWords: 100, label: '中等' },
  long: { maxWords: 200, label: '详细' },
};

/**
 * 提取关键点
 */
const extractKeyPoints = (content: string, maxPoints: number = 5): SummaryPoint[] => {
  // 简单的关键点提取算法
  const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
  const keyPoints: SummaryPoint[] = [];

  // 基于句子长度和位置的重要性评分
  sentences.forEach((sentence, index) => {
    if (keyPoints.length >= maxPoints) return;

    const words = sentence.trim().split(/\s+/);
    const importance = Math.min(1, (words.length / 20) * (1 - index / sentences.length));

    keyPoints.push({
      id: `point-${index}`,
      text: sentence.trim(),
      importance,
    });
  });

  // 按重要性排序
  return keyPoints.sort((a, b) => b.importance - a.importance);
};

/**
 * 生成摘要
 */
const generateSummary = (content: string, length: SummaryLength): ArticleSummary => {
  const { maxWords } = SUMMARY_LENGTH_CONFIG[length];
  const sentences = content.split(/[。！？.!?]/).filter(s => s.trim().length > 0);

  let summary = '';
  let wordCount = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/);
    if (wordCount + sentenceWords.length > maxWords) break;

    summary += sentence.trim() + (summary.endsWith('。') ? '' : '。');
    wordCount += sentenceWords.length;
  }

  const keyPoints = extractKeyPoints(content, 5);
  const readingTime = Math.ceil(content.split(/\s+/).length / 200); // 假设 200 词/分钟

  // 简单的难度评估
  const avgWordsPerSentence = content.split(/[。！？.!?]/).reduce((acc, s) => {
    return acc + s.trim().split(/\s+/).length;
  }, 0) / sentences.length;

  let difficulty: ArticleSummary['difficulty'] = 'beginner';
  if (avgWordsPerSentence > 20) difficulty = 'advanced';
  else if (avgWordsPerSentence > 15) difficulty = 'intermediate';

  return {
    summary,
    keyPoints,
    readingTime,
    difficulty,
  };
};

/**
 * 难度标签映射
 */
const DIFFICULTY_LABELS: Record<ArticleSummary['difficulty'], { label: string; color: string }> = {
  beginner: { label: '入门', color: 'text-green-400' },
  intermediate: { label: '中级', color: 'text-yellow-400' },
  advanced: { label: '高级', color: 'text-red-400' },
};

/**
 * ArticleSummaryAI 组件
 */
export const ArticleSummaryAI: React.FC<ArticleSummaryAIProps> = ({
  content,
  title,
  length = 'medium',
  showKeyPoints = true,
  showTTS = true,
  onSummaryGenerated,
  className,
  defaultExpanded = false,
  language = 'zh',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>(length);
  const [summary, setSummary] = useState<ArticleSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateSummaryContent();
  }, [summaryLength, content]);

  /**
   * 生成摘要内容
   */
  const generateSummaryContent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSummary = generateSummary(content, summaryLength);
      setSummary(newSummary);
      setIsGenerating(false);
      onSummaryGenerated?.(newSummary);
    }, 500);
  };

  /**
   * 语音朗读
   */
  const handleSpeak = () => {
    if (!summary) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(summary.summary);
    utterance.lang = language === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  /**
   * 复制摘要
   */
  const handleCopy = async () => {
    if (!summary) return;

    const text = `${title ? `${title}\n\n` : ''}${summary.summary}\n\n关键点：\n${summary.keyPoints.map(p => `• ${p.text}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!summary) {
    return (
      <div className={clsx(
        'bg-[#0a0a0f]/50 border border-cyber-cyan/20 rounded-lg p-6',
        'flex items-center justify-center space-x-3',
        className
      )}>
        <div className="animate-spin">
          <FiRefreshCw className="w-5 h-5 text-cyber-cyan" />
        </div>
        <span className="text-gray-400">正在生成摘要...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg overflow-hidden',
        'hover:border-cyber-cyan/40 transition-colors duration-300',
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer bg-[#1a1a2e]/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiSparkles className="w-5 h-5 text-cyber-purple" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI 摘要</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{summary.readingTime} 分钟阅读</span>
              <span>•</span>
              <span className={clsx(DIFFICULTY_LABELS[summary.difficulty].color)}>
                {DIFFICULTY_LABELS[summary.difficulty].label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {expanded && (
            <>
              {/* 长度选择器 */}
              <div className="flex items-center space-x-1 mr-4">
                {(Object.keys(SUMMARY_LENGTH_CONFIG) as SummaryLength[]).map((l) => (
                  <button
                    key={l}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSummaryLength(l);
                    }}
                    className={clsx(
                      'px-3 py-1 text-sm rounded transition-colors',
                      summaryLength === l
                        ? 'bg-cyber-purple text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    )}
                  >
                    {SUMMARY_LENGTH_CONFIG[l].label}
                  </button>
                ))}
              </div>

              {/* TTS 按钮 */}
              {showTTS && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak();
                  }}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    isSpeaking
                      ? 'bg-cyber-pink/20 text-cyber-pink'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                  title={isSpeaking ? '停止朗读' : '朗读摘要'}
                >
                  <FiSparkles className="w-4 h-4" />
                </motion.button>
              )}

              {/* 复制按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
                title={copied ? '已复制' : '复制摘要'}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </motion.button>
            </>
          )}

          {/* 展开/收起按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700"
          >
            {expanded ? (
              <FiChevronUp className="w-5 h-5" />
            ) : (
              <FiChevronDown className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 space-y-6">
              {/* 摘要内容 */}
              <div>
                <h4 className="text-sm font-semibold text-cyber-cyan mb-3">摘要</h4>
                <p className="text-gray-300 leading-relaxed">{summary.summary}</p>
              </div>

              {/* 关键点 */}
              {showKeyPoints && summary.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-cyber-cyan mb-3">关键点</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point) => (
                      <motion.li
                        key={point.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: parseFloat(point.id.split('-')[1]) * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-cyber-purple" />
                        <p className="text-gray-300 flex-1">{point.text}</p>
                        <div
                          className="flex-shrink-0 w-16 h-1 rounded bg-cyber-purple/30"
                          style={{
                            width: `${point.importance * 100}%`,
                          }}
                        />
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部装饰 */}
      <div className="h-1 bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-pink opacity-50" />
    </motion.div>
  );
};

export default ArticleSummaryAI;
