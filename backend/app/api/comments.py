"""
Comments API Routes
提供评论相关的API端点
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.core.database import get_db
from backend.app.core.auth import get_current_user, get_current_active_user
from backend.app.schemas.comment import (
    CommentCreate,
    CommentUpdate,
    CommentResponse,
    CommentListResponse,
    CommentDetailResponse,
)
from backend.app.services.comment_service import CommentService
from backend.app.models.user import User

router = APIRouter(prefix="/comments", tags=["comments"])


@router.get("/post/{post_id}", response_model=CommentListResponse)
async def get_post_comments(
    post_id: int,
    page: int = Query(1, ge=1, description="页码"),
    per_page: int = Query(20, ge=1, le=100, description="每页数量"),
    sort: Optional[str] = Query("latest", description="排序方式: latest/popular"),
    db: Session = Depends(get_db),
):
    """
    获取文章评论列表

    支持分页和排序
    """
    comment_service = CommentService(db)

    # 排序方式
    order_by = "created_at" if sort == "latest" else "like_count"

    # 获取评论列表
    comments, total = comment_service.get_post_comments(
        post_id=post_id,
        page=page,
        per_page=per_page,
        order_by=order_by,
    )

    return CommentListResponse(
        data=comments,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{comment_id}", response_model=CommentDetailResponse)
async def get_comment(
    comment_id: int,
    db: Session = Depends(get_db),
):
    """
    获取单条评论详情
    """
    comment_service = CommentService(db)
    comment = comment_service.get_comment(comment_id)

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="评论不存在"
        )

    return comment


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    创建新评论

    需要认证
    """
    comment_service = CommentService(db)

    # 创建评论
    comment = comment_service.create_comment(
        post_id=comment_data.post_id,
        author_id=current_user.id,
        content=comment_data.content,
        parent_id=comment_data.parent_id,
    )

    return comment


@router.patch("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    更新评论

    需要认证，且只有评论作者可以更新
    """
    comment_service = CommentService(db)
    comment = comment_service.get_comment(comment_id)

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="评论不存在"
        )

    # 检查权限
    if comment.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权修改此评论"
        )

    # 更新评论
    updated_comment = comment_service.update_comment(
        comment_id, comment_data.dict(exclude_unset=True)
    )

    return updated_comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    删除评论

    需要认证，且只有评论作者或管理员可以删除
    """
    comment_service = CommentService(db)
    comment = comment_service.get_comment(comment_id)

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="评论不存在"
        )

    # 检查权限
    if comment.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权删除此评论"
        )

    # 删除评论
    comment_service.delete_comment(comment_id)

    return None


@router.post("/{comment_id}/like", status_code=status.HTTP_200_OK)
async def like_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    点赞评论

    需要认证
    """
    comment_service = CommentService(db)
    comment = comment_service.get_comment(comment_id)

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="评论不存在"
        )

    # 点赞
    comment_service.toggle_like(comment_id, current_user.id)

    return {"message": "操作成功"}


@router.delete("/{comment_id}/like", status_code=status.HTTP_200_OK)
async def unlike_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    取消点赞评论

    需要认证
    """
    comment_service = CommentService(db)
    comment_service.toggle_like(comment_id, current_user.id, unlike=True)

    return {"message": "操作成功"}


@router.get("/{comment_id}/replies", response_model=List[CommentResponse])
async def get_comment_replies(
    comment_id: int,
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db),
):
    """
    获取评论的回复列表
    """
    comment_service = CommentService(db)
    replies = comment_service.get_comment_replies(comment_id, limit)

    return replies


@router.post("/{comment_id}/report", status_code=status.HTTP_200_OK)
async def report_comment(
    comment_id: int,
    reason: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    举报评论

    需要认证
    """
    comment_service = CommentService(db)
    comment = comment_service.get_comment(comment_id)

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="评论不存在"
        )

    # 创建举报记录
    comment_service.report_comment(comment_id, current_user.id, reason)

    return {"message": "举报成功"}
