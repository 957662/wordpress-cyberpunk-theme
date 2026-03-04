# CyberPress Platform 测试指南

> 📅 更新日期: 2026-03-05
> 🎯 测试覆盖率目标: 80%+

---

## 📊 测试概览

CyberPress Platform 使用多层测试策略确保代码质量和功能稳定性。

### 测试金字塔

```
        E2E Tests (5%)
       ┌──────────────┐
      │              │
     │   Integration (15%)  │
    │                      │
   │   Unit Tests (80%)     │
  └──────────────────────┘
```

---

## 🧪 单元测试

### 前端单元测试

**测试框架**: Jest + React Testing Library

**覆盖范围**:
- ✅ UI 组件 (272+ 组件)
- ✅ 自定义 Hooks (40+)
- ✅ 工具函数
- ✅ 验证器
- ✅ 服务层

**运行测试**:

```bash
# 运行所有测试
npm test

# 运行特定文件
npm test -- Button.test.tsx

# 监听模式
npm test -- --watch

# 生成覆盖率报告
npm test -- --coverage

# 更新快照
npm test -- -u
```

**测试文件结构**:

```
frontend/
├── __tests__/
│   ├── unit/
│   │   ├── components/      # 组件测试
│   │   ├── effects/         # 特效测试
│   │   ├── hooks/           # Hooks 测试
│   │   └── lib/             # 工具函数测试
│   └── integration/         # 集成测试
└── jest.config.js
```

**示例测试**:

```typescript
// Button.test.tsx
describe('Button 组件', () => {
  it('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })

  it('应该处理点击事件', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>点击</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

### 后端单元测试

**测试框架**: pytest

**覆盖范围**:
- ✅ API 端点
- ✅ 数据模型
- ✅ 服务层
- ✅ 业务逻辑
- ✅ 数据验证

**运行测试**:

```bash
# 运行所有测试
pytest

# 运行特定文件
pytest tests/test_auth_system.py

# 运行特定测试
pytest tests/test_auth_system.py::test_register_user

# 生成覆盖率报告
pytest --cov=app --cov-report=html

# 详细输出
pytest -v

# 显示打印输出
pytest -s
```

**测试文件结构**:

```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py           # pytest fixtures
│   ├── test_api.py           # API 测试
│   ├── test_auth_system.py   # 认证测试
│   └── test_follow_system.py # 社交功能测试
└── pytest.ini
```

**示例测试**:

```python
# test_auth_system.py
def test_register_user(client: TestClient, db: Session):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "SecurePass123!",
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data
```

---

## 🔗 集成测试

### 前端集成测试

**测试框架**: React Testing Library + MSW (Mock Service Worker)

**测试场景**:
- ✅ 博客流程（列表、详情、编辑、删除）
- ✅ 用户认证流程（登录、注册、登出）
- ✅ 社交功能流程（关注、点赞、收藏）
- ✅ 评论系统流程
- ✅ 搜索流程

**运行测试**:

```bash
# 运行集成测试
npm test -- integration

# 运行特定集成测试
npm test -- blog-flow.integration.test.ts
```

**示例集成测试**:

```typescript
describe('博客流程集成测试', () => {
  it('应该成功加载博客列表', async () => {
    const mockPosts = [
      { id: 1, title: '文章1', slug: 'post-1' }
    ]

    (BlogService.getPosts as jest.Mock).mockResolvedValue(mockPosts)

    renderWithProviders(<BlogList />)

    await waitFor(() => {
      expect(screen.getByText('文章1')).toBeInTheDocument()
    })
  })
})
```

---

## 🎭 E2E 测试

### 端到端测试

**测试框架**: Playwright

**测试场景**:
- ✅ 完整用户流程
- ✅ 跨浏览器测试
- ✅ 移动端测试
- ✅ 性能测试
- ✅ 可访问性测试

**运行测试**:

```bash
# 安装 Playwright
npx playwright install

# 运行所有 E2E 测试
npm run test:e2e

# 运行特定测试文件
npx playwright test blog.spec.ts

# 运行特定浏览器
npx playwright test --project=chromium

# 调试模式
npx playwright test --debug

# 查看 HTML 报告
npx playwright show-report
```

**测试文件结构**:

```
frontend/
├── playwright/
│   ├── auth.spec.ts          # 认证流程
│   ├── blog.spec.ts          # 博客流程
│   ├── social.spec.ts        # 社交功能
│   ├── admin.spec.ts         # 管理后台
│   ├── global-setup.ts       # 全局设置
│   ├── global-teardown.ts    # 全局清理
│   └── .auth/
│       └── user.json         # 认证状态
└── playwright.config.ts
```

**示例 E2E 测试**:

```typescript
test('应该创建新文章', async ({ page }) => {
  await login(page)
  await page.goto('/admin/posts/new')

  await page.fill('input[name="title"]', '测试文章')
  await page.fill('textarea[name="content"]', '文章内容')
  await page.click('button:has-text("发布")')

  await expect(page.locator('h1')).toContainText('测试文章')
})
```

---

## 📈 测试覆盖率

### 当前覆盖率

```
总体覆盖率: ████████████████░░ 70%

