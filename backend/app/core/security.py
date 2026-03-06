"""
安全工具函数
用于数据加密、验证等
"""
import hashlib
import secrets
import string
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    哈希密码
    
    Args:
        password: 明文密码
        
    Returns:
        哈希后的密码
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    验证密码
    
    Args:
        plain_password: 明文密码
        hashed_password: 哈希密码
        
    Returns:
        是否匹配
    """
    return pwd_context.verify(plain_password, hashed_password)


def generate_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    生成 JWT token
    
    Args:
        data: 要编码的数据
        expires_delta: 过期时间增量
        
    Returns:
        JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
    })
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    解码 JWT token
    
    Args:
        token: JWT token
        
    Returns:
        解码后的数据，失败返回 None
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def generate_random_string(length: int = 32) -> str:
    """
    生成随机字符串
    
    Args:
        length: 字符串长度
        
    Returns:
        随机字符串
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_reset_token() -> str:
    """
    生成密码重置 token
    
    Returns:
        重置 token
    """
    return secrets.token_urlsafe(32)


def hash_string(text: str) -> str:
    """
    哈希字符串（SHA256）
    
    Args:
        text: 要哈希的文本
        
    Returns:
        哈希值
    """
    return hashlib.sha256(text.encode()).hexdigest()


def verify_hash(text: str, hash_value: str) -> bool:
    """
    验证哈希值
    
    Args:
        text: 原文本
        hash_value: 哈希值
        
    Returns:
        是否匹配
    """
    return hash_string(text) == hash_value


def sanitize_input(text: str) -> str:
    """
    清理用户输入
    移除潜在的恶意字符
    
    Args:
        text: 用户输入
        
    Returns:
        清理后的文本
    """
    # 移除控制字符
    cleaned = ''.join(char for char in text if char.isprintable() or char.isspace())
    return cleaned.strip()


def validate_email(email: str) -> bool:
    """
    验证邮箱格式
    
    Args:
        email: 邮箱地址
        
    Returns:
        是否有效
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password: str) -> tuple[bool, list[str]]:
    """
    验证密码强度
    
    Args:
        password: 密码
        
    Returns:
        (是否有效, 错误列表)
    """
    errors = []
    
    if len(password) < 8:
        errors.append("密码长度至少8个字符")
    
    if not any(char.isdigit() for char in password):
        errors.append("密码必须包含至少一个数字")
    
    if not any(char.isupper() for char in password):
        errors.append("密码必须包含至少一个大写字母")
    
    if not any(char.islower() for char in password):
        errors.append("密码必须包含至少一个小写字母")
    
    # 特殊字符检查（可选）
    # if not any(char in string.punctuation for char in password):
    #     errors.append("密码必须包含至少一个特殊字符")
    
    return len(errors) == 0, errors


def mask_email(email: str) -> str:
    """
    遮罩邮箱地址
    
    Args:
        email: 邮箱地址
        
    Returns:
        遮罩后的邮箱
    """
    if '@' not in email:
        return email
    
    username, domain = email.split('@', 1)
    
    if len(username) <= 2:
        masked_username = '*' * len(username)
    else:
        masked_username = username[0] + '*' * (len(username) - 2) + username[-1]
    
    return f"{masked_username}@{domain}"


def mask_phone(phone: str) -> str:
    """
    遮罩手机号码
    
    Args:
        phone: 手机号码
        
    Returns:
        遮罩后的手机号
    """
    if len(phone) < 7:
        return phone
    
    return phone[:3] + '*' * (len(phone) - 6) + phone[-3:]


def generate_api_key(user_id: str) -> str:
    """
    生成 API 密钥
    
    Args:
        user_id: 用户 ID
        
    Returns:
        API 密钥
    """
    prefix = "cp_"  # CyberPress prefix
    unique_part = secrets.token_urlsafe(16)
    signature = hashlib.sha256(f"{user_id}:{unique_part}".encode()).hexdigest()[:8]
    
    return f"{prefix}{unique_part}{signature}"


def verify_api_key(api_key: str, user_id: str) -> bool:
    """
    验证 API 密钥
    
    Args:
        api_key: API 密钥
        user_id: 用户 ID
        
    Returns:
        是否有效
    """
    if not api_key.startswith("cp_"):
        return False
    
    # 这里应该从数据库查询并验证
    # 简化版本
    return len(api_key) >= 20


def rate_limit_key(identifier: str, action: str) -> str:
    """
    生成速率限制键
    
    Args:
        identifier: 标识符（如用户ID、IP等）
        action: 动作（如 'login', 'api_call'）
        
    Returns:
        速率限制键
    """
    return f"rate_limit:{action}:{identifier}"


def create_csrf_token() -> str:
    """
    创建 CSRF token
    
    Returns:
        CSRF token
    """
    return secrets.token_urlsafe(32)


def verify_csrf_token(token: str, stored_token: str) -> bool:
    """
    验证 CSRF token
    
    Args:
        token: 提交的 token
        stored_token: 存储的 token
        
    Returns:
        是否有效
    """
    return secrets.compare_digest(token, stored_token)


def get_client_ip(request) -> str:
    """
    获取客户端 IP 地址
    
    Args:
        request: FastAPI 请求对象
        
    Returns:
        IP 地址
    """
    # 检查代理头
    forwarded = request.headers.get('X-Forwarded-For')
    if forwarded:
        return forwarded.split(',')[0].strip()
    
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip
    
    return request.client.host if request.client else "unknown"
