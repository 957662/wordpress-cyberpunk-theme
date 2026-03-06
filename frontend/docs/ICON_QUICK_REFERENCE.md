# CyberPress Icon Quick Reference - 图标快速参考

## 🎯 快速查找

### 📁 文件路径
```
frontend/public/icons/
├── [基础图标].svg              # 标准功能图标 (90+)
└── cyberpunk/                  # 赛博朋克主题图标 (14+)
    ├── microchip.svg
    ├── circuit-board.svg
    ├── neon-grid.svg
    ├── hologram-display.svg
    ├── data-stream.svg
    ├── robot-eye.svg
    ├── quantum-core.svg
    ├── neural-network.svg
    ├── cyber-brain.svg         # 新增
    ├── cyber-security.svg      # 新增
    ├── data-vault.svg          # 新增
    ├── ai-core.svg             # 新增
    ├── binary-code.svg         # 新增
    └── glitch-artifact.svg     # 新增
```

---

## ⚡ 最新图标 (New)

### 🧠 Cyber Brain (赛博大脑)
**文件**: `cyber-brain.svg`
**用途**: AI功能、智能系统、机器学习
**特点**: 神经网络动画、节点脉冲
**颜色**: 青紫渐变

```tsx
<Image src="/icons/cyberpunk/cyber-brain.svg" width={64} height={64} alt="AI Brain" />
```

### 🛡️ Cyber Security (赛博安全)
**文件**: `cyber-security.svg`
**用途**: 安全功能、加密、权限
**特点**: 盾牌+锁、扫描线动画
**颜色**: 青绿渐变

```tsx
<Image src="/icons/cyberpunk/cyber-security.svg" width={64} height={64} alt="Security" />
```

### 🗄️ Data Vault (数据保险库)
**文件**: `data-vault.svg`
**用途**: 数据存储、备份、加密存储
**特点**: 保险库门、旋转锁环
**颜色**: 紫粉渐变

```tsx
<Image src="/icons/cyberpunk/data-vault.svg" width={64} height={64} alt="Data Vault" />
```

### 🤖 AI Core (AI核心)
**文件**: `ai-core.svg`
**用途**: AI核心、智能中心、处理单元
**特点**: 多轨道旋转、粒子运动
**颜色**: 全彩渐变

```tsx
<Image src="/icons/cyberpunk/ai-core.svg" width={64} height={64} alt="AI Core" />
```

### 💻 Binary Code (二进制代码)
**文件**: `binary-code.svg`
**用途**: 编程、代码、数据处理
**特点**: 0/1矩阵、扫描线
**颜色**: 青绿渐变

```tsx
<Image src="/icons/cyberpunk/binary-code.svg" width={64} height={64} alt="Binary Code" />
```

### ⚡ Glitch Artifact (故障效果)
**文件**: `glitch-artifact.svg`
**用途**: 故障效果、错误状态、赛博风格装饰
**特点**: 钻石形状、RGB分离动画
**颜色**: 青粉双色

```tsx
<Image src="/icons/cyberpunk/glitch-artifact.svg" width={64} height={64} alt="Glitch" />
```

---

## 📊 图标分类速查

### 导航类 (Navigation)
```
home.svg              首页
menu.svg              菜单
arrow-right.svg       右箭头
arrow-left.svg        左箭头
chevron-up.svg        上箭头
chevron-down.svg      下箭头
chevron-left.svg      左箭头
chevron-right.svg     右箭头
external-link.svg     外部链接
```

### 操作类 (Actions)
```
search.svg            搜索
edit.svg              编辑
trash.svg             删除
save.svg              保存
refresh.svg           刷新
share.svg             分享
copy.svg              复制
download.svg          下载
upload.svg            上传
filter.svg            筛选
lock.svg              锁定
unlock.svg            解锁
eye.svg               可见
eye-off.svg           隐藏
close.svg             关闭
log-in.svg            登录
log-out.svg           登出
```

### 内容类 (Content)
```
blog.svg              博客
code.svg              代码
image.svg             图片
video.svg             视频
video-off.svg         视频关闭
file-text.svg         文档
folder.svg            文件夹
tag.svg               标签
calendar.svg          日历
bookmark.svg          书签
```

### 社交类 (Social)
```
github.svg            GitHub
twitter.svg           Twitter
linkedin.svg          LinkedIn
email.svg             邮箱
rss.svg               RSS
```

