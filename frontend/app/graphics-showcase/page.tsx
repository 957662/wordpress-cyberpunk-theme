/**
 * CyberPress Graphics Showcase
 *
 * 完整的图形素材展示页面 - 使用内联 SVG 组件
 */

'use client';

import React, { useState } from 'react';
import {
  // 图标
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  AboutIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  CommentIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  LockIcon,
  UnlockIcon,
  SunIcon,
  MoonIcon,
  ImageIcon,
  VideoIcon,
  CodeIcon,
  FolderIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,
  TerminalIcon,
  DatabaseIcon,
  ServerIcon,
  CloudIcon,
  ExternalLinkIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  FilterIcon,
  SortIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshIcon,

  // Logo
  MainLogo,
  SquareLogo,
  FaviconLogo,
  MinimalLogo,
  TextLogo,
  WatermarkLogo,
  AnimatedLogo,

  // 装饰元素
  CornerBracket,
  DividerLine,
  LoadingRing,
  PulseLoader,
  HexLoader,
  PatternBackground,
  TechBorder,
  Scanlines,
  GlitchOverlay,

  // 插画
  CyberCityIllustration,
  CodeScreenIllustration,
  NetworkIllustration,
  ServerRackIllustration,
  CircuitBoardIllustration,
  WorkspaceIllustration,
} from '@/components/graphics';

