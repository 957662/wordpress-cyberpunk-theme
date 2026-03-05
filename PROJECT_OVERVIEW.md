# CyberPress Platform - 项目总览

## 📋 项目基本信息

- **项目名称**: CyberPress Platform
- **项目类型**: 赛博朋克风格博客平台
- **技术栈**: Next.js 14 + TypeScript + Tailwind CSS
- **开发团队**: AI Development Team
- **创建日期**: 2026-03-05
- **当前版本**: 1.0.0

## 🏗️ 项目架构

### 前端架构
```
frontend/
├── app/                      # Next.js App Router
│   ├── (public)/            # 公开页面组
│   │   ├── page.tsx         # 首页
│   │   ├── blog/            # 博客相关页面
│   │   ├── portfolio/       # 作品集页面
│   │   ├── auth/            # 认证页面
│   │   └── layout.tsx       # 公开页面布局
│   ├── (admin)/            # 管理后台页面组
│   │   ├── page.tsx         # 后台首页
│   │   ├── dashboard/       # 仪表盘
│   │   ├── media/           # 媒体管理
│   │   └── layout.tsx       # 后台布局
│   ├── api/                 # API 路由
│   │   ├── posts/           # 文章 API
│   │   ├── auth/            # 认证 API
│   │   ├── feed/            # RSS 订阅
│   │   └── ...
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页（重定向）
│   ├── loading.tsx          # 全局加载页面
│   └── error.tsx            # 全局错误页面
│
├── components/              # React 组件
│   ├── ui/                 # 基础 UI 组件（50+）
│   │   ├── Button.tsx      # 按钮组件
│   │   ├── Card.tsx        # 卡片组件
│   │   ├── Input.tsx       # 输入框组件
│   │   ├── Modal.tsx       # 模态框组件
│   │   ├── RadioGroup.tsx  # 单选框组 ✨
│   │   ├── OTPInput.tsx    # 验证码输入 ✨
│   │   ├── AudioPlayer.tsx # 音频播放器 ✨
│   │   ├── CommentItem.tsx # 评论组件 ✨
│   │   └── ...
│   ├── layout/             # 布局组件
│   │   ├── Header.tsx      # 页面头部
│   │   ├── Footer.tsx      # 页面底部
│   │   ├── Sidebar.tsx     # 侧边栏
│   │   └── ...
│   ├── blog/               # 博客相关组件
│   ├── effects/            # 特效组件（15+）
│   ├── graphics/           # 图形组件
│   ├── widgets/            # 小部件组件
│   └── icons/              # 图标组件
│
├── lib/                    # 工具库
│   ├── wordpress/          # WordPress API 集成
│   │   ├── client.ts       # API 客户端
│   │   ├── queries.ts      # 查询函数
│   │   └── transformers.ts # 数据转换
│   ├── utils/              # 工具函数（100+）
│   │   ├── cn.ts           # className 工具
│   │   ├── validation.ts   # 验证工具 ✨
│   │   ├── string.ts       # 字符串工具 ✨
│   │   ├── array.ts        # 数组工具 ✨
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks（30+）
│   │   ├── useWindowSize.ts     # 窗口大小
│   │   ├── useLocalStorage.ts   # 本地存储
│   │   ├── useDebounce.ts       # 防抖
│   │   ├── useClickOutside.ts   # 外部点击
│   │   └── ...
│   ├── services/           # 业务服务
│   ├── config/             # 配置文件
│   │   ├── site.ts         # 站点配置
│   │   └── constants.ts    # 常量定义
│   └── types/              # 类型定义
│       ├── index.ts        # 基础类型
│       ├── wordpress.ts    # WordPress 类型
│       └── wordpress-extended.ts ✨
│
├── styles/                 # 样式文件
│   └── globals.css         # 全局样式
│
├── public/                 # 静态资源
│   ├── icons/              # 图标文件（40+）
│   ├── patterns/           # 背景图案
│   ├── backgrounds/        # 背景图
│   └── logo-*.svg          # Logo 文件
│
└── docs/                   # 文档
    ├── COLOR_REFERENCE.md  # 颜色参考
    ├── ICON_MANIFEST.md    # 图标清单
    └── ...

backend/                  # FastAPI 后端（可选）
```

