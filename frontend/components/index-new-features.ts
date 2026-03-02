/**
 * 新组件导出
 * 包含AI、图表、拖拽、表单、协作、3D等新功能组件
 */

// AI组件
export { ChatInterface, CodeSandbox, VoiceAssistant } from './ai';
export type { Message, CodeFile, VoiceAssistantProps } from './ai';

// 图表组件
export { RealTimeChart } from './charts';
export type { DataPoint, RealTimeChartProps } from './charts';

// 拖拽组件
export { DraggableList, SortableGrid } from './dnd';
export type { DraggableItem, SortableGridItem } from './dnd';

// 表单组件
export { SmartForm } from './forms';
export type { FormField, SmartFormProps } from './forms';

// 协作组件
export { RealTimeEditor } from './collaboration';
export type { UserCursor, Comment, RealTimeEditorProps } from './collaboration';

// 3D组件
export { ModelViewer } from './3d';
export type { ModelViewerProps } from './3d';
