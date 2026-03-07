"""
点赞 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.like import (
    LikeCreate,
    LikeResponse,
    LikeStatusResponse,
    LikeStatsResponse
)
from app.services.like_service import LikeService

router = APIRouter()


@router.post("/likes", response_model=LikeResponse, status_code=status.HTTP_201_CREATED)
async def create_like(
    like_data: LikeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    创建点赞

    - **target_type**: 目标类型（post, comment, project）
    - **target_id**: 目标ID
    """
    try:
        return LikeService.create_like(db, current_user.id, like_data)
    except ValueError as e:
        if str(e) == "Already liked":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already liked"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/likes/{target_type}/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_like(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    取消点赞

    - **target_type**: 目标类型（post, comment, project）
    - **target_id**: 目标ID
    """
    success = LikeService.delete_like(db, current_user.id, target_type, target_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )


@router.get("/likes/status/{target_type}/{target_id}", response_model=LikeStatusResponse)
async def get_like_status(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取点赞状态

    返回当前用户对指定目标的点赞状态和点赞总数
    """
    return LikeService.get_like_status(db, current_user.id, target_type, target_id)


@router.get("/likes/count/{target_type}/{target_id}", response_model=dict)
async def get_like_count(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db)
):
    """
    获取点赞数量

    返回指定目标的点赞总数
    """
    count = LikeService.get_like_count(db, target_type, target_id)
    return {"count": count}


@router.get("/likes/my", response_model=dict)
async def get_my_likes(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取我的点赞列表

    返回当前用户的点赞记录
    """
    likes, total = LikeService.get_user_likes(db, current_user.id, skip, limit)
    return {
        "items": likes,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit
    }


@router.get("/likes/target/{target_type}/{target_id}", response_model=dict)
async def get_target_likes(
    target_type: str,
    target_id: int,
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    db: Session = Depends(get_db)
):
    """
    获取目标的点赞列表

    返回指定目标的点赞记录
    """
    likes, total = LikeService.get_target_likes(db, target_type, target_id, skip, limit)
    return {
        "items": likes,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit
    }


@router.get("/likes/stats", response_model=LikeStatsResponse)
async def get_like_stats(
    target_type: Optional[str] = Query(None, description="目标类型（可选）"),
    target_id: Optional[int] = Query(None, description="目标ID（可选）"),
    db: Session = Depends(get_db)
):
    """
    获取点赞统计

    返回点赞总数和最近7天的点赞数
    可以指定目标类型和ID来获取特定目标的统计
    """
    return LikeService.get_like_stats(db, target_type, target_id)


@router.post("/likes/toggle/{target_type}/{target_id}", response_model=LikeStatusResponse)
async def toggle_like(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    切换点赞状态

    如果已点赞则取消，未点赞则添加
    """
    return LikeService.toggle_like(db, current_user.id, target_type, target_id)
