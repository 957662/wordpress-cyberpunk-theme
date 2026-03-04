# 新组件快速开始指南

> CyberPress Platform - 新组件使用指南
> 创建日期: 2026-03-05

---

## 🎉 恭喜！

您已经成功创建了 **13 个新的赛博朋克风格组件**！

---

## 📦 新组件列表

### UI 组件 (10个)
1. **SpeedDial** - 快速拨号按钮
2. **BottomSheet** - 底部抽屉
3. **PullToRefresh** - 下拉刷新
4. **Skeleton** - 骨架屏（6种变体）
5. **OTPInput** - 验证码输入
6. **CommentItem** - 评论项
7. **RadioGroup** - 单选框组
8. **AudioPlayer** - 音频播放器
9. **ProgressBar** - 进度条（线性和圆形）
10. **NewsletterCard** - 订阅卡片

### 特效组件 (2个)
1. **MatrixBackground** - 矩阵数字雨背景
2. **CyberGrid** - 赛博网格背景

---

## 🚀 快速开始

### 1. 查看演示页面

启动开发服务器后，访问以下地址查看所有新组件的演示：

```
http://localhost:3000/showcase/new-components
```

### 2. 导入组件

#### 方式一：导入单个组件
```tsx
import { SpeedDial } from '@/components/ui/SpeedDial';
import { BottomSheet } from '@/components/ui/BottomSheet';
```

#### 方式二：批量导入（推荐）
```tsx
import {
  SpeedDial,
  BottomSheet,
  PullToRefresh,
  MatrixBackground,
  NewsletterCard,
} from '@/components/index-new-components';
```

---

## 💡 使用示例

### SpeedDial 快速拨号

```tsx
import { SpeedDial } from '@/components/ui/SpeedDial';

const actions = [
  {
    icon: <PlusIcon />,
    label: '新建',
    onClick: () => console.log('新建'),
    color: 'cyan',
  },
  {
    icon: <UploadIcon />,
    label: '上传',
    onClick: () => console.log('上传'),
    color: 'purple',
  },
];

<SpeedDial
  actions={actions}
  position="bottom-right"
  direction="up"
/>
```

### BottomSheet 底部抽屉

```tsx
import { BottomSheet } from '@/components/ui/BottomSheet';

const [isOpen, setIsOpen] = useState(false);

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="标题"
  height="half"
>
  <p>内容区域</p>
</BottomSheet>
```

### PullToRefresh 下拉刷新

```tsx
import { PullToRefresh } from '@/components/ui/PullToRefresh';

const handleRefresh = async () => {
  // 执行刷新逻辑
  await fetchData();
};

<PullToRefresh onRefresh={handleRefresh}>
  <div>
    {/* 可刷新的内容 */}
  </div>
</PullToRefresh>
```

### Skeleton 骨架屏

```tsx
import { BlogCardSkeleton, UserCardSkeleton, SkeletonList } from '@/components/ui/Skeleton';

// 博客卡片骨架屏
<BlogCardSkeleton />

// 用户卡片骨架屏
<UserCardSkeleton />

// 列表骨架屏
<SkeletonList count={5} showAvatar />
```

### OTPInput 验证码输入

```tsx
import { OTPInput } from '@/components/ui/OTPInput';

const [otp, setOtp] = useState('');

<OTPInput
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={(value) => console.log('验证码:', value)}
/>
```

### CommentItem 评论项

```tsx
import { CommentItem } from '@/components/ui/CommentItem';

<CommentItem
  id="1"
  author={{ name: '用户名', avatar: '/avatar.jpg' }}
  content="评论内容"
  createdAt="2026-03-05T10:00:00Z"
  likes={42}
  isLiked={true}
  onLike={(id) => console.log('点赞:', id)}
  onReply={(id, content) => console.log('回复:', content)}
/>
```

### RadioGroup 单选框组

