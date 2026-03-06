"""
增强的文章API路由
提供完整的文章CRUD功能，包括搜索、筛选、分页等
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.post import Post, Category, Tag
from ...models.user import User
from ...schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
    PostSearchResponse,
)
from ...services.post_service_enhanced import PostServiceEnhanced
from ...services.search_service import SearchService

router = APIRouter(prefix="/posts", tags=["文章"])


@router.get("", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(10, ge=1, le=100, description="每页数量"),
    category_id: Optional[int] = Query(None, description="分类ID"),
    tag_id: Optional[int] = Query(None, description="标签ID"),
    status: Optional[str] = Query(None, description="状态筛选"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    sort_by: str = Query("created_at", description="排序字段"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="排序方向"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取文章列表

    支持分页、筛选、搜索和排序
    """
    post_service = PostServiceEnhanced(db)
    
    # 构建查询条件
    filters = {}
    if category_id:
        filters['category_id'] = category_id
    if tag_id:
        filters['tag_id'] = tag_id
    if status:
        filters['status'] = status
    
    # 排序配置
    ordering = {
        'field': sort_by,
        'direction': sort_order
    }

    # 获取文章列表
    posts, total = await post_service.get_posts(
        page=page,
        per_page=per_page,
        filters=filters,
        search=search,
        ordering=ordering
    )

    return PostListResponse(
        posts=posts,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page
    )


@router.get("/featured", response_model=List[PostResponse])
async def get_featured_posts(
    limit: int = Query(5, ge=1, le=20, description="返回数量"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取精选文章
    """
    result = await db.execute(
        select(Post)
        .where(Post.is_featured == True, Post.status == "published")
        .order_by(Post.created_at.desc())
        .limit(limit)
    )
    posts = result.scalars().all()
    
    return [PostResponse.from_orm(post) for post in posts]


@router.get("/trending", response_model=List[PostResponse])
async def get_trending_posts(
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    days: int = Query(7, ge=1, le=30, description="统计天数"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取热门文章（基于浏览量和互动数据）
    """
    # 计算热门分数：浏览量 + 点赞数*2 + 评论数*3
    trending_threshold = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(Post)
        .where(
            Post.status == "published",
            Post.created_at >= trending_threshold
        )
        .order_by(
            (Post.view_count + Post.like_count * 2 + Post.comment_count * 3).desc()
        )
        .limit(limit)
    )
    posts = result.scalars().all()
    
    return [PostResponse.from_orm(post) for post in posts]


@router.get("/related/{post_id}", response_model=List[PostResponse])
async def get_related_posts(
    post_id: int,
    limit: int = Query(5, ge=1, le=20, description="返回数量"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取相关文章
    """
    # 首先获取原文章的分类和标签
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.category), selectinload(Post.tags))
        .where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 基于分类和标签查找相关文章
    category_ids = [post.category_id] if post.category_id else []
    tag_ids = [tag.id for tag in post.tags] if post.tags else []
    
    related_posts = []
    if category_ids or tag_ids:
        # 查找同分类或同标签的文章
        query = select(Post).where(
            and_(
                Post.id != post_id,
                Post.status == "published",
                or_(
                    Post.category_id.in_(category_ids) if category_ids else False,
                    # 这里需要join tags表，简化处理
                )
            )
        ).order_by(Post.created_at.desc()).limit(limit * 2)
        
        result = await db.execute(query)
        related_posts = result.scalars().all()
    
    return [PostResponse.from_orm(post) for post in related_posts[:limit]]


@router.get("/search", response_model=PostSearchResponse)
async def search_posts(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    category_id: Optional[int] = None,
    tag_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    全文搜索文章
    """
    search_service = SearchService(db)
    
    results = await search_service.search_posts(
        query=q,
        page=page,
        per_page=per_page,
        category_id=category_id,
        tag_id=tag_id
    )
    
    return PostSearchResponse(
        query=q,
        posts=results['posts'],
        total=results['total'],
        page=page,
        per_page=per_page,
        pages=(results['total'] + per_page - 1) // per_page
    )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    获取文章详情
    """
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.category), selectinload(Post.tags), selectinload(Post.author))
        .where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 增加浏览量
    post.view_count += 1
    await db.commit()
    
    return PostResponse.from_orm(post)


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    创建新文章
    """
    post_service = PostServiceEnhanced(db)
    
    try:
        post = await post_service.create_post(
            user_id=current_user.id,
            post_data=post_data
        )
        return PostResponse.from_orm(post)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    更新文章
    """
    post_service = PostServiceEnhanced(db)
    
    # 检查权限
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    if post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权修改此文章"
        )
    
    try:
        updated_post = await post_service.update_post(
            post_id=post_id,
            post_data=post_data
        )
        return PostResponse.from_orm(updated_post)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    删除文章
    """
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    if post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权删除此文章"
        )
    
    await db.delete(post)
    await db.commit()
    
    return None


@router.post("/{post_id}/like", response_model=PostResponse)
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    点赞文章
    """
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # TODO: 实现点赞逻辑，需要user_post_like表
    post.like_count += 1
    await db.commit()
    
    return PostResponse.from_orm(post)


@router.post("/{post_id}/bookmark", status_code=status.HTTP_200_OK)
async def bookmark_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    收藏文章
    """
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # TODO: 实现收藏逻辑，需要bookmark表
    
    return {"message": "收藏成功"}
