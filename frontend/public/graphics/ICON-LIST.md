# CyberPress Platform - 图标清单

## 📋 图标总览

### 导航图标 (Navigation Icons)

| 图标名称 | 文件名 | 用途 | 尺寸 | 颜色 |
|---------|--------|------|------|------|
| Home | `home-icon.svg` | 首页导航 | 24x24 | #00f0ff |
| Search | `search-icon.svg` | 搜索功能 | 24x24 | #00f0ff |
| Settings | `settings-icon.svg` | 设置页面 | 24x24 | #00f0ff |
| User | `user-icon.svg` | 用户中心 | 24x24 | #00f0ff |
| Blog | `blog-icon.svg` | 博客页面 | 24x24 | #00f0ff |

### 功能图标 (Feature Icons)

| 图标名称 | 文件名 | 用途 | 尺寸 | 颜色 |
|---------|--------|------|------|------|
| Portfolio | `portfolio-icon.svg` | 作品集 | 24x24 | #9d00ff |
| Code | `code-icon.svg` | 代码查看 | 24x24 | #9d00ff |
| Mail | `mail-icon.svg` | 邮件联系 | 24x24 | #ff0080 |
| Heart | `heart-icon.svg` | 喜欢/收藏 | 24x24 | #ff0080 |
| Star | `star-icon.svg` | 评分/收藏 | 24x24 | #ff0080 |

### 社交媒体图标 (Social Icons)

| 平台 | 文件名 | 用途 | 尺寸 | 颜色 |
|------|--------|------|------|------|
| GitHub | `github-icon.svg` | 代码仓库 | 24x24 | #00f0ff |
| Twitter/X | `twitter-icon.svg` | 社交分享 | 24x24 | #9d00ff |
| LinkedIn | `linkedin-icon.svg` | 职业社交 | 24x24 | #00f0ff |
| YouTube | `youtube-icon.svg` | 视频内容 | 24x24 | #ff0080 |
| Discord | `discord-icon.svg` | 社区交流 | 24x24 | #9d00ff |

## 🎨 图标样式规范

### 基础样式
```css
.icon {
  width: 24px;
  height: 24px;
  stroke-width: 1.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
```

### 发光效果
```css
.icon-glow {
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.6));
}
```

### 悬停效果
```css
.icon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 12px rgba(0, 240, 255, 0.8));
  transition: all 0.3s ease;
}
```

## 📐 图标网格系统

所有图标基于 24x24 像素网格设计：

```
┌─────────────────────┐
│ •                   │
│   •           •     │
│                     │
│       •       •     │
│                     │
│   •           •     │
│                     │
│ •                   │
└─────────────────────┘
  0 4 8 12 16 20 24
```

- 最小描边宽度：1px
- 推荐描边宽度：1.5px
- 视觉重心：网格中心 (12, 12)
- 安全区域：距边缘 2px

## 🎯 使用场景

### 导航栏图标
- 尺寸：24x24
- 颜色：`#00f0ff` (霓虹青)
- 效果：hover 时发光

### 页面标题图标
- 尺寸：32x32
- 颜色：`#9d00ff` (赛博紫)
- 效果：持续发光

### 按钮图标
- 尺寸：20x20
- 颜色：继承文本颜色
- 效果：点击时闪烁

### 装饰图标
- 尺寸：16x16 或 12x12
- 颜色：`#00f0ff` 或 `#9d00ff`
- 效果：闪烁动画

## 🔧 技术规格

### SVG 格式
```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- 图标路径 -->
</svg>
```

### React 组件封装
```tsx
interface IconProps {
  size?: number;
  className?: string;
  glow?: boolean;
  color?: string;
}

export const IconName: React.FC<IconProps> = ({
  size = 24,
  className = '',
  glow = false,
  color
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || 'currentColor'}
    className={glow ? 'icon-glow' : className}
  >
    {/* 路径 */}
  </svg>
);
```

## 📊 图标统计

- **总数量**：15 个核心图标
- **分类**：5 个分类
- **尺寸**：以 24x24 为主
- **格式**：SVG
- **风格**：赛博朋克/霓虹发光

## 🔄 动画图标

部分图标支持动画效果：

### 加载动画
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-icon {
  animation: spin 1s linear infinite;
}
```

### 脉冲动画
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse-icon {
  animation: pulse 2s ease-in-out infinite;
}
```

### 闪烁动画
```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.blink-icon {
  animation: blink 1.5s ease-in-out infinite;
}
```

## 📝 添加新图标

如需添加新图标，请遵循以下规范：

1. **尺寸**：使用 24x24 网格
2. **描边**：1.5px 描边宽度
3. **圆角**：使用 round 端点
4. **命名**：使用 kebab-case
5. **颜色**：使用 currentColor 支持动态颜色
6. **测试**：在深色和浅色背景下测试

## 🎨 配色参考

### 功能颜色
- **主要操作**：`#00f0ff` (霓虹青)
- **次要操作**：`#9d00ff` (赛博紫)
- **警告/危险**：`#ff0080` (激光粉)
- **成功/完成**：`#00ff88` (赛博绿)
- **信息/提示**：`#f0ff00` (赛博黄)

### 状态颜色
- **默认**：`#e0e0e0`
- **悬停**：`#ffffff`
- **激活**：`#00f0ff`
- **禁用**：`#666666`

---

**最后更新**：2026-03-03
**设计者**：AI 图形设计师
**版本**：1.0.0
