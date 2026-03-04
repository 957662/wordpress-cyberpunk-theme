"""
Social API Routes
社交功能API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.social import LikeCreate, LikeResponse, BookmarkCreate, BookmarkResponse
from app.services.social_service import SocialService
from app.models.user import User
from app.core.deps import get_current_active_user

router = APIRouter()


@router.post("/posts/{post_id}/like", response_model=LikeResponse)
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """点赞文章"""
    try:
        like = SocialService.like_post(db=db, post_id=post_id, user_id=current_user.id)
        return like
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/posts/{post_id}/like", status_code=204)
async def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """取消点赞文章"""
    try:
        SocialService.unlike_post(db=db, post_id=post_id, user_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return None


@router.get("/posts/{post_id}/likes", response_model=List[LikeResponse])
async def get_post_likes(
    post_id: int,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """获取文章点赞列表"""
    try:
        likes = SocialService.get_post_likes(db=db, post_id=post_id, limit=limit)
        return likes
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/posts/{post_id}/bookmark", response_model=BookmarkResponse)
async def bookmark_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """收藏文章"""
    try:
        bookmark = SocialService.bookmark_post(db=db, post_id=post_id, user_id=current_user.id)
        return bookmark
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/posts/{post_id}/bookmark", status_code=204)
async def unbookmark_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """取消收藏文章"""
    try:
        SocialService.unbookmark_post(db=db, post_id=post_id, user_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return None


@router.get("/bookmarks", response_model=List[BookmarkResponse])
async def get_user_bookmarks(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """获取用户收藏列表"""
    skip = (page - 1) * page_size
    bookmarks = SocialService.get_user_bookmarks(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=page_size
    )
    return bookmarks


@router.get("/posts/{post_id}/is-liked")
async def check_post_liked(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """检查文章是否已点赞"""
    is_liked = SocialService.check_post_liked(db=db, post_id=post_id, user_id=current_user.id)
    return {"is_liked": is_liked}


@router.get("/posts/{post_id}/is-bookmarked")
async def check_post_bookmarked(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """检查文章是否已收藏"""
    is_bookmarked = SocialService.check_post_bookmarked(db=db, post_id=post_id, user_id=current_user.id)
    return {"is_bookmarked": is_bookmarked}
