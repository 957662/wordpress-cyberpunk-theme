/**
 * Cyber Features Components Index
 * 赛博朋克特色组件导出索引
 *
 * 统一导出所有特色组件，方便使用
 */

// 量子随机数生成器
export { QuantumRandom, QuantumRandomExample } from './QuantumRandom';

// 赛博天气组件
export { CyberWeather, CyberWeatherExample } from './CyberWeather';

// 全息聊天界面
export { HoloChat, HoloChatExample } from './HoloChat';

// 3D 卡片组件
export {
  Card3D,
  Card3DExample,
  card3DData,
} from './Card3D';
export type { Card3DData } from './Card3D';

// 组件元数据
export const componentMetadata = {
  QuantumRandom: {
    name: '量子随机数生成器',
    description: '模拟量子态叠加的随机数生成，带有动态可视化效果',
    category: 'interactive',
    tags: ['random', 'quantum', 'interactive', 'animation'],
  },
  CyberWeather: {
    name: '赛博天气组件',
    description: '未来风格的天气显示，带有全息效果和动态更新',
    category: 'data-display',
    tags: ['weather', 'data', 'real-time', 'animation'],
  },
  HoloChat: {
    name: '全息聊天界面',
    description: 'AI 聊天界面，支持实时对话和全息效果',
    category: 'communication',
    tags: ['chat', 'ai', 'messaging', 'hologram'],
  },
  Card3D: {
    name: '3D 翻转卡片',
    description: '支持 3D 翻转和鼠标跟随效果的交互卡片',
    category: 'layout',
    tags: ['3d', 'card', 'interactive', 'animation'],
  },
} as const;

// 组件列表
export const componentList = Object.keys(componentMetadata) as Array<keyof typeof componentMetadata>;
