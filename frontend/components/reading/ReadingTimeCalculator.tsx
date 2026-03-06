'use client';

/**
 * ReadingTimeCalculator - 阅读时间计算器
 * 根据文章内容精确估算阅读时间
 */

import React, { useMemo, useEffect } from 'react';
import { Clock, Zap, BookOpen, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadingTimeOptions {
  wordsPerMinute?: number; // 默认阅读速度 (字/分钟)
  imagesPerMinute?: number; // 查看图片的时间 (图片/分钟)
  codeReadingMultiplier?: number; // 代码阅读难度系数
  technicalContentMultiplier?: number; // 技术内容难度系数
}

export interface ReadingTimeResult {
  totalMinutes: number;
  formattedTime: string;
  wordCount: number;
  imageCount: number;
  codeBlockCount: number;
  breakdown: {
    reading: number;
    viewingImages: number;
    understandingCode: number;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface ReadingTimeCalculatorProps {
  content: string;
  options?: ReadingTimeOptions;
  variant?: 'badge' | 'detailed' | 'compact';
  showBreakdown?: boolean;
  showDifficulty?: boolean;
  className?: string;
}

const defaultOptions: Required<ReadingTimeOptions> = {
  wordsPerMinute: 200,
  imagesPerMinute: 1,
  codeReadingMultiplier: 2.5,
  technicalContentMultiplier: 1.5,
};

export function ReadingTimeCalculator({
  content,
  options = {},
  variant = 'badge',
  showBreakdown = false,
  showDifficulty = false,
  className,
}: ReadingTimeCalculatorProps) {
  const config = { ...defaultOptions, ...options };

  // 计算阅读时间
  const result = useMemo<ReadingTimeResult>(() => {
    // 创建临时 DOM 来解析内容
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // 统计字数
    const textContent = doc.body.textContent || '';
    const wordCount = textContent.trim().length;

    // 统计图片数量
    const images = doc.querySelectorAll('img');
    const imageCount = images.length;

    // 统计代码块数量
    const codeBlocks = doc.querySelectorAll('pre, code');
    const codeBlockCount = codeBlocks.length;

    // 检测技术内容关键词
    const technicalKeywords = [
      'API', '代码', '编程', '算法', '数据库', '架构', '部署',
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js',
      'Python', 'Java', 'Go', 'Rust', 'CSS', 'HTML'
    ];
    const hasTechnicalContent = technicalKeywords.some(keyword =>
      textContent.includes(keyword)
    );

    // 计算各部分时间
    const readingTime = wordCount / config.wordsPerMinute;
    const imageTime = imageCount / config.imagesPerMinute;
    const codeTime = codeBlockCount > 0
      ? (wordCount / config.wordsPerMinute) * (config.codeReadingMultiplier - 1)
      : 0;

    // 应用技术内容系数
    const multiplier = hasTechnicalContent ? config.technicalContentMultiplier : 1;
    const totalMinutes = Math.round((readingTime + imageTime + codeTime) * multiplier);

    // 格式化时间显示
    let formattedTime = '';
    if (totalMinutes < 1) {
      formattedTime = '< 1 分钟';
    } else if (totalMinutes < 60) {
      formattedTime = `${totalMinutes} 分钟`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      formattedTime = mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
    }

    // 评估难度
    let difficulty: ReadingTimeResult['difficulty'] = 'easy';
    if (codeBlockCount > 5 || wordCount > 3000) {
      difficulty = 'expert';
    } else if (codeBlockCount > 2 || wordCount > 1500 || hasTechnicalContent) {
      difficulty = 'hard';
    } else if (wordCount > 800) {
      difficulty = 'medium';
    }

    return {
      totalMinutes,
      formattedTime,
      wordCount,
      imageCount,
      codeBlockCount,
      breakdown: {
        reading: Math.round(readingTime * multiplier),
        viewingImages: Math.round(imageTime),
        understandingCode: Math.round(codeTime),
      },
      difficulty,
    };
  }, [content, config]);

  // 难度配置
  const difficultyConfig = {
    easy: { label: '简单', color: 'text-green-400', bgColor: 'bg-green-400/10', icon: '📖' },
    medium: { label: '中等', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '📚' },
    hard: { label: '困难', color: 'text-orange-400', bgColor: 'bg-orange-400/10', icon: '🎯' },
    expert: { label: '专家', color: 'text-red-400', bgColor: 'bg-red-400/10', icon: '🏆' },
  };

  // 渲染徽章模式
  if (variant === 'badge') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
          'bg-gray-800/50 border border-gray-700',
          className
        )}
        title={`约 ${result.wordCount} 字，${result.imageCount} 张图片`}
      >
        <Clock className="w-4 h-4 text-cyber-cyan" />
        <span className="text-white font-medium">{result.formattedTime}</span>
        {showDifficulty && (
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              difficultyConfig[result.difficulty].bgColor,
              difficultyConfig[result.difficulty].color
            )}
          >
            {difficultyConfig[result.difficulty].label}
          </span>
        )}
      </div>
    );
  }

  // 渲染紧凑模式
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-4 text-sm text-gray-400', className)}>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{result.wordCount} 字</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{result.formattedTime}</span>
        </div>
        {result.codeBlockCount > 0 && (
          <div className="flex items-center gap-1.5 text-cyber-purple">
            <Zap className="w-4 h-4" />
            <span>{result.codeBlockCount} 段代码</span>
          </div>
        )}
      </div>
    );
  }

  // 渲染详细模式
  return (
    <div
      className={cn(
        'cyber-card p-4 bg-gradient-to-br from-cyber-dark to-cyber-muted border border-cyber-border',
        className
      )}
    >
      {/* 主要信息 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-gray-400">预计阅读时间</div>
            <div className="text-2xl font-bold text-white">{result.formattedTime}</div>
          </div>
        </div>

        {showDifficulty && (
          <div
            className={cn(
              'px-4 py-2 rounded-lg border',
              difficultyConfig[result.difficulty].bgColor,
              difficultyConfig[result.difficulty].color
            )}
          >
            <div className="text-xs opacity-80">难度</div>
            <div className="flex items-center gap-1.5 font-semibold">
              <span>{difficultyConfig[result.difficulty].icon}</span>
              <span>{difficultyConfig[result.difficulty].label}</span>
            </div>
          </div>
        )}
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <BookOpen className="w-4 h-4 text-cyber-cyan mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{result.wordCount}</div>
          <div className="text-xs text-gray-400">字数</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Clock className="w-4 h-4 text-cyber-purple mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{result.imageCount}</div>
          <div className="text-xs text-gray-400">图片</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Zap className="w-4 h-4 text-cyber-pink mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{result.codeBlockCount}</div>
          <div className="text-xs text-gray-400">代码块</div>
        </div>
      </div>

      {/* 时间分解 */}
      {showBreakdown && (result.breakdown.reading > 0 || result.breakdown.viewingImages > 0 || result.breakdown.understandingCode > 0) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>时间分配</span>
          </div>

          {result.breakdown.reading > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">正文阅读</span>
                  <span className="text-cyber-cyan font-medium">{result.breakdown.reading} 分钟</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-cyan/60"
                    style={{
                      width: `${(result.breakdown.reading / result.totalMinutes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {result.breakdown.viewingImages > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">查看图片</span>
                  <span className="text-cyber-purple font-medium">{result.breakdown.viewingImages} 分钟</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-purple to-cyber-purple/60"
                    style={{
                      width: `${(result.breakdown.viewingImages / result.totalMinutes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {result.breakdown.understandingCode > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">理解代码</span>
                  <span className="text-cyber-pink font-medium">{result.breakdown.understandingCode} 分钟</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-pink to-cyber-pink/60"
                    style={{
                      width: `${(result.breakdown.understandingCode / result.totalMinutes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 提示信息 */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-400">
          阅读时间基于平均阅读速度计算。实际时间可能因个人阅读速度、内容理解深度等因素而有所不同。
        </div>
      </div>
    </div>
  );
}

// 辅助函数：直接计算阅读时间（不渲染组件）
export function calculateReadingTime(
  content: string,
  options?: ReadingTimeOptions
): ReadingTimeResult {
  // 这个函数可以用于服务端计算
  // 实现逻辑与组件中的 useMemo 相同
  const config = { ...defaultOptions, ...options };
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  const textContent = doc.body.textContent || '';
  const wordCount = textContent.trim().length;
  const imageCount = doc.querySelectorAll('img').length;
  const codeBlockCount = doc.querySelectorAll('pre, code').length;

  const readingTime = wordCount / config.wordsPerMinute;
  const imageTime = imageCount / config.imagesPerMinute;
  const codeTime = codeBlockCount > 0
    ? (wordCount / config.wordsPerMinute) * (config.codeReadingMultiplier - 1)
    : 0;

  const totalMinutes = Math.round(readingTime + imageTime + codeTime);

  let formattedTime = '';
  if (totalMinutes < 1) {
    formattedTime = '< 1 分钟';
  } else if (totalMinutes < 60) {
    formattedTime = `${totalMinutes} 分钟`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    formattedTime = mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
  }

  return {
    totalMinutes,
    formattedTime,
    wordCount,
    imageCount,
    codeBlockCount,
    breakdown: {
      reading: Math.round(readingTime),
      viewingImages: Math.round(imageTime),
      understandingCode: Math.round(codeTime),
    },
    difficulty: wordCount > 3000 ? 'expert' : wordCount > 1500 ? 'hard' : wordCount > 800 ? 'medium' : 'easy',
  };
}

export default ReadingTimeCalculator;
