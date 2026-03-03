"""
作品集服务 - Portfolio Service
处理作品集相关的业务逻辑
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc, func
from datetime import datetime

from app.models.portfolio import Portfolio
from app.models.media import Media
from app.models.user import User
from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioUpdate,
    PortfolioResponse,
    PortfolioListResponse
)
from app.services.cache_service import CacheService


class PortfolioService:
    """作品集服务类"""

    def __init__(self, db: Session):
        self.db = db
        self.cache = CacheService()

    async def create_portfolio(
        self,
        portfolio_data: PortfolioCreate,
        author_id: int
    ) -> PortfolioResponse:
        """
        创建作品集

        Args:
            portfolio_data: 作品集创建数据
            author_id: 作者ID

        Returns:
            PortfolioResponse: 创建的作品集
        """
        # 生成 slug
        slug = self._generate_slug(portfolio_data.title)

        # 创建作品集实例
        portfolio = Portfolio(
            author_id=author_id,
            title=portfolio_data.title,
            slug=slug,
            description=portfolio_data.description,
            content=portfolio_data.content,
            featured_image=portfolio_data.featured_image,
            status=portfolio_data.status,
            technologies=portfolio_data.technologies,
            links=portfolio_data.links,
            start_date=portfolio_data.start_date,
            end_date=portfolio_data.end_date,
            sort_order=portfolio_data.sort_order or 0,
        )

        self.db.add(portfolio)
        self.db.commit()
        self.db.refresh(portfolio)

        # 关联标签
        if portfolio_data.tags:
            await self._associate_tags(portfolio.id, portfolio_data.tags)

        # 关联媒体
        if portfolio_data.media_ids:
            await self._associate_media(portfolio.id, portfolio_data.media_ids)

        # 清除缓存
        await self.cache.clear_pattern("portfolios:*")

        return PortfolioResponse.from_orm(portfolio)

    async def get_portfolio(
        self,
        portfolio_id: int
    ) -> Optional[PortfolioResponse]:
        """
        获取作品集详情

        Args:
            portfolio_id: 作品集ID

        Returns:
            PortfolioResponse: 作品集详情或 None
        """
        # 尝试从缓存获取
        cache_key = f"portfolio:{portfolio_id}"
        cached = await self.cache.get(cache_key)
        if cached:
            return PortfolioResponse(**cached)

        # 从数据库查询
        portfolio = self.db.query(Portfolio).filter(
            Portfolio.id == portfolio_id
        ).first()

        if not portfolio:
            return None

        # 增加浏览量
        await self._increment_views(portfolio_id)

        # 缓存结果
        response = PortfolioResponse.from_orm(portfolio)
        await self.cache.set(cache_key, response.dict(), expire=3600)

        return response

    async def get_portfolio_by_slug(
        self,
        slug: str
    ) -> Optional[PortfolioResponse]:
        """
        根据 slug 获取作品集

        Args:
            slug: 作品集 slug

        Returns:
            PortfolioResponse: 作品集详情或 None
        """
        portfolio = self.db.query(Portfolio).filter(
            Portfolio.slug == slug
        ).first()

        if not portfolio:
            return None

        return PortfolioResponse.from_orm(portfolio)

    async def list_portfolios(
        self,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None,
        author_id: Optional[int] = None,
        technology: Optional[str] = None,
        sort_by: str = "created_at",
        order: str = "desc"
    ) -> PortfolioListResponse:
        """
        获取作品集列表

        Args:
            skip: 跳过数量
            limit: 返回数量
            status: 状态筛选
            author_id: 作者ID筛选
            technology: 技术栈筛选
            sort_by: 排序字段
            order: 排序方向

        Returns:
            PortfolioListResponse: 作品集列表
        """
        # 构建查询
        query = self.db.query(Portfolio)

        # 应用筛选条件
        if status:
            query = query.filter(Portfolio.status == status)

        if author_id:
            query = query.filter(Portfolio.author_id == author_id)

        if technology:
            # JSON 数组包含查询
            query = query.filter(
                Portfolio.technologies.contains([technology])
            )

        # 排序
        order_func = desc if order == "desc" else asc
        if hasattr(Portfolio, sort_by):
            query = query.order_by(order_func(getattr(Portfolio, sort_by)))

        # 总数统计
        total = query.count()

        # 分页
        portfolios = query.offset(skip).limit(limit).all()

        return PortfolioListResponse(
            portfolios=[PortfolioResponse.from_orm(p) for p in portfolios],
            total=total,
            skip=skip,
            limit=limit
        )

    async def update_portfolio(
        self,
        portfolio_id: int,
        portfolio_data: PortfolioUpdate,
        user_id: int
    ) -> Optional[PortfolioResponse]:
        """
        更新作品集

        Args:
            portfolio_id: 作品集ID
            portfolio_data: 更新数据
            user_id: 操作用户ID

        Returns:
            PortfolioResponse: 更新后的作品集或 None
        """
        portfolio = self.db.query(Portfolio).filter(
            Portfolio.id == portfolio_id
        ).first()

        if not portfolio:
            return None

        # 权限检查
        if portfolio.author_id != user_id:
            raise PermissionError("无权限修改此作品集")

        # 更新字段
        update_data = portfolio_data.dict(exclude_unset=True)

        # 重新生成 slug（如果标题变更）
        if "title" in update_data:
            update_data["slug"] = self._generate_slug(update_data["title"])

        for field, value in update_data.items():
            setattr(portfolio, field, value)

        portfolio.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(portfolio)

        # 清除缓存
        await self.cache.delete(f"portfolio:{portfolio_id}")
        await self.cache.clear_pattern("portfolios:*")

        return PortfolioResponse.from_orm(portfolio)

    async def delete_portfolio(
        self,
        portfolio_id: int,
        user_id: int
    ) -> bool:
        """
        删除作品集

        Args:
            portfolio_id: 作品集ID
            user_id: 操作用户ID

        Returns:
            bool: 是否删除成功
        """
        portfolio = self.db.query(Portfolio).filter(
            Portfolio.id == portfolio_id
        ).first()

        if not portfolio:
            return False

        # 权限检查
        if portfolio.author_id != user_id:
            raise PermissionError("无权限删除此作品集")

        self.db.delete(portfolio)
        self.db.commit()

        # 清除缓存
        await self.cache.delete(f"portfolio:{portfolio_id}")
        await self.cache.clear_pattern("portfolios:*")

        return True

    async def search_portfolios(
        self,
        query: str,
        skip: int = 0,
        limit: int = 20
    ) -> PortfolioListResponse:
        """
        搜索作品集

        Args:
            query: 搜索关键词
            skip: 跳过数量
            limit: 返回数量

        Returns:
            PortfolioListResponse: 搜索结果
        """
        # 全文搜索
        search_query = self.db.query(Portfolio).filter(
            or_(
                Portfolio.title.ilike(f"%{query}%"),
                Portfolio.description.ilike(f"%{query}%"),
                Portfolio.content.ilike(f"%{query}%"),
                Portfolio.technologies.contains([query])
            )
        )

        total = search_query.count()
        portfolios = search_query.offset(skip).limit(limit).all()

        return PortfolioListResponse(
            portfolios=[PortfolioResponse.from_orm(p) for p in portfolios],
            total=total,
            skip=skip,
            limit=limit
        )

    async def get_featured_portfolios(
        self,
        limit: int = 6
    ) -> List[PortfolioResponse]:
        """
        获取精选作品集

        Args:
            limit: 返回数量

        Returns:
            List[PortfolioResponse]: 精选作品集列表
        """
        cache_key = f"portfolios:featured:{limit}"

        # 尝试从缓存获取
        cached = await self.cache.get(cache_key)
        if cached:
            return [PortfolioResponse(**item) for item in cached]

        # 从数据库查询
        portfolios = self.db.query(Portfolio).filter(
            and_(
                Portfolio.status == "completed",
                Portfolio.featured_image.isnot(None)
            )
        ).order_by(desc(Portfolio.sort_order)).limit(limit).all()

        result = [PortfolioResponse.from_orm(p) for p in portfolios]

        # 缓存结果
        await self.cache.set(
            cache_key,
            [p.dict() for p in result],
            expire=7200
        )

        return result

    async def get_portfolios_by_author(
        self,
        author_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> PortfolioListResponse:
        """
        获取作者的作品集

        Args:
            author_id: 作者ID
            skip: 跳过数量
            limit: 返回数量

        Returns:
            PortfolioListResponse: 作品集列表
        """
        query = self.db.query(Portfolio).filter(
            Portfolio.author_id == author_id
        )

        total = query.count()
        portfolios = query.order_by(
            desc(Portfolio.created_at)
        ).offset(skip).limit(limit).all()

        return PortfolioListResponse(
            portfolios=[PortfolioResponse.from_orm(p) for p in portfolios],
            total=total,
            skip=skip,
            limit=limit
        )

    async def get_related_portfolios(
        self,
        portfolio_id: int,
        limit: int = 4
    ) -> List[PortfolioResponse]:
        """
        获取相关作品集

        Args:
            portfolio_id: 作品集ID
            limit: 返回数量

        Returns:
            List[PortfolioResponse]: 相关作品集列表
        """
        portfolio = self.db.query(Portfolio).filter(
            Portfolio.id == portfolio_id
        ).first()

        if not portfolio:
            return []

        # 基于技术栈查找相关作品
        related = self.db.query(Portfolio).filter(
            and_(
                Portfolio.id != portfolio_id,
                Portfolio.technologies.overlap(portfolio.technologies)
            )
        ).limit(limit).all()

        return [PortfolioResponse.from_orm(p) for p in related]

    # 私有辅助方法

    def _generate_slug(self, title: str) -> str:
        """
        生成 slug

        Args:
            title: 标题

        Returns:
            str: 生成的 slug
        """
        from app.utils.slug import generate_slug
        return generate_slug(title)

    async def _associate_tags(
        self,
        portfolio_id: int,
        tag_ids: List[int]
    ) -> None:
        """
        关联标签到作品集

        Args:
            portfolio_id: 作品集ID
            tag_ids: 标签ID列表
        """
        from app.models.portfolio import PortfolioTag

        # 删除现有关联
        self.db.query(PortfolioTag).filter(
            PortfolioTag.portfolio_id == portfolio_id
        ).delete()

        # 创建新关联
        for tag_id in tag_ids:
            association = PortfolioTag(
                portfolio_id=portfolio_id,
                tag_id=tag_id
            )
            self.db.add(association)

        self.db.commit()

    async def _associate_media(
        self,
        portfolio_id: int,
        media_ids: List[int]
    ) -> None:
        """
        关联媒体到作品集

        Args:
            portfolio_id: 作品集ID
            media_ids: 媒体ID列表
        """
        from app.models.portfolio import PortfolioMedia

        # 删除现有关联
        self.db.query(PortfolioMedia).filter(
            PortfolioMedia.portfolio_id == portfolio_id
        ).delete()

        # 创建新关联
        for index, media_id in enumerate(media_ids):
            association = PortfolioMedia(
                portfolio_id=portfolio_id,
                media_id=media_id,
                sort_order=index
            )
            self.db.add(association)

        self.db.commit()

    async def _increment_views(self, portfolio_id: int) -> None:
        """
        增加作品集浏览量

        Args:
            portfolio_id: 作品集ID
        """
        # 这里可以使用异步任务来避免阻塞
        # 简化实现：直接更新数据库
        self.db.query(Portfolio).filter(
            Portfolio.id == portfolio_id
        ).update({
            "view_count": Portfolio.view_count + 1
        })
        self.db.commit()
