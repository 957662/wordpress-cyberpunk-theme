# CyberPress Graphics Guide - 图形素材指南

## 📋 概述

本文档提供 CyberPress 平台所有图形素材的完整指南，包括 Logo、图标、插画和图案素材。

## 🎨 设计系统

### 配色方案

```css
/* 主色调 */
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */

/* 辅助色 */
--cyber-green: #00ff88     /* 赛博绿 */
--cyber-yellow: #f0ff00    /* 电压黄 */
--cyber-orange: #ff6600    /* 火焰橙 */
```

### 视觉特征

- **线条宽度**: 1-2px（标准图标），2-3px（插画）
- **发光效果**: 使用 SVG `<filter>` 元素创建霓虹发光
- **渐变应用**: 线性渐变和径向渐变增强科技感
- **动画支持**: SVG `<animate>` 和 `<animateTransform>` 元素

## 📦 素材分类

### 1. Logo

| 文件名 | 用途 | 尺寸 |
|--------|------|------|
| `logo-main.svg` | 主要 Logo | 200x200 |
| `logo-icon.svg` | 图标版本 | 64x64 |
| `logo-mark.svg` | 标志符号 | 64x64 |
| `logo-square.svg` | 方形版本 | 200x200 |
| `logo-favicon.svg` | 网站图标 | 32x32 |

### 2. 基础图标

位于 `frontend/public/icons/` 目录

#### 导航类
- `home.svg` - 首页
- `menu.svg` - 菜单
- `arrow-right.svg` - 右箭头
- `arrow-left.svg` - 左箭头
- `chevron-up.svg` - 上箭头
- `chevron-down.svg` - 下箭头
- `chevron-left.svg` - 左箭头
- `chevron-right.svg` - 右箭头
- `external-link.svg` - 外部链接

#### 操作类
- `search.svg` - 搜索
- `edit.svg` - 编辑
- `trash.svg` - 删除
- `save.svg` - 保存
- `refresh.svg` - 刷新
- `share.svg` - 分享
- `copy.svg` - 复制
- `download.svg` - 下载
- `upload.svg` - 上传
- `filter.svg` - 筛选

#### 内容类
- `blog.svg` - 博客
- `code.svg` - 代码
- `image.svg` - 图片
- `video.svg` - 视频
- `file-text.svg` - 文档
- `folder.svg` - 文件夹
- `tag.svg` - 标签
- `calendar.svg` - 日历

#### 社交类
- `github.svg` - GitHub
- `twitter.svg` - Twitter
- `linkedin.svg` - LinkedIn
- `email.svg` - 邮箱
- `rss.svg` - RSS

#### 用户类
- `user.svg` - 用户
- `settings.svg` - 设置
- `log-in.svg` - 登录
- `log-out.svg` - 登出
- `lock.svg` - 锁定
- `unlock.svg` - 解锁
- `shield.svg` - 安全

#### 状态类
- `check.svg` - 成功
- `alert.svg` - 警告
- `info.svg` - 信息
- `eye.svg` - 可见
- `eye-off.svg` - 隐藏

#### 交互类
- `heart.svg` - 喜欢
- `star.svg` - 收藏
- `bookmark.svg` - 书签
- `comment.svg` - 评论
- `bell.svg` - 通知
- `message-square.svg` - 消息

#### 技术类
- `server.svg` - 服务器
- `database.svg` - 数据库
- `cloud.svg` - 云端
- `git-branch.svg` - Git分支
- `git-commit.svg` - Git提交
- `git-merge.svg` - Git合并
- `terminal.svg` - 终端
- `chip.svg` - 芯片
- `zap.svg` - 闪电

### 3. 赛博朋克主题图标

位于 `frontend/public/icons/cyberpunk/` 目录

| 图标名 | 描述 | 特点 |
|--------|------|------|
| `microchip.svg` | 微处理器 | 电路连接点动画 |
| `circuit-board.svg` | 电路板 | 数据包流动画 |
| `neon-grid.svg` | 霓虹网格 | 网格透视效果 |
| `hologram-display.svg` | 全息显示 | 扫描线动画 |
| `data-stream.svg` | 数据流 | 流动效果 |
| `robot-eye.svg` | 机器眼 | 眼睛扫描动画 |
| `quantum-core.svg` | 量子核心 | 旋转光环 |
| `neural-network.svg` | 神经网络 | 节点连接 |
| `glitch-effect.svg` | 故障效果 | 闪烁动画 |
| `energy-field.svg` | 能量场 | 旋转光环 |
| `cyber-eye.svg` | 赛博之眼 | 扫描线动画 |
| `data-cube.svg` | 数据立方体 | 等距视角 |
| `synthesizer.svg` | 合成器 | 旋钮旋转 |
| `network-node.svg` | 网络节点 | 数据包动画 |
| `quantum-bit.svg` | 量子比特 | 概率云 |
| `virtual-reality.svg` | VR头显 | 全息效果 |
| `drone.svg` | 无人机 | 螺旋桨动画 |
| `cyber-skull.svg` | 赛博头骨 | 发光眼睛 |
| `warning-sign.svg` | 警告标志 | 闪烁效果 |
| `shield-cyber.svg` | 赛博盾牌 | 锁定图标 |
| `rocket-cyber.svg` | 赛博火箭 | 火焰动画 |
| `hacker-terminal.svg` | 黑客终端 | 打字效果 |

