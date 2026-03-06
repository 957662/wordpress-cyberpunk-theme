/**
 * CyberPress 图标库示例
 * 展示所有可用的图标及其使用方法
 */

'use client';

import { useState } from 'react';
import {
  HomeIcon,
  BlogIcon,
  AboutIcon,
  PortfolioIcon,
  SearchIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  RefreshIcon,
  DownloadIcon,
  UploadIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  CommentIcon,
  CheckIcon,
  AlertIcon,
  LoadingIcon,
  CodeIcon,
  TerminalIcon,
  DatabaseIcon,
  ServerIcon,
  CloudIcon,
  ShieldIcon,
  LockIcon,
  UnlockIcon,
} from '../index';

interface IconCategory {
  name: string;
  icons: {
    component: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
    description: string;
  }[];
}

const iconCategories: IconCategory[] = [
  {
    name: '导航图标',
    icons: [
      { component: HomeIcon, name: 'HomeIcon', description: '首页' },
      { component: BlogIcon, name: 'BlogIcon', description: '博客' },
      { component: AboutIcon, name: 'AboutIcon', description: '关于' },
      { component: PortfolioIcon, name: 'PortfolioIcon', description: '作品集' },
      { component: SearchIcon, name: 'SearchIcon', description: '搜索' },
      { component: MenuIcon, name: 'MenuIcon', description: '菜单' },
    ],
  },
  {
    name: '社交图标',
    icons: [
      { component: GitHubIcon, name: 'GitHubIcon', description: 'GitHub' },
      { component: TwitterIcon, name: 'TwitterIcon', description: 'Twitter' },
      { component: LinkedInIcon, name: 'LinkedInIcon', description: 'LinkedIn' },
      { component: EmailIcon, name: 'EmailIcon', description: '邮箱' },
    ],
  },
  {
    name: '操作图标',
    icons: [
      { component: EditIcon, name: 'EditIcon', description: '编辑' },
      { component: TrashIcon, name: 'TrashIcon', description: '删除' },
      { component: SaveIcon, name: 'SaveIcon', description: '保存' },
      { component: RefreshIcon, name: 'RefreshIcon', description: '刷新' },
      { component: DownloadIcon, name: 'DownloadIcon', description: '下载' },
      { component: UploadIcon, name: 'UploadIcon', description: '上传' },
    ],
  },
  {
    name: '状态图标',
    icons: [
      { component: HeartIcon, name: 'HeartIcon', description: '喜欢' },
      { component: StarIcon, name: 'StarIcon', description: '收藏' },
      { component: BookmarkIcon, name: 'BookmarkIcon', description: '书签' },
      { component: CommentIcon, name: 'CommentIcon', description: '评论' },
      { component: CheckIcon, name: 'CheckIcon', description: '成功' },
      { component: AlertIcon, name: 'AlertIcon', description: '警告' },
      { component: LoadingIcon, name: 'LoadingIcon', description: '加载中' },
    ],
  },
  {
    name: '用户图标',
    icons: [
      { component: UserIcon, name: 'UserIcon', description: '用户' },
      { component: SettingsIcon, name: 'SettingsIcon', description: '设置' },
      { component: ShieldIcon, name: 'ShieldIcon', description: '安全' },
      { component: LockIcon, name: 'LockIcon', description: '锁定' },
      { component: UnlockIcon, name: 'UnlockIcon', description: '解锁' },
    ],
  },
  {
    name: '技术图标',
    icons: [
      { component: CodeIcon, name: 'CodeIcon', description: '代码' },
      { component: TerminalIcon, name: 'TerminalIcon', description: '终端' },
      { component: DatabaseIcon, name: 'DatabaseIcon', description: '数据库' },
      { component: ServerIcon, name: 'ServerIcon', description: '服务器' },
      { component: CloudIcon, name: 'CloudIcon', description: '云端' },
    ],
  },
];

