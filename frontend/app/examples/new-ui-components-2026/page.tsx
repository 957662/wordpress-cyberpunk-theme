/**
 * 新 UI 组件展示页面
 * 展示所有新创建的 UI 组件
 */

'use client';

import { useState } from 'react';
import {
  Tooltip,
  SimpleTooltip,
  IconTooltip,
} from '@/components/ui/tooltip/Tooltip';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  SimpleDropdown,
} from '@/components/ui/dropdown/Dropdown';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsTriggerIcon,
  SimpleTabs,
} from '@/components/ui/tabs/Tabs';
import {
  Progress,
  CircularProgress,
  StepProgress,
  LoadingProgress,
  FileUploadProgress,
} from '@/components/ui/progress/Progress';
import {
  Skeleton,
  SkeletonText,
  SkeletonTitle,
  SkeletonCard,
  SkeletonListItem,
  SkeletonBlogPost,
  SkeletonStats,
  LoadingState,
} from '@/components/ui/skeleton/Skeleton';
import {
  CommandDialog,
  CommandTrigger,
  useCommandDialogShortcut,
  FullCommandDialog,
} from '@/components/ui/command-dialog/CommandDialog';
import { Info, HelpCircle, Settings, User, LogOut, FileText, ChevronDown } from 'lucide-react';

export default function NewUIComponentsShowcase() {
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  useCommandDialogShortcut(() => setCommandDialogOpen(true));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              新 UI 组件展示
            </h1>
            <p className="text-gray-400 mt-1">2026-03-07 创建的核心组件演示</p>
          </div>
          <CommandTrigger
            onOpen={() => setCommandDialogOpen(true)}
            label="命令面板"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Tooltip Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Tooltip 提示</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">基础 Tooltip</h3>
              <div className="space-y-4">
                <Tooltip content="这是一个顶部提示" position="top">
                  <button className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors">
                    顶部提示
                  </button>
                </Tooltip>
                <Tooltip content="这是一个底部提示" position="bottom">
                  <button className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                    底部提示
                  </button>
                </Tooltip>
                <Tooltip content="这是一个左侧提示" position="left">
                  <button className="px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
                    左侧提示
                  </button>
                </Tooltip>
                <Tooltip content="这是一个右侧提示" position="right">
                  <button className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                    右侧提示
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">简化 Tooltip</h3>
              <div className="space-y-4">
                <SimpleTooltip title="快速提示">
                  <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    悬停查看
                  </button>
                </SimpleTooltip>
                <SimpleTooltip title="另一个提示">
                  <span className="text-gray-400">悬停这段文字</span>
                </SimpleTooltip>
              </div>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">图标 Tooltip</h3>
              <div className="space-y-4">
                <IconTooltip icon={<Info className="w-4 h-4" />} content="这是一条重要信息" />
                <IconTooltip icon={<HelpCircle className="w-4 h-4" />} content="需要帮助吗？" />
              </div>
            </div>
          </div>
        </section>

        {/* Dropdown Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Dropdown 下拉菜单</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">基础 Dropdown</h3>
              <Dropdown>
                <DropdownTrigger className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2">
                  打开菜单
                  <ChevronDown className="w-4 h-4" />
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem icon={<FileText className="w-4 h-4" />}>
                    新建文档
                  </DropdownItem>
                  <DropdownItem icon={<Settings className="w-4 h-4" />}>
                    设置
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownLabel>账户</DropdownLabel>
                  <DropdownItem icon={<User className="w-4 h-4" />}>
                    个人资料
                  </DropdownItem>
                  <DropdownItem icon={<LogOut className="w-4 h-4" />}>
                    退出登录
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">简化 Dropdown</h3>
              <SimpleDropdown
                trigger={<span>选择操作</span>}
                items={[
                  { label: '编辑', onClick: () => alert('编辑') },
                  { label: '复制', onClick: () => alert('复制') },
                  { label: '删除', onClick: () => alert('删除'), disabled: true },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-pink-400">Tabs 标签页</h2>
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <SimpleTabs
              tabs={[
                {
                  value: 'tab1',
                  label: '概览',
                  content: (
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">概览内容</h3>
                      <p className="text-gray-400">这是第一个标签页的内容。</p>
                    </div>
                  ),
                },
                {
                  value: 'tab2',
                  label: '详情',
                  content: (
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">详细信息</h3>
                      <p className="text-gray-400">这是第二个标签页的内容。</p>
                    </div>
                  ),
                },
                {
                  value: 'tab3',
                  label: '设置',
                  content: (
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">设置选项</h3>
                      <p className="text-gray-400">这是第三个标签页的内容。</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>

        {/* Progress Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-green-400">Progress 进度条</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">线性进度条</h3>
                <div className="space-y-4">
                  <Progress value={30} showLabel label="上传文件" showPercentage />
                  <Progress value={60} variant="purple" showPercentage />
                  <Progress value={90} variant="pink" striped animated />
                </div>
              </div>

              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">圆形进度条</h3>
                <div className="flex justify-center gap-8">
                  <CircularProgress value={75} variant="cyan" />
                  <CircularProgress value={50} variant="purple" label="完成率" />
                  <CircularProgress value={90} variant="pink" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">步骤进度</h3>
                <StepProgress
                  steps={[
                    { id: '1', label: '步骤 1' },
                    { id: '2', label: '步骤 2' },
                    { id: '3', label: '步骤 3' },
                    { id: '4', label: '步骤 4' },
                  ]}
                  currentStep={2}
                />
              </div>

              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">加载进度</h3>
                <LoadingProgress label="正在处理..." />
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Skeleton 骨架屏</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">卡片骨架屏</h3>
              <SkeletonCard showAvatar lines={4} />
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">博客文章骨架屏</h3>
              <SkeletonBlogPost />
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">统计骨架屏</h3>
              <SkeletonStats count={4} />
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">列表项骨架屏</h3>
              <div className="space-y-3">
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </div>
            </div>
          </div>
        </section>

        {/* Command Dialog Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Command Dialog 命令对话框</h2>
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-400 mb-4">
              点击下方按钮或使用快捷键 <kbd className="px-2 py-1 bg-gray-800 rounded">⌘K</kbd> 或 <kbd className="px-2 py-1 bg-gray-800 rounded">Ctrl+K</kbd> 打开命令面板
            </p>
            <CommandTrigger
              onOpen={() => setCommandDialogOpen(true)}
              label="打开命令面板"
            />
          </div>
        </section>
      </main>

      {/* Command Dialog */}
      <FullCommandDialog
        isOpen={commandDialogOpen}
        onClose={() => setCommandDialogOpen(false)}
        additionalCommands={[
          {
            id: 'showcase',
            label: '查看组件展示',
            description: '打开组件展示页面',
            icon: <FileText className="w-4 h-4" />,
            action: () => console.log('打开组件展示'),
            category: '导航',
          },
        ]}
      />
    </div>
  );
}
