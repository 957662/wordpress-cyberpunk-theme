# CyberPress Platform - 图形资源快速索引

## 📁 文件结构

```
frontend/public/
├── 📄 logo-main.svg              # 主 Logo (512x512)
├── 📄 logo-square.svg            # 方形 Logo (512x512)
├── 📄 logo-favicon.svg           # 网站图标 (64x64)
├── 📄 og-image.svg               # 社交分享图 (1200x630)
├── 📄 sprite-icons.svg           # SVG Sprite 系统
│
├── 📁 icons/                     # 功能图标 (60+)
│   ├── navigation/
│   │   ├── home.svg
│   │   ├── blog.svg
│   │   ├── portfolio.svg
│   │   └── about.svg
│   ├── social/
│   │   ├── github.svg
│   │   ├── twitter.svg
│   │   ├── linkedin.svg
│   │   └── email.svg
│   ├── ui/
│   │   ├── search.svg
│   │   ├── menu.svg
│   │   ├── user.svg
│   │   └── settings.svg
│   └── actions/
│       ├── edit.svg
│       ├── delete.svg
│       ├── save.svg
│       └── share.svg
│
├── 📁 illustrations/             # 插画 (7+)
│   ├── cyber-city.svg           # 赛博城市 (800x400)
│   ├── developer-workspace.svg  # 开发工作区 (600x400)
│   ├── network-nodes.svg        # 网络节点 (600x400)
│   ├── server-rack.svg
│   ├── code-screen.svg
│   ├── circuit-board.svg
│   └── network-globe.svg
│
├── 📁 patterns/                  # 背景图案 (8+)
│   ├── grid.svg                 # 网格
│   ├── circuit.svg              # 电路
│   ├── scanlines.svg            # 扫描线
│   ├── noise.svg                # 噪点
│   ├── hexagon.svg              # 六边形
│   ├── matrix.svg               # 矩阵
│   ├── holographic.svg          # 全息
│   └── hex-grid.svg             # 六边形网格
│
├── 📁 backgrounds/               # 背景图片
│   ├── hero-bg.svg
│   ├── card-bg.svg
│   ├── loading-bg.svg
│   └── 404-bg.svg
│
└── 📁 decorations/               # 装饰元素
    ├── corner-bracket.svg       # 边框装饰
    ├── divider-line.svg         # 分隔线
    └── loader-ring.svg          # 加载动画
```

---

## 🎨 快速使用

### 图标
```tsx
<img src="/icons/home.svg" alt="Home" width="24" height="24" />
```

### Logo
```tsx
<img src="/logo-main.svg" alt="CyberPress" width="200" height="200" />
```

### 插画
```tsx
<img src="/illustrations/cyber-city.svg" alt="Cyber City" width="800" height="400" />
```

### 背景
```css
background-image: url('/patterns/grid.svg');
```

---

## 📊 统计

- **Logo 变体**: 4 个
- **功能图标**: 60+ 个
- **插画**: 7+ 个
- **背景图案**: 8 个
- **装饰元素**: 3 个
- **总计**: 80+ 图形资源

---

## 🎯 核心颜色

```css
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;
--cyber-yellow: #f0ff00;
--cyber-black: #0a0a0f;
```

---

**查看完整文档**: [GRAPHICS_GUIDE.md](/GRAPHICS_GUIDE.md)
