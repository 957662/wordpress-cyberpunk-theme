"""
Follow System Tests
关注系统测试
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.models.follow import Follow, FollowerStat


client = TestClient(app)


class TestFollowSystem:
    """关注系统测试"""

    def test_follow_user(self, db: Session):
        """测试关注用户"""
        # 创建测试用户
        follower = User(
            username="follower",
            email="follower@test.com",
            hashed_password="hash"
        )
        following = User(
            username="following",
            email="following@test.com",
            hashed_password="hash"
        )
        db.add(follower)
        db.add(following)
        db.commit()

        # 测试关注API
        response = client.post(
            f"/api/v1/follows/follow/{following.id}",
            headers={"Authorization": f"Bearer {follower.id}"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["follower_id"] == follower.id
        assert data["following_id"] == following.id

    def test_unfollow_user(self, db: Session):
        """测试取消关注"""
        # 创建测试用户和关注关系
        follower = User(
            username="follower2",
            email="follower2@test.com",
            hashed_password="hash"
        )
        following = User(
            username="following2",
            email="following2@test.com",
            hashed_password="hash"
        )
        db.add(follower)
        db.add(following)
        db.commit()

        # 先关注
        follow = Follow(
            follower_id=follower.id,
            following_id=following.id
        )
        db.add(follow)
        db.commit()

        # 测试取消关注API
        response = client.delete(
            f"/api/v1/follows/unfollow/{following.id}",
            headers={"Authorization": f"Bearer {follower.id}"}
        )

        assert response.status_code == 204

    def test_get_followers(self, db: Session):
        """测试获取粉丝列表"""
        # 创建测试用户
        user = User(
            username="testuser",
            email="testuser@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 测试获取粉丝列表API
        response = client.get(f"/api/v1/follows/followers/{user.id}")

        assert response.status_code == 200
        data = response.json()
        assert "followers" in data
        assert "total" in data

    def test_get_following(self, db: Session):
        """测试获取关注列表"""
        # 创建测试用户
        user = User(
            username="testuser2",
            email="testuser2@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 测试获取关注列表API
        response = client.get(f"/api/v1/follows/following/{user.id}")

        assert response.status_code == 200
        data = response.json()
        assert "following" in data
        assert "total" in data

    def test_get_follow_stats(self, db: Session):
        """测试获取关注统计"""
        # 创建测试用户
        user = User(
            username="testuser3",
            email="testuser3@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 创建统计记录
        stat = FollowerStat(
            user_id=user.id,
            followers_count=100,
            following_count=50
        )
        db.add(stat)
        db.commit()

        # 测试获取统计API
        response = client.get(f"/api/v1/follows/stats/{user.id}")

        assert response.status_code == 200
        data = response.json()
        assert data["followers_count"] == 100
        assert data["following_count"] == 50

    def test_check_follow_status(self, db: Session):
        """测试检查关注状态"""
        # 创建测试用户
        follower = User(
            username="follower3",
            email="follower3@test.com",
            hashed_password="hash"
        )
        following = User(
            username="following3",
            email="following3@test.com",
            hashed_password="hash"
        )
        db.add(follower)
        db.add(following)
        db.commit()

        # 测试检查关注状态API
        response = client.get(
            f"/api/v1/follows/check/{following.id}",
            headers={"Authorization": f"Bearer {follower.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "is_following" in data
        assert "is_followed_by" in data


class TestNotificationSystem:
    """通知系统测试"""

    def test_create_notification(self, db: Session):
        """测试创建通知"""
        # 创建测试用户
        user = User(
            username="testuser4",
            email="testuser4@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 测试创建通知API
        response = client.post(
            "/api/v1/notifications/",
            json={
                "recipient_id": user.id,
                "type": "test",
                "title": "测试通知",
                "content": "这是一条测试通知"
            },
            headers={"Authorization": f"Bearer {user.id}"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "测试通知"
        assert data["type"] == "test"

    def test_get_notifications(self, db: Session):
        """测试获取通知列表"""
        # 创建测试用户
        user = User(
            username="testuser5",
            email="testuser5@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 测试获取通知列表API
        response = client.get(
            "/api/v1/notifications/",
            headers={"Authorization": f"Bearer {user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data

    def test_mark_as_read(self, db: Session):
        """测试标记已读"""
        # 创建测试用户
        user = User(
            username="testuser6",
            email="testuser6@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 创建通知
        notification = client.post(
            "/api/v1/notifications/",
            json={
                "recipient_id": user.id,
                "type": "test",
                "title": "测试通知",
                "content": "这是一条测试通知"
            },
            headers={"Authorization": f"Bearer {user.id}"}
        ).json()

        # 测试标记已读API
        response = client.put(
            f"/api/v1/notifications/{notification['id']}/read",
            headers={"Authorization": f"Bearer {user.id}"}
        )

        assert response.status_code == 204

    def test_get_notification_stats(self, db: Session):
        """测试获取通知统计"""
        # 创建测试用户
        user = User(
            username="testuser7",
            email="testuser7@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 测试获取统计API
        response = client.get(
            "/api/v1/notifications/stats",
            headers={"Authorization": f"Bearer {user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "unread" in data
        assert "by_type" in data

    def test_notification_preferences(self, db: Session):
        """测试通知偏好设置"""
        # 创建测试用户
        user = User(
            username="testuser8",
            email="testuser8@test.com",
            hashed_password="hash"
        )
        db.add(user)
        db.commit()

        # 测试获取偏好设置API
        response = client.get(
            "/api/v1/notifications/preferences",
            headers={"Authorization": f"Bearer {user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "email_follow" in data
        assert "site_follow" in data
