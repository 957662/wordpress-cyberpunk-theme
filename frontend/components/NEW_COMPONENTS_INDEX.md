# 新创建的组件汇总

## 📦 新增组件列表

### 🎯 UI 组件 (/components/ui/)

1. **Tour.tsx** - 新手引导组件
   - 支持步骤式引导
   - 自动定位目标元素
   - 支持跳过和完成回调
   - 带进度条显示

2. **Captcha.tsx** - 验证码组件
   - 图形验证码（Canvas 绘制）
   - 滑块验证码
   - 支持自定义长度和颜色
   - 键盘快捷键支持

3. **Signature.tsx** - 电子签名板
   - Canvas 签名绘制
   - 画笔/橡皮擦工具
   - 多种颜色选择
   - 保存为 PNG 图片

4. **Mentions.tsx** - @提及输入组件
   - 实时用户搜索
   - 键盘导航
   - 支持自定义触发字符
   - 提及列表展示

5. **AdvancedTimeline.tsx** - 高级时间轴
   - 多种布局（垂直/水平/交替）
   - 支持状态图标
   - 趋势指示器
   - 统计数据展示
   - 过滤器组件

### 📊 Dashboard 组件 (/components/dashboard/)

6. **DashboardCard.tsx** - 仪表盘卡片
   - 数据展示
   - 趋势指示
   - 多种颜色主题
   - 悬停动画效果

### 📈 Charts 组件 (/components/charts/)

7. **ActivityChart.tsx** - 活动图表
   - 柱状图/折线图/面积图
   - 迷你图表（Sparkline）
   - SVG 绘制
   - 交互式数据点

### 🔔 Notifications 组件 (/components/notifications/)

8. **NotificationSystem.tsx** - 通知系统
   - 全局通知管理
   - 多种通知类型
   - 通知铃铛组件
   - Toast 容器
   - 自动消失和手动关闭

### 🎨 Theme 组件 (/components/theme/)

9. **ThemeSwitcher.tsx** - 主题切换器
   - 浅色/深色/跟随系统
   - 下拉菜单选择
   - 主题颜色选择器
   - 字体大小选择器

### 🪝 Custom Hooks (/hooks/)

10. **useDebounce.ts** - 防抖 Hook
11. **useLocalStorage.ts** - 本地存储 Hook
12. **useClickOutside.ts** - 点击外部 Hook
13. **useScrollLock.ts** - 滚动锁定 Hook
14. **useMediaQuery.ts** - 媒体查询 Hook

### 🛠️ 工具函数 (/lib/)

15. **utils-enhanced.ts** - 增强工具函数库
    - 日期格式化
    - 时间格式化
    - 相对时间
    - 数字/货币格式化
    - 文件大小格式化
    - 防抖/节流函数
    - 深拷贝
    - 数组操作
    - 颜色工具
    - URL 工具
    - 验证函数

### 🌐 API 服务 (/services/)

16. **api.ts** - API 服务封装
    - Axios 实例配置
    - 请求/响应拦截器
    - 自动 token 管理
    - 错误处理
    - 文件上传/下载
    - 完整的 API 服务类

## 📝 使用示例

### Tour 组件示例

\`\`\`tsx
import { TourProvider, useTour } from '@/components/ui/Tour';

const tourSteps = [
  {
    target: '#header',
    title: '欢迎',
    description: '这是导航栏'
  },
  {
    target: '#content',
    title: '内容区',
    description: '这里是主要内容'
  }
];

function App() {
  return (
    <TourProvider steps={tourSteps} onComplete={() => console.log('Tour completed')}>
      <YourComponent />
    </TourProvider>
  );
}
\`\`\`

### 通知系统示例

\`\`\`tsx
import { notify, NotificationSystem } from '@/components/notifications/NotificationSystem';

// 显示成功通知
notify.success('操作成功', '您的更改已保存');

// 显示错误通知
notify.error('操作失败', '请稍后重试');

// 在应用中添加通知系统
<NotificationSystem position="top-right" />
\`\`\`

### API 服务示例

\`\`\`tsx
import { apiService } from '@/services/api';

// 获取文章列表
const articles = await apiService.getArticles({ page: 1, pageSize: 10 });

// 创建文章
await apiService.createArticle({ title: '标题', content: '内容' });

// 上传图片
await apiService.uploadImage(file, (progress) => {
  console.log('上传进度:', progress);
});
\`\`\`

## 🎯 特性

- ✅ 完全 TypeScript 类型化
- ✅ 响应式设计
- ✅ 流畅的动画效果
- ✅ 可访问性支持
- ✅ 性能优化
- ✅ 代码分割
- ✅ 完整的错误处理

## 📦 依赖

所有组件都基于以下依赖：
- React 18+
- Next.js 14+
- TypeScript 5+
- Framer Motion (动画)
- Lucide React (图标)
- Tailwind CSS (样式)
- Axios (HTTP 客户端)

## 🚀 快速开始

1. 导入需要的组件
2. 按需配置属性
3. 在页面中使用

所有组件都是独立的，可以单独使用，也可以组合使用。
