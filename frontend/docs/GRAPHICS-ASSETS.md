# CyberPress Graphics Assets - 图形素材清单

## 📋 概述

CyberPress 图形素材库包含丰富的赛博朋克风格图形资源，适用于各种场景和用途。

## 🎨 素材分类

### 1. Logo 标识

| 文件名 | 用途 | 尺寸 |
|--------|------|------|
| `logo.svg` | 主 Logo | 矢量 |
| `logo-icon.svg` | 图标 Logo | 64x64 |
| `logo-mark.svg` | Logo 标志 | 矢量 |
| `logo-square.svg` | 方形 Logo | 矢量 |
| `logo-favicon.svg` | 网站图标 | 32x32 |
| `logo-main.svg` | 主要 Logo | 矢量 |

#### 路径
```
/public/logo.svg
/public/logo-icon.svg
/public/logo-mark.svg
/public/logo-square.svg
/public/logo-favicon.svg
/public/logo-main.svg
/public/assets/logo/cyberpress-logo.svg
/public/assets/logo/cyberpress-favicon.svg
/public/assets/logo/cyberpress-icon.svg
```

### 2. 图标 (Icons)

#### 功能图标 (80+)
- 导航: `home`, `blog`, `portfolio`, `about`, `search`, `menu`
- 操作: `edit`, `delete`, `save`, `refresh`, `upload`, `download`
- 状态: `loading`, `check`, `alert`, `error`, `info`, `warning`
- 社交: `github`, `twitter`, `linkedin`, `discord`, `youtube`, `dribbble`
- 安全: `lock`, `unlock`, `shield`, `key`
- 通讯: `email`, `rss`, `share`, `comment`, `message`

#### 路径
```
/public/icons/*.svg (80+ SVG 图标)
/components/icons/*.tsx (React 图标组件)
```

### 3. 插图 (Illustrations)

#### 状态插图
| 插图 | 用途 | 文件 |
|------|------|------|
| 404 Glitch | 404 错误页 | `404-glitch.svg` |
| Coming Soon | 即将推出 | `coming-soon.svg` |
| Under Construction | 施工中 | `under-construction.svg` |
| Maintenance Mode | 维护模式 | `maintenance-mode.svg` |
| Access Forbidden | 访问禁止 | `access-forbidden.svg` |
| Feature Beta | 功能测试 | `feature-beta.svg` |
| Success Check | 成功状态 | `success-check.svg` |
| Error State | 错误状态 | `error-state.svg` |
| Empty State | 空状态 | `empty-state.svg` |
| No Results | 无结果 | `no-results.svg` |

#### 科技插图
| 插图 | 用途 | 文件 |
|------|------|------|
| Server Rack | 服务器 | `server-rack.svg`, `cyber-server.svg` |
| Code Screen | 代码编辑 | `code-screen.svg`, `code-editor.svg`, `cyber-coding.svg` |
| Circuit Board | 电路板 | `circuit-board.svg` |
| Network Globe | 网络地球 | `network-globe.svg`, `cyber-network.svg` |
| AI Neural Network | AI 神经网络 | `ai-neural-network.svg` |
| Holographic Data | 全息数据 | `holographic-data.svg` |
| Cyber Shield | 赛博盾牌 | `cyber-shield-security.svg` |

#### 特色插图
| 插图 | 用途 | 文件 |
|------|------|------|
| Cyber City | 赛博城市 | `cyber-city.svg` |
| Developer Workspace | 开发工作区 | `developer-workspace.svg` |
| Cyberpunk Hacker | 赛博朋克黑客 | `cyberpunk-hacker.svg` |
| Space Station | 空间站 | `space-station.svg` |
| Network Nodes | 网络节点 | `network-nodes.svg` |

#### 路径
```
/public/illustrations/*.svg (40+ SVG 插图)
/public/illustrations/abstracts/*.svg
```

### 4. 背景图案 (Patterns)

| 图案 | 用途 | 特点 |
|------|------|------|
| Grid | 网格背景 | 基础网格 |
| Circuit | 电路图案 | 科技感 |
| Scanlines | 扫描线 | 复古效果 |
| Noise | 噪点 | 纹理 |
| Hexagon | 六边形 | 蜂窝结构 |
| Matrix | 矩阵雨 | 动态效果 |
| Holographic | 全息图 | 3D 效果 |
| Hex Grid | 六角网格 | 几何图案 |

#### 路径
```
/public/patterns/*.svg
```

### 5. 装饰元素 (Decorations)