前端单元:   ████████████████░░ 72%
├── 组件:    ██████████████████ 85%
├── Hooks:   ████████████████░░ 75%
└── 工具:    ██████████████████ 90%

后端单元:   ████████████████░░ 68%
├── API:     ███████████████░░░ 65%
├── 模型:    ████████████████░░ 70%
└── 服务:    ████████████████░░ 72%

集成测试:   ██████░░░░░░░░░░░░░░ 40%
E2E测试:    ███░░░░░░░░░░░░░░░░░ 20%
```

### 目标覆盖率

```
总体目标: ████████████████████ 80%

前端单元: ████████████████████ 85%
后端单元: ████████████████████ 80%
集成测试: ████████████░░░░░░░░░ 60%
E2E测试:   ██████░░░░░░░░░░░░░░ 40%
```

---

## 🔧 测试配置

### Jest 配置 (frontend/jest.config.js)

```javascript
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### Pytest 配置 (backend/pytest.ini)

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --tb=short
    --cov=app
    --cov-report=html
    --cov-report=term-missing
```

### Playwright 配置 (frontend/playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './playwright',
  timeout: 30000,
  fullyParallel: true,
  reporter: ['html', 'json'],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
```

---

## 📝 测试最佳实践

### 1. 测试命名

- ✅ 使用描述性名称
- ✅ 遵循 `应该...` 格式
- ✅ 包含测试场景

```typescript
// 好的命名
it('应该在用户点击按钮时显示模态框')
it('应该在登录失败时显示错误消息')

// 不好的命名
it('test button')
it('works')
```

### 2. 测试结构

使用 AAA 模式 (Arrange-Act-Assert):

```typescript
it('应该更新用户资料', async () => {
  // Arrange - 准备测试数据
  const mockUser = { id: 1, name: 'Test User' }
  render(<Profile user={mockUser} />)

  // Act - 执行操作
  fireEvent.change(screen.getByLabelText('姓名'), {
    target: { value: 'New Name' }
  })
  fireEvent.click(screen.getByRole('button', { name: '保存' }))

  // Assert - 验证结果
  await waitFor(() => {
    expect(screen.getByText('保存成功')).toBeInTheDocument()
  })
})
```

### 3. 测试隔离

- ✅ 每个测试独立运行
- ✅ 不依赖测试执行顺序
- ✅ 清理副作用

```typescript
afterEach(() => {
  cleanup() // 清理组件
  jest.clearAllMocks() // 清理 mock
  localStorage.clear() // 清理存储
})
```

### 4. Mock 使用

- ✅ 只 mock 外部依赖
- ✅ 保持 mock 简单
- ✅ 验证 mock 调用

```typescript
jest.mock('@/services/api', () => ({
  getUser: jest.fn(() => Promise.resolve({ id: 1, name: 'Test' }))
}))
```

### 5. 异步测试

- ✅ 使用 async/await
- ✅ 等待元素出现
- ✅ 设置合理超时

```typescript
it('应该异步加载数据', async () => {
  render(<UserProfile userId={1} />)

  await waitFor(() => {
    expect(screen.getByText('加载完成')).toBeInTheDocument()
  }, { timeout: 5000 })
})
```

---

## 🚀 CI/CD 集成

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: pip install -r requirements.txt
      - run: pytest --cov=app

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: npx playwright test
```

---

## 📊 测试报告

### 查看报告

**前端覆盖率**:
```bash
npm test -- --coverage
open coverage/index.html
```

**后端覆盖率**:
```bash
pytest --cov=app --cov-report=html
open htmlcov/index.html
```

**E2E 报告**:
```bash
npx playwright test
npx playwright show-report
```

---

## 🎯 测试目标

### 短期目标 (1-2周)
- ⏳ 单元测试覆盖率达到 80%
- ⏳ 完成核心流程集成测试
- ⏳ 添加 E2E 测试基础场景

### 中期目标 (1个月)
- ⏳ 集成测试覆盖率达到 60%
- ⏳ E2E 测试覆盖率达到 40%
- ⏳ 性能测试基准建立

### 长期目标 (3个月)
- ⏳ 整体覆盖率达到 85%+
- ⏳ 完整的回归测试套件
- ⏳ 自动化测试完全集成到 CI/CD

---

## 🔗 相关资源

- [Jest 文档](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Pytest 文档](https://docs.pytest.org/)
- [Playwright 文档](https://playwright.dev/)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-05
**维护者**: AI Development Team
