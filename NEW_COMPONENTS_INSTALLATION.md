# 新组件安装指南

## ✅ 依赖检查

所有新组件所需的依赖已安装在项目中：

### 已安装的依赖
- ✅ `react` - React 框架
- ✅ `framer-motion` - 动画库
- ✅ `lucide-react` - 图标库
- ✅ `clsx` / `classnames` - 类名工具
- ✅ `tailwindcss` - 样式框架

### 可选依赖（如需增强功能）
- ⚠️ `react-dropzone` - 文件上传（当前版本不依赖）
- ⚠️ `@monaco-editor/react` - 代码编辑器（可选）

---

## 🚀 快速开始

### 1. 所有组件已就绪
所有新创建的组件都可以直接使用，无需额外安装！

### 2. 导入组件

```typescript
// 语音功能
import { VoiceInput, VoiceCommands, useCommonVoiceCommands } from '@/components/voice';

// 协作功能
import { CursorTracker, PresenceIndicator } from '@/components/collaborative';

// 搜索功能
import { SearchHighlight, TextSearch } from '@/components/search';

// 编辑器功能
import { DocumentDiff } from '@/components/editor';

// 实用工具
import {
  LazyImage,
  BlurImage,
  ProgressiveImage,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  SkeletonWrapper,
} from '@/components/utility';

// 键盘快捷键
import {
  CommandPalette,
  ShortcutHint,
  ShortcutTooltip,
  ShortcutBadge,
} from '@/components/keyboard';
```

---

## 📋 组件功能清单

### 🎤 语音组件
- [x] VoiceInput - 语音输入识别
- [x] VoiceCommands - 语音命令控制
- [x] 多语言支持（中、英、日、韩等）
- [x] 实时转写和反馈
- [x] 权限管理和错误处理

### 👥 协作组件
- [x] CursorTracker - 实时光标跟踪
- [x] PresenceIndicator - 用户状态指示
- [x] WebSocket 集成就绪
- [x] 模拟演示版本

### 🔍 搜索组件
- [x] SearchHighlight - 内容搜索高亮
- [x] TextSearch - 文本列表搜索
- [x] 正则表达式支持
- [x] 键盘导航快捷键

### 📝 编辑器组件
- [x] DocumentDiff - 文档对比
- [x] 并排/内联视图切换
- [x] 差异统计信息

### 🛠️ 实用工具
- [x] LazyImage - 懒加载图片
- [x] BlurImage - 背景模糊效果
- [x] ProgressiveImage - 渐进式加载
- [x] Skeleton - 多种骨架屏
- [x] SkeletonWrapper - 加载包装器

### ⌨️ 键盘组件
- [x] CommandPalette - 命令面板
- [x] ShortcutHint - 快捷键提示
- [x] ShortcutTooltip - 快捷键工具提示
- [x] ShortcutBadge - 快捷键徽章

---

## 🎯 使用示例

### 1. 语音输入 + 命令
```tsx
import { VoiceInput, VoiceCommands, useCommonVoiceCommands } from '@/components/voice';

function MyComponent() {
  const [text, setText] = useState('');
  const commands = useCommonVoiceCommands();

  return (
    <>
      <VoiceInput onTranscript={setText} language="zh-CN" />
      <VoiceCommands commands={commands} position="bottom-right" />
    </>
  );
}
```

### 2. 实时协作
```tsx
import { CursorTracker, PresenceIndicator } from '@/components/collaborative';

function CollaborativeApp() {
  const [users] = useState([
    { userId: '1', userName: 'Alice', status: 'online' },
    { userId: '2', userName: 'Bob', status: 'away' },
  ]);

  return (
    <>
      <CursorTracker isEnabled />
      <PresenceIndicator users={users} position="bottom-right" />
    </>
  );
}
```

### 3. 搜索高亮
```tsx
import { SearchHighlight } from '@/components/search';

function SearchableContent({ content }) {
  const [query, setQuery] = useState('');

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
      />
      <SearchHighlight content={content} searchQuery={query} />
    </>
  );
}
```

### 4. 图片懒加载
```tsx
import { LazyImage, CardSkeleton, SkeletonWrapper } from '@/components/utility';

function ImageGallery() {
  const [loading, setLoading] = useState(true);

  return (
    <SkeletonWrapper
      loading={loading}
      skeleton={<ImageCardSkeleton />}
    >
      <LazyImage
        src="/image.jpg"
        alt="描述"
        onLoad={() => setLoading(false)}
      />
    </SkeletonWrapper>
  );
}
```

### 5. 命令面板
```tsx
import { CommandPalette } from '@/components/keyboard';

function App() {
  const commands = [
    {
      id: 'save',
      label: '保存',
      shortcut: ['⌘', 'S'],
      action: () => saveDocument(),
    },
  ];

  return <CommandPalette commands={commands} />;
}
```

---

## 🔧 配置说明

### 语音识别配置
```tsx
<VoiceInput
  language="zh-CN"        // 语言
  continuous={false}       // 连续识别
  interimResults={true}    // 显示中间结果
  showInterim={true}       // 显示临时文本
/>
```

### 协作功能配置
```tsx
<CursorTracker
  isEnabled={true}
  showNames={true}
  updateInterval={50}      // 更新频率(ms)
/>

<PresenceIndicator
  users={users}
  maxVisible={5}           // 最多显示用户数
  showStatus={true}
  showAvatars={true}
/>
```

### 搜索配置
```tsx
<SearchHighlight
  caseSensitive={false}    // 区分大小写
  wholeWord={false}        // 全字匹配
  useRegex={false}         // 使用正则
  highlightColor="#00f0ff" // 高亮颜色
/>
```

---

## 🎨 主题定制

所有组件都支持赛博朋克主题配色：

```css
/* 主色调 */
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;
--cyber-yellow: #f0ff00;
--cyber-black: #0a0a0f;
```

---

## 📱 浏览器支持

### 语音识别
- ✅ Chrome/Edge (完整支持)
- ✅ Safari (部分支持)
- ❌ Firefox (不支持)

### 协作功能
- ✅ 所有现代浏览器
- ✅ 移动端浏览器

### 搜索功能
- ✅ 所有现代浏览器
- ✅ 移动端浏览器

---

## 🐛 故障排除

### 语音识别不工作
1. 检查浏览器是否支持 Web Speech API
2. 确认已授予麦克风权限
3. 使用 HTTPS 或 localhost

### 图片懒加载失败
1. 检查图片路径是否正确
2. 确认图片服务器可访问
3. 查看浏览器控制台错误

### 命令面板无法打开
1. 检查是否与其他快捷键冲突
2. 尝试自定义触发键
3. 检查焦点是否在页面上

---

## 📚 更多资源

- **详细文档**: NEW_COMPONENTS_CREATED_REPORT_2026_03_03.md
- **示例页面**: /examples/new-features-showcase
- **组件源码**: /frontend/components/

---

## ✨ 下一步

1. ✅ 查看示例页面
2. ✅ 阅读详细报告
3. ✅ 在项目中使用组件
4. ✅ 自定义样式和行为
5. ✅ 添加单元测试

---

**所有组件已准备就绪，立即开始使用！** 🚀