### 4. 插画素材

位于 `frontend/public/illustrations/` 目录

| 文件名 | 描述 | 用途 |
|--------|------|------|
| `cyber-cityscape.svg` | 赛博城市 | 首页背景 |
| `server-room.svg` | 服务器机房 | 技术页面 |
| `circuit-pattern.svg` | 电路图案 | 装饰背景 |

### 5. 背景图案

位于 `frontend/public/patterns/` 目录

| 文件名 | 描述 | 重复类型 |
|--------|------|----------|
| `grid.svg` | 网格 | 平铺 |
| `circuit.svg` | 电路 | 平铺 |
| `scanlines.svg` | 扫描线 | 平铺 |
| `noise.svg` | 噪点 | 平铺 |
| `hexagon.svg` | 六边形 | 平铺 |
| `binary-rain.svg` | 二进制雨 | 垂直 |
| `cyber-grid.svg` | 赛博网格 | 平铺 |

## 🎯 使用指南

### 在 React 组件中使用图标

```tsx
import Image from 'next/image';

// 使用 SVG 图标
<Image
  src="/icons/cyberpunk/microchip.svg"
  alt="Microchip Icon"
  width={64}
  height={64}
  className="hover:opacity-80 transition-opacity"
/>
```

### 作为背景图案

```css
.hero-section {
  background-image: url('/patterns/cyber-grid.svg');
  background-repeat: repeat;
  background-size: 200px 200px;
}
```

### 作为插图使用

```tsx
<div className="relative h-96 w-full">
  <Image
    src="/illustrations/cyber-cityscape.svg"
    alt="Cyber City"
    fill
    className="object-cover"
  />
</div>
```

## 🎨 自定义样式

### 修改图标颜色

SVG 图标使用 CSS 变量，可以通过 Tailwind 类名覆盖：

```tsx
<Image
  src="/icons/search.svg"
  alt="Search"
  className="brightness-0 invert"
  style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }}
/>
```

### 添加发光效果

```css
.cyber-glow {
  filter: drop-shadow(0 0 4px #00f0ff)
          drop-shadow(0 0 8px #00f0ff);
}
```

## 📐 尺寸规范

### 图标尺寸
- **小**: 16x16px (按钮内联)
- **中**: 24x24px (标准图标)
- **大**: 32x32px (功能图标)
- **特大**: 48x48px (展示图标)
- **Hero**: 64x64px+ (特殊展示)

### 插画尺寸
- **小**: 400x300px
- **中**: 800x600px
- **大**: 1200x800px
- **全宽**: 1920x1080px

## 🔄 动画效果

所有动画图标使用 SVG SMIL 动画：

```xml
<animate attributeName="opacity"
         values="1;0.5;1"
         dur="2s"
         repeatCount="indefinite"/>
```

动画类型：
- **淡入淡出**: opacity 变化
- **缩放**: scale 变换
- **旋转**: rotate 变换
- **路径运动**: animateMotion

## 📝 创建新图标

### 设计原则

1. **一致性**: 保持与现有图标风格一致
2. **简洁性**: 使用简单的几何形状
3. **可读性**: 确保在小尺寸下清晰可见
4. **动画**: 适当添加动画增强效果

### SVG 模板

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="gradient">
      <stop offset="0%" style="stop-color:#00f0ff"/>
      <stop offset="100%" style="stop-color:#9d00ff"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5"/>
    </filter>
  </defs>

  <!-- 图标内容 -->
  <g filter="url(#glow)">
    <!-- 形状 -->
  </g>
</svg>
```

## 🔗 相关文档

- [配色参考](./COLOR_REFERENCE.md)
- [图标清单](./ICON_MANIFEST.md)
- [组件库](../components/ui/README.md)

---

**设计团队**: CyberPress AI Design Team
**最后更新**: 2026-03-06
