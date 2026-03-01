'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CyberCalendar,
  ReadingTimeEstimator,
  SocialShareFloating,
  ArticleTableOfContents,
} from '@/components/utils';
import { ArrowRightIcon } from '@/components/icons';

export default function UtilsDemoPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 示例文章内容（用于演示目录和阅读时间）
  const sampleArticle = `
    <article class="prose-cyber max-w-none">
      <h2>赛博朋克风格的博客平台介绍</h2>
      <p>
        CyberPress 是一个基于 WordPress REST API 和 Next.js 14 构建的现代化博客平台。
        它融合了赛博朋克美学与极致的用户体验，为内容创作者提供了一个独特的展示空间。
      </p>

      <h2>核心特性</h2>
      <p>
        平台采用最新的前端技术栈，包括 TypeScript、Tailwind CSS 和 Framer Motion，
        确保出色的性能和流畅的动画效果。
      </p>

      <h3>响应式设计</h3>
      <p>
        完全响应式的设计确保在各种设备上都能提供最佳的用户体验，
        从桌面电脑到移动设备，每一次访问都是一场视觉盛宴。
      </p>

      <h3>动态交互</h3>
      <p>
        丰富的交互元素让页面充满活力，悬停效果、过渡动画和微交互细节，
        让用户操作更加愉悦和直观。
      </p>

      <h2>技术架构</h2>
      <p>
        后端使用 WordPress 作为 Headless CMS，通过 REST API 提供内容服务。
        前端采用 Next.js 14 的 App Router 架构，实现服务端渲染和静态生成的最佳结合。
      </p>

      <h3>性能优化</h3>
      <p>
        通过图片优化、代码分割、缓存策略等多种技术手段，
        确保页面加载速度和运行性能达到最优。
      </p>

      <h2>组件库</h2>
      <p>
        内置丰富的赛博朋克风格组件库，包括日历、阅读时间估算器、
        社交分享浮窗、文章目录导航等实用工具。
      </p>

      <h3>日历组件</h3>
      <p>
        赛博朋克风格的日历组件，支持日期选择、高亮显示特定日期、
        限制日期范围等功能，完美融入整体设计风格。
      </p>

      <h3>阅读时间估算器</h3>
      <p>
        智能计算文章阅读时间，支持中英文混合内容，
        实时显示滚动进度和剩余阅读时间，提升阅读体验。
      </p>

      <h3>社交分享</h3>
      <p>
        浮动式社交分享按钮，支持多个主流社交平台，
        一键分享内容，扩大文章影响力。
      </p>

      <h3>文章目录</h3>
      <p>
        自动生成文章目录，支持多级标题，
        随滚动自动高亮当前章节，快速导航到感兴趣的内容。
      </p>

      <h2>未来规划</h2>
      <p>
        平台将持续演进，引入更多创新功能和交互效果，
        为用户提供更加出色的内容创作和阅读体验。
      </p>
    </article>
  `;

  // 示例高亮日期
  const highlightedDates = [
    new Date(2026, 2, 15),
    new Date(2026, 2, 20),
    new Date(2026, 2, 25),
  ];

  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* 社交分享浮窗 */}
      <SocialShareFloating
        title="CyberPress 实用工具组件演示"
        description="探索赛博朋克风格的实用组件库"
        position="right"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 mb-6">
            <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
            <span className="text-cyber-cyan text-sm font-mono">UTILITIES DEMO</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="text-glow-cyan text-cyber-cyan">实用工具</span>
            <span className="text-glow-purple text-cyber-purple">组件库</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            探索赛博朋克风格的实用组件，提升用户体验
          </p>
        </motion.div>

        {/* 文章目录 */}
        <ArticleTableOfContents
          content={sampleArticle}
          position="right"
          offset={120}
        />

        {/* 组件展示网格 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 日历组件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-cyber-cyan rounded" />
              赛博朋克日历
            </h2>
            <CyberCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              highlightedDates={highlightedDates}
              minDate={new Date(2026, 0, 1)}
              maxDate={new Date(2026, 11, 31)}
              className="max-w-md"
            />
          </motion.div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-card"
          >
            <h3 className="text-xl font-display font-bold text-cyber-cyan mb-4">
              功能特性
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan mt-1">▹</span>
                <span>支持日期选择和回调</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan mt-1">▹</span>
                <span>可高亮显示特定日期</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan mt-1">▹</span>
                <span>限制日期范围（最小/最大日期）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan mt-1">▹</span>
                <span>今天日期自动标记</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan mt-1">▹</span>
                <span>月份切换动画</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-cyber-border">
              <p className="text-sm text-gray-500 mb-3">快速跳转到今天:</p>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 rounded-lg border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
              >
                选择今天
              </button>
            </div>
          </motion.div>
        </div>

        {/* 阅读时间估算器演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-cyber-purple rounded" />
            阅读时间估算器
          </h2>

          <div className="cyber-card mb-4">
            <ReadingTimeEstimator
              content={sampleArticle}
              wordsPerMinute={200}
              showProgress={true}
            />
          </div>

          <div className="cyber-card">
            <h3 className="text-xl font-display font-bold text-cyber-purple mb-4">
              功能特性
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">智能计算</h4>
                <p className="text-sm text-gray-400">
                  支持中英文混合内容，中文按字符计算，英文按单词计算
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">实时进度</h4>
                <p className="text-sm text-gray-400">
                  滚动页面时实时更新阅读进度和剩余时间
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">字数统计</h4>
                <p className="text-sm text-gray-400">
                  显示文章总字数，让读者了解内容长度
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">多种显示</h4>
                <p className="text-sm text-gray-400">
                  支持显示进度条、字数统计等多种信息
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 文章目录演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-cyber-pink rounded" />
            文章目录导航
          </h2>

          <div className="cyber-card">
            <p className="text-gray-400 mb-6">
              查看页面右侧的目录导航（桌面端）或右下角的浮动按钮（移动端）
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">自动提取</h4>
                <p className="text-sm text-gray-400">
                  自动从文章内容中提取 h2、h3、h4 标题生成目录
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">滚动同步</h4>
                <p className="text-sm text-gray-400">
                  随页面滚动自动高亮当前章节
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">平滑滚动</h4>
                <p className="text-sm text-gray-400">
                  点击目录项平滑滚动到对应位置
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">响应式设计</h4>
                <p className="text-sm text-gray-400">
                  桌面端固定显示，移动端抽屉式菜单
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 社交分享演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-cyber-yellow rounded" />
            社交分享浮窗
          </h2>

          <div className="cyber-card">
            <p className="text-gray-400 mb-6">
              查看页面右下角的社交分享浮动按钮
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">多平台支持</h4>
                <p className="text-sm text-gray-400">
                  支持 Twitter、Facebook、LinkedIn、微博等平台
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">一键复制</h4>
                <p className="text-sm text-gray-400">
                  快速复制文章链接到剪贴板
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">原生分享</h4>
                <p className="text-sm text-gray-400">
                  移动端支持使用系统原生分享功能
                </p>
              </div>
              <div>
                <h4 className="text-sm text-cyber-cyan mb-2">赛博风格</h4>
                <p className="text-sm text-gray-400">
                  发光效果和流畅动画，完美融入设计
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 示例文章内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-16 border-t border-cyber-border"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
            示例文章内容
          </h2>
          <div
            className="cyber-card prose-cyber max-w-none"
            dangerouslySetInnerHTML={{ __html: sampleArticle }}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="cyber-card inline-flex flex-col items-center gap-4">
            <h3 className="text-xl font-display font-bold text-white">
              准备好使用这些组件了吗？
            </h3>
            <p className="text-gray-400">
              在你的项目中引入这些实用工具，提升用户体验
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-button flex items-center gap-2"
            >
              <span>查看文档</span>
              <ArrowRightIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
