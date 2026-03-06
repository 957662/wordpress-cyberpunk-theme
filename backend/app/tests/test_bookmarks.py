"""
收藏服务单元测试
"""
import pytest
from sqlalchemy.orm import Session
from app.services.bookmark_service import BookmarkService
from app.schemas.bookmark import BookmarkCreate, BookmarkUpdate
from app.models.bookmark import Bookmark
from app.models.user import User


class TestBookmarkService:
    """收藏服务测试类"""

    def test_create_bookmark_success(self, db: Session, test_user: User):
        """测试成功创建收藏"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1, notes="Test note")

        bookmark = BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        assert bookmark.user_id == test_user.id
        assert bookmark.target_type == "post"
        assert bookmark.target_id == 1
        assert bookmark.notes == "Test note"
        assert bookmark.id is not None

    def test_create_bookmark_duplicate(self, db: Session, test_user: User):
        """测试重复收藏"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1)

        # 第一次收藏
        BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        # 第二次收藏应该抛出异常
        with pytest.raises(ValueError, match="Already bookmarked"):
            BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

    def test_update_bookmark_success(self, db: Session, test_user: User):
        """测试成功更新收藏"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1)
        bookmark = BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        # 更新收藏
        update_data = BookmarkUpdate(notes="Updated note")
        updated_bookmark = BookmarkService.update_bookmark(
            db, test_user.id, bookmark.id, update_data
        )

        assert updated_bookmark.notes == "Updated note"

    def test_update_bookmark_not_found(self, db: Session, test_user: User):
        """测试更新不存在的收藏"""
        update_data = BookmarkUpdate(notes="Updated note")

        result = BookmarkService.update_bookmark(db, test_user.id, 999, update_data)

        assert result is None

    def test_delete_bookmark_success(self, db: Session, test_user: User):
        """测试成功删除收藏"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1)
        bookmark = BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        # 删除收藏
        result = BookmarkService.delete_bookmark(db, test_user.id, bookmark.id)

        assert result is True

    def test_delete_bookmark_by_target_success(self, db: Session, test_user: User):
        """测试根据目标删除收藏"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1)
        BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        # 根据目标删除收藏
        result = BookmarkService.delete_bookmark_by_target(db, test_user.id, "post", 1)

        assert result is True

    def test_get_bookmark_status(self, db: Session, test_user: User):
        """测试获取收藏状态"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1)
        BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        status = BookmarkService.get_bookmark_status(db, test_user.id, "post", 1)

        assert status.is_bookmarked is True
        assert status.bookmark_id is not None

    def test_get_bookmark_status_not_found(self, db: Session, test_user: User):
        """测试获取不存在收藏的状态"""
        status = BookmarkService.get_bookmark_status(db, test_user.id, "post", 999)

        assert status.is_bookmarked is False
        assert status.bookmark_id is None

    def test_get_user_bookmarks(self, db: Session, test_user: User):
        """测试获取用户收藏列表"""
        # 创建多个收藏
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="post", target_id=1))
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="post", target_id=2))
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="project", target_id=1))

        bookmarks = BookmarkService.get_user_bookmarks(db, test_user.id)

        assert bookmarks.total == 3
        assert len(bookmarks.items) == 3

    def test_get_user_bookmarks_with_filter(self, db: Session, test_user: User):
        """测试获取用户收藏列表（带过滤）"""
        # 创建多个收藏
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="post", target_id=1))
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="post", target_id=2))
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="project", target_id=1))

        # 只获取post类型的收藏
        bookmarks = BookmarkService.get_user_bookmarks(db, test_user.id, target_type="post")

        assert bookmarks.total == 2
        assert len(bookmarks.items) == 2
        assert all(b.target_type == "post" for b in bookmarks.items)

    def test_toggle_bookmark_add(self, db: Session, test_user: User):
        """测试切换收藏状态 - 添加收藏"""
        status = BookmarkService.toggle_bookmark(db, test_user.id, "post", 1)

        assert status.is_bookmarked is True
        assert status.bookmark_id is not None

    def test_toggle_bookmark_remove(self, db: Session, test_user: User):
        """测试切换收藏状态 - 移除收藏"""
        # 先添加收藏
        BookmarkService.create_bookmark(db, test_user.id, BookmarkCreate(target_type="post", target_id=1))

        # 切换收藏
        status = BookmarkService.toggle_bookmark(db, test_user.id, "post", 1)

        assert status.is_bookmarked is False
        assert status.bookmark_id is None

    def test_search_bookmarks(self, db: Session, test_user: User):
        """测试搜索收藏"""
        # 创建多个收藏
        BookmarkService.create_bookmark(
            db, test_user.id,
            BookmarkCreate(target_type="post", target_id=1, notes="Python tutorial")
        )
        BookmarkService.create_bookmark(
            db, test_user.id,
            BookmarkCreate(target_type="post", target_id=2, notes="JavaScript guide")
        )
        BookmarkService.create_bookmark(
            db, test_user.id,
            BookmarkCreate(target_type="project", target_id=1, notes="Python project")
        )

        # 搜索包含"Python"的收藏
        bookmarks = BookmarkService.search_bookmarks(db, test_user.id, keyword="Python")

        assert bookmarks.total == 2
        assert len(bookmarks.items) == 2

    def test_get_bookmark_by_id(self, db: Session, test_user: User):
        """测试根据ID获取收藏"""
        bookmark_data = BookmarkCreate(target_type="post", target_id=1)
        bookmark = BookmarkService.create_bookmark(db, test_user.id, bookmark_data)

        # 获取收藏
        found_bookmark = BookmarkService.get_bookmark_by_id(db, test_user.id, bookmark.id)

        assert found_bookmark is not None
        assert found_bookmark.id == bookmark.id

    def test_get_bookmark_by_id_not_found(self, db: Session, test_user: User):
        """测试根据ID获取不存在的收藏"""
        found_bookmark = BookmarkService.get_bookmark_by_id(db, test_user.id, 999)

        assert found_bookmark is None


@pytest.fixture
def test_user(db: Session) -> User:
    """创建测试用户"""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
