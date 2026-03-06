'use client';

/**
 * Reading Components Demo - 阅读组件完整示例
 * 展示所有阅读相关组件的使用方法
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReadingTracker,
  ReadingStatsCard,
  ChapterNavigator,
  ReadingTimeCalculator,
  ReadingControlBar,
  type ReadingSettings,
  type ReadingStats,
  type Chapter,
} from '@/components/reading';

// 示例文章内容
const DEMO_CONTENT = `
  <h1 data-chapter-id="intro" class="text-3xl font-bold mb-6">引言：构建现代化的阅读体验</h1>
  <p class="mb-4 leading-relaxed">
    在当今的信息时代，用户对阅读体验的要求越来越高。一个优秀的阅读界面不仅能提升用户满意度，
    还能显著增加内容的阅读完成率。本文将介绍如何构建一套完整的阅读体验系统。
  </p>

  <h2 data-chapter-id="features" class="text-2xl font-bold mb-4 mt-8">核心功能特性</h2>
  <p class="mb-4 leading-relaxed">
    我们的阅读系统包含以下核心功能：实时进度追踪、智能时间估算、章节导航、个性化设置等。
    这些功能协同工作，为用户提供最佳的阅读体验。
  </p>
  <p class="mb-4 leading-relaxed">
    进度追踪器采用Intersection Observer API，能够精确检测用户的阅读位置，
    并实时更新进度显示。支持顶部进度条、侧边圆环、底部控制栏等多种展示模式。
  </p>

  <h2 data-chapter-id="implementation" class="text-2xl font-bold mb-4 mt-8">技术实现细节</h2>
  <p class="mb-4 leading-relaxed">
    系统基于React和Framer Motion构建，实现了流畅的动画效果和交互体验。
    使用TypeScript确保类型安全，提供完整的类型定义。
  </p>

  <pre class="bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto"><code>// 示例代码
const [progress, setProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    setProgress(scrollPercent);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);</code></pre>

  <p class="mb-4 leading-relaxed">
    通过使用React Hooks，我们能够轻松管理组件状态，实现响应式的用户界面。
    每个组件都是独立的，可以单独使用，也可以组合使用。
  </p>

  <h2 data-chapter-id="customization" class="text-2xl font-bold mb-4 mt-8">个性化定制</h2>
  <p class="mb-4 leading-relaxed">
    每个用户的阅读偏好都不同。我们的系统提供了丰富的定制选项，
    包括字体大小、行高、主题颜色、文本对齐方式等。
  </p>
  <p class="mb-4 leading-relaxed">
    用户可以选择浅色、深色、羊皮纸、赛博朋克等多种主题，
    系统会自动保存用户偏好，下次访问时自动应用。
  </p>

  <h2 data-chapter-id="performance" class="text-2xl font-bold mb-4 mt-8">性能优化</h2>
  <p class="mb-4 leading-relaxed">
    性能是我们关注的重点。通过节流滚动事件、使用Intersection Observer、
    优化重渲染等方式，确保在各种设备上都能流畅运行。
  </p>

  <h2 data-chapter-id="conclusion" class="text-2xl font-bold mb-4 mt-8">总结</h2>
  <p class="mb-4 leading-relaxed">
    通过这套完整的阅读体验系统，我们为用户提供了一个功能强大、性能优异、
    高度可定制的阅读环境。无论是博客、新闻、小说还是技术文档，
    都能够获得最佳的阅读体验。
  </p>
  <p class="mb-4 leading-relaxed">
    开始使用这些组件，提升你的内容的阅读体验吧！
  </p>
`;

// 示例数据
const demoReadingStats: ReadingStats = {
  totalArticles: 42,
  totalWords: 125000,
  totalReadingTime: 680, // 分钟
  currentStreak: 7,
  longestStreak: 14,
  averageReadingSpeed: 245,
  completionRate: 85,
  thisWeekReading: 8500,
  thisMonthReading: 32000,
  favoriteCategories: ['技术', '编程', '设计'],
  recentAchievements: [
    {
      id: '1',
      title: '阅读达人',
      description: '连续阅读7天',
      icon: '🔥',
      unlockedAt: new Date('2024-03-01'),
      rarity: 'rare',
    },
    {
      id: '2',
      title: '知识探索者',
      description: '阅读超过10万字',
      icon: '📚',
      unlockedAt: new Date('2024-02-28'),
      rarity: 'epic',
    },
  ],
};

const demoChapters: Chapter[] = [
  {
    id: 'intro',
    title: '引言',
    slug: 'intro',
    estimatedTime: 2,
    wordCount: 150,
    completed: true,
  },
  {
    id: 'features',
    title: '核心功能特性',
    slug: 'features',
    estimatedTime: 3,
    wordCount: 250,
    completed: true,
  },
  {
    id: 'implementation',
    title: '技术实现细节',
    slug: 'implementation',
    estimatedTime: 5,
    wordCount: 400,
    completed: false,
    current: true,
  },
  {
    id: 'customization',
    title: '个性化定制',
    slug: 'customization',
    estimatedTime: 3,
    wordCount: 200,
    completed: false,
  },
  {
    id: 'performance',
    title: '性能优化',
    slug: 'performance',
    estimatedTime: 2,
    wordCount: 150,
    completed: false,
  },
  {
    id: 'conclusion',
    title: '总结',
    slug: 'conclusion',
    estimatedTime: 2,
    wordCount: 150,
    completed: false,
  },
];

export default function ReadingDemoPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 16,
    lineHeight: 1.6,
    textAlign: 'left',
    theme: 'cyber',
    fontFamily: 'sans',
    width: 'medium',
  });
  const [currentChapterId, setCurrentChapterId] = useState('implementation');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 应用设置到内容区域
  const contentStyle = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    textAlign: settings.textAlign,
    fontFamily: settings.fontFamily === 'sans' ? 'system-ui, sans-serif' :
                 settings.fontFamily === 'serif' ? 'Georgia, serif' :
                 'monospace',
    maxWidth: settings.width === 'narrow' ? '600px' :
              settings.width === 'medium' ? '800px' :
              '1000px',
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 顶部进度追踪器 */}
      <ReadingTracker
        contentRef={contentRef}
        sections={demoChapters.map(ch => ch.title)}
        totalWords={1300}
        showPosition="top"
        variant="linear"
      />

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧：章节导航 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ChapterNavigator
                chapters={demoChapters}
                currentChapterId={currentChapterId}
                onChapterChange={setCurrentChapterId}
                position="sidebar"
                variant="full"
                showProgress
                showTime
              />

              {/* 阅读统计卡片 */}
              <div className="mt-6">
                <ReadingStatsCard
                  stats={demoReadingStats}
                  variant="compact"
                  showAchievements
                  showTrends
                />
              </div>
            </div>
          </aside>

          {/* 中间：文章内容 */}
          <main className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 阅读时间估算 */}
              <div className="mb-6">
                <ReadingTimeCalculator
                  content={DEMO_CONTENT}
                  variant="detailed"
                  showBreakdown
                  showDifficulty
                  options={{
                    wordsPerMinute: 200,
                    codeReadingMultiplier: 2.5,
                  }}
                />
              </div>

              {/* 文章内容 */}
              <article
                ref={contentRef}
                className="cyber-card p-8 bg-cyber-dark/50 border border-cyber-border"
                style={contentStyle}
              >
                <div dangerouslySetInnerHTML={{ __html: DEMO_CONTENT }} />
              </article>
            </motion.div>
          </main>

          {/* 右侧：浮动控制栏 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 快捷操作 */}
              <div className="cyber-card p-4 bg-cyber-dark/50 border border-cyber-border">
                <h3 className="text-lg font-semibold text-white mb-4">快捷操作</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={cn(
                      'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                      isBookmarked
                        ? 'bg-cyber-yellow text-gray-900'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    )}
                  >
                    <span>{isBookmarked ? '⭐' : '☆'}</span>
                    <span>{isBookmarked ? '已收藏' : '收藏'}</span>
                  </button>
                  <button
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className={cn(
                      'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                      isSpeaking
                        ? 'bg-cyber-pink text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    )}
                  >
                    <span>🔊</span>
                    <span>{isSpeaking ? '停止朗读' : '开始朗读'}</span>
                  </button>
                </div>
              </div>

              {/* 阅读设置 */}
              <div className="cyber-card p-4 bg-cyber-dark/50 border border-cyber-border">
                <h3 className="text-lg font-semibold text-white mb-4">阅读设置</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">字体大小: {settings.fontSize}px</label>
                    <input
                      type="range"
                      min="14"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">行高: {settings.lineHeight}</label>
                    <input
                      type="range"
                      min="1.4"
                      max="2.0"
                      step="0.1"
                      value={settings.lineHeight}
                      onChange={(e) => setSettings({ ...settings, lineHeight: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* 浮动章节导航按钮 */}
              <ChapterNavigator
                chapters={demoChapters}
                currentChapterId={currentChapterId}
                onChapterChange={setCurrentChapterId}
                position="floating"
                variant="compact"
              />
            </div>
          </aside>
        </div>
      </div>

      {/* 底部阅读控制栏 */}
      <ReadingControlBar
        settings={settings}
        onSettingsChange={setSettings}
        onBookmark={() => setIsBookmarked(!isBookmarked)}
        onShare={() => alert('分享功能')}
        onPrint={() => window.print()}
        onToggleSpeech={() => setIsSpeaking(!isSpeaking)}
        isSpeaking={isSpeaking}
        isBookmarked={isBookmarked}
        position="bottom"
      />

      {/* 浮动返回顶部按钮 */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 left-4 z-50 p-3 rounded-full bg-cyber-cyan hover:bg-cyber-cyan/80 text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ↑
      </motion.button>
    </div>
  );
}
