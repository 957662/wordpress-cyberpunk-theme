"""
查询构建器
CyberPress Platform

提供链式调用API来构建复杂的SQL查询
"""

from typing import Any, Dict, List, Optional, Tuple, Union
from enum import Enum


class JoinType(Enum):
    """连接类型"""
    INNER = "INNER JOIN"
    LEFT = "LEFT JOIN"
    RIGHT = "RIGHT JOIN"
    FULL = "FULL JOIN"


class OrderDirection(Enum):
    """排序方向"""
    ASC = "ASC"
    DESC = "DESC"


class QueryBuilder:
    """SQL查询构建器"""

    def __init__(self, table: str):
        """
        初始化查询构建器

        Args:
            table: 表名
        """
        self.table = table
        self._select: List[str] = ["*"]
        self._joins: List[Tuple[str, JoinType, str]] = []
        self._where: List[str] = []
        self._group_by: List[str] = []
        self._having: List[str] = []
        self._order_by: List[Tuple[str, OrderDirection]] = []
        self._limit: Optional[int] = None
        self._offset: Optional[int] = None
        self._params: List[Any] = []
        self._distinct: bool = False

    def select(self, *columns: str) -> "QueryBuilder":
        """
        设置查询字段

        Args:
            *columns: 字段名列表

        Returns:
            查询构建器实例
        """
        if columns:
            self._select = list(columns)
        return self

    def distinct(self) -> "QueryBuilder":
        """
        设置去重

        Returns:
            查询构建器实例
        """
        self._distinct = True
        return self

    def join(
        self, table: str, on: str, join_type: JoinType = JoinType.INNER
    ) -> "QueryBuilder":
        """
        添加连接

        Args:
            table: 连接表名
            on: 连接条件
            join_type: 连接类型

        Returns:
            查询构建器实例
        """
        self._joins.append((table, join_type, on))
        return self

    def inner_join(self, table: str, on: str) -> "QueryBuilder":
        """添加内连接"""
        return self.join(table, on, JoinType.INNER)

    def left_join(self, table: str, on: str) -> "QueryBuilder":
        """添加左连接"""
        return self.join(table, on, JoinType.LEFT)

    def right_join(self, table: str, on: str) -> "QueryBuilder":
        """添加右连接"""
        return self.join(table, on, JoinType.RIGHT)

    def full_join(self, table: str, on: str) -> "QueryBuilder":
        """添加全连接"""
        return self.join(table, on, JoinType.FULL)

    def where(self, condition: str, *params: Any) -> "QueryBuilder":
        """
        添加WHERE条件

        Args:
            condition: 条件表达式(使用占位符%s)
            *params: 参数值

        Returns:
            查询构建器实例

        Example:
            builder.where("age > %s AND status = %s", 18, "active")
        """
        if self._where:
            self._where.append("AND")
        self._where.append(f"({condition})")
        self._params.extend(params)
        return self

    def or_where(self, condition: str, *params: Any) -> "QueryBuilder":
        """
        添加OR WHERE条件

        Args:
            condition: 条件表达式
            *params: 参数值

        Returns:
            查询构建器实例
        """
        if self._where:
            self._where.append("OR")
        self._where.append(f"({condition})")
        self._params.extend(params)
        return self

    def where_in(self, column: str, values: List[Any]) -> "QueryBuilder":
        """
        添加IN条件

        Args:
            column: 列名
            values: 值列表

        Returns:
            查询构建器实例
        """
        if not values:
            return self.where("1 = 0")
        placeholders = ", ".join(["%s"] * len(values))
        return self.where(f"{column} IN ({placeholders})", *values)

    def where_not_in(self, column: str, values: List[Any]) -> "QueryBuilder":
        """
        添加NOT IN条件

        Args:
            column: 列名
            values: 值列表

        Returns:
            查询构建器实例
        """
        if not values:
            return self
        placeholders = ", ".join(["%s"] * len(values))
        return self.where(f"{column} NOT IN ({placeholders})", *values)

    def where_between(self, column: str, start: Any, end: Any) -> "QueryBuilder":
        """
        添加BETWEEN条件

        Args:
            column: 列名
            start: 起始值
            end: 结束值

        Returns:
            查询构建器实例
        """
        return self.where(f"{column} BETWEEN %s AND %s", start, end)

    def where_null(self, column: str) -> "QueryBuilder":
        """
        添加IS NULL条件

        Args:
            column: 列名

        Returns:
            查询构建器实例
        """
        return self.where(f"{column} IS NULL")

    def where_not_null(self, column: str) -> "QueryBuilder":
        """
        添加IS NOT NULL条件

        Args:
            column: 列名

        Returns:
            查询构建器实例
        """
        return self.where(f"{column} IS NOT NULL")

    def where_like(self, column: str, pattern: str) -> "QueryBuilder":
        """
        添加LIKE条件

        Args:
            column: 列名
            pattern: 匹配模式(支持%)

        Returns:
            查询构建器实例

        Example:
            builder.where_like("name", "%John%")
        """
        return self.where(f"{column} LIKE %s", pattern)

    def group_by(self, *columns: str) -> "QueryBuilder":
        """
        添加GROUP BY

        Args:
            *columns: 分组字段

        Returns:
            查询构建器实例
        """
        self._group_by.extend(columns)
        return self

    def having(self, condition: str, *params: Any) -> "QueryBuilder":
        """
        添加HAVING条件

        Args:
            condition: 条件表达式
            *params: 参数值

        Returns:
            查询构建器实例
        """
        self._having.append(f"({condition})")
        self._params.extend(params)
        return self

    def order_by(
        self, column: str, direction: OrderDirection = OrderDirection.ASC
    ) -> "QueryBuilder":
        """
        添加排序

        Args:
            column: 排序字段
            direction: 排序方向

        Returns:
            查询构建器实例
        """
        self._order_by.append((column, direction))
        return self

    def order_asc(self, column: str) -> "QueryBuilder":
        """添加升序排序"""
        return self.order_by(column, OrderDirection.ASC)

    def order_desc(self, column: str) -> "QueryBuilder":
        """添加降序排序"""
        return self.order_by(column, OrderDirection.DESC)

    def limit(self, count: int) -> "QueryBuilder":
        """
        设置限制数量

        Args:
            count: 限制数量

        Returns:
            查询构建器实例
        """
        self._limit = count
        return self

    def offset(self, count: int) -> "QueryBuilder":
        """
        设置偏移量

        Args:
            count: 偏移量

        Returns:
            查询构建器实例
        """
        self._offset = count
        return self

    def paginate(self, page: int, per_page: int) -> "QueryBuilder":
        """
        设置分页

        Args:
            page: 页码(从1开始)
            per_page: 每页数量

        Returns:
            查询构建器实例
        """
        self._offset = (page - 1) * per_page
        self._limit = per_page
        return self

    def build(self) -> Tuple[str, List[Any]]:
        """
        构建SQL查询

        Returns:
            (SQL语句, 参数列表)元组
        """
        # SELECT
        query_parts = ["SELECT"]
        if self._distinct:
            query_parts.append("DISTINCT")
        query_parts.append(", ".join(self._select))

        # FROM
        query_parts.append(f"FROM {self.table}")

        # JOIN
        for table, join_type, on in self._joins:
            query_parts.append(f"{join_type.value} {table} ON {on}")

        # WHERE
        if self._where:
            query_parts.append("WHERE " + " ".join(self._where))

        # GROUP BY
        if self._group_by:
            query_parts.append("GROUP BY " + ", ".join(self._group_by))

        # HAVING
        if self._having:
            query_parts.append("HAVING " + " AND ".join(self._having))

        # ORDER BY
        if self._order_by:
            order_parts = [
                f"{column} {direction.value}" for column, direction in self._order_by
            ]
            query_parts.append("ORDER BY " + ", ".join(order_parts))

        # LIMIT
        if self._limit is not None:
            query_parts.append(f"LIMIT {self._limit}")

        # OFFSET
        if self._offset is not None:
            query_parts.append(f"OFFSET {self._offset}")

        query = " ".join(query_parts)
        return query, self._params

    def to_sql(self) -> str:
        """
        获取SQL语句(用于调试)

        Returns:
            SQL字符串
        """
        query, params = self.build()
        # 替换占位符为实际值(仅用于调试,不安全)
        debug_query = query
        for param in params:
            if isinstance(param, str):
                debug_query = debug_query.replace("%s", f"'{param}'", 1)
            else:
                debug_query = debug_query.replace("%s", str(param), 1)
        return debug_query

    def __str__(self) -> str:
        """字符串表示"""
        return self.to_sql()


