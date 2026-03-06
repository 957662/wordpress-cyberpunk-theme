"""
Test configuration and fixtures
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import Base, get_db

# Test database URL
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    """Create a test database session"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    """Create a test client with database override"""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    from app.models.user import User
    from app.services.auth_service import AuthService

    from app.schemas.user import UserCreate
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        password="testpass123",
        full_name="Test User"
    )
    return AuthService.create_user(db_session, user_data)


@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers for test user"""
    from app.services.auth_service import AuthService

    from app.schemas.user import UserLogin
    login_data = UserLogin(
        email="test@example.com",
        password="testpass123"
    )
    # This would need to be adapted to work with test client
    return {"Authorization": "Bearer test_token"}
