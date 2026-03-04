'use client';

import React, { useEffect, useState } from 'react';
import { useScheduler } from '@/hooks/useScheduler';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  name: string;
  fn: () => Promise<any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export function TaskQueue({ tasks }: { tasks: Task[] }) {
  const { addTask, getAllTasks, clearTasks, isProcessing } = useScheduler();
  const [queuedTasks, setQueuedTasks] = useState<string[]>([]);

  useEffect(() => {
    // 自动添加所有任务
    const taskIds = tasks.map((task) =>
      addTask(
        () => task.fn(),
        task.priority || 'normal'
      )
    );
    setQueuedTasks(taskIds);

    return () => {
      clearTasks();
    };
  }, [tasks, addTask, clearTasks]);

  const allTasks = getAllTasks();

  return (
    <div className="space-y-4">
      {/* 任务列表 */}
      <div className="space-y-2">
        {allTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between p-3 bg-black/30 rounded border border-cyber-cyan/20">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            总任务: <span className="text-cyber-cyan">{allTasks.length}</span>
          </span>
          <span className="text-gray-400">
            完成: <span className="text-green-500">{allTasks.filter((t) => t.status === 'completed').length}</span>
          </span>
          <span className="text-gray-400">
            失败: <span className="text-red-500">{allTasks.filter((t) => t.status === 'failed').length}</span>
          </span>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-cyber-cyan text-sm">处理中...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'running':
        return 'text-cyber-cyan';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'running':
        return '⚡';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'normal':
        return 'text-yellow-500';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-3 bg-black/30 rounded border border-cyber-purple/20 hover:border-cyber-cyan/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">{getStatusIcon(task.status)}</span>
          <div>
            <p className="text-white font-medium">{task.id}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn('text-xs', getStatusColor(task.status))}>
                {task.status}
              </span>
              <span className={cn('text-xs', getPriorityColor(task.priority))}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>
        {task.status === 'running' && (
          <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {task.error && (
        <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/20">
          <p className="text-red-400 text-sm">{task.error.message}</p>
        </div>
      )}
    </div>
  );
}

/**
 * 进度条组件
 */
export function TaskProgressBar({
  current,
  total,
  className,
}: {
  current: number;
  total: number;
  className?: string;
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">进度</span>
        <span className="text-sm text-cyber-cyan">
          {current} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}
