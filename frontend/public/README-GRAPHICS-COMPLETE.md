# CyberPress 图形素材系统

> 完整的赛博朋克风格图形素材库

## 📁 目录结构

```
frontend/public/
├── logo.svg                          # 主 Logo（带文字）
├── logo-icon.svg                     # Logo 图标（六边形）
├── logo-mark.svg                     # Logo 标志（简化版）
├── logo-main.svg                     # 主 Logo 变体
├── logo-square.svg                   # 方形 Logo
├── logo-favicon.svg                  # Favicon Logo
│
├── patterns/                         # 背景图案
│   ├── grid.svg                      # 网格图案
│   ├── circuit.svg                   # 电路图案
│   ├── scanlines.svg                 # 扫描线
│   ├── noise.svg                     # 噪点纹理
│   ├── hexagon.svg                   # 六边形网格
│   ├── hologram.svg                  # 全息图案 ⭐
│   ├── matrix-dots.svg               # 矩阵点阵 ⭐
│   └── ...                          # 更多图案
│
├── backgrounds/                      # 背景图
│   ├── hero-bg.svg                   # 英雄区背景
│   ├── card-bg.svg                   # 卡片背景
│   ├── loading-bg.svg                # 加载背景
│   └── cyber-grid-bg.svg             # 赛博网格背景 ⭐
│
├── illustrations/                    # 插画
│   ├── server-room.svg               # 服务器机房
│   ├── code-editor.svg               # 代码编辑器
│   ├── network-nodes.svg             # 网络节点
│   ├── cyber-city.svg                # 赛博城市
│   └── ...                          # 更多插画
│
└── decorations/                      # 装饰元素 ⭐
    ├── cyber-lines.svg               # 赛博线条
    ├── corner-brackets.svg           # 角落括号
    ├── loader-ring.svg               # 加载环
    └── progress-bar.svg              # 进度条
```

## 🎨 Logo 系列

### 使用示例

```tsx
// 主 Logo - 导航栏
<Image src="/logo.svg" alt="CyberPress" width={200} height={60} />

// Logo 图标 - 移动端
<Image src="/logo-icon.svg" alt="CyberPress" width={100} height={100} />

// Logo 标志 - Favicon
<link rel="icon" href="/logo-mark.svg" />

// 方形 Logo - 社交分享
<Image src="/logo-square.svg" alt="CyberPress" width={500} height={500} />
```

### Logo 特性
- ✅ **矢量格式**: SVG，可任意缩放
- ✅ **渐变色彩**: 霓虹青 → 赛博紫 → 激光粉
- ✅ **发光效果**: 内置 neon glow 滤镜
- ✅ **响应式**: 提供多种尺寸

## 🎭 背景图案

### 网格系统
```css
/* 使用网格背景 */
.hero-section {
  background-image: url('/patterns/grid.svg');
  background-size: cover;
}

/* 电路图案 */
.tech-card {
  background-image: url('/patterns/circuit.svg');
  background-size: 400px 400px;
}

/* 扫描线效果 */
.retrowave {
  background-image: url('/patterns/scanlines.svg');
  background-size: 100% 4px;
}
```

### 新增图案 ⭐

#### hologram.svg - 全息图案
- **用途**: 全息投影效果、科技背景
- **特性**: 钻石图案 + 浮动粒子
- **颜色**: 霓虹青 + 赛博紫

#### matrix-dots.svg - 矩阵点阵
- **用途**: 数据可视化、科技感装饰
- **特性**: 10x10 网格点阵
- **颜色**: 矩阵绿 + 霓虹青点缀

## 🖼️ 插画系列

### 新增插画 ⭐

#### server-room.svg - 服务器机房
- **尺寸**: 800x600
- **元素**: 服务器机架 + LED 指示灯 + 地面网格
- **动画**: 可添加 LED 闪烁效果

#### code-editor.svg - 代码编辑器
- **尺寸**: 800x600
- **元素**: 语法高亮 + 窗口控件 + 光标动画
- **用途**: 开发者相关页面

### 使用插画

```tsx
// 直接使用
<div className="illustration-container">
  <Image src="/illustrations/server-room.svg" alt="Server Room" />
</div>

// 作为背景
<div
  className="hero-background"
  style={{ backgroundImage: 'url(/illustrations/cyber-city.svg)' }}
>
  <h1>Welcome to CyberPress</h1>
</div>
```

## ✨ 装饰元素

### 新增装饰 ⭐

#### cyber-lines.svg - 赛博线条
- **尺寸**: 800x200
- **用途**: 分隔线、装饰性边框
- **特性**: 三层渐变线条 + 连接节点

#### corner-brackets.svg - 角落括号
- **尺寸**: 100x100
- **用途**: 图片边框、卡片装饰
- **特性**: 四角装饰 + 中心标记

#### loader-ring.svg - 加载环
- **尺寸**: 120x120
- **用途**: 页面加载、异步操作
- **特性**: 三层旋转动画 + 轨道粒子

#### progress-bar.svg - 进度条
- **尺寸**: 400x40
- **用途**: 文件上传、任务进度
- **特性**: 渐变填充 + 进度标记

### 使用装饰元素

