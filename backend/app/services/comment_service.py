"""
Comment Service
评论服务
"""

from sqlalchemy.orm import Session
from typing import List, Tuple, Optional
from datetime import datetime

from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate


class CommentService:
    """评论服务类"""

    @staticmethod
    def get_comments(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        post_id: Optional[int] = None,
        status: str = "approved"
    ) -> Tuple[List[Comment], int]:
        """获取评论列表"""
        query = db.query(Comment)

        # 过滤条件
        if post_id:
            query = query.filter(Comment.post_id == post_id)
        if status:
            query = query.filter(Comment.status == status)

        # 只获取顶级评论（没有父评论的）
        query = query.filter(Comment.parent_id.is_(None))

        # 总数
        total = query.count()

        # 分页和排序
        comments = query.order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()

        return comments, total

    @staticmethod
    def get_comment_by_id(db: Session, comment_id: int) -> Optional[Comment]:
        """通过ID获取评论"""
        return db.query(Comment).filter(Comment.id == comment_id).first()

    @staticmethod
    def get_comments_by_post(
        db: Session,
        post_id: int,
        skip: int = 0,
        limit: int = 50,
        status: str = "approved"
    ) -> List[Comment]:
        """获取文章的所有评论"""
        query = db.query(Comment).filter(
            Comment.post_id == post_id,
            Comment.status == status
        )
        return query.order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create_comment(
        db: Session,
        comment_data: CommentCreate,
        author_id: Optional[int] = None
    ) -> Comment:
        """创建评论"""
        # 验证文章是否存在（这里应该检查，但为了简化暂时跳过）

        # 如果有parent_id，验证父评论是否存在
        if comment_data.parent_id:
            parent = db.query(Comment).filter(
                Comment.id == comment_data.parent_id
            ).first()
            if not parent:
                raise ValueError("父评论不存在")

        # 创建评论
        db_comment = Comment(
            post_id=comment_data.post_id,
            content=comment_data.content,
            author_name=comment_data.author_name,
            author_email=comment_data.author_email,
            author_id=author_id,
            parent_id=comment_data.parent_id,
            status="pending",  # 默认待审核
            created_at=datetime.utcnow(),
        )

        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)

        return db_comment

    @staticmethod
    def update_comment(
        db: Session,
        comment: Comment,
        comment_data: CommentUpdate
    ) -> Comment:
        """更新评论"""
        comment.content = comment_data.content
        comment.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(comment)

        return comment

    @staticmethod
    def delete_comment(db: Session, comment: Comment) -> None:
        """删除评论"""
        db.delete(comment)
        db.commit()

    @staticmethod
    def approve_comment(db: Session, comment: Comment) -> Comment:
        """批准评论"""
        comment.status = "approved"
        db.commit()
        db.refresh(comment)
        return comment

    @staticmethod
    def mark_as_spam(db: Session, comment: Comment) -> Comment:
        """标记为垃圾评论"""
        comment.status = "spam"
        db.commit()
        db.refresh(comment)
        return comment

    @staticmethod
    def get_replies(db: Session, comment_id: int) -> List[Comment]:
        """获取评论的回复"""
        return db.query(Comment).filter(
            Comment.parent_id == comment_id,
            Comment.status == "approved"
        ).order_by(Comment.created_at.asc()).all()

    @staticmethod
    def count_comments_by_post(db: Session, post_id: int, status: str = "approved") -> int:
        """统计文章的评论数"""
        return db.query(Comment).filter(
            Comment.post_id == post_id,
            Comment.status == status,
            Comment.parent_id.is_(None)  # 只统计顶级评论
        ).count()

    @staticmethod
    def get_recent_comments(
        db: Session,
        limit: int = 10,
        status: str = "approved"
    ) -> List[Comment]:
        """获取最新的评论"""
        return db.query(Comment).filter(
            Comment.status == status,
            Comment.parent_id.is_(None)
        ).order_by(Comment.created_at.desc()).limit(limit).all()
