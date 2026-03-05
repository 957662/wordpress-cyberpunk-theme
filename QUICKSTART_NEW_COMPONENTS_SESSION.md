# 🚀 新组件快速开始指南

**CyberPress Platform - 2026-03-05 Session**

---

## 📦 新增内容概览

本次更新为 CyberPress Platform 添加了 **7 个生产就绪的组件和工具**,涵盖性能监控、通知系统、表单处理、数据分析和后端核心功能。

---

## 🎨 前端组件使用指南

### 1. 性能监控组件 (PerformanceMetrics)

#### 快速开始
```typescript
import { PerformanceMetrics } from '@/components/performance/PerformanceMetrics';

function Layout() {
  return (
    <>
      <YourContent />
      <PerformanceMetrics
        position="bottom-right"
        refreshInterval={5000}
        showDetails={false}
      />
    </>
  );
}
```

#### 配置选项
- `position`: 位置 (`top-left` | `top-right` | `bottom-left` | `bottom-right`)
- `refreshInterval`: 刷新间隔(毫秒)
- `showDetails`: 显示详细指标

#### 监控指标
- **FCP** (First Contentful Paint): 首次内容绘制
- **LCP** (Largest Contentful Paint): 最大内容绘制
- **CLS** (Cumulative Layout Shift): 累积布局偏移
- **FID** (First Input Delay): 首次输入延迟
- **TTFB** (Time to First Byte): 首字节时间

---

### 2. 通知管理系统 (NotificationManager)

#### 设置 Provider
```typescript
// app/layout.tsx
import { NotificationProvider } from '@/components/notifications/NotificationManager';

export default function RootLayout({ children }) {
  return (
    <NotificationProvider position="top-right">
      {children}
    </NotificationProvider>
  );
}
```

#### 使用通知
```typescript
import { useToast } from '@/components/notifications/NotificationManager';

function MyComponent() {
  const { success, error, info, warning, promise } = useToast();

  const handleSave = async () => {
    try {
      await api.save(data);
      success('保存成功!', '数据已保存到服务器');
    } catch (err) {
      error('保存失败', err.message);
    }
  };

  // 带操作的提示
  const handleConfirm = () => {
    const id = info('确认删除?', '此操作不可撤销');
    // 可以添加操作按钮
  };

  // Promise 包装
  const handleUpload = () => {
    promise(
      api.upload(file),
      {
        loading: '上传中...',
        success: '上传成功!',
        error: '上传失败'
      }
    );
  };

  return <button onClick={handleSave}>保存</button>;
}
```

#### 通知类型
- `success(title, message?)`: 成功提示
- `error(title, message?)`: 错误提示
- `info(title, message?)`: 信息提示
- `warning(title, message?)`: 警告提示
- `promise(promise, options)`: Promise 包装

---

### 3. 智能表单组件 (SmartForm)

#### 基础用法
```typescript
import { SmartForm } from '@/components/form/SmartForm';

const formConfig = {
  fields: [
    {
      name: 'username',
      type: 'text',
      label: '用户名',
      placeholder: '请输入用户名',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        custom: (value) => {
          if (value.includes('admin')) {
            return '用户名不能包含 admin';
          }
        }
      }
    },
    {
      name: 'email',
      type: 'email',
      label: '邮箱',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      name: 'role',
      type: 'select',
      label: '角色',
      options: [
        { label: '普通用户', value: 'user' },
        { label: '管理员', value: 'admin' }
      ],
      required: true
    },
    {
      name: 'bio',
      type: 'textarea',
      label: '个人简介',
      placeholder: '介绍一下自己...',
      validation: {
        maxLength: 500
      }
    },
    {
      name: 'agree',
      type: 'checkbox',
      label: '我同意服务条款',
      required: true
    }
  ],
  submitLabel: '注册',
  cancelLabel: '取消',
  onSubmit: async (data) => {
    await api.register(data);
    toast.success('注册成功!');
  },
  onCancel: () => {
    router.back();
  },
  layout: 'vertical',
  columns: 2
};

function RegisterPage() {
  return <SmartForm config={formConfig} />;
}
```

#### 支持的字段类型
- `text`: 文本输入
- `email`: 邮箱输入
- `password`: 密码输入
- `number`: 数字输入
- `textarea`: 多行文本
- `select`: 下拉选择
- `checkbox`: 复选框
- `radio`: 单选框
- `file`: 文件上传
- `date`: 日期选择
- `color`: 颜色选择
- `range`: 滑块

#### 验证规则
```typescript
validation: {
  pattern: RegExp,        // 正则表达式
  minLength: number,      // 最小长度
  maxLength: number,      // 最大长度
  min: number,           // 最小值
  max: number,           // 最大值
  custom: (value) => string | undefined  // 自定义验证
}
```

