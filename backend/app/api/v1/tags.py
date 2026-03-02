"""
Tags API Routes
标签相关API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.models.post import Tag

router = APIRouter()


@router.get("", response_model=List[TagResponse])
async def get_tags(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(100, ge=1, le=100, description="数量限制"),
    db: Session = Depends(get_db),
):
    """获取标签列表"""
    tags = db.query(Tag).offset(skip).limit(limit).all()
    return tags


@router.get("/{tag_id}", response_model=TagResponse)
async def get_tag(
    tag_id: int,
    db: Session = Depends(get_db),
):
    """获取标签详情"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="标签不存在")

    # 统计文章数量
    tag.posts_count = len(tag.posts)

    return tag


@router.post("", response_model=TagResponse, status_code=201)
async def create_tag(
    tag_data: TagCreate,
    db: Session = Depends(get_db),
):
    """创建标签（需要认证）"""
    # 检查名称是否已存在
    existing = db.query(Tag).filter(Tag.name == tag_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="标签名称已存在")

    # 生成slug
    slug = tag_data.slug or tag_data.name.lower().replace(" ", "-")

    # 检查slug是否已存在
    existing_slug = db.query(Tag).filter(Tag.slug == slug).first()
    if existing_slug:
        raise HTTPException(status_code=400, detail="标签slug已存在")

    db_tag = Tag(
        name=tag_data.name,
        slug=slug,
    )

    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)

    return db_tag


@router.put("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: int,
    tag_data: TagUpdate,
    db: Session = Depends(get_db),
):
    """更新标签（需要认证）"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="标签不存在")

    # 更新字段
    update_data = tag_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tag, field, value)

    db.commit()
    db.refresh(tag)

    return tag


@router.delete("/{tag_id}", status_code=204)
async def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
):
    """删除标签（需要认证）"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="标签不存在")

    db.delete(tag)
    db.commit()

    return None
