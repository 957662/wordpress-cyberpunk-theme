# CyberPress 图形素材清单

> 版本: 2.0.0
> 更新日期: 2026-03-03
> 设计风格: 赛博朋克

---

## 📁 文件结构

```
frontend/public/
├── logos/                              # Logo 文件
│   ├── cyberpress-logo.svg            # 主 Logo (200x200)
│   ├── cyberpress-logo-icon.svg       # 图标版 Logo (64x64)
│   └── cyberpress-logo-square.svg     # 方形 Logo (512x512)
│
├── icons/                              # SVG 图标（待添加）
│   ├── navigation/                     # 导航图标
│   ├── social/                         # 社交图标
│   └── ui/                            # UI 图标
│
├── patterns/                           # 背景图案
│   └── (待创建)
│
└── illustrations/                      # 插画（待创建）

frontend/components/icons/
├── Logo.tsx                           # Logo React 组件
├── CyberGlitchIcon.tsx               # 故障图标
├── CyberMatrixIcon.tsx               # 矩阵图标
├── CyberHoloIcon.tsx                 # 全息图标
├── CyberNodeIcon.tsx                 # 节点图标
├── CyberShieldIcon.tsx               # 安全图标
├── CyberDataIcon.tsx                 # 数据图标
└── cyber-icons.tsx                   # 图标导出
```

---

## 🎨 Logo 资源