```tsx
import { RadioGroup } from '@/components/ui/RadioGroup';

const options = [
  { value: '1', label: '选项 1', description: '描述' },
  { value: '2', label: '选项 2', description: '描述' },
];

<RadioGroup
  name="choice"
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  variant="neon"
/>
```

### AudioPlayer 音频播放器

```tsx
import { AudioPlayer } from '@/components/ui/AudioPlayer';

const tracks = [
  {
    id: '1',
    title: '歌曲名',
    artist: '歌手',
    url: '/audio/song.mp3',
    cover: '/images/cover.jpg',
  },
];

<AudioPlayer tracks={tracks} autoPlay={false} />
```

### ProgressBar 进度条

```tsx
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';

// 线性进度条
<ProgressBar
  value={75}
  max={100}
  label="下载进度"
  variant="neon"
  showPercentage
/>

// 圆形进度条
<CircularProgress
  value={75}
  size={150}
  color="cyan"
  label="完成度"
/>
```

### MatrixBackground 矩阵背景

```tsx
import { MatrixBackground } from '@/components/effects/MatrixBackground';

<MatrixBackground
  density={50}
  fontSize={14}
  color="#00f0ff"
  speed={50}
/>
```

### CyberGrid 网格背景

```tsx
import { CyberGrid, PerspectiveGrid } from '@/components/effects/CyberGrid';

// 普通网格
<CyberGrid size={50} color="#00f0ff" animated />

// 3D 透视网格
<PerspectiveGrid size={60} perspective />
```

### NewsletterCard 订阅卡片

```tsx
import { NewsletterCard } from '@/components/blog/NewsletterCard';

<NewsletterCard
  variant="neon"
  onSubmit={async (email) => {
    await subscribeToNewsletter(email);
  }}
/>
```

---

## 🎨 自定义主题

所有组件都支持赛博朋克风格的颜色主题：

```tsx
// 可用的颜色选项
type Color = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

// 示例
<SpeedDial
  actions={[
    { color: 'cyan', ... },
    { color: 'purple', ... },
    { color: 'pink', ... },
  ]}
/>
```

---

## 📱 响应式设计

所有组件都内置响应式支持，自动适配不同屏幕尺寸：

```tsx
// 组件会自动适配移动端和桌面端
<BottomSheet height="half" />  // 移动端优化的高度
```

---

## 🎯 TypeScript 支持

所有组件都有完整的 TypeScript 类型定义：

```tsx
import type {
  SpeedDialProps,
  BottomSheetProps,
  CommentItemProps,
  // ... 其他类型
} from '@/components/index-new-components';
```

---

## 📚 查看完整文档

详细文档请查看：
- `NEW_COMPONENTS_CREATED_2026-03-05.md` - 完整组件列表和说明
- `/showcase/new-components` - 交互式演示页面

---

## 🔧 开发提示

### 组件位置
```
frontend/
├── components/
│   ├── ui/              # UI 组件
│   ├── effects/         # 特效组件
│   ├── blog/            # 博客组件
│   └── index-new-components.ts  # 统一导出
└── app/
    └── showcase/
        └── new-components/  # 演示页面
```

### 添加新组件
1. 在对应目录创建组件文件夹
2. 创建组件文件 `ComponentName.tsx`
3. 创建导出文件 `index.ts`
4. 在 `index-new-components.ts` 中添加导出

---

## ✨ 特性亮点

- ✅ **完整的 TypeScript 支持**
- ✅ **Framer Motion 动画**
- ✅ **Tailwind CSS 样式**
- ✅ **响应式设计**
- ✅ **可访问性支持**
- ✅ **赛博朋克风格**
- ✅ **无需外部依赖**

---

## 🎉 开始使用

现在您可以在项目中使用这些组件了！

1. 启动开发服务器：`npm run dev`
2. 访问演示页面：`http://localhost:3000/showcase/new-components`
3. 复制示例代码到您的页面
4. 根据需要自定义样式和行为

---

**祝您开发愉快！** 🚀

如有问题，请查看文档或提交 Issue。
