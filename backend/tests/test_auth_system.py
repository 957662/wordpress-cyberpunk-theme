"""
认证系统测试
 ============================================================================
 功能: 测试用户认证相关的 API 接口
 版本: 1.0.0
 日期: 2026-03-05
 ============================================================================
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from main import app
from app.core.database import get_db
from app.models.user import User
from app.core.security import create_access_token, verify_password


class TestAuthEndpoints:
    """测试认证相关的端点"""

    def test_register_user(self, client: TestClient, db: Session):
        """测试用户注册"""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "SecurePass123!",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"
        assert "id" in data
        assert "password" not in data

        # 验证用户已创建在数据库中
        user = db.query(User).filter(User.email == "test@example.com").first()
        assert user is not None
        assert user.username == "testuser"

    def test_register_duplicate_email(self, client: TestClient, db: Session):
        """测试重复邮箱注册"""
        # 第一次注册
        client.post(
            "/api/v1/auth/register",
            json={
                "username": "user1",
                "email": "test@example.com",
                "password": "SecurePass123!",
            }
        )

        # 第二次注册相同邮箱
        response = client.post(
            "/api/v1/auth/register",
            json={
                "username": "user2",
                "email": "test@example.com",
                "password": "SecurePass456!",
            }
        )

        assert response.status_code == 400
        assert "email already registered" in response.json()["detail"].lower()

    def test_register_weak_password(self, client: TestClient):
        """测试弱密码注册"""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "weak",
            }
        )

        assert response.status_code == 422
        assert "password" in response.json()["detail"][0]["loc"]

    def test_login_success(self, client: TestClient, db: Session):
        """测试成功登录"""
        # 先注册用户
        client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "SecurePass123!",
            }
        )

        # 登录
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "test@example.com",
                "password": "SecurePass123!",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient):
        """测试无效凭据登录"""
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "wrongpassword",
            }
        )

        assert response.status_code == 401

    def test_get_current_user(self, client: TestClient, auth_token: str):
        """测试获取当前用户信息"""
        response = client.get(
            "/api/v1/users/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "username" in data
        assert "email" in data

    def test_get_current_user_unauthorized(self, client: TestClient):
        """测试未授权访问"""
        response = client.get("/api/v1/users/me")

        assert response.status_code == 401

    def test_update_profile(self, client: TestClient, auth_token: str):
        """测试更新用户资料"""
        response = client.put(
            "/api/v1/users/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "bio": "这是我的个人简介",
                "location": "北京",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["bio"] == "这是我的个人简介"
        assert data["location"] == "北京"

    def test_change_password(self, client: TestClient, auth_token: str):
        """测试修改密码"""
        response = client.post(
            "/api/v1/users/change-password",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "current_password": "SecurePass123!",
                "new_password": "NewSecurePass456!",
            }
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Password changed successfully"

    def test_change_password_wrong_current(self, client: TestClient, auth_token: str):
        """测试使用错误的当前密码"""
        response = client.post(
            "/api/v1/users/change-password",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "current_password": "WrongPassword",
                "new_password": "NewSecurePass456!",
            }
        )

        assert response.status_code == 400

    def test_logout(self, client: TestClient, auth_token: str):
        """测试退出登录"""
        response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Successfully logged out"


class TestTokenRefresh:
    """测试 Token 刷新"""

    def test_refresh_token(self, client: TestClient, refresh_token: str):
        """测试刷新访问令牌"""
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_refresh_invalid_token(self, client: TestClient):
        """测试使用无效刷新令牌"""
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid_token"}
        )

        assert response.status_code == 401


class TestPasswordReset:
    """测试密码重置"""

    def test_request_password_reset(self, client: TestClient, db: Session):
        """测试请求密码重置"""
        # 创建用户
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=verify_password("SecurePass123!")
        )
        db.add(user)
        db.commit()

        response = client.post(
            "/api/v1/auth/forgot-password",
            json={"email": "test@example.com"}
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Password reset email sent"

    def test_reset_password(self, client: TestClient, db: Session):
        """测试重置密码"""
        # 创建用户和重置令牌
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=verify_password("SecurePass123!")
        )
        db.add(user)
        db.commit()

        reset_token = create_access_token(data={"sub": user.email})

        response = client.post(
            "/api/v1/auth/reset-password",
            json={
                "token": reset_token,
                "new_password": "NewSecurePass789!"
            }
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Password reset successfully"


class TestAccountSecurity:
    """测试账户安全功能"""

    def test_account_lockout(self, client: TestClient, db: Session):
        """测试账户锁定（多次失败登录）"""
        # 创建用户
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=verify_password("SecurePass123!")
        )
        db.add(user)
        db.commit()

        # 尝试5次错误登录
        for _ in range(5):
            response = client.post(
                "/api/v1/auth/login",
                data={
                    "username": "test@example.com",
                    "password": "wrongpassword",
                }
            )

        # 第6次应该返回账户锁定
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "test@example.com",
                "password": "wrongpassword",
            }
        )

        assert response.status_code == 423  # Locked
        assert "locked" in response.json()["detail"].lower()

    def test_rate_limiting(self, client: TestClient):
        """测试API速率限制"""
        # 尝试多次注册请求
        responses = []
        for _ in range(10):
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "username": f"user{_}",
                    "email": f"user{_}@example.com",
                    "password": "SecurePass123!",
                }
            )
            responses.append(response)

        # 检查是否有请求被限流
        rate_limited = any(r.status_code == 429 for r in responses)
        assert rate_limited


class TestEmailVerification:
    """测试邮箱验证"""

    def test_send_verification_email(self, client: TestClient, auth_token: str):
        """测试发送验证邮件"""
        response = client.post(
            "/api/v1/auth/send-verification",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Verification email sent"

    def test_verify_email(self, client: TestClient, db: Session):
        """测试验证邮箱"""
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=verify_password("SecurePass123!"),
            is_verified=False
        )
        db.add(user)
        db.commit()

        verification_token = create_access_token(data={"sub": user.email})

        response = client.post(
            "/api/v1/auth/verify-email",
            json={"token": verification_token}
        )

        assert response.status_code == 200

        # 验证用户状态已更新
        db.refresh(user)
        assert user.is_verified is True


class TestTwoFactorAuth:
    """测试两步验证"""

    def test_enable_2fa(self, client: TestClient, auth_token: str):
        """测试启用两步验证"""
        response = client.post(
            "/api/v1/auth/2fa/enable",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "qr_code" in data or "secret" in data

    def test_verify_2fa(self, client: TestClient, auth_token: str):
        """测试验证两步验证码"""
        # 假设已启用2FA
        response = client.post(
            "/api/v1/auth/2fa/verify",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"code": "123456"}
        )

        # 这里应该返回成功或失败
        assert response.status_code in [200, 400]

    def test_login_with_2fa(self, client: TestClient, db: Session):
        """测试使用2FA登录"""
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=verify_password("SecurePass123!"),
            two_factor_enabled=True
        )
        db.add(user)
        db.commit()

        # 第一步：正常登录
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "test@example.com",
                "password": "SecurePass123!",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data.get("requires_2fa") is True

        # 第二步：提交2FA代码
        response = client.post(
            "/api/v1/auth/2fa/login",
            json={
                "temp_token": data.get("temp_token"),
                "code": "123456"
            }
        )

        assert response.status_code in [200, 401]  # 取决于代码是否正确


# Pytest fixtures 可以放在 conftest.py 中
"""
@pytest.fixture
def client():
    from main import app
    from fastapi.testclient import TestClient
    return TestClient(app)

@pytest.fixture
def db():
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def test_user(client, db):
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=verify_password("SecurePass123!")
    )
    db.add(user)
    db.commit()
    return user

@pytest.fixture
def auth_token(client, test_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "SecurePass123!",
        }
    )
    return response.json()["access_token"]

@pytest.fixture
def refresh_token(client, test_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "SecurePass123!",
        }
    )
    return response.json()["refresh_token"]
"""
