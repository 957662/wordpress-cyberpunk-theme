"""
Follow API Routes
关注相关的 API 路由
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.follow import (
    FollowResponse,
    FollowersListResponse,
    FollowingListResponse,
    FollowStatsResponse,
    FollowStatusResponse
)
from app.services.follow_service import FollowService

router = APIRouter(prefix="/follows", tags=["关注系统"])


@router.post("/follow/{user_id}", response_model=FollowResponse, status_code=status.HTTP_201_CREATED)
async def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    关注用户

    - **user_id**: 要关注的用户ID
    - 返回关注关系信息
    """
    try:
        result = await FollowService.follow_user(db, current_user.id, user_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/unfollow/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    取消关注用户

    - **user_id**: 要取消关注的用户ID
    """
    try:
        await FollowService.unfollow_user(db, current_user.id, user_id)
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/check/{user_id}", response_model=FollowStatusResponse)
async def check_follow_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    检查关注状态

    - **user_id**: 要检查的用户ID
    - 返回双向关注状态
    """
    is_following = await FollowService.is_following(db, current_user.id, user_id)
    is_followed_by = await FollowService.is_following(db, user_id, current_user.id)

    return FollowStatusResponse(
        is_following=is_following,
        is_followed_by=is_followed_by
    )


@router.get("/followers/{user_id}", response_model=FollowersListResponse)
async def get_followers(
    user_id: int,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """
    获取用户的粉丝列表

    - **user_id**: 用户ID
    - **page**: 页码，从1开始
    - **page_size**: 每页数量，最大100
    """
    skip = (page - 1) * page_size
    result = await FollowService.get_followers(db, user_id, skip, page_size)
    return result


@router.get("/following/{user_id}", response_model=FollowingListResponse)
async def get_following(
    user_id: int,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """
    获取用户的关注列表

    - **user_id**: 用户ID
    - **page**: 页码，从1开始
    - **page_size**: 每页数量，最大100
    """
    skip = (page - 1) * page_size
    result = await FollowService.get_following(db, user_id, skip, page_size)
    return result


@router.get("/stats/{user_id}", response_model=FollowStatsResponse)
async def get_follow_stats(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    获取用户的关注统计

    - **user_id**: 用户ID
    - 返回粉丝数和关注数
    """
    stats = await FollowService.get_follow_stats(db, user_id)
    return FollowStatsResponse(**stats)


@router.get("/me/following", response_model=FollowingListResponse)
async def get_my_following(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的关注列表

    - **page**: 页码，从1开始
    - **page_size**: 每页数量，最大100
    """
    skip = (page - 1) * page_size
    result = await FollowService.get_following(db, current_user.id, skip, page_size)
    return result


@router.get("/me/followers", response_model=FollowersListResponse)
async def get_my_followers(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的粉丝列表

    - **page**: 页码，从1开始
    - **page_size**: 每页数量，最大100
    """
    skip = (page - 1) * page_size
    result = await FollowService.get_followers(db, current_user.id, skip, page_size)
    return result
