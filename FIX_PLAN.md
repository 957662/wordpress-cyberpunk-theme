# CyberPress 项目修复计划

## 错误统计（按优先级排序）

### 1. Card 组件导出问题（156 个错误）
- CardContent: 52
- CardTitle: 44
- CardHeader: 44
- CardDescription: 16

### 2. Notification 类型导出（54 个错误）
- NotificationType: 40
- NotificationStatus: 14

### 3. WordPress Client 导出（49 个错误）
- axiosInstance: 26
- wpClient: 15
- getWPClient: 8

### 4. Select 组件导出（26 个错误）
- SelectItem: 20
- SelectValue: 6

### 5. Performance 组件导出（30 个错误）
- createMetric: 18
- MetricCard: 12

### 6. Avatar 组件导出（40 个错误）
- CyberAvatar: 18
- AvatarFallback: 12
- AvatarImage: 10

### 7. Tabs 组件导出（32 个错误）
- TabsTrigger: 16
- TabsContent: 16

### 8. UI 按钮组件导出（40 个错误）
- ShareButton: 10
- PrintButton: 10
- FontSizeSelector: 10
- BookmarkButton: 10

### 9. Icon 组件导出（36 个错误）
- ArrowIcon: 10
- TagIcon: 9
- CalendarIcon: 9
- UserIcon: 8

### 10. Badge/Tooltip 组件导出（24 个错误）
- StatusBadge: 8
- CyberTooltip: 8
- CyberBadge: 8

## 修复顺序
1. Card 组件（最多错误）
2. WordPress Client
3. Notification 类型
4. Select 组件
5. Avatar 组件
6. Tabs 组件
7. Performance 组件
8. UI 按钮组件
9. Icon 组件
10. Badge/Tooltip 组件

## 验证步骤
修复完成后需要：
1. 运行 npm run build
2. 检查错误数量是否为 0
3. 每个板块检查 5 遍以上
