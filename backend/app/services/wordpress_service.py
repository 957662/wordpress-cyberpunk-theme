"""
WordPress Service - WordPress API 服务
与 WordPress REST API 交互
"""

import httpx
from typing import Any, Dict, List, Optional
from datetime import datetime
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class WordPressService:
    """WordPress API 服务类"""

    def __init__(self):
        """初始化 WordPress 服务"""
        self.base_url = settings.WORDPRESS_API_URL
        self.username = settings.WORDPRESS_USERNAME
        self.password = settings.WORDPRESS_PASSWORD
        self.timeout = settings.WORDPRESS_TIMEOUT
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        """异步上下文管理器入口"""
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=self.timeout,
            headers={
                "User-Agent": "CyberPress-Backend/1.0"
            }
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """异步上下文管理器退出"""
        if self.client:
            await self.client.aclose()

    def _get_auth(self) -> Optional[tuple]:
        """获取认证信息"""
        if self.username and self.password:
            return (self.username, self.password)
        return None

    async def get_posts(
        self,
        page: int = 1,
        per_page: int = 10,
        category: Optional[int] = None,
        tag: Optional[int] = None,
        search: Optional[str] = None,
        status: str = "publish"
    ) -> List[Dict[str, Any]]:
        """
        获取文章列表

        Args:
            page: 页码
            per_page: 每页数量
            category: 分类 ID
            tag: 标签 ID
            search: 搜索关键词
            status: 文章状态
        """
        try:
            params = {
                "page": page,
                "per_page": per_page,
                "status": status,
                "_embed": True  # 包含关联数据（作者、分类等）
            }

            if category:
                params["categories"] = category
            if tag:
                params["tags"] = tag
            if search:
                params["search"] = search

            response = await self.client.get(
                "/posts",
                params=params,
                auth=self._get_auth()
            )
            response.raise_for_status()

            posts = response.json()
            logger.info(f"Retrieved {len(posts)} posts from WordPress")
            return posts

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch posts: {e}")
            return []

    async def get_post(self, post_id: int) -> Optional[Dict[str, Any]]:
        """获取单篇文章"""
        try:
            response = await self.client.get(
                f"/posts/{post_id}",
                params={"_embed": True},
                auth=self._get_auth()
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch post {post_id}: {e}")
            return None

    async def get_post_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取文章"""
        try:
            response = await self.client.get(
                "/posts",
                params={"slug": slug, "_embed": True},
                auth=self._get_auth()
            )
            response.raise_for_status()

            posts = response.json()
            if posts:
                return posts[0]
            return None

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch post by slug {slug}: {e}")
            return None

    async def create_post(self, post_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """创建文章"""
        try:
            response = await self.client.post(
                "/posts",
                json=post_data,
                auth=self._get_auth()
            )
            response.raise_for_status()

            logger.info(f"Created post: {post_data.get('title')}")
            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to create post: {e}")
            return None

    async def update_post(self, post_id: int, post_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """更新文章"""
        try:
            response = await self.client.post(
                f"/posts/{post_id}",
                json=post_data,
                auth=self._get_auth()
            )
            response.raise_for_status()

            logger.info(f"Updated post {post_id}")
            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to update post {post_id}: {e}")
            return None

    async def delete_post(self, post_id: int) -> bool:
        """删除文章"""
        try:
            response = await self.client.delete(
                f"/posts/{post_id}",
                auth=self._get_auth()
            )
            response.raise_for_status()

            logger.info(f"Deleted post {post_id}")
            return True

        except httpx.HTTPError as e:
            logger.error(f"Failed to delete post {post_id}: {e}")
            return False

    async def get_categories(self, hide_empty: bool = False) -> List[Dict[str, Any]]:
        """获取分类列表"""
        try:
            response = await self.client.get(
                "/categories",
                params={"hide_empty": hide_empty, "per_page": 100}
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch categories: {e}")
            return []

    async def get_tags(self, hide_empty: bool = False) -> List[Dict[str, Any]]:
        """获取标签列表"""
        try:
            response = await self.client.get(
                "/tags",
                params={"hide_empty": hide_empty, "per_page": 100}
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch tags: {e}")
            return []

    async def get_comments(
        self,
        post_id: Optional[int] = None,
        page: int = 1,
        per_page: int = 10
    ) -> List[Dict[str, Any]]:
        """获取评论列表"""
        try:
            params = {
                "page": page,
                "per_page": per_page,
                "order": "asc"
            }

            if post_id:
                params["post"] = post_id

            response = await self.client.get("/comments", params=params)
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch comments: {e}")
            return []

    async def create_comment(self, comment_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """创建评论"""
        try:
            response = await self.client.post(
                "/comments",
                json=comment_data,
                auth=self._get_auth()
            )
            response.raise_for_status()

            logger.info(f"Created comment for post {comment_data.get('post')}")
            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to create comment: {e}")
            return None

    async def get_media(self, page: int = 1, per_page: int = 20) -> List[Dict[str, Any]]:
        """获取媒体列表"""
        try:
            response = await self.client.get(
                "/media",
                params={"page": page, "per_page": per_page},
                auth=self._get_auth()
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch media: {e}")
            return []

    async def upload_media(
        self,
        file_content: bytes,
        filename: str,
        mime_type: str
    ) -> Optional[Dict[str, Any]]:
        """上传媒体文件"""
        try:
            files = {
                "file": (filename, file_content, mime_type)
            }

            response = await self.client.post(
                "/media",
                files=files,
                auth=self._get_auth()
            )
            response.raise_for_status()

            logger.info(f"Uploaded media: {filename}")
            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to upload media {filename}: {e}")
            return None

    async def get_users(self, page: int = 1, per_page: int = 10) -> List[Dict[str, Any]]:
        """获取用户列表"""
        try:
            response = await self.client.get(
                "/users",
                params={"page": page, "per_page": per_page},
                auth=self._get_auth()
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch users: {e}")
            return []

    async def get_user(self, user_id: int) -> Optional[Dict[str, Any]]:
        """获取用户信息"""
        try:
            response = await self.client.get(
                f"/users/{user_id}",
                auth=self._get_auth()
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch user {user_id}: {e}")
            return None

    async def search(self, query: str, subtype: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        搜索内容

        Args:
            query: 搜索关键词
            subtype: 内容类型（post, page, 等）
        """
        try:
            params = {
                "search": query,
                "per_page": 20,
                "_embed": True
            }

            if subtype:
                params["type"] = subtype

            response = await self.client.get("/posts", params=params)
            response.raise_for_status()

            results = response.json()
            logger.info(f"Search for '{query}' returned {len(results)} results")
            return results

        except httpx.HTTPError as e:
            logger.error(f"Search failed: {e}")
            return []

    async def health_check(self) -> bool:
        """检查 WordPress API 健康状态"""
        try:
            response = await self.client.get("/")
            response.raise_for_status()
            return True
        except httpx.HTTPError as e:
            logger.error(f"WordPress health check failed: {e}")
            return False

    async def get_site_info(self) -> Dict[str, Any]:
        """获取站点信息"""
        try:
            response = await self.client.get("/")
            response.raise_for_status()

            data = response.json()
            return {
                "name": data.get("name", ""),
                "description": data.get("description", ""),
                "url": data.get("url", ""),
                "home": data.get("home", ""),
                "gmt_offset": data.get("gmt_offset", ""),
                "timezone": data.get("timezone_string", ""),
                "namespaces": data.get("namespaces", []),
            }

        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch site info: {e}")
            return {}


# 创建全局服务实例的辅助函数
async def get_wordpress_service() -> WordPressService:
    """获取 WordPress 服务实例"""
    return WordPressService()


# 使用示例
# async with WordPressService() as wp:
#     posts = await wp.get_posts(page=1, per_page=10)
#     print(posts)
