"""
点赞服务单元测试
"""
import pytest
from sqlalchemy.orm import Session
from app.services.like_service import LikeService
from app.schemas.like import LikeCreate
from app.models.like import Like
from app.models.user import User


class TestLikeService:
    """点赞服务测试类"""

    def test_create_like_success(self, db: Session, test_user: User):
        """测试成功创建点赞"""
        like_data = LikeCreate(target_type="post", target_id=1)

        like = LikeService.create_like(db, test_user.id, like_data)

        assert like.user_id == test_user.id
        assert like.target_type == "post"
        assert like.target_id == 1
        assert like.id is not None

    def test_create_like_duplicate(self, db: Session, test_user: User):
        """测试重复点赞"""
        like_data = LikeCreate(target_type="post", target_id=1)

        # 第一次点赞
        LikeService.create_like(db, test_user.id, like_data)

        # 第二次点赞应该抛出异常
        with pytest.raises(ValueError, match="Already liked"):
            LikeService.create_like(db, test_user.id, like_data)

    def test_delete_like_success(self, db: Session, test_user: User):
        """测试成功删除点赞"""
        like_data = LikeCreate(target_type="post", target_id=1)
        LikeService.create_like(db, test_user.id, like_data)

        # 删除点赞
        result = LikeService.delete_like(db, test_user.id, "post", 1)

        assert result is True

    def test_delete_like_not_found(self, db: Session, test_user: User):
        """测试删除不存在的点赞"""
        result = LikeService.delete_like(db, test_user.id, "post", 999)

        assert result is False

    def test_get_like_status(self, db: Session, test_user: User):
        """测试获取点赞状态"""
        like_data = LikeCreate(target_type="post", target_id=1)
        LikeService.create_like(db, test_user.id, like_data)

        status = LikeService.get_like_status(db, test_user.id, "post", 1)

        assert status.is_liked is True
        assert status.like_count == 1

    def test_get_like_count(self, db: Session, test_user: User):
        """测试获取点赞数量"""
        like_data = LikeCreate(target_type="post", target_id=1)
        LikeService.create_like(db, test_user.id, like_data)

        count = LikeService.get_like_count(db, "post", 1)

        assert count == 1

    def test_get_user_likes(self, db: Session, test_user: User):
        """测试获取用户点赞列表"""
        # 创建多个点赞
        LikeService.create_like(db, test_user.id, LikeCreate(target_type="post", target_id=1))
        LikeService.create_like(db, test_user.id, LikeCreate(target_type="post", target_id=2))
        LikeService.create_like(db, test_user.id, LikeCreate(target_type="comment", target_id=1))

        likes, total = LikeService.get_user_likes(db, test_user.id)

        assert total == 3
        assert len(likes) == 3

    def test_toggle_like_add(self, db: Session, test_user: User):
        """测试切换点赞状态 - 添加点赞"""
        status = LikeService.toggle_like(db, test_user.id, "post", 1)

        assert status.is_liked is True
        assert status.like_count == 1

    def test_toggle_like_remove(self, db: Session, test_user: User):
        """测试切换点赞状态 - 移除点赞"""
        # 先添加点赞
        LikeService.create_like(db, test_user.id, LikeCreate(target_type="post", target_id=1))

        # 切换点赞
        status = LikeService.toggle_like(db, test_user.id, "post", 1)

        assert status.is_liked is False
        assert status.like_count == 0

    def test_get_like_stats(self, db: Session, test_user: User):
        """测试获取点赞统计"""
        LikeService.create_like(db, test_user.id, LikeCreate(target_type="post", target_id=1))
        LikeService.create_like(db, test_user.id, LikeCreate(target_type="post", target_id=2))

        stats = LikeService.get_like_stats(db)

        assert stats.total_likes == 2
        assert stats.recent_likes >= 0


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
