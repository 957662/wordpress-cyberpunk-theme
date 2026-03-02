'use client';

/**
 * Task Manager Component
 * 任务管理组件，支持任务创建、编辑、筛选、拖拽排序
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, Calendar, Tag, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  completedAt?: Date;
  assignee?: string;
}

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
}

interface TaskManagerProps {
  /**
   * 任务列表
   */
  lists: TaskList[];
  /**
   * 更新列表回调
   */
  onListsChange: (lists: TaskList[]) => void;
  /**
   * 创建任务回调
   */
  onCreateTask?: (listId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  /**
   * 更新任务回调
   */
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  /**
   * 删除任务回调
   */
  onDeleteTask?: (taskId: string) => void;
  /**
   * 自定义样式
   */
  className?: string;
}

// 优先级颜色
const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-500',
  medium: 'bg-cyan-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

// 状态颜色
const statusColors: Record<TaskStatus, string> = {
  'todo': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'in-progress': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

// 任务卡片
const TaskCard: React.FC<{
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = () => {
    onUpdate({ title: editedTitle });
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'p-4 rounded-xl border bg-black/50 transition-all hover:bg-black/70',
        statusColors[task.status]
      )}
      draggable
    >
      {/* 头部 */}
      <div className="flex items-start gap-3 mb-2">
        {/* 完成复选框 */}
        <button
          onClick={() => {
            const newStatus = task.status === 'completed' ? 'todo' : 'completed';
            onUpdate({
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date() : undefined,
            });
          }}
          className={cn(
            'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
            task.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-600 hover:border-cyan-500'
          )}
        >
          {task.status === 'completed' && <Check className="w-3 h-3" />}
        </button>

        {/* 标题 */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setEditedTitle(task.title);
                  setIsEditing(false);
                }
              }}
              className="w-full bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-white focus:outline-none"
              autoFocus
            />
          ) : (
            <h4
              className={cn(
                'font-medium text-white',
                task.status === 'completed' && 'line-through opacity-60'
              )}
            >
              {task.title}
            </h4>
          )}
        </div>

        {/* 优先级指示器 */}
        <div className={cn('w-2 h-2 rounded-full', priorityColors[task.priority])} />
      </div>

      {/* 描述 */}
      {task.description && (
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{task.description}</p>
      )}

      {/* 元数据 */}
      <div className="flex items-center gap-3 mt-3">
        {/* 截止日期 */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* 标签 */}
        {task.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-gray-500" />
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
        >
          <Edit2 className="w-3 h-3 text-gray-400" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
        >
          <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
        </button>
      </div>
    </motion.div>
  );
};

// 任务列表列
const TaskColumn: React.FC<{
  list: TaskList;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}> = ({ list, onUpdateTask, onDeleteTask, onAddTask }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = list.tasks.filter(task => {
    if (filter === 'active') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="flex-1 min-w-[300px] max-w-md">
      {/* 列头 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{list.name}</h3>
        <span className="text-sm text-gray-500">{list.tasks.length}</span>
      </div>

      {/* 添加任务按钮 */}
      <button
        onClick={onAddTask}
        className="w-full p-3 mb-4 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-cyan-500/50 hover:text-cyan-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        添加任务
      </button>

      {/* 筛选器 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors',
            filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          )}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('active')}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors',
            filter === 'active' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          )}
        >
          进行中
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors',
            filter === 'completed' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          )}
        >
          已完成
        </button>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(updates) => onUpdateTask(task.id, updates)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const TaskManager: React.FC<TaskManagerProps> = ({
  lists,
  onListsChange,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  className,
}) => {
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');

  // 添加任务列表
  const handleAddList = () => {
    if (!newListName.trim()) return;

    const newList: TaskList = {
      id: `list-${Date.now()}`,
      name: newListName,
      tasks: [],
    };

    onListsChange([...lists, newList]);
    setNewListName('');
    setShowAddList(false);
  };

  // 更新任务
  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const newLists = lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
    onListsChange(newLists);
    onUpdateTask?.(taskId, updates);
  }, [lists, onListsChange, onUpdateTask]);

  // 删除任务
  const handleDeleteTask = useCallback((taskId: string) => {
    const newLists = lists.map(list => ({
      ...list,
      tasks: list.tasks.filter(task => task.id !== taskId),
    }));
    onListsChange(newLists);
    onDeleteTask?.(taskId);
  }, [lists, onListsChange, onDeleteTask]);

  // 添加任务
  const handleAddTask = useCallback((listId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: '新任务',
      status: 'todo',
      priority: 'medium',
      tags: [],
      createdAt: new Date(),
    };

    const newLists = lists.map(list =>
      list.id === listId
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );

    onListsChange(newLists);
    onCreateTask?.(listId, newTask);
  }, [lists, onListsChange, onCreateTask]);

  return (
    <div className={cn('p-6 bg-black/50 rounded-2xl border border-cyan-500/30', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">任务管理</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <SortAsc className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setShowAddList(!showAddList)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            添加列表
          </button>
        </div>
      </div>

      {/* 添加列表输入框 */}
      <AnimatePresence>
        {showAddList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddList();
                }}
                placeholder="列表名称..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddList}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                添加
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 任务列 */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {lists.map(list => (
          <TaskColumn
            key={list.id}
            list={list}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={() => handleAddTask(list.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
