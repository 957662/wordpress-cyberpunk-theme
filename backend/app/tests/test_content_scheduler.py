"""
Content Scheduler Service Tests
内容定时发布服务测试
"""

import pytest
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.services.content_scheduler_service import ContentSchedulerService
from app.models.content_scheduler import ScheduledContent, ScheduledStatus, ContentType
from app.schemas.content_scheduler import (
    ScheduledContentCreate,
    ScheduledContentUpdate,
)


class TestContentSchedulerService:
    """内容定时发布服务测试"""

    def test_create_scheduled_content_success(self, db_session: Session):
        """测试成功创建定时内容"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        result = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        assert result.id is not None
        assert result.title == "测试文章"
        assert result.status == ScheduledStatus.PENDING
        assert result.scheduled_at == scheduled_time

    def test_create_scheduled_content_past_time_fails(self, db_session: Session):
        """测试创建过去时间的定时内容失败"""
        past_time = datetime.utcnow() - timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=past_time,
        )

        with pytest.raises(ValueError, match="发布时间不能是过去时间"):
            ContentSchedulerService.create_scheduled_content(
                db=db_session,
                content_data=create_data,
            )

    def test_get_scheduled_content_by_id(self, db_session: Session):
        """测试根据ID获取定时内容"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        result = ContentSchedulerService.get_scheduled_content_by_id(
            db=db_session,
            schedule_id=str(created.id),
        )

        assert result is not None
        assert result.id == created.id

    def test_get_upcoming_content(self, db_session: Session):
        """测试获取即将发布的内容"""
        # 创建多个定时内容
        now = datetime.utcnow()

        for i in range(3):
            scheduled_time = now + timedelta(hours=i + 1)
            create_data = ScheduledContentCreate(
                user_id="test-user-id",
                content_type=ContentType.POST,
                title=f"测试文章 {i}",
                content="这是文章内容",
                scheduled_at=scheduled_time,
            )

            ContentSchedulerService.create_scheduled_content(
                db=db_session,
                content_data=create_data,
            )

        upcoming = ContentSchedulerService.get_upcoming_content(
            db=db_session,
            limit=10,
        )

        assert len(upcoming) == 3
        assert all(c.status == ScheduledStatus.PENDING for c in upcoming)

    def test_update_scheduled_content(self, db_session: Session):
        """测试更新定时内容"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        update_data = ScheduledContentUpdate(
            title="更新后的标题",
        )

        result = ContentSchedulerService.update_scheduled_content(
            db=db_session,
            content=created,
            content_data=update_data,
        )

        assert result.title == "更新后的标题"

    def test_update_published_content_fails(self, db_session: Session):
        """测试更新已发布内容失败"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        # 标记为已发布
        created.status = ScheduledStatus.PUBLISHED
        db_session.commit()

        update_data = ScheduledContentUpdate(
            title="更新后的标题",
        )

        with pytest.raises(ValueError, match="状态为.*的内容不能修改"):
            ContentSchedulerService.update_scheduled_content(
                db=db_session,
                content=created,
                content_data=update_data,
            )

    def test_publish_now(self, db_session: Session):
        """测试立即发布"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        result = ContentSchedulerService.publish_now(
            db=db_session,
            content=created,
        )

        assert result.status == ScheduledStatus.PUBLISHED
        assert result.published_at is not None
        assert result.scheduled_at <= datetime.utcnow()

    def test_cancel_scheduled_content(self, db_session: Session):
        """测试取消定时发布"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        result = ContentSchedulerService.cancel_scheduled_content(
            db=db_session,
            content=created,
        )

        assert result.status == ScheduledStatus.CANCELLED

    def test_cancel_already_published_fails(self, db_session: Session):
        """测试取消已发布内容失败"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        # 标记为已发布
        created.status = ScheduledStatus.PUBLISHED
        db_session.commit()

        with pytest.raises(ValueError, match="已发布的内容不能取消"):
            ContentSchedulerService.cancel_scheduled_content(
                db=db_session,
                content=created,
            )

    def test_delete_scheduled_content(self, db_session: Session):
        """测试删除定时内容"""
        scheduled_time = datetime.utcnow() + timedelta(hours=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=scheduled_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        ContentSchedulerService.delete_scheduled_content(
            db=db_session,
            content=created,
        )

        # 验证删除
        result = ContentSchedulerService.get_scheduled_content_by_id(
            db=db_session,
            schedule_id=str(created.id),
        )

        assert result is None

    def test_process_pending_content(self, db_session: Session):
        """测试处理待发布内容"""
        past_time = datetime.utcnow() - timedelta(minutes=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=past_time,
        )

        created = ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        published = ContentSchedulerService.process_pending_content(
            db=db_session,
        )

        assert len(published) > 0
        assert published[0].status == ScheduledStatus.PUBLISHED

    def test_get_due_content_count(self, db_session: Session):
        """测试获取待发布内容数量"""
        past_time = datetime.utcnow() - timedelta(minutes=1)

        create_data = ScheduledContentCreate(
            user_id="test-user-id",
            content_type=ContentType.POST,
            title="测试文章",
            content="这是文章内容",
            scheduled_at=past_time,
        )

        ContentSchedulerService.create_scheduled_content(
            db=db_session,
            content_data=create_data,
        )

        count = ContentSchedulerService.get_due_content_count(
            db=db_session,
        )

        assert count > 0
