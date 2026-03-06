"""
社交功能API路由
提供关注、点赞、收藏等社交功能
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List
from datetime import datetime

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.follow import Follow
from ...models.post import Post
from ...schemas.social import (
    FollowResponse,
    UserProfileResponse,
    FollowerListResponse,
    FollowingListResponse,
    ActivityResponse,
)
from ...services.social_service_enhanced import SocialServiceEnhanced

router = APIRouter(prefix="/social", tags=["社交"])


@router.post("/follow/{user_id}", response_model=FollowResponse)
async def follow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    关注用户
    """
    # 不能关注自己
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="不能关注自己"
        )
    
    # 检查目标用户是否存在
    result = await db.execute(select(User).where(User.id == user_id))
    target_user = result.scalar_one_or_none()
    
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    social_service = SocialServiceEnhanced(db)
    
    # 检查是否已关注
    is_following = await social_service.is_following(
        follower_id=current_user.id,
        following_id=user_id
    )
    
    if is_following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="已经关注过该用户"
        )
    
    # 创建关注关系
    follow = await social_service.follow_user(
        follower_id=current_user.id,
        following_id=user_id
    )
    
    return FollowResponse(
        id=follow.id,
        follower_id=follow.follower_id,
        following_id=follow.following_id,
        created_at=follow.created_at,
    )


@router.delete("/follow/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    取消关注用户
    """
    social_service = SocialServiceEnhanced(db)
    
    success = await social_service.unfollow_user(
        follower_id=current_user.id,
        following_id=user_id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="关注关系不存在"
        )
    
    return None


@router.get("/followers/{user_id}", response_model=FollowerListResponse)
async def get_followers(
    user_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    获取用户的粉丝列表
    """
    social_service = SocialServiceEnhanced(db)
    
    followers, total = await social_service.get_followers(
        user_id=user_id,
        page=page,
        per_page=per_page
    )
    
    return FollowerListResponse(
        followers=followers,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page
    )


@router.get("/following/{user_id}", response_model=FollowingListResponse)
async def get_following(
    user_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    获取用户关注的列表
    """
    social_service = SocialServiceEnhanced(db)
    
    following, total = await social_service.get_following(
        user_id=user_id,
        page=page,
        per_page=per_page
    )
    
    return FollowingListResponse(
        following=following,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page
    )


@router.get("/feed", response_model=List[ActivityResponse])
async def get_activity_feed(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取关注用户的活动动态
    """
    social_service = SocialServiceEnhanced(db)
    
    activities = await social_service.get_activity_feed(
        user_id=current_user.id,
        page=page,
        per_page=per_page
    )
    
    return activities


@router.post("/like/{post_id}", status_code=status.HTTP_200_OK)
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    点赞文章
    """
    # 检查文章是否存在
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    social_service = SocialServiceEnhanced(db)
    
    # 检查是否已点赞
    is_liked = await social_service.is_post_liked(
        user_id=current_user.id,
        post_id=post_id
    )
    
    if is_liked:
        # 取消点赞
        await social_service.unlike_post(
            user_id=current_user.id,
            post_id=post_id
        )
        return {"message": "已取消点赞", "liked": False}
    else:
        # 点赞
        await social_service.like_post(
            user_id=current_user.id,
            post_id=post_id
        )
        return {"message": "点赞成功", "liked": True}


@router.post("/bookmark/{post_id}", status_code=status.HTTP_200_OK)
async def bookmark_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    收藏文章
    """
    # 检查文章是否存在
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    social_service = SocialServiceEnhanced(db)
    
    # 检查是否已收藏
    is_bookmarked = await social_service.is_post_bookmarked(
        user_id=current_user.id,
        post_id=post_id
    )
    
    if is_bookmarked:
        # 取消收藏
        await social_service.unbookmark_post(
            user_id=current_user.id,
            post_id=post_id
        )
        return {"message": "已取消收藏", "bookmarked": False}
    else:
        # 收藏
        await social_service.bookmark_post(
            user_id=current_user.id,
            post_id=post_id
        )
        return {"message": "收藏成功", "bookmarked": True}


@router.get("/bookmarks", response_model=List[dict])
async def get_bookmarks(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取用户的收藏列表
    """
    social_service = SocialServiceEnhanced(db)
    
    bookmarks = await social_service.get_user_bookmarks(
        user_id=current_user.id,
        page=page,
        per_page=per_page
    )
    
    return bookmarks


@router.get("/recommendations/users", response_model=List[UserProfileResponse])
async def get_recommended_users(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取推荐用户（基于兴趣和社交关系）
    """
    social_service = SocialServiceEnhanced(db)
    
    users = await social_service.get_recommended_users(
        user_id=current_user.id,
        limit=limit
    )
    
    return users


@router.get("/stats/{user_id}")
async def get_social_stats(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    获取用户的社交统计数据
    """
    # 检查用户是否存在
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 统计粉丝数
    followers_result = await db.execute(
        select(func.count(Follow.id)).where(Follow.following_id == user_id)
    )
    followers_count = followers_result.scalar() or 0
    
    # 统计关注数
    following_result = await db.execute(
        select(func.count(Follow.id)).where(Follow.follower_id == user_id)
    )
    following_count = following_result.scalar() or 0
    
    return {
        "user_id": user_id,
        "followers_count": followers_count,
        "following_count": following_count,
    }
