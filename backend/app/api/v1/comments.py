"""
Comments API Routes
评论相关API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse, CommentList
from app.schemas.common import PaginatedResponse
from app.services.comment_service import CommentService
from app.services.auth_service import AuthService
from app.api.v1.auth import get_current_active_user, oauth2_scheme
from app.models.user import User

router = APIRouter()


@router.get("", response_model=PaginatedResponse[CommentList])
async def get_comments(
    post_id: Optional[int] = Query(None, description="文章ID"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    status: str = Query("approved", description="评论状态"),
    db: Session = Depends(get_db),
):
    """获取评论列表"""
    skip = (page - 1) * page_size

    comments, total = CommentService.get_comments(
        db=db,
        skip=skip,
        limit=page_size,
        post_id=post_id,
        status=status,
    )

    total_pages = (total + page_size - 1) // page_size

    return PaginatedResponse(
        data=comments,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{comment_id}", response_model=CommentResponse)
async def get_comment(
    comment_id: int,
    db: Session = Depends(get_db),
):
    """获取评论详情"""
    comment = CommentService.get_comment_by_id(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    return comment


@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
):
    """创建评论（游客或登录用户）"""
    try:
        comment = CommentService.create_comment(db=db, comment_data=comment_data)
        return comment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """更新评论（需要认证）"""
    comment = CommentService.get_comment_by_id(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")

    # 检查权限：只有评论作者或管理员可以更新
    if comment.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="没有权限修改此评论")

    try:
        updated_comment = CommentService.update_comment(
            db=db,
            comment=comment,
            comment_data=comment_data
        )
        return updated_comment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """删除评论（需要认证）"""
    comment = CommentService.get_comment_by_id(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")

    # 检查权限：只有评论作者或管理员可以删除
    if comment.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="没有权限删除此评论")

    CommentService.delete_comment(db=db, comment=comment)
    return None


@router.post("/{comment_id}/approve", response_model=CommentResponse)
async def approve_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """批准评论（需要管理员权限）"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    comment = CommentService.get_comment_by_id(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")

    approved_comment = CommentService.approve_comment(db=db, comment=comment)
    return approved_comment


@router.post("/{comment_id}/spam", response_model=CommentResponse)
async def mark_comment_as_spam(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """标记评论为垃圾（需要管理员权限）"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="需要管理员权限")

    comment = CommentService.get_comment_by_id(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")

    spam_comment = CommentService.mark_as_spam(db=db, comment=comment)
    return spam_comment


@router.post("/{comment_id}/reply", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def reply_to_comment(
    comment_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """回复评论（需要认证）"""
    parent_comment = CommentService.get_comment_by_id(db=db, comment_id=comment_id)
    if not parent_comment:
        raise HTTPException(status_code=404, detail="父评论不存在")

    # 设置parent_id
    comment_data.parent_id = comment_id

    try:
        reply = CommentService.create_comment(
            db=db,
            comment_data=comment_data,
            author_id=current_user.id
        )
        return reply
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/post/{post_id}", response_model=List[CommentList])
async def get_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(50, ge=1, le=100, description="数量限制"),
    db: Session = Depends(get_db),
):
    """获取文章的所有评论"""
    comments = CommentService.get_comments_by_post(
        db=db,
        post_id=post_id,
        skip=skip,
        limit=limit,
        status="approved"
    )
    return comments
