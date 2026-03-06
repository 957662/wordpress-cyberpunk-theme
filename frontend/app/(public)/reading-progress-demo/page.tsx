/**
 * 阅读进度追踪功能演示页面
 *
 * 展示所有阅读进度相关的组件和功能
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  History,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 导入阅读进度组件
import {
  ReadingProgressBar,
  ReadingTimeEstimator,
  ReadingStatsCard,
  ReadingHistory,
  ReadingGoalSetting,
  ReadingGoalList,
  ReadingAchievement,
  AchievementStats,
} from '@/components/reading-progress';

// 导入 Hooks
import {
  useReadingProgress,
  useReadingTimeEstimate,
  useReadingHistory,
  useReadingStats,
} from '@/components/reading-progress/useReadingProgress';

export default function ReadingProgressDemoPage() {
  // 模拟文章内容
  const articleContent = `
    # 深入理解 React Server Components

    React Server Components (RSC) 是 React 18 引入的一项革命性功能，它允许我们在服务器端渲染组件，从而提供更好的性能和用户体验。

    什么是 Server Components？

    Server Components 是一种特殊的组件，它们在服务器上渲染，而不是在客户端。这意味着它们可以直接访问服务器资源，如数据库、文件系统等，而不需要通过 API。

    主要优势

    1. **零客户端 JavaScript**: Server Components 不会增加客户端 bundle 的大小
    2. **直接访问后端资源**: 可以直接查询数据库、读取文件等
    3. **自动代码分割**: Server Components 的代码不会发送到客户端
    4. **更好的 SEO**: 服务器渲染的内容更容易被搜索引擎索引

    使用场景

    Server Components 特别适合以下场景：

    - 获取数据
    - 读取文件系统
    - 访问敏感信息（如 API 密钥）
    - 保持大型依赖项在服务器端

    如何使用

    创建 Server Components 非常简单，只需要确保组件文件以 'use server' 开头，或者默认就是服务器组件（Next.js 13+）。

    ${'这是一段很长的示例内容，用来测试阅读进度功能。'.repeat(50)}

    总结

    React Server Components 为我们提供了一个强大的工具来构建现代化的 Web 应用。通过合理使用 Server Components 和 Client Components，我们可以在性能和开发体验之间取得最佳平衡。
  `;

  // 使用 Hooks
  const { progress, isCompleted, markAsRead, resetProgress } = useReadingProgress({
    articleId: 'demo-article-1',
    autoTrack: true,
    onProgressChange: (p) => console.log('进度变化:', p),
    onComplete: () => console.log('阅读完成！'),
  });

  const { wordCount, readingTime } = useReadingTimeEstimate(articleContent);
  const { history } = useReadingHistory();
  const { stats } = useReadingStats();

  // 模拟数据
  const [mockHistory] = useState([
    {
      id: '1',
      articleId: 'article-1',
      title: '如何使用 React Hooks',
      slug: 'react-hooks-guide',
      progress: 75,
      readingTime: 300,
      lastReadAt: '2024-03-06T10:30:00Z',
      isCompleted: false,
      coverImage: '/images/react-hooks.jpg',
    },
    {
      id: '2',
      articleId: 'article-2',
      title: 'TypeScript 入门教程',
      slug: 'typescript-basics',
      progress: 100,
      readingTime: 600,
      lastReadAt: '2024-03-05T15:20:00Z',
      isCompleted: true,
      coverImage: '/images/typescript.jpg',
    },
    {
      id: '3',
      articleId: 'article-3',
      title: 'Next.js 14 完全指南',
      slug: 'nextjs-14-guide',
      progress: 45,
      readingTime: 270,
      lastReadAt: '2024-03-04T09:15:00Z',
      isCompleted: false,
    },
  ]);

  const [mockGoals] = useState([
    {
      id: 'goal-1',
      type: 'daily' as const,
      articleCount: 5,
      readingTime: 60,
      currentCount: 3,
      currentReadingTime: 45,
      startDate: '2024-03-06',
      endDate: '2024-03-06',
      isAchieved: false,
    },
    {
      id: 'goal-2',
      type: 'weekly' as const,
      articleCount: 20,
      readingTime: 300,
      currentCount: 12,
      currentReadingTime: 180,
      startDate: '2024-03-04',
      endDate: '2024-03-10',
      isAchieved: false,
    },
  ]);

  const [mockAchievements] = useState([
    {
      id: 'ach-1',
      title: '初出茅庐',
      description: '完成第一篇文章阅读',
      icon: 'book' as const,
      rarity: 'common' as const,
      isUnlocked: true,
      progress: 100,
      type: 'reading' as const,
      unlockedAt: '2024-03-01T10:00:00Z',
    },
    {
      id: 'ach-2',
      title: '书虫',
      description: '连续阅读7天',
      icon: 'flame' as const,
      rarity: 'rare' as const,
      isUnlocked: true,
      progress: 100,
      type: 'streak' as const,
      unlockedAt: '2024-03-06T08:00:00Z',
    },
    {
      id: 'ach-3',
      title: '知识渊博',
      description: '阅读100篇文章',
      icon: 'trophy' as const,
      rarity: 'epic' as const,
      isUnlocked: false,
      progress: 65,
      type: 'reading' as const,
    },
    {
      id: 'ach-4',
      title: '阅读达人',
      description: '累计阅读100小时',
      icon: 'crown' as const,
      rarity: 'legendary' as const,
      isUnlocked: false,
      progress: 35,
      type: 'time' as const,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 进度条 */}
      <ReadingProgressBar
        position="top"
        color="#3b82f6"
        height={4}
        showPercentage
      />

      {/* 主内容 */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
            阅读进度追踪系统
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            完整的阅读进度管理、统计和成就系统演示
          </p>
        </div>

        {/* 功能概览 */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <BookOpen className="mb-3 h-8 w-8 text-blue-500" />
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
              进度追踪
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              实时追踪阅读进度
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <Clock className="mb-3 h-8 w-8 text-green-500" />
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
              时间估算
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              智能估算阅读时间
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <Target className="mb-3 h-8 w-8 text-purple-500" />
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
              目标设置
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              设置每日/每周目标
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <Trophy className="mb-3 h-8 w-8 text-yellow-500" />
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
              成就系统
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              解锁阅读成就
            </p>
          </motion.div>
        </div>

        {/* 演示文章 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              演示文章
            </h2>
            <ReadingTimeEstimator content={articleContent} showIcon />
          </div>

          <article className="prose dark:prose-invert max-w-none rounded-lg border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="whitespace-pre-wrap">{articleContent}</div>
          </article>

          <div className="mt-4 flex gap-3">
            <button
              onClick={markAsRead}
              disabled={isCompleted}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              )}
            >
              {isCompleted ? '已完成' : '标记为已读'}
            </button>
            <button
              onClick={resetProgress}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              重置进度
            </button>
            <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              当前进度: {progress.toFixed(1)}%
            </span>
          </div>
        </section>

        {/* 统计卡片 */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              阅读统计
            </h2>
            <ReadingStatsCard
              stats={{
                totalArticles: 156,
                totalReadingTime: 2450,
                weeklyArticles: 12,
                readingStreak: 7,
                completionRate: 85,
                achievements: 23,
              }}
              variant="detailed"
            />
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              成就统计
            </h2>
            <AchievementStats
              totalAchievements={50}
              unlockedAchievements={23}
              currentLevel={5}
              nextLevelXP={1000}
              currentXP={650}
            />
          </div>
        </section>

        {/* 阅读目标 */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            阅读目标
          </h2>
          <ReadingGoalList goals={mockGoals} />
        </section>

        {/* 阅读历史 */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            阅读历史
          </h2>
          <ReadingHistory
            historyItems={mockHistory}
            onDelete={(id) => console.log('删除:', id)}
            onClear={() => console.log('清空历史')}
          />
        </section>

        {/* 成就系统 */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            成就系统
          </h2>
          <ReadingAchievement
            achievements={mockAchievements}
            viewMode="grid"
            onAchievementClick={(achievement) => console.log('点击成就:', achievement)}
          />
        </section>

        {/* 使用说明 */}
        <section className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            使用说明
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                1. 进度追踪
              </h3>
              <p>
                阅读进度条会自动追踪您的阅读位置，并在页面刷新后恢复到上次阅读的位置。
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                2. 阅读时间估算
              </h3>
              <p>
                根据文章字数和平均阅读速度，自动估算阅读所需时间，支持中英文混合内容。
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                3. 阅读目标
              </h3>
              <p>
                设置每日、每周或每月的阅读目标，追踪自己的阅读进度，养成良好的阅读习惯。
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                4. 成就系统
              </h3>
              <p>
                通过阅读获得成就，解锁不同稀有度的徽章，激励自己持续阅读。
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                5. 数据同步
              </h3>
              <p>
                所有数据都会自动保存到本地存储，并支持导出和导入，方便备份和迁移。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
