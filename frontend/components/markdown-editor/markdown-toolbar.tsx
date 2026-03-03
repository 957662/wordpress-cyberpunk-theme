/**
 * Markdown 工具栏组件
 * 可独立使用的 Markdown 格式化工具栏
 */

'use client';

import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Code, Link, Image, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownToolbarProps {
  onInsert: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export function MarkdownToolbar({ onInsert, className, disabled }: MarkdownToolbarProps) {
  const ToolbarButton = ({
    icon: Icon,
    label,
    insertText,
    shortcut,
  }: {
    icon: typeof Bold;
    label: string;
    insertText: string;
    shortcut?: string;
  }) => (
    <button
      onClick={() => onInsert(insertText)}
      disabled={disabled}
      className={cn(
        'rounded-lg p-2 transition-colors',
        'hover:bg-cyber-primary/20 hover:text-cyber-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'relative group'
      )}
      title={label + (shortcut ? ` (${shortcut})` : '')}
    >
      <Icon className="h-4 w-4" />
      <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs text-background group-hover:block whitespace-nowrap">
        {label}
      </span>
    </button>
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-1 border-b border-cyber-border bg-card/50 p-2', className)}>
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Bold}
          label="粗体"
          insertText="**粗体**"
          shortcut="Ctrl+B"
        />
        <ToolbarButton
          icon={Italic}
          label="斜体"
          insertText="*斜体*"
          shortcut="Ctrl+I"
        />
        <ToolbarButton
          icon={Strikethrough}
          label="删除线"
          insertText="~~删除线~~"
        />
      </div>

      <div className="mx-2 h-6 w-px bg-cyber-border" />

      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Heading1}
          label="一级标题"
          insertText="# "
        />
        <ToolbarButton
          icon={Heading2}
          label="二级标题"
          insertText="## "
        />
      </div>

      <div className="mx-2 h-6 w-px bg-cyber-border" />

      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={List}
          label="无序列表"
          insertText="- "
        />
        <ToolbarButton
          icon={ListOrdered}
          label="有序列表"
          insertText="1. "
        />
        <ToolbarButton
          icon={Quote}
          label="引用"
          insertText="> "
        />
      </div>

      <div className="mx-2 h-6 w-px bg-cyber-border" />

      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Code}
          label="代码"
          insertText="```\n代码\n```"
        />
        <ToolbarButton
          icon={Link}
          label="链接"
          insertText="[链接文字](url)"
          shortcut="Ctrl+K"
        />
        <ToolbarButton
          icon={Image}
          label="图片"
          insertText="![alt文字](图片url)"
        />
      </div>
    </div>
  );
}
