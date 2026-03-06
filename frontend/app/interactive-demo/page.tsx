/**
 * 交互式演示页面
 * 展示组件的实时交互效果
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { RangeSlider } from '@/components/ui/Slider';
import { Radio, RadioGroup } from '@/components/ui/Radio';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar, UserAvatar, BotAvatar } from '@/components/ui/Avatar';

export default function InteractiveDemoPage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [rangeValue, setRangeValue] = useState([30, 70]);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [progressValue, setProgressValue] = useState(65);
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* 页头 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            交互式 <span className="text-cyber-cyan">组件演示</span>
          </h1>
          <p className="text-gray-400">
            实时体验组件的交互效果和状态变化
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：控制面板 */}
          <div className="space-y-6">
            <Card variant="neon" glowColor="cyan">
              <h2 className="text-xl font-bold text-white mb-6">控制面板</h2>

              <div className="space-y-6">
                {/* 滑块控制 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    单值滑块
                  </label>
                  <Slider
                    value={sliderValue}
                    onChange={setSliderValue}
                    showValue
                    label="当前值"
                  />
                  <div className="mt-2 text-sm text-cyber-cyan font-mono">
                    Value: {sliderValue[0]}
                  </div>
                </div>

                {/* 范围滑块 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    范围滑块
                  </label>
                  <RangeSlider
                    value={rangeValue}
                    onChange={setRangeValue}
                    showValue
                    label="范围"
                  />
                  <div className="mt-2 text-sm text-cyber-purple font-mono">
                    Range: {rangeValue[0]} - {rangeValue[1]}
                  </div>
                </div>

                {/* 单选框 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    单选选择
                  </label>
                  <RadioGroup value={radioValue} onChange={setRadioValue}>
                    <Radio value="option1" label="选项一" />
                    <Radio value="option2" label="选项二" />
                    <Radio value="option3" label="选项三" />
                  </RadioGroup>
                  <div className="mt-2 text-sm text-cyber-pink font-mono">
                    Selected: {radioValue}
                  </div>
                </div>

                {/* 开关 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    开关状态
                  </label>
                  <Switch
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                    label={switchValue ? '开启' : '关闭'}
                  />
                  <div className="mt-2 text-sm text-cyber-green font-mono">
                    Status: {switchValue ? 'ON' : 'OFF'}
                  </div>
                </div>

                {/* 输入框 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    文本输入
                  </label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入一些文字..."
                  />
                  <div className="mt-2 text-sm text-cyber-yellow font-mono">
                    Length: {inputValue.length} / {inputValue.split('').reverse().join('')}
                  </div>
                </div>

                {/* 进度条控制 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    进度值: {progressValue}%
                  </label>
                  <Slider
                    value={[progressValue]}
                    onChange={(v) => setProgressValue(v[0])}
                    max={100}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* 右侧：实时预览 */}
          <div className="space-y-6">
            <Card variant="neon" glowColor="purple">
              <h2 className="text-xl font-bold text-white mb-6">实时预览</h2>

              <Tabs defaultValue="visual">
                <TabsList>
                  <TabsTrigger value="visual">视觉效果</TabsTrigger>
                  <TabsTrigger value="data">数据展示</TabsTrigger>
                  <TabsTrigger value="status">状态指示</TabsTrigger>
                </TabsList>

                <TabsContent value="visual">
                  <div className="space-y-6">
                    {/* 进度条展示 */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        进度条
                      </h3>
                      <Progress
                        value={progressValue}
                        showLabel
                        variant="cyan"
                      />
                      <div className="mt-4 flex justify-center">
                        <CircularProgress
                          value={progressValue}
                          variant="purple"
                          size={120}
                        />
                      </div>
                    </div>

                    {/* 滑块值可视化 */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        单值滑块可视化
                      </h3>
                      <div className="relative h-8 bg-cyber-dark rounded overflow-hidden">
                        <motion.div
                          className="absolute top-0 bottom-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                          style={{ width: `${sliderValue[0]}%` }}
                          initial={false}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold font-mono">
                          {sliderValue[0]}%
                        </div>
                      </div>
                    </div>

                    {/* 范围值可视化 */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        范围可视化
                      </h3>
                      <div className="relative h-8 bg-cyber-dark rounded overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 bg-gradient-to-r from-cyber-purple to-cyber-pink"
                          style={{
                            left: `${rangeValue[0]}%`,
                            width: `${rangeValue[1] - rangeValue[0]}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold font-mono">
                          {rangeValue[0]} - {rangeValue[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data">
                  <div className="space-y-4">
                    {/* 输入值展示 */}
                    <div className="p-4 bg-cyber-dark rounded border border-cyber-border">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        输入内容
                      </h3>
                      <p className="text-white font-mono break-all">
                        {inputValue || '<empty>'}
                      </p>
                      <div className="mt-2 flex gap-2 text-xs text-gray-500">
                        <span>字符: {inputValue.length}</span>
                        <span>单词: {inputValue.split(/\s+/).filter(Boolean).length}</span>
                      </div>
                    </div>

                    {/* 选择值展示 */}
                    <div className="p-4 bg-cyber-dark rounded border border-cyber-border">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        选中项
                      </h3>
                      <Badge variant="cyan" size="lg">
                        {radioValue}
                      </Badge>
                    </div>

                    {/* 开关状态展示 */}
                    <div className="p-4 bg-cyber-dark rounded border border-cyber-border">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        开关状态
                      </h3>
                      <StatusBadge
                        status={switchValue ? 'online' : 'offline'}
                      />
                    </div>

                    {/* 统计数据 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-cyber-dark rounded border border-cyber-border text-center">
                        <div className="text-2xl font-bold text-cyber-cyan">
                          {sliderValue[0]}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          滑块值
                        </div>
                      </div>
                      <div className="p-4 bg-cyber-dark rounded border border-cyber-border text-center">
                        <div className="text-2xl font-bold text-cyber-purple">
                          {rangeValue[1] - rangeValue[0]}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          范围跨度
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="status">
                  <div className="space-y-4">
                    {/* 头像展示 */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        用户状态
                      </h3>
                      <div className="flex items-center gap-4">
                        <UserAvatar name="CyberUser" size="lg" />
                        <div>
                          <div className="text-white font-medium">
                            CyberUser
                          </div>
                          <StatusBadge status={switchValue ? 'online' : 'offline'} />
                        </div>
                      </div>
                    </div>

                    {/* 组件状态 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                        <span className="text-gray-400">滑块</span>
                        <Badge variant={sliderValue[0] > 70 ? 'pink' : 'cyan'}>
                          {sliderValue[0] > 70 ? '高' : sliderValue[0] > 30 ? '中' : '低'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                        <span className="text-gray-400">范围</span>
                        <Badge variant="purple">
                          {rangeValue[1] - rangeValue[0]}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                        <span className="text-gray-400">进度</span>
                        <Badge
                          variant={
                            progressValue === 100
                              ? 'green'
                              : progressValue > 50
                              ? 'yellow'
                              : 'pink'
                          }
                        >
                          {progressValue}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                        <span className="text-gray-400">开关</span>
                        <Badge variant={switchValue ? 'green' : 'gray'}>
                          {switchValue ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                    </div>

                    {/* 动态指示器 */}
                    <div className="p-4 bg-cyber-dark rounded border border-cyber-border">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        系统状态
                      </h3>
                      <div className="flex gap-2">
                        {[
                          { label: '正常', color: 'green', active: true },
                          { label: '警告', color: 'yellow', active: progressValue > 80 },
                          { label: '错误', color: 'pink', active: progressValue === 100 },
                        ].map((status) => (
                          <Badge
                            key={status.label}
                            variant={status.color as any}
                            className={status.active ? '' : 'opacity-30'}
                          >
                            {status.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* 操作按钮 */}
            <Card>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSliderValue([50]);
                    setRangeValue([30, 70]);
                    setRadioValue('option1');
                    setSwitchValue(false);
                    setInputValue('');
                    setProgressValue(65);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  重置所有
                </Button>
                <Button
                  onClick={() => {
                    setSliderValue([Math.random() * 100]);
                    setRangeValue([Math.random() * 50, 50 + Math.random() * 50]);
                    setProgressValue(Math.random() * 100);
                  }}
                  className="flex-1"
                >
                  随机值
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>CyberPress Interactive Demo © 2026</p>
        </div>
      </div>
    </div>
  );
}

// 需要导入 motion
import { motion } from 'framer-motion';
