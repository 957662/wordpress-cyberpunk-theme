# 🎨 Portfolio 功能完全指南

> **阅读时间**: 12 分钟
> **难度**: ⭐⭐ (初级)
> **功能版本**: 1.0.0+
> **更新时间**: 2026-03-01

---

## 📋 目录

- [功能概述](#功能概述)
- [Portfolio vs 普通文章](#portfolio-vs-普通文章)
- [创建 Portfolio 项目](#创建-portfolio-项目)
- [显示 Portfolio](#显示-portfolio)
- [Portfolio 短代码](#portfolio-短代码)
- [分类和标签](#分类和标签)
- [SEO 优化](#seo-优化)
- [常见问题](#常见问题)

---

## 🎯 功能概述

**Portfolio** 是 Cyberpunk Theme 的核心功能，专门用于展示作品集、项目案例、产品设计等内容。

### 主要特点

| 特性 | 说明 |
|------|------|
| ✨ **精美展示** | 赛博朋克风格的卡片布局，霓虹发光效果 |
| 🏷️ **分类过滤** | 支持按类别筛选项目，一目了然 |
| 📱 **响应式设计** | 完美适配桌面、平板、手机所有设备 |
| 🔗 **外链支持** | 可以链接到外部项目网站 |
| 🎯 **SEO 优化** | 内置 SEO 优化，搜索引擎友好 |
| 🎨 **多种布局** | 支持网格、列表、瀑布流等多种布局 |
| 📷 **图片画廊** | 支持项目图片画廊展示 |
| 📊 **项目详情** | 客户、日期、技术栈等详细信息 |

### 适用场景

```
✅ 设计师 - 展示设计作品
✅ 开发者 - 展示编程项目
✅ 摄影师 - 展示摄影作品
✅ 代理商 - 展示客户案例
✅ 自由职业者 - 展示服务案例
✅ 创意工作室 - 展示团队作品
```

---

## 🔄 Portfolio vs 普通文章

### 对比表格

| 特性 | Portfolio 项目 | 普通文章 |
|------|----------------|----------|
| **用途** | 作品展示 | 博客内容 |
| **分类** | Portfolio Category | Category |
| **标签** | Portfolio Tag | Post Tag |
| **模板** | 单项目模板 | 单文章模板 |
| **字段** | 项目 URL、客户、日期等 | 标准文章字段 |
| **布局** | 网格/卡片布局 | 列表/博客布局 |
| **SEO** | 针对作品集优化 | 针对文章优化 |

### 何时使用 Portfolio？

```bash
✓ 使用 Portfolio:
  - 展示完成的项目
  - 展示客户案例
  - 展示设计作品
  - 展示产品截图
  - 需要项目详情字段

✓ 使用普通文章:
  - 写博客文章
  - 发布新闻资讯
  - 分享教程指南
  - 发布公司动态
  - 标准博客内容
```

---

## 📝 创建 Portfolio 项目

### Step 1: 访问 Portfolio 菜单

登录 WordPress 后台，你会看到左侧菜单：

```
┌─────────────────────┐
│ 📝 文章             │
│ 📺 📺 Portfolio     │  ← 点击这里
│ 📄 页面             │
│ 📎 媒体             │
└─────────────────────┘
```

或直接访问：
```
/wp-admin/edit.php?post_type=portfolio
```

### Step 2: 添加新项目

1. 点击 **Portfolio > 添加新项目**

2. 你会看到类似文章编辑器的界面

### Step 3: 填写项目信息

#### 📌 基本信息字段

```yaml
项目标题:
  - 必填
  - 例如: "赛博朋克风格网站设计"

项目描述 (内容):
  - 详细介绍项目
  - 支持 Gutenberg 区块
  - 支持短代码

特色图片:
  - 推荐尺寸: 1200x600 像素
  - 格式: JPG, PNG, WebP
  - 这是项目封面图
```

#### 📊 项目详情（可选）

在右侧边栏或页面底部，你可能会看到：

```yaml
项目 URL:
  - 链接到外部项目网站
  - 例如: https://myproject.com

客户名称:
  - 客户或公司名称
  - 例如: "CyberCorp Inc."

完成日期:
  - 项目完成日期
  - 格式: YYYY-MM-DD

项目类型:
  - 单选或复选
  - 例如: 网页设计 / APP设计 / 品牌设计

技术栈:
  - 使用的工具或技术
  - 例如: WordPress, React, Node.js
```

#### 🏷️ 分类和标签

```yaml
Portfolio Category (项目分类):
  - 用于分组和筛选
  - 例如: 网页设计, 平面设计, APP设计

Portfolio Tag (项目标签):
  - 用于标记特征
  - 例如: 响应式, 电商, 企业
```

### Step 4: 设置项目选项（如果有）

主题可能提供额外的项目选项：

```yaml
布局选项:
  [ ] 全宽布局
  [✓] 包含侧边栏
  [ ] 隐藏标题

显示选项:
  [✓] 显示特色图片
  [✓] 显示项目详情
  [ ] 显示相关项目
  [ ] 显示评论
```

### Step 5: 发布项目

1. 检查预览：点击右上角 **预览** 按钮

2. 发布选项：
   ```yaml
   状态:
     [✓] 草稿
     [ ] 待审核
     [ ] 已发布

   可见性:
     [✓] 公开
     [ ] 密码保护
     [ ] 私密

   发布:
     [✓] 立即发布
     [ ] 日期: ____/____/____
     ```

3. 点击 **发布** 按钮

> ✅ **成功！** 你的 Portfolio 项目已创建。

---

## 🖼️ 创建 Portfolio 展示页面

Portfolio 项目创建后，需要创建一个页面来展示它们。

### 方法 A: 使用 Portfolio Archive 模板

#### Step 1: 创建新页面

1. **页面 > 新建页面**

2. 标题填写："Portfolio" 或"作品集"

#### Step 2: 选择模板

在右侧边栏（或页面属性）：

```yaml
页面模板:
  [ ] Default Template
  [✓] Portfolio Archive  ← 选择这个
  [ ] Full Width
```

#### Step 3: 发布页面

点击 **发布**

#### Step 4: 添加到菜单

1. **外观 > 菜单**

2. 选择你刚创建的 Portfolio 页面

3. 点击 **添加到菜单**

4. **保存菜单**

### 方法 B: 使用短代码

在任何页面或文章中使用：

```
[portfolio]
```

这会输出 Portfolio 网格。

---

## 🎛️ Portfolio 短代码

Cyberpunk Theme 提供强大的 Portfolio 短代码系统。

### 基础用法

```shortcode
[portfolio]
```

### 完整参数

```shortcode
[portfolio
  count="12"           // 显示项目数量，-1 表示全部
  columns="3"          // 列数: 2, 3, 4
  filter="yes"         // 是否显示分类筛选: yes/no
  category="web"       // 只显示特定分类
  order="DESC"         // 排序: DESC/ASC
  orderby="date"       // 排序依据: date/title/rand
  layout="grid"        // 布局: grid/list/masonry
]
```

### 实用示例

#### 示例 1: 显示最新 6 个项目，3列布局

```shortcode
[portfolio count="6" columns="3"]
```

#### 示例 2: 显示所有网页设计项目

```shortcode
[portfolio category="web-design" count="-1"]
```

#### 示例 3: 显示带筛选器的完整 Portfolio

```shortcode
[portfolio count="-1" columns="4" filter="yes"]
```

#### 示例 4: 随机显示 3 个精选项目

```shortcode
[portfolio count="3" orderby="rand" columns="3"]
```

#### 示例 5: 列表布局（适合详细信息）

```shortcode
[portfolio count="10" layout="list" filter="no"]
```

### 在首页使用

创建"首页"页面，内容为：

```
欢迎来到我的赛博空间

[portfolio count="6" columns="3" filter="yes"]
```

然后设置该页面为静态首页。

---

## 🏷️ 分类和标签

### 创建分类

1. **Portfolio > Portfolio Categories**

2. 填写分类信息：
   ```yaml
   名称: 网页设计
   别名: web-design (URL 友好)
   父级分类: 无
   描述: 网页设计相关项目
   ```

3. 点击 **添加新分类**

### 创建标签

1. **Portfolio > Portfolio Tags**

2. 填写标签信息：
   ```yaml
   名称: 响应式
   别名: responsive
   ```

3. 点击 **添加新标签**

### 分类筛选效果

当你在短代码中启用 `filter="yes"`，页面顶部会显示分类按钮：

```
[全部] [网页设计] [平面设计] [APP设计] [品牌设计]
   6      3          2          1         2
```

用户点击按钮， Portfolio 会实时筛选。

---

## 🖼️ 项目详情页

### 单项目页面布局

访问单个 Portfolio 项目时，会显示：

```
┌─────────────────────────────────────┐
│  项目标题                           │
│  ─────────────────────────────────  │
│  ┌─────────┐  ┌───────────────┐    │
│  │         │  │ 客户: XXX     │    │
│  │  图片   │  │ 日期: 2024-01 │    │
│  │         │  │ 类型: 网页    │    │
│  └─────────┘  └───────────────┘    │
│                                     │
│  项目描述...                        │
│  [详细内容]                         │
│                                     │
│  ─────────────────────────────────  │
│  [← 返回 Portfolio]                │
└─────────────────────────────────────┘
```

### 自定义单项目模板

创建 `single-portfolio.php` 来自定义布局。

---

## 🔍 SEO 优化

### 标题和描述

每个 Portfolio 项目都会自动生成 SEO 友好的标题：

```html
<title>项目名称 - 网站名称</title>
<meta name="description" content="项目描述...">
```

### 结构化数据

主题自动添加 Schema.org 标记：

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "项目名称",
  "description": "项目描述",
  "image": "https://...",
  "url": "https://...",
  "author": {
    "@type": "Person",
    "name": "你的名字"
  }
}
```

### 图片 SEO

```yaml
文件名:
  ✓ cyberpunk-website-design.jpg
  ✓ IMG_1234.jpg

Alt 文本:
  - 为每个特色图片设置 Alt 文本
  - 描述图片内容

文件大小:
  - 压缩图片（建议 < 500KB）
  - 使用 WebP 格式
```

### URL 结构

```yaml
固定链接设置:
  /portfolio/project-name/     ✓ 推荐
  /?portfolio=project-name     ✌ 不推荐

设置方法:
  设置 > 固定链接 > 文章名
```

---

## 🎨 高级用法

### 自定义排序

在 `functions.php` 中添加：

```php
// 按 meta_value 排序
function portfolio_custom_order($query) {
    if (!is_admin() && $query->is_post_type_archive('portfolio')) {
        $query->set('orderby', 'meta_value');
        $query->set('meta_key', '_portfolio_year');
        $query->set('order', 'DESC');
    }
}
add_action('pre_get_posts', 'portfolio_custom_order');
```

### 添加自定义字段

使用 ACF 或 Meta Box 插件添加：

```yaml
字段组: Portfolio 详情
  - 客户 Logo (image)
  - 项目年份 (text)
  - 项目链接 (url)
  - 成果描述 (wysiwyg)
  - 技术栈 (checkbox)
```

### 相关项目

在单项目页面底部显示相关项目：

```php
// 在 single-portfolio.php 中
$terms = get_the_terms($post->ID, 'portfolio_category');
$term_ids = wp_list_pluck($terms, 'term_id');

$args = array(
    'post_type' => 'portfolio',
    'tax_query' => array(
        array(
            'taxonomy' => 'portfolio_category',
            'field' => 'term_id',
            'terms' => $term_ids,
        ),
    ),
    'posts_per_page' => 3,
    'post__not_in' => array($post->ID),
);

$related = new WP_Query($args);
```

---

## ❓ 常见问题

### 🔴 Portfolio 页面不显示项目？

**可能原因**:

1. **未创建 Portfolio 页面**
   - 解决: 创建页面并选择 Portfolio Archive 模板

2. **未发布项目**
   - 解决: 确保项目状态是"已发布"

3. **项目被设置为私密**
   - 解决: 编辑项目，设置可见性为"公开"

4. **缓存问题**
   - 解决: 清除缓存，Ctrl+Shift+R 刷新页面

---

### 🔴 分类筛选不工作？

**解决方案**:

1. 检查是否为项目分配了分类
2. 刷新固定链接：**设置 > 固定链接 > 保存更改**
3. 检查 JavaScript 是否加载：按 F12 查看控制台错误

---

### 🔴 图片尺寸不一致？

**解决方案**:

1. 使用推荐尺寸：1200x600 像素
2. 重新生成缩略图：使用 "Regenerate Thumbnails" 插件
3. 在短代码中使用固定布局：
   ```shortcode
   [portfolio layout="grid" columns="3"]
   ```

---

### 🔴 如何隐藏某些项目？

**方法 A: 设置为私密状态**

编辑项目，可见性选择"私密"

**方法 B: 使用短代码排除**

```shortcode
[portfolio exclude="123,456,789"]
```

其中数字是项目 ID。

---

### 🔴 可以在首页显示 Portfolio 吗？

**可以！**

方法 1: 使用静态首页
```
创建页面 > 选择 Portfolio Archive 模板 > 设置为首页
```

方法 2: 使用短代码
```
首页内容: "欢迎！"
[portfolio count="6" columns="3"]
```

方法 3: 使用最新项目小工具
```
外观 > 小工具 > 添加 "Recent Projects" 小工具
```

---

## 🎓 相关资源

### 📘 其他功能文档

- [博客文章指南](./blog-posts.md) - 普通博客文章
- [短代码参考](../04-ADVANCED/shortcodes.md) - 所有可用短代码
- [SEO 优化指南](../04-ADVANCED/seo.md) - 深度 SEO 优化

### 🛠️ 定制指南

- [颜色定制](../03-CUSTOMIZATION/colors.md) - 修改 Portfolio 颜色
- [CSS 定制](../03-CUSTOMIZATION/css-customization.md) - 完全自定义样式
- [创建子主题](../03-CUSTOMIZATION/child-theme.md) - 安全地定制

---

## 💬 需要帮助？

- ❓ [常见问题解答](../../07-FAQ.md)
- 🔧 [故障排除指南](../../04-ADVANCED/troubleshooting.md)
- 💬 [社区论坛](https://forum.cyberpunk-theme.com)
- 📧 [Email Support](mailto:support@cyberpunk-theme.com)

---

**开始展示你的作品吧！🎨**

---

*文档版本: 1.0.0 | 最后更新: 2026-03-01*
