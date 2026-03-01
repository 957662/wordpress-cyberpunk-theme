'use client';

import React, { useState } from 'react';
import { CyberButton } from '@/components/ui/CyberButton';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlitchText } from '@/components/effects/GlitchText';
import { MatrixRain } from '@/components/effects/MatrixRain';
import { TreeSelect } from '@/components/ui/TreeSelect';
import { MentionInput } from '@/components/ui/MentionInput';
import { RatingPicker } from '@/components/ui/RatingPicker';
import { TemperatureSlider } from '@/components/ui/TemperatureSlider';
import { VolumeSlider } from '@/components/ui/VolumeSlider';

const treeData = [
  {
    id: '1',
    label: '前端技术',
    value: 'frontend',
    children: [
      {
        id: '1-1',
        label: '框架',
        value: 'frameworks',
        children: [
          { id: '1-1-1', label: 'React', value: 'react' },
          { id: '1-1-2', label: 'Vue', value: 'vue' },
          { id: '1-1-3', label: 'Angular', value: 'angular' },
          { id: '1-1-4', label: 'Next.js', value: 'nextjs' },
        ],
      },
      {
        id: '1-2',
        label: '样式',
        value: 'styling',
        children: [
          { id: '1-2-1', label: 'Tailwind CSS', value: 'tailwind' },
          { id: '1-2-2', label: 'CSS Modules', value: 'css-modules' },
          { id: '1-2-3', label: 'Styled Components', value: 'styled-components' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: '后端技术',
    value: 'backend',
    children: [
      {
        id: '2-1',
        label: '语言',
        value: 'languages',
        children: [
          { id: '2-1-1', label: 'Node.js', value: 'nodejs' },
          { id: '2-1-2', label: 'Python', value: 'python' },
          { id: '2-1-3', label: 'Go', value: 'go' },
          { id: '2-1-4', label: 'Rust', value: 'rust' },
        ],
      },
      {
        id: '2-2',
        label: '数据库',
        value: 'databases',
        children: [
          { id: '2-2-1', label: 'PostgreSQL', value: 'postgresql' },
          { id: '2-2-2', label: 'MongoDB', value: 'mongodb' },
          { id: '2-2-3', label: 'Redis', value: 'redis' },
        ],
      },
    ],
  },
];

export default function ComponentsShowcasePage() {
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'purple' | 'pink'>('cyan');
  const [treeValue, setTreeValue] = useState('');
  const [mentionValue, setMentionValue] = useState('');
  const [rating, setRating] = useState(0);
  const [temperature, setTemperature] = useState(20);
  const [volume, setVolume] = useState(70);

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <MatrixRain />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <GlitchText
            text="组件展示中心"
            className="text-6xl font-bold text-cyan-400 mb-4"
          />
          <p className="text-gray-400 text-lg">
            探索赛博朋克风格的交互组件
          </p>
        </div>

        {/* Color Selector */}
        <div className="flex justify-center gap-4 mb-12">
          <CyberButton
            variant={selectedColor === 'cyan' ? 'primary' : 'outline'}
            color="cyan"
            onClick={() => setSelectedColor('cyan')}
          >
            霓虹青
          </CyberButton>
          <CyberButton
            variant={selectedColor === 'purple' ? 'primary' : 'outline'}
            color="purple"
            onClick={() => setSelectedColor('purple')}
          >
            赛博紫
          </CyberButton>
          <CyberButton
            variant={selectedColor === 'pink' ? 'primary' : 'outline'}
            color="pink"
            onClick={() => setSelectedColor('pink')}
          >
            激光粉
          </CyberButton>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Tree Select */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">树形选择器</h3>
              <TreeSelect
                data={treeData}
                value={treeValue}
                onChange={setTreeValue}
                placeholder="选择技术栈..."
                color={selectedColor}
              />
              {treeValue && (
                <p className="mt-4 text-sm text-gray-400">
                  已选择: <span className="text-cyan-400 font-mono">{treeValue}</span>
                </p>
              )}
            </div>
          </NeonCard>

          {/* Mention Input */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">@提及输入</h3>
              <MentionInput
                value={mentionValue}
                onChange={setMentionValue}
                placeholder="输入 @ 来提及用户..."
                color={selectedColor}
                rows={4}
              />
            </div>
          </NeonCard>

          {/* Rating Pickers */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-pink-400 mb-6">评分组件</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 mb-2">默认评分</p>
                  <RatingPicker
                    value={rating}
                    onChange={setRating}
                    color={selectedColor}
                    size="lg"
                    showValue
                  />
                </div>
                <div>
                  <p className="text-gray-400 mb-2">半星支持</p>
                  <RatingPicker
                    defaultValue={3.5}
                    color={selectedColor}
                    size="md"
                    allowHalf
                  />
                </div>
                <div>
                  <p className="text-gray-400 mb-2">只读模式</p>
                  <RatingPicker
                    defaultValue={4}
                    color={selectedColor}
                    size="sm"
                    readonly
                  />
                </div>
              </div>
            </div>
          </NeonCard>

          {/* Temperature Slider */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-6">温度滑块</h3>
              <TemperatureSlider
                value={temperature}
                onChange={setTemperature}
                color={selectedColor}
                size="lg"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-400 text-sm">当前温度:</span>
                <span className="text-2xl font-mono text-cyan-400">
                  {temperature}°C
                </span>
              </div>
            </div>
          </NeonCard>

          {/* Volume Slider */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">音量控制</h3>
              <VolumeSlider
                value={volume}
                onChange={setVolume}
                color={selectedColor}
                size="lg"
                showValue
              />
            </div>
          </NeonCard>

          {/* Stats Panel */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">实时状态</h3>
              <div className="space-y-4 font-mono">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">树形选择</span>
                  <span className={text-cyan-400}>{treeValue || '未选择'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">评分</span>
                  <span className="text-pink-400">{rating.toFixed(1)} ⭐</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">温度</span>
                  <span className="text-green-400">{temperature}°C</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">音量</span>
                  <span className="text-yellow-400">{volume}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">主题</span>
                  <span className={`text-${selectedColor}-400`}>
                    {selectedColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-lg">CyberPress Platform - Components Showcase</p>
          <p className="text-sm mt-2">
            全部组件均支持赛博朋克主题定制
          </p>
        </div>
      </div>
    </div>
  );
}
