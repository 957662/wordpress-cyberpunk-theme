"""
搜索服务

提供全文搜索和智能搜索功能
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func, desc
from app.models.post import Post
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag
import re


class SearchService:
    """搜索服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def search(
        self,
        query: str,
        search_type: str = 'all',
        limit: int = 20,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        执行搜索
        
        Args:
            query: 搜索关键词
            search_type: 搜索类型 (all, posts, users, tags, categories)
            limit: 返回数量
            offset: 偏移量
            filters: 额外过滤条件
        
        Returns:
            搜索结果字典
        """
        if not query or len(query.strip()) < 2:
            return {
                'query': query,
                'total': 0,
                'results': []
            }
        
        # 清理查询
        clean_query = self._clean_query(query)
        
        # 根据类型执行搜索
        if search_type == 'posts':
            results = await self._search_posts(clean_query, limit, offset, filters)
        elif search_type == 'users':
            results = await self._search_users(clean_query, limit, offset)
        elif search_type == 'tags':
            results = await self._search_tags(clean_query, limit, offset)
        elif search_type == 'categories':
            results = await self._search_categories(clean_query, limit, offset)
        else:  # all
            results = await self._search_all(clean_query, limit, offset, filters)
        
        return {
            'query': query,
            'total': results['total'],
            'results': results['items'],
            'facets': results.get('facets', {})
        }
    
    def _clean_query(self, query: str) -> str:
        """清理搜索查询"""
        # 去除特殊字符
        query = re.sub(r'[^\w\s\u4e00-\u9fff]', ' ', query)
        # 去除多余空格
        query = ' '.join(query.split())
        return query
    
    async def _search_all(
        self,
        query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """搜索所有类型"""
        # 分配配额
        posts_limit = max(5, limit // 2)
        users_limit = max(3, limit // 4)
        tags_limit = max(2, limit // 8)
        categories_limit = limit - posts_limit - users_limit - tags_limit
        
        results = {
            'items': [],
            'total': 0,
            'facets': {}
        }
        
        # 搜索文章
        posts_results = await self._search_posts(
            query, posts_limit, 0, filters
        )
        for post in posts_results['items']:
            post['type'] = 'post'
            results['items'].append(post)
        
        # 搜索用户
        users_results = await self._search_users(query, users_limit, 0)
        for user in users_results['items']:
            user['type'] = 'user'
            results['items'].append(user)
        
        # 搜索标签
        tags_results = await self._search_tags(query, tags_limit, 0)
        for tag in tags_results['items']:
            tag['type'] = 'tag'
            results['items'].append(tag)
        
        # 搜索分类
        categories_results = await self._search_categories(query, categories_limit, 0)
        for category in categories_results['items']:
            category['type'] = 'category'
            results['items'].append(category)
        
        # 计算总数
        results['total'] = (
            posts_results['total'] +
            users_results['total'] +
            tags_results['total'] +
            categories_results['total']
        )
        
        # 构建分面
        results['facets'] = {
            'posts': posts_results['total'],
            'users': users_results['total'],
            'tags': tags_results['total'],
            'categories': categories_results['total']
        }
        
        return results
    
    async def _search_posts(
        self,
        query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """搜索文章"""
        # 构建基础查询
        search_pattern = f'%{query}%'
        
        query_builder = self.db.query(Post).filter(
            and_(
                Post.published == True,
                or_(
                    Post.title.ilike(search_pattern),
                    Post.excerpt.ilike(search_pattern),
                    Post.content.ilike(search_pattern)
                )
            )
        )
        
        # 应用过滤器
        if filters:
            if 'category_id' in filters:
                query_builder = query_builder.filter(
                    Post.category_id == filters['category_id']
                )
            
            if 'tag_ids' in filters:
                query_builder = query_builder.filter(
                    Post.tags.any(Tag.id.in_(filters['tag_ids']))
                )
            
            if 'author_id' in filters:
                query_builder = query_builder.filter(
                    Post.author_id == filters['author_id']
                )
            
            if 'date_from' in filters:
                query_builder = query_builder.filter(
                    Post.published_at >= filters['date_from']
                )
            
            if 'date_to' in filters:
                query_builder = query_builder.filter(
                    Post.published_at <= filters['date_to']
                )
        
        # 获取总数
        total = query_builder.count()
        
        # 分页并获取结果
        posts = query_builder.order_by(
            desc(Post.created_at)
        ).limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'items': [self._post_to_dict(post, query) for post in posts]
        }
    
    async def _search_users(
        self,
        query: str,
        limit: int,
        offset: int
    ) -> Dict[str, Any]:
        """搜索用户"""
        search_pattern = f'%{query}%'
        
        query_builder = self.db.query(User).filter(
            or_(
                User.name.ilike(search_pattern),
                User.username.ilike(search_pattern),
                User.bio.ilike(search_pattern)
            )
        )
        
        total = query_builder.count()
        users = query_builder.limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'items': [self._user_to_dict(user) for user in users]
        }
    
    async def _search_tags(
        self,
        query: str,
        limit: int,
        offset: int
    ) -> Dict[str, Any]:
        """搜索标签"""
        search_pattern = f'%{query}%'
        
        query_builder = self.db.query(Tag).filter(
            Tag.name.ilike(search_pattern)
        )
        
        total = query_builder.count()
        tags = query_builder.order_by(
            desc(func.count(Post.id))
        ).limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'items': [self._tag_to_dict(tag) for tag in tags]
        }
    
    async def _search_categories(
        self,
        query: str,
        limit: int,
        offset: int
    ) -> Dict[str, Any]:
        """搜索分类"""
        search_pattern = f'%{query}%'
        
        query_builder = self.db.query(Category).filter(
            or_(
                Category.name.ilike(search_pattern),
                Category.description.ilike(search_pattern)
            )
        )
        
        total = query_builder.count()
        categories = query_builder.limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'items': [self._category_to_dict(cat) for cat in categories]
        }
    
    def _post_to_dict(self, post: Post, query: str) -> Dict[str, Any]:
        """转换文章为字典"""
        # 生成摘要（高亮关键词）
        excerpt = self._highlight_keywords(post.excerpt or '', query)
        
        return {
            'id': post.id,
            'type': 'post',
            'title': post.title,
            'slug': post.slug,
            'excerpt': excerpt,
            'cover_image': post.cover_image,
            'category': post.category.name if post.category else None,
            'tags': [tag.name for tag in post.tags],
            'reading_time': post.reading_time,
            'published_at': post.published_at.isoformat() if post.published_at else None,
            'author': {
                'id': post.author.id,
                'name': post.author.name,
                'username': post.author.username,
            },
            'metrics': {
                'views': post.views_count,
                'likes': post.likes_count,
                'comments': post.comments_count,
            }
        }
    
    def _user_to_dict(self, user: User) -> Dict[str, Any]:
        """转换用户为字典"""
        return {
            'id': user.id,
            'type': 'user',
            'name': user.name,
            'username': user.username,
            'avatar': user.avatar,
            'bio': user.bio,
            'location': user.location,
            'website': user.website,
            'metrics': {
                'followers': user.followers_count,
                'following': user.following_count,
                'posts': user.posts_count,
            }
        }
    
    def _tag_to_dict(self, tag: Tag) -> Dict[str, Any]:
        """转换标签为字典"""
        return {
            'id': tag.id,
            'type': 'tag',
            'name': tag.name,
            'slug': tag.slug,
            'description': tag.description,
            'posts_count': tag.posts_count,
        }
    
    def _category_to_dict(self, category: Category) -> Dict[str, Any]:
        """转换分类为字典"""
        return {
            'id': category.id,
            'type': 'category',
            'name': category.name,
            'slug': category.slug,
            'description': category.description,
            'posts_count': category.posts_count,
        }
    
    def _highlight_keywords(self, text: str, query: str) -> str:
        """高亮关键词"""
        if not query:
            return text
        
        # 简单的关键词高亮
        words = query.split()
        for word in words:
            pattern = re.compile(f'({re.escape(word)})', re.IGNORECASE)
            text = pattern.sub(r'<mark>\1</mark>', text)
        
        return text
    
    async def get_suggestions(
        self,
        query: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        获取搜索建议
        
        Args:
            query: 搜索关键词
            limit: 返回数量
        
        Returns:
            建议列表
        """
        if not query or len(query) < 2:
            return []
        
        suggestions = []
        
        # 获取热门搜索（这里应该从缓存或数据库获取）
        trending = await self._get_trending_searches()
        
        # 过滤匹配的建议
        for term in trending:
            if query.lower() in term.lower():
                suggestions.append({
                    'type': 'trending',
                    'text': term,
                    'icon': 'trending-up'
                })
        
        # 获取匹配的标签
        tags = self.db.query(Tag).filter(
            Tag.name.ilike(f'%{query}%')
        ).limit(5).all()
        
        for tag in tags:
            suggestions.append({
                'type': 'tag',
                'text': tag.name,
                'icon': 'tag'
            })
        
        # 获取匹配的用户
        users = self.db.query(User).filter(
            or_(
                User.name.ilike(f'%{query}%'),
                User.username.ilike(f'%{query}%')
            )
        ).limit(3).all()
        
        for user in users:
            suggestions.append({
                'type': 'user',
                'text': user.name,
                'username': user.username,
                'icon': 'user'
            })
        
        return suggestions[:limit]
    
    async def _get_trending_searches(self) -> List[str]:
        """获取热门搜索"""
        # 这里应该从实际的搜索历史或缓存中获取
        # 暂时返回静态数据
        return [
            'Next.js 14',
            'TypeScript',
            'React Server Components',
            'Tailwind CSS',
            'FastAPI',
            'PostgreSQL',
            'Docker',
            'Git'
        ]
    
    async def log_search(
        self,
        query: str,
        user_id: Optional[str] = None,
        results_count: int = 0
    ):
        """
        记录搜索历史
        
        Args:
            query: 搜索关键词
            user_id: 用户ID
            results_count: 结果数量
        """
        # 这里应该将搜索记录保存到数据库
        # 用于分析和优化搜索体验
        pass
