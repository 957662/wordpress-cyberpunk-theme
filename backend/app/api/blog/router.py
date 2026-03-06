"""
博客 API 路由
提供博客文章相关的 API 端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.core.database import get_db
from backend.app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListResponse,
)
from backend.app.services.blog import BlogService
from backend.app.api.dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("/posts", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(10, ge=1, le=100, description="每页数量"),
    category_id: Optional[int] = Query(None, description="分类ID"),
    tag_id: Optional[int] = Query(None, description="标签ID"),
    author_id: Optional[int] = Query(None, description="作者ID"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    status: Optional[str] = Query("published", description="文章状态"),
    order_by: Optional[str] = Query("created_at", description="排序字段"),
    order: Optional[str] = Query("desc", description="排序方向"),
    db: Session = Depends(get_db),
):
    """
    获取博客文章列表

    - **page**: 页码，从1开始
    - **per_page**: 每页文章数量，最多100篇
    - **category_id**: 按分类筛选
    - **tag_id**: 按标签筛选
    - **author_id**: 按作者筛选
    - **search**: 搜索标题和内容
    - **status**: 文章状态（published, draft, private）
    - **order_by**: 排序字段
    - **order**: 排序方向（asc, desc）
    """
    blog_service = BlogService(db)

    try:
        result = await blog_service.get_posts(
            page=page,
            per_page=per_page,
            category_id=category_id,
            tag_id=tag_id,
            author_id=author_id,
            search=search,
            status=status,
            order_by=order_by,
            order=order,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取文章列表失败: {str(e)}"
        )


@router.get("/posts/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    """
    获取单篇博客文章详情

    - **post_id**: 文章ID
    """
    blog_service = BlogService(db)

    try:
        post = await blog_service.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文章不存在"
            )
        return post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取文章详情失败: {str(e)}"
        )


@router.get("/posts/slug/{slug}", response_model=PostResponse)
async def get_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    通过 slug 获取博客文章

    - **slug**: 文章的 URL 友好标识符
    """
    blog_service = BlogService(db)

    try:
        post = await blog_service.get_post_by_slug(slug)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文章不存在"
            )
        return post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取文章失败: {str(e)}"
        )


@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: dict = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    创建新博客文章

    需要认证
    """
    blog_service = BlogService(db)

    try:
        post = await blog_service.create_post(
            post_data=post_data,
            author_id=current_user["id"]
        )
        return post
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建文章失败: {str(e)}"
        )


@router.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    更新博客文章

    需要认证，只有作者或管理员可以更新
    """
    blog_service = BlogService(db)

    try:
        # 检查权限
        post = await blog_service.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文章不存在"
            )

        if post["author_id"] != current_user["id"] and not current_user.get("is_admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无权限修改此文章"
            )

        updated_post = await blog_service.update_post(post_id, post_data)
        return updated_post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新文章失败: {str(e)}"
        )


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: dict = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    删除博客文章

    需要认证，只有作者或管理员可以删除
    """
    blog_service = BlogService(db)

    try:
        # 检查权限
        post = await blog_service.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文章不存在"
            )

        if post["author_id"] != current_user["id"] and not current_user.get("is_admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无权限删除此文章"
            )

        await blog_service.delete_post(post_id)
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除文章失败: {str(e)}"
        )


@router.get("/categories")
async def get_categories(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    hide_empty: bool = Query(False),
    db: Session = Depends(get_db),
):
    """获取分类列表"""
    blog_service = BlogService(db)
    return await blog_service.get_categories(
        page=page,
        per_page=per_page,
        hide_empty=hide_empty
    )


@router.get("/tags")
async def get_tags(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    hide_empty: bool = Query(False),
    db: Session = Depends(get_db),
):
    """获取标签列表"""
    blog_service = BlogService(db)
    return await blog_service.get_tags(
        page=page,
        per_page=per_page,
        hide_empty=hide_empty
    )


@router.post("/posts/{post_id}/like", response_model=dict)
async def like_post(
    post_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    点赞文章

    需要认证
    """
    blog_service = BlogService(db)

    try:
        result = await blog_service.like_post(post_id, current_user["id"])
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"点赞失败: {str(e)}"
        )


@router.post("/posts/{post_id}/bookmark", response_model=dict)
async def bookmark_post(
    post_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    收藏文章

    需要认证
    """
    blog_service = BlogService(db)

    try:
        result = await blog_service.bookmark_post(post_id, current_user["id"])
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"收藏失败: {str(e)}"
        )
