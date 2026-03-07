"""
阅读进度 API 路由
处理用户阅读进度的增删改查操作
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from datetime import datetime
import json
import io

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.reading_progress import ReadingProgress
from app.schemas.reading_progress import (
    ReadingProgress as ReadingProgressSchema,
    ReadingProgressCreate,
    ReadingProgressUpdate,
    ReadingProgressStats,
    BatchUpdateRequest,
    ImportExportResult,
)

router = APIRouter()


@router.get("/", response_model=List[ReadingProgressSchema])
async def get_all_progress(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取用户的所有阅读进度

    - **skip**: 跳过的记录数
    - **limit**: 返回的记录数
    """
    result = await db.execute(
        select(ReadingProgress)
        .where(ReadingProgress.user_id == current_user.id)
        .order_by(ReadingProgress.last_read_at.desc())
        .offset(skip)
        .limit(limit)
    )
    progress_list = result.scalars().all()
    return progress_list


@router.get("/stats", response_model=ReadingProgressStats)
async def get_reading_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取阅读统计信息

    返回总文章数、已完成数、进行中数、总阅读时间、平均进度等统计数据
    """
    # 总文章数
    total_result = await db.execute(
        select(func.count(ReadingProgress.id)).where(
            ReadingProgress.user_id == current_user.id
        )
    )
    total_articles = total_result.scalar() or 0

    # 已完成文章数
    completed_result = await db.execute(
        select(func.count(ReadingProgress.id)).where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.completed == True,
            )
        )
    )
    completed_articles = completed_result.scalar() or 0

    # 进行中文章数
    in_progress_articles = total_articles - completed_articles

    # 总阅读时间
    time_result = await db.execute(
        select(func.sum(ReadingProgress.total_time)).where(
            ReadingProgress.user_id == current_user.id
        )
    )
    total_reading_time = time_result.scalar() or 0

    # 平均进度
    avg_progress_result = await db.execute(
        select(func.avg(ReadingProgress.progress)).where(
            ReadingProgress.user_id == current_user.id
        )
    )
    average_progress = round(avg_progress_result.scalar() or 0, 2)

    return ReadingProgressStats(
        total_articles=total_articles,
        completed_articles=completed_articles,
        in_progress_articles=in_progress_articles,
        total_reading_time=total_reading_time,
        average_progress=average_progress,
    )


@router.get("/in-progress", response_model=List[ReadingProgressSchema])
async def get_in_progress_articles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取正在阅读的文章列表（未完成且有阅读记录）
    """
    result = await db.execute(
        select(ReadingProgress)
        .where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.completed == False,
                ReadingProgress.progress > 0,
            )
        )
        .order_by(ReadingProgress.last_read_at.desc())
    )
    return result.scalars().all()


@router.get("/completed", response_model=List[ReadingProgressSchema])
async def get_completed_articles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取已完成的文章列表
    """
    result = await db.execute(
        select(ReadingProgress)
        .where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.completed == True,
            )
        )
        .order_by(ReadingProgress.last_read_at.desc())
    )
    return result.scalars().all()


@router.get("/article/{article_id}", response_model=ReadingProgressSchema)
async def get_article_progress(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取特定文章的阅读进度
    """
    result = await db.execute(
        select(ReadingProgress).where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.article_id == article_id,
            )
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading progress not found",
        )

    return progress


@router.post("/upsert", response_model=ReadingProgressSchema, status_code=status.HTTP_200_OK)
async def upsert_progress(
    data: ReadingProgressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    创建或更新阅读进度

    如果存在则更新，不存在则创建
    """
    # 先查找是否存在
    result = await db.execute(
        select(ReadingProgress).where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.article_id == data.article_id,
            )
        )
    )
    progress = result.scalar_one_or_none()

    if progress:
        # 更新现有记录
        if data.progress is not None:
            progress.progress = data.progress
        if data.last_position is not None:
            progress.last_position = data.last_position
        if data.total_time is not None:
            progress.total_time = data.total_time
        if data.completed is not None:
            progress.completed = data.completed
        progress.last_read_at = datetime.utcnow()
    else:
        # 创建新记录
        progress = ReadingProgress(
            user_id=current_user.id,
            article_id=data.article_id,
            article_title=data.article_title,
            progress=data.progress or 0,
            last_position=data.last_position or 0,
            total_time=data.total_time or 0,
            completed=data.completed or False,
            last_read_at=datetime.utcnow(),
        )
        db.add(progress)

    await db.commit()
    await db.refresh(progress)

    return progress


@router.patch("/article/{article_id}", response_model=ReadingProgressSchema)
async def update_progress(
    article_id: str,
    data: ReadingProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    更新特定文章的阅读进度
    """
    result = await db.execute(
        select(ReadingProgress).where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.article_id == article_id,
            )
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading progress not found",
        )

    # 更新字段
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(progress, field, value)

    progress.last_read_at = datetime.utcnow()

    await db.commit()
    await db.refresh(progress)

    return progress


