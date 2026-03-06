"""
结构化日志配置
用于生产环境日志记录
"""
import logging
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict
from pythonjsonlogger import jsonlogger

from app.core.config import settings


class JsonFormatter(jsonlogger.JsonFormatter):
    """自定义 JSON 日志格式化器"""

    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]):
        super().add_fields(log_record, record, message_dict)
        
        # 添加自定义字段
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        log_record['app'] = 'cyberpress'
        
        # 添加环境信息
        if not hasattr(log_record, 'environment'):
            log_record['environment'] = settings.ENVIRONMENT
        
        return log_record


def setup_logging() -> None:
    """
    配置应用日志
    """
    # 创建日志目录
    log_dir = Path('logs')
    log_dir.mkdir(exist_ok=True)
    
    # 获取根日志记录器
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # 清除现有处理器
    root_logger.handlers.clear()
    
    # JSON 格式化器（生产环境）
    if settings.ENVIRONMENT == 'production':
        formatter = JsonFormatter(
            '%(timestamp)s %(level)s %(logger)s %(message)s %(app)s %(environment)s',
            timestamp=True
        )
    else:
        # 开发环境使用简单格式
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # 文件处理器（仅生产环境）
    if settings.ENVIRONMENT == 'production':
        # 错误日志
        error_handler = logging.FileHandler('logs/error.log')
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        root_logger.addHandler(error_handler)
        
        # 应用日志
        app_handler = logging.FileHandler('logs/app.log')
        app_handler.setLevel(logging.INFO)
        app_handler.setFormatter(formatter)
        root_logger.addHandler(app_handler)
        
        # 访问日志
        access_handler = logging.FileHandler('logs/access.log')
        access_handler.setLevel(logging.INFO)
        access_handler.setFormatter(formatter)
        root_logger.addHandler(access_handler)


def get_logger(name: str) -> logging.Logger:
    """
    获取命名的日志记录器
    
    Args:
        name: 日志记录器名称
        
    Returns:
        日志记录器实例
    """
    return logging.getLogger(name)


class LoggerMixin:
    """
    日志记录器混入类
    为类提供日志功能
    """
    
    @property
    def logger(self) -> logging.Logger:
        """获取该类的日志记录器"""
        if not hasattr(self, '_logger'):
            self._logger = logging.getLogger(self.__class__.__name__)
        return self._logger


# 预配置的日志记录器
api_logger = logging.getLogger('api')
db_logger = logging.getLogger('database')
auth_logger = logging.getLogger('auth')
cache_logger = logging.getLogger('cache')
error_logger = logging.getLogger('error')


def log_request(request_id: str, method: str, path: str, status_code: int, duration: float):
    """
    记录 HTTP 请求日志
    
    Args:
        request_id: 请求 ID
        method: HTTP 方法
        path: 请求路径
        status_code: 响应状态码
        duration: 请求耗时（秒）
    """
    access_logger.info(
        'request_completed',
        extra={
            'request_id': request_id,
            'method': method,
            'path': path,
            'status_code': status_code,
            'duration_ms': round(duration * 1000, 2),
        }
    )


def log_error(error: Exception, context: Dict[str, Any] = None):
    """
    记录错误日志
    
    Args:
        error: 异常对象
        context: 额外上下文信息
    """
    error_logger.error(
        str(error),
        exc_info=True,
        extra={
            'error_type': type(error).__name__,
            'context': context or {},
        }
    )


def log_auth_event(event: str, user_id: str = None, details: Dict[str, Any] = None):
    """
    记录认证事件
    
    Args:
        event: 事件类型
        user_id: 用户 ID
        details: 事件详情
    """
    auth_logger.info(
        event,
        extra={
            'user_id': user_id,
            'details': details or {},
        }
    )
