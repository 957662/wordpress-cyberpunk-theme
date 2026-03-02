# CyberPress 可访问性指南

本文档提供了 CyberPress 平台图形组件的可访问性规范和最佳实践。

## 📖 目录

- [基本原则](#基本原则)
- [ARIA 属性](#aria-属性)
- [键盘导航](#键盘导航)
- [颜色对比度](#颜色对比度)
- [屏幕阅读器](#屏幕阅读器)
- [焦点管理](#焦点管理)
- [测试工具](#测试工具)

## 🎯 基本原则

### WCAG 2.1 AA 级别

CyberPress 平台遵循 WCAG 2.1 AA 级别的可访问性标准：

1. **可感知** - 信息和 UI 组件必须以用户能够感知的方式呈现
2. **可操作** - UI 组件和导航必须可操作
3. **可理解** - 信息和 UI 操作必须可理解
4. **健壮性** - 内容必须足够健壮，能被各种用户代理解释

### 图标可访问性检查清单

- [ ] 所有交互式图标都有明确的标签
- [ ] 所有图标都有适当的 ARIA 角色
- [ ] 图标的颜色对比度符合标准
- [ ] 键盘可以访问所有功能
- [ ] 屏幕阅读器能正确读取图标信息
- [ ] 焦点指示器清晰可见

## 🏷️ ARIA 属性

### 基础图标标签

```tsx
// ❌ 错误 - 缺少标签
<HomeIcon size={24} onClick={handleHome} />

// ✅ 正确 - 有明确的标签
<HomeIcon
  size={24}
  onClick={handleHome}
  aria-label="返回首页"
  role="button"
/>

// ✅ 正确 - 使用 aria-labelledby
<div id="home-label">首页</div>
<HomeIcon
  size={24}
  onClick={handleHome}
  aria-labelledby="home-label"
  role="button"
/>
```

### 装饰性图标

```tsx
// ❌ 错误 - 装饰性图标被屏幕阅读器读取
<StarIcon size={16} />

// ✅ 正确 - 标记为装饰性
<StarIcon
  size={16}
  aria-hidden="true"
/>

// ✅ 正确 - 使用 presentation 角色
<StarIcon
  size={16}
  role="presentation"
/>
```

### 状态指示图标

```tsx
// ✅ 正确 - 状态图标有描述
<CheckIcon
  size={20}
  aria-label="操作成功"
  role="img"
/>

<WarningIcon
  size={20}
  aria-label="警告：请注意"
  role="img"
/>

<ErrorIcon
  size={20}
  aria-label="错误：操作失败"
  role="img"
/>
```

### 按钮内的图标

```tsx
// ✅ 正确 - 按钮文本足够说明
<button aria-label="关闭">
  <CloseIcon size={20} aria-hidden="true" />
</button>

// ✅ 正确 - 图标作为按钮的唯一内容
<button
  aria-label="搜索"
  onClick={handleSearch}
>
  <SearchIcon size={20} aria-hidden="true" />
</button>

// ✅ 正确 - 带文本的图标按钮
<button aria-label="删除项目">
  <DeleteIcon size={20} aria-hidden="true" />
  <span>删除</span>
</button>
```

## ⌨️ 键盘导航

### 可聚焦的图标

```tsx
// ✅ 正确 - 使用按钮元素
<button
  onClick={handleClick}
  aria-label="设置"
  className="focus:ring-2 focus:ring-cyber-cyan"
>
  <SettingsIcon size={24} aria-hidden="true" />
</button>

// ❌ 避免 - 使用 div 模拟按钮
<div onClick={handleClick}>
  <SettingsIcon size={24} />
</div>
```

### 键盘快捷键

```tsx
'use client';

import { useEffect } from 'react';

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // 打开搜索逻辑
      }

      // Escape 关闭模态框
      if (e.key === 'Escape') {
        // 关闭模态框逻辑
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
```

### 焦点管理

```tsx
// ✅ 正确 - 清晰的焦点指示器
<button className="focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2">
  <SearchIcon size={20} aria-hidden="true" />
</button>

// ✅ 正确 - 自定义焦点样式
.button:focus-visible {
  outline: 2px solid #00f0ff;
  outline-offset: 2px;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}
```

## 🎨 颜色对比度

### 最小对比度要求

- **普通文本**: 至少 4.5:1
- **大文本 (18pt+)**: 至少 3:1
- **UI 组件和图形**: 至少 3:1

### 赛博朋克配色对比度

```css
/* ✅ 良好的对比度 */
.text-cyber-cyan {
  color: #00f0ff; /* 在深色背景上对比度 > 7:1 */
}

.bg-cyber-dark {
  background-color: #0a0a0f;
}

/* ⚠️ 需要调整 */
.text-cyber-purple {
  color: #9d00ff;
  /* 可能需要调整亮度以提高对比度 */
}

/* ✅ 调整后的版本 */
.text-cyber-purple-high-contrast {
  color: #b14dff; /* 提高亮度 */
}
```

### 对比度测试工具

```tsx
// 检查颜色对比度的辅助函数
function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    const rgb = parseInt(color.replace('#', ''), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >>  8) & 0xff) / 255;
    const b = ((rgb >>  0) & 0xff) / 255;

    const a = [r, g, b].map((v) => {
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// 使用
const ratio = getContrastRatio('#00f0ff', '#0a0a0f');
console.log(`对比度: ${ratio.toFixed(2)}:1`);
```

## 📢 屏幕阅读器

### 语义化 HTML

```tsx
// ❌ 错误 - 不语义化
<div onClick={handleClick}>
  <SearchIcon size={24} />
</div>

// ✅ 正确 - 语义化
<button onClick={handleClick} aria-label="搜索">
  <SearchIcon size={24} aria-hidden="true" />
</button>
```

### Live Regions

```tsx
// ✅ 正确 - 使用 live region 更新动态内容
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>

// ✅ 正确 - 紧急通知
<div
  role="alert"
  aria-live="assertive"
>
  {errorMessage}
</div>
```

### 跳过链接

```tsx
// ✅ 正确 - 提供跳过导航的链接
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  跳到主要内容
</a>

<main id="main-content">
  {/* 主要内容 */}
</main>
```

## 🎯 焦点管理

### 焦点陷阱

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function FocusTrap({ children, isActive }: {
  children: React.ReactNode;
  isActive: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // 获取所有可聚焦元素
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // 聚焦第一个元素
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
}
```

### 焦点恢复

```tsx
'use client';

import { useRef, useEffect } from 'react';

export function Modal({ onClose, children }: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 保存当前焦点元素
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 聚焦模态框
    const modal = document.getElementById('modal');
    modal?.focus();

    return () => {
      // 恢复焦点
      previousFocusRef.current?.focus();
    };
  }, []);

  return (
    <div
      id="modal"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
```

## 🧪 测试工具

### 自动化测试

```tsx
// 使用 Jest 和 Testing Library 测试可访问性
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Icon accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <button aria-label="搜索">
        <SearchIcon size={20} aria-hidden="true" />
      </button>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper aria-label', () => {
    render(
      <button aria-label="搜索">
        <SearchIcon size={20} aria-hidden="true" />
      </button>
    );

    expect(screen.getByLabelText('搜索')).toBeInTheDocument();
  });
});
```

### 手动测试清单

- [ ] 使用键盘可以访问所有交互元素
- [ ] Tab 键顺序符合逻辑
- [ ] 焦点指示器清晰可见
- [ ] 屏幕阅读器能正确读取所有内容
- [ ] 颜色对比度符合标准
- [ ] 表单有适当的标签和错误提示
- [ ] 模态框和对话框能正确管理焦点

### 推荐工具

1. **axe DevTools** - Chrome/Firefox 扩展，检测可访问性问题
2. **WAVE** - 网页可访问性评估工具
3. **Lighthouse** - Chrome 内置的性能和可访问性审计
4. **NVDA / JAWS** - Windows 屏幕阅读器
5. **VoiceOver** - macOS 屏幕阅读器

## 📚 相关资源

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Framer Motion Accessibility](https://www.framer.com/motion/guide-reduce-motion/)

## 🔄 更新日志

### v1.0.0 (2026-03-02)
- 初始可访问性指南发布
- WCAG 2.1 AA 标准规范
- 图标可访问性检查清单
- 键盘导航最佳实践
