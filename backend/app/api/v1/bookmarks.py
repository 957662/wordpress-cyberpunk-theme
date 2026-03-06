"""
收藏 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.bookmark import (
    BookmarkCreate,
    BookmarkUpdate,
    BookmarkResponse,
    BookmarkListResponse,
    BookmarkStatusResponse
)
from app.services.bookmark_service import BookmarkService

router = APIRouter()


@router.post("/bookmarks", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def create_bookmark(
    bookmark_data: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    创建收藏

    - **target_type**: 目标类型（post, project, category）
    - **target_id**: 目标ID
    - **notes**: 备注信息（可选）
    """
    try:
        return BookmarkService.create_bookmark(db, current_user.id, bookmark_data)
    except ValueError as e:
        if str(e) == "Already bookmarked":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already bookmarked"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/bookmarks/{bookmark_id}", response_model=BookmarkResponse)
async def update_bookmark(
    bookmark_id: int,
    bookmark_data: BookmarkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    更新收藏

    - **notes**: 备注信息
    """
    bookmark = BookmarkService.update_bookmark(db, current_user.id, bookmark_id, bookmark_data)
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )
    return bookmark


@router.delete("/bookmarks/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(
    bookmark_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    删除收藏

    根据收藏ID删除
    """
    success = BookmarkService.delete_bookmark(db, current_user.id, bookmark_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )


@router.delete("/bookmarks/target/{target_type}/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark_by_target(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    删除收藏

    根据目标类型和ID删除
    - **target_type**: 目标类型（post, project, category）
    - **target_id**: 目标ID
    """
    success = BookmarkService.delete_bookmark_by_target(db, current_user.id, target_type, target_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )


@router.get("/bookmarks/status/{target_type}/{target_id}", response_model=BookmarkStatusResponse)
async def get_bookmark_status(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取收藏状态

    返回当前用户对指定目标的收藏状态
    """
    return BookmarkService.get_bookmark_status(db, current_user.id, target_type, target_id)


@router.get("/bookmarks/my", response_model=BookmarkListResponse)
async def get_my_bookmarks(
    target_type: Optional[str] = Query(None, description="目标类型过滤（可选）"),
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取我的收藏列表

    返回当前用户的收藏记录，可以按目标类型过滤
    """
    return BookmarkService.get_user_bookmarks(db, current_user.id, target_type, skip, limit)


@router.get("/bookmarks/{bookmark_id}", response_model=BookmarkResponse)
async def get_bookmark(
    bookmark_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取收藏详情

    根据收藏ID获取详细信息
    """
    bookmark = BookmarkService.get_bookmark_by_id(db, current_user.id, bookmark_id)
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )
    return bookmark


@router.post("/bookmarks/toggle/{target_type}/{target_id}", response_model=BookmarkStatusResponse)
async def toggle_bookmark(
    target_type: str,
    target_id: int,
    notes: Optional[str] = Query(None, description="备注信息（新建时使用）"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    切换收藏状态

    如果已收藏则取消，未收藏则添加
    - **notes**: 备注信息（仅在新建时使用）
    """
    return BookmarkService.toggle_bookmark(db, current_user.id, target_type, target_id, notes)


@router.get("/bookmarks/search", response_model=BookmarkListResponse)
async def search_bookmarks(
    keyword: Optional[str] = Query(None, description="搜索关键词（搜索备注）"),
    target_type: Optional[str] = Query(None, description="目标类型过滤"),
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    搜索收藏

    根据关键词搜索备注，可以按目标类型过滤
    """
    return BookmarkService.search_bookmarks(db, current_user.id, keyword, target_type, skip, limit)
