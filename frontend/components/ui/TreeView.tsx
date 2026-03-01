/**
 * 树形视图组件
 * 层级数据展示
 */

'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronIcon } from '@/components/icons';

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  data?: any;
}

export interface TreeViewProps {
  data: TreeNode[];
  defaultExpanded?: string[];
  selectable?: boolean;
  defaultSelected?: string;
  showIcon?: boolean;
  className?: string;
  onSelect?: (node: TreeNode) => void;
  onExpand?: (node: TreeNode) => void;
  onCollapse?: (node: TreeNode) => void;
}

export function TreeView({
  data,
  defaultExpanded = [],
  selectable = true,
  defaultSelected,
  showIcon = true,
  className,
  onSelect,
  onExpand,
  onCollapse,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const [selected, setSelected] = useState<string | undefined>(defaultSelected);

  const toggleExpand = (nodeId: string, node: TreeNode) => {
    const newExpanded = new Set(expanded);

    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
      onCollapse?.(node);
    } else {
      newExpanded.add(nodeId);
      onExpand?.(node);
    }

    setExpanded(newExpanded);
  };

  const handleSelect = (node: TreeNode) => {
    if (!selectable || node.disabled) return;

    setSelected(node.id);
    onSelect?.(node);
  };

  return (
    <div className={className}>
      {data.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          selected={selected}
          showIcon={showIcon}
          onToggleExpand={toggleExpand}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  expanded: Set<string>;
  selected?: string;
  showIcon: boolean;
  onToggleExpand: (nodeId: string, node: TreeNode) => void;
  onSelect: (node: TreeNode) => void;
}

function TreeNodeItem({
  node,
  level,
  expanded,
  selected,
  showIcon,
  onToggleExpand,
  onSelect,
}: TreeNodeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;

  return (
    <div>
      {/* 节点 */}
      <div
        className={cn(
          'flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors',
          'hover:bg-cyber-cyan/10',
          isSelected && 'bg-cyber-cyan/20 text-cyber-cyan',
          node.disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            onToggleExpand(node.id, node);
          }
          onSelect(node);
        }}
      >
        {/* 展开/折叠图标 */}
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronIcon className="w-4 h-4 text-cyber-muted" />
          </motion.div>
        )}

        {/* 占位（没有子节点时） */}
        {!hasChildren && <div className="w-4 h-4 flex-shrink-0" />}

        {/* 节点图标 */}
        {showIcon && node.icon && (
          <div className="flex-shrink-0 text-cyber-muted">{node.icon}</div>
        )}

        {/* 节点标签 */}
        <span className="text-sm flex-1 truncate">{node.label}</span>
      </div>

      {/* 子节点 */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children!.map((child) => (
              <TreeNodeItem
                key={child.id}
                node={child}
                level={level + 1}
                expanded={expanded}
                selected={selected}
                showIcon={showIcon}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 文件树样式
export interface FileTreeProps {
  files: TreeNode[];
  className?: string;
  onSelect?: (node: TreeNode) => void;
}

export function FileTree({ files, className, onSelect }: FileTreeProps) {
  return (
    <TreeView
      data={files}
      showIcon
      selectable
      className={className}
      onSelect={onSelect}
    />
  );
}

// 目录树样式
export interface FolderTreeProps {
  folders: TreeNode[];
  defaultExpanded?: string[];
  className?: string;
  onSelect?: (node: TreeNode) => void;
}

export function FolderTree({
  folders,
  defaultExpanded,
  className,
  onSelect,
}: FolderTreeProps) {
  return (
    <TreeView
      data={folders}
      defaultExpanded={defaultExpanded}
      showIcon
      selectable
      className={className}
      onSelect={onSelect}
    />
  );
}
