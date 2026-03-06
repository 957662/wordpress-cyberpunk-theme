'use client';

import React, { useState } from 'react';
import {
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  SearchIcon,
  MenuIcon,
  UserIcon,
  SettingsIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  DownloadIcon,
  UploadIcon,
  CodeIcon,
  TerminalIcon,
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  LoadingIcon,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  ZapIcon,
  ShieldLockIcon,
  ChipIcon,
  CpuIcon,
  DatabaseIcon,
  NetworkIcon,
  CyberShieldIcon,
} from './index-unified';

interface IconCategory {
  name: string;
  icons: Array<{
    name: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
  }>;
}

const iconCategories: IconCategory[] = [
  {
    name: '导航图标',
    icons: [
      { name: 'HomeIcon', component: HomeIcon, description: '首页' },
      { name: 'BlogIcon', component: BlogIcon, description: '博客' },
      { name: 'PortfolioIcon', component: PortfolioIcon, description: '作品集' },
      { name: 'SearchIcon', component: SearchIcon, description: '搜索' },
      { name: 'MenuIcon', component: MenuIcon, description: '菜单' },
    ],
  },
  {
    name: '功能图标',
    icons: [
      { name: 'UserIcon', component: UserIcon, description: '用户' },
      { name: 'SettingsIcon', component: SettingsIcon, description: '设置' },
      { name: 'EditIcon', component: EditIcon, description: '编辑' },
      { name: 'TrashIcon', component: TrashIcon, description: '删除' },
      { name: 'SaveIcon', component: SaveIcon, description: '保存' },
    ],
  },
  {
    name: '交互图标',
    icons: [
      { name: 'HeartIcon', component: HeartIcon, description: '喜欢' },
      { name: 'StarIcon', component: StarIcon, description: '收藏' },
      { name: 'BookmarkIcon', component: BookmarkIcon, description: '书签' },
      { name: 'DownloadIcon', component: DownloadIcon, description: '下载' },
      { name: 'UploadIcon', component: UploadIcon, description: '上传' },
    ],
  },
  {
    name: '开发图标',
    icons: [
      { name: 'CodeIcon', component: CodeIcon, description: '代码' },
      { name: 'TerminalIcon', component: TerminalIcon, description: '终端' },
      { name: 'GitHubIcon', component: GitHubIcon, description: 'GitHub' },
      { name: 'DatabaseIcon', component: DatabaseIcon, description: '数据库' },
      { name: 'NetworkIcon', component: NetworkIcon, description: '网络' },
    ],
  },
  {
    name: '社交图标',
    icons: [
      { name: 'GitHubIcon', component: GitHubIcon, description: 'GitHub' },
      { name: 'TwitterIcon', component: TwitterIcon, description: 'Twitter' },
      { name: 'LinkedInIcon', component: LinkedInIcon, description: 'LinkedIn' },
      { name: 'EmailIcon', component: EmailIcon, description: 'Email' },
    ],
  },
  {
    name: '状态图标',
    icons: [
      { name: 'LoadingIcon', component: LoadingIcon, description: '加载中' },
      { name: 'CheckIcon', component: CheckIcon, description: '成功' },
      { name: 'CloseIcon', component: CloseIcon, description: '关闭' },
      { name: 'WarningIcon', component: WarningIcon, description: '警告' },
      { name: 'ErrorIcon', component: ErrorIcon, description: '错误' },
      { name: 'InfoIcon', component: InfoIcon, description: '信息' },
      { name: 'ZapIcon', component: ZapIcon, description: '快速' },
    ],
  },
  {
    name: '赛博图标',
    icons: [
      { name: 'ChipIcon', component: ChipIcon, description: '芯片' },
      { name: 'CpuIcon', component: CpuIcon, description: '处理器' },
      { name: 'ShieldLockIcon', component: ShieldLockIcon, description: '安全' },
      { name: 'CyberShieldIcon', component: CyberShieldIcon, description: '赛博盾' },
    ],
  },
];

const sizes = [16, 20, 24, 32, 48] as const;
const colors = [
  { name: 'Cyan', class: 'text-cyber-cyan' },
  { name: 'Purple', class: 'text-cyber-purple' },
  { name: 'Pink', class: 'text-cyber-pink' },
  { name: 'Yellow', class: 'text-cyber-yellow' },
] as const;

