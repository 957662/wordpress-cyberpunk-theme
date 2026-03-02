"""
Projects API Routes
项目作品相关API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.portfolio import ProjectCreate, ProjectUpdate, ProjectResponse
from app.models.portfolio import Project

router = APIRouter()


@router.get("", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(20, ge=1, le=100, description="数量限制"),
    status: str = Query("published", description="项目状态"),
    featured: Optional[int] = Query(None, description="是否精选"),
    project_type: Optional[str] = Query(None, description="项目类型"),
    db: Session = Depends(get_db),
):
    """获取项目列表"""
    query = db.query(Project).filter(Project.status == status)

    if featured is not None:
        query = query.filter(Project.featured == featured)

    if project_type:
        query = query.filter(Project.project_type == project_type)

    projects = query.order_by(Project.sort_order.asc(), Project.created_at.desc()).offset(skip).limit(limit).all()

    return projects


@router.get("/featured", response_model=List[ProjectResponse])
async def get_featured_projects(
    limit: int = Query(6, ge=1, le=20, description="数量限制"),
    db: Session = Depends(get_db),
):
    """获取精选项目"""
    projects = (
        db.query(Project)
        .filter(Project.status == "published", Project.featured == 1)
        .order_by(Project.sort_order.asc())
        .limit(limit)
        .all()
    )

    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    """获取项目详情"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # 增加浏览次数
    project.view_count += 1
    db.commit()

    return project


@router.get("/slug/{slug}", response_model=ProjectResponse)
async def get_project_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """通过slug获取项目"""
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # 增加浏览次数
    project.view_count += 1
    db.commit()

    return project


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
):
    """创建项目（需要认证）"""
    # TODO: 添加认证后，从token中获取author_id
    author_id = 1  # 临时硬编码

    # 生成slug
    slug = project_data.slug or project_data.title.lower().replace(" ", "-")

    # 检查slug是否已存在
    existing = db.query(Project).filter(Project.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="项目slug已存在")

    db_project = Project(
        title=project_data.title,
        slug=slug,
        description=project_data.description,
        content=project_data.content,
        demo_url=project_data.demo_url,
        repo_url=project_data.repo_url,
        technologies=project_data.technologies,
        thumbnail_url=project_data.thumbnail_url,
        images_urls=project_data.images_urls,
        project_type=project_data.project_type,
        client_name=project_data.client_name,
        project_date=project_data.project_date,
        status=project_data.status,
        featured=project_data.featured,
        author_id=author_id,
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
):
    """更新项目（需要认证）"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # TODO: 添加权限检查

    # 更新字段
    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    """删除项目（需要认证）"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")

    # TODO: 添加权限检查

    db.delete(project)
    db.commit()

    return None