export default function IconLibrary() {
  const [selectedSize, setSelectedSize] = useState<24 | 32 | 48>(24);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIcon(code);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
            CyberPress 图标库
          </h1>
          <p className="text-cyber-muted text-lg">
            赛博朋克风格图标组件展示
          </p>
        </div>

        {/* Size Selector */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setSelectedSize(24)}
            className={`px-6 py-2 rounded border transition ${
              selectedSize === 24
                ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                : 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            24px
          </button>
          <button
            onClick={() => setSelectedSize(32)}
            className={`px-6 py-2 rounded border transition ${
              selectedSize === 32
                ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                : 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            32px
          </button>
          <button
            onClick={() => setSelectedSize(48)}
            className={`px-6 py-2 rounded border transition ${
              selectedSize === 48
                ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                : 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            48px
          </button>
        </div>

        {/* Icon Categories */}
        <div className="space-y-12">
          {iconCategories.map((category) => (
            <div key={category.name} className="bg-cyber-card border border-cyber-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {category.icons.map((icon) => {
                  const IconComponent = icon.component;
                  const importCode = `import { ${icon.name} } from '@/components/icons';`;
                  const usageCode = `<${icon.name} size={${selectedSize}} />`;

                  return (
                    <div
                      key={icon.name}
                      className="bg-cyber-dark border border-cyber-border rounded-lg p-4 hover:border-cyber-cyan transition cursor-pointer group"
                      onClick={() => copyToClipboard(usageCode)}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-cyber-muted rounded group-hover:shadow-neon-cyan transition">
                          <IconComponent size={selectedSize} className="text-cyber-cyan" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-white">{icon.name}</p>
                          <p className="text-xs text-cyber-muted mt-1">{icon.description}</p>
                        </div>
                        {copiedIcon === usageCode && (
                          <span className="text-xs text-cyber-green">已复制!</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">使用示例</h2>

          <div className="space-y-6">
            {/* Basic Usage */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">基础使用</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`// 导入图标
import { HomeIcon, SearchIcon, UserIcon } from '@/components/icons';

// 使用图标
<HomeIcon size={24} />
<SearchIcon size={24} className="text-cyber-cyan" />
<UserIcon size={24} className="text-cyber-purple" />`}
                </code>
              </pre>
            </div>

            {/* Interactive Icons */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">交互图标</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`// 点赞按钮
const [liked, setLiked] = useState(false);

<HeartIcon
  size={24}
  variant={liked ? 'solid' : 'outline'}
  className={liked ? 'text-cyber-pink' : 'text-gray-400'}
  onClick={() => setLiked(!liked)}
/>

// 主题切换
const [isDark, setIsDark] = useState(true);

{isDark ? (
  <MoonIcon size={24} onClick={() => setIsDark(false)} />
) : (
  <SunIcon size={24} onClick={() => setIsDark(true)} />
)}`}
                </code>
              </pre>
            </div>

            {/* Icon with Text */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">图标 + 文字</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`// 按钮组合
<button className="flex items-center gap-2 px-4 py-2 bg-cyber-card border border-cyber-cyan rounded hover:bg-cyber-cyan/10 transition">
  <DownloadIcon size={18} />
  <span>下载文件</span>
</button>

// 链接组合
<a className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition">
  <ExternalLinkIcon size={16} />
  <span>查看详情</span>
</a>`}
                </code>
              </pre>
            </div>

            {/* Animated Icons */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">动画图标</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`// 旋转动画
<LoadingIcon size={24} className="animate-spin" />
<RefreshIcon size={24} className="animate-spin" />

// 脉冲动画
<BellIcon size={24} className="animate-pulse" />
<ZapIcon size={24} className="animate-pulse" />

// 自定义发光
<StarIcon size={24} className="shadow-neon-cyan" />`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Color Variants */}
        <div className="mt-12 bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">颜色变体</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Cyan', color: 'text-cyber-cyan' },
              { name: 'Purple', color: 'text-cyber-purple' },
              { name: 'Pink', color: 'text-cyber-pink' },
              { name: 'Yellow', color: 'text-cyber-yellow' },
              { name: 'Green', color: 'text-cyber-green' },
              { name: 'Orange', color: 'text-cyber-orange' },
              { name: 'White', color: 'text-white' },
            ].map((variant) => (
              <div
                key={variant.name}
                className="bg-cyber-dark border border-cyber-border rounded-lg p-4 text-center"
              >
                <StarIcon size={32} className={variant.color} />
                <p className="text-sm mt-2 text-cyber-muted">{variant.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-cyber-muted">
          <p>
            点击任意图标复制使用代码 • 详细文档见{' '}
            <a href="/docs/icon-guide" className="text-cyber-cyan hover:underline">
              图标使用指南
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
