'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';

export interface TreeNode {
  id: string;
  label: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeSelectProps {
  data: TreeNode[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showIcon?: boolean;
  expandAll?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    border: 'border-cyan-500/30 focus:border-cyan-500',
    hover: 'hover:bg-cyan-500/10',
    selected: 'bg-cyan-500/20 text-cyan-400',
    icon: 'text-cyan-400',
  },
  purple: {
    border: 'border-purple-500/30 focus:border-purple-500',
    hover: 'hover:bg-purple-500/10',
    selected: 'bg-purple-500/20 text-purple-400',
    icon: 'text-purple-400',
  },
  pink: {
    border: 'border-pink-500/30 focus:border-pink-500',
    hover: 'hover:bg-pink-500/10',
    selected: 'bg-pink-500/20 text-pink-400',
    icon: 'text-pink-400',
  },
  green: {
    border: 'border-green-500/30 focus:border-green-500',
    hover: 'hover:bg-green-500/10',
    selected: 'bg-green-500/20 text-green-400',
    icon: 'text-green-400',
  },
};

const sizeClasses = {
  sm: { trigger: 'h-8 text-sm', tree: 'text-sm', icon: 'w-3 h-3' },
  md: { trigger: 'h-10 text-base', tree: 'text-base', icon: 'w-4 h-4' },
  lg: { trigger: 'h-12 text-lg', tree: 'text-lg', icon: 'w-5 h-5' },
};

export function TreeSelect({
  data,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '请选择...',
  size = 'md',
  disabled = false,
  color = 'cyan',
  showIcon = true,
  expandAll = false,
  className,
}: TreeSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    expandAll ? new Set(data.map(n => n.id)) : new Set()
  );

  const value = controlledValue ?? internalValue;
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  // Find selected node
  const findNode = (nodes: TreeNode[], targetValue: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.value === targetValue) return node;
      if (node.children) {
        const found = findNode(node.children, targetValue);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNode(data, value);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleSelect = (node: TreeNode) => {
    if (node.disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(node.value);
    }
    onChange?.(node.value);
    setIsOpen(false);
  };

  const toggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpand(nodeId);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = node.value === value;

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all',
            colors.hover,
            node.disabled && 'opacity-50 cursor-not-allowed',
            isSelected && colors.selected,
            !node.disabled && 'hover:pl-4'
          )}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => !node.disabled && handleSelect(node)}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => toggleNode(node.id, e)}
              className={cn(
                'flex-shrink-0 p-0.5 rounded transition-all',
                colors.icon
              )}
            >
              {isExpanded ? (
                <ChevronDown className={sizes.icon} />
              ) : (
                <ChevronRight className={sizes.icon} />
              )}
            </button>
          )}

          {/* Node Label */}
          <span className={cn('flex-1', sizes.tree)}>
            {node.label}
          </span>

          {/* Selected Indicator */}
          {isSelected && !node.disabled && (
            <Check className={cn('flex-shrink-0', sizes.icon, colors.icon)} />
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-4 rounded-xl border outline-none transition-all',
          'bg-gray-900/50 backdrop-blur-sm',
          sizes.trigger,
          colors.border,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={selectedNode ? '' : 'text-gray-400'}>
          {selectedNode ? selectedNode.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            sizes.icon,
            'transition-transform',
            isOpen && 'transform rotate-180',
            colors.icon
          )}
        />
      </button>

      {/* Dropdown Tree */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2 p-3 rounded-xl border shadow-xl',
            'bg-gray-900/95 backdrop-blur-sm',
            'animate-in fade-in slide-in-from-top-2 duration-200',
            colors.border,
            'max-h-80 overflow-y-auto custom-scrollbar'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {data.map(node => renderTreeNode(node))}
        </div>
      )}
    </div>
  );
}
