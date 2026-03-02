/**
 * 看板管理组件
 * 支持拖拽、列管理、任务卡片、筛选
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  tags?: string[];
  dueDate?: Date;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
  limit?: number;
}

export interface KanbanBoardProps {
  columns: Column[];
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onColumnAdd?: (title: string) => void;
  onColumnDelete?: (columnId: string) => void;
  allowAdding?: boolean;
  allowEditing?: boolean;
  allowDeleting?: boolean;
  showTaskCount?: boolean;
  className?: string;
}

export function KanbanBoard({
  columns,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
  onColumnAdd,
  onColumnDelete,
  allowAdding = true,
  allowEditing = true,
  allowDeleting = true,
  showTaskCount = true,
  className,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; fromColumn: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState<string | null>(null);

  const handleDragStart = (taskId: string, columnId: string) => {
    setDraggedTask({ taskId, fromColumn: columnId });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (columnId: string) => {
    if (draggedTask && draggedTask.fromColumn !== columnId) {
      onTaskMove?.(draggedTask.taskId, draggedTask.fromColumn, columnId);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        title: newTaskTitle,
        status: columnId,
        createdAt: new Date(),
      };
      onTaskUpdate?.(newTask.id, newTask);
      setNewTaskTitle('');
      setShowAddTask(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      onTaskDelete?.(taskId);
    }
  };

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          draggedTask={draggedTask}
          dragOverColumn={dragOverColumn}
          editingTask={editingTask}
          showAddTask={showAddTask}
          newTaskTitle={newTaskTitle}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onEditTask={setEditingTask}
          onShowAddTask={setShowAddTask}
          onAddTask={handleAddTask}
          onNewTaskTitleChange={setNewTaskTitle}
          onDeleteTask={allowDeleting ? handleDeleteTask : undefined}
          onTaskUpdate={onTaskUpdate}
          showTaskCount={showTaskCount}
          limit={column.limit}
        />
      ))}

      {allowAdding && onColumnAdd && (
        <AddColumnButton onAdd={onColumnAdd} />
      )}
    </div>
  );
}

// 看板列组件
function KanbanColumn({
  column,
  draggedTask,
  dragOverColumn,
  editingTask,
  showAddTask,
  newTaskTitle,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEditTask,
  onShowAddTask,
  onAddTask,
  onNewTaskTitleChange,
  onDeleteTask,
  onTaskUpdate,
  showTaskCount,
  limit,
}: any) {
  const isDraggingOver = dragOverColumn === column.id;
  const isFull = limit && column.tasks.length >= limit;

  return (
    <div
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={() => onDrop(column.id)}
      className={cn(
        'flex-shrink-0 w-80 flex flex-col',
        'bg-cyber-purple/5 border-2 rounded-xl transition-all',
        isDraggingOver ? 'border-cyber-cyan bg-cyber-cyan/10' : 'border-cyber-purple/30'
      )}
    >
      {/* 列标题 */}
      <div className="p-4 border-b border-cyber-purple/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={cn('w-3 h-3 rounded-full', column.color || 'bg-cyber-cyan')}
            />
            <h3 className="font-semibold">{column.title}</h3>
            {showTaskCount && (
              <span className="px-2 py-0.5 bg-cyber-purple/20 rounded-full text-sm">
                {column.tasks.length}
                {limit && ` / ${limit}`}
              </span>
            )}
          </div>
        </div>

        {limit && column.tasks.length >= limit && (
          <p className="text-xs text-cyber-pink">已达到任务上限</p>
        )}
      </div>

      {/* 任务列表 */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        <AnimatePresence>
          {column.tasks.map(task => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              isDragging={draggedTask?.taskId === task.id}
              isEditing={editingTask?.id === task.id}
              onDragStart={() => onDragStart(task.id, column.id)}
              onDragEnd={onDragEnd}
              onEdit={() => onEditTask(task)}
              onSave={(updates) => {
                onTaskUpdate?.(task.id, updates);
                onEditTask(null);
              }}
              onCancel={() => onEditTask(null)}
              onDelete={onDeleteTask}
            />
          ))}
        </AnimatePresence>

        {column.tasks.length === 0 && !isFull && (
          <div className="text-center py-8 text-gray-400 text-sm">
            拖拽任务到这里
          </div>
        )}
      </div>

      {/* 添加任务 */}
      {showAddTask === column.id ? (
        <div className="p-3 border-t border-cyber-purple/30">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => onNewTaskTitleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddTask(column.id);
              if (e.key === 'Escape') onShowAddTask(null);
            }}
            placeholder="输入任务标题..."
            autoFocus
            className="w-full px-3 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onAddTask(column.id)}
              className="flex-1 px-3 py-1.5 bg-cyber-cyan text-cyber-dark rounded text-sm hover:bg-cyber-cyan/90"
            >
              添加
            </button>
            <button
              onClick={() => onShowAddTask(null)}
              className="px-3 py-1.5 border border-cyber-purple/30 rounded text-sm hover:bg-cyber-purple/10"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onShowAddTask(column.id)}
          disabled={isFull}
          className={cn(
            'm-3 p-2 rounded-lg border-2 border-dashed transition-all text-sm',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'border-cyber-purple/30 text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
          )}
        >
          + 添加任务
        </button>
      )}
    </div>
  );
}

