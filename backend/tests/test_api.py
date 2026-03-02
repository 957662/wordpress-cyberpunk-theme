"""
API Tests
API端点测试
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from app.core.database import get_db, Base
from app.models.post import Post, Category, Tag
from app.models.user import User


# 创建测试数据库
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    """创建测试数据库会话"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    """创建测试客户端"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    from fastapi.testclient import TestClient
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    """创建测试用户"""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password",
        full_name="Test User",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_category(db_session):
    """创建测试分类"""
    category = Category(
        name="技术",
        slug="tech",
        description="技术相关文章",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


@pytest.fixture
def test_tag(db_session):
    """创建测试标签"""
    tag = Tag(
        name="Python",
        slug="python",
    )
    db_session.add(tag)
    db_session.commit()
    db_session.refresh(tag)
    return tag


def test_health_check(client):
    """测试健康检查端点"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_get_posts_empty(client):
    """测试获取空文章列表"""
    response = client.get("/api/v1/posts")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert len(data["data"]) == 0


def test_create_post(client, test_user, test_category, test_tag):
    """测试创建文章"""
    post_data = {
        "title": "测试文章",
        "slug": "test-post",
        "content": "这是测试内容",
        "excerpt": "测试摘要",
        "category_id": test_category.id,
        "tags": [test_tag.id],
        "status": "published",
    }

    response = client.post("/api/v1/posts", json=post_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "测试文章"
    assert data["slug"] == "test-post"


def test_get_posts(client, test_user, test_category):
    """测试获取文章列表"""
    # 创建测试文章
    post = Post(
        title="测试文章",
        slug="test-post",
        content="这是测试内容",
        excerpt="测试摘要",
        author_id=test_user.id,
        category_id=test_category.id,
        status="published",
    )
    db = client.app.dependency_overrides[get_db]
    # 这里需要更复杂的设置来直接访问db

    response = client.get("/api/v1/posts")
    assert response.status_code == 200


def test_get_post_by_id(client, test_user, test_category):
    """测试通过ID获取文章"""
    # 首先创建文章
    post_data = {
        "title": "测试文章",
        "slug": "test-post-by-id",
        "content": "这是测试内容",
        "status": "published",
    }

    create_response = client.post("/api/v1/posts", json=post_data)
    post_id = create_response.json()["id"]

    # 获取文章
    response = client.get(f"/api/v1/posts/{post_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == post_id
    assert data["title"] == "测试文章"


def test_get_categories(client, test_category):
    """测试获取分类列表"""
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(cat["name"] == "技术" for cat in data)


def test_get_tags(client, test_tag):
    """测试获取标签列表"""
    response = client.get("/api/v1/tags")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(tag["name"] == "Python" for tag in data)
