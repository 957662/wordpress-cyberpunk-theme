# CyberPress Platform - 图标清单

## 📋 图标概览

CyberPress 平台使用赛博朋克风格的 SVG 图标系统，所有图标都带有霓虹发光效果。

## 🎨 图标分类

### 导航图标 (Navigation Icons)
- **home.svg** - 首页图标 (房屋形状)
- **menu.svg** - 菜单图标 (汉堡菜单)
- **arrow-left.svg** - 左箭头
- **arrow-right.svg** - 右箭头
- **chevron-left.svg** - 左向箭头
- **chevron-right.svg** - 右向箭头
- **chevron-up.svg** - 上向箭头
- **chevron-down.svg** - 下向箭头

### 功能图标 (Action Icons)
- **search.svg** - 搜索图标
- **edit.svg** - 编辑图标
- **trash.svg** - 删除图标
- **save.svg** - 保存图标
- **refresh.svg** - 刷新图标
- **copy.svg** - 复制图标
- **download.svg** - 下载图标
- **upload.svg** - 上传图标
- **share.svg** - 分享图标
- **external-link.svg** - 外部链接

### 页面图标 (Page Icons)
- **blog.svg** - 博客图标
- **portfolio.svg** - 作品集图标
- **about.svg** - 关于页面图标
- **contact.svg** - 联系页面图标

### 社交图标 (Social Icons)
- **github.svg** - GitHub
- **twitter.svg** - Twitter/X
- **linkedin.svg** - LinkedIn
- **email.svg** - 邮箱

### 内容图标 (Content Icons)
- **calendar.svg** - 日历
- **tag.svg** - 标签
- **folder.svg** - 文件夹
- **bookmark.svg** - 书签
- **comment.svg** - 评论
- **heart.svg** - 点赞/收藏
- **star.svg** - 星标
- **eye.svg** - 查看
- **eye-off.svg** - 隐藏

### 技术图标 (Tech Icons)
- **code.svg** - 代码
- **terminal.svg** - 终端
- **database.svg** - 数据库
- **server.svg** - 服务器
- **cloud.svg** - 云端
- **git-branch.svg** - Git 分支
- **git-commit.svg** - Git 提交
- **git-merge.svg** - Git 合并
- **rss.svg** - RSS 订阅

### 主题图标 (Theme Icons)
- **sun.svg** - 浅色模式
- **moon.svg** - 深色模式
- **settings.svg** - 设置

### 用户图标 (User Icons)
- **user.svg** - 用户
- **log-in.svg** - 登录
- **log-out.svg** - 登出
- **lock.svg** - 锁定
- **unlock.svg** - 解锁
- **shield.svg** - 安全

### 状态图标 (Status Icons)
- **alert.svg** - 警告
- **check.svg** - 成功
- **filter.svg** - 筛选
- **bell.svg** - 通知
- **message-square.svg** - 消息
- **more-horizontal.svg** - 更多选项

### 媒体图标 (Media Icons)
- **image.svg** - 图片
- **video.svg** - 视频
- **mic.svg** - 音频
- **paperclip.svg** - 附件

### 其他图标 (Other Icons)
- **grid-layout.svg** - 网格布局
- **zap.svg** - 闪电/快速
- **history.svg** - 历史

## 🎯 使用方式

### 在 React 组件中直接导入

```tsx
import Image from 'next/image';

function HomeIcon() {
  return (
    <Image
      src="/icons/home.svg"
      alt="Home"
      width={24}
      height={24}
      className="text-cyber-cyan"
    />
  );
}
```

### 使用 Lucide React 图标库

项目也集成了 `lucide-react` 图标库，可以直接导入使用：

```tsx
import { Home, Search, Settings } from 'lucide-react';

function Navbar() {
  return (
    <nav>
      <Home className="w-6 h-6 text-cyber-cyan" />
      <Search className="w-6 h-6 text-cyber-purple" />
      <Settings className="w-6 h-6 text-cyber-pink" />
    </nav>
  );
}
```

### SVG 作为背景

```css
.custom-bg {
  background-image: url('/icons/home.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## 🔧 图标样式类

Tailwind CSS 类用于图标样式：

```tsx
// 尺寸
className="w-4 h-4"   // 16px
className="w-5 h-5"   // 20px
className="w-6 h-6"   // 24px
className="w-8 h-8"   // 32px
className="w-12 h-12" // 48px

// 颜色
className="text-cyber-cyan"    // 霓虹青
className="text-cyber-purple"  // 赛博紫
className="text-cyber-pink"    // 激光粉
className="text-cyber-yellow"  // 电压黄
className="text-cyber-green"   // 霓虹绿

// 发光效果
className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"

// 动画
className="hover:scale-110 transition-transform"
className="animate-pulse"
```

## 📐 图标规格

- **视图框**: 24x24 (标准)
- **描边宽度**: 2px
- **线条端点**: round
- **线条连接**: round
- **填充**: none (描边风格) 或 fill (填充风格)

## 🆕 添加新图标

1. 使用 SVG 编辑工具创建 24x24 视图框的图标
2. 应用赛博朋克风格（发光效果、渐变）
3. 保存到 `frontend/public/icons/` 目录
4. 在此文档中记录新图标

## 🔗 相关资源

- [Lucide 图标库](https://lucide.dev/)
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)

---

**最后更新**: 2026-03-03
**维护者**: CyberPress 设计团队
