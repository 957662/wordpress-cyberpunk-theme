"""
API 测试用例
"""

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from main import app


@pytest.fixture
def test_client():
    """创建测试客户端"""
    return TestClient(app)


@pytest.fixture
async def async_client():
    """创建异步测试客户端"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


class TestHealthEndpoint:
    """健康检查端点测试"""

    def test_health_check(self, test_client):
        """测试健康检查端点"""
        response = test_client.get("/api/v1/health")
        assert response.status_code == 200

        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data

    def test_health_check_with_db(self, test_client):
        """测试带数据库检查的健康检查"""
        response = test_client.get("/api/v1/health?check_db=true")
        assert response.status_code == 200

        data = response.json()
        assert "database" in data


class TestAuthentication:
    """认证测试"""

    def test_register_user(self, test_client):
        """测试用户注册"""
        response = test_client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "testpass123"
            }
        )

        # 可能返回 201（创建成功）或 400（用户已存在）
        assert response.status_code in [201, 400]

        if response.status_code == 201:
            data = response.json()
            assert "access_token" in data
            assert "refresh_token" in data
            assert data["user"]["username"] == "testuser"
            assert data["user"]["email"] == "test@example.com"

    def test_login_success(self, test_client):
        """测试成功登录"""
        response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "testpass123"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_failure(self, test_client):
        """测试登录失败"""
        response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "nonexistent",
                "password": "wrongpass"
            }
        )

        assert response.status_code == 401

    def test_protected_endpoint_without_token(self, test_client):
        """测试无token访问受保护端点"""
        response = test_client.get("/api/v1/users/me")
        assert response.status_code == 401

    def test_protected_endpoint_with_token(self, test_client):
        """测试有token访问受保护端点"""
        # 先登录获取token
        login_response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "testpass123"
            }
        )

        if login_response.status_code == 200:
            token = login_response.json()["access_token"]

            # 使用token访问受保护端点
            response = test_client.get(
                "/api/v1/users/me",
                headers={"Authorization": f"Bearer {token}"}
            )

            assert response.status_code == 200
            data = response.json()
            assert "username" in data


class TestPosts:
    """文章测试"""

    def test_get_posts_list(self, test_client):
        """测试获取文章列表"""
        response = test_client.get("/api/v1/posts")
        assert response.status_code == 200

        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        assert "total" in data
        assert "page" in data
        assert "size" in data

    def test_get_posts_with_pagination(self, test_client):
        """测试分页"""
        response = test_client.get("/api/v1/posts?page=1&size=10")
        assert response.status_code == 200

        data = response.json()
        assert data["page"] == 1
        assert data["size"] == 10
        assert len(data["items"]) <= 10

    def test_get_post_by_id(self, test_client):
        """测试获取单篇文章"""
        # 先获取文章列表
        list_response = test_client.get("/api/v1/posts?size=1")

        if list_response.status_code == 200:
            items = list_response.json()["items"]
            if items:
                post_id = items[0]["id"]

                # 获取文章详情
                response = test_client.get(f"/api/v1/posts/{post_id}")
                assert response.status_code == 200

                data = response.json()
                assert data["id"] == post_id

    def test_create_post_unauthorized(self, test_client):
        """测试未授权创建文章"""
        response = test_client.post(
            "/api/v1/posts",
            json={
                "title": "Test Post",
                "content": "Test content",
                "status": "draft"
            }
        )

        assert response.status_code == 401

    def test_create_post_authorized(self, test_client):
        """测试授权创建文章"""
        # 先登录
        login_response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "testpass123"
            }
        )

        if login_response.status_code == 200:
            token = login_response.json()["access_token"]

            # 创建文章
            response = test_client.post(
                "/api/v1/posts",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "title": "Test Post",
                    "content": "Test content",
                    "status": "draft"
                }
            )

            assert response.status_code in [201, 200]
            data = response.json()
            assert data["title"] == "Test Post"


class TestCategories:
    """分类测试"""

    def test_get_categories(self, test_client):
        """测试获取分类列表"""
        response = test_client.get("/api/v1/categories")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)


class TestTags:
    """标签测试"""

    def test_get_tags(self, test_client):
        """测试获取标签列表"""
        response = test_client.get("/api/v1/tags")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)


class TestSearch:
    """搜索测试"""

    def test_search_posts(self, test_client):
        """测试搜索文章"""
        response = test_client.get("/api/v1/search?q=test")
        assert response.status_code == 200

        data = response.json()
        assert "results" in data
        assert isinstance(data["results"], list)

    def test_search_with_filters(self, test_client):
        """测试带筛选的搜索"""
        response = test_client.get(
            "/api/v1/search?q=test&category=tech&status=published"
        )
        assert response.status_code == 200


class TestAnalytics:
    """分析测试"""

    def test_analytics_unauthorized(self, test_client):
        """测试未授权访问分析数据"""
        response = test_client.get("/api/v1/analytics/overview")
        assert response.status_code == 401

    def test_analytics_authorized(self, test_client):
        """测试授权访问分析数据"""
        # 先登录
        login_response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "testpass123"
            }
        )

        if login_response.status_code == 200:
            token = login_response.json()["access_token"]

            # 访问分析数据
            response = test_client.get(
                "/api/v1/analytics/overview",
                headers={"Authorization": f"Bearer {token}"}
            )

            assert response.status_code == 200
            data = response.json()
            assert "views" in data or "visits" in data


class TestValidation:
    """验证测试"""

    def test_register_with_invalid_email(self, test_client):
        """测试使用无效邮箱注册"""
        response = test_client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "invalid-email",
                "password": "testpass123"
            }
        )

        assert response.status_code == 422

    def test_register_with_short_password(self, test_client):
        """测试使用短密码注册"""
        response = test_client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "123"
            }
        )

        assert response.status_code == 422

    def test_create_post_without_title(self, test_client):
        """测试创建无标题文章"""
        # 先登录
        login_response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "testpass123"
            }
        )

        if login_response.status_code == 200:
            token = login_response.json()["access_token"]

            response = test_client.post(
                "/api/v1/posts",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "content": "Test content"
                }
            )

            assert response.status_code == 422


# 异步测试
@pytest.mark.asyncio
class TestAsyncEndpoints:
    """异步端点测试"""

    async def test_async_health_check(self, async_client):
        """测试异步健康检查"""
        response = await async_client.get("/api/v1/health")
        assert response.status_code == 200

    async def test_async_get_posts(self, async_client):
        """测试异步获取文章"""
        response = await async_client.get("/api/v1/posts")
        assert response.status_code == 200

        data = response.json()
        assert "items" in data


# 性能测试
class TestPerformance:
    """性能测试"""

    def test_concurrent_requests(self, test_client):
        """测试并发请求"""
        import threading
        import time

        results = []
        errors = []

        def make_request():
            try:
                start = time.time()
                response = test_client.get("/api/v1/posts")
                duration = time.time() - start
                results.append({
                    'status': response.status_code,
                    'duration': duration
                })
            except Exception as e:
                errors.append(str(e))

        # 创建10个并发请求
        threads = []
        for _ in range(10):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()

        for thread in threads:
            thread.join()

        assert len(errors) == 0
        assert len(results) == 10

        # 检查响应时间
        avg_duration = sum(r['duration'] for r in results) / len(results)
        assert avg_duration < 2.0  # 平均响应时间应小于2秒

        # 检查成功率
        success_count = sum(1 for r in results if r['status'] == 200)
        assert success_count >= 9  # 至少90%成功率
