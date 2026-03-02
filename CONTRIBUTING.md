# 贡献指南

感谢你有兴趣为 CyberPress 项目做出贡献！

## 🤝 如何贡献

### 报告问题

如果你发现了 bug，请：

1. 检查是否已存在类似 issue
2. 使用 issue 模板创建新问题
3. 提供详细的复现步骤和环境信息

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/cyberpress-platform.git
   cd cyberpress-platform
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行更改**
   - 遵循代码规范
   - 添加必要的测试
   - 更新文档

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送到 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 描述你的更改
   - 引用相关的 issue
   - 等待代码审查

## 📝 提交信息规范

使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具变更

示例：
```
feat: add dark mode toggle
fix: resolve navigation bug on mobile
docs: update installation instructions
```

## 🎨 代码规范

### TypeScript

- 使用严格模式
- 为所有函数添加类型注解
- 避免使用 `any` 类型
- 使用接口定义数据结构

### React

- 优先使用函数组件
- 合理使用 Hooks
- 组件保持单一职责
- 避免过度嵌套

### 样式

- 优先使用 Tailwind CSS 工具类
- 复杂样式使用 CSS 模块
- 遵循 BEM 命名规范
- 响应式设计优先

## 🧪 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

## 📖 文档

更新文档时：

1. 保持简洁明了
2. 提供代码示例
3. 更新相关 API 文档
4. 添加变更日志

## 🚀 开发流程

1. 从 `main` 分支创建特性分支
2. 开发并测试你的功能
3. 确保所有测试通过
4. 更新文档
5. 提交 Pull Request 到 `main` 分支
6. 等待 CI/CD 检查通过
7. 请求代码审查

## 📋 PR 检查清单

- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] 提交信息清晰明了
- [ ] 没有引入新的警告

## 💬 讨论

对于重大功能或更改，建议先创建 Issue 进行讨论。

## 🎯 优先级

- **Critical**: 阻塞问题、安全漏洞
- **High**: 重要功能、主要 bug
- **Medium**: 功能增强、次要 bug
- **Low**: 文档更新、代码优化

## 📄 License

通过贡献，你同意你的代码将使用项目的 MIT 许可证。

---

再次感谢你的贡献！🙏
