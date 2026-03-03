'use client';

/**
 * Reading Progress Examples - 阅读进度组件示例
 */

import { ReadingProgress, ReadingProgressRing } from '@/components/reading-progress';

export default function ReadingProgressExamples() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 顶部进度条 */}
      <ReadingProgress showPercentage />

      {/* 内容容器 */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">
          阅读进度组件示例
        </h1>

        {/* 示例内容 */}
        <div className="cyber-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
            什么是阅读进度？
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            阅读进度指示器是一种用户界面元素，用于显示用户在文档或页面上的阅读进度。
            它可以帮助读者了解他们在文章中的位置，以及还有多少内容需要阅读。
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            这个组件库提供了两种风格的阅读进度指示器：
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
            <li>顶部/底部进度条 - 显示线性进度</li>
            <li>环形指示器 - 显示圆形进度，可点击返回顶部</li>
          </ul>

          <h2 className="text-2xl font-bold text-cyber-purple mb-4 mt-8">
            使用场景
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            阅读进度指示器特别适用于：
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
            <li>长篇文章和博客帖子</li>
            <li>教程和文档页面</li>
            <li>研究报告和白皮书</li>
            <li>任何需要较长时间阅读的内容</li>
          </ul>

          {/* 添加更多内容以展示滚动效果 */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="mt-8">
              <h3 className="text-xl font-semibold text-cyber-pink mb-3">
                章节 {i + 1}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                这里是一些示例文本内容。当你滚动页面时，你会注意到顶部的进度条
                会在移动，显示你的阅读进度。同时，右下角的环形指示器也会更新。
                点击环形指示器可以快速返回页面顶部。
              </p>
              <p className="text-gray-300 leading-relaxed mt-3">
                组件使用了 Framer Motion 来实现平滑的动画效果，
                并且会在滚动超过一定距离后自动显示。
              </p>
            </div>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="cyber-card p-6 mt-12">
          <h2 className="text-xl font-bold text-white mb-4">使用方法</h2>
          <pre className="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { ReadingProgress, ReadingProgressRing } from '@/components/reading-progress';

// 顶部进度条
<ReadingProgress showPercentage />

// 环形指示器
<ReadingProgressRing size={120} strokeWidth={8} />

// 自定义颜色和高度
<ReadingProgress 
  color="#00f0ff" 
  height={4} 
  position="top" 
  showPercentage 
/>`}
          </pre>
        </div>
      </div>

      {/* 环形指示器 */}
      <ReadingProgressRing />
    </div>
  );
}
