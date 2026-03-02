# 新创建的组件和工具

本文档列出了本次开发会话中创建的所有新组件和工具函数。

## 📦 UI 组件

### 1. DataGrid (数据表格)
**文件**: `components/ui/DataGrid.tsx`

功能：
- 支持排序、筛选、分页
- 搜索功能
- 自定义列渲染
- 响应式设计
- 动画效果

### 2. Stepper (步骤条)
**文件**: `components/ui/Stepper.tsx`

功能：
- 水平/垂直布局
- 可点击步骤
- 步骤内容展示
- 步骤导航
- 脉冲动画效果

### 3. ProgressBar (进度条)
**文件**: `components/ui/ProgressBar.tsx`

功能：
- 线性进度条（支持条纹、渐变）
- 圆形进度条
- 步骤进度条
- 动画效果
- 多种颜色变体

### 4. Tabs (标签页)
**文件**: `components/ui/Tabs.tsx`

功能：
- 4种样式变体（line, enclosed, soft-rounded, solid-rounded）
- 垂直标签页
- 图标支持
- 禁用状态
- 动画过渡

### 5. Tooltip (提示框)
**文件**: `components/ui/Tooltip.tsx`

功能：
- 4个方向（上下左右）
- 5种颜色变体
- 3种尺寸
- 箭头指示
- 延迟显示

### 6. EmptyState (空状态)
**文件**: `components/ui/EmptyState.tsx`

功能：
- 空状态展示
- 加载状态
- 错误状态
- 操作按钮
- 图标支持

### 7. Drawer (抽屉)
**文件**: `components/ui/Drawer.tsx`

功能：
- 4个位置（上下左右）
- 5种尺寸
- 背景遮罩
- ESC键关闭
- 阻止背景滚动
- 头部/内容/底部区域

## 🪝 自定义 Hooks

### 1. useDebounce
**文件**: `hooks/useDebounce.ts`

功能：
- 防抖处理值
- 防抖回调函数

### 2. useIntersection
**文件**: `hooks/useIntersection.ts`

功能：
- 监听元素进入视口
- 无限滚动支持
- 可配置阈值

### 3. useLocalStorage
**文件**: `hooks/useLocalStorage.ts`

功能：
- LocalStorage 同步
- SessionStorage 同步
- 自动序列化/反序列化
- 跨标签页同步

### 4. useClickOutside
**文件**: `hooks/useClickOutside.ts`

功能：
- 点击外部检测
- ESC键监听
- 多元素支持

### 5. useMediaQuery
**文件**: `hooks/useMediaQuery.ts`

功能：
- 媒体查询监听
- 预设断点 hooks：
  - useIsMobile
  - useIsTablet
  - useIsDesktop
  - usePrefersDarkMode
  - usePrefersReducedMotion

## 🛠️ 工具函数

### 1. 数组工具 (lib/utils/array.ts)
- unique - 数组去重
- uniqueBy - 按键去重
- groupBy - 数组分组
- chunk - 数组分块
- shuffle - 数组打乱
- sortBy - 数组排序
- sum/average/max/min - 数学运算
- difference/intersection/union - 集合操作
- partition - 数组分隔
- flatten/flatMap - 数组展平

### 2. 对象工具 (lib/utils/object.ts)
- deepClone - 深度克隆
- deepMerge - 深度合并
- get/unset - 嵌套属性操作
- paths - 获取所有路径
- mapKeys/mapValues - 键值转换
- pick/omit - 对象过滤
- isEmpty/isEqual - 对象检查

### 3. 日期工具 (lib/utils/date.ts)
- formatDate - 格式化日期
- relativeTime - 相对时间
- daysBetween - 日期差
- isToday/isThisWeek/isThisMonth - 日期检查
- getDateRange - 日期范围
- addTime - 时间加减
- formatTime - 时间格式化
- timestamp - 时间戳

### 4. 字符串工具 (lib/utils/string.ts)
- randomString/uuid - 随机字符串
- kebabCase/camelCase/snakeCase/pascalCase - 大小写转换
- truncate - 截断文本
- highlight - 高亮文本
- stripHtml/escapeHtml - HTML处理
- countWords/readingTime - 文本统计
- isValidUrl/isValidEmail/isValidPhone - 验证
- formatPhone/mask - 格式化
- slugify - 生成slug
- similarity - 相似度计算

## 🎨 服务类

### 1. NotificationService
**文件**: `lib/services/NotificationService.ts`

功能：
- 通知管理
- 4种类型（success, error, warning, info）
- 自动消失
- 操作按钮
- Zustand 状态管理

### 2. ModalService
**文件**: `lib/services/ModalService.ts`

功能：
- 模态框管理
- 堆栈支持
- 多种尺寸
- 关闭选项

### 3. AnalyticsService
**文件**: `lib/services/AnalyticsService.ts`

功能：
- 页面浏览跟踪
- 事件跟踪
- 用户属性
- 错误跟踪
- 性能指标
- 事件队列

## 📄 演示页面

### 组件演示
**文件**: `app/components-demo/page.tsx`

包含所有新组件的交互式演示，展示：
- DataGrid 数据表格
- Stepper 步骤条
- ProgressBar 进度条
- Tabs 标签页
- Tooltip 提示框
- EmptyState 状态组件
- Drawer 抽屉

## 📦 组件索引

### UI组件导出
**文件**: `components/ui/index.ts`

统一导出所有UI组件，方便导入使用。

## 🎯 使用示例

```typescript
// 导入组件
import { DataGrid, Stepper, ProgressBar } from '@/components/ui';

// 导入 hooks
import { useDebounce, useLocalStorage } from '@/hooks';

// 导入工具函数
import { formatDate, randomString } from '@/lib/utils';

// 导入服务
import { analytics, notification } from '@/lib/services';
```

## ✨ 特性

1. **TypeScript 支持**: 所有组件和函数都有完整的类型定义
2. **赛博朋克风格**: 采用项目的视觉设计语言
3. **动画效果**: 使用 Framer Motion 实现流畅动画
4. **响应式设计**: 适配各种屏幕尺寸
5. **可访问性**: 遵循 ARIA 标准
6. **性能优化**: 使用 React hooks 和 memo 优化性能

## 📝 注意事项

1. 所有组件都是客户端组件（'use client'）
2. 使用 Tailwind CSS 进行样式设计
3. 依赖项目中已有的颜色主题（cyber-cyan, cyber-purple 等）
4. 所有组件支持自定义 className

## 🚀 下一步

可以继续扩展：
- 更多 UI 组件（Timeline, Rating, Transfer 等）
- 表单验证 hooks
- 数据可视化组件
- 更多工具函数
- 单元测试

## 📊 统计

- **UI 组件**: 7 个
- **自定义 Hooks**: 5 个（包含多个子 hooks）
- **工具函数**: 60+ 个
- **服务类**: 3 个
- **演示页面**: 1 个

总计约 **75+** 个新的功能模块！