### 主 Logo - `cyberpress-logo.svg`
- **尺寸**: 200x200
- **格式**: SVG
- **用途**: 网站页眉、品牌展示
- **颜色**: 霓虹青 (#00f0ff) + 霓虹紫 (#9d00ff)
- **特性**:
  - 六边形核心设计
  - CPU 芯片纹路
  - 发光滤镜效果
  - 角落装饰元素

### 图标版 - `cyberpress-logo-icon.svg`
- **尺寸**: 64x64
- **格式**: SVG
- **用途**: Favicon、小图标、标签页
- **颜色**: 霓虹青渐变
- **特性**:
  - 简化设计
  - 高识别度
  - 小尺寸清晰

### 方形版 - `cyberpress-logo-square.svg`
- **尺寸**: 512x512
- **格式**: SVG
- **用途**: 社交媒体、应用图标
- **颜色**: 全部赛博朋克配色
- **特性**:
  - 深色背景
  - 扫描线效果
  - 完整品牌展示

---

## 🔷 自定义赛博图标

### 1. CyberGlitchIcon
**用途**: 错误、警告、装饰

```tsx
<CyberGlitchIcon size={24} color="#00f0ff" className="" />
```

**Props**:
- `size`: 数字 (默认: 24)
- `className`: 字符串
- `color`: 颜色 (默认: #00f0ff)

---

### 2. CyberMatrixIcon
**用途**: 数据流、代码、技术

```tsx
<CyberMatrixIcon size={24} color="#00f0ff" animated={false} />
```

**Props**:
- `size`: 数字 (默认: 24)
- `className`: 字符串
- `color`: 颜色 (默认: #00f0ff)
- `animated`: 布尔值 (默认: false)

---

### 3. CyberHoloIcon
**用途**: 全息投影、VR、未来科技

```tsx
<CyberHoloIcon size={24} color="#00f0ff" className="" />
```

**Props**:
- `size`: 数字 (默认: 24)
- `className`: 字符串
- `color`: 颜色 (默认: #00f0ff)

---

### 4. CyberNodeIcon
**用途**: 网络、区块链、分布式

```tsx
<CyberNodeIcon size={24} color="#00f0ff" connected={true} />
```

**Props**:
- `size`: 数字 (默认: 24)
- `className`: 字符串
- `color`: 颜色 (默认: #00f0ff)
- `connected`: 布尔值 (默认: true)

---

### 5. CyberShieldIcon
**用途**: 安全、加密、认证

```tsx
<CyberShieldIcon size={24} color="#00f0ff" secure={true} />
```

**Props**:
- `size`: 数字 (默认: 24)
- `className`: 字符串
- `color`: 颜色 (默认: #00f0ff)
- `secure`: 布尔值 (默认: true)

---

### 6. CyberDataIcon
**用途**: 数据库、存储、处理

```tsx
<CyberDataIcon size={24} color="#00f0ff" loading={false} />
```

**Props**:
- `size`: 数字 (默认: 24)
- `className`: 字符串
- `color`: 颜色 (默认: #00f0ff)
- `loading`: 布尔值 (默认: false)

---

## 📊 Lucide React 图标

项目集成了 [Lucide React](https://lucide.dev/) 图标库，提供 100+ 基础图标。

### 常用图标分类

#### 导航类
- `Home` - 首页
- `Menu` - 菜单
- `X` - 关闭
- `ChevronDown/Up/Left/Right` - 箭头

#### 社交类
- `Github` - GitHub
- `Twitter` - Twitter/X
- `Linkedin` - LinkedIn
- `Mail` - 邮件

#### 功能类
- `Search` - 搜索
- `Settings` - 设置
- `User` - 用户
- `Calendar` - 日历
- `Tag` - 标签
- `Star` - 收藏

#### 编辑类
- `Edit` - 编辑
- `Trash2` - 删除
- `Save` - 保存
- `Copy` - 复制

#### 状态类
- `Check` - 成功
- `AlertCircle` - 警告
- `AlertTriangle` - 错误
- `Info` - 信息

---

## 🎨 配色方案

### 主要颜色

| 名称 | 色值 | RGB | 用途 |
|------|------|-----|------|
| 赛博青 | `#00f0ff` | `rgb(0, 240, 255)` | 主要强调色 |
| 赛博紫 | `#9d00ff` | `rgb(157, 0, 255)` | 次要强调色 |
| 激光粉 | `#ff0080` | `rgb(255, 0, 128)` | 特殊状态 |
| 电压黄 | `#f0ff00` | `rgb(240, 255, 0)` | 高亮、成功 |

### 背景颜色

| 名称 | 色值 | 用途 |
|------|------|------|
| 深空黑 | `#0a0a0f` | 主背景 |
| 次黑 | `#050508` | 次背景 |
| 卡片黑 | `#16162a` | 卡片背景 |
| 静默黑 | `#1a1a2e` | 静默背景 |

### 功能颜色

| 名称 | 色值 | 用途 |
|------|------|------|
| 成功绿 | `#00ff88` | 成功状态 |
| 警告橙 | `#ff6600` | 警告状态 |
| 错误红 | `#ff0040` | 错误状态 |

---

## ✨ 视觉效果

### 霓虹发光
```css
box-shadow: 0 0 5px #00f0ff, 0 0 20px #00f0ff;
text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
```

### 渐变效果
```css
/* 线性渐变 */
background: linear-gradient(135deg, #00f0ff, #9d00ff);

/* 径向渐变 */
background: radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%);
```

### 故障效果
```css
animation: glitch 1s linear infinite;
```

---

## 📐 尺寸规范

### Logo 尺寸
- **主 Logo**: 200x200px
- **图标版**: 64x64px (favicon)
- **方形版**: 512x512px (社交媒体)

### 图标尺寸
| 用途 | 尺寸 |
|------|------|
| 内联图标 | 16-20px |
| 按钮图标 | 20-24px |
| 导航图标 | 24-32px |
| 展示图标 | 48-64px |
| 特大图标 | 96px+ |

---

## 🔧 使用方法

### 导入 Logo 组件
```tsx
import { Logo } from '@/components/icons';

<Logo size={200} variant="main" />
<Logo size={64} variant="icon" />
<Logo size={512} variant="square" />
```

### 导入自定义图标
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

### 导入 Lucide 图标
```tsx
import { Search, Github, Settings } from '@/components/icons/cyber-icons';

<Search size={20} />
<Github size={24} className="text-cyber-cyan" />
```

---

## 📝 设计规范

### Logo 使用规则
1. **最小尺寸**: 32x32px (图标版)
2. **留白空间**: 至少保留 Logo 高度的 25%
3. **背景对比**: 确保在深色背景上有足够对比度
4. **不可分割**: 不得修改 Logo 的比例关系

### 图标使用规则
1. **一致性**: 同一功能使用相同图标
2. **可读性**: 确保小尺寸下清晰可辨
3. **动画控制**: 避免过度动画影响性能
4. **可访问性**: 添加适当的 `aria-label`

---

## 🚀 待创建素材

### 优先级高
- [ ] Favicon (ICO 格式)
- [ ] 触摸图标 (Apple Touch Icon)
- [ ] SVG 精灵图

### 优先级中
- [ ] 背景图案 (网格、扫描线)
- [ ] 装饰元素 (边框、分割线)
- [ ] 插画 (404 页面、加载状态)

### 优先级低
- [ ] 社交分享图片
- [ ] 宣传横幅
- [ ] 品牌指南 PDF

---

## 📚 相关文档

- [设计系统文档](/docs/DESIGN-SYSTEM.md)
- [图标目录](/docs/ICON-CATALOG.md)
- [色彩参考](/COLOR_PALETTE.md)

---

**设计者**: AI 图形设计师
**最后更新**: 2026-03-03