class InsertBuilder:
    """INSERT查询构建器"""

    def __init__(self, table: str):
        """
        初始化INSERT构建器

        Args:
            table: 表名
        """
        self.table = table
        self._data: Dict[str, Any] = {}
        self._on_duplicate: Optional[str] = None

    def set(self, **kwargs: Any) -> "InsertBuilder":
        """
        设置插入数据

        Args:
            **kwargs: 字段名和值

        Returns:
            INSERT构建器实例
        """
        self._data.update(kwargs)
        return self

    def on_duplicate_key_update(self, updates: str) -> "InsertBuilder":
        """
        设置重复键更新

        Args:
            updates: 更新表达式

        Returns:
            INSERT构建器实例
        """
        self._on_duplicate = updates
        return self

    def build(self) -> Tuple[str, List[Any]]:
        """
        构建SQL查询

        Returns:
            (SQL语句, 参数列表)元组
        """
        if not self._data:
            raise ValueError("No data to insert")

        columns = list(self._data.keys())
        values = list(self._data.values())
        placeholders = ", ".join(["%s"] * len(values))

        query = f"INSERT INTO {self.table} ({', '.join(columns)}) VALUES ({placeholders})"

        # ON DUPLICATE KEY UPDATE
        if self._on_duplicate:
            query += f" ON DUPLICATE KEY UPDATE {self._on_duplicate}"

        return query, values