export default function IconShowcase() {
  const [selectedSize, setSelectedSize] = useState<(typeof sizes)[number]>(24);
  const [selectedColor, setSelectedColor] = useState<(typeof colors)[number]['class']>('text-cyber-cyan');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyImport = (iconName: string) => {
    const importStatement = `import { ${iconName} } from '@/components/icons';`;
    navigator.clipboard.writeText(importStatement);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
            CyberPress Icon Gallery
          </h1>
          <p className="text-cyber-gray-200">
            完整的图标展示库 - {iconCategories.reduce((acc, cat) => acc + cat.icons.length, 0)}+ 个图标
          </p>
        </div>

        {/* 控制面板 */}
        <div className="mb-12 bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-cyber-cyan">自定义预览</h2>

          {/* 尺寸选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-cyber-gray-200">
              图标尺寸: {selectedSize}px
            </label>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded border transition-all ${
                    selectedSize === size
                      ? 'bg-cyber-cyan text-cyber-black border-cyber-cyan neon-glow-cyan'
                      : 'bg-transparent text-cyber-gray-200 border-cyber-gray-400 hover:border-cyber-cyan'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* 颜色选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-cyber-gray-200">
              图标颜色
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.class)}
                  className={`px-4 py-2 rounded border transition-all ${
                    selectedColor === color.class
                      ? `${color.class} bg-cyber-dark border-current`
                      : 'bg-transparent text-cyber-gray-200 border-cyber-gray-400'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* 预览示例 */}
          <div className="bg-cyber-black rounded-lg p-6 border border-cyber-cyan/10">
            <p className="text-sm text-cyber-gray-300 mb-4">预览效果:</p>
            <div className="flex flex-wrap gap-6 items-center">
              <HomeIcon size={selectedSize} className={selectedColor} />
              <HeartIcon size={selectedSize} className={selectedColor} />
              <StarIcon size={selectedSize} className={selectedColor} />
              <CodeIcon size={selectedSize} className={selectedColor} />
              <ZapIcon size={selectedSize} className={selectedColor} />
            </div>
          </div>
        </div>

        {/* 图标分类展示 */}
        {iconCategories.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-cyber-cyan border-b border-cyber-cyan/20 pb-3">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {category.icons.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <div
                    key={icon.name}
                    className="group bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-6 hover:border-cyber-cyan transition-all hover:shadow-neon-cyan"
                  >
                    <div className="flex flex-col items-center gap-4">
                      {/* 图标 */}
                      <div className="flex items-center justify-center w-16 h-16 bg-cyber-black rounded-lg">
                        <IconComponent size={selectedSize} className={selectedColor} />
                      </div>

                      {/* 信息 */}
                      <div className="text-center">
                        <h3 className="font-semibold text-cyber-gray-100 mb-1">{icon.name}</h3>
                        <p className="text-sm text-cyber-gray-300">{icon.description}</p>
                      </div>

                      {/* 复制按钮 */}
                      <button
                        onClick={() => copyImport(icon.name)}
                        className="w-full px-3 py-2 text-sm bg-cyber-cyan/10 text-cyber-cyan rounded border border-cyber-cyan/30 hover:bg-cyber-cyan hover:text-cyber-black transition-all"
                      >
                        {copiedIcon === icon.name ? '✓ 已复制' : '复制导入'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 使用说明 */}
        <div className="mt-16 bg-cyber-dark border border-cyber-purple/20 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-cyber-purple">使用说明</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-cyber-gray-100">基础用法</h3>
              <div className="bg-cyber-black rounded-lg p-4 border border-cyber-cyan/10">
                <pre className="text-sm text-cyber-gray-200 overflow-x-auto">
{`import { HomeIcon, HeartIcon } from '@/components/icons';

// 基础使用
<HomeIcon size={24} />

// 自定义颜色
<HeartIcon size={24} className="text-cyber-pink" />

// 自定义尺寸
<HomeIcon size={32} />`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-cyber-gray-100">按钮中的使用</h3>
              <div className="bg-cyber-black rounded-lg p-4 border border-cyber-cyan/10">
                <pre className="text-sm text-cyber-gray-200 overflow-x-auto">
{`<button className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan text-cyber-black rounded">
  <DownloadIcon size={20} />
  <span>下载文件</span>
</button>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-cyber-gray-100">动态图标</h3>
              <div className="bg-cyber-black rounded-lg p-4 border border-cyber-cyan/10">
                <pre className="text-sm text-cyber-gray-200 overflow-x-auto">
{`const [isLiked, setIsLiked] = useState(false);

<HeartIcon
  size={24}
  className={isLiked ? 'text-cyber-pink fill-current' : 'text-cyber-gray-300'}
  onClick={() => setIsLiked(!isLiked)}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-16 text-center text-cyber-gray-300">
          <p>CyberPress Icon Gallery v1.2.0</p>
          <p className="text-sm mt-2">最后更新: 2026-03-07</p>
        </div>
      </div>
    </div>
  );
}
