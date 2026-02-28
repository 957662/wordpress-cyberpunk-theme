# 🚀 5 分钟快速开始

> **阅读时间**: 5 分钟
> **难度**: ⭐ (零基础)
> **更新时间**: 2026-03-01
> **适用于**: WordPress 5.0+

---

## 🎯 你将学到

- ✅ 安装并激活 Cyberpunk Theme
- ✅ 完成基础配置
- ✅ 发布你的第一篇文章
- ✅ 预览赛博朋克风格的网站

---

## 📦 前提条件

在开始之前，请确保：

- [ ] 你有 WordPress 网站的管理员权限
- [ ] WordPress 版本 5.0 或更高
- [ ] PHP 版本 7.4 或更高
- [ ] 稳定的网络连接

> 💡 **不知道你的 WordPress 版本？**
> 登录后台，查看 **仪表盘 > 主页 > 概览**，在右下角可以看到当前版本。

---

## Step 1: 下载主题

### 🎯 方法 A: 从本仓库下载（推荐）

1. 访问项目仓库 [GitHub Releases](https://github.com/your-repo/wordpress-cyber-theme/releases)
2. 下载最新版本的 `cyberpunk-theme.zip` 文件
3. 保存到你的电脑

### 📦 方法 B: 直接复制文件

如果你是开发者：

```bash
git clone https://github.com/your-repo/wordpress-cyber-theme.git
cd wordpress-cyber-theme
zip -r cyberpunk-theme.zip . -x "*.git*" "*node_modules*" ".DS_Store"
```

> ⚠️ **注意**: 确保下载的是最新稳定版本（查看版本号，当前为 v1.0.0）

---

## Step 2: 安装主题

![安装主题界面](../assets/images/install-step-1.png)

### 通过 WordPress 后台上传（最简单）

1. 登录你的 WordPress 后台
   - 通常地址是 `https://yoursite.com/wp-admin`

2. 导航到 **外观 > 主题**

3. 点击顶部 **添加** 按钮

4. 点击 **上传主题** 按钮

5. **选择文件** - 选择刚才下载的 `cyberpunk-theme.zip`

6. 点击 **现在安装**

> 💡 **提示**: 安装过程可能需要 1-2 分钟，请耐心等待，不要关闭页面。

### 通过 FTP 安装（高级用户）

如果你更熟悉 FTP：

```bash
# 解压 ZIP 文件
unzip cyberpunk-theme.zip

# 上传到服务器
ftp> cd /wp-content/themes/
ftp> put -r cyberpunk-theme/
```

然后在 WordPress 后台 **外观 > 主题** 中激活它。

---

## Step 3: 激活主题

![激活主题界面](../assets/images/install-step-2.png)

1. 安装完成后，你会看到"主题安装成功"的消息

2. 点击 **激活** 链接

3. 主题会自动激活并运行首次设置

> ✅ **成功提示**: 你应该会看到"主题已激活"的消息，并且网站外观已经变成赛博朋克风格。

---

## Step 4: 基础配置（3分钟）

### 🎨 设置网站标题和标语

1. **外观 > 自定义**

2. 在左侧面板，点击 **站点身份**

3. 填写以下信息：
   - **网站标题**: 例如 "我的赛博空间"
   - **标语**: 例如 "探索未来的数字世界"

4. 点击顶部 **发布** 按钮

### 🖼️ 上传 Logo（可选但推荐）

1. 在同一个 **站点身份** 页面

2. 点击 **选择 Logo** 或 **站点图标**

3. 上传你的 Logo 图片
   - **推荐尺寸**: 400x100 像素
   - **格式**: PNG（支持透明背景）

4. 裁剪并调整图片

5. 点击 **裁剪并发布**

### 🎯 选择静态首页（推荐）

如果你想让 Portfolio 作为首页：

1. **页面 > 新建页面**
2. 标题填写"首页"
3. 在右侧选择页面模板（如果有）
4. **发布**

5. **设置 > 阅读**
6. **您的首页显示** 选择"一个静态页面"
7. **主页** 选择刚才创建的"首页"
8. **保存更改**

---

## Step 5: 发布第一篇文章

![发布文章界面](../assets/images/install-step-3.png)

### 创建文章

1. **文章 > 写文章**

2. 输入文章标题
   - 例如："我的第一篇赛博朋克文章"

3. 在编辑器中输入内容
   - 支持 Gutenberg 区块编辑器
   - 也支持经典编辑器

4. 在右侧边栏，设置：
   - **特色图片**: 点击"设置特色图片"上传
     - 推荐尺寸: 1200x675 像素
   - **分类**: 选择或创建分类
   - **标签**: 添加相关标签

5. 点击右上角 **发布** 按钮

> 🎉 **恭喜！** 你的第一篇文章已发布。点击"查看文章"预览效果。

---

## ✅ 完成！你已成功：

- [x] 下载了 Cyberpunk Theme
- [x] 安装了主题
- [x] 激活了主题
- [x] 完成了基础配置
- [x] 发布了第一篇文章

### 🌐 预览你的网站

点击顶部工具栏的"访问网站"或直接访问你的网址。你应该看到：

- 🌃 深色背景的赛博朋克风格
- 💜 霓虹青色和品红色的发光效果
- 📺 CRT 扫描线动画
- 📱 完美的响应式布局

---

## 🎓 下一步学习

现在你已经掌握了基础，建议继续学习：

### 📘 新手博主
- [主题定制器指南](./01-CONFIGURATION/theme-customizer.md) - 深度定制你的网站外观
- [博客文章指南](./02-FEATURES/blog-posts.md) - 学习如何写好博客文章

### 💼 小企业主
- [Portfolio 功能指南](./02-FEATURES/portfolio.md) - 展示你的作品集
- [小工具配置指南](./01-CONFIGURATION/widgets.md) - 设置侧边栏和页脚

### 🛠️ 开发者
- [定制指南](./03-CUSTOMIZATION/css-customization.md) - 深度定制 CSS
- [高级功能文档](./04-ADVANCED/rest-api.md) - REST API 和开发者接口
- [子主题开发](./03-CUSTOMIZATION/child-theme.md) - 安全地定制主题

---

## 💬 需要帮助？

### 📚 查找答案

- 📘 [完整文档目录](./INDEX.md) - 查看所有用户文档
- ❓ [常见问题解答](./07-FAQ.md) - 80% 的问题都有答案
- 🔧 [故障排除指南](./04-ADVANCED/troubleshooting.md) - 解决常见问题

### 🤝 获取支持

- 📧 **Email Support**: support@cyberpunk-theme.com
- 💬 **Community Forum**: [访问论坛](https://forum.cyberpunk-theme.com)
- 📺 **Video Tutorials**: [YouTube 频道](https://youtube.com/cyberpunk-theme)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-repo/wordpress-cyber-theme/issues)

---

## 🌟 支持我们

**喜欢这个主题吗？**

请给我们 ⭐⭐⭐⭐⭐ 评价：

- [WordPress.org 主题目录](https://wordpress.org/themes/cyberpunk/)
- [GitHub 仓库](https://github.com/your-repo/wordpress-cyber-theme)

你的支持是我们持续改进的动力！💜

---

## 📊 快速功能检查

安装完成后，检查以下功能是否正常：

| 功能 | 检查方法 | 状态 |
|------|----------|------|
| **主题激活** | 外观 > 主题，查看当前主题 | ⬜ |
| **样式加载** | 访问网站，查看是否是赛博朋克风格 | ⬜ |
| **菜单显示** | 查看顶部导航菜单是否正常 | ⬜ |
| **文章显示** | 查看单篇文章页面布局 | ⬜ |
| **响应式** | 调整浏览器窗口大小测试 | ⬜ |
| **小工具** | 外观 > 小工具，尝试添加小工具 | ⬜ |

如果任何功能有问题，请查看 [故障排除指南](./04-ADVANCED/troubleshooting.md)。

---

**准备好了吗？** 让你的赛博朋克之旅开始吧！🚀

---

*文档版本: 1.0.0 | 最后更新: 2026-03-01*
