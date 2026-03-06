/**
 * 组件使用示例页面
 * 展示所有可用的 UI 组件及其用法
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { CircularProgress } from '@/components/ui/Progress';
import { Slider } from '@/components/ui/Slider';
import { RangeSlider } from '@/components/ui/Slider';
import { Radio, RadioGroup } from '@/components/ui/Radio';
import { Badge, StatusBadge, CountBadge, NewBadge, HotBadge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup, UserAvatar, BotAvatar } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from '@/components/ui/Menu';
import { EmptyState, DecoratedEmptyState } from '@/components/ui/EmptyState';
import { CommandMenu, CommandMenuTrigger } from '@/components/ui/CommandMenu';

const commandGroups = [
  {
    label: '常用操作',
    items: [
      { id: 'new-post', label: '新建文章', icon: '📝', shortcut: '⌘N', action: () => console.log('New post') },
      { id: 'new-page', label: '新建页面', icon: '📄', shortcut: '⌘⇧N', action: () => console.log('New page') },
      { id: 'save', label: '保存', icon: '💾', shortcut: '⌘S', action: () => console.log('Save') },
    ],
  },
  {
    label: '导航',
    items: [
      { id: 'dashboard', label: '仪表盘', icon: '📊', action: () => console.log('Dashboard') },
      { id: 'posts', label: '文章管理', icon: '📰', action: () => console.log('Posts') },
      { id: 'settings', label: '设置', icon: '⚙️', action: () => console.log('Settings') },
    ],
  },
];

export default function ComponentsUsagePage() {
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [rangeValue, setRangeValue] = React.useState([20, 80]);
  const [radioValue, setRadioValue] = React.useState('option1');
  const [activeTab, setActiveTab] = React.useState('preview');
  const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页头 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-white">
            组件库 <span className="text-cyber-cyan">Showcase</span>
          </h1>
          <p className="text-gray-400">
            赛博朋克风格 UI 组件集合 - 按 <kbd className="px-2 py-1 bg-cyber-muted border border-cyber-border rounded text-xs">⌘K</kbd> 打开命令菜单
          </p>
          <Button onClick={() => setCommandMenuOpen(true)}>
            打开命令菜单
          </Button>
          <CommandMenu
            groups={commandGroups}
            open={commandMenuOpen}
            onOpenChange={setCommandMenuOpen}
          />
        </div>

        {/* 组件展示区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 按钮组件 */}
          <Card variant="neon" glowColor="cyan">
            <h2 className="text-xl font-bold text-white mb-4">按钮 (Button)</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="danger">危险按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
            </div>
          </Card>

          {/* 徽章组件 */}
          <Card variant="neon" glowColor="purple">
            <h2 className="text-xl font-bold text-white mb-4">徽章 (Badge)</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="cyan">Cyan</Badge>
              <Badge variant="purple">Purple</Badge>
              <Badge variant="pink">Pink</Badge>
              <Badge variant="green">Green</Badge>
              <Badge variant="yellow">Yellow</Badge>
              <StatusBadge status="online" />
              <StatusBadge status="offline" />
              <StatusBadge status="busy" />
              <CountBadge count={99} />
              <NewBadge />
              <HotBadge />
            </div>
          </Card>

          {/* 头像组件 */}
          <Card variant="neon" glowColor="pink">
            <h2 className="text-xl font-bold text-white mb-4">头像 (Avatar)</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar size="sm" fallback="SM" />
                <Avatar size="md" fallback="MD" />
                <Avatar size="lg" fallback="LG" />
                <Avatar size="xl" fallback="XL" />
              </div>
              <div className="flex items-center gap-4">
                <UserAvatar name="Alice" />
                <UserAvatar name="Bob" />
                <BotAvatar />
              </div>
              <AvatarGroup
                avatars={[
                  { alt: 'User 1', fallback: 'A' },
                  { alt: 'User 2', fallback: 'B' },
                  { alt: 'User 3', fallback: 'C' },
                  { alt: 'User 4', fallback: 'D' },
                ]}
              />
            </div>
          </Card>

          {/* 进度条组件 */}
          <Card variant="neon" glowColor="green">
            <h2 className="text-xl font-bold text-white mb-4">进度条 (Progress)</h2>
            <div className="space-y-6">
              <Progress value={30} showLabel />
              <Progress value={60} variant="purple" showLabel />
              <Progress value={90} variant="pink" showLabel />
              <div className="flex justify-center">
                <CircularProgress value={75} variant="cyan" />
              </div>
            </div>
          </Card>

          {/* 滑块组件 */}
          <Card variant="neon" glowColor="yellow">
            <h2 className="text-xl font-bold text-white mb-4">滑块 (Slider)</h2>
            <div className="space-y-6 px-4">
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                label="单值滑块"
                showValue
              />
              <RangeSlider
                value={rangeValue}
                onChange={setRangeValue}
                label="范围滑块"
                showValue
              />
            </div>
          </Card>

          {/* 单选框组件 */}
          <Card variant="neon" glowColor="cyan">
            <h2 className="text-xl font-bold text-white mb-4">单选框 (Radio)</h2>
            <RadioGroup value={radioValue} onChange={setRadioValue}>
              <Radio value="option1" label="选项一" description="这是第一个选项" />
              <Radio value="option2" label="选项二" description="这是第二个选项" />
              <Radio value="option3" label="选项三" description="这是第三个选项" />
            </RadioGroup>
          </Card>

          {/* 选项卡组件 */}
          <Card variant="neon" glowColor="purple" className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">选项卡 (Tabs)</h2>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">预览</TabsTrigger>
                <TabsTrigger value="tab2">代码</TabsTrigger>
                <TabsTrigger value="tab3">文档</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <p className="text-gray-300">这是预览标签页的内容。</p>
              </TabsContent>
              <TabsContent value="tab2">
                <p className="text-gray-300">这是代码标签页的内容。</p>
              </TabsContent>
              <TabsContent value="tab3">
                <p className="text-gray-300">这是文档标签页的内容。</p>
              </TabsContent>
            </Tabs>
          </Card>

          {/* 手风琴组件 */}
          <Card variant="neon" glowColor="pink" className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">手风琴 (Accordion)</h2>
            <Accordion defaultValue="item1">
              <AccordionItem value="item1">
                <AccordionTrigger>第一项内容</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-300">这是第一个手风琴项的详细内容。可以放置任何内容。</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item2">
                <AccordionTrigger>第二项内容</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-300">这是第二个手风琴项的详细内容。</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item3">
                <AccordionTrigger>第三项内容</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-300">这是第三个手风琴项的详细内容。</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* 提示框组件 */}
          <Card variant="neon" glowColor="cyan">
            <h2 className="text-xl font-bold text-white mb-4">提示框 (Tooltip)</h2>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="这是提示信息" side="top">
                <Button variant="outline">顶部提示</Button>
              </Tooltip>
              <Tooltip content="这是提示信息" side="bottom">
                <Button variant="outline">底部提示</Button>
              </Tooltip>
              <Tooltip content="这是提示信息" side="left">
                <Button variant="outline">左侧提示</Button>
              </Tooltip>
              <Tooltip content="这是提示信息" side="right">
                <Button variant="outline">右侧提示</Button>
              </Tooltip>
            </div>
          </Card>

          {/* 菜单组件 */}
          <Card variant="neon" glowColor="purple">
            <h2 className="text-xl font-bold text-white mb-4">菜单 (Menu)</h2>
            <Menu>
              <MenuTrigger>
                <Button>打开菜单</Button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem icon="📝">新建文章</MenuItem>
                <MenuItem icon="📄">新建页面</MenuItem>
                <MenuSeparator />
                <MenuLabel>操作</MenuLabel>
                <MenuItem icon="💾">保存</MenuItem>
                <MenuItem icon="🔄">刷新</MenuItem>
              </MenuContent>
            </Menu>
          </Card>

          {/* 空状态组件 */}
          <Card variant="neon" glowColor="green" className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">空状态 (EmptyState)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmptyState
                type="empty"
                action={{ label: '创建内容', onClick: () => console.log('Create') }}
              />
              <EmptyState
                type="search"
                action={{ label: '开始搜索', onClick: () => console.log('Search') }}
              />
              <EmptyState type="no-results" />
              <EmptyState type="success" />
            </div>
          </Card>
        </div>

        {/* 页脚 */}
        <div className="text-center py-8 border-t border-cyber-border">
          <p className="text-gray-500 text-sm">
            CyberPress UI Component Library © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
