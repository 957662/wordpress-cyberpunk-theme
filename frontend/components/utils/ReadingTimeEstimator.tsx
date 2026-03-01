'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '../icons';

export interface ReadingTimeEstimatorProps {
  content: string;
  wordsPerMinute?: number;
  className?: string;
  showProgress?: boolean;
}

export default function ReadingTimeEstimator({
  content,
  wordsPerMinute = 200,
  className = '',
  showProgress = true,
}: ReadingTimeEstimatorProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // 计算阅读时间
  const readingStats = useMemo(() => {
    // 移除 HTML 标签
    const textContent = content.replace(/<[^>]*>/g, '');

    // 分割成单词（支持中英文）
    const chineseChars = textContent.match(/[\u4e00-\u9fa5]/g) || [];
    const englishWords = textContent.match(/[a-zA-Z]+/g) || [];

    // 中文字符按字符计算，英文按单词计算
    const chineseCount = chineseChars.length;
    const englishCount = englishWords.length;

    // 中文阅读速度：400字/分钟，英文：200词/分钟
    const chineseTime = chineseCount / 400;
    const englishTime = englishCount / 200;
    const totalMinutes = chineseTime + englishTime;

    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);

    return {
      minutes,
      seconds,
      totalWords: chineseCount + englishCount,
      chineseChars: chineseCount,
      englishWords: englishCount,
    };
  }, [content, wordsPerMinute]);

  // 格式化时间显示
  const formatTime = (mins: number, secs: number) => {
    if (mins === 0 && secs < 60) {
      return `${secs}秒`;
    }
    if (mins < 1) {
      return '少于1分钟';
    }
    if (mins < 60) {
      return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}小时${remainingMins}分钟`;
  };

  // 监听滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = documentHeight - windowHeight;
      const progress = scrollTop / trackLength;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      setIsReading(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 估算剩余时间
  const estimatedTimeRemaining = useMemo(() => {
    if (!isReading || scrollProgress === 0) return null;

    const totalSeconds = readingStats.minutes * 60 + readingStats.seconds;
    const remainingSeconds = Math.round(totalSeconds * (1 - scrollProgress));
    const remainingMins = Math.floor(remainingSeconds / 60);
    const remainingSecs = remainingSeconds % 60;

    return formatTime(remainingMins, remainingSecs);
  }, [isReading, scrollProgress, readingStats]);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 阅读时间显示 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-border bg-cyber-card/50 backdrop-blur-sm"
      >
        <ClockIcon className="w-4 h-4 text-cyber-cyan" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">阅读时间</span>
          <span className="text-sm font-mono text-cyber-cyan">
            {formatTime(readingStats.minutes, readingStats.seconds)}
          </span>
        </div>
      </motion.div>

      {/* 字数统计 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-border bg-cyber-card/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-cyber-cyan to-cyber-purple" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">字数</span>
            <span className="text-sm font-mono text-cyber-purple">
              {readingStats.totalWords.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 剩余时间 */}
      {isReading && estimatedTimeRemaining && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-pink/30 bg-cyber-pink/5"
        >
          <div className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse" />
          <span className="text-xs text-gray-400">剩余: </span>
          <span className="text-sm font-mono text-cyber-pink">
            {estimatedTimeRemaining}
          </span>
        </motion.div>
      )}

      {/* 滚动进度条 */}
      {showProgress && (
        <div className="flex-1">
          <div className="relative h-2 bg-cyber-darker rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
            {/* 发光效果 */}
            <motion.div
              className="absolute inset-y-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ width: '100px' }}
              initial={{ left: '-100px' }}
              animate={{ left: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>进度</span>
            <span className="font-mono text-cyber-cyan">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// 便捷函数：计算文本的阅读时间
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): { minutes: number; seconds: number; text: string } {
  const textContent = content.replace(/<[^>]*>/g, '');
  const chineseChars = textContent.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = textContent.match(/[a-zA-Z]+/g) || [];

  const chineseCount = chineseChars.length;
  const englishCount = englishWords.length;

  const chineseTime = chineseCount / 400;
  const englishTime = englishCount / wordsPerMinute;
  const totalMinutes = chineseTime + englishTime;

  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);

  let text = '';
  if (minutes === 0 && seconds < 60) {
    text = `${seconds}秒`;
  } else if (minutes < 60) {
    text = seconds > 0 ? `${minutes}分${seconds}秒` : `${minutes}分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    text = `${hours}小时${remainingMins}分钟`;
  }

  return { minutes, seconds, text };
}
