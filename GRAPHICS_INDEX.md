# CyberPress Platform - 图形素材索引

> 最后更新: 2026-03-03
> 版本: 2.0.0
> 设计师: AI 图形设计师

---

## 📊 总览

```
┌─────────────────────────────────────────────────────────────┐
│                    CYBERPRESS 图形素材                        │
├─────────────────────────────────────────────────────────────┤
│  Logo 资源          │  3 个文件                              │
│  自定义图标         │  6 个组件                              │
│  背景图案           │  5 个 SVG                              │
│  文档               │  3 个文件                              │
├─────────────────────────────────────────────────────────────┤
│  总计交付           │  17 个项目                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Logo 资源

### 位置
```
frontend/public/logos/
```

### 文件列表

| 文件 | 尺寸 | 描述 | 使用场景 |
|------|------|------|----------|
| `cyberpress-logo.svg` | 200×200 | 主 Logo，完整设计 | 网站页眉、品牌展示 |
| `cyberpress-logo-icon.svg` | 64×64 | 简化版，高识别度 | Favicon、小图标 |
| `cyberpress-logo-square.svg` | 512×512 | 方形版，深色背景 | 社交媒体、应用图标 |

### 设计特点
- ✅ 六边形核心结构
- ✅ CPU 芯片纹路装饰
- ✅ 霓虹发光滤镜效果
- ✅ 赛博朋克配色方案
- ✅ SVG 矢量格式，任意缩放

---

## 🔷 自定义图标组件

### 位置
```
frontend/components/icons/
```

### 组件列表

#### 1. CyberGlitchIcon
```
用途: 错误、警告、故障效果
特色: RGB 分离偏移
```

#### 2. CyberMatrixIcon
```
用途: 数据流、代码、技术
特色: 支持动画模式
```

#### 3. CyberHoloIcon
```
用途: 全息投影、VR、未来科技
特色: 3D 空间感
```

#### 4. CyberNodeIcon
```
用途: 网络、区块链、分布式
特色: 节点连接动画
```

#### 5. CyberShieldIcon
```
用途: 安全、加密、认证
特色: 状态指示灯
```

#### 6. CyberDataIcon
```
用途: 数据库、存储、处理
特色: 数据流动画
```

### 使用方式
```tsx
import {
  CyberGlitchIcon,
  CyberMatrixIcon,
  CyberHoloIcon,
  CyberNodeIcon,
  CyberShieldIcon,
  CyberDataIcon
} from '@/components/icons/cyber-icons';

<CyberGlitchIcon size={24} color="#00f0ff" />
```

---

## 🖼️ 背景图案

### 位置
```
frontend/public/patterns/
```

### 图案列表

| 文件 | 单元尺寸 | 风格 | 透明度 |
|------|----------|------|--------|
| `cyber-grid.svg` | 100×100 | 网格 + 节点 | 0.1-0.15 |
| `scanlines.svg` | 10×10 | CRT 扫描线 | 0.03-0.05 |
| `hexagons.svg` | 120×104 | 六边形阵列 | 0.05 |
| `circuit.svg` | 200×200 | 电路板路径 | 0.08 |
| `particles.svg` | 200×200 | 随机粒子 | 0.2-0.6 |

### 使用方式
```css
.cyber-bg {
  background-image: url('/patterns/cyber-grid.svg');
  background-repeat: repeat;
}
```

---

## 📄 文档

### 位置
```
frontend/public/
docs/
```

### 文档列表

| 文件 | 内容 |
|------|------|
| `GRAPHICS_ASSETS.md` | 完整图形素材清单 |
| `CYBERPRESS_COLORS.md` | 配色参考手册 |
| `GRAPHICS_DELIVERY.md` | 交付文档 |
| `patterns/README.md` | 背景图案说明 |

---

## 🎨 配色系统

### 主要霓虹色

| 名称 | 色值 | RGB | 用途 |
|------|------|-----|------|
| 赛博青 | `#00f0ff` | `rgb(0,240,255)` | 主强调色 |
| 赛博紫 | `#9d00ff` | `rgb(157,0,255)` | 次强调色 |
| 激光粉 | `#ff0080` | `rgb(255,0,128)` | 特殊状态 |
| 电压黄 | `#f0ff00` | `rgb(240,255,0)` | 高亮显示 |

### 背景色系

| 名称 | 色值 | 用途 |
|------|------|------|
| 深空黑 | `#0a0a0f` | 主背景 |
| 次黑 | `#050508` | 次背景 |
| 卡片黑 | `#16162a` | 卡片背景 |
| 静默黑 | `#1a1a2e` | 静默背景 |

### 功能色系

| 名称 | 色值 | 用途 |
|------|------|------|
| 成功绿 | `#00ff88` | 成功状态 |
| 警告橙 | `#ff6600` | 警告状态 |
| 错误红 | `#ff0040` | 错误状态 |

---

## ✨ 视觉效果

### 霓虹发光
```css
box-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
```

### 渐变背景
```css
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
```

### 扫描线叠加
```css
background-image: url('/patterns/scanlines.svg');
pointer-events: none;
```

---

## 📐 尺寸规范

### Logo 尺寸
- Favicon: 32×32 ~ 64×64
- 小图标: 64×64
- 标准: 200×200
- 大尺寸: 512×512
- 打印: 1024×1024+

### 图标尺寸
- 内联: 16-20px
- 按钮: 20-24px
- 导航: 24-32px
- 展示: 48-64px
- 特大: 96px+

---

## 🚀 快速开始

### 1. 导入 Logo
```tsx
import Image from 'next/image';

<Image
  src="/logos/cyberpress-logo.svg"
  alt="CyberPress"
  width={200}
  height={200}
/>
```

### 2. 使用图标
```tsx
import { CyberGlitchIcon } from '@/components/icons/cyber-icons';

<CyberGlitchIcon size={24} color="#00f0ff" />
```

### 3. 应用背景
```css
.cyber-section {
  background-color: #0a0a0f;
  background-image: url('/patterns/cyber-grid.svg');
}
```

---

## 📋 待办事项

### 高优先级
- [ ] Favicon.ico 转换
- [ ] Apple Touch Icon
- [ ] Open Graph 图片

### 中优先级
- [ ] 404 页面插画
- [ ] 加载动画优化
- [ ] 空状态插画

### 低优先级
- [ ] 社交媒体模板
- [ ] 品牌指南 PDF
- [ ] 宣传横幅设计

---

## 🔗 相关资源

- [设计系统](/docs/DESIGN-SYSTEM.md)
- [图标目录](/docs/ICON-CATALOG.md)
- [项目蓝图](/PROJECT.md)

---

## 📝 版本历史

### v2.0.0 (2026-03-03)
- ✨ 新增 6 个赛博朋克图标组件
- ✨ 新增 5 个背景图案 SVG
- ✨ 创建完整配色参考手册
- ✨ 优化 Logo 设计
- 📝 完善文档体系

### v1.0.0 (2024-03-02)
- 🎉 初始版本
- 📦 基础 Logo 资源
- 🎨 设计系统文档

---

**设计者**: AI 图形设计师
**项目**: CyberPress Platform
**交付日期**: 2026-03-03

---

*本文档是 CyberPress Platform 图形素材的完整索引。*