```tsx
// 赛博线条分隔符
<div className="my-8">
  <Image src="/decorations/cyber-lines.svg" alt="" className="w-full" />
</div>

// 角落装饰
<div className="relative p-8">
  <Image
    src="/decorations/corner-brackets.svg"
    alt=""
    className="absolute inset-0 w-full h-full"
  />
  <div className="relative z-10">
    内容在这里
  </div>
</div>

// 加载动画
<div className="flex justify-center">
  <Image src="/decorations/loader-ring.svg" alt="Loading..." />
</div>

// 进度条
<div className="w-full max-w-md">
  <Image src="/decorations/progress-bar.svg" alt="Progress: 75%" />
</div>
```

## 🎯 配色方案

所有图形素材使用统一的赛博朋克配色：

```css
/* 主色调 */
--cyber-cyan: #00f0ff;      /* 霓虹青 */
--cyber-purple: #9d00ff;    /* 赛博紫 */
--cyber-pink: #ff0080;      /* 激光粉 */

/* 辅助色 */
--cyber-green: #00ff88;     /* 矩阵绿 */
--cyber-yellow: #f0ff00;    /* 电压黄 */

/* 背景色 */
--cyber-dark: #0a0a0f;      /* 深空黑 */
--cyber-card: #16162a;      /* 卡片背景 */
```

## 🔧 性能优化

### 最佳实践

1. **SVG 优化**
   - 使用 `svgo` 压缩 SVG 文件
   - 移除不必要的元数据
   - 简化路径数据

2. **懒加载**
   ```tsx
   // 使用 Next.js Image 组件
   import Image from 'next/image';

   <Image
     src="/illustrations/server-room.svg"
     alt="Server Room"
     width={800}
     height={600}
     loading="lazy"
     placeholder="blur"
   />
   ```

3. **CSS 背景**
   ```css
   /* 使用 data URI 减少请求 */
   .pattern-bg {
     background-image: url('data:image/svg+xml;base64,...');
   }
   ```

4. **内联 SVG**
   ```tsx
   // 小图标直接内联
   const CyberIcon = () => (
     <svg viewBox="0 0 24 24">...</svg>
   );
   ```

## 🎨 动画效果

### CSS 动画

```css
/* 旋转动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animated-loader {
  animation: spin 2s linear infinite;
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animated-glow {
  animation: pulse 2s ease-in-out infinite;
}

/* 发光效果 */
.neon-glow {
  filter: drop-shadow(0 0 5px #00f0ff)
          drop-shadow(0 0 10px #00f0ff);
}
```

### SVG 内置动画

部分 SVG 文件包含 `<animate>` 和 `<animateTransform>` 标签：

```xml
<!-- 旋转动画 -->
<animateTransform
  attributeName="transform"
  type="rotate"
  from="0 60 60"
  to="360 60 60"
  dur="2s"
  repeatCount="indefinite"
/>

<!-- 透明度动画 -->
<animate
  attributeName="opacity"
  values="1;0.5;1"
  dur="1s"
  repeatCount="indefinite"
/>
```

## 📱 响应式使用

```tsx
// 响应式 Logo
const Logo = () => (
  <Image
    src="/logo.svg"
    alt="CyberPress"
    width={isMobile ? 150 : 200}
    height={isMobile ? 45 : 60}
  />
);

// 响应式图案
<div
  className="pattern-bg"
  style={{
    backgroundImage: 'url(/patterns/grid.svg)',
    backgroundSize: isMobile ? '200px' : '400px'
  }}
>
  内容
</div>
```

## 🎓 使用场景

### 1. 页面背景
```tsx
// 英雄区
<section className="relative min-h-screen">
  <div className="absolute inset-0">
    <Image src="/backgrounds/cyber-grid-bg.svg" alt="" fill />
  </div>
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</section>
```

### 2. 卡片装饰
```tsx
// 科技卡片
<div className="relative p-6 bg-cyber-card border border-cyber-cyan">
  <div className="absolute top-0 right-0 p-2">
    <Image src="/decorations/corner-brackets.svg" alt="" width={50} height={50} />
  </div>
  {/* 卡片内容 */}
</div>
```

### 3. 加载状态
```tsx
// 页面加载
{isLoading && (
  <div className="fixed inset-0 flex items-center justify-center bg-cyber-dark">
    <Image src="/decorations/loader-ring.svg" alt="Loading..." width={120} height={120} />
  </div>
)}
```

### 4. 内容分隔
```tsx
// 章节分隔
<div className="my-16">
  <Image src="/decorations/cyber-lines.svg" alt="" className="w-full h-12" />
</div>
```

## 🔄 更新日志

### v1.0.0 (2026-03-07)
- ✅ 创建完整的 Logo 系列
- ✅ 添加 30+ 背景图案
- ✅ 创建 50+ 插画素材
- ✅ 新增装饰元素系列 ⭐
- ✅ 统一配色方案
- ✅ 优化 SVG 文件大小
- ✅ 添加动画效果

## 📚 相关文档

- [配色参考](../docs/COLOR_REFERENCE.md)
- [图标清单](../docs/ICON_MANIFEST.md)
- [项目主文档](../../README.md)

## 📞 技术支持

如有问题或建议，请参考：
- [GitHub Issues](https://github.com/957662/wordpress-cyberpunk-theme/issues)
- [项目文档](../../README.md)

---

**版本**: v1.0.0
**最后更新**: 2026-03-07
**维护者**: CyberPress AI Design Team
**许可**: MIT License