## ✨ 新创建的文件（标记 ✨）

### 组件文件
1. **RadioGroup.tsx** - 单选框组组件
2. **OTPInput.tsx** - 一次性密码输入组件
3. **AudioPlayer.tsx** - 音频播放器组件
4. **CommentItem.tsx** - 评论项组件

### 类型文件
5. **wordpress-extended.ts** - WordPress 扩展类型定义

### 工具文件（已存在，已确认）
6. **validation.ts** - 验证工具
7. **string.ts** - 字符串工具
8. **array.ts** - 数组工具
9. **useWindowSize.ts** - 窗口大小 Hook
10. **useLocalStorage.ts** - 本地存储 Hook
11. **useDebounce.ts** - 防抖 Hook
12. **useClickOutside.ts** - 外部点击 Hook

## 📊 项目统计

### 代码量统计
- **总文件数**: 200+ 个
- **组件数量**: 100+ 个
- **自定义 Hooks**: 30+ 个
- **工具函数**: 100+ 个
- **类型定义**: 50+ 个
- **页面路由**: 80+ 个

### 技术特性
- ✅ TypeScript 5.4 完整类型支持
- ✅ Tailwind CSS 3.4 赛博朋克主题
- ✅ Framer Motion 11 动画系统
- ✅ 响应式设计（移动优先）
- ✅ SEO 优化
- ✅ 无障碍支持（ARIA）
- ✅ 性能优化（懒加载、代码分割）

## 🎨 设计系统

### 赛博朋克配色
```css
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
--cyber-yellow: #f0ff00    /* 电压黄 */
--cyber-green: #00ff88     /* 赛博绿 */
```

### 特效组件
- GlitchEffect - 故障效果
- NeonBorder - 霓虹边框
- Scanlines - 扫描线
- ParticleBackground - 粒子背景
- HologramCard - 全息卡片
- CursorGlow - 光标发光

## 🔧 核心功能

### 已实现功能
1. **博客系统**
   - 文章列表和详情
   - 分类和标签
   - 搜索功能
   - 评论系统
   - 阅读进度

2. **用户系统**
   - 登录/注册
   - 个人资料
   - 社交功能（关注、点赞、收藏）

3. **管理后台**
   - 仪表盘
   - 文章管理
   - 媒体管理
   - 评论审核

4. **API 集成**
   - WordPress REST API
   - RSS 订阅源
   - 认证系统

## 📝 开发指南

### 快速开始
```bash
# 安装依赖
cd frontend
npm install

# 配置环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

### 构建生产版本
```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

### 代码规范
```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check

# 格式化代码
npm run format
```

## 🎯 下一步计划

### 短期目标
- [ ] 完善单元测试
- [ ] 优化性能
- [ ] 添加 E2E 测试
- [ ] 完善文档

### 长期目标
- [ ] PWA 支持
- [ ] 国际化 (i18n)
- [ ] AI 功能集成
- [ ] 微前端架构

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [CHANGELOG.md](./CHANGELOG.md) - 变更日志
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [CREATION_SUMMARY.md](./frontend/CREATION_SUMMARY.md) - 创建总结

## 🏆 项目亮点

1. **完整的类型系统** - 100% TypeScript 覆盖
2. **赛博朋克设计** - 独特的视觉风格
3. **高性能架构** - Next.js 14 + Edge Runtime
4. **丰富的组件库** - 100+ 可复用组件
5. **完善的工具函数** - 100+ 工具函数
6. **响应式设计** - 完美适配所有设备

## 📞 联系方式

- **项目主页**: https://github.com/957662/wordpress-cyberpunk-theme
- **问题反馈**: GitHub Issues
- **邮箱**: 2835879683@qq.com

---

**最后更新**: 2026-03-05
**维护者**: AI Development Team
