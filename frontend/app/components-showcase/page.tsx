'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TagInput, TagCloud } from '@/components/tag-input/TagInput'
import { Rating, RatingDisplay, RatingStats } from '@/components/rating/Rating'
import { DonutChart, BarChart } from '@/components/data-viz/DonutChart'
import { TreeView, FileTree } from '@/components/tree-view/TreeView'
import { ColorPicker } from '@/components/color-picker/ColorPicker'
import { CodeEditor, CodePreview } from '@/components/code-editor/CodeEditor'
import { FileUpload } from '@/components/file-upload/FileUpload'
import { Timeline, MilestoneTimeline } from '@/components/timeline/Timeline'
import { SearchInput } from '@/components/search/SearchInput'
import { VirtualList } from '@/components/virtual-list/VirtualList'

export default function ComponentsShowcase() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])
  const [rating, setRating] = useState(4)
  const [color, setColor] = useState('#00f0ff')
  const [code, setCode] = useState(`function hello() {
  console.log('Hello, CyberPress!');
  return 'Welcome to the future';
}`)
  const [searchQuery, setSearchQuery] = useState('')

  // 图表数据
  const chartData = [
    { label: 'React', value: 40, color: '#61dafb' },
    { label: 'Vue', value: 30, color: '#42b883' },
    { label: 'Angular', value: 20, color: '#dd0031' },
    { label: 'Svelte', value: 10, color: '#ff3e00' },
  ]

  const barData = [
    { label: '一月', value: 65 },
    { label: '二月', value: 45 },
    { label: '三月', value: 78 },
    { label: '四月', value: 52 },
    { label: '五月', value: 88 },
  ]

  // 树形数据
  const treeData = [
    {
      id: '1',
      label: '根目录',
      children: [
        {
          id: '1-1',
          label: '源代码',
          children: [
            { id: '1-1-1', label: 'components' },
            { id: '1-1-2', label: 'lib' },
            { id: '1-1-3', label: 'app' },
          ],
        },
        {
          id: '1-2',
          label: '配置文件',
          children: [
            { id: '1-2-1', label: 'package.json' },
            { id: '1-2-2', label: 'tsconfig.json' },
          ],
        },
      ],
    },
  ]

  // 时间轴数据
  const timelineEvents = [
    {
      id: '1',
      title: '项目启动',
      description: '开始开发 CyberPress 平台',
      date: '2024-01',
      status: 'completed' as const,
      tags: ['里程碑'],
    },
    {
      id: '2',
      title: 'Beta 版本发布',
      description: '发布首个公开测试版本',
      date: '2024-03',
      status: 'completed' as const,
      tags: ['发布'],
    },
    {
      id: '3',
      title: '正式版本',
      description: '发布 1.0 正式版本',
      date: '2024-06',
      status: 'upcoming' as const,
      tags: ['重要'],
    },
  ]

  // 虚拟列表数据
  const listItems = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `项目 ${i + 1}`,
    description: `这是第 ${i + 1} 个项目的描述`,
  }))

  return (
    <div className="min-h-screen bg-cyber-darker p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
            组件展示
          </h1>
          <p className="text-gray-400">
            CyberPress 平台全新的组件库，所有组件均可直接使用
          </p>
        </motion.div>

        {/* 标签输入组件 */}
        <ComponentSection title="标签输入组件" description="支持标签添加、删除、自动补全">
          <div className="space-y-4">
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="输入标签后按回车..."
              suggestions={['React', 'Vue', 'Angular', 'Next.js', 'TypeScript']}
            />
            <div className="pt-4 border-t border-cyber-border">
              <p className="text-sm text-gray-400 mb-2">标签云展示：</p>
              <TagCloud
                tags={tags}
                onTagClick={(tag) => console.log('点击标签:', tag)}
              />
            </div>
          </div>
        </ComponentSection>

        {/* 评分组件 */}
        <ComponentSection title="评分组件" description="支持星级评分、半星、只读展示">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">可交互评分：</p>
              <Rating
                value={rating}
                onChange={setRating}
                allowHalf={true}
                showValue={true}
                size="lg"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">只读展示：</p>
              <RatingDisplay value={4.5} count={128} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">评分统计：</p>
              <RatingStats
                average={4.5}
                total={128}
                distribution={[2, 5, 15, 35, 71]}
              />
            </div>
          </div>
        </ComponentSection>

        {/* 数据可视化组件 */}
        <ComponentSection title="数据可视化组件" description="图表展示，包括甜甜圈图和柱状图">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyber-cyan">甜甜圈图</h3>
              <DonutChart
                data={chartData}
                showLabels={true}
                showLegend={true}
                showPercentage={true}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyber-cyan">柱状图</h3>
              <BarChart
                data={barData}
                height={200}
                showValues={true}
                showLabels={true}
                direction="vertical"
              />
            </div>
          </div>
        </ComponentSection>

        {/* 树形视图组件 */}
        <ComponentSection title="树形视图组件" description="支持展开/收起、自定义图标">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">普通树形</h3>
              <TreeView
                data={treeData}
                onNodeClick={(node) => console.log('点击节点:', node)}
                showIcon={true}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">文件树</h3>
              <FileTree
                files={[
                  {
                    name: 'src',
                    type: 'folder',
                    path: '/src',
                    children: [
                      { name: 'index.tsx', type: 'file', path: '/src/index.tsx', size: 2048 },
                      { name: 'App.tsx', type: 'file', path: '/src/App.tsx', size: 1024 },
                    ],
                  },
                ]}
                showInfo={true}
              />
            </div>
          </div>
        </ComponentSection>

        {/* 颜色选择器组件 */}
        <ComponentSection title="颜色选择器组件" description="支持预设颜色、色相/饱和度/亮度调节">
          <div className="flex items-center gap-8">
            <ColorPicker
              value={color}
              onChange={setColor}
              showPresets={true}
            />
            <div
              className="w-32 h-32 rounded-lg border-2 border-cyber-border shadow-lg"
              style={{ backgroundColor: color }}
            />
          </div>
        </ComponentSection>

        {/* 代码编辑器组件 */}
        <ComponentSection title="代码编辑器组件" description="支持语法高亮、行号、复制、下载">
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            showLineNumbers={true}
            allowFullscreen={true}
            minHeight="200px"
          />
        </ComponentSection>

        {/* 文件上传组件 */}
        <ComponentSection title="文件上传组件" description="支持拖拽、多文件、进度显示">
          <FileUpload
            onFilesChange={(files) => console.log('文件列表:', files)}
            accept="image/*,.pdf,.doc,.docx"
            multiple={true}
            maxFiles={5}
            maxSize={10}
          />
        </ComponentSection>

        {/* 时间轴组件 */}
        <ComponentSection title="时间轴组件" description="支持垂直/水平布局、状态标记">
          <Timeline
            events={timelineEvents}
            layout="vertical"
            position="left"
            showLine={true}
          />
        </ComponentSection>

        {/* 搜索组件 */}
        <ComponentSection title="搜索组件" description="支持自动补全、历史记录、热门搜索">
          <SearchInput
            placeholder="搜索文章、标签、作者..."
            onSearch={(query) => setSearchQuery(query)}
          />
          {searchQuery && (
            <p className="mt-4 text-sm text-gray-400">
              搜索: <span className="text-cyber-cyan">{searchQuery}</span>
            </p>
          )}
        </ComponentSection>

        {/* 虚拟列表组件 */}
        <ComponentSection title="虚拟列表组件" description="高性能渲染大量数据">
          <VirtualList
            items={listItems}
            itemHeight={80}
            renderItem={(item) => (
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg mb-2">
                <h3 className="text-lg font-semibold text-cyber-cyan">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            )}
            containerHeight={400}
          />
        </ComponentSection>
      </div>
    </div>
  )
}

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-cyber-card border border-cyber-border rounded-lg p-6 space-y-4"
    >
      <div>
        <h2 className="text-2xl font-bold text-cyber-cyan mb-2">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div>{children}</div>
    </motion.div>
  )
}
