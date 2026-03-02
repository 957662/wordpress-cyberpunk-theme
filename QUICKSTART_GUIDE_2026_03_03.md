# CyberPress 快速使用指南

## 🚀 快速开始

### 1. 环境准备

确保你已经安装了：
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Git

### 2. 克隆项目

```bash
git clone <repository-url>
cd cyberpress-platform
```

### 3. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写数据库配置等

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
uvicorn main:app --reload --port 8000
```

后端 API 文档：http://localhost:8000/api/docs

### 4. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 文件

# 启动开发服务器
npm run dev
```

前端访问：http://localhost:3000

## 📚 核心功能使用

### 用户认证

#### 登录
```typescript
import { cyberpressApi } from '@/lib/api';

const login = async () => {
  try {
    const result = await cyberpressApi.auth.login({
      username: 'admin',
      password: 'password123'
    });

    // result.access_token - 访问令牌
    // result.expires_in - 过期时间（秒）
  } catch (error) {
    console.error('登录失败', error);
  }
};
```

#### 注册
```typescript
const register = async () => {
  try {
    const user = await cyberpressApi.auth.register({
      username: 'newuser',
      email: 'user@example.com',
      password: 'SecurePassword123',
      full_name: 'John Doe'
    });
  } catch (error) {
    console.error('注册失败', error);
  }
};
```

#### 获取当前用户
```typescript
const getCurrentUser = async () => {
  try {
    const user = await cyberpressApi.auth.getCurrentUser();
    console.log(user);
  } catch (error) {
    console.error('获取用户信息失败', error);
  }
};
```

### 用户仪表板

#### 使用用户 Hook
```typescript
import { useUser } from '@/lib/services/user-enhanced';

function MyComponent() {
  const {
    user,
    stats,
    loading,
    updateProfile,
    changePassword,
    uploadAvatar
  } = useUser();

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h1>欢迎, {user?.full_name || user?.username}</h1>
      <p>文章数: {stats?.totalPosts}</p>
      <p>浏览量: {stats?.totalViews}</p>
    </div>
  );
}
```

#### 更新用户资料
```typescript
const handleUpdateProfile = async () => {
  try {
    await updateProfile({
      full_name: 'John Doe',
      bio: '全栈开发者',
      website_url: 'https://example.com'
    });
    alert('资料更新成功');
  } catch (error) {
    alert('更新失败');
  }
};
```

#### 上传头像
```typescript
const handleAvatarUpload = async (file: File) => {
  try {
    const avatarUrl = await uploadAvatar(file);
    console.log('头像上传成功:', avatarUrl);
  } catch (error) {
    alert('头像上传失败');
  }
};
```

### 文章管理

#### 创建文章
```typescript
import { cyberpressApi } from '@/lib/api';

const createPost = async () => {
  try {
    const post = await cyberpressApi.posts.create({
      title: '我的第一篇文章',
      content: '文章内容...',
      excerpt: '文章摘要',
      status: 'draft',
      category_id: 1,
      tags: [1, 2, 3]
    });
  } catch (error) {
    console.error('创建失败', error);
  }
};
```

#### 获取文章列表
```typescript
const getPosts = async () => {
  try {
    const result = await cyberpressApi.posts.list({
      page: 1,
      per_page: 10,
      status: 'published'
    });

    console.log(result.data);     // 文章列表
    console.log(result.meta);     // 分页信息
  } catch (error) {
    console.error('获取失败', error);
  }
};
```

#### 使用文章 Hook
```typescript
import { usePosts } from '@/lib/hooks/useApi';

function PostList() {
  const {
    data,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage
  } = usePosts(10); // 每页 10 篇

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>
          上一页
        </button>
        <span>第 {page} / {totalPages} 页</span>
        <button onClick={nextPage} disabled={page === totalPages}>
          下一页
        </button>
      </div>
    </div>
  );
}
```

### 评论系统

#### 获取文章评论
```typescript
const getComments = async (postId: number) => {
  try {
    const result = await cyberpressApi.comments.byPost(postId);
    const commentTree = cyberpressApi.comments.buildTree(result.data);
    return commentTree;
  } catch (error) {
    console.error('获取评论失败', error);
  }
};
```

