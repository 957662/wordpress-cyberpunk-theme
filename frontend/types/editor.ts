/**
 * 编辑器相关类型定义
 */

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  showPreview?: boolean;
  readOnly?: boolean;
  toolbar?: boolean;
  shortcuts?: boolean;
}

export interface EditorTool {
  name: string;
  icon: string;
  action: () => void;
  shortcut?: string;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  theme?: 'light' | 'dark';
}

export interface ImageUploadOptions {
  maxSize?: number; // bytes
  accept?: string[];
  multiple?: boolean;
}
