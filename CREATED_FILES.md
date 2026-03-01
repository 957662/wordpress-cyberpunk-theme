# CyberPress Platform - 项目文件清单

## 📁 更新日期
2026-03-02

## ✅ 本次会话创建/更新的文件

### 新创建文件
- ✅ `/frontend/components/icons/index.tsx` - 图标组件索引文件，基于 lucide-react
- ✅ `/CREATED_FILES.md` - 本文件，项目文件清单

### 更新文件
- ✅ `/frontend/tailwind.config.ts` - 添加了 shadow-glow-* 类样式

## 📦 项目现有组件清单

### UI 组件 (components/ui/)
- Button.tsx - 赛博朋克风格按钮
- Card.tsx - 多种变体的卡片组件
- Badge.tsx - 徽章组件
- Input.tsx - 输入框组件
- Modal.tsx - 模态框
- SearchBar.tsx - 搜索栏
- Pagination.tsx - 分页
- Toast.tsx - 通知提示
- Notification.tsx - 通知
- Table.tsx - 表格
- CodeBlock.tsx - 代码块
- TagCloud.tsx - 标签云
- ContactForm.tsx - 联系表单
- Avatar.tsx - 头像
- Divider.tsx - 分割线
- Tabs.tsx - 标签页
- Dropdown.tsx - 下拉菜单
- Chip.tsx - 芯片/标签
- Progress.tsx - 进度条
- Timeline.tsx - 时间线
- Carousel.tsx - 轮播图
- Rating.tsx - 评分
- Accordion.tsx - 手风琴
- Steps.tsx - 步骤条
- Breadcrumb.tsx - 面包屑
- EmptyState.tsx - 空状态
- BackToTop.tsx - 返回顶部
- Alert.tsx - 警告提示
- LoadingSpinner.tsx - 加载动画
- LoadingState.tsx - 加载状态
- Switch.tsx - 开关
- Toggle.tsx - 切换
- Dialog.tsx - 对话框
- InfiniteScroll.tsx - 无限滚动
- Drawer.tsx - 抽屉
- Draggable.tsx - 拖拽
- TreeView.tsx - 树视图
- SplitPane.tsx - 分屏
- LoadingState.tsx - 加载状态组件
- ColorPicker.tsx - 颜色选择器
- FormBuilder.tsx - 表单构建器
- AvatarUpload.tsx - 头像上传
- TimeAgo.tsx - 相对时间
- CyberCard.tsx - 赛博朋克卡片

### 布局组件 (components/layout/)
- Header.tsx - 网站头部导航
- Footer.tsx - 网站页脚
- Sidebar.tsx - 侧边栏

### 特效组件 (components/effects/)
- GlitchText.tsx - 故障文字效果
- NeonBorder.tsx - 霓虹边框
- TypewriterText.tsx - 打字机效果
- ParticleBackground.tsx - 粒子背景
- HologramCard.tsx - 全息卡片
- CyberGrid.tsx - 赛博网格
- MatrixRain.tsx - Matrix代码雨
- TextScramble.tsx - 文字打乱效果
- GlowOrb.tsx - 发光球体
- Scanlines.tsx - 扫描线效果
- GlitchEffect.tsx - 故障效果
- HolographicCard.tsx - 全息投影卡片
- ParallaxScroll.tsx - 视差滚动
- CursorGlow.tsx - 光标发光
- AudioVisualizer.tsx - 音频可视化

### 博客组件 (components/blog/)
- BlogCard.tsx - 博客卡片
- BlogDetail.tsx - 博客详情
- BlogList.tsx - 博客列表
- BlogHero.tsx - 博客首页
- BlogPagination.tsx - 博客分页
- AdvancedSearch.tsx - 高级搜索
- RSSFeedCard.tsx - RSS订阅卡片

### 作品集组件 (components/portfolio/)
- PortfolioGrid.tsx - 作品集网格
- PortfolioCard.tsx - 作品集卡片
- PortfolioDetail.tsx - 作品集详情

### 管理组件 (components/admin/)
- DashboardLayout.tsx - 管理后台布局
- PostEditor.tsx - 文章编辑器
- MediaLibrary.tsx - 媒体库
- DataCharts.tsx - 数据图表
- NotificationCenter.tsx - 通知中心

### 认证组件 (components/auth/)
- AuthModal.tsx - 认证模态框
- UserProfile.tsx - 用户资料
- ProtectedRoute.tsx - 受保护路由

### 图形组件 (components/graphics/)
- Icon.tsx - 图标
- LogoDisplay.tsx - Logo展示
- Decoration.tsx - 装饰
- PatternBackground.tsx - 图案背景
- Illustration.tsx - 插画
- SVGIcons.tsx - SVG图标
- Logos.tsx - Logo集合
- Decorations.tsx - 装饰集合
- Illustrations.tsx - 插画集合

### 小组件 (components/widgets/)
- Widget.tsx - 小组件基类
- RecentPostsWidget.tsx - 最新文章小组件
- TagCloudWidget.tsx - 标签云小组件
- CategoryWidget.tsx - 分类小组件
- SearchWidget.tsx - 搜索小组件
- AuthorWidget.tsx - 作者小组件

### 主题组件 (components/theme/)
- ThemeSwitcher.tsx - 主题切换器

### 国际化组件 (components/i18n/)
- LanguageSwitcher.tsx - 语言切换器

### 示例组件 (components/examples/)
- IconShowcase.tsx - 图标展示
- IconGallery.tsx - 图标画廊
- CyberIconShowcase.tsx - 赛博图标展示
- IllustrationShowcase.tsx - 插画展示

## 📄 页面文件 (app/(public)/)
- `/page.tsx` - 首页
- `/blog/page.tsx` - 博客列表
- `/blog/[slug]/page.tsx` - 博客详情
- `/portfolio/page.tsx` - 作品集
- `/portfolio/[slug]/page.tsx` - 作品集详情
- `/about/page.tsx` - 关于页面
- `/contact/page.tsx` - 联系页面
- `/search/page.tsx` - 搜索页面
- `/login/page.tsx` - 登录页面

## 📚 工具库 (lib/)
- `wordpress/client.ts` - WordPress API 客户端
- `wordpress/api.ts` - API 接口
- `wordpress/posts.ts` - 文章接口
- `wordpress/queries.ts` - React Query 查询
- `utils/cn.ts` - 类名合并工具
- `utils/index.ts` - 工具函数集合
- `hooks/useWordPress.ts` - WordPress Hook
- `services/wordpress.ts` - WordPress 服务
- `services/cache.ts` - 缓存服务

## 🎨 样式文件
- `styles/globals.css` - 全局样式
- `tailwind.config.ts` - Tailwind 配置

## 🔧 配置文件
- `tsconfig.json` - TypeScript 配置
- `next.config.js` - Next.js 配置
- `package.json` - 依赖管理

## 📝 总结

项目 CyberPress Platform 已经具备：
1. ✅ 完整的组件库（100+ 组件）
2. ✅ 赛博朋克主题样式
3. ✅ WordPress REST API 集成
4. ✅ 响应式设计
5. ✅ 丰富的动画效果
6. ✅ 完整的页面结构

### 下一步建议
1. 连接真实的 WordPress 后端
2. 添加内容管理功能
3. 实现用户认证系统
4. 优化 SEO 性能
5. 部署到生产环境