| 元素 | 用途 | 文件 |
|------|------|------|
| Corner Bracket | 角落装饰 | `corner-bracket.svg`, `cyber-corners.svg` |
| Divider Line | 分隔线 | `divider-line.svg`, `divider-tech.svg` |
| Loader Ring | 加载环 | `loader-ring.svg`, `loader-ring-animated.svg` |
| Tech Frame | 科技框架 | `tech-frame.svg`, `cyber-frame.svg` |
| Glow Line | 发光线 | `glow-line.svg`, `holo-line.svg` |
| Tech Corner | 科技角落 | `tech-corner.svg` |
| Data Stream | 数据流 | `data-stream.svg` |
| Hex Grid | 六角网格 | `hex-grid.svg` |
| Badge Tech | 科技徽章 | `badge-tech.svg` |

#### 路径
```
/public/decorations/*.svg (25+ 装饰元素)
```

### 6. 背景图 (Backgrounds)

| 背景 | 用途 | 特点 |
|------|------|------|
| Hero BG | 首页背景 | 大型展示 |
| Card BG | 卡片背景 | 卡片组件 |
| Loading BG | 加载背景 | 加载页面 |
| 404 BG | 错误页背景 | 404 页面 |

#### 路径
```
/public/backgrounds/*.svg
```

## 🎯 使用示例

### 在 React 组件中使用 SVG

```tsx
// 直接导入 SVG
import LogoSvg from '@/public/logo.svg';

export function Header() {
  return (
    <img src={LogoSvg.src} alt="CyberPress Logo" />
  );
}

// 使用图标组件
import { SearchIcon, BlogIcon, GitHubIcon } from '@/components/icons';

export function Navigation() {
  return (
    <nav>
      <SearchIcon className="w-6 h-6" />
      <BlogIcon size={24} />
      <GitHubIcon variant="purple" />
    </nav>
  );
}
```

### 在页面中使用插图

```tsx
export function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src="/illustrations/404-glitch.svg"
        alt="404 Not Found"
        className="w-full max-w-2xl"
      />
      <h1 className="text-4xl font-bold text-cyber-cyan mt-8">
        Page Not Found
      </h1>
    </div>
  );
}
```

### 使用背景图案

```css
/* 在 Tailwind CSS 中 */
.hero-section {
  background-image: url('/patterns/cyber-mesh-new.svg');
  background-size: cover;
}

.card {
  background-image: url('/patterns/grid.svg');
  background-size: 40px 40px;
}
```

### 使用装饰元素

```tsx
export function Card({ children }) {
  return (
    <div className="relative bg-cyber-card border border-cyber-border">
      {/* 装饰角落 */}
      <img
        src="/decorations/cyber-corners.svg"
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {children}
    </div>
  );
}
```

## 📐 尺寸规范

### Logo 尺寸
- **小**: 32x32px (图标/徽章)
- **中**: 64x64px (导航栏)
- **大**: 128x128px (页脚)
- **特大**: 256x256px (营销)

### 图标尺寸
- **小**: 16x16px (紧凑)
- **默认**: 24x24px (标准)
- **中**: 32x32px (强调)
- **大**: 48x48px (展示)

### 插图尺寸
- **卡片**: 400x300px
- **横幅**: 800x400px
- **全屏**: 1920x1080px

## 🎨 颜色变体

所有图形支持以下颜色主题：
- `cyan` - 霓虹青 (默认)
- `purple` - 赛博紫
- `pink` - 激光粉
- `yellow` - 电压黄
- `green` - 矩阵绿

## 📦 性能优化

### SVG 优化
- 使用 `svgo` 压缩 SVG
- 内联关键 SVG (首屏)
- 延迟加载非关键 SVG

### 图片优化
- 使用 Next.js Image 组件
- 提供多种尺寸 (srcset)
- 启用懒加载

```tsx
import Image from 'next/image';

<Image
  src="/illustrations/server-rack.svg"
  alt="Server Rack"
  width={800}
  height={600}
  priority // 首屏图片
/>
```

## 🔧 工具和资源

### SVG 编辑工具
- [Figma](https://www.figma.com/) - 设计和编辑
- [Inkscape](https://inkscape.org/) - 免费矢量编辑
- [SVGO](https://github.com/svg/svgo) - SVG 优化

### 在线工具
- [SVG OMG](https://jakearchibald.github.io/svgomg/) - SVG 优化
- [CodePen](https://codepen.io/) - SVG 动画测试

## 📝 更新日志

### v1.0.0 (2026-03-03)
- ✅ 添加状态插图 (10 个)
- ✅ 添加装饰元素 (25+ 个)
- ✅ 添加背景图案 (8 个)
- ✅ 更新图标库 (100+ 图标)
- ✅ 创建插图展示组件

## 🚀 未来计划

- [ ] 添加 3D 模型资源
- [ ] 创建动画 Lottie 文件
- [ ] 添加更多特色插图
- [ ] 创建 Figma 设计系统
- [ ] 添加 SVG 精灵图

---

**设计团队**: CyberPress AI Design Team
**最后更新**: 2026-03-03
**版本**: v1.0.0