### 用户类 (User)
```
user.svg              用户
settings.svg          设置
sun.svg               亮色主题
moon.svg              暗色主题
shield.svg            安全
```

### 状态类 (Status)
```
check.svg             成功
alert.svg             警告
info.svg              信息
notification.svg      通知
```

### 交互类 (Interactive)
```
heart.svg             喜欢
star.svg              收藏
comment.svg           评论
bell.svg              通知
message-square.svg    消息
```

### 技术类 (Technical)
```
server.svg            服务器
database.svg          数据库
database-cyber.svg    赛博数据库
cloud.svg             云端
git-branch.svg        Git分支
git-commit.svg        Git提交
git-merge.svg         Git合并
terminal.svg          终端
terminal-code.svg     终端代码
chip.svg              芯片
zap.svg               闪电/能量
microchip.svg         微芯片
```

### 数据类 (Data)
```
bar-chart.svg         柱状图
pie-chart.svg         饼图
trending-up.svg       趋势上升
activity.svg          活动数据
```

### 成就类 (Achievements)
```
target.svg            目标
trophy.svg            奖杯
rocket.svg            火箭
rocket-launch.svg     发射
puzzle.svg            拼图
```

### AI/科技类 (AI & Tech)
```
bot.svg               机器人
brain-ai.svg          AI大脑
circuit-board.svg     电路板
neural-network.svg    神经网络
quantum-core.svg      量子核心
hologram-display.svg  全息显示
data-stream.svg       数据流
robot-eye.svg         机器眼
neon-grid.svg         霓虹网格
```

---

## 🎨 颜色变体

所有图标支持 CSS 颜色定制：

```css
/* 主要颜色 */
color-cyan: #00f0ff;
color-purple: #9d00ff;
color-pink: #ff0080;
color-yellow: #f0ff00;
color-green: #00ff88;
color-orange: #ff6600;
```

**使用示例**:
```tsx
<Image
  src="/icons/search.svg"
  alt="Search"
  width={24}
  height={24}
  className="text-cyber-cyan hover:text-cyber-purple"
/>
```

---

## 📐 尺寸规范

| 尺寸 | 使用场景 |
|------|---------|
| 16px | 按钮内图标、紧凑布局 |
| 20px | 小型界面元素 |
| 24px | 标准尺寸（默认） |
| 32px | 大型按钮、功能图标 |
| 48px | 展示型图标 |
| 64px+ | 赛博朋克主题图标 |

---

## 💡 使用技巧

### 1. 基础使用
```tsx
import Image from 'next/image';

<Image
  src="/icons/search.svg"
  alt="Search"
  width={24}
  height={24}
  className="text-cyber-cyan"
/>
```

### 2. 带动画的图标
```tsx
<Image
  src="/icons/cyberpunk/ai-core.svg"
  alt="AI Core"
  width={64}
  height={64}
  className="animate-pulse"
/>
```

### 3. 作为背景
```css
.hero-section {
  background-image: url('/icons/cyberpunk/neon-grid.svg');
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.1;
}
```

### 4. 图标+文字
```tsx
<div className="flex items-center gap-2">
  <Image src="/icons/blog.svg" width={20} height={20} alt="Blog" />
  <span>博客文章</span>
</div>
```

---

## ⚡ 性能优化

### 推荐做法
- ✅ 使用 `next/image` 组件
- ✅ 指定正确的 `width` 和 `height`
- ✅ 添加描述性 `alt` 文本
- ✅ 使用 CSS 控制颜色（而非修改SVG）

### 避免做法
- ❌ 不要在每次渲染时导入
- ❌ 不要使用内联 SVG（除非必要）
- ❌ 不要忽略 `alt` 属性

---

## 🔄 更新历史

### 2026-03-06
- ✅ 新增 6 个赛博朋克图标
- ✅ 优化动画效果
- ✅ 添加颜色渐变支持
- ✅ 创建快速参考文档

---

## 📚 相关资源

- [完整图标清单](./ICON_MANIFEST.md)
- [配色参考](./COLOR_REFERENCE.md)
- [图形素材指南](./GRAPHICS_GUIDE.md)
- [Logo使用指南](./LOGO_USAGE_GUIDE.md)

---

**快速查询**: 使用 `Ctrl+F` / `Cmd+F` 搜索图标名称

**维护者**: CyberPress AI Design Team
**最后更新**: 2026-03-06
**图标总数**: 105+