---

## 🛠️ 工具库使用指南

### 4. 集合操作工具 (collection-utils)

#### 数组工具
```typescript
import { ArrayUtils } from '@/lib/utils/collection-utils';

// 去重
const unique = ArrayUtils.unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]

// 分组
const grouped = ArrayUtils.groupBy(users, 'category');

// 分块
const chunks = ArrayUtils.chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// 打乱
const shuffled = ArrayUtils.shuffle([1, 2, 3, 4, 5]);

// 排序
const sorted = ArrayUtils.sortBy(users, 'name', 'age');

// 求和/平均值
const sum = ArrayUtils.sum([1, 2, 3, 4, 5]); // 15
const avg = ArrayUtils.average([1, 2, 3, 4, 5]); // 3

// 数组运算
const intersection = ArrayUtils.intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
const difference = ArrayUtils.difference([1, 2, 3], [2, 3, 4]); // [1]
const union = ArrayUtils.union([1, 2, 3], [2, 3, 4]); // [1, 2, 3, 4]
```

#### 对象工具
```typescript
import { ObjectUtils } from '@/lib/utils/collection-utils';

// 深拷贝
const cloned = ObjectUtils.deepClone(original);

// 深度合并
const merged = ObjectUtils.deepMerge(target, source);

// 获取嵌套值
const value = ObjectUtils.get(obj, 'user.profile.name');

// 设置嵌套值
ObjectUtils.set(obj, 'user.profile.name', 'John');

// 挑选字段
const picked = ObjectUtils.pick(obj, ['id', 'name', 'email']);

// 排除字段
const omitted = ObjectUtils.omit(obj, ['password', 'token']);
```

#### 树形结构
```typescript
import { TreeUtils } from '@/lib/utils/collection-utils';

// 列表转树
const tree = TreeUtils.listToTree(flatList, {
  idKey: 'id',
  parentIdKey: 'parentId',
  childrenKey: 'children'
});

// 查找节点
const node = TreeUtils.findNode(tree, (node) => node.id === 123);

// 遍历树
TreeUtils.traverse(tree, (node, depth) => {
  console.log(node.name, depth);
});
```

---

### 5. 用户行为追踪 (user-behavior-tracker)

#### 初始化
```typescript
import { initBehaviorTracking } from '@/lib/analytics/user-behavior-tracker';

// 在应用启动时初始化
useEffect(() => {
  const tracker = initBehaviorTracking({
    autoTrack: true,
    trackClicks: true,
    trackScroll: true,
    trackForms: true,
    trackErrors: true,
    sampleRate: 1,
    batchSize: 10,
    flushInterval: 30000,
    endpoint: '/api/analytics/events'
  });

  return () => tracker.destroy();
}, []);
```

#### 手动追踪
```typescript
import { getBehaviorTracker } from '@/lib/analytics/user-behavior-tracker';

const tracker = getBehaviorTracker();

// 追踪事件
tracker.track('button_click', 'interaction', 'signup_button');

// 追踪页面浏览
tracker.trackPageView('/dashboard', 'Dashboard');

// 追踪搜索
tracker.trackSearch('react hooks', 156);

// 追踪分享
tracker.trackShare('twitter', 'https://example.com/post/123');

// 追踪错误
try {
  await riskyOperation();
} catch (error) {
  tracker.trackError(error, { context: 'user_profile' });
}
```

---

### 6. A/B 测试系统 (ab-testing)

#### 初始化
```typescript
import { initABTesting } from '@/lib/analytics/ab-testing';

// 在应用启动时初始化
const abSystem = await initABTesting();
```

#### 创建测试
```typescript
import { getABTestingSystem } from '@/lib/analytics/ab-testing';

const abSystem = getABTestingSystem();

// 创建 A/B 测试
abSystem.createTest({
  id: 'cta_button_color',
  name: 'CTA 按钮颜色测试',
  description: '测试不同颜色的 CTA 按钮的转化率',
  variants: [
    {
      id: 'blue',
      name: '蓝色按钮',
      weight: 0.5,
      config: { color: '#0066cc', text: '立即购买' }
    },
    {
      id: 'green',
      name: '绿色按钮',
      weight: 0.5,
      config: { color: '#00cc66', text: '立即购买' }
    }
  ],
  status: 'running'
});
```

#### 使用测试
```typescript
import { useABTest } from '@/lib/analytics/ab-testing';

function BuyButton() {
  const variant = useABTest('cta_button_color');

  if (!variant) return null;

  const handleClick = () => {
    // 追踪转化
    abSystem.trackConversion('cta_button_color', variant.id, 99.99);
  };

  return (
    <button
      style={{ backgroundColor: variant.config.color }}
      onClick={handleClick}
    >
      {variant.config.text}
    </button>
  );
}
```

