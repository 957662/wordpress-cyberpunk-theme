# CyberPress Brand Assets - 品牌素材

## 📁 目录结构

```
frontend/public/brand/
├── cyber-logo-complete.svg   # 完整 Logo（带文字）
├── cyber-favicon.svg         # Favicon 图标
├── cyber-app-icon.svg        # 应用图标
└── README.md                 # 本文档
```

## 🎨 品牌素材说明

### cyber-logo-complete.svg - 完整 Logo
**用途**: 网站页眉、品牌展示、宣传材料
**尺寸**: 400x100
**格式**: SVG
**特点**: 六边形标志 + 文字

### cyber-favicon.svg - Favicon
**用途**: 浏览器标签图标、收藏夹图标
**尺寸**: 64x64
**格式**: SVG
**特点**: 简化的六边形标志

### cyber-app-icon.svg - 应用图标
**用途**: PWA 图标、移动应用图标、应用商店
**尺寸**: 512x512
**格式**: SVG
**特点**: 完整的应用图标，带背景和装饰

## 🎯 使用指南

### HTML 使用

```html
<!-- 完整 Logo -->
<img src="/brand/cyber-logo-complete.svg" alt="CyberPress Logo" width="400" height="100">

<!-- Favicon -->
<link rel="icon" href="/brand/cyber-favicon.svg" type="image/svg+xml">

<!-- 应用图标 -->
<link rel="apple-touch-icon" href="/brand/cyber-app-icon.svg">
```

### Next.js 使用

```tsx
import Image from 'next/image';

// 完整 Logo
<Image
  src="/brand/cyber-logo-complete.svg"
  alt="CyberPress"
  width={400}
  height={100}
  priority
/>

// 应用图标
<Image
  src="/brand/cyber-app-icon.svg"
  alt="CyberPress App"
  width={512}
  height={512}
/>
```

### CSS 背景

```css
.site-header {
  background-image: url('/brand/cyber-logo-complete.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
```

## 🎨 设计规范

### 颜色方案
- **主色**: 霓虹青 (#00f0ff)
- **辅助色**: 赛博紫 (#9d00ff)
- **强调色**: 激光粉 (#ff0080)
- **背景**: 深空黑 (#0a0a0f)

### 视觉特征
- ✅ 六边形作为主要形状
- ✅ 电路元素装饰
- ✅ 霓虹发光效果
- ✅ 渐变色彩应用
- ✅ 科技感线条

### 使用场景

#### 完整 Logo (cyber-logo-complete.svg)
- 网站页眉
- 落页/着陆页
- 宣传横幅
- 名片/信头
- 社交媒体封面

#### Favicon (cyber-favicon.svg)
- 浏览器标签
- 收藏夹
- 浏览器历史
- 状态栏图标

#### 应用图标 (cyber-app-icon.svg)
- PWA 应用图标
- 移动应用图标
- 应用商店展示
- 桌面快捷方式
- 启动画面

## 📏 尺寸规格

### 完整 Logo
- **原始尺寸**: 400x100
- **最小尺寸**: 200x50
- **最大尺寸**: 800x200
- **推荐比例**: 4:1

### Favicon
- **标准尺寸**: 32x32, 64x64
- **高清尺寸**: 128x128, 256x256
- **格式**: SVG (推荐), ICO, PNG

### 应用图标
- **iOS**: 1024x1024 (App Store)
- **Android**: 512x512 (Play Store)
- **PWA**: 192x192, 512x512
- **Favicon**: 48x48, 96x96

## 🔧 配置文件

### Next.js 配置

```javascript
// next.config.js
module.exports = {
  images: {
    iconSizes: [64, 128, 256],
    appleIcon: true,
  },
};
```

### manifest.json (PWA)

```json
{
  "name": "CyberPress",
  "short_name": "CyberPress",
  "icons": [
    {
      "src": "/brand/cyber-app-icon.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

### HTML Head

```html
<head>
  <!-- Favicon -->
  <link rel="icon" href="/brand/cyber-favicon.svg" type="image/svg+xml">

  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" href="/brand/cyber-app-icon.svg">

  <!-- PWA Icon -->
  <link rel="icon" type="image/svg+xml" href="/brand/cyber-app-icon.svg">
</head>
```

## 🎭 变体与适配

### 深色模式
所有品牌素材默认为深色模式设计，在深色背景上效果最佳。

### 浅色模式
如需在浅色背景使用，可以：
1. 使用 CSS 滤镜反转颜色
2. 创建浅色版本
3. 添加深色背景容器

### 动画版本
可以为 Logo 添加动画效果：

```css
@keyframes logo-glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(157, 0, 255, 0.8));
  }
}

.cyber-logo-animated {
  animation: logo-glow 3s ease-in-out infinite;
}
```

## 📊 文件导出

如需导出为其他格式：

### PNG 格式
```bash
# 使用 rsvg-convert (推荐)
rsvg-convert -w 400 -h 100 cyber-logo-complete.svg -o cyber-logo-complete.png

# 使用 ImageMagick
convert -background none cyber-logo-complete.svg cyber-logo-complete.png
```

### ICO 格式
```bash
# 使用 png2ico
png2ico favicon.ico cyber-favicon-16.png cyber-favicon-32.png cyber-favicon-64.png
```

### WebP 格式
```bash
# 使用 cwebp
cwebp -q 90 cyber-logo-complete.svg -o cyber-logo-complete.webp
```

## 🎯 使用示例

### 导航栏 Logo

```tsx
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center">
      <Link href="/">
        <Image
          src="/brand/cyber-logo-complete.svg"
          alt="CyberPress"
          width={200}
          height={50}
          className="hover:opacity-80 transition-opacity"
        />
      </Link>
    </nav>
  );
}
```

### 页脚 Logo

```tsx
export function Footer() {
  return (
    <footer className="text-center">
      <Image
        src="/brand/cyber-logo-complete.svg"
        alt="CyberPress"
        width={300}
        height={75}
        className="mx-auto opacity-60"
      />
      <p className="mt-4 text-sm text-gray-400">© 2026 CyberPress</p>
    </footer>
  );
}
```

### PWA 安装提示

```tsx
export function InstallPrompt() {
  return (
    <div className="flex items-center gap-4">
      <Image
        src="/brand/cyber-app-icon.svg"
        alt="CyberPress App"
        width={64}
        height={64}
      />
      <div>
        <h3>Install CyberPress</h3>
        <p>Get the full experience</p>
      </div>
    </div>
  );
}
```

## 🔍 质量检查

使用品牌素材前请确认：

- [ ] 尺寸适合使用场景
- [ ] 颜色对比度符合可访问性标准
- [ ] 文件已优化（去除不必要的元数据）
- [ ] 在目标浏览器中测试显示效果
- [ ] 响应式设计测试
- [ ] 深色/浅色模式测试

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

注意：SVG 格式在所有现代浏览器中都得到良好支持。

## 📞 技术支持

如有问题或需要帮助，请参考：
- [图标清单](../docs/ICON_MANIFEST.md)
- [配色参考](../docs/COLOR_REFERENCE.md)
- [图形素材说明](../public/README-GRAPHICS.md)

---

**版本**: v1.0.0
**最后更新**: 2026-03-06
**维护者**: CyberPress AI Design Team
