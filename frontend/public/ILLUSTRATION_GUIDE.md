# CyberPress Platform - 插画素材指南

## 🎨 插画系统概述

CyberPress 的插画采用赛博朋克风格，融合科技元素与未来感，为网站提供独特的视觉体验。

---

## 📁 插画文件结构

```
frontend/public/illustrations/
├── scenes/              # 场景插画
│   ├── cyber-city.svg
│   ├── developer-workspace.svg
│   └── network-nodes.svg
├── elements/            # 元素插画
│   ├── circuit-board.svg
│   ├── code-screen.svg
│   └── server-rack.svg
├── abstracts/           # 抽象插画
│   ├── holographic.svg
│   ├── matrix-rain.svg
│   └── neural-network.svg
└── backgrounds/         # 背景插画
    ├── hero-bg.svg
    ├── 404-bg.svg
    └── loading-bg.svg
```

---

## 🖼️ 场景插画 (Scene Illustrations)

### 1. 赛博城市 (Cyber City)
```
文件: /illustrations/scenes/cyber-city.svg
尺寸: 1200x600px
格式: SVG
主题: 未来都市景观
```

**视觉元素**:
- 霓虹灯装饰的高楼大厦
- 飞行的悬浮车辆
- 全息广告牌
- 电路纹理的地面
- 渐变色天空（深紫到青）

**使用场景**:
- 首页 Hero 区域
- 404 错误页面
- 营销落地页

**色彩方案**:
```css
--building-primary: #0a0a0f;
--building-accent: #00f0ff;
--neon-pink: #ff0080;
--neon-purple: #9d00ff;
--sky-top: #050510;
--sky-bottom: #1a1a3f;
```

---

### 2. 开发工作区 (Developer Workspace)
```
文件: /illustrations/scenes/developer-workspace.svg
尺寸: 800x600px
格式: SVG
主题: 程序员工作环境
```

**视觉元素**:
- 多显示器设置（3个屏幕）
- 机械键盘（霓虹背光）
- 代码编辑器界面
- 咖啡杯
- 植物装饰
- 赛博朋克风格的桌面装饰

**使用场景**:
- 关于页面
- 博客文章头部
- 开发者文档

**色彩方案**:
```css
--desk: #1a1a2e;
--monitor-frame: #0a0a0f;
--screen-glow: #00f0ff;
--code-text: #e0e0e0;
--keyboard-accent: #9d00ff;
```

---

### 3. 网络节点 (Network Nodes)
```
文件: /illustrations/scenes/network-nodes.svg
尺寸: 800x400px
格式: SVG
主题: 网络连接可视化
```

**视觉元素**:
- 互连的网络节点
- 数据流动画效果
- 发光的连接线
- 六边形节点设计
- 粒子效果

**使用场景**:
- API 文档
- 技术架构说明
- 网络相关文章

**色彩方案**:
```css
--node: #0a0a0f;
--node-border: #00f0ff;
--connection: #9d00ff;
--data-flow: #ff0080;
--background: #050508;
```

---

## 🔧 元素插画 (Element Illustrations)

### 1. 电路板 (Circuit Board)
```
文件: /illustrations/elements/circuit-board.svg
尺寸: 600x400px
格式: SVG
主题: 电路板纹理
```

**视觉元素**:
- PCB 走线
- 电子元件
- 焊盘点
- 电路纹理

**使用场景**:
- 卡片背景装饰
- 技术类文章配图
- 页脚装饰

---

### 2. 代码屏幕 (Code Screen)
```
文件: /illustrations/elements/code-screen.svg
尺寸: 600x400px
格式: SVG
主题: 代码编辑器界面
```

**视觉元素**:
- 深色主题编辑器
- 语法高亮代码
- 行号
- 光标闪烁效果

**使用场景**:
- 技术教程
- 代码示例装饰
- 开发工具介绍

---

### 3. 服务器机架 (Server Rack)
```
文件: /illustrations/elements/server-rack.svg
尺寸: 600x400px
格式: SVG
主题: 数据中心设备
```

**视觉元素**:
- 服务器机架
- LED 指示灯
- 线缆连接
- 散热风扇

**使用场景**:
- 后端相关内容
- 基础设施介绍
- DevOps 文章

---

## 🌈 抽象插画 (Abstract Illustrations)

### 1. 全息投影 (Holographic)
```
文件: /illustrations/abstracts/holographic.svg
尺寸: 800x600px
格式: SVG
主题: 全息效果
```

**视觉元素**:
- 扫描线效果
- 色彩偏移
- 透明度渐变
- 故障效果

**使用场景**:
- 加载动画
- 数据可视化
- 装饰性背景

---

### 2. 矩阵雨 (Matrix Rain)
```
文件: /illustrations/abstracts/matrix-rain.svg
尺寸: 800x600px
格式: SVG
主题: 黑客帝国风格
```

**视觉元素**:
- 下落的代码字符
- 绿色渐变
- 尾迹效果
- 网格背景

**使用场景**:
- 技术文章装饰
- 黑客风格页面
- 编程相关内容

---

### 3. 神经网络 (Neural Network)
```
文件: /illustrations/abstracts/neural-network.svg
尺寸: 800x600px
格式: SVG
主题: AI 神经网络
```

**视觉元素**:
- 神经元节点
- 连接权重
- 激活动画
- 层次结构

**使用场景**:
- AI 相关文章
- 机器学习教程
- 技术深度内容

---

## 🎭 背景插画 (Background Illustrations)

