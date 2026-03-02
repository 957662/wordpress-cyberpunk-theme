'use client';

/**
 * New Features Demo Page
 * 新功能演示页面 - 展示所有最新创建的组件
 */

import { useState } from 'react';
import { VoiceRecognizer } from '@/components/voice';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { SmartForm, Validators } from '@/components/ui/SmartForm';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import { EnhancedFileUpload } from '@/components/upload/EnhancedFileUpload';
import { LineChart } from '@/components/charts/LineChart';
import { useSpeechSynthesis } from '@/components/hooks/useSpeechSynthesis';

export default function NewFeaturesDemoPage() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 语音合成 Hook
  const { speak, state: speakState } = useSpeechSynthesis();

  // 示例数据
  const chartData = [
    {
      data: [
        { x: 0, y: 10, label: 'Jan' },
        { x: 1, y: 25, label: 'Feb' },
        { x: 2, y: 20, label: 'Mar' },
        { x: 3, y: 35, label: 'Apr' },
        { x: 4, y: 30, label: 'May' },
        { x: 5, y: 45, label: 'Jun' },
      ],
      color: '#00f0ff',
      label: '访问量',
      fill: true,
      gradient: true,
    },
    {
      data: [
        { x: 0, y: 5, label: 'Jan' },
        { x: 1, y: 15, label: 'Feb' },
        { x: 2, y: 25, label: 'Mar' },
        { x: 3, y: 20, label: 'Apr' },
        { x: 4, y: 35, label: 'May' },
        { x: 5, y: 30, label: 'Jun' },
      ],
      color: '#9d00ff',
      label: '用户数',
      fill: true,
      gradient: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* 网络状态 */}
      <NetworkStatus position="top" showDetails={true} />

      {/* 性能监控 */}
      <PerformanceMonitor
        position="bottom-right"
        showDetails={true}
        theme="dark"
      />

      {/* 页面标题 */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          新功能演示
        </h1>
        <p className="text-gray-400 text-lg">
          探索最新的组件和功能 - 实时交互演示
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 语音识别 */}
        <section className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-cyan-400">🎤</span>
            语音识别
          </h2>
          <p className="text-gray-400 mb-6">
            支持多语言实时语音识别和语音命令
          </p>
          <div className="flex justify-center">
            <VoiceRecognizer
              language="zh-CN"
              commands={[
                {
                  phrase: ['刷新页面', '重新加载'],
                  action: () => window.location.reload(),
                  description: '刷新当前页面',
                },
                {
                  phrase: ['清空', '清除'],
                  action: () => console.log('Clear screen'),
                  description: '清空屏幕',
                },
              ]}
              theme="cyan"
              size="lg"
              onResult={(transcript, isFinal) => {
                if (isFinal) {
                  console.log('识别结果:', transcript);
                }
              }}
            />
          </div>
        </section>

        {/* 语音合成 */}
        <section className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">🔊</span>
            语音合成
          </h2>
          <p className="text-gray-400 mb-6">
            文字转语音功能，支持多种语音和语调
          </p>
          <div className="space-y-4">
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none"
              rows={4}
              placeholder="输入要朗读的文字..."
              id="tts-input"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const input = document.getElementById('tts-input') as HTMLTextAreaElement;
                  if (input?.value) {
                    speak(input.value);
                  }
                }}
                disabled={speakState === 'speaking'}
                className="flex-1 px-6 py-3 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {speakState === 'speaking' ? '正在朗读...' : '开始朗读'}
              </button>
            </div>
          </div>
        </section>

        {/* 智能表单 */}
        <section className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-pink-400">📝</span>
            智能表单
          </h2>
          <p className="text-gray-400 mb-6">
            带验证、自动保存和字段联动的智能表单
          </p>
          <SmartForm
            fields={[
              {
                name: 'username',
                label: '用户名',
                type: 'text',
                placeholder: '请输入用户名',
                required: true,
                validators: [
                  Validators.minLength(3),
                  Validators.maxLength(20),
                ],
              },
              {
                name: 'email',
                label: '邮箱',
                type: 'email',
                placeholder: 'example@email.com',
                required: true,
                validators: [Validators.email],
              },
              {
                name: 'role',
                label: '角色',
                type: 'select',
                placeholder: '选择角色',
                required: true,
                options: [
                  { label: '管理员', value: 'admin' },
                  { label: '编辑', value: 'editor' },
                  { label: '访客', value: 'guest' },
                ],
              },
              {
                name: 'bio',
                label: '个人简介',
                type: 'textarea',
                placeholder: '介绍一下你自己...',
                validators: [Validators.maxLength(200)],
              },
            ]}
            initialValues={{
              username: '',
              email: '',
              role: '',
              bio: '',
            }}
            onSubmit={async (data) => {
              console.log('表单提交:', data);
              alert('表单提交成功！查看控制台');
            }}
            autoSave={true}
            theme="dark"
          />
        </section>

        {/* 倒计时 */}
        <section className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">⏰</span>
            倒计时
          </h2>
          <p className="text-gray-400 mb-6">
            精确的倒计时组件，支持暂停和恢复
          </p>
          <div className="flex justify-center">
            <CountdownTimer
              targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              format="full"
              showDays={true}
              showHours={true}
              showMinutes={true}
              showSeconds={true}
              theme="cyan"
              size="lg"
              onComplete={() => alert('倒计时结束！')}
            />
          </div>
        </section>

        {/* 文件上传 */}
        <section className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">📁</span>
            文件上传
          </h2>
          <p className="text-gray-400 mb-6">
            支持拖拽、预览和进度显示的文件上传
          </p>
          <EnhancedFileUpload
            accept={['image/*', 'application/pdf']}
            maxSize={5}
            maxFiles={3}
            multiple={true}
            showPreview={true}
            showProgress={true}
            theme="cyan"
            onUpload={async (files) => {
              // 模拟上传
              return new Promise((resolve) => {
                setTimeout(() => {
                  const urls = files.map((file, i) => `https://example.com/${file.name}`);
                  setUploadedFiles([...uploadedFiles, ...urls]);
                  resolve(urls);
                }, 2000);
              });
            }}
          />
        </section>

        {/* 数据图表 */}
        <section className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-400">📊</span>
            数据图表
          </h2>
          <p className="text-gray-400 mb-6">
            SVG 交互式折线图，支持多条线和渐变填充
          </p>
          <div className="overflow-x-auto">
            <LineChart
              lines={chartData}
              width={600}
              height={300}
              showGrid={true}
              showTooltip={true}
              showLegend={true}
              theme="dark"
              onPointClick={(lineIndex, pointIndex, point) => {
                console.log('Clicked:', point);
              }}
            />
          </div>
        </section>
      </div>

      {/* 页脚 */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-gray-500">
        <p>所有组件都支持自定义主题、尺寸和样式</p>
        <p className="mt-2">
          查看源代码了解更多使用方法
        </p>
      </footer>
    </div>
  );
}
