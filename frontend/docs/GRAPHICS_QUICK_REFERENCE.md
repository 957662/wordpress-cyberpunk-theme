# CyberPress Graphics Quick Reference
## 🎨 图形素材快速参考

**版本**: v2.0.0
**最后更新**: 2026-03-06

---

## 📊 快速统计

- **Logo**: 6 个变体
- **图标**: 112 个 (100 核心 + 12 赛博朋克)
- **插画**: 40+ 个
- **装饰元素**: 5 个
- **背景**: 3 个
- **图案**: 5 个
- **文档**: 5 个

**总计**: 176+ 个文件

---

## 🎯 快速使用

### Logo

```tsx
<Image src="/logo.svg" alt="CyberPress" width={200} height={60} />
```

### 图标

```tsx
<Image src="/icons/github.svg" alt="GitHub" width={24} height={24} />
```

### 插画

```tsx
<Image src="/illustrations/cyber-loading.svg" alt="Loading" width={400} height={300} />
```

### 背景

```css
background-image: url('/backgrounds/hero-bg.svg');
```

### 图案

```css
background-image: url('/patterns/grid.svg');
```

---

## 🎨 快速配色

### 主色系

```css
--cyber-dark: #0a0a0f    /* 主背景 */
--cyber-cyan: #00f0ff    /* 霓虹青 */
--cyber-purple: #9d00ff  /* 赛博紫 */
--cyber-pink: #ff0080    /* 激光粉 */
```

### 渐变

```css
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
```

### 发光

```css
box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
```

---

## 📁 文件位置

```
frontend/public/
├── logo*.svg                    # Logo
├── icons/                       # 图标
│   ├── *.svg                   # 核心图标
│   └── cyberpunk/              # 赛博朋克图标
├── illustrations/               # 插画
├── decorations/                # 装饰元素
├── backgrounds/                # 背景
└── patterns/                   # 图案
```

---

## 🔗 相关文档

- [完整图形素材目录](GRAPHICS_ASSETS_CATALOG.md)
- [配色参考 v2.0](COLOR_PALETTE_V2.md)
- [图标清单 v3](ICON_MANIFEST_V3.md)
- [图形素材交付报告](../../GRAPHICS_DELIVERY_REPORT.md)

---

## 📞 联系方式

**设计团队**: CyberPress AI Design Team
**版本**: v2.0.0
