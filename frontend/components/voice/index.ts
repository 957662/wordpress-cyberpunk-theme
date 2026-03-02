/**
 * Voice Components Index
 * 语音组件导出
 */

// 语音识别器
export { VoiceRecognizer } from './VoiceRecognizer';
export type {
  VoiceLanguage,
  RecognitionState,
  VoiceCommand,
  VoiceRecognizerProps,
} from './VoiceRecognizer';

// 语音输入
export { VoiceInput } from './VoiceInput';
export type { VoiceInputProps, VoiceRecognitionResult } from './VoiceInput';

// 语音命令
export { VoiceCommands, useCommonVoiceCommands } from './VoiceCommands';
export type { VoiceCommand as VoiceCommandType, VoiceCommandsProps } from './VoiceCommands';
