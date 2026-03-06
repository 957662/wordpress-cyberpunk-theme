# CyberPress 图形素材快速参考 v5.0

> 快速查找和使用 CyberPress 图形素材

---

## 🚀 快速开始

### 导入方式

```tsx
import Image from 'next/image';

// 使用图标
<Image src="/icons/github.svg" alt="GitHub" width={24} height={24} />

// 使用插画
<Image src="/illustrations/cyber-success.svg" alt="Success" width={400} height={300} />

// 使用装饰
<Image src="/decorations/corner-accent.svg" alt="" width={100} height={100} />
```

---

## 📂 目录索引

### 🎯 Logo (6个)
`/logo*.svg`

- `logo.svg` - 主 Logo (200x60)
- `logo-main.svg` - 主要 Logo
- `logo-icon.svg` - 图标版 (48x48)
- `logo-mark.svg` - 标记版 (64x64)
- `logo-square.svg` - 方形版 (200x200)
- `logo-favicon.svg` - Favicon (32x32)

### 🎨 图标 (146个)

#### 🧭 导航 (8个)
`/icons/{home, about, blog, portfolio, search, tag, calendar, external-link}.svg`

#### 🌐 社交 (10个)
`/icons/{github, twitter, linkedin, email, rss, sun, moon}.svg`

#### 📦 功能 (30个)
`/icons/{code, terminal, folder, bookmark, copy, download, upload, heart, share, filter}.svg`

#### ⚠️ 状态 (12个)
`/icons/{check, close, alert, shield, lock, unlock, trophy, activity}.svg`

#### 🎬 媒体 (15个) **[NEW]**
`/icons/{video, mic, image, eye, play, pause, stop, fast-forward, rewind, shuffle, repeat, volume-high, volume-low, volume-mute}.svg`

#### 💻 科技 (15个)
`/icons/{cloud, server, database, git-branch, git-commit, git-merge, history, brain-ai}.svg`

#### 🔧 操作 (20个) **[UPDATED]**
`/icons/{edit, trash, save, refresh, log-in, log-out, arrow-right, arrow-left, menu, settings, inbox, send, wrench}.svg`

#### 🖼️ UI (25个)
`/icons/{menu, close, arrow-left, arrow-right, chevron-up, chevron-down, chevron-left, chevron-right, bell, user}.svg`

#### 🔮 赛博朋克 (17个) **[NEW]**
`/icons/cyberpunk/{microchip, circuit-board, neon-grid, hologram-display, data-stream, robot-eye, quantum-core, neural-network, energy-field, plasma-core, cyber-lock, data-node, vortex, signal-tower}.svg`

### 🖼️ 插画 (42+个)

#### 状态插画 (11个)
`/illustrations/{empty-state, cyber-search-empty, cyber-loading, cyber-success, error-state, access-denied, access-forbidden, server-maintenance, under-construction, coming-soon, feature-beta}.svg`

#### 场景插画 (10个)
`/illustrations/{cyber-city, network-globe, developer-workspace, server-room, space-station, ai-brain, data-stream, cyber-shield-security, coding-workspace, cloud-storage}.svg`

#### 英雄插画 (5个)
`/illustrations/{hero-cyber-city, cyber-landscape, cyberpunk-hacker, cyber-coding, cyber-network}.svg`

### 🎭 装饰元素 (5个) **[NEW]**
`/decorations/{corner-accent, tech-border, section-divider, holo-decoration, data-stream}.svg`

### 🌈 背景 (3个)
`/backgrounds/{hero-bg, card-bg, loading-bg}.svg`

### 🔲 图案 (5个)
`/patterns/{grid, circuit, scanlines, noise, hexagon}.svg`

---

## 🎨 按用途查找

### 导航栏
```tsx
<Image src="/icons/home.svg" />
<Image src="/icons/blog.svg" />
<Image src="/icons/portfolio.svg" />
<Image src="/icons/about.svg" />
<Image src="/icons/search.svg" />
<Image src="/icons/menu.svg" />
```

### 社交链接
```tsx
<Image src="/icons/github.svg" />
<Image src="/icons/twitter.svg" />
<Image src="/icons/linkedin.svg" />
<Image src="/icons/email.svg" />
<Image src="/icons/rss.svg" />
```

