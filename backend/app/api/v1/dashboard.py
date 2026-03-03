"""
Dashboard API
仪表板数据接口
"""
from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class QuickStat(BaseModel):
    """快速统计数据"""
    label: str
    value: int | str
    change: str
    type: str


class ActivityItem(BaseModel):
    """活动项目"""
    id: str
    type: str
    message: str
    time: str
    user: dict | None = None


class DashboardResponse(BaseModel):
    """仪表板响应"""
    stats: List[QuickStat]
    activities: List[ActivityItem]
    summary: dict


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard_data():
    """
    获取仪表板数据

    返回快速统计、最近活动和汇总信息
    """
    # 快速统计数据
    stats = [
        QuickStat(
            label="文章总数",
            value=156,
            change="+12.5%",
            type="posts"
        ),
        QuickStat(
            label="用户数量",
            value=1245,
            change="+8.3%",
            type="users"
        ),
        QuickStat(
            label="今日访问",
            value=892,
            change="+15.7%",
            type="views"
        ),
        QuickStat(
            label="评论总数",
            value=3456,
            change="+23.1%",
            type="comments"
        ),
    ]

    # 最近活动
    activities = [
        ActivityItem(
            id="1",
            type="post",
            message="发布了新文章《探索赛博朋克设计美学》",
            time="5分钟前",
            user={"name": "张三", "avatar": None}
        ),
        ActivityItem(
            id="2",
            type="comment",
            message="评论了文章《Next.js 14 完全指南》",
            time="15分钟前",
            user={"name": "李四", "avatar": None}
        ),
        ActivityItem(
            id="3",
            type="user",
            message="新用户注册",
            time="1小时前",
            user={"name": "王五", "avatar": None}
        ),
        ActivityItem(
            id="4",
            type="like",
            message="点赞了文章《构建无头 CMS 博客系统》",
            time="2小时前",
            user={"name": "赵六", "avatar": None}
        ),
        ActivityItem(
            id="5",
            type="post",
            message="更新了文章《TypeScript 高级类型技巧》",
            time="3小时前",
            user={"name": "张三", "avatar": None}
        ),
    ]

    # 汇总信息
    summary = {
        "total_posts": 156,
        "total_users": 1245,
        "total_views": 45230,
        "total_comments": 3456,
        "popular_posts": [
            {"id": 1, "title": "探索赛博朋克设计美学", "views": 2340},
            {"id": 2, "title": "Next.js 14 完全指南", "views": 1890},
            {"id": 3, "title": "构建无头 CMS 博客系统", "views": 1567},
        ],
        "active_users": [
            {"name": "张三", "posts": 12},
            {"name": "李四", "posts": 8},
            {"name": "王五", "posts": 6},
        ],
    }

    return DashboardResponse(
        stats=stats,
        activities=activities,
        summary=summary,
    )


@router.get("/dashboard/stats")
async def get_quick_stats():
    """
    获取快速统计数据
    """
    return {
        "posts": {"total": 156, "change": "+12.5%"},
        "users": {"total": 1245, "change": "+8.3%"},
        "views": {"total": 892, "change": "+15.7%"},
        "comments": {"total": 3456, "change": "+23.1%"},
    }


@router.get("/dashboard/activities")
async def get_recent_activities(limit: int = 10):
    """
    获取最近活动

    - **limit**: 返回数量限制
    """
    activities = [
        {
            "id": str(i),
            "type": ["post", "comment", "user", "like"][i % 4],
            "message": f"活动消息 {i}",
            "time": f"{i * 5}分钟前",
            "user": {"name": f"用户{i}", "avatar": None}
        }
        for i in range(1, limit + 1)
    ]

    return {"activities": activities}
