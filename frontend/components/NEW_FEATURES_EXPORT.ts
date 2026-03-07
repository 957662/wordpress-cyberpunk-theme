/**
 * CyberPress Platform - 新功能组件导出
 *
 * 本文件包含了最新创建的高级功能组件
 * 所有组件都采用赛博朋克风格设计
 *
 * @version 1.0.0
 * @last-updated 2026-03-07
 */

// ============================================
// 特效组件 (Effects)
// ============================================

export { ParticleNetwork } from './effects/ParticleNetwork';
export { default as ParticleNetworkDefault } from './effects/ParticleNetwork';

export { CyberLoadingSpinner } from './effects/CyberLoadingSpinner';
export { default as CyberLoadingSpinnerDefault } from './effects/CyberLoadingSpinner';

export { PerformanceMonitor } from './effects/PerformanceMonitor';
export { default as PerformanceMonitorDefault } from './effects/PerformanceMonitor';

// ============================================
// AI 组件 (AI)
// ============================================

export { CyberAIAssistant } from './ai/CyberAIAssistant';
export { default as CyberAIAssistantDefault } from './ai/CyberAIAssistant';

// ============================================
// 代码编辑器组件 (Code Editor)
// ============================================

export { CyberCodeEditor } from './code-editor/CyberCodeEditor';
export { default as CyberCodeEditorDefault } from './code-editor/CyberCodeEditor';

// ============================================
// 图表组件 (Charts)
// ============================================

export { CyberDataChart } from './charts/CyberDataChart';
export { default as CyberDataChartDefault } from './charts/CyberDataChart';

// ============================================
// 组件使用示例
// ============================================

/**
 * 粒子网络效果组件
 *
 * @example
 * import { ParticleNetwork } from '@/components';
 *
 * <ParticleNetwork
 *   particleCount={80}
 *   connectionDistance={150}
 *   mouseDistance={200}
 *   colors={['#00f0ff', '#9d00ff', '#ff0080']}
 * />
 */

/**
 * 赛博朋克加载动画组件
 *
 * @example
 * import { CyberLoadingSpinner } from '@/components';
 *
 * <CyberLoadingSpinner
 *   size="lg"
 *   color="cyan"
 *   text="加载中..."
 *   showPercentage={true}
 * />
 */

/**
 * 性能监控组件
 *
 * @example
 * import { PerformanceMonitor } from '@/components';
 *
 * <PerformanceMonitor
 *   position="bottom-right"
 *   showFPS={true}
 *   showMemory={true}
 *   showTiming={true}
 * />
 */

/**
 * AI 助手聊天组件
 *
 * @example
 * import { CyberAIAssistant } from '@/components';
 *
 * <CyberAIAssistant
 *   position="bottom-right"
 *   theme="cyan"
 *   greeting="你好！我是 AI 助手"
 *   suggestions={['帮我写文章', '代码建议']}
 *   onSendMessage={async (msg) => {
 *     // 处理消息
 *     return '回复内容';
 *   }}
 * />
 */

/**
 * 代码编辑器组件
 *
 * @example
 * import { CyberCodeEditor } from '@/components';
 *
 * <CyberCodeEditor
 *   value={code}
 *   onChange={setCode}
 *   language="typescript"
 *   theme="dark"
 *   showLineNumbers={true}
 *   showActions={true}
 * />
 */

/**
 * 数据图表组件
 *
 * @example
 * import { CyberDataChart } from '@/components';
 *
 * <CyberDataChart
 *   data={[
 *     { label: '一月', value: 100 },
 *     { label: '二月', value: 150 },
 *   ]}
 *   type="bar"
 *   title="销售数据"
 *   theme="cyan"
 *   animated={true}
 * />
 */

// ============================================
// 类型定义
// ============================================

export type {
  ParticleNetworkProps,
  CyberLoadingSpinnerProps,
  PerformanceMonitorProps,
  CyberAIAssistantProps,
  CyberCodeEditorProps,
  CyberDataChartProps,
} from './types/new-features';

// ============================================
// 默认导出
// ============================================

export default {
  // Effects
  ParticleNetwork,
  CyberLoadingSpinner,
  PerformanceMonitor,

  // AI
  CyberAIAssistant,

  // Code Editor
  CyberCodeEditor,

  // Charts
  CyberDataChart,
};
