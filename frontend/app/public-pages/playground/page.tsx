'use client';

import React, { useState } from 'react';
import { CyberButton } from '@/components/ui/CyberButton';
import { NeonCard } from '@/components/ui/NeonCard';
import { TemperatureSlider } from '@/components/ui/TemperatureSlider';
import { VolumeSlider } from '@/components/ui/VolumeSlider';
import { RatingPicker } from '@/components/ui/RatingPicker';
import { GlitchText } from '@/components/effects/GlitchText';
import { MatrixRain } from '@/components/effects/MatrixRain';

export default function PlaygroundPage() {
  const [temperature, setTemperature] = useState(20);
  const [volume, setVolume] = useState(70);
  const [rating, setRating] = useState(0);
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'purple' | 'pink'>('cyan');

  return (
    <div className="min-h-screen bg-black">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <MatrixRain />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <GlitchText
            text="组件游乐场"
            className="text-6xl font-bold text-cyan-400 mb-4"
          />
          <p className="text-gray-400 text-lg">
            体验各种赛博朋克风格的交互组件
          </p>
        </div>

        {/* Color Picker */}
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

        {/* Demo Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Temperature Slider */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">温度滑块</h3>
              <TemperatureSlider
                value={temperature}
                onChange={setTemperature}
                color={selectedColor}
                size="lg"
              />
            </div>
          </NeonCard>

          {/* Volume Slider */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">音量滑块</h3>
              <VolumeSlider
                value={volume}
                onChange={setVolume}
                color={selectedColor}
                size="lg"
                showValue
              />
            </div>
          </NeonCard>

          {/* Rating Picker */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-pink-400 mb-6">评分选择器</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 mb-2">默认星级</p>
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
              </div>
            </div>
          </NeonCard>

          {/* Demo Info */}
          <NeonCard color={selectedColor} glow>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-6">实时数据</h3>
              <div className="space-y-4 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">当前温度:</span>
                  <span className="text-cyan-400 text-xl">
                    {temperature}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">当前音量:</span>
                  <span className="text-purple-400 text-xl">
                    {volume}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">当前评分:</span>
                  <span className="text-pink-400 text-xl">
                    {rating.toFixed(1)} ⭐
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">主题颜色:</span>
                  <span className={`text-${selectedColor}-400 text-xl`}>
                    {selectedColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>CyberPress Platform - Component Playground</p>
          <p className="text-sm mt-2">更多组件正在开发中...</p>
        </div>
      </div>
    </div>
  );
}
