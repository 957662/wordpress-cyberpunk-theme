'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Card, CardBody } from '@/components/ui/Card'
import { Sparkles, Rocket, Code, Eye } from 'lucide-react'
import { RealtimeSearchSuggestions } from '@/components/search-advanced/RealtimeSearchSuggestions'
import { ReadingHistory } from '@/components/reading/ReadingHistory'
import { AdvancedDataChart } from '@/components/analytics/AdvancedDataChart'
import { EnhancedSocialShare } from '@/components/social-share/EnhancedSocialShare'
import { CodeSandbox } from '@/components/code-preview/CodeSandbox'
import { AIChatAssistant } from '@/components/ai-assistant/AIChatAssistant'

export default function NewComponentsShowcasePage() {
  // 示例图表数据
  const chartData = {
    datasets: [
      {
        id: 'views',
        name: '浏览量',
        color: '#00f0ff',
        data: [
          { label: '周一', value: 1200, change: 12 },
          { label: '周二', value: 1900, change: 8 },
          { label: '周三', value: 1500, change: -5 },
          { label: '周四', value: 2100, change: 15 },
          { label: '周五', value: 1800, change: 3 },
          { label: '周六', value: 2400, change: 20 },
          { label: '周日', value: 2200, change: 8 },
        ],
      },
      {
        id: 'users',
        name: '用户数',
        color: '#9d00ff',
        data: [
          { label: '周一', value: 800, change: 10 },
          { label: '周二', value: 1200, change: 15 },
          { label: '周三', value: 1100, change: -8 },
          { label: '周四', value: 1600, change: 18 },
          { label: '周五', value: 1400, change: 5 },
          { label: '周六', value: 1800, change: 22 },
          { label: '周日', value: 1700, change: 6 },
        ],
      },
    ],
  }

  // 示例代码
  const exampleCode = `// 欢迎使用代码沙盒!
// 这里是一个简单的示例

function greet(name) {
  return \`你好, \${name}!\`;
}

// 计算数组平均值
function average(numbers) {
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
}

// 测试代码
console.log(greet('开发者'));

const numbers = [1, 2, 3, 4, 5];
console.log('平均值:', average(numbers));

// 尝试修改代码并点击运行!
`

  return (
    <div className="min-h-screen bg-[var(--cyber-bg)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full mb-6"
            >
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <span className="text-lg font-semibold text-gray-100">全新组件库</span>
            </motion.div>

            <h1 className="text-5xl font-bold font-orbitron text-glow-cyan mb-4">
              新功能展示
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              探索我们最新添加的高级组件,每个都经过精心设计,功能完整
            </p>
          </div>

          {/* 组件展示网格 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* 实时搜索组件 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated">
                <CardBody>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">实时搜索建议</h3>
                      <p className="text-sm text-gray-400">智能搜索提示和历史记录</p>
                    </div>
                  </div>

                  <RealtimeSearchSuggestions
                    onSearch={(query) => console.log('搜索:', query)}
                    placeholder="搜索文章、标签、作者..."
                    className="mb-4"
                  />

                  <div className="space-y-2 text-sm text-gray-400">
                    <p>✨ 实时搜索建议</p>
                    <p>📜 搜索历史记录</p>
                    <p>🔥 热门搜索展示</p>
                    <p>⌨️ 键盘导航支持</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* 社交分享组件 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated">
                <CardBody>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">社交分享组件</h3>
                      <p className="text-sm text-gray-400">多平台分享和二维码生成</p>
                    </div>
                  </div>

                  <EnhancedSocialShare
                    title="CyberPress Platform - 赛博朋克风格博客平台"
                    description="探索最新的Web开发技术和设计趋势"
                    tags={['NextJS', 'React', 'TypeScript']}
                    variant="card"
                  />
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* 数据可视化组件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <Card variant="elevated">
              <CardBody>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-100">高级数据可视化</h3>
                    <p className="text-sm text-gray-400">交互式图表和实时数据展示</p>
                  </div>
                </div>

                <AdvancedDataChart
                  title="本周数据统计"
                  description="浏览量和用户数增长趋势"
                  datasets={chartData.datasets}
                  chartType="area"
                  timeRange="7d"
                  height={350}
                  onDataPointClick={(datasetId, point) => console.log('点击:', datasetId, point)}
                />
              </CardBody>
            </Card>
          </motion.div>

          {/* 代码沙盒组件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Card variant="elevated">
              <CardBody>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-100">在线代码沙盒</h3>
                    <p className="text-sm text-gray-400">实时编写和执行代码</p>
                  </div>
                </div>

                <CodeSandbox
                  initialCode={exampleCode}
                  language="javascript"
                  showPreview={false}
                  showConsole={true}
                  layout="split"
                />
              </CardBody>
            </Card>
          </motion.div>

          {/* 阅读历史组件 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <ReadingHistory
              limit={5}
              showFilters={true}
              showSearch={true}
            />
          </motion.div>

          {/* 功能特性 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="elevated">
              <CardBody>
                <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                  组件特性
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: '完整实现',
                      description: '每个组件都是完整的功能实现,没有占位符',
                      icon: '✅',
                    },
                    {
                      title: '类型安全',
                      description: '完整的TypeScript类型定义,提供最佳开发体验',
                      icon: '🔒',
                    },
                    {
                      title: '响应式设计',
                      description: '完美适配各种屏幕尺寸和设备',
                      icon: '📱',
                    },
                    {
                      title: '赛博朋克风格',
                      description: '统一的设计语言,霓虹色彩和发光效果',
                      icon: '🌟',
                    },
                    {
                      title: '动画效果',
                      description: '流畅的Framer Motion动画和过渡效果',
                      icon: '✨',
                    },
                    {
                      title: '可定制性',
                      description: '丰富的配置选项,轻松自定义外观和行为',
                      icon: '🎨',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="text-4xl mb-3">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-gray-100 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      {/* AI助手悬浮按钮 */}
      <AIChatAssistant
        title="AI 助手"
        initialMessage="你好!我是AI助手。你可以问我关于这些组件的问题,或者让我帮你生成代码!"
        suggestedPrompts={[
          '解释实时搜索组件的工作原理',
          '如何自定义数据图表?',
          '生成一个使用这些组件的示例',
        ]}
      />
    </div>
  )
}