### 1. Hero 背景 (Hero Background)
```
文件: /illustrations/backgrounds/hero-bg.svg
尺寸: 1920x1080px
格式: SVG
主题: 首页主背景
```

**视觉元素**:
- 渐变天空
- 网格地面
- 远景城市轮廓
- 粒子效果
- 雾气效果

**使用场景**:
- 首页 Hero 区域
- 营销页面顶部

---

### 2. 404 背景 (404 Background)
```
文件: /illustrations/backgrounds/404-bg.svg
尺寸: 1920x1080px
格式: SVG
主题: 错误页面背景
```

**视觉元素**:
- 故障效果
- 破碎的代码
- 丢失的数据包
- 警告元素

**使用场景**:
- 404 错误页面
- 500 服务器错误
- 维护页面

---

### 3. 加载背景 (Loading Background)
```
文件: /illustrations/backgrounds/loading-bg.svg
尺寸: 1920x1080px
格式: SVG
主题: 加载动画背景
```

**视觉元素**:
- 旋转的圆环
- 进度条
- 数据流动
- 脉冲效果

**使用场景**:
- 页面加载
- 内容加载
- 异步操作

---

## 🎨 插画设计规范

### 尺寸标准
```
小型: 400x300px   (侧边栏、小卡片)
中型: 800x600px   (内容区域、文章头部)
大型: 1200x600px  (Hero 区域、全屏)
超大: 1920x1080px (背景)
```

### 色彩使用
```css
/* 主色调 */
--primary: #00f0ff;
--secondary: #9d00ff;
--accent: #ff0080;

/* 背景色 */
--bg-dark: #0a0a0f;
--bg-card: #16162a;
--bg-muted: #1a1a2e;

/* 发光效果 */
--glow-cyan: drop-shadow(0 0 10px rgba(0, 240, 255, 0.5));
--glow-purple: drop-shadow(0 0 10px rgba(157, 0, 255, 0.5));
--glow-pink: drop-shadow(0 0 10px rgba(255, 0, 128, 0.5));
```

### 线条规范
```
主要线条: 2px
次要线条: 1.5px
装饰线条: 1px
轮廓线条: 3px
```

### 动画原则
```
持续时间: 2-4s (循环动画)
缓动函数: ease-in-out
动画类型:
  - 脉冲发光
  - 数据流动
  - 粒子漂浮
  - 扫描效果
```

---

## 🔧 插画使用示例

### React 组件中使用
```tsx
import Image from 'next/image';

function HeroSection() {
  return (
    <section className="relative h-screen">
      <Image
        src="/illustrations/scenes/cyber-city.svg"
        alt="Cyber City"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-glow-cyan">Welcome to CyberPress</h1>
      </div>
    </section>
  );
}
```

### 作为背景图案
```tsx
function CyberCard() {
  return (
    <div className="relative p-6 rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/illustrations/elements/circuit-board.svg"
          alt="Circuit Board"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-cyber-cyan">Card Title</h3>
        <p className="text-gray-300">Card content goes here...</p>
      </div>
    </div>
  );
}
```

### 带动画的插画
```tsx
function AnimatedIllustration() {
  return (
    <div className="relative w-full h-96">
      <Image
        src="/illustrations/abstracts/matrix-rain.svg"
        alt="Matrix Rain"
        fill
        className="object-cover animate-pulse"
      />
    </div>
  );
}
```

---

## 📋 插画创建检查清单

在创建新插画前，请确认：

- [ ] 符合赛博朋克设计风格
- [ ] 使用项目标准配色
- [ ] SVG 代码已优化
- [ ] 支持响应式缩放
- [ ] 添加了适当的 alt 文本
- [ ] 考虑了深色/浅色模式
- [ ] 测试了不同尺寸下的显示效果
- [ ] 更新了插画清单文档

---

## 🎯 插画性能优化

### SVG 优化
```bash
# 使用 SVGO 优化 SVG
npm install -g svgo
svgo input.svg -o output.svg
```

### 懒加载
```tsx
// 使用 Next.js 动态导入
const HeavyIllustration = dynamic(() =>
  import('./HeavyIllustration').then(mod => mod.HeavyIllustration),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);
```

### 格式选择
```
简单图形: SVG（推荐）
复杂场景: SVG（代码优化）
照片级: WebP（备用）
```

---

## 🌐 在线资源

### 免费插画资源
- **unDraw**: https://undraw.co/
- **Storyset**: https://storyset.com/
- **Illustrations**: https://illlustrations.co/

### 赛博朋克灵感
- **Cyberpunk Aesthetics**: Pinterest 搜索
- **Neon Design**: Dribbble 搜索
- **Tech Illustrations**: Behance 搜索

### 设计工具
- **Figma**: 界面设计
- **Illustrator**: 矢量插画
- **Inkscape**: 开源矢量编辑
- **Affinity Designer**: 专业矢量工具

---

## 📝 插画需求模板

当需要新插画时，请提供以下信息：

```markdown
## 插画需求

### 基本信息
- 名称: [插画名称]
- 尺寸: [宽x高]
- 格式: SVG

### 主题描述
- 主题: [插画主题]
- 风格: [赛博朋克/科技/抽象]

### 视觉元素
- 主要元素: [列出主要视觉元素]
- 配色方案: [指定颜色或使用标准配色]
- 背景: [背景描述]

### 使用场景
- 位置: [在网站的哪个位置使用]
- 交互: [是否需要动画或交互]

### 参考
- 参考图: [提供参考图片链接]
- 类似作品: [网站上的类似插画]
```

---

**维护者**: CyberPress AI Design Team
**最后更新**: 2026-03-02
**版本**: v1.0.0
