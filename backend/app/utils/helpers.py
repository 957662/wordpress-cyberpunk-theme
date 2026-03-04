"""
Helper Functions
辅助工具函数
"""

import re
import secrets
import string
from typing import Optional
from urllib.parse import urlparse
import html


def generate_slug(text: str, max_length: int = 100) -> str:
    """
    生成URL友好的slug

    Args:
        text: 输入文本
        max_length: 最大长度

    Returns:
        slug字符串
    """
    # 转换为小写
    text = text.lower()

    # 替换空格和特殊字符为连字符
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)

    # 去除首尾连字符
    text = text.strip('-')

    # 限制长度
    if len(text) > max_length:
        text = text[:max_length].rstrip('-')

    return text


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


def hash_string(text: str, algorithm: str = 'sha256') -> str:
    """
    对字符串进行哈希

    Args:
        text: 输入文本
        algorithm: 哈希算法

    Returns:
        哈希值
    """
    import hashlib

    hash_obj = hashlib.new(algorithm)
    hash_obj.update(text.encode('utf-8'))
    return hash_obj.hexdigest()


def validate_email(email: str) -> bool:
    """
    验证邮箱格式

    Args:
        email: 邮箱地址

    Returns:
        是否有效
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def sanitize_html(html_content: str) -> str:
    """
    清理HTML内容，移除危险标签

    Args:
        html_content: HTML内容

    Returns:
        清理后的HTML
    """
    # 基本的HTML转义
    sanitized = html.escape(html_content)

    # 允许的安全标签
    safe_tags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
                 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'blockquote']

    # 可以扩展更复杂的清理逻辑
    return sanitized


def validate_url(url: str) -> bool:
    """
    验证URL格式

    Args:
        url: URL地址

    Returns:
        是否有效
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def truncate_text(text: str, max_length: int = 200, suffix: str = '...') -> str:
    """
    截断文本

    Args:
        text: 输入文本
        max_length: 最大长度
        suffix: 后缀

    Returns:
        截断后的文本
    """
    if len(text) <= max_length:
        return text

    return text[:max_length - len(suffix)] + suffix


def extract_domain(url: str) -> Optional[str]:
    """
    从URL中提取域名

    Args:
        url: URL地址

    Returns:
        域名
    """
    try:
        parsed = urlparse(url)
        return parsed.netloc
    except Exception:
        return None


def normalize_whitespace(text: str) -> str:
    """
    标准化空白字符

    Args:
        text: 输入文本

    Returns:
        标准化后的文本
    """
    return ' '.join(text.split())


def is_strong_password(password: str) -> bool:
    """
    检查密码强度

    Args:
        password: 密码

    Returns:
        是否强密码
    """
    if len(password) < 8:
        return False

    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password)

    return all([has_upper, has_lower, has_digit, has_special])


def mask_email(email: str, mask_char: str = '*') -> str:
    """
    遮盖邮箱地址

    Args:
        email: 邮箱地址
        mask_char: 遮盖字符

    Returns:
        遮盖后的邮箱
    """
    if '@' not in email:
        return email

    local, domain = email.split('@', 1)

    if len(local) <= 2:
        masked_local = mask_char * len(local)
    else:
        masked_local = local[0] + mask_char * (len(local) - 2) + local[-1]

    return f"{masked_local}@{domain}"


def parse_user_agent(user_agent: str) -> dict:
    """
    解析User-Agent字符串

    Args:
        user_agent: User-Agent字符串

    Returns:
        解析后的信息
    """
    info = {
        'browser': 'Unknown',
        'os': 'Unknown',
        'device': 'Unknown'
    }

    ua = user_agent.lower()

    # 简单的浏览器检测
    if 'chrome' in ua:
        info['browser'] = 'Chrome'
    elif 'firefox' in ua:
        info['browser'] = 'Firefox'
    elif 'safari' in ua:
        info['browser'] = 'Safari'
    elif 'edge' in ua:
        info['browser'] = 'Edge'

    # 简单的操作系统检测
    if 'windows' in ua:
        info['os'] = 'Windows'
    elif 'mac' in ua or 'osx' in ua:
        info['os'] = 'macOS'
    elif 'linux' in ua:
        info['os'] = 'Linux'
    elif 'android' in ua:
        info['os'] = 'Android'
    elif 'ios' in ua or 'iphone' in ua or 'ipad' in ua:
        info['os'] = 'iOS'

    # 设备类型
    if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
        info['device'] = 'Mobile'
    elif 'tablet' in ua or 'ipad' in ua:
        info['device'] = 'Tablet'
    else:
        info['device'] = 'Desktop'

    return info
