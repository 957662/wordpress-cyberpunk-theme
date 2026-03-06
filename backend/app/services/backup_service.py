"""
备份服务
处理数据备份和恢复
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import shutil
import os
from pathlib import Path
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from models.base import Base
from models.user import User
from models.post import Post
from models.comment import Comment
from core.database import get_db
from core.config import settings


class BackupService:
    """备份服务"""

    def __init__(self):
        self.backup_dir = Path(settings.BACKUP_DIR) if hasattr(settings, 'BACKUP_DIR') else Path("backups")
        self.backup_dir.mkdir(exist_ok=True)

    async def create_database_backup(
        self,
        name: Optional[str] = None,
        compress: bool = True
    ) -> str:
        """
        创建数据库备份

        Args:
            name: 备份名称
            compress: 是否压缩

        Returns:
            备份文件路径
        """
        if not name:
            name = f"db_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        backup_path = self.backup_dir / name

        try:
            # 创建备份目录
            backup_path.mkdir(exist_ok=True)

            # 导出数据到JSON
            async for session in get_db():
                # 备份用户
                users_result = await session.execute("SELECT * FROM users")
                users_data = [dict(row) for row in users_result]

                # 备份文章
                posts_result = await session.execute("SELECT * FROM posts")
                posts_data = [dict(row) for row in posts_result]

                # 备份评论
                comments_result = await session.execute("SELECT * FROM comments")
                comments_data = [dict(row) for row in comments_result]

                # 保存为JSON文件
                backup_data = {
                    "timestamp": datetime.now().isoformat(),
                    "users": users_data,
                    "posts": posts_data,
                    "comments": comments_data,
                }

                json_path = backup_path / "data.json"
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(backup_data, f, ensure_ascii=False, indent=2, default=str)

            # 如果需要压缩
            if compress:
                import zipfile
                zip_path = self.backup_dir / f"{name}.zip"
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for root, dirs, files in os.walk(backup_path):
                        for file in files:
                            file_path = Path(root) / file
                            arcname = file_path.relative_to(backup_path)
                            zipf.write(file_path, arcname)

                # 删除未压缩的目录
                shutil.rmtree(backup_path)
                return str(zip_path)

            return str(backup_path)

        except Exception as e:
            # 清理失败的备份
            if backup_path.exists():
                shutil.rmtree(backup_path)
            raise Exception(f"创建备份失败: {e}")

    async def restore_database_backup(
        self,
        backup_path: str,
        force: bool = False
    ) -> bool:
        """
        恢复数据库备份

        Args:
            backup_path: 备份文件路径
            force: 是否强制覆盖

        Returns:
            是否成功
        """
        try:
            # 如果是压缩文件，先解压
            if backup_path.endswith('.zip'):
                import zipfile
                temp_dir = self.backup_dir / "temp_restore"
                temp_dir.mkdir(exist_ok=True)

                with zipfile.ZipFile(backup_path, 'r') as zipf:
                    zipf.extractall(temp_dir)

                json_path = temp_dir / "data.json"
            else:
                json_path = Path(backup_path) / "data.json"

            # 读取备份数据
            with open(json_path, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)

            # 恢复数据
            async for session in get_db():
                if force:
                    # 清空现有数据
                    await session.execute("DELETE FROM comments")
                    await session.execute("DELETE FROM posts")
                    await session.execute("DELETE FROM users")
                    await session.commit()

                # 恢复用户
                for user_data in backup_data.get("users", []):
                    user = User(**user_data)
                    session.add(user)

                # 恢复文章
                for post_data in backup_data.get("posts", []):
                    post = Post(**post_data)
                    session.add(post)

                # 恢复评论
                for comment_data in backup_data.get("comments", []):
                    comment = Comment(**comment_data)
                    session.add(comment)

                await session.commit()

            # 清理临时文件
            if backup_path.endswith('.zip') and temp_dir.exists():
                shutil.rmtree(temp_dir)

            return True

        except Exception as e:
            raise Exception(f"恢复备份失败: {e}")

    async def create_media_backup(
        self,
        name: Optional[str] = None
    ) -> str:
        """
        创建媒体文件备份

        Args:
            name: 备份名称

        Returns:
            备份文件路径
        """
        if not name:
            name = f"media_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        media_dir = Path("media")
        backup_path = self.backup_dir / f"{name}.tar.gz"

        try:
            import tarfile

            with tarfile.open(backup_path, "w:gz") as tar:
                if media_dir.exists():
                    tar.add(media_dir, arcname="media")

            return str(backup_path)

        except Exception as e:
            raise Exception(f"创建媒体备份失败: {e}")

    async def list_backups(
        self,
        type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        列出所有备份

        Args:
            type: 备份类型 (database, media, all)

        Returns:
            备份列表
        """
        backups = []

        for file in self.backup_dir.iterdir():
            if file.is_file():
                stat = file.stat()

                backup_info = {
                    "name": file.name,
                    "path": str(file),
                    "size": stat.st_size,
                    "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                }

                # 判断备份类型
                if file.suffix == '.zip':
                    backup_info["type"] = "database"
                elif file.name.endswith('.tar.gz'):
                    backup_info["type"] = "media"
                else:
                    backup_info["type"] = "unknown"

                if not type or type == backup_info["type"] or type == "all":
                    backups.append(backup_info)

        return sorted(backups, key=lambda x: x["created_at"], reverse=True)

    async def delete_backup(
        self,
        backup_path: str
    ) -> bool:
        """
        删除备份

        Args:
            backup_path: 备份文件路径

        Returns:
            是否成功
        """
        try:
            file_path = Path(backup_path)
            if file_path.exists() and file_path.is_relative_to(self.backup_dir):
                file_path.unlink()
                return True
            return False
        except Exception as e:
            raise Exception(f"删除备份失败: {e}")

    async def cleanup_old_backups(
        self,
        keep_days: int = 30,
        keep_count: int = 10
    ) -> int:
        """
        清理旧备份

        Args:
            keep_days: 保留天数
            keep_count: 保留数量

        Returns:
            删除的备份数量
        """
        try:
            cutoff_date = datetime.now() - timedelta(days=keep_days)
            backups = await self.list_backups()

            deleted_count = 0

            # 按类型分组
            db_backups = [b for b in backups if b["type"] == "database"]
            media_backups = [b for b in backups if b["type"] == "media"]

            # 删除超出保留数量的旧备份
            for backups_list in [db_backups, media_backups]:
                # 先删除超过保留天数的
                for backup in backups_list:
                    created_at = datetime.fromisoformat(backup["created_at"])
                    if created_at < cutoff_date and len(backups_list) > keep_count:
                        await self.delete_backup(backup["path"])
                        deleted_count += 1
                        backups_list.remove(backup)

                # 如果还是太多，删除最旧的
                while len(backups_list) > keep_count:
                    oldest = min(backups_list, key=lambda x: x["created_at"])
                    await self.delete_backup(oldest["path"])
                    deleted_count += 1
                    backups_list.remove(oldest)

            return deleted_count

        except Exception as e:
            raise Exception(f"清理备份失败: {e}")

    async def get_backup_info(
        self,
        backup_path: str
    ) -> Dict[str, Any]:
        """
        获取备份信息

        Args:
            backup_path: 备份文件路径

        Returns:
            备份信息
        """
        try:
            file_path = Path(backup_path)
            stat = file_path.stat()

            info = {
                "name": file_path.name,
                "path": str(file_path),
                "size": stat.st_size,
                "size_human": self._format_size(stat.st_size),
                "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            }

            # 如果是数据库备份，读取内容信息
            if file_path.suffix == '.zip':
                import zipfile

                with zipfile.ZipFile(file_path, 'r') as zipf:
                    info["files"] = zipf.namelist()

                    # 尝试读取data.json
                    if 'data.json' in zipf.namelist():
                        with zipf.open('data.json') as f:
                            data = json.load(f)
                            info["timestamp"] = data.get("timestamp")
                            info["users_count"] = len(data.get("users", []))
                            info["posts_count"] = len(data.get("posts", []))
                            info["comments_count"] = len(data.get("comments", []))

            return info

        except Exception as e:
            raise Exception(f"获取备份信息失败: {e}")

    def _format_size(self, size_bytes: int) -> str:
        """格式化文件大小"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} PB"

    async def schedule_auto_backup(
        self,
        interval_hours: int = 24,
        keep_days: int = 30
    ):
        """
        定时自动备份

        Args:
            interval_hours: 备份间隔（小时）
            keep_days: 保留天数
        """
        while True:
            try:
                # 创建备份
                await self.create_database_backup()
                await self.create_media_backup()

                # 清理旧备份
                await self.cleanup_old_backups(keep_days=keep_days)

                # 等待下次备份
                await asyncio.sleep(interval_hours * 3600)

            except Exception as e:
                print(f"自动备份失败: {e}")
                await asyncio.sleep(3600)  # 出错后等待1小时重试


# 创建全局实例
backup_service = BackupService()
