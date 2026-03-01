# CyberPress Platform - 图形素材完整清单

**创建时间**: 2026-03-02
**版本**: v2.0.0
**主题**: Cyberpunk Aesthetics

---

## 📊 素材统计

| 类别 | 数量 | 文件位置 |
|------|------|----------|
| Logo 文件 | 4 | `frontend/public/` |
| SVG 图标 | 60+ | `frontend/public/icons/` |
| React 图标组件 | 30+ | `frontend/components/icons/` |
| 赛博朋克图标组件 | 6 | `frontend/components/icons/` |
| 插图素材 | 4 | `frontend/public/illustrations/` |
| 展示组件 | 2 | `frontend/components/examples/` |
| 背景图案 | 6 | `frontend/public/patterns/` |
| 背景文件 | 4 | `frontend/public/backgrounds/` |

**总计**: 116+ 图形素材文件

---

## 🎨 Logo 系列

### 主 Logo
```
文件: frontend/public/logo-main.svg
尺寸: 300x80
用途: 页面头部、品牌展示
特色: 六边形科技图标 + 渐变文字 + 霓虹发光
```

### 图标 Logo
```
文件: frontend/public/logo-favicon.svg
尺寸: 64x64
用途: 浏览器标签、小图标
特色: 简化六边形 + 强发光效果
```

### 方形 Logo
```
文件: frontend/public/logo-square.svg
尺寸: 512x512
用途: 社交媒体头像、应用图标
特色: 完整六边形 + 电路装饰 + 多层发光
```

### OG 分享图
```
文件: frontend/public/og-image.svg
尺寸: 1200x630
用途: 社交分享预览
特色: 完整品牌展示 + 标语 + 装饰元素
```

---

## 🔧 赛博朋克图标组件 (新增)

### CPU 处理器图标
```tsx
文件: frontend/components/icons/CpuIcon.tsx
组件名: CpuIcon
尺寸: 48 (默认)
变体: cyan | purple | pink | yellow
动画: 脉冲 (可选)
特色: 外框引脚 + 内核电路 + 多层发光
```

### 数据库图标
```tsx
文件: frontend/components/icons/DatabaseIcon.tsx
组件名: DatabaseIcon
尺寸: 48 (默认)
变体: cyan | purple | pink | yellow
动画: 脉冲 (可选)
特色: 层叠磁盘 + 数据节点 + 连接线
```

### 网络图标
```tsx
文件: frontend/components/icons/NetworkIcon.tsx
组件名: NetworkIcon
尺寸: 48 (默认)
变体: cyan | purple | pink | yellow
动画: 脉冲 (可选)
特色: 中心枢纽 + 节点连接 + 网状结构
```

### 安全锁图标
```tsx
文件: frontend/components/icons/ShieldLockIcon.tsx
组件名: ShieldLockIcon
尺寸: 48 (默认)
变体: cyan | purple | pink | yellow
特色: 盾牌外框 + 锁体 + 锁孔
状态: locked (boolean)
```

### 全息图图标
```tsx
文件: frontend/components/icons/HologramIcon.tsx
组件名: HologramIcon
尺寸: 48 (默认)
变体: cyan | purple | pink | yellow
动画: 脉冲 (可选)
特色: 3D立方体 + 投影锥 + 扫描线
```

### 芯片图标
```tsx
文件: frontend/components/icons/ChipIcon.tsx
组件名: ChipIcon
尺寸: 48 (默认)
变体: cyan | purple | pink | yellow
动画: 脉冲 (可选)
特色: IC芯片 + 电路网格 + 引脚阵列
```

### 使用示例
```tsx
import { CpuIcon, DatabaseIcon, NetworkIcon } from '@/components/icons';

// 基础使用
<CpuIcon size={48} variant="cyan" />

// 带动画
<DatabaseIcon size={64} variant="purple" animated={true} />

// 自定义样式
<NetworkIcon size={32} variant="pink" className="opacity-80" />
```

---

## 🖼️ 插图素材 (新增)

### 服务器机架
```
文件: frontend/public/illustrations/server-rack.svg
尺寸: 400x300
内容: 4U 服务器机架，带状态指示灯和数据流动画
用途: 技术架构页、关于页面、服务器展示
特色: 多层服务器 + LED 状态灯 + 数据流动画
```

### 电路板
```
文件: frontend/public/illustrations/circuit-board.svg
尺寸: 400x300
内容: PCB 电路板，节点和连接线
用途: 技术背景、装饰插图、科技主题页
特色: 网格基底 + 电路轨迹 + 数据脉冲动画
```

### 代码屏幕
```
文件: frontend/public/illustrations/code-screen.svg
尺寸: 400x300
内容: 终端窗口，带语法高亮代码
用途: 开发者页面、技术文档、编程教程
特色: 语法高亮 + 闪烁光标 + 扫描线效果
```

### 网络地球
```
文件: frontend/public/illustrations/network-globe.svg
尺寸: 400x300
内容: 轨道网络，卫星节点
用途: 全球化展示、分布式系统、CDN 说明
特色: 轨道旋转 + 数据传输 + 卫星节点
```

### 使用示例
```tsx
import Image from 'next/image';

// 基础使用
<Image src="/illustrations/server-rack.svg" alt="Server" width={400} height={300} />

// 响应式
<div className="relative w-full h-64">
  <Image src="/illustrations/circuit-board.svg" alt="" fill className="object-contain" />
</div>

// 背景使用
<div className="relative">
  <Image src="/illustrations/code-screen.svg" alt="" fill className="opacity-10" />
  <div className="relative z-10">{/* 内容 */}</div>
</div>
```

