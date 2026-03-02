# 新创建文件结构

```
frontend/
├── lib/
│   ├── services/
│   │   ├── analytics/
│   │   │   ├── AnalyticsService.ts          (295 行) - 分析追踪服务
│   │   │   └── index.ts                     - 导出文件
│   │   ├── cache/
│   │   │   ├── CacheService.ts              (370 行) - 缓存管理服务
│   │   │   └── index.ts                     - 导出文件
│   │   └── notifications/
│   │       ├── NotificationService.ts       (352 行) - 通知服务
│   │       └── index.ts                     - 导出文件
│   ├── utils/
│   │   ├── print/
│   │   │   └── index.ts                     - 打印工具函数
│   │   └── validation/
│   │       └── index.ts                     - 验证工具函数
│   └── config/
│       └── app.ts                            - 应用配置文件
│
├── components/
│   ├── utility/
│   │   ├── PrintButton.tsx                  (162 行) - 打印组件
│   │   └── index.ts                         - 导出文件
│   ├── feedback/
│   │   ├── FeedbackWidget.tsx               (257 行) - 反馈小部件
│   │   └── index.ts                         - 导出文件
│   └── icons/
│       ├── UtilityIcons.tsx                 - 实用图标集合
│       └── index-enhanced.ts                - 增强导出
│
└── app/
    ├── api/
    │   ├── analytics/
    │   │   └── route.ts                     - 分析 API 路由
    │   └── feedback/
    │       └── route.ts                     - 反馈 API 路由
    └── examples/
        ├── utilities/
        │   └── print/
        │       └── page.tsx                 - 打印功能演示页面
        └── services/
            └── page.tsx                     - 服务使用演示页面
```

---

## 📊 统计信息

| 目录 | 文件数 | 代码行数 |
|------|--------|---------|
| lib/services/ | 6 | ~1,017 |
| lib/utils/ | 2 | ~400 |
| lib/config/ | 1 | ~200 |
| components/ | 6 | ~500 |
| app/api/ | 2 | ~150 |
| app/examples/ | 2 | ~300 |
| **总计** | **19** | **~2,567** |

---

## 🎯 核心功能说明

### 1. AnalyticsService (分析服务)
- **功能**: 追踪用户行为、页面访问、性能指标
- **特性**: 自动批量发送、性能监控、错误追踪
- **大小**: 295 行代码

### 2. CacheService (缓存服务)
- **功能**: 内存缓存 + localStorage 持久化
- **特性**: TTL 管理、标签系统、缓存统计
- **大小**: 370 行代码

### 3. NotificationService (通知服务)
- **功能**: 多类型通知、确认对话框、加载状态
- **特性**: Zustand 状态管理、自动消失、操作按钮
- **大小**: 352 行代码

### 4. PrintButton (打印组件)
- **功能**: 打印按钮、显示/隐藏控制、页眉页脚
- **特性**: 打印样式、回调函数、元素打印
- **大小**: 162 行代码

### 5. FeedbackWidget (反馈小部件)
- **功能**: 评分、分类、邮箱收集
- **特性**: 浮动按钮、确认对话框、表单验证
- **大小**: 257 行代码

---

## 📦 依赖关系

```
AnalyticsService
  └──> 无外部依赖

CacheService
  └──> 无外部依赖

NotificationService
  └──> zustand (状态管理)

PrintButton
  ├─> Button (UI组件)
  └─> Icons (图标)

FeedbackWidget
  ├─> Button (UI组件)
  ├─> Rating (评分组件)
  └─> Icons (图标)
```

---

## 🎨 设计模式

### 1. 单例模式 (Singleton)
所有服务类都使用单例模式确保全局唯一实例：

```typescript
class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }
}
```

### 2. Hook 模式
为每个服务提供 React Hook 方便使用：

```typescript
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    // ...
  };
}
```

### 3. 工厂模式
验证工具使用工厂模式创建验证器：

```typescript
export function createValidator(): Validator {
  return new Validator();
}
```

---

## 🔄 数据流

```
用户操作
   ↓
组件事件
   ↓
服务方法
   ↓
数据处理
   ↓
状态更新/API调用
   ↓
UI反馈
```

---

## 📝 文件说明

### 导出文件 (index.ts)
每个模块都提供导出文件，方便统一导入：

```typescript
// frontend/lib/services/analytics/index.ts
export { AnalyticsService, analytics, useAnalytics } from './AnalyticsService';
export type { AnalyticsEvent, PageView, PerformanceMetrics } from './AnalyticsService';
```

### 使用方式

```typescript
// 方式 1: 从服务导入
import { analytics } from '@/lib/services/analytics';

// 方式 2: 从 Hook 导入
import { useAnalytics } from '@/lib/services/analytics';

// 方式 3: 从主入口导入
import { analytics, useAnalytics } from '@/lib/services';
```

---

*生成于 2026-03-03*
