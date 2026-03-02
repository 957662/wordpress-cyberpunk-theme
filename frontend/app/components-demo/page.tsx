/**
 * 组件演示页面
 * 展示所有新增的 UI 组件
 */

'use client';

import { useState } from 'react';
import { DataGrid, Column } from '@/components/ui/DataGrid';
import { Stepper, StepContent, StepNavigation } from '@/components/ui/Stepper';
import { ProgressBar, CircularProgress, ProgressSteps } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import { Tooltip } from '@/components/ui/Tooltip';
import { EmptyState, LoadingState, ErrorState } from '@/components/ui/EmptyState';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/ui/Drawer';
import { Inbox, Loader2, AlertCircle, Plus, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComponentsDemoPage() {
  // DataGrid 数据
  const [gridData] = useState([
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '在线' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', status: '离线' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '作者', status: '在线' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '订阅者', status: '离线' },
    { id: 5, name: '钱七', email: 'qianqi@example.com', role: '作者', status: '在线' },
  ]);

  const gridColumns: Column<typeof gridData[0]>[] = [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'name', title: '姓名', sortable: true },
    { key: 'email', title: '邮箱' },
    { key: 'role', title: '角色', sortable: true },
    {
      key: 'status',
      title: '状态',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === '在线'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Stepper 数据
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { id: '1', title: '第一步', description: '填写基本信息' },
    { id: '2', title: '第二步', description: '验证身份' },
    { id: '3', title: '第三步', description: '完成设置' },
    { id: '4', title: '第四步', description: '开始使用' },
  ];

  // Drawer 状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 进度状态
  const [progress, setProgress] = useState(65);

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-cyber-cyan mb-4">组件展示</h1>
          <p className="text-gray-400">赛博朋克风格 UI 组件库演示</p>
        </motion.div>

        {/* DataGrid */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">数据表格</h2>
          <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
            <DataGrid
              data={gridData}
              columns={gridColumns}
              keyField="id"
              pageSize={5}
            />
          </div>
        </section>

        {/* Stepper */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">步骤条</h2>
          <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />

            <StepContent show={currentStep === 0}>
              <div className="bg-cyber-dark/80 p-4 rounded-lg border border-cyber-cyan/20">
                <p className="text-gray-300">第一步：填写您的基本信息...</p>
              </div>
            </StepContent>

            <StepContent show={currentStep === 1}>
              <div className="bg-cyber-dark/80 p-4 rounded-lg border border-cyber-cyan/20">
                <p className="text-gray-300">第二步：验证您的身份信息...</p>
              </div>
            </StepContent>

            <StepContent show={currentStep === 2}>
              <div className="bg-cyber-dark/80 p-4 rounded-lg border border-cyber-cyan/20">
                <p className="text-gray-300">第三步：完成最后的设置...</p>
              </div>
            </StepContent>

            <StepContent show={currentStep === 3}>
              <div className="bg-cyber-dark/80 p-4 rounded-lg border border-cyber-cyan/20">
                <p className="text-gray-300">第四步：准备开始使用！</p>
              </div>
            </StepContent>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={() => setCurrentStep(Math.max(0, currentStep - 1))}
              onNext={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              onSubmit={() => alert('提交成功！')}
            />
          </div>
        </section>

        {/* Progress Bars */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">进度条</h2>
          <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-white mb-2">线性进度条</h3>
              <ProgressBar value={progress} variant="cyan" showLabel striped />
            </div>

            <div>
              <h3 className="text-white mb-2">圆形进度条</h3>
              <div className="flex gap-4">
                <CircularProgress value={progress} variant="cyan" />
                <CircularProgress value={80} variant="purple" />
                <CircularProgress value={45} variant="pink" />
              </div>
            </div>

            <div>
              <h3 className="text-white mb-2">步骤进度</h3>
              <ProgressSteps
                steps={[
                  { label: '注册', completed: true },
                  { label: '验证', completed: true },
                  { label: '配置', completed: false },
                  { label: '完成', completed: false },
                ]}
                currentStep={1}
              />
            </div>

            <button
              onClick={() => setProgress(Math.min(100, progress + 10))}
              className="px-4 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/90 transition-colors"
            >
              增加进度
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">标签页</h2>
          <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
            <Tabs
              tabs={[
                {
                  id: 'tab1',
                  label: '概述',
                  content: (
                    <div className="text-gray-300">
                      这是概述标签页的内容。您可以在这里放置组件的介绍信息。
                    </div>
                  ),
                },
                {
                  id: 'tab2',
                  label: '使用示例',
                  content: (
                    <div className="text-gray-300">
                      这是使用示例标签页的内容。您可以在这里展示组件的使用代码。
                    </div>
                  ),
                },
                {
                  id: 'tab3',
                  label: 'API 文档',
                  content: (
                    <div className="text-gray-300">
                      这是 API 文档标签页的内容。您可以在这里列出组件的所有属性。
                    </div>
                  ),
                },
              ]}
              variant="enclosed"
            />
          </div>
        </section>

        {/* Tooltip */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">提示框</h2>
          <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
            <div className="flex gap-4">
              <Tooltip content="这是一个提示信息" placement="top">
                <button className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-colors">
                  上方提示
                </button>
              </Tooltip>

              <Tooltip content="这是一个提示信息" placement="bottom" variant="purple">
                <button className="px-4 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/90 transition-colors">
                  下方提示
                </button>
              </Tooltip>

              <Tooltip content="这是一个提示信息" placement="left" variant="pink">
                <button className="px-4 py-2 bg-cyber-pink text-white rounded-lg hover:bg-cyber-pink/90 transition-colors">
                  左侧提示
                </button>
              </Tooltip>

              <Tooltip content="这是一个提示信息" placement="right" variant="cyan">
                <button className="px-4 py-2 bg-cyber-dark border border-cyber-cyan text-cyber-cyan rounded-lg hover:bg-cyber-cyan/10 transition-colors">
                  右侧提示
                </button>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* Empty States */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">状态组件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
              <EmptyState
                icon={Inbox}
                title="暂无数据"
                description="还没有任何内容，点击下方按钮创建"
                action={{ label: '创建内容', onClick: () => alert('创建') }}
              />
            </div>

            <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
              <LoadingState title="加载中..." description="正在获取数据，请稍候" />
            </div>

            <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
              <ErrorState
                description="加载失败，请检查网络连接后重试"
                action={{ label: '重试', onClick: () => alert('重试') }}
              />
            </div>
          </div>
        </section>

        {/* Drawer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">抽屉</h2>
          <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg p-6">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/90 transition-colors"
            >
              打开抽屉
            </button>

            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              placement="right"
              size="md"
            >
              <DrawerHeader>
                <h3 className="text-xl font-bold text-white">抽屉标题</h3>
                <p className="text-gray-400 text-sm mt-1">这是一个右侧抽屉</p>
              </DrawerHeader>

              <DrawerBody>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    这是抽屉的内容区域。您可以在这里放置任何内容。
                  </p>
                  <div className="bg-cyber-dark/80 p-4 rounded-lg border border-cyber-cyan/20">
                    <p className="text-sm text-gray-400">
                      这是一个示例内容块，用于演示抽屉的布局效果。
                    </p>
                  </div>
                </div>
              </DrawerBody>

              <DrawerFooter>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2 border border-cyber-cyan/30 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/10 transition-colors"
                  >
                    取消
                  </button>
                  <button className="px-4 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/90 transition-colors">
                    确认
                  </button>
                </div>
              </DrawerFooter>
            </Drawer>
          </div>
        </section>
      </div>
    </div>
  );
}
