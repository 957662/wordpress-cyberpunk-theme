# CyberPress - Illustrations (插画)

## 📁 插画文件清单

```
frontend/public/illustrations/
├── 404-glitch.svg           # 404错误页面 - 故障艺术风格
├── empty-state.svg          # 空状态插画
├── server-maintenance.svg   # 服务器维护插画
├── access-denied.svg        # 访问拒绝插画
├── success-check.svg        # 成功状态插画
└── no-results.svg          # 无搜索结果插画
```

---

## 🎨 插画说明

### 1. 404-glitch.svg
**用途**: 404 错误页面
**尺寸**: 400x300
**风格**: 赛博朋克故障艺术
**特点**:
- 霓虹青、赛博紫、激光粉三色故障效果
- 二进制代码装饰
- 动态扭曲效果
- 发光文字效果

**使用方式**:
```tsx
<Image
  src="/illustrations/404-glitch.svg"
  alt="404 - Page Not Found"
  width={400}
  height={300}
  priority
/>
```

---

### 2. empty-state.svg
**用途**: 内容为空时的占位图
**尺寸**: 400x300
**风格**: 极简科技风
**特点**:
- 空文件夹图标
- 浮动粒子动画
- 电路装饰线条
- 柔和发光效果

**使用场景**:
- 博客列表为空
- 作品集为空
- 搜索无结果

---

### 3. server-maintenance.svg
**用途**: 服务器维护页面
**尺寸**: 400x300
**风格**: 机架服务器设计
**特点**:
- 4U 服务器机架
- LED 状态指示灯
- 旋转齿轮动画
- 闪烁警告灯

**使用方式**:
```tsx
<div className="maintenance-page">
  <Image src="/illustrations/server-maintenance.svg" alt="Under Maintenance" />
  <h1>System Maintenance</h1>
  <p>We'll be back soon</p>
</div>
```

---

### 4. access-denied.svg
**用途**: 权限不足/访问拒绝
**尺寸**: 400x300
**风格**: 警示风格
**特点**:
- 大号锁定图标
- 危险条纹背景
- 扫描线动画
- 红色警示配色

**使用场景**:
- 403 Forbidden 页面
- 未登录用户访问受限内容
- 权限验证失败

---

### 5. success-check.svg
**用途**: 操作成功反馈
**尺寸**: 400x300
**风格**: 成功庆祝风格
**特点**:
- 动画对勾效果
- 彩纸粒子动画
- 脉冲光环效果
- 绿色成功配色

**使用场景**:
- 表单提交成功
- 操作完成反馈
- 验证成功提示

---

### 6. no-results.svg
**用途**: 搜索无结果
**尺寸**: 400x300
**风格**: 搜索主题
**特点**:
- 放大镜图标
- 问号装饰
- 渐变色设计
- 发光效果

**使用场景**:
- 搜索结果为空
- 筛选无匹配
- 查询失败

---

## 🎯 使用建议

### 响应式使用
```tsx
{/* 移动端 */}
<Image
  src="/illustrations/404-glitch.svg"
  alt="404"
  width={300}
  height={225}
  className="w-full max-w-[300px]"
/>

{/* 桌面端 */}
<Image
  src="/illustrations/404-glitch.svg"
  alt="404"
  width={500}
  height={375}
  className="w-full max-w-[500px]"
/>
```

### 带文字说明
```tsx
<div className="flex flex-col items-center text-center">
  <Image
    src="/illustrations/empty-state.svg"
    alt="No content"
    width={400}
    height={300}
  />
  <h2 className="text-xl font-bold text-cyber-cyan mt-6">No Content Yet</h2>
  <p className="text-cyber-gray-200 mt-2">Be the first to create something!</p>
</div>
```

### 配合按钮
```tsx
<div className="flex flex-col items-center">
  <Image src="/illustrations/access-denied.svg" alt="Access Denied" />
  <p className="my-4">Please log in to continue</p>
  <Button onClick={handleLogin}>Log In</Button>
</div>
```

---

## 🎨 配色方案

所有插画使用统一的赛博朋克配色：

| 颜色 | 用途 | HEX |
|------|------|-----|
| 霓虹青 | 主要元素 | `#00f0ff` |
| 赛博紫 | 次要元素 | `#9d00ff` |
| 激光粉 | 警告/强调 | `#ff0080` |
| 矩阵绿 | 成功/正常 | `#00ff88` |
| 深空黑 | 背景 | `#0a0a0f` |

---

## ⚡ 动画效果

部分插画包含 SVG 原生动画：

- **404-glitch**: 故障文字偏移
- **server-maintenance**: LED 闪烁 + 齿轮旋转
- **success-check**: 对勾绘制 + 粒子飘落
- **access-denied**: 扫描线移动

---

## 📱 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 移动端浏览器

---

**创建时间**: 2026-03-03
**版本**: v2.0
**设计风格**: Cyberpunk Aesthetics
