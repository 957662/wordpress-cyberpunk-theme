"""
数据验证器
提供常用的验证函数
"""

import re
from typing import Optional, List
from datetime import datetime, timedelta
from fastapi import HTTPException, status


class Validators:
    """数据验证器类"""

    # 邮箱正则
    EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')

    # 用户名正则（3-20个字符，只允许字母、数字、下划线）
    USERNAME_REGEX = re.compile(r'^[a-zA-Z0-9_]{3,20}$')

    # 手机号正则（中国大陆）
    PHONE_REGEX = re.compile(r'^1[3-9]\d{9}$')

    # URL 正则
    URL_REGEX = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )

    @classmethod
    def validate_email(cls, email: str) -> bool:
        """验证邮箱格式"""
        if not email or not isinstance(email, str):
            return False
        return cls.EMAIL_REGEX.match(email) is not None

    @classmethod
    def validate_username(cls, username: str) -> bool:
        """验证用户名格式"""
        if not username or not isinstance(username, str):
            return False
        return cls.USERNAME_REGEX.match(username) is not None

    @classmethod
    def validate_phone(cls, phone: str) -> bool:
        """验证手机号格式"""
        if not phone or not isinstance(phone, str):
            return False
        return cls.PHONE_REGEX.match(phone) is not None

    @classmethod
    def validate_url(cls, url: str) -> bool:
        """验证 URL 格式"""
        if not url or not isinstance(url, str):
            return False
        return cls.URL_REGEX.match(url) is not None

    @classmethod
    def validate_password_strength(cls, password: str) -> dict:
        """
        验证密码强度
        返回包含强度等级和提示的字典
        """
        if not password or not isinstance(password, str):
            return {"valid": False, "message": "密码不能为空"}

        if len(password) < 8:
            return {"valid": False, "message": "密码长度至少为8位"}

        checks = {
            "lowercase": any(c.islower() for c in password),
            "uppercase": any(c.isupper() for c in password),
            "digit": any(c.isdigit() for c in password),
            "special": any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password),
        }

        passed = sum(checks.values())

        if passed < 2:
            return {"valid": False, "message": "密码强度太弱，请包含更多字符类型"}

        strength = "weak"
        if passed >= 3:
            strength = "medium"
        if passed == 4:
            strength = "strong"

        return {
            "valid": True,
            "strength": strength,
            "checks": checks,
        }

    @classmethod
    def validate_age(cls, birth_date: datetime, min_age: int = 13, max_age: int = 120) -> bool:
        """验证年龄是否在有效范围内"""
        if not isinstance(birth_date, datetime):
            return False

        today = datetime.utcnow()
        age = (today - birth_date).days // 365

        return min_age <= age <= max_age

    @classmethod
    def validate_date_range(
        cls,
        start_date: datetime,
        end_date: datetime,
        min_duration: Optional[timedelta] = None
    ) -> bool:
        """验证日期范围是否有效"""
        if not isinstance(start_date, datetime) or not isinstance(end_date, datetime):
            return False

        if end_date <= start_date:
            return False

        if min_duration and (end_date - start_date) < min_duration:
            return False

        return True

    @classmethod
    def sanitize_html(cls, html: str) -> str:
        """
        简单的 HTML 清理
        移除危险标签和属性
        """
        if not html:
            return ""

        # 危险标签列表
        dangerous_tags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button']

        for tag in dangerous_tags:
            html = re.sub(rf'<{tag}[^>]*>.*?</{tag}>', '', html, flags=re.IGNORECASE | re.DOTALL)
            html = re.sub(rf'<{tag}[^>]*/?>', '', html, flags=re.IGNORECASE)

        # 移除事件处理器
        html = re.sub(r'\s*on\w+\s*=\s*["\'][^"\']*["\']', '', html, flags=re.IGNORECASE)

        return html

    @classmethod
    def validate_file_size(cls, file_size: int, max_size: int) -> bool:
        """验证文件大小"""
        return file_size <= max_size

    @classmethod
    def validate_file_type(cls, filename: str, allowed_extensions: List[str]) -> bool:
        """验证文件类型"""
        if not filename:
            return False

        # 获取文件扩展名
        ext = filename.rsplit('.', 1)[-1].lower()

        return ext in [e.lower().lstrip('.') for e in allowed_extensions]

    @classmethod
    def validate_slug(cls, slug: str) -> bool:
        """
        验证 slug 格式
        只允许小写字母、数字、连字符
        """
        if not slug:
            return False

        # 不允许开头或结尾是连字符
        if slug.startswith('-') or slug.endswith('-'):
            return False

        # 不允许连续的连字符
        if '--' in slug:
            return False

        # 只允许小写字母、数字、连字符
        return bool(re.match(r'^[a-z0-9-]+$', slug))

    @classmethod
    def generate_slug(cls, text: str) -> str:
        """
        从文本生成 slug
        """
        if not text:
            return ""

        # 转换为小写
        slug = text.lower()

        # 替换空格和特殊字符为连字符
        slug = re.sub(r'[^a-z0-9\u4e00-\u9fa5]+', '-', slug)

        # 移除开头和结尾的连字符
        slug = slug.strip('-')

        # 移除连续的连字符
        slug = re.sub(r'-+', '-', slug)

        return slug

    @classmethod
    def validate_ip_address(cls, ip: str) -> bool:
        """验证 IP 地址"""
        try:
            parts = ip.split('.')
            if len(parts) != 4:
                return False

            for part in parts:
                if not part.isdigit():
                    return False
                num = int(part)
                if num < 0 or num > 255:
                    return False

            return True
        except:
            return False


def validate_or_400(
    condition: bool,
    message: str = "Validation failed"
):
    """
    快捷验证函数，验证失败时抛出 400 错误
    """
    if not condition:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