@router.patch("/batch", response_model=List[ReadingProgressSchema])
async def batch_update_progress(
    data: BatchUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    批量更新多个文章的阅读进度
    """
    updated_progress_list = []

    for update_item in data.updates:
        article_id = update_item.get("article_id")
        if not article_id:
            continue

        result = await db.execute(
            select(ReadingProgress).where(
                and_(
                    ReadingProgress.user_id == current_user.id,
                    ReadingProgress.article_id == article_id,
                )
            )
        )
        progress = result.scalar_one_or_none()

        if progress:
            # 更新字段
            for field, value in update_item.items():
                if field != "article_id":
                    setattr(progress, field, value)
            progress.last_read_at = datetime.utcnow()

            updated_progress_list.append(progress)

    await db.commit()

    for progress in updated_progress_list:
        await db.refresh(progress)

    return updated_progress_list


@router.post("/article/{article_id}/complete", response_model=ReadingProgressSchema)
async def mark_as_completed(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    标记文章为已读完成
    """
    result = await db.execute(
        select(ReadingProgress).where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.article_id == article_id,
            )
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading progress not found",
        )

    progress.completed = True
    progress.progress = 100
    progress.last_read_at = datetime.utcnow()

    await db.commit()
    await db.refresh(progress)

    return progress


@router.delete("/article/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_progress(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    删除特定文章的阅读进度
    """
    result = await db.execute(
        select(ReadingProgress).where(
            and_(
                ReadingProgress.user_id == current_user.id,
                ReadingProgress.article_id == article_id,
            )
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading progress not found",
        )

    await db.delete(progress)
    await db.commit()

    return None


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_all_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    清除用户的所有阅读进度
    """
    result = await db.execute(
        select(ReadingProgress).where(ReadingProgress.user_id == current_user.id)
    )
    progress_list = result.scalars().all()

    for progress in progress_list:
        await db.delete(progress)

    await db.commit()

    return None


@router.get("/export", response_class=...)  # 返回文件
async def export_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    导出阅读进度数据为 JSON 文件
    """
    result = await db.execute(
        select(ReadingProgress)
        .where(ReadingProgress.user_id == current_user.id)
        .order_by(ReadingProgress.last_read_at.desc())
    )
    progress_list = result.scalars().all()

    # 转换为字典列表
    data = [
        {
            "article_id": p.article_id,
            "article_title": p.article_title,
            "progress": p.progress,
            "last_position": p.last_position,
            "total_time": p.total_time,
            "completed": p.completed,
            "last_read_at": p.last_read_at.isoformat(),
        }
        for p in progress_list
    ]

    # 创建 JSON 文件
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    json_bytes = json_str.encode("utf-8")

    from fastapi.responses import Response

    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename=reading_progress_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        },
    )


@router.post("/import", response_model=ImportExportResult)
async def import_progress(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    从 JSON 文件导入阅读进度数据
    """
    imported = 0
    failed = 0

    try:
        # 读取文件内容
        content = await file.read()
        data = json.loads(content.decode("utf-8"))

        for item in data:
            try:
                article_id = item.get("article_id")
                if not article_id:
                    failed += 1
                    continue

                # 查找现有记录
                result = await db.execute(
                    select(ReadingProgress).where(
                        and_(
                            ReadingProgress.user_id == current_user.id,
                            ReadingProgress.article_id == article_id,
                        )
                    )
                )
                progress = result.scalar_one_or_none()

                if progress:
                    # 更新
                    progress.progress = item.get("progress", progress.progress)
                    progress.last_position = item.get(
                        "last_position", progress.last_position
                    )
                    progress.total_time = item.get("total_time", progress.total_time)
                    progress.completed = item.get("completed", progress.completed)
                    if item.get("last_read_at"):
                        progress.last_read_at = datetime.fromisoformat(
                            item["last_read_at"]
                        )
                else:
                    # 创建新记录
                    progress = ReadingProgress(
                        user_id=current_user.id,
                        article_id=article_id,
                        article_title=item.get("article_title", ""),
                        progress=item.get("progress", 0),
                        last_position=item.get("last_position", 0),
                        total_time=item.get("total_time", 0),
                        completed=item.get("completed", False),
                        last_read_at=datetime.fromisoformat(item.get("last_read_at", datetime.utcnow().isoformat())),
                    )
                    db.add(progress)

                imported += 1
            except Exception:
                failed += 1
                continue

        await db.commit()

        return ImportExportResult(imported=imported, failed=failed)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format: {str(e)}",
        )
