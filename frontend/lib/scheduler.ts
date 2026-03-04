/**
 * 任务调度器
 * 用于管理异步任务、队列和优先级
 */

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Task<T = any> {
  id: string;
  fn: () => Promise<T>;
  priority: TaskPriority;
  timeout?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
}

export interface ScheduledTask<T = any> extends Task<T> {
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  result?: T;
  error?: Error;
  attempt: number;
}

class TaskScheduler {
  private queue: Map<string, ScheduledTask> = new Map();
  private running: Set<string> = new Set();
  private concurrency: number;
  private isProcessing = false;

  constructor(concurrency: number = 3) {
    this.concurrency = concurrency;
  }

  /**
   * 添加任务到队列
   */
  add<T>(task: Task<T>): string {
    const scheduledTask: ScheduledTask<T> = {
      ...task,
      status: 'pending',
      createdAt: Date.now(),
      attempt: 0,
    };

    this.queue.set(task.id, scheduledTask);
    this.process();

    return task.id;
  }

  /**
   * 批量添加任务
   */
  addAll<T>(tasks: Task<T>[]): string[] {
    return tasks.map((task) => this.add(task));
  }

  /**
   * 取消任务
   */
  cancel(taskId: string): boolean {
    const task = this.queue.get(taskId);
    if (!task || task.status === 'running') {
      return false;
    }

    this.queue.delete(taskId);
    return true;
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.queue.clear();
  }

  /**
   * 获取任务状态
   */
  getTask(taskId: string): ScheduledTask | undefined {
    return this.queue.get(taskId);
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): ScheduledTask[] {
    return Array.from(this.queue.values());
  }

  /**
   * 获取待处理任务
   */
  getPendingTasks(): ScheduledTask[] {
    return this.getAllTasks().filter((task) => task.status === 'pending');
  }

  /**
   * 获取运行中任务
   */
  getRunningTasks(): ScheduledTask[] {
    return this.getAllTasks().filter((task) => task.status === 'running');
  }

  /**
   * 处理队列
   */
  private async process(): Promise<void> {
    if (this.isProcessing || this.running.size >= this.concurrency) {
      return;
    }

    this.isProcessing = true;

    while (this.running.size < this.concurrency) {
      const task = this.getNextTask();
      if (!task) {
        break;
      }

      this.running.add(task.id);
      this.execute(task);
    }

    this.isProcessing = false;
  }

  /**
   * 获取下一个任务
   */
  private getNextTask(): ScheduledTask | undefined {
    const pendingTasks = this.getPendingTasks();
    if (pendingTasks.length === 0) {
      return undefined;
    }

    // 按优先级排序
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    pendingTasks.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.createdAt - b.createdAt;
    });

    return pendingTasks[0];
  }

  /**
   * 执行任务
   */
  private async execute(task: ScheduledTask): Promise<void> {
    task.status = 'running';
    task.startedAt = Date.now();
    task.attempt++;

    try {
      const timeout = task.timeout || 30000;
      const result = await this.withTimeout(task.fn(), timeout);

      task.status = 'completed';
      task.completedAt = Date.now();
      task.result = result;

      task.onSuccess?.(result);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // 重试逻辑
      if (task.retries && task.attempt < task.retries) {
        task.status = 'pending';
        task.attempt++;
        task.error = err;
        task.onError?.(err);

        // 延迟重试
        setTimeout(() => {
          this.running.delete(task.id);
          this.process();
        }, Math.pow(2, task.attempt) * 1000);

        return;
      }

      task.status = 'failed';
      task.completedAt = Date.now();
      task.error = err;

      task.onError?.(err);
    } finally {
      this.running.delete(task.id);
      this.process();
    }
  }

  /**
   * 带超时的 Promise
   */
  private async withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Task timeout after ${timeout}ms`)), timeout)
      ),
    ]);
  }

  /**
   * 等待所有任务完成
   */
  async waitForAll(): Promise<ScheduledTask[]> {
    return new Promise((resolve) => {
      const check = () => {
        const pendingTasks = this.getPendingTasks();
        const runningTasks = this.getRunningTasks();

        if (pendingTasks.length === 0 && runningTasks.length === 0) {
          resolve(this.getAllTasks());
        } else {
          setTimeout(check, 100);
        }
      };

      check();
    });
  }
}

// 导出单例
export const scheduler = new TaskScheduler();

// 导出便捷函数
export const scheduleTask = <T>(task: Task<T>): string => scheduler.add(task);
export const scheduleTasks = <T>(tasks: Task<T>[]): string[] => scheduler.addAll(tasks);
export const cancelTask = (taskId: string): boolean => scheduler.cancel(taskId);
export const getTaskStatus = (taskId: string): ScheduledTask | undefined =>
  scheduler.getTask(taskId);
export const waitForAllTasks = (): Promise<ScheduledTask[]> => scheduler.waitForAll();

/**
 * 创建一个带优先级的异步任务
 */
export function createTask<T>(
  id: string,
  fn: () => Promise<T>,
  options?: Partial<Task<T>>
): Task<T> {
  return {
    id,
    fn,
    priority: options?.priority || 'normal',
    timeout: options?.timeout || 30000,
    retries: options?.retries || 0,
    onProgress: options?.onProgress,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  };
}

/**
 * 批量任务执行器
 */
export class BatchExecutor<T> {
  private scheduler: TaskScheduler;

  constructor(concurrency: number = 3) {
    this.scheduler = new TaskScheduler(concurrency);
  }

  async execute(items: T[], executor: (item: T) => Promise<any>): Promise<any[]> {
    const tasks = items.map((item, index) =>
      createTask(
        `batch-${index}`,
        () => executor(item),
        { priority: 'normal' }
      )
    );

    const taskIds = this.scheduler.addAll(tasks);
    await this.scheduler.waitForAll();

    return taskIds.map((id) => this.scheduler.getTask(id)?.result);
  }
}
