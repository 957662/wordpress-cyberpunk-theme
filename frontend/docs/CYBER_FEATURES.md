# CyberPress 赛博朋克特色功能文档

## 📚 概述

本文档介绍了 CyberPress 平台中的赛博朋克风格特色组件和功能。这些组件融合了未来科技感与赛博朋克美学，为用户提供独特的交互体验。

---

## 🎲 量子随机数生成器 (QuantumRandom)

### 简介

模拟量子态叠加和坍缩过程的随机数生成器，带有动态可视化效果。

### 特性

- ✨ 量子态叠加可视化
- 🎯 量子坍缩动画效果
- 🎨 赛博朋克风格 UI
- ⌨️ 键盘快捷键支持（空格键）
- 📊 实时统计信息显示

### 使用示例

```tsx
import { QuantumRandom } from '@/components/ui/QuantumRandom';

function MyComponent() {
  const handleGenerate = (value: number) => {
    console.log('Generated:', value);
  };

  return (
    <QuantumRandom
      min={1}
      max={1000}
      onGenerate={handleGenerate}
      className="max-w-2xl mx-auto"
    />
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| min | number | 0 | 最小值 |
| max | number | 100 | 最大值 |
| onGenerate | (value: number) => void | - | 生成完成回调 |
| className | string | '' | 自定义类名 |

---

## 🌤️ 赛博天气组件 (CyberWeather)

### 简介

未来风格的天气显示组件，带有全息效果和动态数据更新。

### 特性

- 🌡️ 实时天气数据
- 🎨 动态天气图标
- 📊 详细天气指标（湿度、风速、能见度、气压）
- 🔮 24 小时天气预报
- 🎭 故障效果动画
- 🔄 自动数据更新

### 使用示例

```tsx
import { CyberWeather } from '@/components/ui/CyberWeather';

function MyComponent() {
  const weatherData = {
    temp: 24,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    location: 'Neon City',
    feelsLike: 26,
  };

  return (
    <CyberWeather
      weatherData={weatherData}
      autoUpdate={true}
      updateInterval={300000}
    />
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| weatherData | WeatherData | 默认数据 | 天气数据对象 |
| autoUpdate | boolean | false | 是否自动更新 |
| updateInterval | number | 300000 | 更新间隔(ms) |
| className | string | '' | 自定义类名 |

### WeatherData 类型

```typescript
interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  location: string;
  feelsLike: number;
}
```

---

## 💬 全息聊天界面 (HoloChat)

### 简介

赛博朋克风格的 AI 聊天界面，支持实时对话和全息效果。

### 特性

- 🤖 AI 对话支持
- 💬 实时消息显示
- 📋 消息复制功能
- 🗑️ 消息删除功能
- 🔄 正在输入动画
- 📱 响应式设计
- 🎨 全息扫描效果

### 使用示例

```tsx
import { HoloChat } from '@/components/ui/HoloChat';

function MyComponent() {
  const handleSendMessage = async (message: string) => {
    // 调用 AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.reply;
  };

  return (
    <HoloChat
      onSendMessage={handleSendMessage}
      botName="Cyber Assistant"
      className="h-[600px]"
    />
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onSendMessage | (message: string) => Promise<string> | - | 发送消息处理函数 |
| initialMessages | Message[] | [] | 初始消息列表 |
| botName | string | 'AI Assistant' | AI 名称 |
| botAvatar | string | - | AI 头像 URL |
| className | string | '' | 自定义类名 |

### Message 类型

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

---

## 🃏 3D 翻转卡片 (Card3D)

### 简介

支持 3D 翻转和鼠标跟随效果的交互卡片组件。

### 特性

- 🎯 3D 鼠标跟随效果
- 🔄 平滑翻转动画
- 🎨 渐变色彩方案
- 📊 统计数据显示
- 📱 响应式设计
- ✨ 悬浮发光效果

### 使用示例

```tsx
import { Card3D, card3DData } from '@/components/ui/Card3D';

function MyComponent() {
  return (
    <div className="grid grid-cols-4 gap-8">
      {card3DData.map((card, index) => (
        <Card3D key={index} data={card} />
      ))}
    </div>
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | Card3DData | - | 卡片数据 |
| width | number | 320 | 卡片宽度 |
| height | number | 400 | 卡片高度 |
| className | string | '' | 自定义类名 |

### Card3DData 类型

```typescript
interface Card3DData {
  icon: React.ReactNode;
  title: string;
  description: string;
  backContent?: React.ReactNode;
  color: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  stats?: {
    label: string;
    value: string;
  }[];
}
```

---

## 🎨 主题颜色

所有组件都使用 CyberPress 的赛博朋克配色方案：

```css
--cyber-dark:      #0a0a0f  /* 主背景 */
--cyber-cyan:      #00f0ff  /* 霓虹青 */
--cyber-purple:    #9d00ff  /* 赛博紫 */
--cyber-pink:      #ff0080  /* 激光粉 */
--cyber-yellow:    #f0ff00  /* 电压黄 */
--cyber-green:     #00ff88  /* 矩阵绿 */
--cyber-orange:    #ff6600  /* 火焰橙 */
```

---

## 📦 批量导入

```typescript
// 从统一索引导入所有特色组件
import {
  QuantumRandom,
  CyberWeather,
  HoloChat,
  Card3D,
  card3DData,
  componentMetadata,
} from '@/components/ui/index-features';
```

---

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 📝 开发指南

### 添加新的特色组件

1. 在 `components/ui/` 目录下创建新组件
2. 实现组件功能和样式
3. 在 `components/ui/index-features.ts` 中导出
4. 在 `docs/CYBER_FEATURES.md` 中添加文档
5. 在 `app/showcase/cyber-features/page.tsx` 中展示

### 组件开发规范

1. **TypeScript**: 使用 TypeScript 编写，提供完整的类型定义
2. **样式**: 使用 Tailwind CSS 和赛博朋克配色方案
3. **动画**: 使用 Framer Motion 实现动画效果
4. **响应式**: 确保组件在不同设备上正常显示
5. **性能**: 优化组件性能，避免不必要的重渲染
6. **可访问性**: 添加适当的 ARIA 属性和键盘支持

---

## 🔗 相关链接

- [组件展示页面](/showcase/cyber-features)
- [配色参考](/docs/COLOR_REFERENCE.md)
- [图形素材说明](/public/README-GRAPHICS.md)
- [Tailwind 配置](/tailwind.config.ts)

---

**版本**: v1.0.0
**最后更新**: 2026-03-08
**维护者**: CyberPress AI Design Team
