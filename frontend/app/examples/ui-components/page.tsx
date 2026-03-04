'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function UIComponentsExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            UI 组件示例
          </h1>
          <p className="text-gray-400">
            探索我们的 UI 组件库中的各种组件
          </p>
        </motion.div>

        <Tabs defaultValue="buttons" className="space-y-8">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="buttons">按钮</TabsTrigger>
            <TabsTrigger value="inputs">输入框</TabsTrigger>
            <TabsTrigger value="cards">卡片</TabsTrigger>
            <TabsTrigger value="badges">徽章</TabsTrigger>
            <TabsTrigger value="alerts">提示</TabsTrigger>
          </TabsList>

          {/* Buttons */}
          <TabsContent value="buttons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>按钮组件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-3">基础变体</h3>
                  <div className="flex gap-3 flex-wrap">
                    <Button variant="default">Default</Button>
                    <Button variant="neon">Neon</Button>
                    <Button variant="cyber">Cyber</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">尺寸</h3>
                  <div className="flex gap-3 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">状态</h3>
                  <div className="flex gap-3 flex-wrap">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button loading>Loading</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inputs */}
          <TabsContent value="inputs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>输入框组件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    基础输入框
                  </label>
                  <Input placeholder="请输入内容..." />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    霓虹风格
                  </label>
                  <Input variant="neon" placeholder="霓虹输入框" />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    带图标
                  </label>
                  <Input
                    placeholder="搜索..."
                    leftIcon={<span>🔍</span>}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    禁用状态
                  </label>
                  <Input disabled placeholder="禁用的输入框" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>默认卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    这是一个默认样式的卡片组件
                  </p>
                </CardContent>
              </Card>

              <Card variant="neon">
                <CardHeader>
                  <CardTitle>霓虹卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    带有霓虹发光效果的卡片
                  </p>
                </CardContent>
              </Card>

              <Card variant="cyber">
                <CardHeader>
                  <CardTitle>赛博卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    赛博朋克风格的卡片
                  </p>
                </CardContent>
              </Card>

              <Card variant="holographic">
                <CardHeader>
                  <CardTitle>全息卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    全息投影效果的卡片
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>徽章组件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-3">状态徽章</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge>Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">赛博朋克变体</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="neon">Neon</Badge>
                    <Badge variant="cyber">Cyber</Badge>
                    <Badge variant="holographic">Holo</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">尺寸</h3>
                  <div className="flex gap-2 items-center">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>提示组件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="info">
                  这是一个信息提示
                </Alert>

                <Alert variant="success">
                  操作成功完成！
                </Alert>

                <Alert variant="warning">
                  请注意这个警告信息
                </Alert>

                <Alert variant="error">
                  发生了错误，请稍后重试
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
