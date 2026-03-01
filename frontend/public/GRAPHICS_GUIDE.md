# CyberPress Platform - 图形设计规范

## 🎨 设计系统概述

CyberPress 采用赛博朋克美学风格，融合未来科技感与极致用户体验。本规范确保所有视觉元素保持一致性。

---

## 📐 设计原则

### 1. 核心理念
- **未来感**: 科技线条、霓虹发光、电路元素
- **一致性**: 统一的设计语言和视觉风格
- **功能性**: 美观与实用并重
- **可访问性**: 清晰的对比度和可读性

### 2. 视觉特征
```
✅ 霓虹发光效果 (Neon Glow)
✅ 渐变色彩 (Gradient Colors)
✅ 电路纹理 (Circuit Patterns)
✅ 扫描线效果 (Scanlines)
✅ 故障艺术 (Glitch Effects)
✅ 六边形几何 (Hexagon Geometry)
```

---

## 🎨 Logo 系统

### 主 Logo (Main Logo)
```
文件: /public/logo-main.svg
尺寸: 400x120px
格式: SVG
用途: 页面头部、品牌展示
```

**使用规范**:
- 最小使用尺寸: 150px 宽度
- 保持安全边距: logo 高度的 50%
- 背景: 深色或浅色背景均可使用

### 图标版 Logo (Icon)
```
文件: /public/logo-favicon.svg
尺寸: 64x64px
格式: SVG
用途: Favicon、应用图标、小尺寸展示
```

**使用规范**:
- 最小使用尺寸: 32x32px
- 可单独使用，不配文字
- 适合作为头像或应用图标

### 方形 Logo (Square)
```
文件: /public/logo-square.svg
尺寸: 512x512px
格式: SVG
用途: 社交媒体、营销物料、大型展示
```

### Logo 变体
```
┌─────────────────────────────────────────────────────┐
│  深色背景模式                                         │
│  Logo: 白色 + 霓虹青/紫渐变                          │
│  发光: 强烈发光效果                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  浅色背景模式                                         │
│  Logo: 深色 + 霓虹青/紫渐变                          │
│  发光: 减弱发光效果                                   │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 图标系统

### 图标设计规范

#### 尺寸标准
```
├─ xs: 16px   (极小，用于密集信息)
├─ sm: 20px   (小，用于列表项)
├─ md: 24px   (标准，默认尺寸)
├─ lg: 32px   (大，用于强调)
└─ xl: 48px   (特大，用于展示)
```

#### 描边规范
```
标准描边: 2px (24px 图标)
细描边:   1.5px (小尺寸)
粗描边:   2.5px (大尺寸)
端点样式: round
连接样式: round
```

#### 颜色应用
```css
/* 主要操作 */
.icon-primary {
  color: #00f0ff;
  filter: drop-shadow(0 0 3px rgba(0, 240, 255, 0.5));
}

/* 次要操作 */
.icon-secondary {
  color: #9d00ff;
  filter: drop-shadow(0 0 3px rgba(157, 0, 255, 0.5));
}

/* 警告/重要 */
.icon-accent {
  color: #ff0080;
  filter: drop-shadow(0 0 3px rgba(255, 0, 128, 0.5));
}

/* 中性/禁用 */
.icon-muted {
  color: #606070;
}
```

---

## 🖼️ 插画系统

### 插画类型

#### 1. 场景插画 (Scene Illustrations)
```
文件路径: /public/illustrations/

├─ cyber-city.svg           # 赛博城市
│   尺寸: 1200x600px
│   用途: 首页背景、404页面
│   元素: 霓虹建筑、飞行车辆、全息广告
│
├─ developer-workspace.svg  # 开发工作区
│   尺寸: 800x600px
│   用途: 关于页面、博客头部
│   元素: 多屏显示器、代码、咖啡、机械键盘
│
├─ network-nodes.svg        # 网络节点
│   尺寸: 800x400px
│   用途: 技术文章、API文档
│   元素: 连接点、数据流、服务器
│
└─ server-rack.svg          # 服务器机架
    尺寸: 600x400px
    用途: 后端相关内容
    元素: 机架、指示灯、线缆
```

#### 2. 装饰插画 (Decorative Illustrations)
```
├─ circuit-board.svg        # 电路板图案
├─ code-screen.svg          # 代码屏幕
└─ network-globe.svg        # 网络地球
```

### 插画使用规范
```
1. 保持足够的留白空间
2. 插画与文字的比例建议 1:3
3. 使用渐变色彩增强层次感
4. 添加微妙的动画效果
5. 确保在不同尺寸下清晰可辨
```

---

## 🎨 配色系统

### 主色调 (Primary Colors)
```
┌────────────────────────────────────────────────────┐
│  深空黑 (Deep Space Black)                          │
│  HEX: #0a0a0f                                      │
│  RGB: rgb(10, 10, 15)                              │
│  用途: 主背景                                       │
├────────────────────────────────────────────────────┤
│  霓虹青 (Neon Cyan)                                 │
│  HEX: #00f0ff                                      │
│  RGB: rgb(0, 240, 255)                             │
│  用途: 主要操作、链接、按钮                          │
├────────────────────────────────────────────────────┤
│  赛博紫 (Cyber Purple)                              │
│  HEX: #9d00ff                                      │
│  RGB: rgb(157, 0, 255)                             │
│  用途: 次要操作、渐变、装饰                          │
├────────────────────────────────────────────────────┤
│  激光粉 (Laser Pink)                                │
│  HEX: #ff0080                                      │
│  RGB: rgb(255, 0, 128)                             │
│  用途: 强调、警告、特殊标记                          │
├────────────────────────────────────────────────────┤
│  电压黄 (Voltage Yellow)                            │
│  HEX: #f0ff00                                      │
│  RGB: rgb(240, 255, 0)                             │
│  用途: 高亮、评分、成功状态                          │
└────────────────────────────────────────────────────┘
```

### 辅助色 (Secondary Colors)
```
┌────────────────────────────────────────────────────┐
│  赛博绿 (Cyber Green)                               │
│  HEX: #00ff88                                      │
│  用途: 成功、完成、安全                              │
├────────────────────────────────────────────────────┤
│  赛博橙 (Cyber Orange)                              │
│  HEX: #ff6600                                      │
│  用途: 警告、注意                                   │
├────────────────────────────────────────────────────┤
│  深紫蓝 (Deep Purple)                               │
│  HEX: #1a1a2e                                      │
│  用途: 卡片背景、次要背景                           │
└────────────────────────────────────────────────────┘
```

### 渐变系统
```
/* 霓虹渐变 (Neon Gradient) */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 热力渐变 (Heat Gradient) */
background: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);