#### 创建评论
```typescript
const createComment = async (postId: number) => {
  try {
    const comment = await cyberpressApi.comments.create({
      post_id: postId,
      content: '这是一条评论',
      author_name: '访客',
      author_email: 'visitor@example.com'
    });
  } catch (error) {
    console.error('评论失败', error);
  }
};
```

#### 使用评论组件
```typescript
import CommentSystem from '@/components/comments/CommentSystem';

function BlogPost({ post }) {
  const handleAddComment = async (content: string, parentId?: string) => {
    await cyberpressApi.comments.create({
      post_id: post.id,
      content,
      parent_id: parentId
    });
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <div>{post.content}</div>

      <CommentSystem
        postId={post.id}
        comments={post.comments}
        currentUser={currentUser}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
```

### 自定义 Hooks

#### 使用防抖 Hook
```typescript
import { useDebounce } from '@/lib/hooks/useApi';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // debouncedSearchTerm 延迟 500ms 更新
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

#### 使用本地存储 Hook
```typescript
import { useLocalStorage } from '@/lib/hooks/useApi';

function SettingsComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);

  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        切换主题
      </button>
      <input
        type="range"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
    </div>
  );
}
```

#### 使用在线状态 Hook
```typescript
import { useOnline } from '@/lib/hooks/useApi';

function StatusIndicator() {
  const isOnline = useOnline();

  return (
    <div>
      <span className={`status ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? '在线' : '离线'}
      </span>
    </div>
  );
}
```

### 管理后台

#### 使用管理布局
```typescript
import AdminLayout, {
  StatCard,
  PageHeader,
  Breadcrumb
} from '@/components/admin/AdminLayout';

function AdminPage() {
  return (
    <AdminLayout>
      <Breadcrumb
        items={[
          { title: '首页', href: '/admin' },
          { title: '文章管理', href: '/admin/posts' },
          { title: '编辑文章' }
        ]}
      />

      <PageHeader
        title="编辑文章"
        description="修改文章内容和设置"
        actions={
          <button>保存</button>
        }
      />

      {/* 页面内容 */}
    </AdminLayout>
  );
}
```

## 🎨 UI 组件使用

### 统计卡片
```typescript
import { StatCard } from '@/components/admin/AdminLayout';

<StatCard
  title="文章总数"
  value="156"
  change="+12%"
  icon={<FileText className="w-6 h-6" />}
  color="cyan"
/>
```

### 文章编辑器
```typescript
import BlogPostEditor from '@/components/blog/BlogPostEditor';

<BlogPostEditor postId={123} />
```

### 用户仪表板
```typescript
import UserDashboard from '@/components/user/UserDashboard';

<UserDashboard />
```

## 🔧 常见配置

### API 基础 URL
```typescript
// frontend/lib/api/client.ts
const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
);
```

### 环境变量
```bash
# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# backend/.env
DATABASE_URL=postgresql://user:password@localhost/cyberpress
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📝 开发建议

### 代码组织
- 将业务逻辑放在 `lib/services/` 目录
- 将可复用组件放在 `components/` 目录
- 使用 TypeScript 定义清晰的类型
- 遵循单一职责原则

### 性能优化
- 使用 `useMemo` 和 `useCallback` 优化渲染
- 实现虚拟滚动处理大列表
- 使用图片懒加载
- 启用代码分割

### 错误处理
- 始终使用 try-catch 包裹异步操作
- 提供用户友好的错误提示
- 记录错误日志便于调试

## 🐛 调试技巧

### 查看网络请求
打开浏览器开发者工具 > Network 标签页，查看所有 API 请求。

### 检查状态
使用 React Developer Tools 查看组件状态和 Props。

### 日志输出
```typescript
console.log('用户数据:', user);
console.error('错误:', error);
console.warn('警告:', warning);
```

## 📞 获取帮助

- 查看 API 文档：http://localhost:8000/api/docs
- 查看组件示例：`/examples` 路径
- 阅读源码注释

---

祝你使用愉快！🎉