### 媒体播放器 **[NEW]**
```tsx
<Image src="/icons/play.svg" />
<Image src="/icons/pause.svg" />
<Image src="/icons/stop.svg" />
<Image src="/icons/fast-forward.svg" />
<Image src="/icons/rewind.svg" />
<Image src="/icons/shuffle.svg" />
<Image src="/icons/repeat.svg" />
<Image src="/icons/volume-high.svg" />
<Image src="/icons/volume-low.svg" />
<Image src="/icons/volume-mute.svg" />
```

### 状态提示
```tsx
<Image src="/icons/check.svg" /> {/* 成功 */}
<Image src="/icons/alert.svg" /> {/* 警告 */}
<Image src="/icons/close.svg" /> {/* 错误 */}
<Image src="/icons/shield.svg" /> {/* 安全 */}
<Image src="/illustrations/cyber-success.svg" /> {/* 成功插画 */}
```

### 空状态
```tsx
<Image src="/illustrations/empty-state.svg" />
<Image src="/illustrations/cyber-search-empty.svg" />
<Image src="/illustrations/cyberpunk-empty-state.svg" /> {/* NEW */}
```

### 页面装饰 **[NEW]**
```tsx
{/* 角落装饰 */}
<Image src="/decorations/corner-accent.svg" />

{/* 分隔线 */}
<Image src="/decorations/tech-border.svg" />
<Image src="/decorations/section-divider.svg" />

{/* 背景装饰 */}
<Image src="/decorations/holo-decoration.svg" />

{/* 数据流 */}
<Image src="/decorations/data-stream.svg" />
```

---

## 🎨 按颜色查找

### 霓虹青 (#00f0ff)
主要用于：链接、按钮、主要操作
- `home.svg`
- `github.svg`
- `play.svg`
- `check.svg`

### 赛博紫 (#9d00ff)
主要用于：次要链接、装饰
- `about.svg`
- `blog.svg`
- `pause.svg`
- `shield.svg`

### 激光粉 (#ff0080)
主要用于：警告、删除、强调
- `close.svg`
- `trash.svg`
- `stop.svg`
- `alert.svg`

### 矩阵绿 (#00ff88)
主要用于：成功、确认
- `check.svg`
- `success.svg`
- `cyber-success.svg`

### 电压黄 (#f0ff00)
主要用于：警告、高亮
- `alert.svg`
- `warning.svg`
- `star.svg`

---

## 📐 按尺寸查找

### 16x16 - 超小
按钮内图标、列表项
```tsx
<Image src="/icons/check.svg" width={16} height={16} />
```

### 20x20 - 小
输入框图标、小按钮
```tsx
<Image src="/icons/search.svg" width={20} height={20} />
```

### 24x24 - 标准 ⭐
导航、卡片（默认）
```tsx
<Image src="/icons/github.svg" width={24} height={24} />
```

### 32x32 - 大
标题图标、功能入口
```tsx
<Image src="/icons/heart.svg" width={32} height={32} />
```

### 48x48 - 特大
英雄区图标、品牌展示
```tsx
<Image src="/icons/cyberpunk/energy-field.svg" width={48} height={48} />
```

### 64x64 - 巨大
背景装饰、特殊效果
```tsx
<Image src="/icons/cyberpunk/plasma-core.svg" width={64} height={64} />
```

---

## 🎬 带动画的图标

### 赛博朋克系列 **[NEW]**
```tsx
<Image src="/icons/cyberpunk/energy-field.svg" /> {/* 脉冲 */}
<Image src="/icons/cyberpunk/plasma-core.svg" /> {/* 轨道 */}
<Image src="/icons/cyberpunk/data-node.svg" /> {/* 粒子 */}
<Image src="/icons/cyberpunk/vortex.svg" /> {/* 旋转 */}
<Image src="/icons/cyberpunk/signal-tower.svg" /> {/* 发射 */}
```

### 装饰元素 **[NEW]**
```tsx
<Image src="/decorations/holo-decoration.svg" /> {/* 旋转 */}
<Image src="/decorations/data-stream.svg" /> {/* 流动 */}
```

