"""
Content Scheduler API Routes
"""
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.content_scheduler import ContentSchedule, ScheduleStatus
from app.models.post import Post
from app.models.category import Category
from app.models.tag import Tag
from app.schemas.content_scheduler import (
    ContentScheduleCreate,
    ContentScheduleUpdate,
    ContentScheduleResponse,
    ContentScheduleList,
    ContentScheduleStats,
    BulkOperation,
    BulkOperationResult,
)

router = APIRouter(prefix="/content-scheduler", tags=["Content Scheduler"])


@router.post("", response_model=ContentScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    data: ContentScheduleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    创建内容排期

    - **title**: 标题
    - **content**: 内容
    - **scheduled_at**: 排期时间
    - **category_id**: 分类ID
    - **tag_ids**: 标签ID列表
    - **sync_to_social**: 是否同步到社交媒体
    """
    # 验证分类是否存在
    if data.category_id:
        category = db.query(Category).filter(Category.id == data.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

    # 验证标签是否存在
    tags = []
    if data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(data.tag_ids)).all()
        if len(tags) != len(data.tag_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Some tags not found"
            )

    # 验证文章是否存在（如果提供）
    if data.post_id:
        post = db.query(Post).filter(Post.id == data.post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

    # 创建排期
    schedule = ContentSchedule(
        user_id=current_user.id,
        title=data.title,
        content=data.content,
        excerpt=data.excerpt,
        featured_image=data.featured_image,
        category_id=data.category_id,
        post_id=data.post_id,
        scheduled_at=data.scheduled_at,
        notify_before=data.notify_before,
        sync_to_social=data.sync_to_social,
        social_platforms=",".join(data.social_platforms) if data.social_platforms else None,
        meta_title=data.meta_title,
        meta_description=data.meta_description,
        meta_keywords=data.meta_keywords,
        status=ScheduleStatus.SCHEDULED,
    )

    db.add(schedule)
    db.commit()

    # 添加标签关联
    if tags:
        for tag in tags:
            from app.models.content_scheduler import ContentScheduleTag
            schedule_tag = ContentScheduleTag(
                schedule_id=schedule.id,
                tag_id=tag.id
            )
            db.add(schedule_tag)
        db.commit()

    db.refresh(schedule)

    return ContentScheduleResponse.from_orm(schedule)


@router.get("", response_model=ContentScheduleList)
def list_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="状态过滤"),
    category_id: Optional[int] = Query(None, description="分类过滤"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取内容排期列表

    支持按状态、分类、关键词过滤和分页
    """
    query = db.query(ContentSchedule).filter(ContentSchedule.user_id == current_user.id)

    # 状态过滤
    if status:
        query = query.filter(ContentSchedule.status == status)

    # 分类过滤
    if category_id:
        query = query.filter(ContentSchedule.category_id == category_id)

    # 搜索
    if search:
        query = query.filter(
            or_(
                ContentSchedule.title.ilike(f"%{search}%"),
                ContentSchedule.content.ilike(f"%{search}%")
            )
        )

    # 总数
    total = query.count()

    # 分页
    schedules = (
        query.order_by(ContentSchedule.scheduled_at)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return ContentScheduleList(
        total=total,
        items=[ContentScheduleResponse.from_orm(s) for s in schedules],
        page=skip // limit + 1,
        page_size=limit,
    )


@router.get("/stats", response_model=ContentScheduleStats)
def get_schedule_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取内容排期统计

    返回各种状态的排期数量统计
    """
    now = datetime.utcnow()
    today_end = now.replace(hour=23, minute=59, second=59)

    schedules = db.query(ContentSchedule).filter(ContentSchedule.user_id == current_user.id).all()

    stats = ContentScheduleStats(
        total=len(schedules),
        draft=len([s for s in schedules if s.status == ScheduleStatus.DRAFT]),
        scheduled=len([s for s in schedules if s.status == ScheduleStatus.SCHEDULED]),
        published=len([s for s in schedules if s.status == ScheduleStatus.PUBLISHED]),
        failed=len([s for s in schedules if s.status == ScheduleStatus.FAILED]),
        cancelled=len([s for s in schedules if s.status == ScheduleStatus.CANCELLED]),
        due_today=len([s for s in schedules if s.scheduled_at <= today_end and s.status == ScheduleStatus.SCHEDULED]),
        overdue=len([s for s in schedules if s.scheduled_at < now and s.status == ScheduleStatus.SCHEDULED]),
    )

    return stats


@router.get("/{schedule_id}", response_model=ContentScheduleResponse)
def get_schedule(
    schedule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取内容排期详情

    返回指定排期的详细信息
    """
    schedule = (
        db.query(ContentSchedule)
        .filter(ContentSchedule.id == schedule_id, ContentSchedule.user_id == current_user.id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    return ContentScheduleResponse.from_orm(schedule)


@router.put("/{schedule_id}", response_model=ContentScheduleResponse)
def update_schedule(
    schedule_id: int,
    data: ContentScheduleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    更新内容排期

    可以更新标题、内容、排期时间等
    """
    schedule = (
        db.query(ContentSchedule)
        .filter(ContentSchedule.id == schedule_id, ContentSchedule.user_id == current_user.id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    # 更新字段
    if data.title is not None:
        schedule.title = data.title
    if data.content is not None:
        schedule.content = data.content
    if data.excerpt is not None:
        schedule.excerpt = data.excerpt
    if data.featured_image is not None:
        schedule.featured_image = data.featured_image
    if data.category_id is not None:
        schedule.category_id = data.category_id
    if data.scheduled_at is not None:
        schedule.scheduled_at = data.scheduled_at
    if data.notify_before is not None:
        schedule.notify_before = data.notify_before
    if data.sync_to_social is not None:
        schedule.sync_to_social = data.sync_to_social
    if data.social_platforms is not None:
        schedule.social_platforms = ",".join(data.social_platforms)
    if data.meta_title is not None:
        schedule.meta_title = data.meta_title
    if data.meta_description is not None:
        schedule.meta_description = data.meta_description
    if data.meta_keywords is not None:
        schedule.meta_keywords = data.meta_keywords
    if data.status is not None:
        schedule.status = data.status

    # 更新标签
    if data.tag_ids is not None:
        # 删除旧标签
        from app.models.content_scheduler import ContentScheduleTag
        db.query(ContentScheduleTag).filter(ContentScheduleTag.schedule_id == schedule_id).delete()

        # 添加新标签
        tags = db.query(Tag).filter(Tag.id.in_(data.tag_ids)).all()
        for tag in tags:
            schedule_tag = ContentScheduleTag(
                schedule_id=schedule_id,
                tag_id=tag.id
            )
            db.add(schedule_tag)

    db.commit()
    db.refresh(schedule)

    return ContentScheduleResponse.from_orm(schedule)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    删除内容排期

    永久删除指定的内容排期
    """
    schedule = (
        db.query(ContentSchedule)
        .filter(ContentSchedule.id == schedule_id, ContentSchedule.user_id == current_user.id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    db.delete(schedule)
    db.commit()

    return None


@router.post("/bulk", response_model=BulkOperationResult)
def bulk_operation(
    data: BulkOperation,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    批量操作内容排期

    支持批量取消、删除、发布操作
    """
    schedules = (
        db.query(ContentSchedule)
        .filter(
            ContentSchedule.id.in_(data.schedule_ids),
            ContentSchedule.user_id == current_user.id
        )
        .all()
    )

    success_count = 0
    failed_count = 0
    errors = []

    for schedule in schedules:
        try:
            if data.action == "cancel":
                schedule.cancel()
            elif data.action == "delete":
                db.delete(schedule)
            elif data.action == "publish":
                # 这里可以调用发布逻辑
                schedule.mark_as_published()
            else:
                raise ValueError(f"Unknown action: {data.action}")

            success_count += 1
        except Exception as e:
            failed_count += 1
            errors.append(f"Schedule {schedule.id}: {str(e)}")

    db.commit()

    return BulkOperationResult(
        success_count=success_count,
        failed_count=failed_count,
        errors=errors
    )


@router.post("/{schedule_id}/publish", response_model=ContentScheduleResponse)
def publish_scheduled_content(
    schedule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    立即发布排期内容

    将排期内容立即发布为文章
    """
    schedule = (
        db.query(ContentSchedule)
        .filter(ContentSchedule.id == schedule_id, ContentSchedule.user_id == current_user.id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    # 创建文章
    post = Post(
        user_id=current_user.id,
        title=schedule.title,
        content=schedule.content or "",
        excerpt=schedule.excerpt,
        featured_image=schedule.featured_image,
        category_id=schedule.category_id,
        status="published",
        published_at=datetime.utcnow(),
    )

    db.add(post)
    db.flush()

    # 标记排期为已发布
    schedule.mark_as_published(post.id)

    # 复制标签
    from app.models.content_scheduler import ContentScheduleTag
    from app.models.post_tag import PostTag
    schedule_tags = db.query(ContentScheduleTag).filter(ContentScheduleTag.schedule_id == schedule_id).all()
    for schedule_tag in schedule_tags:
        post_tag = PostTag(
            post_id=post.id,
            tag_id=schedule_tag.tag_id
        )
        db.add(post_tag)

    db.commit()
    db.refresh(schedule)

    return ContentScheduleResponse.from_orm(schedule)
