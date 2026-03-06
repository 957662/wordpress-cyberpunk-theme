"""
测试配置和fixtures
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from main import app
from core.database import Base, get_db
from models.user import User
from models.post import Post
from core.security import get_password_hash


# 测试数据库URL（使用内存SQLite）
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# 创建测试引擎
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# 创建测试会话
TestSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
    class_=AsyncSession,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """创建测试数据库会话"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
def test_client(db_session: AsyncSession) -> TestClient:
    """创建测试客户端"""

    async def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """创建测试用户"""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpass123"),
        is_active=True,
        is_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
async def test_admin(db_session: AsyncSession) -> User:
    """创建测试管理员"""
    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("adminpass123"),
        is_active=True,
        is_verified=True,
        is_superuser=True,
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    return admin


@pytest.fixture
async def test_post(db_session: AsyncSession, test_user: User) -> Post:
    """创建测试文章"""
    post = Post(
        title="Test Post",
        content="This is a test post content.",
        status="published",
        author_id=test_user.id,
    )
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(post)
    return post


@pytest.fixture
async def auth_headers(test_client: TestClient, test_user: User) -> dict:
    """获取认证头"""
    response = test_client.post(
        "/api/v1/auth/login",
        json={
            "username": "testuser",
            "password": "testpass123"
        }
    )

    if response.status_code == 200:
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    return {}


@pytest.fixture
async def admin_headers(test_client: TestClient, test_admin: User) -> dict:
    """获取管理员认证头"""
    response = test_client.post(
        "/api/v1/auth/login",
        json={
            "username": "admin",
            "password": "adminpass123"
        }
    )

    if response.status_code == 200:
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    return {}


@pytest.fixture
def mock_file_upload():
    """模拟文件上传"""
    from io import BytesIO

    file_content = b"Test file content"
    file = BytesIO(file_content)
    file.name = "test.txt"
    file.content_type = "text/plain"

    return file


@pytest.fixture
def mock_image_upload():
    """模拟图片上传"""
    from io import BytesIO

    # 简单的PNG图片数据
    png_data = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0'
        b'\x00\x00\x00\x03\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
    )

    file = BytesIO(png_data)
    file.name = "test.png"
    file.content_type = "image/png"

    return file


@pytest.fixture
def mock_redis():
    """模拟Redis客户端"""
    import fakeredis

    return fakeredis.FakeRedis()


@pytest.fixture
def mock_email_service(monkeypatch):
    """模拟邮件服务"""
    from unittest.mock import Mock

    mock = Mock()
    mock.send_email.return_value = True

    monkeypatch.setattr(
        "services.email_service.email_service.send_email",
        mock.send_email
    )

    return mock


@pytest.fixture
def mock_websocket_service(monkeypatch):
    """模拟WebSocket服务"""
    from unittest.mock import Mock

    mock = Mock()
    mock.broadcast_to_channel.return_value = 1
    mock.send_notification.return_value = True

    monkeypatch.setattr(
        "services.websocket_service.websocket_service",
        mock
    )

    return mock


@pytest.fixture
def mock_task_queue(monkeypatch):
    """模拟任务队列"""
    from unittest.mock import AsyncMock

    mock = AsyncMock()
    mock.add_task.return_value = "task_id"
    mock.get_task_result.return_value = {"status": "completed"}

    monkeypatch.setattr(
        "services.task_queue_service.task_queue_service",
        mock
    )

    return mock


# 性能测试fixtures
@pytest.fixture
def benchmark():
    """性能测试工具"""
    import time

    class Benchmark:
        def __init__(self):
            self.results = []

        def measure(self, func, *args, **kwargs):
            """测量函数执行时间"""
            start = time.time()
            result = func(*args, **kwargs)
            duration = time.time() - start
            self.results.append({
                'function': func.__name__,
                'duration': duration,
                'timestamp': time.time()
            })
            return result

        def get_results(self):
            """获取所有结果"""
            return self.results

        def get_average_duration(self):
            """获取平均执行时间"""
            if not self.results:
                return 0
            return sum(r['duration'] for r in self.results) / len(self.results)

    return Benchmark()


# 集成测试fixtures
@pytest.fixture
async def setup_test_data(db_session: AsyncSession):
    """设置测试数据"""
    users = []
    posts = []

    # 创建多个测试用户
    for i in range(5):
        user = User(
            username=f"user{i}",
            email=f"user{i}@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=True,
            is_verified=True,
        )
        db_session.add(user)
        users.append(user)

    await db_session.commit()

    # 为每个用户创建文章
    for user in users:
        for j in range(3):
            post = Post(
                title=f"Post {j} by {user.username}",
                content=f"Content of post {j}",
                status="published",
                author_id=user.id,
            )
            db_session.add(post)
            posts.append(post)

    await db_session.commit()

    return {
        'users': users,
        'posts': posts,
    }