---

## 💡 使用技巧

### 1. 响应式尺寸
```tsx
<Image
  src="/icons/github.svg"
  width={isMobile ? 20 : 24}
  height={isMobile ? 20 : 24}
/>
```

### 2. 透明度控制
```tsx
<Image
  src="/decorations/corner-accent.svg"
  className="opacity-50"
/>
```

### 3. 旋转装饰
```tsx
{/* 右上角 */}
<Image src="/decorations/corner-accent.svg" className="rotate-90" />

{/* 右下角 */}
<Image src="/decorations/corner-accent.svg" className="rotate-180" />

{/* 左下角 */}
<Image src="/decorations/corner-accent.svg" className="-rotate-90" />
```

### 4. 组合使用
```tsx
<div className="relative">
  {/* 背景 */}
  <Image src="/decorations/holo-decoration.svg" className="absolute opacity-20" />

  {/* 前景 */}
  <div className="relative z-10">
    <Image src="/illustrations/cyber-success.svg" />
  </div>
</div>
```

### 5. 加载优化
```tsx
<Image
  src="/illustrations/cyberpunk-empty-state.svg"
  loading="lazy"
  alt="No data"
/>
```

---

## 🎯 常见场景

### 博客文章
```tsx
<div>
  <Image src="/icons/calendar.svg" width={16} />
  <span>2026-03-07</span>

  <Image src="/icons/tag.svg" width={16} />
  <span>React</span>

  <Image src="/icons/heart.svg" width={16} />
  <span>128</span>

  <Image src="/icons/comment.svg" width={16} />
  <span>32</span>
</div>
```

### 代码片段
```tsx
<div>
  <Image src="/icons/code.svg" width={20} />
  <Image src="/icons/copy.svg" width={20} />
  <Image src="/icons/terminal.svg" width={20} />
</div>
```

### 媒体播放器 **[NEW]**
```tsx
<div className="flex items-center gap-4">
  <Image src="/icons/rewind.svg" width={24} />
  <Image src="/icons/play.svg" width={32} />
  <Image src="/icons/fast-forward.svg" width={24} />
  <Image src="/icons/volume-high.svg" width={24} />
  <Image src="/icons/shuffle.svg" width={20} />
  <Image src="/icons/repeat.svg" width={20} />
</div>
```

### 卡片装饰 **[NEW]**
```tsx
<div className="relative bg-cyber-card p-6 rounded-lg">
  <Image src="/decorations/corner-accent.svg" className="absolute top-0 left-0 opacity-50" />
  <Image src="/decorations/corner-accent.svg" className="absolute top-0 right-0 opacity-50 rotate-90" />
  <Image src="/decorations/corner-accent.svg" className="absolute bottom-0 right-0 opacity-50 rotate-180" />
  <Image src="/decorations/corner-accent.svg" className="absolute bottom-0 left-0 opacity-50 -rotate-90" />

  <div className="relative z-10">
    {/* 内容 */}
  </div>
</div>
```

---

## 📊 统计数据

| 类别 | 数量 |
|------|------|
| Logo | 6 |
| 图标 | 146 |
| 插画 | 42+ |
| 装饰 | 5 |
| 背景 | 3 |
| 图案 | 5 |
| **总计** | **207+** |

---

## 🔗 相关文档

- [完整图标清单](./ICON_MANIFEST_V5.md)
- [图形素材目录](./GRAPHICS_ASSETS_CATALOG.md)
- [配色参考](./COLOR_REFERENCE.md)
- [使用指南](./GRAPHICS-USAGE-GUIDE.md)
- [交付报告](./GRAPHICS_DELIVERABLES_FINAL_V5.md)

---

## 💻 快速复制

### 图标路径
```
/icons/[filename].svg
/icons/cyberpunk/[filename].svg
```

### 插画路径
```
/illustrations/[filename].svg
```

### 装饰路径
```
/decorations/[filename].svg
```

### 背景路径
```
/backgrounds/[filename].svg
```

### 图案路径
```
/patterns/[filename].svg
```

---

**版本**: v5.0
**更新**: 2026-03-07
**团队**: CyberPress AI Design Team
