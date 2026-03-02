"""
Async Task Service
异步任务处理服务，支持后台任务和定时任务
"""

from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Callable, Awaitable
from enum import Enum
import asyncio
import logging
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


class TaskStatus(str, Enum):
    """任务状态枚举"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskPriority(int, Enum):
    """任务优先级"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    URGENT = 4


@dataclass
class TaskResult:
    """任务执行结果"""
    success: bool
    data: Any = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration: Optional[float] = None


@dataclass
class AsyncTask:
    """异步任务定义"""
    task_id: str
    func: Callable[..., Awaitable[Any]]
    args: tuple = field(default_factory=tuple)
    kwargs: Dict[str, Any] = field(default_factory=dict)
    priority: TaskPriority = TaskPriority.NORMAL
    status: TaskStatus = TaskStatus.PENDING
    result: Optional[TaskResult] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    max_retries: int = 3
    retry_count: int = 0
    timeout: Optional[float] = None

    @property
    def duration(self) -> Optional[float]:
        """获取任务执行时长（秒）"""
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return None


class AsyncTaskService:
    """
    异步任务服务
    管理和执行异步任务，支持重试、超时和优先级
    """

    def __init__(self):
        self._tasks: Dict[str, AsyncTask] = {}
        self._queue: asyncio.PriorityQueue = asyncio.PriorityQueue()
        self._workers: list = []
        self._max_workers = 10
        self._running = False
        self._lock = asyncio.Lock()

    async def create_task(
        self,
        task_id: str,
        func: Callable[..., Awaitable[Any]],
        *args,
        priority: TaskPriority = TaskPriority.NORMAL,
        max_retries: int = 3,
        timeout: Optional[float] = None,
        **kwargs
    ) -> AsyncTask:
        """
        创建新任务

        Args:
            task_id: 任务ID
            func: 异步函数
            *args: 位置参数
            priority: 任务优先级
            max_retries: 最大重试次数
            timeout: 超时时间（秒）
            **kwargs: 关键字参数

        Returns:
            AsyncTask: 创建的任务对象
        """
        task = AsyncTask(
            task_id=task_id,
            func=func,
            args=args,
            kwargs=kwargs,
            priority=priority,
            max_retries=max_retries,
            timeout=timeout
        )

        async with self._lock:
            self._tasks[task_id] = task
            await self._queue.put((-priority.value, task.created_at.timestamp(), task))

        logger.info(f"Task created: {task_id} with priority {priority.name}")
        return task

    async def get_task(self, task_id: str) -> Optional[AsyncTask]:
        """获取任务信息"""
        async with self._lock:
            return self._tasks.get(task_id)

    async def get_all_tasks(self) -> list[AsyncTask]:
        """获取所有任务"""
        async with self._lock:
            return list(self._tasks.values())

    async def cancel_task(self, task_id: str) -> bool:
        """取消任务"""
        async with self._lock:
            task = self._tasks.get(task_id)
            if task and task.status == TaskStatus.PENDING:
                task.status = TaskStatus.CANCELLED
                logger.info(f"Task cancelled: {task_id}")
                return True
        return False

    async def retry_task(self, task_id: str) -> bool:
        """重试失败的任务"""
        async with self._lock:
            task = self._tasks.get(task_id)
            if not task:
                return False

            if task.status != TaskStatus.FAILED:
                logger.warning(f"Cannot retry task {task_id}: not failed")
                return False

            if task.retry_count >= task.max_retries:
                logger.warning(f"Cannot retry task {task_id}: max retries exceeded")
                return False

            task.status = TaskStatus.PENDING
            task.retry_count += 1
            await self._queue.put((-task.priority.value, task.created_at.timestamp(), task))

            logger.info(f"Task retry queued: {task_id} (attempt {task.retry_count})")
            return True

    async def start_workers(self):
        """启动任务处理工作线程"""
        if self._running:
            return

        self._running = True

        for i in range(self._max_workers):
            worker = asyncio.create_task(self._worker(f"worker-{i}"))
            self._workers.append(worker)

        logger.info(f"Started {self._max_workers} task workers")

    async def stop_workers(self):
        """停止任务处理工作线程"""
        self._running = False

        for worker in self._workers:
            worker.cancel()

        await asyncio.gather(*self._workers, return_exceptions=True)
        self._workers.clear()

        logger.info("Stopped all task workers")

    async def _worker(self, worker_name: str):
        """任务处理工作线程"""
        logger.info(f"{worker_name} started")

        while self._running:
            try:
                # Get task from queue
                priority, timestamp, task = await asyncio.wait_for(
                    self._queue.get(),
                    timeout=1.0
                )

                if task.status == TaskStatus.CANCELLED:
                    continue

                # Execute task
                await self._execute_task(task)

            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"Worker {worker_name} error: {e}")

        logger.info(f"{worker_name} stopped")

    async def _execute_task(self, task: AsyncTask):
        """执行单个任务"""
        async with self._lock:
            if task.status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
                return

            task.status = TaskStatus.RUNNING
            task.started_at = datetime.utcnow()

        logger.info(f"Executing task: {task.task_id}")

        try:
            # Execute with timeout if specified
            if task.timeout:
                result = await asyncio.wait_for(
                    task.func(*task.args, **task.kwargs),
                    timeout=task.timeout
                )
            else:
                result = await task.func(*task.args, **task.kwargs)

            task.result = TaskResult(
                success=True,
                data=result,
                started_at=task.started_at,
                completed_at=datetime.utcnow()
            )
            task.status = TaskStatus.COMPLETED

            logger.info(f"Task completed: {task.task_id}")

        except asyncio.TimeoutError:
            task.result = TaskResult(
                success=False,
                error="Task execution timeout",
                started_at=task.started_at,
                completed_at=datetime.utcnow()
            )
            task.status = TaskStatus.FAILED

            logger.error(f"Task timeout: {task.task_id}")

            # Retry if retries available
            if task.retry_count < task.max_retries:
                await self.retry_task(task.task_id)

        except Exception as e:
            task.result = TaskResult(
                success=False,
                error=str(e),
                started_at=task.started_at,
                completed_at=datetime.utcnow()
            )
            task.status = TaskStatus.FAILED

            logger.error(f"Task failed: {task.task_id} - {e}")

            # Retry if retries available
            if task.retry_count < task.max_retries:
                await self.retry_task(task.task_id)

        finally:
            task.completed_at = datetime.utcnow()

    async def clear_old_tasks(self, older_than: timedelta = timedelta(days=7)):
        """清理旧任务"""
        async with self._lock:
            cutoff = datetime.utcnow() - older_than
            old_tasks = [
                task_id for task_id, task in self._tasks.items()
                if task.created_at < cutoff
            ]

            for task_id in old_tasks:
                del self._tasks[task_id]

            logger.info(f"Cleared {len(old_tasks)} old tasks")

    async def get_statistics(self) -> Dict[str, Any]:
        """获取任务统计信息"""
        async with self._lock:
            tasks = list(self._tasks.values())

        total = len(tasks)
        by_status = {
            TaskStatus.PENDING.value: 0,
            TaskStatus.RUNNING.value: 0,
            TaskStatus.COMPLETED.value: 0,
            TaskStatus.FAILED.value: 0,
            TaskStatus.CANCELLED.value: 0,
        }

        for task in tasks:
            by_status[task.status.value] += 1

        avg_duration = None
        completed_tasks = [t for t in tasks if t.duration is not None]
        if completed_tasks:
            avg_duration = sum(t.duration for t in completed_tasks) / len(completed_tasks)

        return {
            "total_tasks": total,
            "by_status": by_status,
            "queue_size": self._queue.qsize(),
            "active_workers": len(self._workers),
            "average_duration": avg_duration,
        }


# Global async task service instance
async_task_service = AsyncTaskService()
