"""
Posts API Routes
提供文章相关的API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from backend.app.core.database import get_db
from backend.app.core.auth import get_current_user, get_current_active_user
from backend.app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
    PostDetailResponse,
)
from backend.app.services.post_service import PostService
from backend.app.models.user import User

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(10, ge=1, le=100, description="每页数量"),
    category: Optional[str] = Query(None, description="分类slug"),
    tag: Optional[str] = Query(None, description="标签slug"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    status: Optional[str] = Query("published", description="文章状态"),
    sort: Optional[str] = Query("latest", description="排序方式: latest/popular/trending"),
    author: Optional[int] = Query(None, description="作者ID"),
    db: Session = Depends(get_db),
):
    """
    获取文章列表

    支持分页、分类筛选、标签筛选、搜索等功能
    """
    post_service = PostService(db)

    # 构建查询参数
    filters = {}
    if category:
        filters["category_slug"] = category
    if tag:
        filters["tag_slug"] = tag
    if search:
        filters["search"] = search
    if status:
        filters["status"] = status
    if author:
        filters["author_id"] = author

    # 排序方式
    sort_map = {
        "latest": "published_at",
        "popular": "view_count",
        "trending": "like_count",
    }
    order_by = sort_map.get(sort, "published_at")

    # 获取文章列表
    posts, total = post_service.get_posts(
        page=page,
        per_page=per_page,
        filters=filters,
        order_by=order_by,
    )

    return PostListResponse(
        data=posts,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{post_id}", response_model=PostDetailResponse)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    """
    获取单篇文章详情
    """
    post_service = PostService(db)
    post = post_service.get_post(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )

    # 增加浏览次数
    post_service.increment_view_count(post_id)

    return post


@router.get("/slug/{slug}", response_model=PostDetailResponse)
async def get_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    通过slug获取文章详情
    """
    post_service = PostService(db)
    post = post_service.get_post_by_slug(slug)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )

    # 增加浏览次数
    post_service.increment_view_count(post.id)

    return post


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    创建新文章

    需要认证
    """
    post_service = PostService(db)

    # 创建文章
    post = post_service.create_post(
        title=post_data.title,
        content=post_data.content,
        excerpt=post_data.excerpt,
        category_id=post_data.category_id,
        tags=post_data.tags,
        author_id=current_user.id,
        featured_image=post_data.featured_image,
        status=post_data.status or "draft",
    )

    return post


@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    更新文章

    需要认证，且只有作者或管理员可以更新
    """
    post_service = PostService(db)
    post = post_service.get_post(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )

    # 检查权限
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权修改此文章"
        )

    # 更新文章
    updated_post = post_service.update_post(post_id, post_data.dict(exclude_unset=True))

    return updated_post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    删除文章

    需要认证，且只有作者或管理员可以删除
    """
    post_service = PostService(db)
    post = post_service.get_post(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )

    # 检查权限
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权删除此文章"
        )

    # 删除文章
    post_service.delete_post(post_id)

    return None


@router.get("/{post_id}/related", response_model=List[PostResponse])
async def get_related_posts(
    post_id: int,
    limit: int = Query(4, ge=1, le=10, description="返回数量"),
    db: Session = Depends(get_db),
):
    """
    获取相关文章推荐
    """
    post_service = PostService(db)
    related_posts = post_service.get_related_posts(post_id, limit)

    return related_posts


@router.post("/{post_id}/like", status_code=status.HTTP_200_OK)
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    点赞文章

    需要认证
    """
    post_service = PostService(db)
    post = post_service.get_post(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )

    # 点赞
    post_service.toggle_like(post_id, current_user.id)

    return {"message": "操作成功"}


@router.delete("/{post_id}/like", status_code=status.HTTP_200_OK)
async def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    取消点赞文章

    需要认证
    """
    post_service = PostService(db)
    post_service.toggle_like(post_id, current_user.id, unlike=True)

    return {"message": "操作成功"}


@router.post("/{post_id}/bookmark", status_code=status.HTTP_200_OK)
async def bookmark_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    收藏文章

    需要认证
    """
    post_service = PostService(db)
    post = post_service.get_post(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )

    # 收藏
    post_service.toggle_bookmark(post_id, current_user.id)

    return {"message": "操作成功"}


@router.delete("/{post_id}/bookmark", status_code=status.HTTP_200_OK)
async def unbookmark_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    取消收藏文章

    需要认证
    """
    post_service = PostService(db)
    post_service.toggle_bookmark(post_id, current_user.id, unbookmark=True)

    return {"message": "操作成功"}


@router.get("/trending/list", response_model=List[PostResponse])
async def get_trending_posts(
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db),
):
    """
    获取趋势文章列表

    基于最近7天的点赞数和浏览数
    """
    post_service = PostService(db)
    trending_posts = post_service.get_trending_posts(limit)

    return trending_posts


@router.get("/recommended/list", response_model=List[PostResponse])
async def get_recommended_posts(
    limit: int = Query(5, ge=1, le=20, description="返回数量"),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取推荐文章

    基于用户兴趣和历史记录
    """
    post_service = PostService(db)

    if current_user:
        # 为登录用户提供个性化推荐
        recommended_posts = post_service.get_personalized_recommendations(
            current_user.id, limit
        )
    else:
        # 为未登录用户提供热门文章
        recommended_posts = post_service.get_trending_posts(limit)

    return recommended_posts