class UpdateBuilder:
    """UPDATE查询构建器"""

    def __init__(self, table: str):
        """
        初始化UPDATE构建器

        Args:
            table: 表名
        """
        self.table = table
        self._set: Dict[str, Any] = {}
        self._where: List[str] = []
        self._params: List[Any] = []

    def set(self, **kwargs: Any) -> "UpdateBuilder":
        """
        设置更新字段

        Args:
            **kwargs: 字段名和值

        Returns:
            UPDATE构建器实例
        """
        self._set.update(kwargs)
        return self

    def where(self, condition: str, *params: Any) -> "UpdateBuilder":
        """
        添加WHERE条件

        Args:
            condition: 条件表达式
            *params: 参数值

        Returns:
            UPDATE构建器实例
        """
        if self._where:
            self._where.append("AND")
        self._where.append(f"({condition})")
        self._params.extend(params)
        return self

    def build(self) -> Tuple[str, List[Any]]:
        """
        构建SQL查询

        Returns:
            (SQL语句, 参数列表)元组
        """
        if not self._set:
            raise ValueError("No fields to update")

        # SET
        set_parts = [f"{key} = %s" for key in self._set.keys()]
        query = f"UPDATE {self.table} SET {', '.join(set_parts)}"

        # WHERE
        if self._where:
            query += " WHERE " + " ".join(self._where)

        # 参数
        params = list(self._set.values()) + self._params

        return query, params


class DeleteBuilder:
    """DELETE查询构建器"""

    def __init__(self, table: str):
        """
        初始化DELETE构建器

        Args:
            table: 表名
        """
        self.table = table
        self._where: List[str] = []
        self._params: List[Any] = []

    def where(self, condition: str, *params: Any) -> "DeleteBuilder":
        """
        添加WHERE条件

        Args:
            condition: 条件表达式
            *params: 参数值

        Returns:
            DELETE构建器实例
        """
        if self._where:
            self._where.append("AND")
        self._where.append(f"({condition})")
        self._params.extend(params)
        return self

    def build(self) -> Tuple[str, List[Any]]:
        """
        构建SQL查询

        Returns:
            (SQL语句, 参数列表)元组
        """
        query = f"DELETE FROM {self.table}"

        # WHERE
        if self._where:
            query += " WHERE " + " ".join(self._where)

        return query, self._params


# 便捷函数
def query(table: str) -> QueryBuilder:
    """创建SELECT查询构建器"""
    return QueryBuilder(table)


def insert_into(table: str) -> InsertBuilder:
    """创建INSERT查询构建器"""
    return InsertBuilder(table)


def update(table: str) -> UpdateBuilder:
    """创建UPDATE查询构建器"""
    return UpdateBuilder(table)


def delete_from(table: str) -> DeleteBuilder:
    """创建DELETE查询构建器"""
    return DeleteBuilder(table)
