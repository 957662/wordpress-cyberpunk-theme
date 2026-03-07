"""
Dependencies module - re-exports from deps.py for backward compatibility
依赖模块 - 从 deps.py 重导出以保持向后兼容
"""

from app.core.deps import (
    oauth2_scheme,
    get_current_user,
    get_current_active_user,
    get_current_admin_user,
    get_current_author_user,
    PermissionChecker,
    require_post_create,
    require_post_update,
    require_post_delete,
    require_comment_moderate,
    require_user_manage,
    can_modify_post,
    can_delete_post,
    can_moderate_comment,
)

__all__ = [
    "oauth2_scheme",
    "get_current_user",
    "get_current_active_user",
    "get_current_admin_user",
    "get_current_author_user",
    "PermissionChecker",
    "require_post_create",
    "require_post_update",
    "require_post_delete",
    "require_comment_moderate",
    "require_user_manage",
    "can_modify_post",
    "can_delete_post",
    "can_moderate_comment",
]
