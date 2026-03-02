# 新创建组件索引

## 创建时间
2026-03-03

## 组件清单

### 1. AI 助手组件
**文件路径**: `frontend/components/ai/AIAssistantChat.tsx`

**功能**:
- 实时 AI 对话界面
- 消息历史记录
- 代码高亮显示
- 消息复制功能
- 最小化/展开模式
- 加载动画效果

**主要特性**:
- 支持自定义 AI 响应函数
- 自动滚动到最新消息
- 消息时间戳显示
- 赛博朋克风格 UI
- 响应式设计

---

### 2. 数据可视化组件
**文件路径**: `frontend/components/analytics/DataVisualization.tsx`

**功能**:
- 多种图表类型 (柱状图、折线图、饼图、面积图)
- 迷你趋势图 (Sparkline)
- 指标卡片组件
- 动态数据展示

**包含组件**:
- `DataVisualization` - 主图表组件
- `Sparkline` - 迷你趋势图
- `MetricCard` - 指标卡片

**主要特性**:
- Canvas 渲染
- 动画效果
- 自定义主题
- 数据统计
- 响应式布局

---

### 3. 设置面板组件
**文件路径**: `frontend/components/settings/SettingsPanel.tsx`

**功能**:
- 多标签页设置界面
- 个人资料设置
- 账号安全设置
- 通知偏好设置
- 隐私控制
- 外观主题设置
- 第三方集成

**主要特性**:
- 标签页导航
- 实时保存
- 表单验证
- 开关/选择器
- 成功提示

---

### 4. 分页组件
**文件路径**: `frontend/components/common/Pagination.tsx`

**功能**:
- 完整分页导航
- 紧凑模式
- 极简模式
- 带信息显示的分页

**包含组件**:
- `Pagination` - 标准分页
- `PaginationWithInfo` - 带信息分页

**主要特性**:
- 智能页码显示
- 首页/末页跳转
- 上一页/下一页
- 省略号显示
- 键盘导航支持

---

### 5. 高级搜索组件
**文件路径**: `frontend/components/search-advanced/AdvancedSearch.tsx`

**功能**:
- 实时搜索建议
- 高级筛选面板
- 快捷搜索标签
- 搜索结果信息
- 排序选项

**包含组件**:
- `AdvancedSearch` - 主搜索组件
- `QuickSearchTags` - 快捷标签
- `SearchResultsInfo` - 结果信息

**主要特性**:
- 键盘快捷键
- 自动建议
- 筛选标签
- 防抖搜索
- 外部点击关闭

---

## 组件使用示例

### AIAssistantChat 使用
```tsx
import { AIAssistantChat } from '@/components/ai/AIAssistantChat';

<AIAssistantChat
  initialMessage="你好！我是 AI 助手"
  onMessageSend={async (message) => {
    const response = await fetchAIResponse(message);
    return response;
  }}
  context="blog"
/>
```

### DataVisualization 使用
```tsx
import { DataVisualization, MetricCard, Sparkline } from '@/components/analytics/DataVisualization';

const data = [
  { label: '一月', value: 100, color: '#00f0ff' },
  { label: '二月', value: 150, color: '#9d00ff' },
];

<DataVisualization
  title="月度访问量"
  data={data}
  type="bar"
  height={300}
/>

<Sparkline data={[10, 20, 15, 30, 25, 40]} color="#00f0ff" />

<MetricCard
  title="总访问量"
  value="10,234"
  change={12.5}
  icon={<Activity className="w-5 h-5" />}
/>
```

### SettingsPanel 使用
```tsx
import { SettingsPanel } from '@/components/settings/SettingsPanel';

<SettingsPanel
  defaultTab="profile"
  onSave={(tab, data) => {
    console.log('Saved', tab, data);
  }}
/>
```

### Pagination 使用
```tsx
import { Pagination, PaginationWithInfo } from '@/components/common/Pagination';

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>

<PaginationWithInfo
  currentPage={1}
  totalPages={10}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

### AdvancedSearch 使用
```tsx
import { AdvancedSearch, QuickSearchTags, SearchResultsInfo } from '@/components/search-advanced/AdvancedSearch';

<AdvancedSearch
  onSearch={(filters) => {
    console.log('Search', filters);
  }}
  suggestions={['React', 'Next.js', 'TypeScript']}
  filters={{
    types: ['文章', '视频'],
    categories: ['前端', '后端'],
    authors: ['张三', '李四']
  }}
/>

<QuickSearchTags
  tags={['React', 'Vue', 'Angular']}
  onSelect={(tag) => setSearchQuery(tag)}
/>
```

---

## 技术栈

- **框架**: React 18 + TypeScript
- **动画**: Framer Motion
- **图标**: Lucide React
- **样式**: Tailwind CSS
- **日期**: date-fns

---

## 设计特色

### 赛博朋克主题
- 深色背景
- 霓虹色彩 (青色、紫色、粉色)
- 发光边框效果
- 渐变背景

### 交互效果
- 平滑过渡动画
- 悬停反馈
- 点击缩放
- 加载状态
- 成功/错误提示

### 响应式设计
- 移动端适配
- 平板布局
- 桌面显示
- 触摸友好

---

## 目录结构

```
frontend/components/
├── ai/
│   └── AIAssistantChat.tsx
├── analytics/
│   └── DataVisualization.tsx
├── settings/
│   └── SettingsPanel.tsx
├── common/
│   └── Pagination.tsx
└── search-advanced/
    └── AdvancedSearch.tsx
```

---

## 下一步计划

1. 创建单元测试
2. 添加 Storybook 文档
3. 性能优化
4. 无障碍功能增强
5. 国际化支持

---

## 维护说明

所有组件都遵循以下原则:
- TypeScript 严格模式
- 可复用性优先
- 性能优化
- 良好的代码注释
- 清晰的 API 设计
