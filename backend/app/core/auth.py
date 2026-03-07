"""
Auth module - provides authentication utilities
认证模块 - 提供认证工具
"""

from app.services.auth_service import AuthService

# 创建模块级别的函数别名
create_access_token = AuthService.create_access_token
verify_password = AuthService.verify_password
get_password_hash = AuthService.get_password_hash
decode_access_token = AuthService.decode_access_token

__all__ = [
    "create_access_token",
    "verify_password",
    "get_password_hash",
    "decode_access_token",
    "AuthService",
]
