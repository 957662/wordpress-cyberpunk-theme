"""
Reading List API Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models.user import User
from app.models.post import Post
from app.schemas.reading_list import (
    ReadingListCreate,
    ReadingListUpdate,
    ReadingListResponse,
    ReadingStats
)
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/reading-list", tags=["reading-list"])


@router.get("/", response_model=List[ReadingListResponse])
async def get_reading_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status: unread, reading, completed"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取当前用户的阅读列表
    """
    query = db.query(Post).join(
        Post.reading_lists
    ).filter(
        Post.reading_lists.any(user_id=current_user.id)
    )

    if status:
        query = query.filter(Post.reading_lists.any(status=status))

    items = query.offset(skip).limit(limit).all()
    return items


@router.post("/", response_model=ReadingListResponse)
async def add_to_reading_list(
    item: ReadingListCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    添加文章到阅读列表
    """
    # 检查文章是否存在
    post = db.query(Post).filter(Post.id == item.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # 检查是否已经在阅读列表中
    existing = db.query(ReadingList).filter(
        ReadingList.user_id == current_user.id,
        ReadingList.post_id == item.post_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Post already in reading list")

    # 创建阅读列表项
    reading_item = ReadingList(
        user_id=current_user.id,
        post_id=item.post_id,
        status=item.status or "unread",
        progress=item.progress or 0
    )

    db.add(reading_item)
    db.commit()
    db.refresh(reading_item)

    return reading_item


@router.put("/{item_id}", response_model=ReadingListResponse)
async def update_reading_list_item(
    item_id: int,
    item: ReadingListUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新阅读列表项
    """
    reading_item = db.query(ReadingList).filter(
        ReadingList.id == item_id,
        ReadingList.user_id == current_user.id
    ).first()

    if not reading_item:
        raise HTTPException(status_code=404, detail="Reading list item not found")

    # 更新字段
    if item.status is not None:
        reading_item.status = item.status
    if item.progress is not None:
        reading_item.progress = item.progress
    if item.notes is not None:
        reading_item.notes = item.notes

    reading_item.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(reading_item)

    return reading_item


@router.delete("/{item_id}")
async def remove_from_reading_list(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    从阅读列表中移除
    """
    reading_item = db.query(ReadingList).filter(
        ReadingList.id == item_id,
        ReadingList.user_id == current_user.id
    ).first()

    if not reading_item:
        raise HTTPException(status_code=404, detail="Reading list item not found")

    db.delete(reading_item)
    db.commit()

    return {"message": "Item removed from reading list"}


@router.get("/stats", response_model=ReadingStats)
async def get_reading_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取阅读统计信息
    """
    total_items = db.query(ReadingList).filter(
        ReadingList.user_id == current_user.id
    ).count()

    unread_items = db.query(ReadingList).filter(
        ReadingList.user_id == current_user.id,
        ReadingList.status == "unread"
    ).count()

    reading_items = db.query(ReadingList).filter(
        ReadingList.user_id == current_user.id,
        ReadingList.status == "reading"
    ).count()

    completed_items = db.query(ReadingList).filter(
        ReadingList.user_id == current_user.id,
        ReadingList.status == "completed"
    ).count()

    # 计算平均阅读进度
    items_with_progress = db.query(ReadingList).filter(
        ReadingList.user_id == current_user.id
    ).all()

    avg_progress = sum(item.progress for item in items_with_progress) / len(items_with_progress) if items_with_progress else 0

    return ReadingStats(
        total_items=total_items,
        unread_items=unread_items,
        reading_items=reading_items,
        completed_items=completed_items,
        avg_progress=round(avg_progress, 2)
    )


@router.post("/sync")
async def sync_reading_list(
    items: List[ReadingListCreate],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    同步阅读列表（用于导入/导出）
    """
    synced_items = []

    for item_data in items:
        # 检查是否已存在
        existing = db.query(ReadingList).filter(
            ReadingList.user_id == current_user.id,
            ReadingList.post_id == item_data.post_id
        ).first()

        if existing:
            # 更新现有项
            if item_data.status:
                existing.status = item_data.status
            if item_data.progress is not None:
                existing.progress = item_data.progress
            if item_data.notes:
                existing.notes = item_data.notes
            existing.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(existing)
            synced_items.append(existing)
        else:
            # 创建新项
            new_item = ReadingList(
                user_id=current_user.id,
                post_id=item_data.post_id,
                status=item_data.status or "unread",
                progress=item_data.progress or 0,
                notes=item_data.notes
            )
            db.add(new_item)
            db.commit()
            db.refresh(new_item)
            synced_items.append(new_item)

    return synced_items


# 模型定义（应该在 models/reading_list.py 中）
class ReadingList:
    """阅读列表模型"""
    pass


# 导出路由
__all__ = ["router"]
