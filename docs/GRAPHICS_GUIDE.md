# CyberPress Platform - 图形素材完整指南

## 📊 素材总览

本项目包含完整的赛博朋克风格图形素材，涵盖 Logo、图标、插图和背景图案。

---

## 🎨 Logo 系列

### 主 Logo
**文件**: `frontend/public/logo-main.svg`
- **尺寸**: 300x80
- **用途**: 页面头部、品牌展示
- **特征**: 六边形科技图标 + 渐变文字

### 图标 Logo
**文件**: `frontend/public/logo-favicon.svg`
- **尺寸**: 64x64
- **用途**: 浏览器标签、小图标
- **特征**: 简化六边形 + 发光效果

### 方形 Logo
**文件**: `frontend/public/logo-square.svg`
- **尺寸**: 512x512
- **用途**: 社交媒体头像、应用图标
- **特征**: 完整六边形 + 电路装饰

### OG 图片
**文件**: `frontend/public/og-image.svg`
- **尺寸**: 1200x630
- **用途**: 社交分享预览
- **特征**: 完整品牌展示 + 标语

---

## 🔧 React 图标组件

### 基础图标
位于 `frontend/components/icons/` 目录

| 图标 | 文件名 | 颜色变体 |
|------|--------|----------|
| CPU 处理器 | `CpuIcon.tsx` | cyan, purple, pink, yellow |
| 数据库 | `DatabaseIcon.tsx` | cyan, purple, pink, yellow |
| 网络 | `NetworkIcon.tsx` | cyan, purple, pink, yellow |
| 安全锁 | `ShieldLockIcon.tsx` | cyan, purple, pink, yellow |
| 全息图 | `HologramIcon.tsx` | cyan, purple, pink, yellow |
| 芯片 | `ChipIcon.tsx` | cyan, purple, pink, yellow |

### 使用示例
```tsx
import { CpuIcon, DatabaseIcon } from '@/components/icons';

// 基础使用
<CpuIcon size={48} variant="cyan" />

// 带动画
<DatabaseIcon size={64} variant="purple" animated={true} />

// 自定义类名
<NetworkIcon size={48} variant="pink" className="opacity-80" />
```

---

## 🖼️ 插图素材

### 服务器机架
**文件**: `frontend/public/illustrations/server-rack.svg`
- **尺寸**: 400x300
- **内容**: 4U 服务器机架，带状态指示灯
- **动画**: 数据流动画
- **用途**: 关于页面、技术架构展示

### 电路板
**文件**: `frontend/public/illustrations/circuit-board.svg`
- **尺寸**: 400x300
- **内容**: PCB 电路板，节点和连接线
- **动画**: 数据脉冲动画
- **用途**: 技术背景、装饰插图

### 代码屏幕
**文件**: `frontend/public/illustrations/code-screen.svg`
- **尺寸**: 400x300
- **内容**: 终端窗口，带语法高亮代码
- **动画**: 光标闪烁
- **用途**: 开发者相关页面、技术文档

### 网络地球
**文件**: `frontend/public/illustrations/network-globe.svg`
- **尺寸**: 400x300
- **内容**: 轨道网络，卫星节点
- **动画**: 轨道旋转，数据传输
- **用途**: 全球化展示、分布式系统

---

## 🌈 配色方案

### 核心颜色
```css
--cyber-dark: #0a0a0f;       /* 深空黑 - 主背景 */
--cyber-cyan: #00f0ff;       /* 霓虹青 - 主强调色 */
--cyber-purple: #9d00ff;     /* 赛博紫 - 次强调色 */
--cyber-pink: #ff0080;       /* 激光粉 - 强调色 */
--cyber-yellow: #f0ff00;     /* 电压黄 - 高亮色 */
```

### 渐变组合
```css
/* 霓虹渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 热力渐变 */
background: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);

/* 全光谱渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

### 发光效果
```css
/* 霓虹发光 */
box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;

