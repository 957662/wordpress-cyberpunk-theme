"""
收藏服务
"""
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.bookmark import Bookmark
from app.schemas.bookmark import (
    BookmarkCreate,
    BookmarkUpdate,
    BookmarkResponse,
    BookmarkListResponse,
    BookmarkStatusResponse
)


class BookmarkService:
    """收藏业务逻辑"""

    @staticmethod
    def create_bookmark(db: Session, user_id: int, bookmark_data: BookmarkCreate) -> BookmarkResponse:
        """
        创建收藏

        Args:
            db: 数据库会话
            user_id: 用户ID
            bookmark_data: 收藏数据

        Returns:
            收藏响应对象

        Raises:
            ValueError: 如果已经收藏过
        """
        # 检查是否已经收藏过
        existing_bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.user_id == user_id,
                Bookmark.target_type == bookmark_data.target_type,
                Bookmark.target_id == bookmark_data.target_id
            )
        ).first()

        if existing_bookmark:
            raise ValueError("Already bookmarked")

        # 创建收藏
        db_bookmark = Bookmark(
            user_id=user_id,
            target_type=bookmark_data.target_type,
            target_id=bookmark_data.target_id,
            notes=bookmark_data.notes
        )
        db.add(db_bookmark)
        db.commit()
        db.refresh(db_bookmark)

        return BookmarkResponse.model_validate(db_bookmark)

    @staticmethod
    def update_bookmark(
        db: Session,
        user_id: int,
        bookmark_id: int,
        bookmark_data: BookmarkUpdate
    ) -> Optional[BookmarkResponse]:
        """
        更新收藏

        Args:
            db: 数据库会话
            user_id: 用户ID
            bookmark_id: 收藏ID
            bookmark_data: 更新数据

        Returns:
            更新后的收藏响应对象，如果不存在则返回None
        """
        bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.id == bookmark_id,
                Bookmark.user_id == user_id
            )
        ).first()

        if not bookmark:
            return None

        # 更新字段
        if bookmark_data.notes is not None:
            bookmark.notes = bookmark_data.notes

        db.commit()
        db.refresh(bookmark)

        return BookmarkResponse.model_validate(bookmark)

    @staticmethod
    def delete_bookmark(db: Session, user_id: int, bookmark_id: int) -> bool:
        """
        删除收藏

        Args:
            db: 数据库会话
            user_id: 用户ID
            bookmark_id: 收藏ID

        Returns:
            是否删除成功
        """
        bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.id == bookmark_id,
                Bookmark.user_id == user_id
            )
        ).first()

        if not bookmark:
            return False

        db.delete(bookmark)
        db.commit()
        return True

    @staticmethod
    def delete_bookmark_by_target(
        db: Session,
        user_id: int,
        target_type: str,
        target_id: int
    ) -> bool:
        """
        根据目标删除收藏

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型
            target_id: 目标ID

        Returns:
            是否删除成功
        """
        bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.user_id == user_id,
                Bookmark.target_type == target_type,
                Bookmark.target_id == target_id
            )
        ).first()

        if not bookmark:
            return False

        db.delete(bookmark)
        db.commit()
        return True

    @staticmethod
    def get_bookmark_status(
        db: Session,
        user_id: int,
        target_type: str,
        target_id: int
    ) -> BookmarkStatusResponse:
        """
        获取收藏状态

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型
            target_id: 目标ID

        Returns:
            收藏状态响应
        """
        bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.user_id == user_id,
                Bookmark.target_type == target_type,
                Bookmark.target_id == target_id
            )
        ).first()

        if bookmark:
            return BookmarkStatusResponse(
                is_bookmarked=True,
                bookmark_id=bookmark.id
            )
        else:
            return BookmarkStatusResponse(
                is_bookmarked=False,
                bookmark_id=None
            )

    @staticmethod
    def get_user_bookmarks(
        db: Session,
        user_id: int,
        target_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> BookmarkListResponse:
        """
        获取用户的收藏列表

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型（可选，用于过滤）
            skip: 跳过数量
            limit: 限制数量

        Returns:
            收藏列表响应
        """
        query = db.query(Bookmark).filter(Bookmark.user_id == user_id)

        # 如果指定了目标类型，添加过滤条件
        if target_type:
            query = query.filter(Bookmark.target_type == target_type)

        total = query.count()
        bookmarks = query.order_by(Bookmark.created_at.desc()).offset(skip).limit(limit).all()

        return BookmarkListResponse(
            items=[BookmarkResponse.model_validate(bookmark) for bookmark in bookmarks],
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )

    @staticmethod
    def get_bookmark_by_id(db: Session, user_id: int, bookmark_id: int) -> Optional[BookmarkResponse]:
        """
        根据ID获取收藏

        Args:
            db: 数据库会话
            user_id: 用户ID
            bookmark_id: 收藏ID

        Returns:
            收藏响应对象，如果不存在则返回None
        """
        bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.id == bookmark_id,
                Bookmark.user_id == user_id
            )
        ).first()

        if not bookmark:
            return None

        return BookmarkResponse.model_validate(bookmark)

    @staticmethod
    def toggle_bookmark(
        db: Session,
        user_id: int,
        target_type: str,
        target_id: int,
        notes: Optional[str] = None
    ) -> BookmarkStatusResponse:
        """
        切换收藏状态（收藏/取消收藏）

        Args:
            db: 数据库会话
            user_id: 用户ID
            target_type: 目标类型
            target_id: 目标ID
            notes: 备注信息（新建时使用）

        Returns:
            收藏状态响应
        """
        existing_bookmark = db.query(Bookmark).filter(
            and_(
                Bookmark.user_id == user_id,
                Bookmark.target_type == target_type,
                Bookmark.target_id == target_id
            )
        ).first()

        if existing_bookmark:
            # 取消收藏
            db.delete(existing_bookmark)
            db.commit()
            return BookmarkStatusResponse(is_bookmarked=False, bookmark_id=None)
        else:
            # 添加收藏
            new_bookmark = Bookmark(
                user_id=user_id,
                target_type=target_type,
                target_id=target_id,
                notes=notes
            )
            db.add(new_bookmark)
            db.commit()
            db.refresh(new_bookmark)
            return BookmarkStatusResponse(
                is_bookmarked=True,
                bookmark_id=new_bookmark.id
            )

    @staticmethod
    def search_bookmarks(
        db: Session,
        user_id: int,
        keyword: Optional[str] = None,
        target_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> BookmarkListResponse:
        """
        搜索用户的收藏

        Args:
            db: 数据库会话
            user_id: 用户ID
            keyword: 搜索关键词（搜索备注）
            target_type: 目标类型过滤
            skip: 跳过数量
            limit: 限制数量

        Returns:
            收藏列表响应
        """
        query = db.query(Bookmark).filter(Bookmark.user_id == user_id)

        # 添加过滤条件
        if target_type:
            query = query.filter(Bookmark.target_type == target_type)

        if keyword:
            query = query.filter(Bookmark.notes.ilike(f"%{keyword}%"))

        total = query.count()
        bookmarks = query.order_by(Bookmark.created_at.desc()).offset(skip).limit(limit).all()

        return BookmarkListResponse(
            items=[BookmarkResponse.model_validate(bookmark) for bookmark in bookmarks],
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )
