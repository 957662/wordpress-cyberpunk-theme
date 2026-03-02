# CyberPress - Decorations (装饰元素)

## 📁 装饰元素文件清单

```
frontend/public/decorations/
├── corner-accent.svg      # 角标装饰
├── divider-cyber.svg      # 赛博风格分隔线
├── badge-tech.svg         # 技术标签徽章
├── progress-bar.svg       # 进度条
└── hologram-effect.svg    # 全息效果背景
```

---

## 🎨 装饰元素说明

### 1. corner-accent.svg
**用途**: 卡片/容器角标装饰
**尺寸**: 100x100
**风格**: 霓虹发光角标
**特点**:
- 左上角：霓虹青色
- 右下角：赛博紫色
- 双层线条设计
- 发光节点装饰

**使用方式**:
```tsx
<div className="relative p-6 cyber-card">
  <Image
    src="/decorations/corner-accent.svg"
    alt=""
    className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
  />
  <h3>Card Title</h3>
  <p>Card content with cyber corner decoration</p>
</div>
```

**CSS 方式**:
```css
.cyber-corner {
  position: relative;
}

.cyber-corner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background: url('/decorations/corner-accent.svg') no-repeat;
  pointer-events: none;
}
```

---

### 2. divider-cyber.svg
**用途**: 内容分隔线
**尺寸**: 400x20
**风格**: 赛博科技风格
**特点**:
- 中心菱形节点
- 渐变延伸线
- 装饰性节点
- 可缩放设计

**使用方式**:
```tsx
<div className="my-8">
  <Image
    src="/decorations/divider-cyber.svg"
    alt=""
    className="w-full h-5"
  />
</div>
```

**或使用 CSS**:
```css
.cyber-divider {
  width: 100%;
  height: 20px;
  background-image: url('/decorations/divider-cyber.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
```

---

### 3. badge-tech.svg
**用途**: 技术标签/徽章
**尺寸**: 120x40
**风格**: 霓虹标签
**特点**:
- 霓虹青色边框
- 半透明填充
- 图标 + 文字
- 发光效果

**使用方式**:
```tsx
<div className="flex gap-2">
  <Image
    src="/decorations/badge-tech.svg"
    alt="Tech Badge"
    className="h-10"
  />
</div>
```

**自定义徽章组件**:
```tsx
export function TechBadge({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyber-cyan bg-cyber-cyan/20">
      <span className="text-cyber-cyan">{icon}</span>
      <span className="text-xs font-bold text-cyber-cyan">{label}</span>
    </div>
  );
}

// 使用
<TechBadge label="React" icon={<Atom size={14} />} />
<TechBadge label="TypeScript" icon={<Code2 size={14} />} />
```

---

### 4. progress-bar.svg
**用途**: 加载/进度指示器
**尺寸**: 300x12
**风格**: 赛博风格进度条
**特点**:
- 霓虹青到紫渐变
- 发光填充效果
- 指示器节点
- 深色轨道

**使用方式**:
```tsx
{/* 静态进度条 (75%) */}
<Image
  src="/decorations/progress-bar.svg"
  alt="Loading: 75%"
  width={300}
  height={12}
/>

{/* 或使用 CSS 动态进度条 */}
<div className="w-full h-3 bg-cyber-dark rounded-full overflow-hidden border border-cyber-border">
  <div
    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-500"
    style={{ width: '75%' }}
  />
</div>
```

---

### 5. hologram-effect.svg
**用途**: 全息投影效果背景
**尺寸**: 200x200
**风格**: 全息科技风格
**特点**:
- 扫描线效果
- 角标装饰
- 数据节点
- 半透明叠加

**使用方式**:
```tsx
<div className="relative group">
  <Image
    src="/decorations/hologram-effect.svg"
    alt="Hologram effect"
    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
  />
  <div className="relative z-10">
    <h3>Hover for hologram effect</h3>
  </div>
</div>
```

**CSS 叠加**:
```css
.hologram-card {
  position: relative;
  overflow: hidden;
}

.hologram-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/decorations/hologram-effect.svg');
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.hologram-card:hover::before {
  opacity: 1;
}
```

---

## 🎯 使用场景

### 卡片装饰
```tsx
<Card className="relative overflow-hidden">
  {/* Corner accent */}
  <Image
    src="/decorations/corner-accent.svg"
    alt=""
    className="absolute top-0 right-0 w-12 h-12 opacity-50"
  />
  <CardHeader>
    <CardTitle>Featured Post</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content with cyber decoration</p>
  </CardContent>
</Card>
```

### 分隔内容
```tsx
<section>
  <h2>Section Title</h2>
  <p>Section content...</p>
</section>

<Image src="/decorations/divider-cyber.svg" alt="" className="w-full h-5 my-8" />

<section>
  <h2>Next Section</h2>
  <p>More content...</p>
</section>
```

### 技术标签组
```tsx
<div className="flex flex-wrap gap-2 mt-4">
  {technologies.map(tech => (
    <Image
      key={tech}
      src="/decorations/badge-tech.svg"
      alt={tech}
      className="h-8"
    />
  ))}
</div>
```

---

## 🎨 配色方案

装饰元素使用标准赛博朋克配色：

| 颜色 | 用途 | HEX |
|------|------|-----|
| 霓虹青 | 主要装饰 | `#00f0ff` |
| 赛博紫 | 次要装饰 | `#9d00ff` |
| 深色背景 | 轨道/底色 | `#16162a` |
| 边框色 | 轮廓线 | `#2a2a4a` |

---

## ⚡ 自定义建议

### 修改颜色
可以通过 CSS `filter` 修改颜色：
```css
/* 改为粉色调 */
.corner-accent-pink {
  filter: hue-rotate(180deg);
}

/* 改为黄色调 */
.corner-accent-yellow {
  filter: hue-rotate(90deg);
}
```

### 调整透明度
```css
.corner-accent-fade {
  opacity: 0.3;
}

.corner-accent-bright {
  opacity: 0.8;
}
```

### 组合使用
```tsx
<div className="relative p-8 border border-cyber-cyan/30 rounded-lg">
  {/* 四个角标 */}
  <Image src="/decorations/corner-accent.svg" alt="" className="absolute top-0 left-0 w-16 h-16" />
  <Image src="/decorations/corner-accent.svg" alt="" className="absolute top-0 right-0 w-16 h-16 scale-x-[-1]" />
  <Image src="/decorations/corner-accent.svg" alt="" className="absolute bottom-0 left-0 w-16 h-16 scale-y-[-1]" />
  <Image src="/decorations/corner-accent.svg" alt="" className="absolute bottom-0 right-0 w-16 h-16 scale-[-1]" />

  <div className="relative z-10">
    <h3>Fully Decorated Card</h3>
  </div>
</div>
```

---

## 📱 响应式使用

```tsx
{/* 移动端: 缩小尺寸 */}
<Image
  src="/decorations/corner-accent.svg"
  alt=""
  className="w-12 h-12 sm:w-16 sm:h-16"
/>

{/* 平板/桌面: 正常尺寸 */}
<Image
  src="/decorations/divider-cyber.svg"
  alt=""
  className="w-full h-4 sm:h-5"
/>
```

---

**创建时间**: 2026-03-03
**版本**: v1.0
**设计风格**: Cyberpunk Decorations
