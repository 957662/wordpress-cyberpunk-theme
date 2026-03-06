"""
Categories API Routes
提供分类相关的API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.core.database import get_db
from backend.app.core.auth import get_current_user, get_current_active_user
from backend.app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListResponse
from backend.app.services.category_service import CategoryService
from backend.app.models.user import User


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=CategoryListResponse)
async def get_categories(
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(20, ge=1, le=100, description="每页数量"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    db: Session = Depends(get_db),
):
    """
    获取分类列表

    支持分页、搜索等功能
    """
    category_service = CategoryService(db)

    # 构建查询参数
    filters = {}
    if search:
        filters["search"] = search

    # 获取分类列表
    categories, total = category_service.get_categories(
        page=page,
        per_page=per_page,
        filters=filters
    )

    return CategoryListResponse(
        data=categories,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    """
    获取单个分类详情
    """
    category_service = CategoryService(db)
    category = category_service.get_category(category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    return category


@router.get("/slug/{slug}", response_model=CategoryResponse)
async def get_category_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    通过slug获取分类详情
    """
    category_service = CategoryService(db)
    category = category_service.get_category_by_slug(slug)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    return category


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    创建新分类

    需要认证,仅管理员可用
    """
    # 检查权限
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="仅管理员可创建分类"
        )

    category_service = CategoryService(db)

    # 检查分类名是否已存在
    existing = category_service.get_category_by_name(category_data.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="分类名称已存在"
        )

    # 创建分类
    category = category_service.create_category(
        name=category_data.name,
        slug=category_data.slug,
        description=category_data.description,
    )

    return category


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    更新分类

    需要认证,仅管理员可用
    """
    # 检查权限
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="仅管理员可更新分类"
        )

    category_service = CategoryService(db)
    category = category_service.get_category(category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    # 更新分类
    updated_category = category_service.update_category(
        category_id,
        category_data.dict(exclude_unset=True)
    )

    return updated_category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    删除分类

    需要认证,仅管理员可用
    """
    # 检查权限
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="仅管理员可删除分类"
        )

    category_service = CategoryService(db)
    category = category_service.get_category(category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    # 删除分类
    category_service.delete_category(category_id)

    return None


@router.get("/{category_id}/posts", response_model=List[dict])
async def get_category_posts(
    category_id: int,
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(10, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
):
    """
    获取分类下的文章列表
    """
    category_service = CategoryService(db)
    category = category_service.get_category(category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    # 获取分类下的文章
    posts, total = category_service.get_category_posts(
        category_id,
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
