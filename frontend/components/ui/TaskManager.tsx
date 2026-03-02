'use client';

/**
 * 任务管理器组件
 * 支持添加、删除、完成任务，带有进度统计
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Circle, CircleCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

export interface TaskManagerProps {
  initialTasks?: Task[];
  showProgress?: boolean;
  maxTasks?: number;
  className?: string;
}

export function TaskManager({
  initialTasks = [],
  showProgress = true,
  maxTasks = 20,
  className,
}: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityConfig = {
    low: { label: '低', color: 'text-cyber-green', bgColor: 'bg-cyber-green/10', borderColor: 'border-cyber-green/30' },
    medium: { label: '中', color: 'text-cyber-yellow', bgColor: 'bg-cyber-yellow/10', borderColor: 'border-cyber-yellow/30' },
    high: { label: '高', color: 'text-cyber-pink', bgColor: 'bg-cyber-pink/10', borderColor: 'border-cyber-pink/30' },
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || tasks.length >= maxTasks) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setIsAddingTask(false);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className={cn('bg-cyber-dark/80 backdrop-blur-sm border-2 border-cyber-border rounded-2xl overflow-hidden', className)}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">任务管理器</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingTask(!isAddingTask)}
            disabled={tasks.length >= maxTasks}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              tasks.length >= maxTasks
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90'
            )}
          >
            <Plus className="w-5 h-5" />
            添加任务
          </motion.button>
        </div>

        {/* Progress Bar */}
        {showProgress && totalTasks > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-cyber-card rounded-xl border border-cyber-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">完成进度</span>
              <span className="text-sm font-semibold text-white">
                {completedTasks} / {totalTasks}
              </span>
            </div>
            <div className="h-3 bg-cyber-darker rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
            </div>
          </motion.div>
        )}

        {/* Add Task Form */}
        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-cyber-muted rounded-xl border border-cyber-border"
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="任务标题..."
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan mb-3"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="任务描述（可选）..."
                rows={2}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan mb-3 resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <motion.button
                      key={priority}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewTaskPriority(priority)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        newTaskPriority === priority
                          ? `${priorityConfig[priority].bgColor} ${priorityConfig[priority].color} ${priorityConfig[priority].borderColor} border`
                          : 'bg-cyber-dark text-gray-500 hover:text-white'
                      )}
                    >
                      {priorityConfig[priority].label}
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddingTask(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium',
                      !newTaskTitle.trim()
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90'
                    )}
                  >
                    添加
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-500"
              >
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无任务</p>
                <p className="text-sm mt-1">点击上方按钮添加新任务</p>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'p-4 rounded-lg border transition-all',
                    task.completed
                      ? 'bg-cyber-muted border-cyber-border/50 opacity-60'
                      : 'bg-cyber-card border-cyber-border hover:border-cyber-cyan/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleTask(task.id)}
                      className={cn(
                        'flex-shrink-0 mt-0.5 transition-colors',
                        task.completed ? 'text-cyber-green' : 'text-gray-500 hover:text-cyber-cyan'
                      )}
                    >
                      {task.completed ? <CircleCheck className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3
                            className={cn(
                              'font-medium transition-colors',
                              task.completed ? 'text-gray-500 line-through' : 'text-white'
                            )}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p
                              className={cn(
                                'text-sm mt-1',
                                task.completed ? 'text-gray-600' : 'text-gray-400'
                              )}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Priority Badge & Delete */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={cn(
                              'px-2 py-1 rounded text-xs font-medium border',
                              priorityConfig[task.priority].bgColor,
                              priorityConfig[task.priority].color,
                              priorityConfig[task.priority].borderColor
                            )}
                          >
                            {priorityConfig[task.priority].label}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-gray-500 hover:text-cyber-pink transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {tasks.length >= maxTasks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg"
          >
            <p className="text-sm text-cyber-pink text-center">
              已达到最大任务数量限制 ({maxTasks})
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;
