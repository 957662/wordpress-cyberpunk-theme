'use client';

/**
 * AI Assistant Examples - AI 助手组件示例
 */

import { AIAssistant } from '@/components/ai';

const articleContent = `
# 人工智能助手的发展

人工智能助手（AI Assistant）正在改变我们与技术的交互方式。
从简单的聊天机器人到复杂的智能系统，AI 助手已经渗透到我们生活的方方面面。

## 主要功能

现代 AI 助手具备以下核心功能：

1. **自然语言理解** - 理解用户的意图和上下文
2. **智能对话** - 进行多轮对话，记住对话历史
3. **任务执行** - 帮助用户完成各种任务
4. **学习能力** - 从交互中不断学习和改进

## 应用场景

AI 助手在多个领域都有广泛应用：
- 客户服务
- 内容创作
- 代码辅助
- 教育培训
- 数据分析

## 未来展望

随着大语言模型（LLM）的快速发展，AI 助手将变得更加智能和个性化，
能够更好地理解用户需求，提供更精准的帮助。

（向下滚动查看 AI 助手浮动按钮）
`.repeat(5);

export default function AIAssistantExamples() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI 助手组件
          </h1>
          <p className="text-xl text-gray-400">
            点击右下角的机器人图标开始对话
          </p>
        </div>

        {/* 示例内容 */}
        <div className="cyber-card p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
              关于 AI 助手
            </h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {articleContent}
            </div>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="cyber-card p-6">
            <h3 className="text-xl font-bold text-cyber-purple mb-4">
              核心功能
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">✦</span>
                <span>智能对话系统</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">✦</span>
                <span>快捷操作按钮</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">✦</span>
                <span>建议问题提示</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">✦</span>
                <span>实时打字效果</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">✦</span>
                <span>最小化/展开功能</span>
              </li>
            </ul>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-xl font-bold text-cyber-pink mb-4">
              使用场景
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">✦</span>
                <span>文章内容答疑</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">✦</span>
                <span>代码问题辅助</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">✦</span>
                <span>创意灵感生成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">✦</span>
                <span>内容总结分析</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">✦</span>
                <span>24/7 在线支持</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="cyber-card p-6 mt-12">
          <h2 className="text-xl font-bold text-white mb-4">使用方法</h2>
          <pre className="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { AIAssistant } from '@/components/ai';

<AIAssistant
  defaultOpen={false}
  welcomeMessage="你好！我是 AI 助手"
  suggestions={[
    '如何优化 React 性能？',
    '解释 TypeScript 泛型',
    'Tailwind CSS 最佳实践',
  ]}
/>`}
          </pre>

          <div className="mt-6 p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
            <p className="text-sm text-cyber-cyan">
              💡 提示：点击右下角的浮动按钮即可打开 AI 助手！
            </p>
          </div>
        </div>
      </div>

      {/* AI 助手 */}
      <AIAssistant
        defaultOpen={false}
        welcomeMessage="你好！我是 CyberPress 的 AI 助手。有什么可以帮助你的吗？"
        suggestions={[
          '如何使用阅读进度组件？',
          '代码分享组件支持哪些语言？',
          '如何自定义主题颜色？',
          '协作编辑功能如何使用？',
        ]}
      />
    </div>
  );
}
