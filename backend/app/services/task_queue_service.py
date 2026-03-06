"""
任务队列服务
处理异步任务和定时任务
"""

from typing import Dict, Any, Callable, Optional, List
from datetime import datetime, timedelta
from enum import Enum
import asyncio
from dataclasses import dataclass, field
from heapq import heappush, heappop, heapify
import uuid


class TaskStatus(str, Enum):
    """任务状态"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskPriority(int, Enum):
    """任务优先级"""
    LOW = 3
    NORMAL = 2
    HIGH = 1
    URGENT = 0


@dataclass(order=True)
class Task:
    """任务对象"""
    priority: TaskPriority
    scheduled_time: datetime
    task_id: str = field(compare=False)
    func: Callable = field(compare=False)
    args: tuple = field(default_factory=tuple, compare=False)
    kwargs: Dict[str, Any] = field(default_factory=dict, compare=False)
    status: TaskStatus = field(default=TaskStatus.PENDING, compare=False)
    created_at: datetime = field(default_factory=datetime.now, compare=False)
    started_at: Optional[datetime] = field(default=None, compare=False)
    completed_at: Optional[datetime] = field(default=None, compare=False)
    result: Any = field(default=None, compare=False)
    error: Optional[str] = field(default=None, compare=False)
    retry_count: int = field(default=0, compare=False)
    max_retries: int = field(default=3, compare=False)


class TaskQueueService:
    """任务队列服务"""

    def __init__(self, max_concurrent_tasks: int = 10):
        self.max_concurrent_tasks = max_concurrent_tasks
        self.task_queue: List[Task] = []
        self.running_tasks: Dict[str, Task] = {}
        self.completed_tasks: Dict[str, Task] = {}
        self.failed_tasks: Dict[str, Task] = {}
        self.is_running = False
        self._worker_task: Optional[asyncio.Task] = None

        # 任务回调
        self.on_task_complete: Optional[Callable] = None
        self.on_task_failed: Optional[Callable] = None

    def add_task(
        self,
        func: Callable,
        args: tuple = (),
        kwargs: Optional[Dict[str, Any]] = None,
        priority: TaskPriority = TaskPriority.NORMAL,
        delay: Optional[float] = None,
        scheduled_time: Optional[datetime] = None,
        max_retries: int = 3
    ) -> str:
        """
        添加任务到队列

        Args:
            func: 要执行的函数
            args: 位置参数
            kwargs: 关键字参数
            priority: 任务优先级
            delay: 延迟执行（秒）
            scheduled_time: 定时执行时间
            max_retries: 最大重试次数

        Returns:
            任务ID
        """
        task_id = str(uuid.uuid4())

        # 计算执行时间
        if delay:
            scheduled_time = datetime.now() + timedelta(seconds=delay)
        elif not scheduled_time:
            scheduled_time = datetime.now()

        task = Task(
            priority=priority,
            scheduled_time=scheduled_time,
            task_id=task_id,
            func=func,
            args=args,
            kwargs=kwargs or {},
            max_retries=max_retries
        )

        heappush(self.task_queue, task)
        return task_id

    def add_periodic_task(
        self,
        func: Callable,
        interval: float,
        args: tuple = (),
        kwargs: Optional[Dict[str, Any]] = None,
        priority: TaskPriority = TaskPriority.NORMAL
    ) -> Callable:
        """
        添加周期性任务

        Args:
            func: 要执行的函数
            interval: 执行间隔（秒）
            args: 位置参数
            kwargs: 关键字参数
            priority: 任务优先级

        Returns:
            取消函数
        """
        stop_event = asyncio.Event()

        async def periodic_wrapper():
            while not stop_event.is_set():
                try:
                    await asyncio.get_event_loop().run_in_executor(
                        None, lambda: func(*args, **(kwargs or {}))
                    )
                except Exception as e:
                    print(f"周期性任务执行失败: {e}")

                await asyncio.sleep(interval)

        # 启动周期性任务
        task = asyncio.create_task(periodic_wrapper())

        # 返回取消函数
        def cancel():
            stop_event.set()
            task.cancel()

        return cancel

    async def get_task_result(self, task_id: str, timeout: Optional[float] = None) -> Any:
        """
        获取任务结果

        Args:
            task_id: 任务ID
            timeout: 超时时间（秒）

        Returns:
            任务结果
        """
        start_time = datetime.now()

        while True:
            # 检查已完成任务
            if task_id in self.completed_tasks:
                task = self.completed_tasks[task_id]
                if task.error:
                    raise Exception(task.error)
                return task.result

            # 检查失败任务
            if task_id in self.failed_tasks:
                task = self.failed_tasks[task_id]
                raise Exception(f"任务失败: {task.error}")

            # 检查超时
            if timeout:
                elapsed = (datetime.now() - start_time).total_seconds()
                if elapsed >= timeout:
                    raise TimeoutError(f"任务 {task_id} 在 {timeout} 秒内未完成")

            await asyncio.sleep(0.1)

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """获取任务状态"""
        # 检查所有任务集合
        for task_dict in [self.completed_tasks, self.failed_tasks, self.running_tasks]:
            if task_id in task_dict:
                task = task_dict[task_id]
                return {
                    "task_id": task.task_id,
                    "status": task.status.value,
                    "created_at": task.created_at.isoformat(),
                    "started_at": task.started_at.isoformat() if task.started_at else None,
                    "completed_at": task.completed_at.isoformat() if task.completed_at else None,
                    "retry_count": task.retry_count,
                    "error": task.error
                }

        # 检查队列中的任务
        for task in self.task_queue:
            if task.task_id == task_id:
                return {
                    "task_id": task.task_id,
                    "status": task.status.value,
                    "created_at": task.created_at.isoformat(),
                    "scheduled_time": task.scheduled_time.isoformat(),
                    "retry_count": task.retry_count
                }

        return None

    def cancel_task(self, task_id: str) -> bool:
        """取消任务"""
        # 只能取消队列中的任务
        for i, task in enumerate(self.task_queue):
            if task.task_id == task_id:
                task.status = TaskStatus.CANCELLED
                self.task_queue.pop(i)
                heapify(self.task_queue)
                return True
        return False

    async def start(self):
        """启动任务队列服务"""
        if self.is_running:
            return

        self.is_running = True
        self._worker_task = asyncio.create_task(self._worker())

    async def stop(self):
        """停止任务队列服务"""
        self.is_running = False

        if self._worker_task:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass

    async def _worker(self):
        """任务执行器"""
        while self.is_running:
            try:
                # 检查是否有可以执行的任务
                if (self.task_queue and
                    len(self.running_tasks) < self.max_concurrent_tasks):

                    now = datetime.now()
                    task = self.task_queue[0]

                    if task.scheduled_time <= now:
                        # 从队列中移除
                        heappop(self.task_queue)

                        # 执行任务
                        asyncio.create_task(self._execute_task(task))

                await asyncio.sleep(0.1)

            except Exception as e:
                print(f"任务执行器错误: {e}")
                await asyncio.sleep(1)

    async def _execute_task(self, task: Task):
        """执行单个任务"""
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.now()
        self.running_tasks[task.task_id] = task

        try:
            # 执行任务
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, lambda: task.func(*task.args, **task.kwargs)
            )

            # 任务成功
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now()
            task.result = result

            # 移动到已完成
            self.completed_tasks[task.task_id] = task
            del self.running_tasks[task.task_id]

            # 回调
            if self.on_task_complete:
                await self.on_task_complete(task)

        except Exception as e:
            error_msg = str(e)

            # 检查是否需要重试
            if task.retry_count < task.max_retries:
                task.retry_count += 1
                task.status = TaskStatus.PENDING
                task.scheduled_time = datetime.now() + timedelta(
                    seconds=2 ** task.retry_count  # 指数退避
                )

                # 重新加入队列
                heappush(self.task_queue, task)
                del self.running_tasks[task.task_id]
            else:
                # 任务失败
                task.status = TaskStatus.FAILED
                task.completed_at = datetime.now()
                task.error = error_msg

                # 移动到失败
                self.failed_tasks[task.task_id] = task
                del self.running_tasks[task.task_id]

                # 回调
                if self.on_task_failed:
                    await self.on_task_failed(task)

    def get_statistics(self) -> Dict[str, Any]:
        """获取队列统计信息"""
        return {
            "pending_tasks": len(self.task_queue),
            "running_tasks": len(self.running_tasks),
            "completed_tasks": len(self.completed_tasks),
            "failed_tasks": len(self.failed_tasks),
            "is_running": self.is_running,
            "max_concurrent_tasks": self.max_concurrent_tasks
        }

    def clear_completed(self, older_than: Optional[timedelta] = None):
        """清理已完成的任务"""
        if older_than:
            cutoff = datetime.now() - older_than
            to_remove = [
                task_id for task_id, task in self.completed_tasks.items()
                if task.completed_at and task.completed_at < cutoff
            ]
            for task_id in to_remove:
                del self.completed_tasks[task_id]
        else:
            self.completed_tasks.clear()

    def clear_failed(self, older_than: Optional[timedelta] = None):
        """清理失败的任务"""
        if older_than:
            cutoff = datetime.now() - older_than
            to_remove = [
                task_id for task_id, task in self.failed_tasks.items()
                if task.completed_at and task.completed_at < cutoff
            ]
            for task_id in to_remove:
                del self.failed_tasks[task_id]
        else:
            self.failed_tasks.clear()


# 创建全局实例
task_queue_service = TaskQueueService()


# 常用任务函数
async def send_email_task(to: str, subject: str, content: str):
    """发送邮件任务"""
    from services.email_template_service import email_template_service
    await email_template_service.send_email(to, subject, content)


async def generate_thumbnail_task(image_path: str):
    """生成缩略图任务"""
    from PIL import Image
    import os

    try:
        img = Image.open(image_path)
        img.thumbnail((300, 300))

        thumbnail_path = image_path.replace('.', '_thumb.')
        img.save(thumbnail_path)

        return thumbnail_path
    except Exception as e:
        raise Exception(f"生成缩略图失败: {e}")


async def cleanup_old_files_task(directory: str, days: int = 30):
    """清理旧文件任务"""
    import os
    from datetime import datetime, timedelta

    cutoff = datetime.now() - timedelta(days=days)
    removed_count = 0

    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_time = datetime.fromtimestamp(os.path.getmtime(file_path))

            if file_time < cutoff:
                try:
                    os.remove(file_path)
                    removed_count += 1
                except Exception as e:
                    print(f"删除文件失败 {file_path}: {e}")

    return removed_count


async def update_search_index_task(post_id: int):
    """更新搜索索引任务"""
    # 这里可以集成 Elasticsearch 或其他搜索引擎
    pass


async def generate_sitemap_task():
    """生成网站地图任务"""
    from fastapi import FastAPI
    from core.config import settings

    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{settings.SITE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>"""

    return sitemap
