/**
 * 赛博朋克组件展示页面
 * 展示所有新创建的赛博朋克风格组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CyberInput } from '@/components/forms/CyberInput';
import { CyberSelect } from '@/components/forms/CyberSelect';
import { CyberToggle } from '@/components/ui/toggle/CyberToggle';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { SocialShareButtons } from '@/components/share/SocialShareButtons';
import { MiniChart } from '@/components/dashboard/MiniChart';
import { useCyberTheme, useCyberTypewriter, useCyberProgress } from '@/hooks';
import { cn } from '@/lib/utils';

export default function CyberComponentsShowcase() {
  const { theme, setColor, toggleDarkMode, toggleNeonEffects } = useCyberTheme();
  const { currentText } = useCyberTypewriter(['赛博朋克', '组件库', '展示页面'], { duration: 150, delay: 2000 });
  const { progress, reset: resetProgress } = useCyberProgress(2000);

  const [selectValue, setSelectValue] = useState<string>('option1');
  const [toggleValue, setToggleValue] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 示例数据
  const chartData = [
    { date: '2026-03-01', value: 100 },
    { date: '2026-03-02', value: 150 },
    { date: '2026-03-03', value: 120 },
    { date: '2026-03-04', value: 180 },
    { date: '2026-03-05', value: 200 },
    { date: '2026-03-06', value: 170 },
    { date: '2026-03-07', value: 220 },
  ];

  const selectOptions = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
    { value: 'option4', label: '选项 4' },
    { value: 'option5', label: '选项 5' },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-6xl font-display font-bold mb-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
          CyberPress
        </h1>
        <p className="text-2xl text-cyber-cyan font-mono">
          {currentText}
          <span className="animate-pulse">_</span>
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 表单组件展示 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-cyber-card border-2 border-cyber-cyan/30 rounded-lg p-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold text-cyber-cyan mb-6 flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            表单组件
          </h2>

          <div className="space-y-6">
            {/* 输入框 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CyberInput
              </label>
              <CyberInput
                label="用户名"
                placeholder="请输入用户名"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                color="cyan"
                clearable
              />
            </div>

            {/* 选择器 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CyberSelect
              </label>
              <CyberSelect
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="选择一个选项"
                color="purple"
                searchable
              />
            </div>

            {/* 切换开关 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CyberToggle
              </label>
              <div className="space-y-3">
                <CyberToggle
                  checked={toggleValue}
                  onChange={setToggleValue}
                  color="cyan"
                  label="启用功能"
                />
                <CyberToggle
                  checked={true}
                  onChange={() => {}}
                  color="purple"
                  label="紫色主题"
                />
                <CyberToggle
                  checked={false}
                  onChange={() => {}}
                  color="pink"
                  label="粉色主题"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 图表组件展示 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-cyber-card border-2 border-cyber-purple/30 rounded-lg p-6 shadow-[0_0_30px_rgba(157,0,255,0.2)]"
        >
          <h2 className="text-2xl font-bold text-cyber-purple mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            数据可视化
          </h2>

          <div className="space-y-6">
            {/* 活动图表 */}
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">ActivityChart</h3>
              <ActivityChart
                data={chartData}
                color="cyan"
                height={200}
                showArea
                showDots
                showGrid
                smooth
              />
            </div>

            {/* 迷你图表 */}
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">MiniChart</h3>
              <div className="grid grid-cols-2 gap-4">
                <MiniChart
                  data={[10, 20, 15, 30, 25, 40, 35]}
                  color="cyan"
                  height={80}
                  showArea
                  smooth
                />
                <MiniChart
                  data={[35, 25, 40, 30, 15, 20, 10]}
                  color="purple"
                  height={80}
                  showArea
                  smooth
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 分享组件展示 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-cyber-card border-2 border-cyber-pink/30 rounded-lg p-6 shadow-[0_0_30px_rgba(255,0,128,0.2)]"
        >
          <h2 className="text-2xl font-bold text-cyber-pink mb-6 flex items-center gap-2">
            <span className="text-3xl">🔗</span>
            社交分享
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">SocialShareButtons</h3>
              <SocialShareButtons
                url="https://cyberpress.example.com"
                title="CyberPress - 赛博朋克博客平台"
                description="一个基于 Next.js 的赛博朋克风格博客平台"
                variant="horizontal"
                size="md"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">垂直布局</h3>
              <div className="flex justify-center">
                <SocialShareButtons
                  url="https://cyberpress.example.com"
                  title="CyberPress"
                  variant="vertical"
                  size="lg"
                  showLabel
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 进度条展示 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-cyber-card border-2 border-cyber-green/30 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,136,0.2)]"
        >
          <h2 className="text-2xl font-bold text-cyber-green mb-6 flex items-center gap-2">
            <span className="text-3xl">⏳</span>
            动画效果
          </h2>

          <div className="space-y-6">
            {/* 进度条 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-300">进度动画</h3>
                <span className="text-cyber-green font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-4 bg-cyber-dark rounded-full overflow-hidden border border-cyber-green/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-green to-cyber-cyan"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <button
                onClick={resetProgress}
                className="mt-3 px-4 py-2 bg-cyber-green/20 text-cyber-green rounded-lg hover:bg-cyber-green/30 transition-colors text-sm"
              >
                重新播放
              </button>
            </div>

            {/* 主题控制 */}
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">主题控制</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setColor('cyan')}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg transition-all',
                    theme.color === 'cyan' ? 'bg-cyber-cyan text-black' : 'bg-cyber-cyan/20 text-cyber-cyan'
                  )}
                >
                  青色主题
                </button>
                <button
                  onClick={() => setColor('purple')}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg transition-all',
                    theme.color === 'purple' ? 'bg-cyber-purple text-white' : 'bg-cyber-purple/20 text-cyber-purple'
                  )}
                >
                  紫色主题
                </button>
                <button
                  onClick={() => setColor('pink')}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg transition-all',
                    theme.color === 'pink' ? 'bg-cyber-pink text-white' : 'bg-cyber-pink/20 text-cyber-pink'
                  )}
                >
                  粉色主题
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 页脚 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto mt-12 text-center text-gray-500 text-sm"
      >
        <p>CyberPress Components Showcase - Created with ❤️ and Cyberpunk Style</p>
      </motion.div>
    </div>
  );
}
