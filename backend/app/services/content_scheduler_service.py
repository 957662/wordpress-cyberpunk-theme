"""
Content Scheduler Service
内容定时发布服务
"""

from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.content_scheduler import ScheduledContent
from app.schemas.content_scheduler import (
    ScheduledContentCreate,
    ScheduledContentUpdate,
)


class ContentSchedulerService:
    """内容定时发布服务"""

    @staticmethod
    def get_scheduled_content(
        db: Session,
        status: Optional[str] = None,
        content_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[ScheduledContent]:
        """获取定时发布内容列表"""
        query = db.query(ScheduledContent)

        if status:
            query = query.filter(ScheduledContent.status == status)
        if content_type:
            query = query.filter(ScheduledContent.content_type == content_type)

        return query.order_by(ScheduledContent.scheduled_at.asc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_upcoming_content(
        db: Session,
        limit: int = 10,
    ) -> List[ScheduledContent]:
        """获取即将发布的内容"""
        now = datetime.utcnow()
        return (
            db.query(ScheduledContent)
            .filter(
                and_(
                    ScheduledContent.scheduled_at > now,
                    ScheduledContent.status == "pending",
                )
            )
            .order_by(ScheduledContent.scheduled_at.asc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_scheduled_content_by_id(
        db: Session,
        schedule_id: str,
    ) -> Optional[ScheduledContent]:
        """根据ID获取定时内容"""
        return (
            db.query(ScheduledContent)
            .filter(ScheduledContent.id == schedule_id)
            .first()
        )

    @staticmethod
    def create_scheduled_content(
        db: Session,
        content_data: ScheduledContentCreate,
    ) -> ScheduledContent:
        """创建定时发布内容"""
        # 验证发布时间不能是过去
        if content_data.scheduled_at < datetime.utcnow():
            raise ValueError("发布时间不能是过去时间")

        scheduled_content = ScheduledContent(
            **content_data.model_dump(),
            status="pending",
        )

        db.add(scheduled_content)
        db.commit()
        db.refresh(scheduled_content)
        return scheduled_content

    @staticmethod
    def update_scheduled_content(
        db: Session,
        content: ScheduledContent,
        content_data: ScheduledContentUpdate,
    ) -> ScheduledContent:
        """更新定时发布内容"""
        # 如果状态已发布或已取消，不允许修改
        if content.status in ["published", "cancelled"]:
            raise ValueError(f"状态为{content.status}的内容不能修改")

        update_data = content_data.model_dump(exclude_unset=True)

        # 如果更新了发布时间，验证不能是过去
        if "scheduled_at" in update_data:
            if update_data["scheduled_at"] < datetime.utcnow():
                raise ValueError("发布时间不能是过去时间")

        for field, value in update_data.items():
            setattr(content, field, value)

        db.commit()
        db.refresh(content)
        return content

    @staticmethod
    def publish_now(
        db: Session,
        content: ScheduledContent,
    ) -> ScheduledContent:
        """立即发布定时内容"""
        if content.status == "published":
            raise ValueError("内容已经发布")

        # 这里可以调用实际的内容发布逻辑
        # 例如：创建文章、发送通知等

        content.status = "published"
        content.published_at = datetime.utcnow()
        content.scheduled_at = datetime.utcnow()

        db.commit()
        db.refresh(content)
        return content

    @staticmethod
    def cancel_scheduled_content(
        db: Session,
        content: ScheduledContent,
    ) -> ScheduledContent:
        """取消定时发布"""
        if content.status == "published":
            raise ValueError("已发布的内容不能取消")

        if content.status == "cancelled":
            raise ValueError("内容已经被取消")

        content.status = "cancelled"

        db.commit()
        db.refresh(content)
        return content

    @staticmethod
    def delete_scheduled_content(
        db: Session,
        content: ScheduledContent,
    ) -> None:
        """删除定时发布内容"""
        db.delete(content)
        db.commit()

    @staticmethod
    def process_pending_content(
        db: Session,
    ) -> List[ScheduledContent]:
        """处理待发布的内容（定时任务调用）"""
        now = datetime.utcnow()

        # 查找所有需要发布的内容
        pending_contents = (
            db.query(ScheduledContent)
            .filter(
                and_(
                    ScheduledContent.scheduled_at <= now,
                    ScheduledContent.status == "pending",
                )
            )
            .all()
        )

        published_contents = []
        for content in pending_contents:
            try:
                published = ContentSchedulerService.publish_now(db=db, content=content)
                published_contents.append(published)
            except Exception as e:
                # 记录错误但继续处理其他内容
                print(f"发布内容失败: {content.id}, 错误: {str(e)}")
                content.status = "failed"
                content.error_message = str(e)
                db.commit()

        return published_contents

    @staticmethod
    def get_due_content_count(
        db: Session,
    ) -> int:
        """获取待发布内容数量"""
        now = datetime.utcnow()
        return (
            db.query(ScheduledContent)
            .filter(
                and_(
                    ScheduledContent.scheduled_at <= now,
                    ScheduledContent.status == "pending",
                )
            )
            .count()
        )
