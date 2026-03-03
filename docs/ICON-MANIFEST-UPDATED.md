# CyberPress 图标清单 - 更新版

> **最后更新**: 2026-03-03
> **版本**: v2.0.0
> **新增**: 6个特效图标 + 7个装饰元素

---

## 📋 快速索引

- [基础图标](#基础图标) - 50+
- [特效图标](#特效图标) ⭐ 新增 - 6
- [装饰元素](#装饰元素) ⭐ 新增 - 7
- [Logo变体](#logo变体) - 6

---

## 🎯 基础图标

### 导航类 (8个)

| 图标 | 组件名 | 用途 | 尺寸 |
|------|--------|------|------|
| 🏠 首页 | `HomeIcon` | 导航首页 | 24px |
| 📋 菜单 | `MenuIcon` | 汉堡菜单 | 24px |
| 🔙 返回 | `ArrowIcon` | 方向指示 | 20px |
| ⬇️ 下拉 | `ChevronDownIcon` | 折叠展开 | 16px |
| ⬆️ 上拉 | `ChevronUpIcon` | 折叠展开 | 16px |
| ⬅️ 左箭 | `ChevronLeftIcon` | 翻页 | 16px |
| ➡️ 右箭 | `ChevronRightIcon` | 翻页 | 16px |
| 🔗 外链 | `ExternalLinkIcon` | 外部链接 | 16px |

### 操作类 (12个)

| 图标 | 组件名 | 用途 | 特性 |
|------|--------|------|------|
| 🔍 搜索 | `SearchIcon` | 搜索框 | 发光可选 |
| 🔬 筛选 | `FilterIcon` | 筛选面板 | - |
| ↕️ 排序 | `SortIcon` | 排序 | 升降序 |
| 📤 分享 | `ShareIcon` | 分享按钮 | - |
| 📋 复制 | `CopyIcon` | 复制链接 | - |
| ⬇️ 下载 | `DownloadIcon` | 下载文件 | - |
| ⬆️ 上传 | `UploadIcon` | 上传文件 | - |
| ✏️ 编辑 | `EditIcon` | 编辑操作 | - |
| 🗑️ 删除 | `TrashIcon` | 删除操作 | 危险色 |
| 🔄 刷新 | `RefreshIcon` | 刷新数据 | 旋转动画 |
| 💾 保存 | `SaveIcon` | 保存操作 | - |
| 🔒 锁定 | `LockIcon` | 权限控制 | - |

### 社交类 (8个)

| 图标 | 组件名 | 平台 | 变体 |
|------|--------|------|------|
| 🐙 GitHub | `GitHubIcon` | GitHub | 轮廓/填充 |
| 🐦 Twitter | `TwitterIcon` | Twitter | - |
| 📺 YouTube | `YouTubeIcon` | YouTube | - |
| 💼 LinkedIn | `LinkedInIcon` | LinkedIn | - |
| 👾 Discord | `DiscordIcon` | Discord | - |
| 🏀 Dribbble | `DribbbleIcon` | Dribbble | - |
| 📧 邮箱 | `EmailIcon` | Email | - |
| 📡 RSS | `RSSIcon` | RSS Feed | - |

### 内容类 (10个)

| 图标 | 组件名 | 用途 | 颜色变体 |
|------|--------|------|---------|
| 📝 博客 | `BlogIcon` | 博客文章 | 5色 |
| 🎨 作品 | `PortfolioIcon` | 作品集 | 5色 |
| 💻 代码 | `CodeIcon` | 代码块 | - |
| 📄 文件 | `FileIcon` | 文件 | - |
| 📁 文件夹 | `FolderIcon` | 文件夹 | - |
| 📅 日历 | `CalendarIcon` | 日期 | - |
| 🏷️ 标签 | `TagIcon` | 标签 | - |
| 💬 评论 | `CommentIcon` | 评论 | - |
| 🎥 视频 | `VideoIcon` | 视频 | - |
| 🎤 音频 | `MicIcon` | 音频 | - |

### 状态类 (12个)

| 图标 | 组件名 | 用途 | 颜色 |
|------|--------|------|------|
| ✅ 勾选 | `CheckIcon` | 成功 | 绿色 |
| ❌ 关闭 | `CloseIcon` | 关闭 | - |
| ℹ️ 信息 | `InfoIcon` | 提示 | 青色 |
| ⚠️ 警告 | `WarningIcon` | 警告 | 黄色 |
| ❌ 错误 | `ErrorIcon` | 错误 | 粉色 |
| ❤️ 收藏 | `HeartIcon` | 收藏 | 粉色 |
| ⭐ 星标 | `StarIcon` | 评分 | 黄色 |
| 🔔 通知 | `BellIcon` | 通知 | - |
| 🔖 书签 | `BookmarkIcon` | 书签 | - |
| 👁️ 显示 | `EyeIcon` | 显示 | - |
| 👁️‍🗨️ 隐藏 | `EyeOffIcon` | 隐藏 | - |
| 🌐 在线 | `OnlineIcon` | 在线状态 | 绿色 |

---

## ⭐ 特效图标 (NEW!)

### 全息投影 | `HologramIcon`

```tsx
import { HologramIcon } from '@/components/icons/SpecialEffectsIcons';

<HologramIcon size={64} animated={true} />
```

**特效**:
- 扫描线动画
- 渐变色彩（青→紫→粉）
- 发光效果
- 装饰节点

**用途**: 加载状态、数据处理、AI功能

**尺寸**: 32-128px
**颜色**: 可自定义
**动画**: 可开关

---

### 故障效果 | `GlitchIcon`

```tsx
<GlitchIcon size={48} animated={true} />
```

**特效**:
- RGB色彩分离
- 抖动动画
- 故障条纹
- 颜色循环

**用途**: 错误页面、404、特殊状态

---

### 矩阵雨 | `MatrixIcon`

```tsx
<MatrixIcon size={48} animated={true} />
```

**特效**:
- 字符下落动画
- 渐变透明度
- 等宽字体
- 黑色背景

**用途**: 数据处理、编程相关、终端

---

### 数据流动 | `DataFlowIcon`

```tsx
<DataFlowIcon size={48} animated={true} />
```

**特效**:
- 数据包动画
- 节点连接
- 渐变连线
- 多色节点

**用途**: 数据同步、API调用、网络请求

---

### 神经网络 | `NeuralNetworkIcon`

```tsx
<NeuralNetworkIcon size={48} animated={true} />
```

**特效**:
- 多节点连接
- 信号传输
- 中心脉冲
- 多色节点

**用途**: AI功能、机器学习、智能推荐

---

### 能量核心 | `EnergyCoreIcon`

```tsx
<EnergyCoreIcon size={48} animated={true} />
```

**特效**:
- 脉冲光环
- 能量束
- 中心光点
- 多层波纹

**用途**: 性能指标、能量级别、系统状态

---

## 🎨 装饰元素 (NEW!)

### CyberCorners | 角落装饰

```tsx
import { CyberCorners } from '@/components/graphics/DecorativeElements';

<CyberCorners size={100} color="#00f0ff" glow={true} />
```

**特性**:
- 四角科技感装饰
- 发光效果可选
- 绝对定位
- 不占布局空间

**用途**: 容器边框装饰

---

### TechLines | 科技线条

```tsx
<TechLines density="medium" color="#9d00ff" animated={true} />
```

**参数**:
- `density`: low | medium | high
- `color`: 自定义颜色
- `animated`: 动画开关

**用途**: 背景装饰、数据流动

---

### NeonParticles | 霓虹粒子

```tsx
<NeonParticles count={20} size={3} color="#ff0080" animated={true} />
```

**参数**:
- `count`: 粒子数量 (1-50)
- `size`: 粒子大小 (1-5)
- `color`: 粒子颜色

**用途**: 氛围营造、动态背景

---

### HexGrid | 六边形网格

```tsx
<HexGrid cellSize={25} color="#00f0ff" opacity={0.15} />
```

**参数**:
- `cellSize`: 单元格大小
- `color`: 网格颜色
- `opacity`: 透明度 (0-1)

**用途**: 背景纹理、科技感

---

### PulseRing | 脉冲光环

```tsx
<PulseRing size={150} color="#f0ff00" animated={true} />
```

**特效**: 扩散的圆形波纹动画

**用途**: 加载状态、强调效果

---

### CodeRain | 代码雨

```tsx
<CodeRain density={12} color="#00ff88" animated={true} />
```

**特效**: Matrix风格代码下落

**用途**: 编程相关背景、数据流

---

### GlitchStripes | 故障条纹

```tsx
<GlitchStripes count={5} colors={['#ff0080', '#00f0ff']} animated={true} />
```

**特效**: RGB分离效果条纹

**用途**: 故障风格装饰

---

## 🖼️ Logo变体

| 变体 | 组件名 | 尺寸 | 用途 |
|------|--------|------|------|
| 主Logo | `MainLogo` | 200x60 | 页面头部 |
| 方形Logo | `SquareLogo` | 100x100 | 图标 |
| Favicon | `FaviconLogo` | 32x32 | 网站图标 |
| 极简Logo | `MinimalLogo` | 可变 | 简约场景 |
| 文字Logo | `TextLogo` | 可变 | 文字展示 |
| 水印Logo | `WatermarkLogo` | 可变 | 背景水印 |

---

## 📐 尺寸规范

| 类型 | 尺寸 | 用途 |
|------|------|------|
| 超小 | 12-16px | 按钮、标签内 |
| 小 | 18-20px | 列表项、工具栏 |
| 中 | 24px | 导航、页脚 |
| 大 | 32-48px | 功能展示 |
| 超大 | 64-128px | 特效图标、首页 |

---

## 🎨 颜色变体

所有支持变体的图标可使用以下颜色：

| 变体 | 色值 | 类名 |
|------|------|------|
| cyan | `#00f0ff` | `text-cyber-cyan` |
| purple | `#9d00ff` | `text-cyber-purple` |
| pink | `#ff0080` | `text-cyber-pink` |
| yellow | `#f0ff00` | `text-cyber-yellow` |
| green | `#00ff88` | `text-cyber-green` |

---

## 💻 使用示例

### 基础图标

```tsx
import { SearchIcon, BlogIcon, UserIcon } from '@/components/icons';

// 默认
<SearchIcon size={24} />

// 自定义颜色
<BlogIcon size={32} className="text-cyber-cyan" />

// 颜色变体
<BlogIcon size={32} variant="purple" />
```

### 特效图标

```tsx
import { HologramIcon, GlitchIcon } from '@/components/icons/SpecialEffectsIcons';

// 带动画
<HologramIcon size={64} animated={true} />

// 自定义颜色
<GlitchIcon size={48} color="#ff0080" animated={true} />
```

### 装饰元素

```tsx
import { CyberCorners, TechLines } from '@/components/graphics/DecorativeElements';

// 单独使用
<CyberCorners size={100} glow={true} />

// 组合使用
<div className="relative">
  <TechLines density="medium" animated={true} />
  <NeonParticles count={20} animated={true} />
  <div className="relative z-10">
    内容
  </div>
</div>
```

---

## 📊 统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 基础图标 | 50+ | 导航、操作、社交、内容、状态 |
| 特效图标 | 6 | ⭐ 新增 |
| 装饰元素 | 7 | ⭐ 新增 |
| Logo变体 | 6 | 不同场景 |
| **总计** | **69+** | 完整的图标系统 |

---

## 📚 相关文档

- [完整图标目录](/docs/ICON-CATALOG-ENHANCED.md)
- [配色指南](/docs/COLOR-PALETTE-GUIDE.md)
- [特效展示页面](/special-effects-showcase)
- [设计系统](/docs/DESIGN-SYSTEM.md)

---

**更新日志**:
- v2.0.0 (2026-03-03): 新增6个特效图标 + 7个装饰元素
- v1.0.0 (2026-03-02): 初始版本，50+基础图标

**维护团队**: CyberPress AI Design Team
