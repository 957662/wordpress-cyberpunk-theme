# 贡献指南

感谢你有兴趣为 CyberPress 做出贡献！本文档将指导你如何参与项目开发。

## 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺尊重每个人，无论其经验水平、性别、性别认同和表达、性取向、残疾、个人外观、体型、种族、民族、年龄、宗教或国籍。

### 我们的标准

积极行为包括：
- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

不可接受的行为包括：
- 使用性化语言或图像
- 恶意攻击或侮辱性评论
- 骚扰
- 未经许可发布他人的私人信息
- 其他不专业或不适当的行为

## 如何贡献

### 报告 Bug

创建 Issue 时，请包含：
- Bug 的清晰描述
- 重现步骤
- 预期行为
- 实际行为
- 截图（如果适用）
- 环境信息（OS、浏览器、Node 版本等）
- 复现仓库（如果可能）

**Bug 报告模板：**

```markdown
## 问题描述
简要描述问题

## 复现步骤
1. 访问页面 '...'
2. 点击按钮 '....'
3. 滚动到 '....'
4. 看到错误

## 预期行为
应该发生什么

## 实际行为
实际发生了什么

## 截图
如果适用，添加截图

## 环境信息
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 18.17.0]
- Package Version: [e.g. 1.0.0]

## 附加信息
其他相关信息
```

### 提交功能请求

创建 Feature Request 时，请包含：
- 功能的清晰描述
- 为什么这个功能有用
- 使用示例
- 可能的实现方案

**功能请求模板：**

```markdown
## 功能描述
简要描述新功能

## 问题或需求
这个功能解决了什么问题？

## 期望的解决方案
你希望如何实现？

## 替代方案
考虑过其他解决方案吗？

## 附加信息
其他相关信息或示例
```

### 提交代码

#### 1. Fork 仓库

点击 GitHub 页面右上角的 Fork 按钮。

#### 2. 克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/cyberpress-platform.git
cd cyberpress-platform
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b bugfix/your-bugfix-name
```

#### 4. 进行更改

- 编写代码
- 添加测试
- 更新文档
- 确保通过所有检查

#### 5. 提交更改

```bash
git add .
git commit -m "feat: add new feature"
```

**Commit 消息规范：**

```
类型(范围): 简短描述

详细描述

关联 Issue
```

类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 添加测试
- `chore`: 构建/工具更新

示例：
```
feat(blog): add search functionality

- Implement search bar component
- Add search API integration
- Update blog page layout

Closes #123
```

#### 6. 推送到你的 Fork

```bash
git push origin feature/your-feature-name
```

#### 7. 创建 Pull Request

访问 GitHub 你的 Fork 页面，点击 "Compare & pull request"。

**PR 模板：**

```markdown
## 描述
简要描述此 PR 的内容

## 类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 文档更新

## 更改内容
- 更改 1
- 更改 2
- 更改 3

## 测试
描述如何测试这些更改

## 截图
如果适用，添加截图

## 检查清单
- [ ] 代码遵循项目风格指南
- [ ] 已进行自我审查
- [ ] 已添加注释（特别是难懂的部分）
- [ ] 已更新文档
- [ ] 没有新的警告
- [ ] 已添加/更新测试
- [ ] 所有测试通过
- [ ] CI/CD 通过

## 关联 Issue
Closes #(issue number)
```

### 代码审查

所有 PR 都需要经过代码审查。审查者会检查：
- 代码质量和风格
- 功能正确性
- 测试覆盖
- 文档完整性
- 是否遵循最佳实践

### 反馈和修改

如果需要修改：
1. 在你的分支上进行修改
2. 提交并推送
3. PR 会自动更新

## 开发规范

### TypeScript

- 使用 TypeScript 编写新代码
- 避免使用 `any`
- 为函数添加返回类型
- 使用接口定义对象结构

```typescript
// 好的做法
interface UserProps {
  name: string
  email: string
  age?: number
}

function UserCard({ name, email, age }: UserProps) {
  return <div>{name}</div>
}

// 避免
function UserCard(props: any) {
  return <div>{props.name}</div>
}
```

### React

- 使用函数组件和 Hooks
- 避免直接操作 DOM
- 使用 React.memo 优化性能
- 合理使用 useEffect

```typescript
// 好的做法
export function MyComponent({ id }: Props) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData(id).then(setData)
  }, [id])

  if (!data) return <Loading />

  return <div>{data}</div>
}

// 避免
export function MyComponent({ id }: Props) {
  const data = fetchData(id) // 直接调用，可能导致内存泄漏
  return <div>{data}</div>
}
```

### 样式

- 优先使用 Tailwind CSS 工具类
- 复杂组件使用 CSS Modules
- 避免内联样式（动态样式除外）

```tsx
// 好的做法
<div className="bg-cyber-dark border border-cyber-cyan p-4">
  Content
</div>

// 复杂组件
import styles from './MyComponent.module.css'
<div className={styles.container}>Content</div>

// 避免
<div style={{ backgroundColor: '#0a0a0f', border: '1px solid #00f0ff' }}>
  Content
</div>
```

### 文件命名

- 组件文件：PascalCase (`UserCard.tsx`)
- 工具文件：camelCase (`formatDate.ts`)
- 类型文件：camelCase (`userTypes.ts`)
- 样式文件：kebab-case (`user-card.module.css`)

## 测试

### 单元测试

为主要逻辑添加单元测试：

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-03-05')
    expect(formatDate(date)).toBe('2024年3月5日')
  })
})
```

### 组件测试

测试组件渲染和交互：

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 文档

### 代码注释

为复杂逻辑添加注释：

```typescript
/**
 * 格式化日期为指定地区的字符串
 * @param date - 要格式化的日期
 * @param locale - 地区代码，默认 'zh-CN'
 * @returns 格式化后的日期字符串
 *
 * @example
 * formatDate(new Date('2024-03-05'), 'zh-CN')
 * // 返回: '2024年3月5日'
 */
export function formatDate(date: Date, locale = 'zh-CN'): string {
  return date.toLocaleDateString(locale)
}
```

### README

更新 README 以反映新功能或更改。

### CHANGELOG

更新 CHANGELOG.md 记录重要更改。

## 社区

### 沟通渠道

- GitHub Issues: 报告问题和讨论
- GitHub Discussions: 一般讨论
- Discord: 实时聊天（如果有的话）

### 获取帮助

如果你需要帮助：
1. 搜索现有的 Issues
2. 查看 README 和文档
3. 在 GitHub Discussions 提问

### 保持更新

关注项目的：
- Releases 页面
- CHANGELOG.md
- GitHub Announcements

## 认可贡献者

所有贡献者都会在项目中得到认可：
- 贡献者列表
- Release Notes 中致谢

## 许可

提交代码即表示你同意你的贡献将按照项目的许可证进行许可。

## 联系

如有疑问：
- Email: dev@cyberpress.dev
- GitHub Issues: https://github.com/your-org/cyberpress-platform/issues

---

再次感谢你的贡献！🎉
