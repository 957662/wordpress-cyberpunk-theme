'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TreeNode {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
  isExpanded?: boolean
  isSelected?: boolean
  disabled?: boolean
  data?: any
}

export interface TreeViewProps {
  /** 树形数据 */
  data: TreeNode[]
  /** 节点点击回调 */
  onNodeClick?: (node: TreeNode) => void
  /** 节点展开/收起回调 */
  onNodeToggle?: (node: TreeNode) => void
  /** 是否显示图标 */
  showIcon?: boolean
  /** 是否支持多选 */
  multiple?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 默认展开所有 */
  defaultExpandAll?: boolean
}

/**
 * 树形视图组件
 *
 * @example
 * ```tsx
 * <TreeView
 *   data={[
 *     {
 *       id: '1',
 *       label: '根目录',
 *       children: [
 *         { id: '1-1', label: '子项 1' },
 *         { id: '1-2', label: '子项 2' },
 *       ],
 *     },
 *   ]}
 *   onNodeClick={(node) => console.log(node)}
 * />
 * ```
 */
export function TreeView({
  data,
  onNodeClick,
  onNodeToggle,
  showIcon = true,
  multiple = false,
  className,
  defaultExpandAll = false,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(defaultExpandAll ? data.map(n => n.id) : [])
  )
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const handleToggle = (node: TreeNode) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(node.id)) {
      newExpanded.delete(node.id)
    } else {
      newExpanded.add(node.id)
    }
    setExpandedNodes(newExpanded)
    onNodeToggle?.(node)
  }

  const handleClick = (node: TreeNode) => {
    if (node.disabled) return

    if (multiple) {
      setSelectedNode(prev => prev === node.id ? null : node.id)
    } else {
      setSelectedNode(node.id)
    }
    onNodeClick?.(node)
  }

  return (
    <div className={cn('space-y-1', className)}>
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          isExpanded={expandedNodes.has(node.id)}
          isSelected={selectedNode === node.id}
          showIcon={showIcon}
          onToggle={handleToggle}
          onClick={handleClick}
          expandedNodes={expandedNodes}
        />
      ))}
    </div>
  )
}

interface TreeNodeProps {
  node: TreeNode
  level: number
  isExpanded: boolean
  isSelected: boolean
  showIcon: boolean
  onToggle: (node: TreeNode) => void
  onClick: (node: TreeNode) => void
  expandedNodes: Set<string>
}

function TreeNode({
  node,
  level,
  isExpanded,
  isSelected,
  showIcon,
  onToggle,
  onClick,
  expandedNodes,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const paddingLeft = level * 20

  const defaultIcon = hasChildren ? (
    isExpanded ? (
      <FolderOpen className="w-4 h-4 text-cyber-cyan" />
    ) : (
      <Folder className="w-4 h-4 text-cyber-cyan" />
    )
  ) : (
    <File className="w-4 h-4 text-gray-400" />
  )

  return (
    <div>
      {/* 节点 */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer',
          'hover:bg-cyber-cyan/10',
          isSelected && 'bg-cyber-cyan/20 text-cyber-cyan',
          node.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
        )}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        onClick={() => {
          if (hasChildren && !node.disabled) {
            onToggle(node)
          }
          onClick(node)
        }}
      >
        {/* 展开/收起图标 */}
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
        )}

        {!hasChildren && <div className="w-4" />}

        {/* 节点图标 */}
        {showIcon && (
          <div className="flex-shrink-0">
            {node.icon || defaultIcon}
          </div>
        )}

        {/* 节点标签 */}
        <span className="text-sm text-gray-300 truncate flex-1">
          {node.label}
        </span>
      </motion.div>

      {/* 子节点 */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                isExpanded={expandedNodes.has(child.id)}
                isSelected={false}
                showIcon={showIcon}
                onToggle={onToggle}
                onClick={onClick}
                expandedNodes={expandedNodes}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * 文件树组件（专用版本）
 */
export interface FileNode {
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
  size?: number
  modified?: string
}

export interface FileTreeProps {
  /** 文件树数据 */
  files: FileNode[]
  /** 文件点击回调 */
  onFileClick?: (file: FileNode) => void
  /** 文件夹点击回调 */
  onFolderClick?: (folder: FileNode) => void
  /** 自定义样式类名 */
  className?: string
  /** 是否显示文件信息 */
  showInfo?: boolean
}

/**
 * 文件树组件，专门用于显示文件结构
 *
 * @example
 * ```tsx
 * <FileTree
 *   files={[
 *     {
 *       name: 'src',
 *       type: 'folder',
 *       path: '/src',
 *       children: [
 *         { name: 'index.tsx', type: 'file', path: '/src/index.tsx' },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
export function FileTree({
  files,
  onFileClick,
  onFolderClick,
  className,
  showInfo = false,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path)
    const paddingLeft = level * 20

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer',
              'hover:bg-cyber-cyan/10'
            )}
            style={{ paddingLeft: `${paddingLeft + 8}px` }}
            onClick={() => {
              toggleFolder(node.path)
              onFolderClick?.(node)
            }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <Folder className="w-4 h-4 text-cyber-cyan" />
            )}
            <span className="text-sm text-gray-300">{node.name}</span>
          </div>

          <AnimatePresence>
            {isExpanded && node.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {node.children.map(child => renderFileNode(child, level + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    return (
      <div
        key={node.path}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer',
          'hover:bg-cyber-cyan/10'
        )}
        style={{ paddingLeft: `${paddingLeft + 32}px` }}
        onClick={() => onFileClick?.(node)}
      >
        <File className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300 flex-1">{node.name}</span>
        {showInfo && node.size && (
          <span className="text-xs text-gray-500">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {files.map(file => renderFileNode(file))}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default TreeView