/* 赛博渐变 (Cyber Gradient) */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);

/* 深空渐变 (Deep Gradient) */
background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%);
```

---

## ✨ 特效系统

### 1. 发光效果 (Glow Effects)
```css
/* 霓虹发光 - 青 */
.neon-glow-cyan {
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff;
  box-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff;
}

/* 霓虹发光 - 紫 */
.neon-glow-purple {
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
  box-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
}

/* 边框发光 */
.border-glow {
  border: 1px solid #00f0ff;
  box-shadow:
    0 0 5px #00f0ff,
    inset 0 0 5px rgba(0, 240, 255, 0.1);
}
```

### 2. 扫描线效果 (Scanlines)
```css
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
  pointer-events: none;
}
```

### 3. 故障效果 (Glitch Effect)
```css
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #00f0ff;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #ff0080;
  animation: glitch-anim 2.5s infinite linear alternate-reverse;
}
```

### 4. 全息效果 (Holographic Effect)
```css
.holographic {
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.1) 0%,
    rgba(157, 0, 255, 0.1) 50%,
    rgba(255, 0, 128, 0.1) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 240, 255, 0.3);
}
```

---

## 📐 布局系统

### 间距标准 (Spacing)
```css
/* 基础间距单位: 8px */

space-1: 8px    /* 极小间距 */
space-2: 16px   /* 小间距 */
space-3: 24px   /* 标准间距 */
space-4: 32px   /* 中等间距 */
space-5: 40px   /* 大间距 */
space-6: 48px   /* 超大间距 */
space-8: 64px   /* 特大间距 */
```

### 卡片规范
```css
/* 标准卡片 */
.cyber-card {
  background: rgba(22, 22, 42, 0.8);
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.cyber-card:hover {
  border-color: #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
  transform: translateY(-5px);
}
```

### 按钮规范
```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  color: #0a0a0f;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
  transform: translateY(-2px);
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  color: #00f0ff;
  padding: 12px 24px;
  border: 2px solid #00f0ff;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}
```

---

## 🎬 动画系统

### 常用动画
```css
/* 脉冲发光 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 5px #00f0ff);
  }
  50% {
    opacity: 0.8;
    filter: drop-shadow(0 0 10px #00f0ff);
  }
}

/* 浮动效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 扫描效果 */
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* 故障动画 */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
```

### 动画使用建议
```
1. 持续时间: 200-500ms (微交互), 1-3s (循环动画)
2. 缓动函数: ease-out (进入), ease-in (离开)
3. 避免同时触发多个动画
4. 提供禁用动画的选项 (prefers-reduced-motion)
```

---

## 📱 响应式设计

### 断点系统
```css
/* 移动设备 */
@media (max-width: 640px) {
  /* 调整字体、间距、布局 */
}

/* 平板设备 */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 中等尺寸优化 */
}

/* 桌面设备 */
@media (min-width: 1025px) {
  /* 大尺寸展示 */
}
```

### 图标响应式
```css
/* 移动端 */
.icon-mobile {
  width: 20px;
  height: 20px;
}

/* 桌面端 */
.icon-desktop {
  width: 24px;
  height: 24px;
}
```

---

## ✅ 质量检查清单

### Logo 使用
- [ ] 使用正确的文件格式
- [ ] 保持适当的安全边距
- [ ] 确保足够的对比度
- [ ] 测试深色/浅色背景
- [ ] 验证最小尺寸要求

### 图标使用
- [ ] 使用一致的尺寸
- [ ] 应用正确的颜色
- [ ] 添加适当的间距
- [ ] 考虑可访问性
- [ ] 测试响应式布局

### 配色使用
- [ ] 遵循色彩层级
- [ ] 保持足够的对比度
- [ ] 合理使用发光效果
- [ ] 考虑色盲友好
- [ ] 测试深色/浅色模式

---

## 🔧 工具和资源

### 设计工具
- Figma (界面设计)
- Adobe Illustrator (矢量图形)
- Sketch (原型设计)
- Inkscape (开源矢量编辑)

### 在线工具
- Coolors (配色方案)
- Gradient Hunt (渐变灵感)
- Remove.bg (背景移除)
- TinyPNG (图片压缩)

### 图标库
- Lucide Icons (已集成)
- Heroicons
- Feather Icons
- Tabler Icons

---

## 📞 更新日志

### v1.0.0 (2026-03-02)
- ✅ 初始设计规范
- ✅ Logo 系统定义
- ✅ 配色系统建立
- ✅ 特效系统文档

---

**维护者**: CyberPress AI Design Team
**最后更新**: 2026-03-02
**版本**: v1.0.0
