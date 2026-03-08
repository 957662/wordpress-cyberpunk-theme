# 新文件快速参考指南

## 📁 创建的文件清单

### 🗄️ 数据库
- `backend/docs/database-design.md` - 完整的数据库设计文档

### 🔧 后端模型
- `backend/app/models/comment.py` - 评论数据模型
- `backend/app/models/reaction.py` - 反应数据模型

### 🎨 前端组件
- `frontend/components/notifications/NotificationCenter.tsx` - 通知中心
- `frontend/components/theme/ThemeToggle.tsx` - 主题切换器
- `frontend/components/search/SearchEnhanced.tsx` - 增强搜索
- `frontend/components/loading/Skeleton.tsx` - 骨架屏加载

### 🪝 Hooks
- `frontend/hooks/useInfiniteScroll.ts` - 无限滚动

### 📚 工具函数
- `frontend/lib/utils-enhanced.ts` - 增强工具函数

## 🚀 快速开始

### 数据库初始化
```bash
# 进入数据库目录
cd backend/database

# 执行初始化脚本
psql -U postgres -d cyberpress -f init.sql
```

### 使用通知中心
```tsx
import { NotificationCenter } from '@/components/notifications'

function App() {
  const [notifications, setNotifications] = useState([])

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkAsRead={(id) => {/* 处理 */}}
      onDelete={(id) => {/* 处理 */}}
    />
  )
}
```

### 使用搜索组件
```tsx
import { SearchEnhanced } from '@/components/search'

function SearchBar() {
  const handleSearch = async (query: string) => {
    const res = await fetch(`/api/search?q=${query}`)
    return res.json()
  }

  return <SearchEnhanced onSearch={handleSearch} />
}
```

### 使用主题切换
```tsx
import { ThemeToggle } from '@/components/theme'

function Header() {
  return <ThemeToggle showLabel={false} />
}
```

### 使用骨架屏
```tsx
import { ArticleListSkeleton } from '@/components/loading'

function LoadingState() {
  return <ArticleListSkeleton count={5} />
}
```

### 使用无限滚动
```tsx
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

function PostList() {
  const { data, loading, observerTarget } = useInfiniteScroll({
    fetchData: async (page) => {
      const res = await fetch(`/api/posts?page=${page}`)
      return res.json()
    },
    pageSize: 10
  })

  return (
    <>
      {data.map(post => <PostCard key={post.id} {...post} />)}
      <div ref={observerTarget} />
    </>
  )
}
```

### 使用工具函数
```tsx
import {
  formatRelativeTime,
  formatNumber,
  debounce,
  cn
} from '@/lib/utils-enhanced'

// 格式化时间
const time = formatRelativeTime(new Date()) // "5分钟前"

// 格式化数字
const views = formatNumber(1500) // "1.5K"

// 防抖函数
const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300)

// 合并类名
const className = cn('base-class', { 'active': isActive })
```

## 📊 文件统计

| 类别 | 文件数 | 代码行数 |
|------|--------|----------|
| 数据库 | 1 | ~600 |
| 后端 | 2 | ~150 |
| 前端组件 | 4 | ~1,500 |
| Hooks | 1 | ~100 |
| 工具函数 | 1 | ~350 |
| **总计** | **8** | **~2,700** |

## 🎯 主要功能

### 通知中心
- ✅ 6 种通知类型
- ✅ 未读计数
- ✅ 批量操作
- ✅ 过滤功能
- ✅ 键盘导航

### 增强搜索
- ✅ 实时搜索
- ✅ 防抖优化
- ✅ 历史记录
- ✅ 热门推荐
- ✅ 键盘快捷键

### 主题切换
- ✅ 3 种主题
- ✅ 系统检测
- ✅ 持久化
- ✅ 平滑过渡

### 骨架屏
- ✅ 多种变体
- ✅ 动画效果
- ✅ 预设模板
- ✅ 自定义样式

### 无限滚动
- ✅ 自动加载
- ✅ 性能优化
- ✅ 错误处理
- ✅ 重置功能

## 🔗 相关文档

- [完整报告](./NEW_FILES_CREATED_REPORT.md)
- [数据库设计](./backend/docs/database-design.md)
- [开发任务](./DEVELOPMENT_TASKS.md)
- [项目结构](./PROJECT_STRUCTURE.md)

---

**更新时间**: 2026-03-08  
**版本**: 1.0.0