---

## 🎨 配色方案

### 核心颜色
```css
--cyber-dark: #0a0a0f;       /* 深空黑 - 主背景 */
--cyber-cyan: #00f0ff;       /* 霓虹青 - 主强调色 */
--cyber-purple: #9d00ff;     /* 赛博紫 - 次强调色 */
--cyber-pink: #ff0080;       /* 激光粉 - 强调色 */
--cyber-yellow: #f0ff00;     /* 电压黄 - 高亮色 */
--cyber-green: #00ff88;      /* 矩阵绿 - 成功色 */
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
box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor;

/* 文字发光 */
text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;

/* 强发光 */
box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
```

---

## 📐 设计规范

### 尺寸标准
- **Logo 标准**: 200x200
- **Logo 图标**: 64x64
- **Logo 方形**: 512x512
- **图标标准**: 24x24
- **大图标**: 48x48
- **插图标准**: 400x300
- **插图高清**: 800x600

### 线条粗细
- **主轮廓**: 1.5px - 2px
- **细节线条**: 0.5px - 1px
- **装饰元素**: 1px

### 发光半径
- **轻微**: stdDeviation="1"
- **标准**: stdDeviation="1.5"
- **强发光**: stdDeviation="2"

### 透明度
- **完全不透明**: 1.0
- **主要**: 0.6 - 0.8
- **次要**: 0.3 - 0.5
- **装饰**: 0.1 - 0.2

---

## 🎬 动画效果

### CSS 动画类
```tsx
// 脉冲
<Icon className="animate-pulse" />

// 旋转
<Icon className="animate-spin" />

// 弹跳
<Icon className="animate-bounce" />
```

### 组件动画
```tsx
// 内置动画支持
<CpuIcon animated={true} />
<DatabaseIcon animated={true} />
```

### SVG 动画
插图包含原生 SVG 动画：
- 数据流动 (animateMotion)
- 光标闪烁 (animate opacity)
- 轨道旋转 (animateTransform)

---

## 📦 文件结构

```
frontend/
├── public/
│   ├── logo-main.svg                    # 主 Logo
│   ├── logo-favicon.svg                 # 图标 Logo
│   ├── logo-square.svg                  # 方形 Logo
│   ├── og-image.svg                     # OG 分享图
│   ├── illustrations/                   # 插图目录
│   │   ├── server-rack.svg             # 服务器机架
│   │   ├── circuit-board.svg           # 电路板
│   │   ├── code-screen.svg             # 代码屏幕
│   │   └── network-globe.svg           # 网络地球
│   ├── icons/                          # SVG 图标 (60+)
│   ├── patterns/                       # 背景图案 (6)
│   └── backgrounds/                    # 背景文件 (4)
│
├── components/
│   ├── icons/                          # React 图标组件
│   │   ├── CpuIcon.tsx                # CPU 处理器
│   │   ├── DatabaseIcon.tsx           # 数据库
│   │   ├── NetworkIcon.tsx            # 网络
│   │   ├── ShieldLockIcon.tsx         # 安全锁
│   │   ├── HologramIcon.tsx           # 全息图
│   │   ├── ChipIcon.tsx               # 芯片
│   │   └── index.ts                   # 统一导出
│   │
│   └── examples/                      # 展示组件
│       ├── CyberIconShowcase.tsx      # 图标展示
│       └── IllustrationShowcase.tsx   # 插图展示
│
└── docs/
    ├── GRAPHICS_GUIDE.md             # 图形使用指南
    └── GRAPHICS_MANIFEST.md          # 本文件
```

---

## 🔨 使用场景

### 1. 页面头部
```tsx
<Image src="/logo-main.svg" alt="CyberPress" width={200} height={80} />
```

### 2. 功能图标
```tsx
<CpuIcon size={32} variant="cyan" />
<DatabaseIcon size={32} variant="purple" />
```

### 3. 技术展示
```tsx
<Image src="/illustrations/server-rack.svg" alt="Server" width={400} height={300} />
```

### 4. 背景装饰
```tsx
<div className="absolute inset-0 opacity-10">
  <Image src="/illustrations/circuit-board.svg" alt="" fill />
</div>
```

### 5. 品牌展示
```tsx
<Image src="/logo-square.svg" alt="CyberPress" width={128} height={128} />
```

---

## 📝 扩展指南

### 添加新图标
1. 创建组件文件 `frontend/components/icons/NewIcon.tsx`
2. 使用相同的颜色映射和滤镜系统
3. 支持标准属性：`size`, `variant`, `className`, `animated`
4. 在 `index.ts` 中导出
5. 更新本清单

### 添加新插图
1. 创建 SVG 文件 `frontend/public/illustrations/new-art.svg`
2. 保持 400x300 或 800x600 尺寸
3. 使用项目配色方案
4. 添加适当的动画效果
5. 更新本清单

---

## 📋 检查清单

使用图形素材前请确认：

- [ ] 文件路径正确
- [ ] 尺寸适配使用场景
- [ ] 颜色符合设计规范
- [ ] 添加适当的 alt 文本
- [ ] 响应式测试
- [ ] 动画性能检查
- [ ] 浏览器兼容性验证

---

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 📞 相关文档

- [图形使用指南](./GRAPHICS_GUIDE.md)
- [图标清单](../frontend/public/ICON_MANIFEST.md)
- [配色参考](../frontend/public/COLOR_PALETTE.md)
- [Tailwind 配置](../frontend/tailwind.config.ts)

---

**维护者**: CyberPress Design Team
**最后更新**: 2026-03-02
**下次审查**: 2026-04-02
