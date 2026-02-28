# 📦 安装指南

> **阅读时间**: 8 分钟
> **难度**: ⭐⭐ (初级)
> **更新时间**: 2026-03-01
> **适用于**: WordPress 5.0+, PHP 7.4+

---

## 📋 目录

- [系统要求](#系统要求)
- [安装方法](#安装方法)
  - [方法 A: WordPress 后台上传（推荐）](#方法-a-wordpress-后台上传推荐)
  - [方法 B: FTP 上传](#方法-b-ftp-上传)
  - [方法 C: WP-CLI 命令行](#方法-c-wp-cli-命令行)
- [安装前准备](#安装前准备)
- [安装后配置](#安装后配置)
- [常见安装问题](#常见安装问题)
- [卸载与重新安装](#卸载与重新安装)

---

## 🔧 系统要求

### 最低要求

| 组件 | 最低版本 | 推荐版本 | 检查方法 |
|------|----------|----------|----------|
| **WordPress** | 5.0 | 6.0+ | 仪表盘 > 概览 |
| **PHP** | 7.4 | 8.0+ | 外观 > 健康检查 |
| **MySQL** | 5.6 | 8.0+ | 联系主机商 |
| **内存** | 128MB | 256MB+ | 查看 phpinfo() |

### PHP 扩展要求

确保以下 PHP 扩展已启用：

```bash
# 必需扩展
- php-json
- php-mbstring
- php-gd (图像处理)
- php-curl (可选，用于某些功能)
```

### 检查你的环境

#### 方法 1: 使用 WordPress 健康检查

1. 登录 WordPress 后台
2. **工具 > 站点健康**
3. 查看所有状态是否为"良好"

#### 方法 2: 查看系统信息

安装 **"Health Check & Troubleshooting"** 插件：

1. 插件 > 安装插件
2. 搜索 "Health Check"
3. 安装并启用
4. 工具 > 站点健康 > 信息

---

## 🎯 安装前准备

### ✅ 安装前检查清单

#### 1. 备份你的网站（强烈推荐）

```bash
# 使用插件备份（推荐）
- UpdraftPlus
- BackupBuddy
- Duplicator

# 或手动备份
- 备份数据库
- 备份 wp-content 目录
- 备份 wp-config.php 文件
```

> ⚠️ **重要**: 如果网站已有内容，必须先备份！

#### 2. 清理旧主题（可选）

如果你正在更换主题：

1. **外观 > 主题**
2. 切换到默认主题（如 Twenty Twenty-Four）
3. （可选）删除旧主题

#### 3. 禁用缓存插件

安装期间禁用以下类型的插件：

```bash
- 缓存插件 (WP Super Cache, W3 Total Cache)
- 优化插件 (Autoptimize)
- CDN 插件
```

> 💡 **原因**: 缓存可能导致样式无法正确加载。

#### 4. 检查文件权限

确保以下目录可写：

```bash
/wp-content/themes/     # 755
/wp-content/uploads/    # 755
```

---

## 📥 安装方法

### 方法 A: WordPress 后台上传（推荐）

**适合**: 所有用户，最简单的方法

#### Step 1: 下载主题

```bash
# 从 GitHub Releases 下载
https://github.com/your-repo/wordpress-cyber-theme/releases

# 下载文件: cyberpunk-theme.zip
# 文件大小: 约 2MB
```

#### Step 2: 登录 WordPress

```
URL: https://yoursite.com/wp-admin
用户名: your_username
密码: your_password
```

#### Step 3: 上传主题

1. 导航到 **外观 > 主题**

2. 点击顶部 **添加** 按钮

3. 点击 **上传主题** 按钮

4. 点击 **选择文件**

5. 选择 `cyberpunk-theme.zip` 文件

6. 点击 **现在安装**

![上传主题截图](../assets/images/install-upload.png)

#### Step 4: 等待安装

```
安装进度:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100%

✓ 解压文件
✓ 复制文件
✓ 检查依赖
✓ 安装完成
```

> ⏱️ **预计时间**: 30秒 - 2分钟

#### Step 5: 激活主题

点击 **激活** 链接

或点击 **实时预览** 先预览效果

---

### 方法 B: FTP 上传

**适合**: 遇到上传限制，或熟悉 FTP 的用户

#### Step 1: 准备 FTP 客户端

推荐工具：

```bash
# Windows
- FileZilla (免费)
- WinSCP (免费)

# macOS
- FileZilla
- Transmit (付费)
- Cyberduck (免费)
```

#### Step 2: 获取 FTP 凭证

从你的主机商获取：

```bash
主机地址: ftp.yoursite.com
端口: 21 (通常)
用户名: your_ftp_username
密码: your_ftp_password
```

#### Step 3: 连接 FTP

以 FileZilla 为例：

1. 打开 FileZilla
2. 输入主机、用户名、密码、端口
3. 点击 **快速连接**

#### Step 4: 上传主题文件

```bash
# 本地路径
选择解压后的 cyberpunk-theme 文件夹

# 远程路径
导航到: /wp-content/themes/

# 上传
拖拽整个文件夹到远程 themes 目录
```

#### Step 5: 设置文件权限

```bash
# 右键点击上传的文件夹
> 文件权限
> 数值: 755
> 递归到子目录: 是
```

#### Step 6: 在 WordPress 激活

1. 登录 WordPress 后台
2. **外观 > 主题**
3. 找到 "Cyberpunk Theme"
4. 点击 **激活**

---

### 方法 C: WP-CLI 命令行

**适合**: 开发者，高级用户

#### 前置条件

已安装 WP-CLI：

```bash
wp --info
# 如果未安装，访问 wp-cli.org
```

#### 安装命令

```bash
# 下载主题
wget https://github.com/your-repo/wordpress-cyber-theme/releases/download/v1.0.0/cyberpunk-theme.zip

# 解压
unzip cyberpunk-theme.zip -d /path/to/wp-content/themes/

# 激活主题
wp theme activate cyberpunk-theme

# 验证安装
wp theme list
```

#### 批量安装（开发者工具箱）

```bash
# 创建快速安装脚本
#!/bin/bash
# install-cyberpunk.sh

THEME_URL="https://github.com/your-repo/wordpress-cyber-theme/releases/latest/download/cyberpunk-theme.zip"
THEME_DIR="/path/to/wp-content/themes/"

echo "🚀 开始安装 Cyberpunk Theme..."

# 下载
echo "📥 下载主题..."
wget -O cyberpunk.zip $THEME_URL

# 解压
echo "📦 解压文件..."
unzip -o cyberpunk.zip -d $THEME_DIR

# 清理
echo "🧹 清理临时文件..."
rm cyberpunk.zip

# 激活
echo "✅ 激活主题..."
wp theme activate cyberpunk-theme

echo "🎉 安装完成！"
```

---

## ⚙️ 安装后配置

### 🎯 首次设置向导

激活主题后，你会看到设置向导：

#### 步骤 1: 欢迎页面

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎉 感谢安装 Cyberpunk Theme!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[开始设置] [跳过向导]
```

#### 步骤 2: 基本信息

```yaml
网站标题: "我的赛博空间"
标语: "探索未来的数字世界"
Logo: 上传 (400x100px)
站点图标: 上传 (512x512px)
```

#### 步骤 3: 首页设置

```yaml
首页类型: [ ] 博客 [✓] Portfolio
每页显示: 10 个项目
布局: [ ] 网格 [✓] 列表
```

#### 步骤 4: 配色方案

```yaml
预设主题: [✓] 霓虹城市 [ ] 赛博日落 [ ] 矩阵绿色
主色调: #00f0ff (霓虹青)
强调色: #ff00ff (霓虹品红)
```

#### 步骤 5: 完成

```
✅ 设置完成！
你的赛博朋克网站已准备就绪。

[访问网站] [自定义设置]
```

### 🔧 重要设置检查

#### 1. 固定链接设置

**设置 > 固定链接**

选择一个友好的 URL 结构：

```
✓ 文章名
  https://yoursite.com/sample-post/

推荐用于 SEO
```

点击 **保存更改**。

#### 2. 菜单设置

**外观 > 菜单**

1. 创建主菜单
2. 添加页面/文章/分类
3. 分配菜单位置（主菜单、页脚菜单）

#### 3. 小工具设置

**外观 > 小工具**

添加小工具到：
- 主侧边栏
- 页脚区域 1、2、3

---

## ❓ 常见安装问题

### 🔴 问题 1: 上传失败

**症状**:
```
"上传的文件超过 php.ini 中定义的 upload_max_filesize"
```

**解决方案**:

#### 方法 A: 调整 PHP 配置

编辑 `.htaccess` 文件：

```apache
php_value upload_max_filesize 64M
php_value post_max_size 64M
php_value memory_limit 256M
```

#### 方法 B: 联系主机商

请主机商调整 PHP 上传限制。

#### 方法 C: 使用 FTP 安装

见上面的 [方法 B: FTP 上传](#方法-b-ftp-上传)

---

### 🔴 问题 2: 样式错乱

**症状**:
```
主题激活后，网站样式混乱，没有赛博朋克效果。
```

**解决方案**:

#### 1. 清除缓存

```bash
# 如果使用缓存插件
- 清除所有缓存
- 暂时禁用缓存插件

# 浏览器缓存
- Ctrl + Shift + R (Windows)
- Cmd + Shift + R (Mac)
```

#### 2. 检查文件完整性

```bash
# 确保 style.css 存在
/wp-content/themes/cyberpunk/style.css

# 检查文件权限
chmod 644 style.css
```

#### 3. 重新安装主题

```bash
# 删除现有主题
# 重新上传
# 重新激活
```

---

### 🔴 问题 3: 白屏（White Screen of Death）

**症状**:
```
激活主题后，网站显示空白页面。
```

**解决方案**:

#### 1. 启用调试模式

编辑 `wp-config.php`：

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

#### 2. 查看错误日志

```bash
# 错误日志位置
/wp-content/debug.log

# 或服务器错误日志
/error_log
```

#### 3. 常见原因

```bash
✓ 内存不足
  解决: 增加 memory_limit

✓ PHP 版本过低
  解决: 升级到 PHP 7.4+

✓ 插件冲突
  解决: 禁用所有插件，逐个启用排查
```

#### 4. 通过 FTP 切换主题

如果无法登录后台：

```bash
# 重命名主题文件夹
/wp-content/themes/cyberpunk/
→ /wp-content/themes/cyberpunk-backup/

# WordPress 会自动切换到默认主题
```

---

### 🔴 问题 4: 自定义文章类型不显示

**症状**:
```
Portfolio 菜单不显示，无法创建项目。
```

**解决方案**:

#### 1. 检查自定义文章类型是否注册

查看 **inc/custom-post-types.php** 是否被加载。

#### 2. 刷新固定链接

```bash
设置 > 固定链接 > [不做任何修改] > 保存更改
```

这会刷新 WordPress 的路由规则。

#### 3. 检查用户权限

确保当前用户有 **edit_posts** 权限。

---

### 🔴 问题 5: 图片上传失败

**症状**:
```
"上传时发生错误" 或 "HTTP 错误"
```

**解决方案**:

#### 1. 检查上传目录权限

```bash
chmod 755 /wp-content/uploads/
chown www-data:www-data /wp-content/uploads/
```

#### 2. 增加 PHP 内存限制

```php
// wp-config.php
define('WP_MEMORY_LIMIT', '256M');
```

#### 3. 调整图片尺寸限制

编辑 `.htaccess`：

```apache
php_value upload_max_filesize 32M
php_value post_max_size 32M
```

---

## 🗑️ 卸载与重新安装

### 完全卸载主题

#### Step 1: 切换主题

**外观 > 主题**

激活其他主题（如 Twenty Twenty-Four）

#### Step 2: 删除主题

在主题页面，点击主题详情，然后点击 **删除**

#### Step 3: 清理数据（可选）

```sql
-- 删除主题选项
DELETE FROM wp_options WHERE option_name LIKE 'cyberpunk_%';

-- 删除自定义文章类型数据
DELETE FROM wp_posts WHERE post_type = 'portfolio';
DELETE FROM wp_postmeta WHERE post_id IN (SELECT id FROM wp_posts WHERE post_type = 'portfolio');
```

> ⚠️ **警告**: 这会永久删除所有 Portfolio 项目！

### 重新安装

按照上述安装方法重新安装即可。

---

## ✅ 安装验证清单

完成安装后，检查以下项目：

### 基本功能

- [ ] 主题已激活
- [ ] 网站能正常访问
- [ ] 样式正确加载（赛博朋克风格）
- [ ] 导航菜单显示正常
- [ ] 文章页面显示正常
- [ ] 页面布局正确

### 主题功能

- [ ] Portfolio 菜单显示
- [ ] 可以创建 Portfolio 项目
- [ ] 小工具可以添加
- [ ] 自定义器正常工作
- [ ] 响应式布局正常
- [ ] 评论功能正常

### 性能检查

- [ ] 页面加载速度正常
- [ ] 控制台无错误（F12 查看）
- [ ] 图片正常加载
- [ ] 所有链接可点击

---

## 🎓 下一步

安装完成后，建议继续：

1. 📘 [主题定制器指南](./01-CONFIGURATION/theme-customizer.md) - 定制你的网站
2. 📗 [Portfolio 功能指南](./02-FEATURES/portfolio.md) - 创建作品集
3. 📙 [常见问题解答](./07-FAQ.md) - 查找答案

---

## 💬 需要帮助？

如果安装过程中遇到问题：

- 🔧 [故障排除指南](./04-ADVANCED/troubleshooting.md) - 详细的故障排除
- 🐛 [GitHub Issues](https://github.com/your-repo/wordpress-cyber-theme/issues) - 报告 Bug
- 💬 [社区论坛](https://forum.cyberpunk-theme.com) - 获取社区支持
- 📧 [Email Support](mailto:support@cyberpunk-theme.com) - 联系官方支持

---

**祝你安装顺利！🚀**

---

*文档版本: 1.0.0 | 最后更新: 2026-03-01*
