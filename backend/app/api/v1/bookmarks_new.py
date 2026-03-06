"""
Bookmarks API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime

from ...core.database import get_db
from ...core.deps import get_current_user
from ...models.user import User
from ...models.bookmark import Bookmark
from ...models.post import Post
from ...schemas.bookmark import BookmarkResponse, BookmarkCreate

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.post("/", response_model=BookmarkResponse)
async def create_bookmark(
    bookmark_data: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new bookmark
    """
    # Check if post exists
    result = await db.execute(select(Post).where(Post.id == bookmark_data.post_id))
    post = result.scalar_one_or_none()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if already bookmarked
    existing = await db.execute(
        select(Bookmark).where(
            Bookmark.user_id == current_user.id,
            Bookmark.post_id == bookmark_data.post_id
        )
    )

    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post already bookmarked"
        )

    # Create bookmark
    bookmark = Bookmark(
        user_id=current_user.id,
        post_id=bookmark_data.post_id,
        notes=bookmark_data.notes
    )

    db.add(bookmark)
    await db.commit()
    await db.refresh(bookmark)

    return bookmark


@router.get("/", response_model=List[BookmarkResponse])
async def get_bookmarks(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user's bookmarks
    """
    result = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .order_by(Bookmark.created_at.desc())
    )

    bookmarks = result.scalars().all()

    return bookmarks


@router.get("/{bookmark_id}", response_model=BookmarkResponse)
async def get_bookmark(
    bookmark_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific bookmark
    """
    result = await db.execute(
        select(Bookmark).where(
            Bookmark.id == bookmark_id,
            Bookmark.user_id == current_user.id
        )
    )

    bookmark = result.scalar_one_or_none()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )

    return bookmark


@router.put("/{bookmark_id}", response_model=BookmarkResponse)
async def update_bookmark(
    bookmark_id: str,
    notes: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update bookmark notes
    """
    result = await db.execute(
        select(Bookmark).where(
            Bookmark.id == bookmark_id,
            Bookmark.user_id == current_user.id
        )
    )

    bookmark = result.scalar_one_or_none()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )

    bookmark.notes = notes
    bookmark.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(bookmark)

    return bookmark


@router.delete("/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(
    bookmark_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a bookmark
    """
    result = await db.execute(
        select(Bookmark).where(
            Bookmark.id == bookmark_id,
            Bookmark.user_id == current_user.id
        )
    )

    bookmark = result.scalar_one_or_none()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )

    await db.delete(bookmark)
    await db.commit()


@router.get("/check/{post_id}", response_model=dict)
async def check_if_bookmarked(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Check if a post is bookmarked
    """
    result = await db.execute(
        select(Bookmark).where(
            Bookmark.user_id == current_user.id,
            Bookmark.post_id == post_id
        )
    )

    bookmark = result.scalar_one_or_none()

    return {"is_bookmarked": bookmark is not None}
