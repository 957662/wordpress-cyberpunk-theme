# 🎨 CyberPress 新组件使用示例

本文档展示如何使用新创建的组件和 Hooks。

---

## ✨ 特效组件示例

### CyberSpectrum - 赛博频谱

\`\`\`tsx
import { CyberSpectrum } from '@/components/effects';

export default function SpectrumDemo() {
  return (
    <div className="p-8">
      <h2 className="text-cyber-cyan mb-4">音频频谱</h2>
      
      {/* 基础用法 */}
      <CyberSpectrum />
      
      {/* 自定义配置 */}
      <CyberSpectrum
        intensity={2}
        speed={1.5}
        bars={64}
        className="mt-8"
      />
    </div>
  );
}
\`\`\`

### CyberWave - 赛博波浪

\`\`\`tsx
import { CyberWave } from '@/components/effects';

export default function WaveDemo() {
  return (
    <div className="p-8">
      {/* 青色波浪 */}
      <CyberWave color="cyan" />
      
      {/* 紫色波浪，高振幅 */}
      <CyberWave
        color="purple"
        amplitude={80}
        waveCount={5}
        className="mt-4"
      />
      
      {/* 粉色波浪 */}
      <CyberWave color="pink" speed={2} className="mt-4" />
    </div>
  );
}
\`\`\`

### DigitalRain - 数字雨

\`\`\`tsx
import { DigitalRain } from '@/components/effects';

export default function DigitalRainDemo() {
  return (
    <div className="h-screen">
      {/* Matrix 风格 */}
      <DigitalRain color="matrix" />
      
      {/* 赛博风格 */}
      <DigitalRain color="cyber" density={2} />
      
      {/* 火焰风格 */}
      <DigitalRain color="fire" fontSize={18} />
    </div>
  );
}
\`\`\`

---

## 🖼️ UI 组件示例

### CyberBadge - 徽章

\`\`\`tsx
import { CyberBadge } from '@/components/ui';

export default function BadgeDemo() {
  return (
    <div className="flex gap-4 p-8">
      {/* 基础徽章 */}
      <CyberBadge>Default</CyberBadge>
      
      {/* 成功徽章 */}
      <CyberBadge variant="success">Success</CyberBadge>
      
      {/* 带脉冲和发光 */}
      <CyberBadge
        variant="warning"
        pulse
        glow
      >
        Warning
      </CyberBadge>
      
      {/* 可点击 */}
      <CyberBadge
        variant="error"
        onClick={() => alert('Clicked!')}
      >
        Click Me
      </CyberBadge>
      
      {/* 不同尺寸 */}
      <CyberBadge size="sm">Small</CyberBadge>
      <CyberBadge size="md">Medium</CyberBadge>
      <CyberBadge size="lg">Large</CyberBadge>
    </div>
  );
}
\`\`\`

### CyberProgress - 进度条

\`\`\`tsx
import { CyberProgress } from '@/components/ui';
import { useState, useEffect } from 'react';

export default function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 10) % 110);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* 基础进度条 */}
      <CyberProgress value={50} />
      
      {/* 显示百分比 */}
      <CyberProgress value={75} showValue />
      
      {/* 带标签 */}
      <CyberProgress
        value={progress}
        label="Loading..."
        showValue
      />
      
      {/* 不同变体 */}
      <CyberProgress
        value={90}
        variant="success"
        label="Complete"
      />
      
      <CyberProgress
        value={45}
        variant="warning"
        label="Warning"
      />
      
      <CyberProgress
        value={20}
        variant="error"
        label="Error"
      />
    </div>
  );
}
\`\`\`

---

## 🪝 Hooks 示例

### useIntersectionObserver - 视口检测

\`\`\`tsx
import { useIntersectionObserver } from '@/lib/hooks';

export default function RevealOnScroll() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.3
  });

  return (
    <div ref={ref} className="p-8">
      <div
        className={\`
          transition-all duration-700
          \${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        \`}
      >
        {isVisible ? (
          <h2 className="text-4xl text-cyber-cyan">
            我现在可见了！
          </h2>
        ) : (
          <h2 className="text-4xl text-gray-600">
            滚动以显示内容
          </h2>
        )}
      </div>
    </div>
  );
}
\`\`\`

### useMediaQuery - 响应式检测

\`\`\`tsx
import { useIsMobile, useDarkMode } from '@/lib/hooks';

export default function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isDarkMode = useDarkMode();

  return (
    <div className="p-8">
      {isMobile ? (
        <p className="text-sm">移动设备视图</p>
      ) : (
        <p className="text-lg">桌面设备视图</p>
      )}
      
      {isDarkMode && (
        <p className="text-cyber-cyan">
          检测到暗黑模式
        </p>
      )}
    </div>
  );
}
\`\`\`

### useClipboard - 剪贴板操作

\`\`\`tsx
import { useClipboard } from '@/lib/hooks';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
  const { isCopied, copy } = useClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className="flex items-center gap-2 px-4 py-2 bg-cyber-primary/20 border border-cyber-primary rounded-lg"
    >
      {isCopied ? (
        <>
          <Check size={16} />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy size={16} />
          <span>复制</span>
        </>
      )}
    </button>
  );
}
\`\`\`

### useLocalStorage - 本地存储

\`\`\`tsx
import { useLocalStorage } from '@/lib/hooks';

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  return (
    <div className="p-8">
      <p>当前主题: {theme}</p>
      
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="px-4 py-2 bg-cyber-primary rounded"
      >
        切换主题
      </button>
    </div>
  );
}
\`\`\`

### useKeyboard - 键盘快捷键

\`\`\`tsx
import { useKeyboard, useShortcut } from '@/lib/hooks';

export default function KeyboardDemo() {
  const keyboard = useKeyboard();

  // Ctrl+K 保存
  useShortcut(['k'], () => {
    console.log('保存操作');
  }, { ctrl: true, preventDefault: true });

  // Escape 关闭
  useShortcut(['Escape'], () => {
    console.log('关闭弹窗');
  });

  return (
    <div className="p-8">
      <p className="mb-4">键盘快捷键演示</p>
      
      <div className="space-y-2">
        <p>Ctrl 状态: {keyboard.isCtrlPressed() ? '按下' : '未按下'}</p>
        <p>Shift 状态: {keyboard.isShiftPressed() ? '按下' : '未按下'}</p>
        <p>Escape 状态: {keyboard.isEscape() ? '按下' : '未按下'}</p>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>按 Ctrl+K 保存</p>
        <p>按 Escape 关闭</p>
      </div>
    </div>
  );
}
\`\`\`

### useDebounce - 防抖

\`\`\`tsx
import { useDebounce } from '@/lib/hooks';
import { useState } from 'react';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce((value: string) => {
    console.log('搜索:', value);
    // 执行搜索 API 调用
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="搜索..."
      className="px-4 py-2 border border-cyber-primary rounded bg-cyber-dark text-white"
    />
  );
}
\`\`\`

---

## 🔧 实用工具示例

### 性能监控

\`\`\`tsx
import { PerformanceMonitor } from '@/lib/utils/performance-utils';

export default function MonitoredComponent() {
  const monitor = new PerformanceMonitor();

  useEffect(() => {
    monitor.mark('component-start');

    // 模拟异步操作
    fetchData().then(() => {
      monitor.measure('数据加载', 'component-start');
    });

    return () => {
      monitor.measure('组件卸载', 'component-start');
    };
  }, []);

  return <div>Monitored Component</div>;
}
\`\`\`

### 表单验证

\`\`\`tsx
import { validators, createValidator } from '@/lib/utils/validation-utils';

// 定义验证规则
const userValidator = createValidator({
  email: validators.email,
  username: validators.username,
  password: (value) => value.length >= 8
});

export default function UserForm() {
  const handleSubmit = (data: any) => {
    const { valid, errors } = userValidator(data);

    if (!valid) {
      console.error('验证失败:', errors);
      return;
    }

    console.log('验证成功，提交表单');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段 */}
    </form>
  );
}
\`\`\`

---

## 📄 完整页面示例

### 404 页面

404 页面已自动创建在 \`frontend/app/(public)/404/page.tsx\`，包含：
- GlitchText 故障效果
- 网格背景
- 返回按钮
- 装饰元素

### 加载页面

加载页面已自动创建在 \`frontend/app/(public)/loading/page.tsx\`，包含：
- CyberLoader 动画
- 动态背景
- 状态更新
- 自动跳转

---

## 🎯 最佳实践

### 1. 性能优化

\`\`\`tsx
import { useLazyLoad } from '@/lib/hooks';

export default function HeavyComponent() {
  const [ref, isVisible] = useLazyLoad();

  return (
    <div ref={ref}>
      {isVisible && <ExpensiveComponent />}
    </div>
  );
}
\`\`\`

### 2. 响应式设计

\`\`\`tsx
import { useBreakpoint } from '@/lib/hooks';

export default function ResponsiveLayout() {
  const breakpoint = useBreakpoint();

  return (
    <div className={\`
      grid
      \${breakpoint === 'xs' ? 'grid-cols-1' : 'grid-cols-3'}
    \`}>
      {/* 内容 */}
    </div>
  );
}
\`\`\`

### 3. SEO 优化

\`\`\`tsx
import { generatePageMetadata } from '@/lib/services/seo-service';

export const metadata = generatePageMetadata({
  title: '我的页面',
  description: '页面描述',
  path: '/my-page',
  keywords: ['关键词1', '关键词2']
});
\`\`\`

---

## 📚 更多资源

- [组件文档](./COMPONENTS.md)
- [快速参考](./QUICK_REFERENCE_2026.md)
- [API 文档](./API.md)

---

**最后更新**: 2026-03-03
