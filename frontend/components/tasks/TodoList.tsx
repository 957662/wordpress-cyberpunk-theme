'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Calendar, Flag, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
  createdAt: Date;
}

interface TodoListProps {
  todos: TodoItem[];
  onAdd?: (title: string, description?: string) => void;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<TodoItem>) => void;
  showCompleted?: boolean;
  className?: string;
}

export function TodoList({
  todos,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
  showCompleted = true,
  className,
}: TodoListProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAdd = () => {
    if (newTodoTitle.trim()) {
      onAdd?.(newTodoTitle.trim(), newTodoDescription.trim() || undefined);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Add New Todo */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
        {!isAdding ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加新任务</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="任务标题..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            <textarea
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="描述（可选）..."
              rows={2}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsAdding(false);
                  setNewTodoTitle('');
                  setNewTodoDescription('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                disabled={!newTodoTitle.trim()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                添加任务
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            总计: <span className="text-white font-medium">{todos.length}</span>
          </span>
          <span className="text-gray-400">
            进行中: <span className="text-cyan-400 font-medium">{activeCount}</span>
          </span>
          <span className="text-gray-400">
            已完成: <span className="text-green-400 font-medium">{completedCount}</span>
          </span>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              )}
            >
              {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              index={index}
            />
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-gray-500"
          >
            <p>
              {filter === 'all'
                ? '暂无任务'
                : filter === 'active'
                ? '没有进行中的任务'
                : '没有已完成的任务'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: TodoItem;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<TodoItem>) => void;
  index: number;
}

function TodoItem({ todo, onToggle, onDelete, onUpdate, index }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    low: 'text-blue-400 bg-blue-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    high: 'text-red-400 bg-red-400/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group relative overflow-hidden rounded-lg border transition-all duration-200',
        todo.completed
          ? 'bg-gray-800/30 border-gray-700/50'
          : 'bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-cyan-500/30'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle?.(todo.id)}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors',
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-600 hover:border-cyan-500'
          )}
        >
          {todo.completed && <Check className="w-4 h-4 text-white" />}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'font-medium transition-colors',
              todo.completed ? 'text-gray-500 line-through' : 'text-white'
            )}
          >
            {todo.title}
          </div>

          {/* Description */}
          {(todo.description || todo.dueDate || todo.tags) && (
            <AnimatePresence>
              {(isExpanded || todo.description) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {todo.description && (
                    <p className="mt-2 text-sm text-gray-400">{todo.description}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {todo.priority && (
                      <div className="flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            priorityColors[todo.priority]
                          )}
                        >
                          {todo.priority === 'low' ? '低' : todo.priority === 'medium' ? '中' : '高'}
                        </span>
                      </div>
                    )}

                    {todo.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-gray-500" />
                        <div className="flex gap-1">
                          {todo.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle expand"
          >
            <span className="text-sm">{isExpanded ? '收起' : '展开'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete?.(todo.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            aria-label="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Priority Indicator */}
      {todo.priority && todo.priority !== 'low' && !todo.completed && (
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1',
            todo.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
          )}
        />
      )}
    </motion.div>
  );
}
