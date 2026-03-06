"""
Tags API Routes
提供标签相关的API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.core.database import get_db
from backend.app.core.auth import get_current_user, get_current_active_user
from backend.app.schemas.tag import TagCreate, TagUpdate, TagResponse, TagListResponse
from backend.app.services.tag_service import TagService
from backend.app.models.user import User


router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("/", response_model=TagListResponse)
async def get_tags(
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(20, ge=1, le=100, description="每页数量"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    sort: Optional[str] = Query("name", description="排序方式: name/popular"),
    db: Session = Depends(get_db),
):
    """
    获取标签列表

    支持分页、搜索、排序等功能
    """
    tag_service = TagService(db)

    # 构建查询参数
    filters = {}
    if search:
        filters["search"] = search

    # 获取标签列表
    tags, total = tag_service.get_tags(
        page=page,
        per_page=per_page,
        filters=filters,
        order_by="post_count" if sort == "popular" else "name"
    )

    return TagListResponse(
        data=tags,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{tag_id}", response_model=TagResponse)
async def get_tag(
    tag_id: int,
    db: Session = Depends(get_db),
):
    """
    获取单个标签详情
    """
    tag_service = TagService(db)
    tag = tag_service.get_tag(tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    return tag


@router.get("/slug/{slug}", response_model=TagResponse)
async def get_tag_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    通过slug获取标签详情
    """
    tag_service = TagService(db)
    tag = tag_service.get_tag_by_slug(slug)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    return tag


@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_data: TagCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    创建新标签

    需要认证,仅管理员可用
    """
    # 检查权限
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="仅管理员可创建标签"
        )

    tag_service = TagService(db)

    # 检查标签名是否已存在
    existing = tag_service.get_tag_by_name(tag_data.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="标签名称已存在"
        )

    # 创建标签
    tag = tag_service.create_tag(
        name=tag_data.name,
        slug=tag_data.slug,
    )

    return tag


@router.patch("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: int,
    tag_data: TagUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    更新标签

    需要认证,仅管理员可用
    """
    # 检查权限
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="仅管理员可更新标签"
        )

    tag_service = TagService(db)
    tag = tag_service.get_tag(tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    # 更新标签
    updated_tag = tag_service.update_tag(
        tag_id,
        tag_data.dict(exclude_unset=True)
    )

    return updated_tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    删除标签

    需要认证,仅管理员可用
    """
    # 检查权限
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="仅管理员可删除标签"
        )

    tag_service = TagService(db)
    tag = tag_service.get_tag(tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    # 删除标签
    tag_service.delete_tag(tag_id)

    return None


@router.get("/popular/list", response_model=List[TagResponse])
async def get_popular_tags(
    limit: int = Query(20, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db),
):
    """
    获取热门标签列表

    基于文章数量排序
    """
    tag_service = TagService(db)
    tags, _ = tag_service.get_tags(
        page=1,
        per_page=limit,
        order_by="post_count"
    )

    return tags


@router.get("/{tag_id}/posts", response_model=dict)
async def get_tag_posts(
    tag_id: int,
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(10, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
):
    """
    获取标签下的文章列表
    """
    tag_service = TagService(db)
    tag = tag_service.get_tag(tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    # 获取标签下的文章
    posts, total = tag_service.get_tag_posts(
        tag_id,
        page=page,
        per_page=per_page
    )

    return {
        "data": posts,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }
