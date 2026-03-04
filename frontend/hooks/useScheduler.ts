import { useState, useCallback, useRef } from 'react';
import {
  scheduler,
  createTask,
  type Task,
  type ScheduledTask,
  type TaskPriority,
} from '@/lib/scheduler';

export interface UseSchedulerReturn {
  addTask: <T>(fn: () => Promise<T>, priority?: TaskPriority) => string;
  cancelTask: (taskId: string) => boolean;
  getTask: (taskId: string) => ScheduledTask | undefined;
  getAllTasks: () => ScheduledTask[];
  clearTasks: () => void;
  isProcessing: boolean;
}

/**
 * 任务调度器 Hook
 */
export function useScheduler(): UseSchedulerReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const tasksRef = useRef<Map<string, ScheduledTask>>(new Map());

  const addTask = useCallback(<T,>(fn: () => Promise<T>, priority: TaskPriority = 'normal') => {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const task: Task<T> = createTask(taskId, fn, {
      priority,
      onSuccess: (result) => {
        const scheduledTask = tasksRef.current.get(taskId);
        if (scheduledTask) {
          tasksRef.current.set(taskId, { ...scheduledTask, result, status: 'completed' });
        }
        checkProcessing();
      },
      onError: (error) => {
        const scheduledTask = tasksRef.current.get(taskId);
        if (scheduledTask) {
          tasksRef.current.set(taskId, { ...scheduledTask, error, status: 'failed' });
        }
        checkProcessing();
      },
    });

    scheduler.add(task);
    setIsProcessing(true);

    return taskId;
  }, []);

  const cancelTask = useCallback((taskId: string) => {
    const cancelled = scheduler.cancel(taskId);
    if (cancelled) {
      tasksRef.current.delete(taskId);
      checkProcessing();
    }
    return cancelled;
  }, []);

  const getTask = useCallback((taskId: string) => {
    return tasksRef.current.get(taskId) || scheduler.getTask(taskId);
  }, []);

  const getAllTasks = useCallback(() => {
    return Array.from(tasksRef.current.values());
  }, []);

  const clearTasks = useCallback(() => {
    scheduler.clear();
    tasksRef.current.clear();
    setIsProcessing(false);
  }, []);

  const checkProcessing = useCallback(() => {
    const hasRunningOrPending = Array.from(tasksRef.current.values()).some(
      (task) => task.status === 'running' || task.status === 'pending'
    );
    setIsProcessing(hasRunningOrPending);
  }, []);

  return {
    addTask,
    cancelTask,
    getTask,
    getAllTasks,
    clearTasks,
    isProcessing,
  };
}

/**
 * 批量任务 Hook
 */
export function useBatchTasks<T>(concurrency: number = 3) {
  const [results, setResults] = useState<Map<number, any>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Map<number, Error>>(new Map());

  const execute = useCallback(
    async (items: T[], executor: (item: T, index: number) => Promise<any>) => {
      setIsProcessing(true);
      setResults(new Map());
      setErrors(new Map());

      const tasks = items.map((item, index) =>
        createTask(`batch-${index}`, () => executor(item, index), {
          priority: 'normal',
          onSuccess: (result) => {
            setResults((prev) => new Map(prev).set(index, result));
          },
          onError: (error) => {
            setErrors((prev) => new Map(prev).set(index, error));
          },
        })
      );

      scheduler.addAll(tasks);
      await scheduler.waitForAll();

      setIsProcessing(false);
    },
    [concurrency]
  );

  const reset = useCallback(() => {
    setResults(new Map());
    setErrors(new Map());
    setIsProcessing(false);
  }, []);

  return {
    execute,
    results,
    errors,
    isProcessing,
    reset,
  };
}
