"""
Comment Service (Enhanced)
评论服务层（增强版）
"""

from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func

from ..models.comment import Comment
from ..models.post import Post
from ..models.user import User
from ..schemas.comment import CommentCreate, CommentUpdate


class CommentService:
    """评论服务类"""

    def __init__(self, db: Session):
        self.db = db

    def get_comment_by_id(self, comment_id: int) -> Optional[Comment]:
        """通过ID获取评论"""
        return self.db.query(Comment).filter(Comment.id == comment_id).first()

    def get_comments(
        self,
        page: int = 1,
        limit: int = 20,
        filters: Optional[Dict[str, Any]] = None
    ) -> Tuple[List[Comment], int]:
        """
        获取评论列表

        支持按文章或父评论筛选，支持分页。
        """
        query = self.db.query(Comment)

        # 应用筛选条件
        if filters:
            if filters.get("post_id"):
                query = query.filter(Comment.post_id == filters["post_id"])

            if filters.get("parent_id") is not None:
                if filters["parent_id"] == 0:
                    # 获取顶级评论
                    query = query.filter(Comment.parent_id.is_(None))
                else:
                    query = query.filter(Comment.parent_id == filters["parent_id"])

        # 排序：最新评论在前
        query = query.order_by(desc(Comment.created_at))

        # 计算总数
        total = query.count()

        # 应用分页
        offset = (page - 1) * limit
        comments = query.offset(offset).limit(limit).all()

        return comments, total

    def get_comment_tree(self, post_id: int) -> List[Comment]:
        """
        获取文章的评论树

        返回嵌套的评论结构。
        """
        # 获取所有顶级评论
        top_level_comments = self.db.query(Comment).filter(
            and_(
                Comment.post_id == post_id,
                Comment.parent_id.is_(None)
            )
        ).order_by(desc(Comment.created_at)).all()

        # 为每个顶级评论加载回复
        for comment in top_level_comments:
            self._load_replies(comment)

        return top_level_comments

    def _load_replies(self, comment: Comment, depth: int = 0, max_depth: int = 5):
        """递归加载评论回复"""
        if depth >= max_depth:
            return

        comment.replies = self.db.query(Comment).filter(
            Comment.parent_id == comment.id
        ).order_by(desc(Comment.created_at)).all()

        for reply in comment.replies:
            self._load_replies(reply, depth + 1, max_depth)

    def create_comment(
        self,
        comment_data: CommentCreate,
        author_id: int
    ) -> Optional[Comment]:
        """
        创建评论

        创建新评论或回复。
        """
        # 验证文章是否存在
        post = self.db.query(Post).filter(Post.id == comment_data.post_id).first()
        if not post:
            return None

        # 如果是回复，验证父评论是否存在
        if comment_data.parent_id:
            parent_comment = self.get_comment_by_id(comment_data.parent_id)
            if not parent_comment or parent_comment.post_id != comment_data.post_id:
                return None

        # 创建评论对象
        db_comment = Comment(
            content=comment_data.content,
            post_id=comment_data.post_id,
            author_id=author_id,
            parent_id=comment_data.parent_id,
        )

        self.db.add(db_comment)
        self.db.commit()
        self.db.refresh(db_comment)

        # 更新文章的评论数
        post.comment_count = (post.comment_count or 0) + 1
        self.db.commit()

        return db_comment

    def update_comment(
        self,
        comment_id: int,
        comment_data: CommentUpdate
    ) -> Optional[Comment]:
        """
        更新评论

        更新评论内容。
        """
        comment = self.get_comment_by_id(comment_id)

        if not comment:
            return None

        if comment_data.content is not None:
            comment.content = comment_data.content

        comment.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(comment)

        return comment

    def delete_comment(self, comment_id: int) -> bool:
        """删除评论"""
        comment = self.get_comment_by_id(comment_id)

        if not comment:
            return False

        post = self.db.query(Post).filter(Post.id == comment.post_id).first()

        # 删除评论及其所有回复
        self._delete_comment_recursive(comment)

        # 更新文章的评论数
        if post:
            post.comment_count = max(0, (post.comment_count or 0) - 1)
            self.db.commit()

        return True

    def _delete_comment_recursive(self, comment: Comment):
        """递归删除评论及其回复"""
        # 删除所有回复
        replies = self.db.query(Comment).filter(Comment.parent_id == comment.id).all()
        for reply in replies:
            self._delete_comment_recursive(reply)

        # 删除评论
        self.db.delete(comment)
        self.db.commit()

    def like_comment(self, comment_id: int, user_id: int) -> Optional[Comment]:
        """点赞评论"""
        comment = self.get_comment_by_id(comment_id)

        if not comment:
            return None

        # 初始化 likes 数组
        if comment.likes is None:
            comment.likes = []

        # 检查是否已点赞
        if user_id not in comment.likes:
            comment.likes.append(user_id)
            comment.like_count = len(comment.likes)
            self.db.commit()
            self.db.refresh(comment)

        return comment

    def unlike_comment(self, comment_id: int, user_id: int) -> Optional[Comment]:
        """取消点赞评论"""
        comment = self.get_comment_by_id(comment_id)

        if not comment:
            return None

        # 初始化 likes 数组
        if comment.likes is None:
            comment.likes = []

        # 移除点赞
        if user_id in comment.likes:
            comment.likes.remove(user_id)
            comment.like_count = len(comment.likes)
            self.db.commit()
            self.db.refresh(comment)

        return comment

    def get_recent_comments(self, limit: int = 10) -> List[Comment]:
        """获取最新的评论"""
        return self.db.query(Comment).order_by(
            desc(Comment.created_at)
        ).limit(limit).all()

    def get_user_comments(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Comment], int]:
        """获取用户的评论"""
        query = self.db.query(Comment).filter(Comment.author_id == user_id)

        total = query.count()
        offset = (page - 1) * limit
        comments = query.order_by(desc(Comment.created_at)).offset(offset).limit(limit).all()

        return comments, total

    def approve_comment(self, comment_id: int) -> Optional[Comment]:
        """审核通过评论"""
        comment = self.get_comment_by_id(comment_id)

        if not comment:
            return None

        comment.status = "approved"
        comment.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(comment)

        return comment

    def reject_comment(self, comment_id: int) -> Optional[Comment]:
        """拒绝评论"""
        comment = self.get_comment_by_id(comment_id)

        if not comment:
            return None

        comment.status = "rejected"
        comment.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(comment)

        return comment

    def get_pending_comments(
        self,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Comment], int]:
        """获取待审核的评论"""
        query = self.db.query(Comment).filter(Comment.status == "pending")

        total = query.count()
        offset = (page - 1) * limit
        comments = query.order_by(desc(Comment.created_at)).offset(offset).limit(limit).all()

        return comments, total
