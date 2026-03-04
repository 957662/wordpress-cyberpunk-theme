'use client';

/**
 * JSON Viewer Component
 * JSON 查看器组件 - 用于美化显示 JSON 数据
 */

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Copy, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface JsonViewerProps {
  /** JSON 数据 */
  data: any;
  /** 展开深度 */
  expandDepth?: number;
  /** 自定义类名 */
  className?: string;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber';
  /** 启用剪贴板 */
  enableClipboard?: boolean;
  /** 启用搜索 */
  enableSearch?: boolean;
}

interface JsonNodeProps {
  data: any;
  keyName?: string;
  depth: number;
  expandDepth: number;
  variant: string;
  searchTerm?: string;
}

function JsonNode({ data, keyName, depth, expandDepth, variant, searchTerm }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < expandDepth);

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data).length === 0;

  // 搜索高亮
  const shouldHighlight = searchTerm && keyName?.toLowerCase().includes(searchTerm.toLowerCase());

  // 判断是否展开
  const expanded = depth < expandDepth ? true : isExpanded;

  // 渲染基本类型
  if (!isObject) {
    const value = typeof data === 'string' ? `"${data}"` : String(data);
    const valueColor = getValueColor(data);

    return (
      <span
        className={cn(
          'json-value',
          valueColor,
          shouldHighlight && 'bg-yellow-500/20 rounded px-1',
          variant === 'neon' && 'text-shadow-glow'
        )}
      >
        {value}
      </span>
    );
  }

  // 渲染空对象或数组
  if (isEmpty) {
    return (
      <span className="text-gray-500">
        {isArray ? '[]' : '{}'}
      </span>
    );
  }

  // 渲染对象或数组
  const keys = Object.keys(data);
  const startBracket = isArray ? '[' : '{';
  const endBracket = isArray ? ']' : '}';

  return (
    <span className="json-node">
      <span
        className={cn(
          'json-bracket text-purple-500 cursor-pointer select-none',
          variant === 'neon' && 'text-purple-400'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {expanded ? (
          <ChevronDown className="inline h-3 w-3 mr-1" />
        ) : (
          <ChevronRight className="inline h-3 w-3 mr-1" />
        )}
        {startBracket}
      </span>

      {expanded && (
        <>
          <div className="ml-4 border-l border-gray-700 pl-4">
            {keys.map((key, index) => (
              <div key={key} className="json-item">
                <span
                  className={cn(
                    'json-key text-blue-500 mr-2',
                    variant === 'neon' && 'text-blue-400'
                  )}
                >
                  {!isArray && (
                    <>
                      <span
                        className={cn(
                          shouldHighlight && 'bg-yellow-500/20 rounded px-1'
                        )}
                      >
                        {key}
                      </span>
                      :
                    </>
                  )}
                </span>
                <JsonNode
                  data={data[key]}
                  keyName={key}
                  depth={depth + 1}
                  expandDepth={expandDepth}
                  variant={variant}
                  searchTerm={searchTerm}
                />
                {index < keys.length - 1 && <span className="text-gray-500">,</span>}
              </div>
            ))}
          </div>
          <span
            className={cn(
              'json-bracket text-purple-500 ml-4',
              variant === 'neon' && 'text-purple-400'
            )}
          >
            {endBracket}
          </span>
        </>
      )}

      {!expanded && (
        <span
          className={cn(
            'json-bracket text-purple-500 ml-2',
            variant === 'neon' && 'text-purple-400'
          )}
        >
          {endBracket}
        </span>
      )}
    </span>
  );
}

function getValueColor(value: any): string {
  if (typeof value === 'string') return 'text-green-500';
  if (typeof value === 'number') return 'text-orange-500';
  if (typeof value === 'boolean') return 'text-red-500';
  if (value === null) return 'text-gray-500';
  return 'text-gray-300';
}

export function JsonViewer({
  data,
  expandDepth = 2,
  className,
  variant = 'default',
  enableClipboard = true,
  enableSearch = false,
}: JsonViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const jsonString = useMemo(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const variants = {
    default: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm',
    neon: 'bg-gray-950 text-cyan-100 p-4 rounded-lg font-mono text-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/20',
    cyber: 'bg-black text-green-400 p-4 rounded-lg font-mono text-sm border border-green-500/50',
  };

  return (
    <div className={cn('json-viewer', variants[variant], className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold opacity-70">JSON Viewer</h3>
        <div className="flex items-center gap-2">
          {enableSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 opacity-50" />
              <Input
                type="text"
                placeholder="搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs w-40"
              />
            </div>
          )}
          {enableClipboard && (
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-7 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  复制
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* JSON 内容 */}
      <div className="overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap break-words">
          <JsonNode
            data={data}
            depth={0}
            expandDepth={expandDepth}
            variant={variant}
            searchTerm={searchTerm}
          />
        </pre>
      </div>
    </div>
  );
}
