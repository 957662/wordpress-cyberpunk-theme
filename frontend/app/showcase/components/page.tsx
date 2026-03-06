/**
 * 组件展示页面
 * 展示所有UI组件的使用示例
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import PaginationNew from '@/components/ui/PaginationNew';
import CarouselNew from '@/components/ui/CarouselNew';
import { CodeHighlighterNew, LanguageSelector, ThemeSelector } from '@/components/ui/CodeHighlighterNew';

export default function ComponentsShowcasePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [selectedTheme, setSelectedTheme] = useState<any>('oneDark');

  // 示例代码
  const sampleCode = `
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = await response.json();
  return data;
}

// 使用示例
const user = await fetchUser('123');
console.log(user.name);
  `.trim();

  // 轮播图项目
  const carouselItems = [
    <div key="1" className="h-64 bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
      幻灯片 1
    </div>,
    <div key="2" className="h-64 bg-gradient-to-r from-pink-500 to-yellow-500 flex items-center justify-center text-white text-4xl font-bold">
      幻灯片 2
    </div>,
    <div key="3" className="h-64 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
      幻灯片 3
    </div>,
  ];

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 页头 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            组件 <span className="text-cyber-cyan">展示</span>
          </h1>
          <p className="text-gray-400">
            查看 CyberPress 所有 UI 组件的实际效果
          </p>
        </div>

        {/* 分页组件 */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-6">分页组件</h2>
          <PaginationNew
            currentPage={currentPage}
            totalPages={10}
            totalItems={100}
            pageSize={10}
            onPageChange={setCurrentPage}
            showQuickJump
            showPageSelector
            showTotal
            color="cyan"
            variant="neon"
          />
        </Card>

        {/* 轮播图组件 */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-6">轮播图组件</h2>
          <div className="h-64">
            <CarouselNew
              items={carouselItems}
              autoplay
              autoplayInterval={3000}
              showNav
              showIndicators
              transition="slide"
              indicatorStyle="dots"
            />
          </div>
        </Card>

        {/* 代码高亮组件 */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">代码高亮组件</h2>
            <div className="flex gap-4">
              <LanguageSelector
                currentLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
              <ThemeSelector
                currentTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
              />
            </div>
          </div>
          <CodeHighlighterNew
            code={sampleCode}
            language={selectedLanguage}
            filename="example.ts"
            theme={selectedTheme}
            showLineNumbers
            showFilename
            showCopyButton
            expandable
          />
        </Card>

        {/* 徽章组件 */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-6">徽章组件</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="cyan">Cyan</Badge>
            <Badge variant="purple">Purple</Badge>
            <Badge variant="pink">Pink</Badge>
            <Badge variant="green">Green</Badge>
            <Badge variant="yellow">Yellow</Badge>
            <Badge variant="gray">Gray</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Card>

        {/* 按钮组件 */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-6">按钮组件</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="neon">Neon</Button>
            <Button variant="gradient">Gradient</Button>
          </div>
        </Card>

        {/* 输入框组件 */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-6">输入框组件</h2>
          <div className="space-y-4">
            <Input placeholder="默认输入框" />
            <Input placeholder="带图标的输入框" icon="search" />
            <Input type="password" placeholder="密码输入框" />
            <Input disabled placeholder="禁用的输入框" />
          </div>
        </Card>
      </div>
    </div>
  );
}
