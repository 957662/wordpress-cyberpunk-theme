"""
Enhanced Posts API Routes
提供完整的文章API端点
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.post_service_enhanced import PostService
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.models.user import User


router = APIRouter()


def get_post_service(db: AsyncSession = Depends(get_db)) -> PostService:
    """获取文章服务实例"""
    return PostService(db)


@router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    status: str = Query("published", description="文章状态"),
    category_id: Optional[int] = Query(None, description="分类ID"),
    tag_id: Optional[int] = Query(None, description="标签ID"),
    author_id: Optional[int] = Query(None, description="作者ID"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    sort_by: str = Query("created_at", description="排序字段"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="排序方向"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取文章列表

    支持多种筛选和排序选项
    """
    posts, total = await post_service.get_posts(
        skip=skip,
        limit=limit,
        status=status,
        category_id=category_id,
        tag_id=tag_id,
        author_id=author_id,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

    return [PostResponse.from_orm(post) for post in posts]


@router.get("/featured", response_model=List[PostResponse])
async def get_featured_posts(
    limit: int = Query(10, ge=1, le=50, description="返回的文章数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取精选文章
    """
    posts = await post_service.get_featured_posts(limit=limit)
    return [PostResponse.from_orm(post) for post in posts]


@router.get("/trending", response_model=List[PostResponse])
async def get_trending_posts(
    limit: int = Query(10, ge=1, le=50, description="返回的文章数"),
    days: int = Query(7, ge=1, le=30, description="统计天数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取热门文章
    """
    posts = await post_service.get_trending_posts(limit=limit, days=days)
    return [PostResponse.from_orm(post) for post in posts]


@router.get("/search", response_model=List[PostResponse])
async def search_posts(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    搜索文章
    """
    posts, total = await post_service.search_posts(
        query=q,
        skip=skip,
        limit=limit
    )

    return [PostResponse.from_orm(post) for post in posts]


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    post_service: PostService = Depends(get_post_service)
):
    """
    获取文章详情
    """
    post = await post_service.get_post(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # 增加浏览次数
    await post_service.increment_views(post_id)

    return PostResponse.from_orm(post)


@router.get("/slug/{slug}", response_model=PostResponse)
async def get_post_by_slug(
    slug: str,
    post_service: PostService = Depends(get_post_service)
):
    """
    通过slug获取文章
    """
    post = await post_service.get_post_by_slug(slug)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # 增加浏览次数
    await post_service.increment_views(post.id)

    return PostResponse.from_orm(post)


@router.get("/{post_id}/related", response_model=List[PostResponse])
async def get_related_posts(
    post_id: int,
    limit: int = Query(5, ge=1, le=20, description="返回的文章数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取相关文章
    """
    posts = await post_service.get_related_posts(post_id, limit=limit)
    return [PostResponse.from_orm(post) for post in posts]


@router.get("/{post_id}/stats")
async def get_post_stats(
    post_id: int,
    post_service: PostService = Depends(get_post_service)
):
    """
    获取文章统计信息
    """
    return await post_service.get_post_stats(post_id)


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """
    创建文章

    需要认证
    """
    return await post_service.create_post(
        post_data=post_data,
        author_id=current_user.id,
        status="draft"  # 默认为草稿
    )


@router.post("/publish", response_model=PostResponse)
async def publish_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """
    创建并发布文章

    需要认证
    """
    return await post_service.create_post(
        post_data=post_data,
        author_id=current_user.id,
        status="published"
    )


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """
    更新文章

    需要认证，只能更新自己的文章
    """
    return await post_service.update_post(
        post_id=post_id,
        post_data=post_data,
        user_id=current_user.id
    )


@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    permanent: bool = Query(False, description="是否永久删除"),
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """
    删除文章

    需要认证，只能删除自己的文章
    - permanent=false: 软删除（默认）
    - permanent=true: 永久删除
    """
    await post_service.delete_post(
        post_id=post_id,
        user_id=current_user.id,
        permanent=permanent
    )
    return {"message": "Post deleted successfully"}


@router.post("/{post_id}/publish", response_model=PostResponse)
async def publish_existing_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """
    发布草稿文章

    需要认证
    """
    return await post_service.publish_post(
        post_id=post_id,
        user_id=current_user.id
    )


@router.post("/{post_id}/unpublish", response_model=PostResponse)
async def unpublish_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """
    取消发布文章

    需要认证
    """
    return await post_service.unpublish_post(
        post_id=post_id,
        user_id=current_user.id
    )


@router.get("/author/{author_id}", response_model=List[PostResponse])
async def get_posts_by_author(
    author_id: int,
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取作者的文章列表
    """
    posts, total = await post_service.get_posts_by_author(
        author_id=author_id,
        skip=skip,
        limit=limit
    )

    return [PostResponse.from_orm(post) for post in posts]


@router.get("/category/{category_id}", response_model=List[PostResponse])
async def get_posts_by_category(
    category_id: int,
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取分类的文章列表
    """
    posts, total = await post_service.get_posts_by_category(
        category_id=category_id,
        skip=skip,
        limit=limit
    )

    return [PostResponse.from_orm(post) for post in posts]


@router.get("/tag/{tag_id}", response_model=List[PostResponse])
async def get_posts_by_tag(
    tag_id: int,
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    post_service: PostService = Depends(get_post_service)
):
    """
    获取标签的文章列表
    """
    posts, total = await post_service.get_posts_by_tag(
        tag_id=tag_id,
        skip=skip,
        limit=limit
    )

    return [PostResponse.from_orm(post) for post in posts]