/* 强发光 */
box-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff;
```

---

## 📐 设计规范

### 尺寸标准
- **Logo**: 200x200 (标准), 64x64 (图标), 512x512 (方形)
- **图标**: 24x24 (标准), 48x48 (大图标)
- **插图**: 400x300 (标准), 800x600 (高清)
- **OG 图片**: 1200x630 (社交分享)

### 线条粗细
- **主轮廓**: 1.5px - 2px
- **细节线条**: 0.5px - 1px
- **装饰元素**: 1px

### 发光半径
- **轻微发光**: stdDeviation="1"
- **标准发光**: stdDeviation="1.5"
- **强发光**: stdDeviation="2"

### 透明度层级
- **完全不透明**: 1.0 (主要元素)
- **主要透明**: 0.6 - 0.8 (次要元素)
- **轻微透明**: 0.3 - 0.5 (装饰元素)
- **极轻微透明**: 0.1 - 0.2 (背景)

---

## 🎬 动画效果

### 内置动画
```tsx
// 脉冲动画
<CpuIcon animated={true} />

// 自定义动画类
<DatabaseIcon className="animate-pulse" />
<HologramIcon className="animate-spin" />
```

### SVG 动画
插图组件包含 SVG 原生动画：
- **数据流动**: `animateMotion` 路径动画
- **光标闪烁**: `animate` opacity 变化
- **轨道旋转**: `animateTransform` 旋转

---

## 🔨 使用场景

### 页面头部
```tsx
<Image src="/logo-main.svg" alt="CyberPress" width={200} height={80} />
```

### 功能图标
```tsx
<CpuIcon size={32} variant="cyan" />
<DatabaseIcon size={32} variant="purple" />
```

### 技术展示
```tsx
<Image src="/illustrations/server-rack.svg" alt="Server" width={400} height={300} />
```

### 背景装饰
```tsx
<div className="absolute inset-0 opacity-10">
  <Image src="/illustrations/circuit-board.svg" alt="" fill />
</div>
```

---

## 📝 注意事项

1. **颜色一致性**: 使用定义好的颜色变体，保持品牌一致性
2. **尺寸适配**: 根据使用场景选择合适的尺寸
3. **性能优化**: 大图使用懒加载，图标使用组件
4. **可访问性**: 添加适当的 alt 文本和 aria 标签
5. **动画性能**: 避免过多同时动画，影响性能

---

## 🚀 扩展指南

### 添加新图标
1. 创建组件文件 `frontend/components/icons/NewIcon.tsx`
2. 使用相同的颜色映射和滤镜系统
3. 支持标准属性：`size`, `variant`, `className`, `animated`
4. 更新本指南

### 添加新插图
1. 创建 SVG 文件 `frontend/public/illustrations/new-art.svg`
2. 保持 400x300 或 800x600 尺寸
3. 使用项目配色方案
4. 添加适当的动画效果
5. 更新本指南

---

## 📦 文件结构

```
frontend/
├── public/
│   ├── logo-main.svg              # 主 Logo
│   ├── logo-favicon.svg           # 图标 Logo
│   ├── logo-square.svg            # 方形 Logo
│   ├── og-image.svg               # OG 分享图
│   └── illustrations/
│       ├── server-rack.svg        # 服务器机架
│       ├── circuit-board.svg      # 电路板
│       ├── code-screen.svg        # 代码屏幕
│       └── network-globe.svg      # 网络地球
│
└── components/
    └── icons/
        ├── CpuIcon.tsx            # CPU 图标
        ├── DatabaseIcon.tsx       # 数据库图标
        ├── NetworkIcon.tsx        # 网络图标
        ├── ShieldLockIcon.tsx     # 安全锁图标
        ├── HologramIcon.tsx       # 全息图图标
        └── ChipIcon.tsx           # 芯片图标
```

---

**创建时间**: 2026-03-02
**版本**: v1.0.0
**维护者**: CyberPress Design Team
**主题**: Cyberpunk Aesthetics v2.0
