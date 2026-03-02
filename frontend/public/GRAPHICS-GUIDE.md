# CyberPress Platform - 图形设计指南

## 🎨 设计系统

### 配色方案

#### 主色调
```
霓虹青 (Neon Cyan)    #00f0ff  ━━━━━━━━━━
赛博紫 (Cyber Purple)  #9d00ff  ━━━━━━━━━━
激光粉 (Laser Pink)    #ff0080  ━━━━━━━━━━
电压黄 (Voltage Yellow) #f0ff00  ━━━━━━━━━━
```

#### 辅助色
```
深空黑 (Deep Black)    #0a0a0f  ━━━━━━━━━━
赛博灰 (Cyber Gray)    #1a1a2e  ━━━━━━━━━━
霓虹蓝 (Neon Blue)     #0080ff  ━━━━━━━━━━
矩阵绿 (Matrix Green)  #00ff88  ━━━━━━━━━━
```

#### 渐变定义
```css
/* 主渐变 */
--cyber-gradient: linear-gradient(135deg, #00f0ff, #9d00ff, #ff0080);

/* 水平渐变 */
--cyber-gradient-h: linear-gradient(90deg, #00f0ff, #9d00ff);

/* 垂直渐变 */
--cyber-gradient-v: linear-gradient(180deg, #00f0ff, #9d00ff);
```

---

## 📐 设计规范

### 间距系统
```
2px   - 最小间距
4px   - 紧凑间距
8px   - 小间距
12px  - 中间距
16px  - 标准间距
24px  - 大间距
32px  - 超大间距
48px  - 特大间距
```

### 圆角系统
```
2px   - 小圆角（按钮、卡片）
4px   - 中圆角（输入框）
8px   - 大圆角（对话框）
12px  - 超大圆角（特殊元素）
16px  - 圆形（头像、徽章）
```

### 阴影系统
```css
/* 发光阴影 */
--glow-sm: 0 0 10px rgba(0, 240, 255, 0.3);
--glow-md: 0 0 20px rgba(0, 240, 255, 0.5);
--glow-lg: 0 0 30px rgba(0, 240, 255, 0.7);

/* 卡片阴影 */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
```

---

## 🎯 组件样式

### 按钮
```css
.cyber-button {
  background: linear-gradient(135deg, #00f0ff, #9d00ff);
  border: 2px solid #00f0ff;
  border-radius: 4px;
  padding: 12px 24px;
  color: #0a0a0f;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
  transition: all 0.3s ease;
}

.cyber-button:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.8);
  transform: translateY(-2px);
}
```

### 卡片
```css
.cyber-card {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 8px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.cyber-card:hover {
  border-color: rgba(0, 240, 255, 0.6);
  box-shadow: 0 8px 16px rgba(0, 240, 255, 0.2);
}
```

### 输入框
```css
.cyber-input {
  background: rgba(10, 10, 15, 0.8);
  border: 2px solid #9d00ff;
  border-radius: 4px;
  padding: 12px 16px;
  color: #00f0ff;
  transition: all 0.3s ease;
}

.cyber-input:focus {
  border-color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  outline: none;
}
```

---

## ✨ 特效效果

### 霓虹发光
```css
.neon-glow {
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 40px #00f0ff;
}
```

### 扫描线
```css
.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}
```

### 故障效果
```css
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.glitch {
  animation: glitch 0.3s infinite;
}
```

### 全息效果
```css
.hologram {
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.1) 0%,
    rgba(157, 0, 255, 0.1) 50%,
    rgba(255, 0, 128, 0.1) 100%
  );
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow:
    0 0 20px rgba(0, 240, 255, 0.2),
    inset 0 0 20px rgba(0, 240, 255, 0.1);
}
```

---

## 🎬 动画库

### 关键帧动画
```css
/* 脉冲 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 弹跳 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 闪烁 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 扫描 */
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

/* 数据流动 */
@keyframes data-flow {
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
}
```

---

## 📱 响应式断点

```css
/* 移动设备 */
@media (max-width: 640px) {
  /* 小屏幕样式 */
}

/* 平板设备 */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 中等屏幕样式 */
}

/* 桌面设备 */
@media (min-width: 1025px) {
  /* 大屏幕样式 */
}
```

---

## 🎨 图形文件结构

```
frontend/public/
├── assets/
│   ├── logo/              # Logo 文件
│   ├── icons/             # 图标文件
│   ├── patterns/          # 背景图案
│   └── illustrations/     # 插画文件
├── decorations/           # 装饰元素
├── backgrounds/           # 背景图像
└── icons/                 # 独立图标
```

---

## 🔧 SVG 优化建议

1. **简化路径**: 使用最少量的节点
2. **使用 defs**: 复用渐变和滤镜
3. **压缩代码**: 移除不必要的空格和注释
4. **添加 viewBox**: 确保响应式缩放
5. **使用 semantic**: 添加 title 和 desc 标签

---

## 📊 性能指标

- **图标大小**: < 2KB (优化后)
- **加载时间**: < 100ms
- **动画帧率**: 60 FPS
- **颜色深度**: RGBA / 8位通道

---

## 🚀 最佳实践

1. **使用 SVG**: 矢量图形，无限缩放
2. **懒加载**: 图标按需加载
3. **CSS 动画**: 优先使用 CSS 动画
4. **减少重绘**: 使用 transform 和 opacity
5. **压缩文件**: 使用 SVGO 优化 SVG

---

## 📝 更新日志

### 2026-03-03
- 创建设计系统文档
- 定义配色方案
- 添加组件样式规范
- 完善动画库

---

**版本**: 1.0.0
**最后更新**: 2026-03-03
**维护者**: CyberPress Design Team
