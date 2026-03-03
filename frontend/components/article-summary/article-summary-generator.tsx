'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  Wand2,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryStyle = 'bullet' | 'paragraph' | 'key-points';

interface SummaryOptions {
  length: SummaryLength;
  style: SummaryStyle;
  includeKeywords?: boolean;
  includeStats?: boolean;
}

interface ArticleSummaryGeneratorProps {
  className?: string;
  articleTitle?: string;
  articleContent?: string;
  onGenerate?: (content: string, options: SummaryOptions) => Promise<string>;
  isLoading?: boolean;
}

const LENGTH_OPTIONS = [
  { value: 'short' as const, label: '简短', description: '1-2 句话' },
  { value: 'medium' as const, label: '中等', description: '3-5 句话' },
  { value: 'long' as const, label: '详细', description: '完整摘要' }
];

const STYLE_OPTIONS = [
  { value: 'paragraph' as const, label: '段落', icon: '📝' },
  { value: 'bullet' as const, label: '列表', icon: '•' },
  { value: 'key-points' as const, label: '要点', icon: '🔑' }
];

export function ArticleSummaryGenerator({
  className,
  articleTitle,
  articleContent = '',
  onGenerate,
  isLoading: externalLoading
}: ArticleSummaryGeneratorProps) {
  const [options, setOptions] = useState<SummaryOptions>({
    length: 'medium',
    style: 'paragraph',
    includeKeywords: true,
    includeStats: false
  });
  const [summary, setSummary] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!articleContent.trim()) return;

    setIsGenerating(true);
    try {
      if (onGenerate) {
        const result = await onGenerate(articleContent, options);
        setSummary(result);
      } else {
        // 模拟生成
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSummary(generateMockSummary(articleContent, options));
      }
    } catch (error) {
      console.error('生成摘要失败:', error);
      setSummary('生成失败，请重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockSummary = (content: string, opts: SummaryOptions): string => {
    const words = content.split(' ');
    const wordCount = words.length;
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    if (opts.style === 'bullet') {
      return `
• 这篇文章主要讨论了 ${sentences[0]?.slice(0, 50) || '核心主题'}
• 文章涵盖了 ${Math.min(sentences.length, 3)} 个主要观点
• 总字数: ${wordCount} 字
• 适合对 ${sentences[0]?.slice(0, 30) || '相关主题'} 感兴趣的读者
      `.trim();
    }

    if (opts.style === 'key-points') {
      return `
🔑 核心观点:
${sentences.slice(0, 3).map((s, i) => `  ${i + 1}. ${s.trim()}`).join('\n')}

📊 文章统计:
  • 字数: ${wordCount}
  • 句数: ${sentences.length}
  • 阅读时间: ${Math.ceil(wordCount / 200)} 分钟

🎯 适合人群: 对相关主题感兴趣的读者
      `.trim();
    }

    // Paragraph style
    const preview = sentences.slice(0, opts.length === 'short' ? 1 : opts.length === 'medium' ? 2 : 4);
    return `本文主要讨论了 ${preview.join('。')}。文章共 ${wordCount} 字，预计阅读时间 ${Math.ceil(wordCount / 200)} 分钟。${opts.includeKeywords ? '\n\n关键词: 技术, 创新, 未来' : ''}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${articleTitle || '摘要'}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      'bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden',
      'shadow-[0_0_40px_rgba(0,240,255,0.1)]',
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-purple-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <FileText className="w-8 h-8 text-cyan-400" />
            <motion.div
              className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI 文章摘要生成器
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              使用 AI 自动生成文章摘要
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Length Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              摘要长度
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOptions({ ...options, length: option.value })}
                  className={cn(
                    'p-3 rounded-xl text-center transition-all duration-300',
                    options.length === option.value
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  )}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-70 mt-1">{option.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              摘要样式
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOptions({ ...options, style: option.value })}
                  className={cn(
                    'p-3 rounded-xl text-center transition-all duration-300',
                    options.style === option.value
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  )}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="font-medium">{option.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              <span>高级选项</span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-2"
                >
                  <label className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={options.includeKeywords}
                      onChange={(e) =>
                        setOptions({ ...options, includeKeywords: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-cyan-500/30 text-cyan-500 focus:ring-cyan-500/20"
                    />
                    <span className="text-sm text-gray-300">包含关键词提取</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={options.includeStats}
                      onChange={(e) =>
                        setOptions({ ...options, includeStats: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-cyan-500/30 text-cyan-500 focus:ring-cyan-500/20"
                    />
                    <span className="text-sm text-gray-300">包含统计信息</span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating || externalLoading || !articleContent.trim()}
            className={cn(
              'w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-300',
              'bg-gradient-to-r from-cyan-600 to-purple-600',
              'hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
            )}
          >
            {(isGenerating || externalLoading) ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>生成摘要</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Summary Output */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-cyan-500/20"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  生成的摘要
                </h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300"
                    title="复制摘要"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300"
                    title="下载摘要"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/20">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {summary}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                className="mt-4 w-full py-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>重新生成</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
