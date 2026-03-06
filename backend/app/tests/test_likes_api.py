"""
点赞 API 集成测试
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.models.user import User
from app.core.auth import create_access_token


client = TestClient(app)


class TestLikesAPI:
    """点赞API测试类"""

    def test_create_like_success(self, db: Session, test_user: User, auth_headers: dict):
        """测试成功创建点赞"""
        response = client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == test_user.id
        assert data["target_type"] == "post"
        assert data["target_id"] == 1

    def test_create_like_duplicate(self, db: Session, test_user: User, auth_headers: dict):
        """测试重复点赞"""
        # 第一次点赞
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 第二次点赞应该失败
        response = client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        assert response.status_code == 400
        assert "Already liked" in response.json()["detail"]

    def test_delete_like_success(self, db: Session, test_user: User, auth_headers: dict):
        """测试成功删除点赞"""
        # 先创建点赞
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 删除点赞
        response = client.delete(
            "/api/v1/likes/post/1",
            headers=auth_headers
        )

        assert response.status_code == 204

    def test_get_like_status(self, db: Session, test_user: User, auth_headers: dict):
        """测试获取点赞状态"""
        # 创建点赞
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 获取点赞状态
        response = client.get(
            "/api/v1/likes/status/post/1",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_liked"] is True
        assert data["like_count"] == 1

    def test_get_like_count(self, db: Session):
        """测试获取点赞数量（公开接口）"""
        response = client.get("/api/v1/likes/count/post/1")

        assert response.status_code == 200
        data = response.json()
        assert "count" in data

    def test_get_my_likes(self, db: Session, test_user: User, auth_headers: dict):
        """测试获取我的点赞列表"""
        # 创建多个点赞
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 2},
            headers=auth_headers
        )

        # 获取我的点赞列表
        response = client.get(
            "/api/v1/likes/my",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    def test_get_target_likes(self, db: Session, test_user: User, auth_headers: dict):
        """测试获取目标的点赞列表"""
        # 创建点赞
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 获取目标的点赞列表
        response = client.get("/api/v1/likes/target/post/1")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1

    def test_get_like_stats(self, db: Session):
        """测试获取点赞统计（公开接口）"""
        response = client.get("/api/v1/likes/stats")

        assert response.status_code == 200
        data = response.json()
        assert "total_likes" in data
        assert "recent_likes" in data

    def test_toggle_like_add(self, db: Session, test_user: User, auth_headers: dict):
        """测试切换点赞状态 - 添加"""
        response = client.post(
            "/api/v1/likes/toggle/post/1",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_liked"] is True
        assert data["like_count"] == 1

    def test_toggle_like_remove(self, db: Session, test_user: User, auth_headers: dict):
        """测试切换点赞状态 - 移除"""
        # 先点赞
        client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 切换点赞
        response = client.post(
            "/api/v1/likes/toggle/post/1",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_liked"] is False
        assert data["like_count"] == 0

    def test_unauthorized_access(self, db: Session):
        """测试未授权访问"""
        response = client.post(
            "/api/v1/likes",
            json={"target_type": "post", "target_id": 1}
        )

        assert response.status_code == 401


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


@pytest.fixture
def auth_headers(test_user: User) -> dict:
    """创建认证头"""
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}
