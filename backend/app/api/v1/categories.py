"""
Categories API Routes
分类相关API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.models.post import Category

router = APIRouter()


@router.get("", response_model=List[CategoryResponse])
async def get_categories(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(100, ge=1, le=100, description="数量限制"),
    db: Session = Depends(get_db),
):
    """获取分类列表"""
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    """获取分类详情"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="分类不存在")

    # 统计文章数量
    category.posts_count = len(category.posts)

    return category


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
):
    """创建分类（需要认证）"""
    # 检查名称是否已存在
    existing = db.query(Category).filter(Category.name == category_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="分类名称已存在")

    # 生成slug
    slug = category_data.slug or category_data.name.lower().replace(" ", "-")

    # 检查slug是否已存在
    existing_slug = db.query(Category).filter(Category.slug == slug).first()
    if existing_slug:
        raise HTTPException(status_code=400, detail="分类slug已存在")

    db_category = Category(
        name=category_data.name,
        slug=slug,
        description=category_data.description,
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
):
    """更新分类（需要认证）"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="分类不存在")

    # 更新字段
    update_data = category_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    """删除分类（需要认证）"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="分类不存在")

    db.delete(category)
    db.commit()

    return None
