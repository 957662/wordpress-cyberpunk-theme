"""
收藏 API 集成测试
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.models.user import User
from app.core.auth import create_access_token


client = TestClient(app)


class TestBookmarksAPI:
    """收藏API测试类"""

    def test_create_bookmark_success(self, db: Session, test_user: User, auth_headers: dict):
        """测试成功创建收藏"""
        response = client.post(
            "/api/v1/bookmarks",
            json={
                "target_type": "post",
                "target_id": 1,
                "notes": "Test note"
            },
            headers=auth_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == test_user.id
        assert data["target_type"] == "post"
        assert data["target_id"] == 1
        assert data["notes"] == "Test note"

    def test_create_bookmark_duplicate(self, db: Session, test_user: User, auth_headers: dict):
        """测试重复收藏"""
        # 第一次收藏
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 第二次收藏应该失败
        response = client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        assert response.status_code == 400
        assert "Already bookmarked" in response.json()["detail"]

    def test_update_bookmark_success(self, db: Session, test_user: User, auth_headers: dict):
        """测试成功更新收藏"""
        # 先创建收藏
        create_response = client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )
        bookmark_id = create_response.json()["id"]

        # 更新收藏
        response = client.put(
            f"/api/v1/bookmarks/{bookmark_id}",
            json={"notes": "Updated note"},
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["notes"] == "Updated note"

    def test_delete_bookmark_success(self, db: Session, test_user: User, auth_headers: dict):
        """测试成功删除收藏"""
        # 先创建收藏
        create_response = client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )
        bookmark_id = create_response.json()["id"]

        # 删除收藏
        response = client.delete(
            f"/api/v1/bookmarks/{bookmark_id}",
            headers=auth_headers
        )

        assert response.status_code == 204

    def test_delete_bookmark_by_target(self, db: Session, test_user: User, auth_headers: dict):
        """测试根据目标删除收藏"""
        # 先创建收藏
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 根据目标删除收藏
        response = client.delete(
            "/api/v1/bookmarks/target/post/1",
            headers=auth_headers
        )

        assert response.status_code == 204

    def test_get_bookmark_status(self, db: Session, test_user: User, auth_headers: dict):
        """测试获取收藏状态"""
        # 创建收藏
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 获取收藏状态
        response = client.get(
            "/api/v1/bookmarks/status/post/1",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_bookmarked"] is True
        assert data["bookmark_id"] is not None

    def test_get_my_bookmarks(self, db: Session, test_user: User, auth_headers: dict):
        """测试获取我的收藏列表"""
        # 创建多个收藏
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 2},
            headers=auth_headers
        )

        # 获取我的收藏列表
        response = client.get(
            "/api/v1/bookmarks/my",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    def test_get_my_bookmarks_with_filter(self, db: Session, test_user: User, auth_headers: dict):
        """测试获取我的收藏列表（带过滤）"""
        # 创建多个收藏
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "project", "target_id": 1},
            headers=auth_headers
        )

        # 只获取post类型的收藏
        response = client.get(
            "/api/v1/bookmarks/my?target_type=post",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["target_type"] == "post"

    def test_get_bookmark_by_id(self, db: Session, test_user: User, auth_headers: dict):
        """测试根据ID获取收藏"""
        # 先创建收藏
        create_response = client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )
        bookmark_id = create_response.json()["id"]

        # 获取收藏详情
        response = client.get(
            f"/api/v1/bookmarks/{bookmark_id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == bookmark_id

    def test_toggle_bookmark_add(self, db: Session, test_user: User, auth_headers: dict):
        """测试切换收藏状态 - 添加"""
        response = client.post(
            "/api/v1/bookmarks/toggle/post/1",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_bookmarked"] is True
        assert data["bookmark_id"] is not None

    def test_toggle_bookmark_remove(self, db: Session, test_user: User, auth_headers: dict):
        """测试切换收藏状态 - 移除"""
        # 先收藏
        client.post(
            "/api/v1/bookmarks",
            json={"target_type": "post", "target_id": 1},
            headers=auth_headers
        )

        # 切换收藏
        response = client.post(
            "/api/v1/bookmarks/toggle/post/1",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_bookmarked"] is False
        assert data["bookmark_id"] is None

    def test_search_bookmarks(self, db: Session, test_user: User, auth_headers: dict):
        """测试搜索收藏"""
        # 创建多个收藏
        client.post(
            "/api/v1/bookmarks",
            json={
                "target_type": "post",
                "target_id": 1,
                "notes": "Python tutorial"
            },
            headers=auth_headers
        )
        client.post(
            "/api/v1/bookmarks",
            json={
                "target_type": "post",
                "target_id": 2,
                "notes": "JavaScript guide"
            },
            headers=auth_headers
        )

        # 搜索包含"Python"的收藏
        response = client.get(
            "/api/v1/bookmarks/search?keyword=Python",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1

    def test_unauthorized_access(self, db: Session):
        """测试未授权访问"""
        response = client.post(
            "/api/v1/bookmarks",
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
