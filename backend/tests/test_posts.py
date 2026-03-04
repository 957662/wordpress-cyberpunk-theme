"""
文章系统测试
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from main import app
from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.category import Category


@pytest.fixture
def client(db_session: Session):
    """创建测试客户端"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session: Session):
    """创建测试用户"""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_category(db_session: Session):
    """创建测试分类"""
    category = Category(
        name="技术",
        slug="tech",
        description="技术类文章"
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


class TestPostCRUD:
    """文章CRUD操作测试"""

    def test_create_post(self, client: TestClient, test_user: User):
        """测试创建文章"""
        response = client.post(
            "/api/v1/posts",
            json={
                "title": "测试文章标题",
                "slug": "test-post",
                "content": "这是文章内容",
                "excerpt": "这是摘要"
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "测试文章标题"
        assert data["slug"] == "test-post"
        assert "id" in data

    def test_get_post(self, client: TestClient, test_post: Post):
        """测试获取单篇文章"""
        response = client.get(f"/api/v1/posts/{test_post.slug}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_post.id
        assert data["title"] == test_post.title

    def test_get_posts_list(self, client: TestClient):
        """测试获取文章列表"""
        response = client.get("/api/v1/posts")

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert isinstance(data["items"], list)

    def test_update_post(self, client: TestClient, test_post: Post, test_user: User):
        """测试更新文章"""
        response = client.put(
            f"/api/v1/posts/{test_post.id}",
            json={
                "title": "更新后的标题",
                "content": "更新后的内容"
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "更新后的标题"

    def test_delete_post(self, client: TestClient, test_post: Post, test_user: User):
        """测试删除文章"""
        response = client.delete(
            f"/api/v1/posts/{test_post.id}",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200

    def test_publish_post(self, client: TestClient, test_post: Post, test_user: User):
        """测试发布文章"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/publish",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "published"

    def test_unpublish_post(self, client: TestClient, test_post: Post, test_user: User):
        """测试取消发布文章"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/unpublish",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "draft"


class TestPostValidation:
    """文章验证测试"""

    def test_duplicate_slug(self, client: TestClient, test_post: Post, test_user: User):
        """测试重复的slug"""
        response = client.post(
            "/api/v1/posts",
            json={
                "title": "新文章",
                "slug": test_post.slug,  # 使用已存在的slug
                "content": "内容"
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 400

    def test_empty_title(self, client: TestClient, test_user: User):
        """测试空标题"""
        response = client.post(
            "/api/v1/posts",
            json={
                "title": "",
                "slug": "test",
                "content": "内容"
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 422

    def test_empty_content(self, client: TestClient, test_user: User):
        """测试空内容"""
        response = client.post(
            "/api/v1/posts",
            json={
                "title": "标题",
                "slug": "test",
                "content": ""
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 422


class TestPostCategories:
    """文章分类测试"""

    def test_add_category_to_post(self, client: TestClient, test_post: Post, test_category: Category, test_user: User):
        """测试为文章添加分类"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/categories",
            json={"category_id": test_category.id},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["categories"]) > 0

    def test_remove_category_from_post(self, client: TestClient, test_post: Post, test_category: Category, test_user: User, db_session: Session):
        """测试从文章移除分类"""
        # 先添加分类
        test_post.categories.append(test_category)
        db_session.commit()

        # 移除分类
        response = client.delete(
            f"/api/v1/posts/{test_post.id}/categories/{test_category.id}",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200

    def test_get_posts_by_category(self, client: TestClient, test_category: Category):
        """测试按分类获取文章"""
        response = client.get(f"/api/v1/categories/{test_category.slug}/posts")

        assert response.status_code == 200
        data = response.json()
        assert "items" in data


class TestPostTags:
    """文章标签测试"""

    def test_add_tags_to_post(self, client: TestClient, test_post: Post, test_user: User):
        """测试为文章添加标签"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/tags",
            json={"tags": ["React", "Next.js", "TypeScript"]},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["tags"]) == 3

    def test_get_posts_by_tag(self, client: TestClient):
        """测试按标签获取文章"""
        response = client.get("/api/v1/tags/React/posts")

        assert response.status_code == 200
        data = response.json()
        assert "items" in data


class TestPostSearch:
    """文章搜索测试"""

    def test_search_posts_by_keyword(self, client: TestClient):
        """测试关键词搜索"""
        response = client.get("/api/v1/posts/search?q=测试")

        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    def test_search_posts_empty_query(self, client: TestClient):
        """测试空搜索查询"""
        response = client.get("/api/v1/posts/search?q=")

        assert response.status_code == 400

    def test_search_posts_with_filters(self, client: TestClient):
        """测试带过滤条件的搜索"""
        response = client.get(
            "/api/v1/posts/search?q=测试&category=tech&status=published"
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data


class TestPostStatistics:
    """文章统计测试"""

    def test_increment_view_count(self, client: TestClient, test_post: Post):
        """测试增加浏览量"""
        response = client.post(f"/api/v1/posts/{test_post.id}/view")

        assert response.status_code == 200
        data = response.json()
        assert "view_count" in data
        assert data["view_count"] > 0

    def test_get_popular_posts(self, client: TestClient):
        """测试获取热门文章"""
        response = client.get("/api/v1/posts/popular")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_recent_posts(self, client: TestClient):
        """测试获取最新文章"""
        response = client.get("/api/v1/posts/recent")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestPostPagination:
    """文章分页测试"""

    def test_pagination_with_page_and_size(self, client: TestClient):
        """测试分页参数"""
        response = client.get("/api/v1/posts?page=1&size=10")

        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 1
        assert data["size"] == 10
        assert len(data["items"]) <= 10

    def test_invalid_page_number(self, client: TestClient):
        """测试无效页码"""
        response = client.get("/api/v1/posts?page=-1")

        assert response.status_code == 400

    def test_invalid_page_size(self, client: TestClient):
        """测试无效页大小"""
        response = client.get("/api/v1/posts?size=1000")

        assert response.status_code == 400


class TestPostPermissions:
    """文章权限测试"""

    def test_update_other_post(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试更新他人文章（应失败）"""
        other_user = User(
            username="other",
            email="other@example.com",
            hashed_password="hashed"
        )
        db_session.add(other_user)
        db_session.commit()

        response = client.put(
            f"/api/v1/posts/{test_post.id}",
            json={"title": "尝试修改"},
            headers={"Authorization": f"Bearer {other_user.id}"}
        )

        assert response.status_code == 403

    def test_delete_other_post(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试删除他人文章（应失败）"""
        other_user = User(
            username="other",
            email="other@example.com",
            hashed_password="hashed"
        )
        db_session.add(other_user)
        db_session.commit()

        response = client.delete(
            f"/api/v1/posts/{test_post.id}",
            headers={"Authorization": f"Bearer {other_user.id}"}
        )

        assert response.status_code == 403
