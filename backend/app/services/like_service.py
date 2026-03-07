"""
点赞服务
"""
from __future__ import annotations

from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from app.models.like import Like
from app.models.user import User
from app.schemas.like import LikeCreate, LikeResponse, LikeStatusResponse, LikeStatsResponse


class LikeService:
    """点赞业务逻辑"""

    @staticmethod
    def create_like(db: Session, user_id: int, like_data: LikeCreate) -> LikeResponse:
        """
        创建点赞

        Args:
            db: 数据库会话
            user_id: 用户ID
            like_data: 点赞数据

        Returns:
            点赞响应对象

        Raises:
            ValueError: 如果已经点赞过
        """
        # 检查是否已经点赞过
        existing_like = db.query(Like).filter(
            and_(
                Like.user_id == user_id,
                Like.target_type == like_data.target_type,
                Like.target_id == like_data.target_id
            )
        ).first()

        if existing_like:
            raise ValueError("Already liked")

        # 创建点赞
        db_like = Like(
            user_id=user_id,
            target_type=like_data.target_type,
            target_id=like_data.target_id
        )
        db.add(db_like)
        db.commit()
        db.refresh(db_like)

        return LikeResponse.model_validate(db_like)

    @staticmethod
    def delete_like(db: Session, user_id: int, target_type: str, target_id: int) -> bool:
        """
        取消点赞

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型
            target_id: 目标ID

        Returns:
            是否删除成功
        """
        like = db.query(Like).filter(
            and_(
                Like.user_id == user_id,
                Like.target_type == target_type,
                Like.target_id == target_id
            )
        ).first()

        if not like:
            return False

        db.delete(like)
        db.commit()
        return True

    @staticmethod
    def get_like_status(db: Session, user_id: int, target_type: str, target_id: int) -> LikeStatusResponse:
        """
        获取点赞状态

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型
            target_id: 目标ID

        Returns:
            点赞状态响应
        """
        # 检查是否已点赞
        is_liked = db.query(Like).filter(
            and_(
                Like.user_id == user_id,
                Like.target_type == target_type,
                Like.target_id == target_id
            )
        ).first() is not None

        # 获取点赞总数
        like_count = db.query(Like).filter(
            and_(
                Like.target_type == target_type,
                Like.target_id == target_id
            )
        ).count()

        return LikeStatusResponse(is_liked=is_liked, like_count=like_count)

    @staticmethod
    def get_like_count(db: Session, target_type: str, target_id: int) -> int:
        """
        获取点赞数量

        Args:
            db: 数据库会话
            target_type: 目标类型
            target_id: 目标ID

        Returns:
            点赞数量
        """
        return db.query(Like).filter(
            and_(
                Like.target_type == target_type,
                Like.target_id == target_id
            )
        ).count()

    @staticmethod
    def get_user_likes(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[LikeResponse], int]:
        """
        获取用户的点赞列表

        Args:
            db: 数据库会话
            user_id: 用户ID
            skip: 跳过数量
            limit: 限制数量

        Returns:
            点赞列表和总数
        """
        query = db.query(Like).filter(Like.user_id == user_id)
        total = query.count()
        likes = query.order_by(Like.created_at.desc()).offset(skip).limit(limit).all()

        return [LikeResponse.model_validate(like) for like in likes], total

    @staticmethod
    def get_target_likes(
        db: Session,
        target_type: str,
        target_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[LikeResponse], int]:
        """
        获取目标的点赞列表

        Args:
            db: 数据库会话
            target_type: 目标类型
            target_id: 目标ID
            skip: 跳过数量
            limit: 限制数量

        Returns:
            点赞列表和总数
        """
        query = db.query(Like).filter(
            and_(
                Like.target_type == target_type,
                Like.target_id == target_id
            )
        )
        total = query.count()
        likes = query.order_by(Like.created_at.desc()).offset(skip).limit(limit).all()

        return [LikeResponse.model_validate(like) for like in likes], total

    @staticmethod
    def get_like_stats(db: Session, target_type: Optional[str] = None, target_id: Optional[int] = None) -> LikeStatsResponse:
        """
        获取点赞统计

        Args:
            db: 数据库会话
            target_type: 目标类型（可选）
            target_id: 目标ID（可选）

        Returns:
            点赞统计响应
        """
        # 构建查询条件
        conditions = []
        if target_type:
            conditions.append(Like.target_type == target_type)
        if target_id:
            conditions.append(Like.target_id == target_id)

        # 总点赞数
        if conditions:
            total_likes = db.query(Like).filter(and_(*conditions)).count()
        else:
            total_likes = db.query(Like).count()

        # 最近7天的点赞数
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        if conditions:
            recent_likes = db.query(Like).filter(
                and_(*conditions, Like.created_at >= seven_days_ago)
            ).count()
        else:
            recent_likes = db.query(Like).filter(Like.created_at >= seven_days_ago).count()

        return LikeStatsResponse(total_likes=total_likes, recent_likes=recent_likes)

    @staticmethod
    def toggle_like(db: Session, user_id: int, target_type: str, target_id: int) -> LikeStatusResponse:
        """
        切换点赞状态（点赞/取消点赞）

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型
            target_id: 目标ID

        Returns:
            点赞状态响应
        """
        existing_like = db.query(Like).filter(
            and_(
                Like.user_id == user_id,
                Like.target_type == target_type,
                Like.target_id == target_id
            )
        ).first()

        if existing_like:
            # 取消点赞
            db.delete(existing_like)
        else:
            # 添加点赞
            new_like = Like(
                user_id=user_id,
                target_type=target_type,
                target_id=target_id
            )
            db.add(new_like)

        db.commit()

        # 返回最新状态
        return LikeService.get_like_status(db, user_id, target_type, target_id)
