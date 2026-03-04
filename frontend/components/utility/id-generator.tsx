'use client';

/**
 * ID Generator Component
 * ID 生成器组件 - 用于生成唯一标识符
 */

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Copy, RefreshCw } from 'lucide-react';

export interface IdGeneratorProps {
  /** ID 前缀 */
  prefix?: string;
  /** ID 长度 */
  length?: number;
  /** 生成回调 */
  onGenerate?: (id: string) => void;
  /** 是否自动生成 */
  autoGenerate?: boolean;
  /** 格式类型 */
  format?: 'uuid' | 'nanoid' | 'custom';
  /** 自定义类名 */
  className?: string;
}

// 简单的 UUID 生成
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 简单的 NanoID 风格生成
function generateNanoID(length: number = 21): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 自定义 ID 生成
function generateCustomID(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function IdGenerator({
  prefix = '',
  length = 8,
  onGenerate,
  autoGenerate = true,
  format = 'custom',
  className,
}: IdGeneratorProps) {
  const [generatedId, setGeneratedId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // 生成 ID
  const generateId = useCallback(() => {
    let id: string;

    switch (format) {
      case 'uuid':
        id = generateUUID();
        break;
      case 'nanoid':
        id = generateNanoID(length);
        break;
      case 'custom':
      default:
        id = generateCustomID(length);
        break;
    }

    const fullId = prefix ? `${prefix}_${id}` : id;
    setGeneratedId(fullId);
    onGenerate?.(fullId);
    return fullId;
  }, [prefix, length, format, onGenerate]);

  // 自动生成
  useEffect(() => {
    if (autoGenerate) {
      generateId();
    }
  }, [autoGenerate, generateId]);

  // 复制到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={cn('id-generator flex items-center gap-2', className)}>
      <Input
        value={generatedId}
        readOnly
        className="font-mono"
        placeholder="点击生成按钮创建 ID"
      />
      <Button
        size="icon"
        variant="outline"
        onClick={generateId}
        title="重新生成"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={copyToClipboard}
        disabled={!generatedId}
        title={copied ? '已复制!' : '复制'}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
