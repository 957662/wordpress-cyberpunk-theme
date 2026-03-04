# 测试文档

> 📅 最后更新: 2026-03-05
> 🎯 测试覆盖率目标: 80%+

## 📊 测试概览

CyberPress Platform 使用多层测试策略确保代码质量和功能稳定性。

```
        E2E Tests (5%)
       ┌──────────────┐
      │              │
     │   Integration (15%)  │
    │                      │
   │   Unit Tests (80%)     │
  └──────────────────────┘
```

## 🧪 测试类型

### 1. 单元测试 (Unit Tests)

测试单个函数、组件或类的功能。

**运行单元测试:**
```bash
npm test
npm test -- --watch
npm test -- --coverage
```

**测试文件结构:**
```
__tests__/
├── unit/
│   ├── components/      # 组件测试
│   ├── effects/         # 特效测试
│   ├── hooks/           # Hooks 测试
│   └── lib/             # 工具函数测试
```

**示例:**
```typescript
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

### 2. 集成测试 (Integration Tests)

测试多个组件或模块之间的交互。

**运行集成测试:**
```bash
npm test -- --testPathPattern=integration
```

**测试文件结构:**
```
__tests__/
└── integration/
    ├── blog-flow.integration.test.ts
    ├── auth-flow.integration.test.ts
    ├── api.integration.test.ts
    ├── social-flow.integration.test.ts
    └── search-flow.integration.test.ts
```

**示例:**
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

### 3. E2E 测试 (End-to-End Tests)

测试完整的用户流程，使用真实浏览器。

**运行 E2E 测试:**
```bash
# 安装浏览器
npx playwright install

# 运行所有测试
npx playwright test

# 运行特定测试
npx playwright test blog.spec.ts

# 调试模式
npx playwright test --debug

# 查看报告
npx playwright show-report
```

**测试文件结构:**
```
e2e/
├── auth.e2e.ts          # 认证流程
├── blog.e2e.ts          # 博客流程
├── social.e2e.ts        # 社交功能
└── admin.e2e.ts         # 管理后台
```

**示例:**
```typescript
test('应该完成登录流程', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('http://localhost:3000')
})
```

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

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行所有测试

```bash
# 前端测试
npm test

# 后端测试
cd ../backend
pytest

# E2E 测试
npx playwright test
```

### 使用测试脚本

```bash
# 运行所有测试
./run-tests.sh

# 运行单元测试
./run-tests.sh -u

# 运行集成测试
./run-tests.sh -i

# 运行 E2E 测试
./run-tests.sh -e

# 运行后端测试
./run-tests.sh -b

# 生成覆盖率报告
./run-tests.sh -c

# 打开测试报告
./run-tests.sh -r
```

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

## 🔧 测试配置

### Jest 配置

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
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

### Playwright 配置

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
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

## 📚 资源链接

- [Jest 文档](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright 文档](https://playwright.dev/)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-05
**维护者**: AI Development Team
