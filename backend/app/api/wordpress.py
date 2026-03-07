"""
WordPress Proxy API
代理 WordPress REST API，提供统一的数据接口和缓存
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List, Any, Dict
from httpx import AsyncClient, TimeoutException
import json
from functools import lru_cache

from ..core.config import settings

router = APIRouter(prefix="/wordpress", tags=["WordPress Proxy"])


class WordPressProxy:
    """WordPress API 代理客户端"""

    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.api_base = f"{self.base_url}/wp-json/wp/v2"
        self.timeout = 30.0

    async def _request(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None
    ) -> Any:
        """发送请求到 WordPress API"""
        url = f"{self.api_base}/{endpoint.lstrip('/')}"

        try:
            async with AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()

                # 解析响应头获取分页信息
                result = response.json()
                if isinstance(result, list):
                    total = response.headers.get('x-wp-total', '0')
                    total_pages = response.headers.get('x-wp-totalpages', '0')
                    return {
                        "data": result,
                        "total": int(total),
                        "total_pages": int(total_pages),
                    }
                return {"data": result}

        except TimeoutException:
            raise HTTPException(status_code=504, detail="WordPress API timeout")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"WordPress API error: {str(e)}")


@lru_cache()
def get_wp_proxy():
    """获取 WordPress 代理实例（单例）"""
    wp_url = getattr(settings, 'WORDPRESS_URL', 'https://demo.wp-api.org')
    return WordPressProxy(wp_url)


@router.get("/posts")
async def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[int] = Query(None, description="Filter by category ID"),
    tag: Optional[int] = Query(None, description="Filter by tag ID"),
    author: Optional[int] = Query(None, description="Filter by author ID"),
    search: Optional[str] = Query(None, description="Search term"),
    orderby: str = Query("date", description="Order by field"),
    order: str = Query("desc", regex="^(asc|desc)$", description="Order direction"),
    sticky: Optional[bool] = Query(None, description="Filter sticky posts"),
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取文章列表

    通过代理获取 WordPress 文章数据，支持多种过滤和排序选项。
    """
    params = {
        "page": page,
        "per_page": per_page,
        "orderby": orderby,
        "order": order,
        "_embed": True,  # 包含关联数据（作者、分类、特色图片等）
    }

    if category is not None:
        params["categories"] = category
    if tag is not None:
        params["tags"] = tag
    if author is not None:
        params["author"] = author
    if search:
        params["search"] = search
    if sticky is not None:
        params["sticky"] = sticky

    result = await wp_proxy._request("/posts", params)
    return result


@router.get("/posts/{post_id}")
async def get_post(
    post_id: int,
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取单个文章

    根据 ID 获取文章详情，包含完整的关联数据。
    """
    params = {"_embed": True}
    result = await wp_proxy._request(f"/posts/{post_id}", params)
    return result


@router.get("/posts/slug/{slug}")
async def get_post_by_slug(
    slug: str,
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    根据 slug 获取文章

    通过文章 slug 获取文章详情。
    """
    params = {"slug": slug, "_embed": True}
    result = await wp_proxy._request("/posts", params)

    if not result["data"]:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"data": result["data"][0]}


@router.get("/categories")
async def get_categories(
    page: int = Query(1, ge=1),
    per_page: int = Query(100, ge=1, le=100),
    hide_empty: bool = Query(False),
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取分类列表

    获取 WordPress 的所有分类。
    """
    params = {
        "page": page,
        "per_page": per_page,
        "hide_empty": hide_empty,
    }

    result = await wp_proxy._request("/categories", params)
    return result


@router.get("/categories/{category_id}")
async def get_category(
    category_id: int,
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """获取单个分类"""
    result = await wp_proxy._request(f"/categories/{category_id}")
    return result


@router.get("/tags")
async def get_tags(
    page: int = Query(1, ge=1),
    per_page: int = Query(100, ge=1, le=100),
    hide_empty: bool = Query(False),
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取标签列表

    获取 WordPress 的所有标签。
    """
    params = {
        "page": page,
        "per_page": per_page,
        "hide_empty": hide_empty,
    }

    result = await wp_proxy._request("/tags", params)
    return result


@router.get("/tags/{tag_id}")
async def get_tag(
    tag_id: int,
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """获取单个标签"""
    result = await wp_proxy._request(f"/tags/{tag_id}")
    return result


@router.get("/authors")
async def get_authors(
    page: int = Query(1, ge=1),
    per_page: int = Query(100, ge=1, le=100),
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取作者列表

    获取 WordPress 的所有作者（用户）。
    """
    params = {
        "page": page,
        "per_page": per_page,
    }

    result = await wp_proxy._request("/users", params)
    return result


@router.get("/authors/{author_id}")
async def get_author(
    author_id: int,
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """获取单个作者"""
    result = await wp_proxy._request(f"/users/{author_id}")
    return result


@router.get("/media/{media_id}")
async def get_media(
    media_id: int,
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取媒体文件信息

    获取图片等媒体文件的详细信息。
    """
    result = await wp_proxy._request(f"/media/{media_id}")
    return result


@router.get("/search")
async def search_content(
    query: str = Query(..., min_length=2, description="搜索关键词"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    subtype: Optional[List[str]] = Query(None, description="内容类型过滤"),
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    搜索内容

    在 WordPress 中搜索文章、页面等内容。
    """
    params = {
        "search": query,
        "page": page,
        "per_page": per_page,
    }

    if subtype:
        params["type"] = subtype

    result = await wp_proxy._request("/search", params)
    return result


@router.get("/stats")
async def get_wordpress_stats(
    wp_proxy: WordPressProxy = Depends(get_wp_proxy),
):
    """
    获取 WordPress 统计信息

    返回文章总数、分类总数、标签总数等统计信息。
    """
    try:
        # 并发请求多个统计数据
        async with AsyncClient(timeout=30.0) as client:
            posts_resp = await client.get(f"{wp_proxy.api_base}/posts", params={"per_page": 1})
            categories_resp = await client.get(f"{wp_proxy.api_base}/categories", params={"per_page": 1})
            tags_resp = await client.get(f"{wp_proxy.api_base}/tags", params={"per_page": 1})
            users_resp = await client.get(f"{wp_proxy.api_base}/users", params={"per_page": 1})

            return {
                "total_posts": int(posts_resp.headers.get('x-wp-total', 0)),
                "total_categories": int(categories_resp.headers.get('x-wp-total', 0)),
                "total_tags": int(tags_resp.headers.get('x-wp-total', 0)),
                "total_authors": int(users_resp.headers.get('x-wp-total', 0)),
            }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch stats: {str(e)}")


@router.post("/cache/clear")
async def clear_cache(wp_proxy: WordPressProxy = Depends(get_wp_proxy)):
    """
    清除缓存

    清除 WordPress 代理的所有缓存数据。
    """
    get_wp_proxy.cache_clear()
    return {"message": "Cache cleared successfully"}