export default function GraphicsShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [iconSize, setIconSize] = useState(32);
  const [showGlow, setShowGlow] = useState(false);

  // 图标分类
  const iconCategories = [
    {
      id: 'navigation',
      name: '导航图标',
      icons: [
        { component: HomeIcon, name: 'Home', desc: '首页' },
        { component: BlogIcon, name: 'Blog', desc: '博客' },
        { component: PortfolioIcon, name: 'Portfolio', desc: '作品集' },
        { component: AboutIcon, name: 'About', desc: '关于' },
        { component: SearchIcon, name: 'Search', desc: '搜索' },
        { component: MenuIcon, name: 'Menu', desc: '菜单' },
        { component: CloseIcon, name: 'Close', desc: '关闭' },
      ],
    },
    {
      id: 'social',
      name: '社交图标',
      icons: [
        { component: GitHubIcon, name: 'GitHub', desc: 'GitHub' },
        { component: TwitterIcon, name: 'Twitter', desc: 'Twitter' },
        { component: LinkedInIcon, name: 'LinkedIn', desc: 'LinkedIn' },
        { component: EmailIcon, name: 'Email', desc: '邮件' },
        { component: RSSIcon, name: 'RSS', desc: 'RSS' },
      ],
    },
    {
      id: 'ui',
      name: 'UI 图标',
      icons: [
        { component: UserIcon, name: 'User', desc: '用户' },
        { component: SettingsIcon, name: 'Settings', desc: '设置' },
        { component: BellIcon, name: 'Bell', desc: '通知' },
        { component: CommentIcon, name: 'Comment', desc: '评论' },
      ],
    },
    {
      id: 'actions',
      name: '操作图标',
      icons: [
        { component: EditIcon, name: 'Edit', desc: '编辑' },
        { component: DeleteIcon, name: 'Delete', desc: '删除' },
        { component: SaveIcon, name: 'Save', desc: '保存' },
        { component: CopyIcon, name: 'Copy', desc: '复制' },
        { component: DownloadIcon, name: 'Download', desc: '下载' },
        { component: UploadIcon, name: 'Upload', desc: '上传' },
      ],
    },
    {
      id: 'status',
      name: '状态图标',
      icons: [
        { component: CheckIcon, name: 'Check', desc: '成功' },
        { component: WarningIcon, name: 'Warning', desc: '警告' },
        { component: ErrorIcon, name: 'Error', desc: '错误' },
        { component: InfoIcon, name: 'Info', desc: '信息' },
        { component: LockIcon, name: 'Lock', desc: '锁定' },
        { component: UnlockIcon, name: 'Unlock', desc: '解锁' },
      ],
    },
    {
      id: 'theme',
      name: '主题图标',
      icons: [
        { component: SunIcon, name: 'Sun', desc: '亮色' },
        { component: MoonIcon, name: 'Moon', desc: '暗色' },
      ],
    },
    {
      id: 'media',
      name: '媒体图标',
      icons: [
        { component: ImageIcon, name: 'Image', desc: '图片' },
        { component: VideoIcon, name: 'Video', desc: '视频' },
        { component: CodeIcon, name: 'Code', desc: '代码' },
        { component: FolderIcon, name: 'Folder', desc: '文件夹' },
        { component: TagIcon, name: 'Tag', desc: '标签' },
        { component: CalendarIcon, name: 'Calendar', desc: '日历' },
        { component: ClockIcon, name: 'Clock', desc: '时钟' },
      ],
    },
    {
      id: 'dev',
      name: '开发图标',
      icons: [
        { component: TerminalIcon, name: 'Terminal', desc: '终端' },
        { component: DatabaseIcon, name: 'Database', desc: '数据库' },
        { component: ServerIcon, name: 'Server', desc: '服务器' },
        { component: CloudIcon, name: 'Cloud', desc: '云' },
      ],
    },
    {
      id: 'other',
      name: '其他图标',
      icons: [
        { component: ExternalLinkIcon, name: 'ExternalLink', desc: '外部链接' },
        { component: StarIcon, name: 'Star', desc: '星标' },
        { component: HeartIcon, name: 'Heart', desc: '喜欢' },
        { component: ShareIcon, name: 'Share', desc: '分享' },
        { component: FilterIcon, name: 'Filter', desc: '筛选' },
        { component: SortIcon, name: 'Sort', desc: '排序' },
        { component: ArrowUpIcon, name: 'ArrowUp', desc: '上箭头' },
        { component: ArrowDownIcon, name: 'ArrowDown', desc: '下箭头' },
        { component: ArrowLeftIcon, name: 'ArrowLeft', desc: '左箭头' },
        { component: ArrowRightIcon, name: 'ArrowRight', desc: '右箭头' },
        { component: RefreshIcon, name: 'Refresh', desc: '刷新' },
      ],
    },
  ];

  // Logo 变体
  const logoVariants = [
    { component: MainLogo, name: 'Main Logo', desc: '主 Logo - 横向带文字' },
    { component: SquareLogo, name: 'Square Logo', desc: '方形 Logo - 仅图标' },
    { component: FaviconLogo, name: 'Favicon Logo', desc: 'Favicon - 小图标' },
    { component: MinimalLogo, name: 'Minimal Logo', desc: '极简 Logo - 单色' },
    { component: TextLogo, name: 'Text Logo', desc: '文字 Logo - 仅文字' },
    { component: WatermarkLogo, name: 'Watermark Logo', desc: '水印 Logo - 半透明' },
    { component: AnimatedLogo, name: 'Animated Logo', desc: '动画 Logo - 带脉冲' },
  ];

  // 装饰元素
  const decorationTypes = [
    { name: 'Corner Bracket', variant: 'top-left' as const },
    { name: 'Divider Simple', variant: 'simple' as const },
    { name: 'Divider Double', variant: 'double' as const },
    { name: 'Divider Dashed', variant: 'dashed' as const },
    { name: 'Divider Tech', variant: 'tech' as const },
  ];

  // 插画列表
  const illustrations = [
    { component: CyberCityIllustration, name: '赛博城市', desc: 'Cyber City' },
    { component: CodeScreenIllustration, name: '代码屏幕', desc: 'Code Screen' },
    { component: NetworkIllustration, name: '网络节点', desc: 'Network' },
    { component: ServerRackIllustration, name: '服务器机架', desc: 'Server Rack' },
    { component: CircuitBoardIllustration, name: '电路板', desc: 'Circuit Board' },
    { component: WorkspaceIllustration, name: '工作空间', desc: 'Workspace' },
  ];

  // 过滤图标
  const filteredCategories = selectedCategory === 'all'
    ? iconCategories
    : iconCategories.filter(cat => cat.id === selectedCategory);

  const allIcons = filteredCategories.flatMap(cat => cat.icons);

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* 扫描线效果 */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <Scanlines />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* 页头 */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <AnimatedLogo width={150} />
          </div>
          <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-4">
            CyberPress 图形素材库
          </h1>
          <p className="text-xl text-cyber-cyan/80 mb-2">
            赛博朋克风格 - 完整的内联 SVG 组件
          </p>
          <p className="text-gray-400">
            50+ 图标 · 7 种 Logo · 9 种装饰 · 6 种插画
          </p>
        </header>

        {/* 控制面板 */}
        <div className="mb-12 p-6 bg-cyber-card rounded-lg border border-cyber-border">
          <div className="flex flex-wrap items-center gap-6">
            {/* 分类筛选 */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">分类:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-cyber-dark border border-cyber-border rounded text-cyber-cyan focus:border-cyber-cyan focus:outline-none"
              >
                <option value="all">全部</option>
                {iconCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* 尺寸控制 */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">尺寸:</label>
              <input
                type="range"
                min="16"
                max="64"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-cyber-cyan w-12">{iconSize}px</span>
            </div>

            {/* 发光效果 */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">发光效果:</label>
              <button
                onClick={() => setShowGlow(!showGlow)}
                className={`px-4 py-2 rounded transition-colors ${
                  showGlow
                    ? 'bg-cyber-cyan text-black font-semibold'
                    : 'bg-cyber-dark text-gray-400 border border-cyber-border'
                }`}
              >
                {showGlow ? '开启' : '关闭'}
              </button>
            </div>
          </div>
        </div>

        {/* 图标展示 */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-cyber-cyan mb-8 flex items-center gap-3">
            <span className="text-cyber-purple">▶</span>
            图标组件
          </h2>

          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-12">
              <h3 className="text-xl font-semibold text-cyber-purple mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyber-cyan rounded-full"></span>
                {category.name}
                <span className="text-sm text-gray-500">({category.icons.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {category.icons.map((icon) => {
                  const IconComponent = icon.component;
                  return (
                    <div
                      key={icon.name}
                      className="group relative p-4 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-cyan transition-all hover:scale-105 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <IconComponent
                          size={iconSize}
                          className={showGlow ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : ''}
                        />
                        <p className="mt-2 text-xs text-gray-400 text-center">{icon.name}</p>
                        <p className="text-xs text-gray-600 text-center">{icon.desc}</p>
                      </div>

                      {/* 悬停效果 */}
                      <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Logo 展示 */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-cyber-cyan mb-8 flex items-center gap-3">
            <span className="text-cyber-purple">▶</span>
            Logo 组件
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {logoVariants.map((logo) => {
              const LogoComponent = logo.component;
              return (
                <div
                  key={logo.name}
                  className="p-8 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-cyan transition-all"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-6 p-4 bg-cyber-dark rounded-lg">
                      <LogoComponent width={logo.name === 'Favicon Logo' ? 64 : 120} />
                    </div>
                    <h4 className="text-lg font-semibold text-cyber-cyan mb-1">{logo.name}</h4>
                    <p className="text-sm text-gray-400 text-center">{logo.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 装饰元素展示 */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-cyber-cyan mb-8 flex items-center gap-3">
            <span className="text-cyber-purple">▶</span>
            装饰元素
          </h2>

          <div className="space-y-8">
            {/* 角标 */}
            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">角标装饰 (Corner Bracket)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((position) => (
                  <div key={position} className="relative h-32 bg-cyber-dark rounded border border-cyber-border">
                    <CornerBracket position={position} size={60} />
                    <span className="absolute bottom-2 left-2 text-xs text-gray-500">{position}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 分割线 */}
            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">分割线 (Divider Line)</h3>
              <div className="space-y-6">
                {decorationTypes.map((deco) => (
                  <div key={deco.name} className="flex items-center gap-4">
                    <span className="w-32 text-sm text-gray-400">{deco.name}</span>
                    <div className="flex-1">
                      {deco.name.startsWith('Divider') ? (
                        <DividerLine variant={deco.variant as any} />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 加载动画 */}
            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">加载动画</h3>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center gap-4">
                  <LoadingRing size={64} />
                  <span className="text-sm text-gray-400">Loading Ring</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <PulseLoader size={64} />
                  <span className="text-sm text-gray-400">Pulse Loader</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <HexLoader size={64} />
                  <span className="text-sm text-gray-400">Hex Loader</span>
                </div>
              </div>
            </div>

            {/* 科技边框 */}
            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">科技边框 (Tech Border)</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="relative h-48">
                  <TechBorder />
                  <div className="absolute inset-4 flex items-center justify-center">
                    <span className="text-sm text-gray-400">标准边框</span>
                  </div>
                </div>
                <div className="relative h-48">
                  <TechBorder rounded glow />
                  <div className="absolute inset-4 flex items-center justify-center">
                    <span className="text-sm text-gray-400">圆角发光</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 插画展示 */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-cyber-cyan mb-8 flex items-center gap-3">
            <span className="text-cyber-purple">▶</span>
            插画组件
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {illustrations.map((illust) => {
              const IllustrationComponent = illust.component;
              return (
                <div
                  key={illust.name}
                  className="p-6 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-cyan transition-all"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="bg-cyber-dark rounded-lg p-4">
                      <IllustrationComponent width={250} animated />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-cyber-cyan text-center mb-1">{illust.name}</h4>
                  <p className="text-sm text-gray-400 text-center">{illust.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 使用说明 */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-cyber-cyan mb-8 flex items-center gap-3">
            <span className="text-cyber-purple">▶</span>
            使用说明
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">导入方式</h3>
              <pre className="bg-cyber-dark p-4 rounded text-sm overflow-x-auto">
                <code className="text-cyber-cyan">
{`import {
  HomeIcon,
  GitHubIcon,
  MainLogo,
  CornerBracket
} from '@/components/graphics';`}
                </code>
              </pre>
            </div>

            <div className="p-6 bg-cyber-card rounded-lg border border-cyber-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">基本使用</h3>
              <pre className="bg-cyber-dark p-4 rounded text-sm overflow-x-auto">
                <code className="text-cyber-cyan">
{`// 图标
<HomeIcon size={24} />
<GitHubIcon size={20} glow />

// Logo
<MainLogo width={200} />

// 装饰元素
<CornerBracket position="top-left" />`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* 配色参考 */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-cyber-cyan mb-8 flex items-center gap-3">
            <span className="text-cyber-purple">▶</span>
            配色参考
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: '深空黑', hex: '#0a0a0f', class: 'bg-cyber-dark' },
              { name: '霓虹青', hex: '#00f0ff', class: 'bg-cyber-cyan' },
              { name: '赛博紫', hex: '#9d00ff', class: 'bg-cyber-purple' },
              { name: '激光粉', hex: '#ff0080', class: 'bg-cyber-pink' },
              { name: '赛博绿', hex: '#00ff88', class: 'bg-cyber-green' },
              { name: '电压黄', hex: '#f0ff00', class: 'bg-cyber-yellow' },
              { name: '等离子橙', hex: '#ff6600', class: 'bg-cyber-orange' },
            ].map((color) => (
              <div
                key={color.name}
                className="p-4 bg-cyber-card rounded-lg border border-cyber-border hover:scale-105 transition-transform cursor-pointer group"
              >
                <div className={`w-full h-20 rounded mb-3 ${color.class} shadow-lg group-hover:shadow-cyber-cyan/50 transition-shadow`}></div>
                <p className="text-sm font-semibold text-white">{color.name}</p>
                <p className="text-xs text-gray-400">{color.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 页脚 */}
        <footer className="text-center py-12 border-t border-cyber-border">
          <WatermarkLogo width={200} />
          <div className="mt-6 space-y-2">
            <p className="text-gray-400">
              CyberPress Platform - 图形素材库
            </p>
            <p className="text-sm text-gray-500">
              创建日期: 2026-03-03 · 组件总数: 70+ · 全部内联 SVG
            </p>
            <p className="text-xs text-gray-600 mt-4">
              查看详细文档: <code className="text-cyber-cyan">/components/graphics/README.md</code>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
