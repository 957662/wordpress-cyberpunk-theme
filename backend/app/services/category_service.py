"""
Category Service - 分类服务
处理分类相关的业务逻辑
"""
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from app.models.category import Category
from app.models.post import Post
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryStats


class CategoryService:
    """分类服务类"""

    def __init__(self, db: Session):
        self.db = db

    def get_category(self, category_id: int) -> Optional[Category]:
        """获取单个分类"""
        return self.db.query(Category).filter(Category.id == category_id).first()

    def get_category_by_slug(self, slug: str) -> Optional[Category]:
        """通过slug获取分类"""
        return self.db.query(Category).filter(Category.slug == slug).first()

    def get_categories(
        self,
        skip: int = 0,
        limit: int = 100,
        parent_id: Optional[int] = None,
        search: Optional[str] = None,
        include_hidden: bool = False
    ) -> Tuple[List[Category], int]:
        """获取分类列表"""
        query = self.db.query(Category)

        # 父分类过滤
        if parent_id is not None:
            query = query.filter(Category.parent_id == parent_id)

        # 隐藏分类过滤
        if not include_hidden:
            query = query.filter(Category.is_visible == True)

        # 搜索过滤
        if search:
            query = query.filter(
                (Category.name.ilike(f"%{search}%")) |
                (Category.description.ilike(f"%{search}%"))
            )

        # 计数
        total = query.count()

        # 排序和分页
        categories = query.order_by(Category.sort_order, Category.name).offset(skip).limit(limit).all()

        return categories, total

    def get_category_tree(self, include_hidden: bool = False) -> List[dict]:
        """获取分类树"""
        categories = self.db.query(Category).filter(
            Category.parent_id.is_(None)
        )

        if not include_hidden:
            categories = categories.filter(Category.is_visible == True)

        categories = categories.order_by(Category.sort_order, Category.name).all()

        def build_tree(category: Category) -> dict:
            children = self.db.query(Category).filter(
                Category.parent_id == category.id
            )

            if not include_hidden:
                children = children.filter(Category.is_visible == True)

            children = children.order_by(Category.sort_order, Category.name).all()

            return {
                "id": category.id,
                "name": category.name,
                "slug": category.slug,
                "description": category.description,
                "icon": category.icon,
                "color": category.color,
                "sort_order": category.sort_order,
                "is_visible": category.is_visible,
                "children": [build_tree(child) for child in children]
            }

        return [build_tree(cat) for cat in categories]

    def create_category(self, category_data: CategoryCreate) -> Category:
        """创建分类"""
        # 检查分类名是否已存在
        existing = self.db.query(Category).filter(Category.name == category_data.name).first()
        if existing:
            raise ValueError(f"Category '{category_data.name}' already exists")

        # 检查父分类是否存在
        if category_data.parent_id:
            parent = self.get_category(category_data.parent_id)
            if not parent:
                raise ValueError(f"Parent category {category_data.parent_id} not found")

        # 生成slug
        slug = self._generate_slug(category_data.name)

        # 获取下一个排序值
        sort_order = category_data.sort_order or self._get_next_sort_order(category_data.parent_id)

        category = Category(
            name=category_data.name,
            slug=slug,
            description=category_data.description,
            parent_id=category_data.parent_id,
            icon=category_data.icon,
            color=category_data.color,
            sort_order=sort_order,
            is_visible=category_data.is_visible if category_data.is_visible is not None else True
        )

        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)

        return category

    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        """更新分类"""
        category = self.get_category(category_id)
        if not category:
            return None

        # 更新字段
        if category_data.name is not None:
            # 检查新名称是否与其他分类冲突
            existing = self.db.query(Category).filter(
                Category.name == category_data.name,
                Category.id != category_id
            ).first()
            if existing:
                raise ValueError(f"Category '{category_data.name}' already exists")
            category.name = category_data.name
            category.slug = self._generate_slug(category_data.name)

        if category_data.description is not None:
            category.description = category_data.description

        if category_data.parent_id is not None:
            # 检查是否设置自己为父分类
            if category_data.parent_id == category_id:
                raise ValueError("Cannot set category as its own parent")

            # 检查父分类是否存在
            if category_data.parent_id:
                parent = self.get_category(category_data.parent_id)
                if not parent:
                    raise ValueError(f"Parent category {category_data.parent_id} not found")

            category.parent_id = category_data.parent_id

        if category_data.icon is not None:
            category.icon = category_data.icon

        if category_data.color is not None:
            category.color = category_data.color

        if category_data.sort_order is not None:
            category.sort_order = category_data.sort_order

        if category_data.is_visible is not None:
            category.is_visible = category_data.is_visible

        category.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(category)

        return category

    def delete_category(self, category_id: int, move_to_id: Optional[int] = None) -> bool:
        """删除分类"""
        category = self.get_category(category_id)
        if not category:
            return False

        # 检查是否有子分类
        has_children = self.db.query(Category).filter(
            Category.parent_id == category_id
        ).first()

        if has_children:
            if move_to_id:
                # 将子分类移动到指定分类
                self.db.query(Category).filter(
                    Category.parent_id == category_id
                ).update({"parent_id": move_to_id})
            else:
                raise ValueError("Cannot delete category with children. Specify move_to_id or move children first.")

        # 处理该分类下的文章
        if move_to_id:
            # 将文章移动到指定分类
            self.db.query(Post).filter(
                Post.category_id == category_id
            ).update({"category_id": move_to_id})
        else:
            # 将文章分类设置为NULL
            self.db.query(Post).filter(
                Post.category_id == category_id
            ).update({"category_id": None})

        # 删除分类
        self.db.delete(category)
        self.db.commit()

        return True

    def get_category_stats(self, category_id: int) -> Optional[CategoryStats]:
        """获取分类统计信息"""
        category = self.get_category(category_id)
        if not category:
            return None

        # 文章总数
        posts_count = self.db.query(func.count(Post.id)).filter(
            Post.category_id == category_id
        ).scalar() or 0

        # 已发布文章数
        published_count = self.db.query(func.count(Post.id)).filter(
            Post.category_id == category_id,
            Post.status == "published"
        ).scalar() or 0

        # 最近30天文章数
        since = datetime.utcnow() - timedelta(days=30)
        recent_count = self.db.query(func.count(Post.id)).filter(
            Post.category_id == category_id,
            Post.published_at >= since
        ).scalar() or 0

        # 子分类数
        children_count = self.db.query(func.count(Category.id)).filter(
            Category.parent_id == category_id
        ).scalar() or 0

        return CategoryStats(
            category_id=category.id,
            posts_count=posts_count,
            published_count=published_count,
            recent_count=recent_count,
            children_count=children_count
        )

    def get_popular_categories(self, limit: int = 10, days: int = 30) -> List[Category]:
        """获取热门分类"""
        since = datetime.utcnow() - timedelta(days=days)

        categories = self.db.query(Category).join(
            Post
        ).filter(
            Post.status == "published",
            Post.published_at >= since,
            Category.is_visible == True
        ).group_by(
            Category.id
        ).order_by(
            desc(func.count(Post.id))
        ).limit(limit).all()

        return categories

    def get_breadcrumb(self, category_id: int) -> List[Category]:
        """获取分类面包屑导航"""
        breadcrumb = []
        current = self.get_category(category_id)

        while current:
            breadcrumb.insert(0, current)
            if current.parent_id:
                current = self.get_category(current.parent_id)
            else:
                break

        return breadcrumb

    def _generate_slug(self, name: str) -> str:
        """生成URL友好的slug"""
        slug = name.lower().strip()
        slug = "-".join(c for c in slug if c.isalnum() or c in (" ", "-"))
        slug = slug.replace(" ", "-")

        # 确保slug唯一
        counter = 1
        original_slug = slug
        while self.db.query(Category).filter(Category.slug == slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1

        return slug

    def _get_next_sort_order(self, parent_id: Optional[int]) -> int:
        """获取下一个排序值"""
        max_order = self.db.query(func.max(Category.sort_order)).filter(
            Category.parent_id == parent_id
        ).scalar()

        return (max_order or 0) + 10

    def reorder_categories(self, category_ids: List[int]) -> bool:
        """重新排序分类"""
        try:
            for index, category_id in enumerate(category_ids):
                category = self.get_category(category_id)
                if category:
                    category.sort_order = (index + 1) * 10

            self.db.commit()
            return True
        except Exception:
            self.db.rollback()
            return False

    def get_or_create_category(self, name: str, parent_id: Optional[int] = None) -> Category:
        """获取或创建分类（用于导入等场景）"""
        category = self.db.query(Category).filter(Category.name == name).first()
        if category:
            return category

        slug = self._generate_slug(name)
        sort_order = self._get_next_sort_order(parent_id)

        category = Category(
            name=name,
            slug=slug,
            parent_id=parent_id,
            sort_order=sort_order
        )
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)

        return category