#### 查看结果
```typescript
// 获取测试结果
const results = abSystem.getTestResults('cta_button_color');

results.forEach(result => {
  console.log(`${result.variant.name}:`);
  console.log(`  展示次数: ${result.impressions}`);
  console.log(`  转化次数: ${result.conversions}`);
  console.log(`  转化率: ${(result.conversionRate * 100).toFixed(2)}%`);
  console.log(`  Z-Score: ${result.zScore?.toFixed(2)}`);
  console.log(`  P-Value: ${result.pValue?.toFixed(4)}`);
  console.log(`  是否获胜: ${result.winner ? '是' : '否'}`);
});
```

---

## 🔧 后端工具使用指南

### 7. SQL 查询构建器 (query_builder)

#### SELECT 查询
```python
from app.core.query_builder import query, JoinType

# 基础查询
sql, params = query('users')\
    .select('id', 'name', 'email')\
    .where('status = %s', 'active')\
    .order_asc('name')\
    .paginate(1, 20)\
    .build()

# 复杂查询
sql, params = query('posts p')\
    .select('p.*', 'u.name as author_name', 'COUNT(c.id) as comment_count')\
    .inner_join('users u', 'u.id = p.author_id')\
    .left_join('comments c', 'c.post_id = p.id')\
    .where('p.status = %s', 'published')\
    .where_in('p.category', ['tech', 'design'])\
    .where_between('p.created_at', '2024-01-01', '2024-12-31')\
    .group_by('p.id')\
    .having('comment_count > %s', 10)\
    .order_desc('p.created_at')\
    .limit(10)\
    .build()
```

#### INSERT 查询
```python
from app.core.query_builder import insert_into

sql, params = insert_into('users')\
    .set(name='John', email='john@example.com', age=30)\
    .on_duplicate_key_update('updated_at = NOW()')\
    .build()
```

#### UPDATE 查询
```python
from app.core.query_builder import update

sql, params = update('users')\
    .set(name='John Doe', email='john.doe@example.com')\
    .where('id = %s', 123)\
    .build()
```

#### DELETE 查询
```python
from app.core.query_builder import delete_from

sql, params = delete_from('users')\
    .where('status = %s', 'deleted')\
    .where('deleted_at < %s', '2024-01-01')\
    .build()
```

---

### 8. 缓存管理器 (cache_manager)

#### 基础使用
```python
from app.core.cache_manager import cache, cached

# 设置缓存
cache.set('user:123', user_data, ttl=3600)

# 获取缓存
user = cache.get('user:123')

# 删除缓存
cache.delete('user:123')

# 检查是否存在
if cache.exists('user:123'):
    print('缓存存在')

# 批量操作
cache.set_many({
    'user:1': user1_data,
    'user:2': user2_data,
    'user:3': user3_data
}, ttl=3600)

users = cache.get_many(['user:1', 'user:2', 'user:3'])
```

#### 函数缓存装饰器
```python
from app.core.cache_manager import cached

@cached(ttl=3600)
def get_user(user_id: int):
    return db.query(User).filter(User.id == user_id).first()

@cached(ttl=1800, key_prefix='posts')
def get_user_posts(user_id: int):
    return db.query(Post).filter(Post.author_id == user_id).all()
```

#### 计数器
```python
# 递增
page_views = cache.incr('page_views:123', delta=1)

# 递减
stock = cache.decr('product:456:stock', delta=1)
```

#### 统计信息
```python
stats = cache.stats()
print(f"命中率: {stats['hit_rate']}%")
print(f"总请求数: {stats['total_requests']}")
print(f"缓存命中: {stats['hits']}")
print(f"缓存未命中: {stats['misses']}")

# 重置统计
cache.reset_stats()
```

---

## 🎯 最佳实践

### 前端
1. **性能监控**: 在生产环境使用较低的采样率
2. **通知系统**: 避免过多通知,提供清晰的操作反馈
3. **表单验证**: 客户端验证 + 服务器验证双重保障
4. **A/B 测试**: 确保统计显著性后再做决策

### 后端
1. **查询构建**: 始终使用参数化查询防止 SQL 注入
2. **缓存策略**: 热数据使用缓存,设置合理的过期时间
3. **监控追踪**: 采样率根据流量调整
4. **测试隔离**: A/B 测试确保用户分组随机

---

## 📚 相关文档

- [完整功能列表](./CREATED_FILES_SUMMARY_2026-03-05_SESSION.md)
- [项目 README](./README.md)
- [开发指南](./DEVELOPER_QUICKSTART.md)

---

**祝开发愉快!** 🚀

如有问题,请查看项目文档或提交 Issue。
