"""
Posts API Routes
文章相关API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostList
from app.schemas.common import PaginatedResponse, PaginationParams
from app.services.post_service import PostService
from app.models.post import Post

router = APIRouter()


@router.get("", response_model=PaginatedResponse[PostList])
async def get_posts(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量"),
    status: str = Query("published", description="文章状态"),
    category_id: Optional[int] = Query(None, description="分类ID"),
    tag_id: Optional[int] = Query(None, description="标签ID"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    db: Session = Depends(get_db),
):
    """获取文章列表"""
    skip = (page - 1) * page_size

    posts, total = PostService.get_posts(
        db=db,
        skip=skip,
        limit=page_size,
        status=status,
        category_id=category_id,
        tag_id=tag_id,
        search=search,
    )

    total_pages = (total + page_size - 1) // page_size

    return PaginatedResponse(
        data=posts,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/featured", response_model=List[PostList])
async def get_featured_posts(
    limit: int = Query(5, ge=1, le=20, description="数量限制"),
    db: Session = Depends(get_db),
):
    """获取精选文章"""
    posts = PostService.get_featured_posts(db=db, limit=limit)
    return posts


@router.get("/recent", response_model=List[PostList])
async def get_recent_posts(
    limit: int = Query(10, ge=1, le=50, description="数量限制"),
    db: Session = Depends(get_db),
):
    """获取最新文章"""
    posts = PostService.get_recent_posts(db=db, limit=limit)
    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    """获取文章详情"""
    post = PostService.get_post_by_id(db=db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 增加浏览次数
    PostService.increment_view_count(db=db, post=post)

    return post


@router.get("/slug/{slug}", response_model=PostResponse)
async def get_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """通过slug获取文章"""
    post = PostService.get_post_by_slug(db=db, slug=slug)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 增加浏览次数
    PostService.increment_view_count(db=db, post=post)

    return post


@router.post("", response_model=PostResponse, status_code=201)
async def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
):
    """创建文章（需要认证）"""
    # TODO: 添加认证后，从token中获取author_id
    author_id = 1  # 临时硬编码

    try:
        post = PostService.create_post(db=db, post_data=post_data, author_id=author_id)
        return post
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
):
    """更新文章（需要认证）"""
    post = PostService.get_post_by_id(db=db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")

    # TODO: 添加权限检查

    try:
        updated_post = PostService.update_post(db=db, post=post, post_data=post_data)
        return updated_post
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    """删除文章（需要认证）"""
    post = PostService.get_post_by_id(db=db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")

    # TODO: 添加权限检查

    PostService.delete_post(db=db, post=post)
    return None