// 任务卡片组件
function KanbanTaskCard({
  task,
  isDragging,
  isEditing,
  onDragStart,
  onDragEnd,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: any) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const priorityColors = {
    low: 'bg-cyber-green/20 text-cyber-green border-cyber-green',
    medium: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow',
    high: 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink',
    urgent: 'bg-cyber-pink/40 text-white border-cyber-pink',
  };

  return (
    <motion.div
      draggable={!isEditing}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={!isEditing ? { y: -2 } : undefined}
      className={cn(
        'bg-cyber-dark border-2 rounded-lg p-3 cursor-pointer transition-all',
        isDragging ? 'opacity-50 rotate-2' : '',
        isEditing ? 'border-cyber-cyan' : 'border-cyber-purple/20 hover:border-cyber-purple/50'
      )}
      onClick={() => !isEditing && onEdit()}
    >
      {isEditing ? (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 bg-cyber-purple/10 rounded border border-cyber-purple/30 focus:border-cyber-cyan focus:outline-none"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="添加描述..."
            rows={2}
            className="w-full px-2 py-1 bg-cyber-purple/10 rounded border border-cyber-purple/30 focus:border-cyber-cyan focus:outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSave({ title, description })}
              className="flex-1 px-2 py-1 bg-cyber-cyan text-cyber-dark rounded text-sm"
            >
              保存
            </button>
            <button
              onClick={onCancel}
              className="px-2 py-1 border border-cyber-purple/30 rounded text-sm"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <>
          <h4 className="font-medium mb-2">{task.title}</h4>

          {task.description && (
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {task.priority && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded border',
                    priorityColors[task.priority]
                  )}
                >
                  {task.priority}
                </span>
              )}

              {task.tags?.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-cyber-purple/20 text-cyber-purple rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="p-1 text-gray-400 hover:text-cyber-pink transition-colors"
              >
                🗑
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

// 添加列按钮
function AddColumnButton({ onAdd }: { onAdd: (title: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex-shrink-0 w-80">
      {isAdding ? (
        <div className="bg-cyber-purple/5 border-2 border-dashed border-cyber-purple/30 rounded-xl p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            placeholder="列标题..."
            autoFocus
            className="w-full px-3 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-3 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90"
            >
              添加列
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 border border-cyber-purple/30 rounded-lg hover:bg-cyber-purple/10"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full h-full min-h-[200px] border-2 border-dashed border-cyber-purple/30 rounded-xl flex items-center justify-center text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">+</div>
            <div>添加列</div>
          </div>
        </button>
      )}
    </div>
  );
}
