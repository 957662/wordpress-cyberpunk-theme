"""
WebSocket 服务
处理实时通信功能
"""

from typing import Dict, Set, Optional, Any, List
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect
from json import loads, dumps
import asyncio
from dataclasses import dataclass, asdict

from core.config import settings


@dataclass
class Connection:
    """WebSocket 连接信息"""
    websocket: WebSocket
    user_id: int
    username: str
    channels: Set[str]
    connected_at: datetime


class WebSocketService:
    """WebSocket 服务管理器"""

    def __init__(self):
        # 活跃连接 {user_id: Connection}
        self.active_connections: Dict[int, Connection] = {}

        # 频道订阅 {channel_name: Set[user_id]}
        self.channel_subscribers: Dict[str, Set[int]] = {}

        # 在线用户集合
        self.online_users: Set[int] = set()

    async def connect(self, websocket: WebSocket, user_id: int, username: str) -> Connection:
        """建立新连接"""
        await websocket.accept()

        connection = Connection(
            websocket=websocket,
            user_id=user_id,
            username=username,
            channels=set(),
            connected_at=datetime.now()
        )

        self.active_connections[user_id] = connection
        self.online_users.add(user_id)

        # 自动订阅个人频道
        await self.subscribe_to_channel(user_id, f"user:{user_id}")

        # 广播用户上线
        await self.broadcast_user_status(user_id, "online")

        return connection

    async def disconnect(self, user_id: int):
        """断开连接"""
        if user_id in self.active_connections:
            connection = self.active_connections[user_id]

            # 从所有频道退订
            for channel in list(connection.channels):
                await self.unsubscribe_from_channel(user_id, channel)

            # 移除连接
            del self.active_connections[user_id]
            self.online_users.discard(user_id)

            # 广播用户离线
            await self.broadcast_user_status(user_id, "offline")

    async def subscribe_to_channel(self, user_id: int, channel: str) -> bool:
        """订阅频道"""
        if user_id not in self.active_connections:
            return False

        connection = self.active_connections[user_id]
        connection.channels.add(channel)

        if channel not in self.channel_subscribers:
            self.channel_subscribers[channel] = set()
        self.channel_subscribers[channel].add(user_id)

        # 发送订阅成功消息
        await self.send_personal_message(user_id, {
            "type": "subscription",
            "channel": channel,
            "status": "subscribed",
            "timestamp": datetime.now().isoformat()
        })

        return True

    async def unsubscribe_from_channel(self, user_id: int, channel: str) -> bool:
        """退订频道"""
        if user_id not in self.active_connections:
            return False

        connection = self.active_connections[user_id]
        connection.channels.discard(channel)

        if channel in self.channel_subscribers:
            self.channel_subscribers[channel].discard(user_id)
            # 如果频道没有订阅者了，删除频道
            if not self.channel_subscribers[channel]:
                del self.channel_subscribers[channel]

        # 发送退订成功消息
        await self.send_personal_message(user_id, {
            "type": "subscription",
            "channel": channel,
            "status": "unsubscribed",
            "timestamp": datetime.now().isoformat()
        })

        return True

    async def send_personal_message(self, user_id: int, message: Dict[str, Any]) -> bool:
        """发送个人消息"""
        if user_id not in self.active_connections:
            return False

        connection = self.active_connections[user_id]
        try:
            await connection.websocket.send_text(dumps(message, ensure_ascii=False))
            return True
        except Exception as e:
            print(f"发送消息失败: {e}")
            # 发送失败，移除连接
            await self.disconnect(user_id)
            return False

    async def broadcast_to_channel(self, channel: str, message: Dict[str, Any]) -> int:
        """向频道广播消息"""
        if channel not in self.channel_subscribers:
            return 0

        failed_users = []
        success_count = 0

        for user_id in self.channel_subscribers[channel]:
            if not await self.send_personal_message(user_id, message):
                failed_users.append(user_id)
            else:
                success_count += 1

        # 清理失败的连接
        for user_id in failed_users:
            await self.disconnect(user_id)

        return success_count

    async def broadcast_to_all(self, message: Dict[str, Any]) -> int:
        """向所有连接广播消息"""
        success_count = 0
        failed_users = []

        for user_id in self.active_connections:
            if not await self.send_personal_message(user_id, message):
                failed_users.append(user_id)
            else:
                success_count += 1

        # 清理失败的连接
        for user_id in failed_users:
            await self.disconnect(user_id)

        return success_count

    async def broadcast_user_status(self, user_id: int, status: str):
        """广播用户状态变化"""
        message = {
            "type": "user_status",
            "user_id": user_id,
            "status": status,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast_to_channel("presence", message)

    async def send_notification(self, user_id: int, notification: Dict[str, Any]):
        """发送通知"""
        message = {
            "type": "notification",
            "data": notification,
            "timestamp": datetime.now().isoformat()
        }
        await self.send_personal_message(user_id, message)

    async def broadcast_notification(self, notification: Dict[str, Any]):
        """广播通知（用于系统通知）"""
        message = {
            "type": "system_notification",
            "data": notification,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast_to_all(message)

    async def send_comment_notification(
        self,
        post_author_id: int,
        commenter_name: str,
        post_title: str,
        comment_content: str,
        post_id: int
    ):
        """发送新评论通知"""
        notification = {
            "title": "新评论",
            "message": f"{commenter_name} 评论了你的文章《{post_title}》",
            "content": comment_content[:100],
            "type": "comment",
            "post_id": post_id,
            "action_url": f"/posts/{post_id}"
        }
        await self.send_notification(post_author_id, notification)

    async def send_like_notification(
        self,
        post_author_id: int,
        liker_name: str,
        post_title: str,
        post_id: int
    ):
        """发送点赞通知"""
        notification = {
            "title": "新的点赞",
            "message": f"{liker_name} 赞了你的文章《{post_title}》",
            "type": "like",
            "post_id": post_id,
            "action_url": f"/posts/{post_id}"
        }
        await self.send_notification(post_author_id, notification)

    async def send_follow_notification(
        self,
        follower_id: int,
        user_id: int,
        follower_name: str
    ):
        """发送关注通知"""
        notification = {
            "title": "新粉丝",
            "message": f"{follower_name} 开始关注你了",
            "type": "follow",
            "follower_id": follower_id,
            "action_url": f"/users/{follower_id}"
        }
        await self.send_notification(user_id, notification)

    async def send_typing_indicator(self, channel: str, user_id: int, username: str):
        """发送输入指示器"""
        message = {
            "type": "typing",
            "user_id": user_id,
            "username": username,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast_to_channel(channel, message)

    def get_online_users(self) -> List[int]:
        """获取在线用户列表"""
        return list(self.online_users)

    def get_online_count(self) -> int:
        """获取在线用户数"""
        return len(self.online_users)

    def get_connection_info(self, user_id: int) -> Optional[Dict[str, Any]]:
        """获取连接信息"""
        if user_id not in self.active_connections:
            return None

        connection = self.active_connections[user_id]
        return {
            "user_id": connection.user_id,
            "username": connection.username,
            "channels": list(connection.channels),
            "connected_at": connection.connected_at.isoformat(),
            "duration_seconds": (datetime.now() - connection.connected_at).total_seconds()
        }

    def is_user_online(self, user_id: int) -> bool:
        """检查用户是否在线"""
        return user_id in self.online_users

    def get_channel_subscribers(self, channel: str) -> List[int]:
        """获取频道订阅者"""
        if channel not in self.channel_subscribers:
            return []
        return list(self.channel_subscribers[channel])

    def get_statistics(self) -> Dict[str, Any]:
        """获取服务统计信息"""
        return {
            "total_connections": len(self.active_connections),
            "online_users": len(self.online_users),
            "total_channels": len(self.channel_subscribers),
            "connections_by_channel": {
                channel: len(subscribers)
                for channel, subscribers in self.channel_subscribers.items()
            }
        }


# 创建全局实例
websocket_service = WebSocketService()


async def websocket_endpoint(websocket: WebSocket, user_id: int, username: str):
    """WebSocket 端点处理函数"""
    connection = await websocket_service.connect(websocket, user_id, username)

    try:
        while True:
            # 接收客户端消息
            data = await websocket.receive_text()
            message = loads(data)

            message_type = message.get("type")

            if message_type == "ping":
                # 心跳响应
                await websocket_service.send_personal_message(user_id, {
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                })

            elif message_type == "subscribe":
                # 订阅频道
                channel = message.get("channel")
                if channel:
                    await websocket_service.subscribe_to_channel(user_id, channel)

            elif message_type == "unsubscribe":
                # 退订频道
                channel = message.get("channel")
                if channel:
                    await websocket_service.unsubscribe_from_channel(user_id, channel)

            elif message_type == "typing":
                # 输入指示器
                channel = message.get("channel")
                if channel:
                    await websocket_service.send_typing_indicator(
                        channel, user_id, username
                    )

            elif message_type == "broadcast":
                # 广播消息（需要权限检查）
                channel = message.get("channel")
                content = message.get("content")
                if channel and content:
                    await websocket_service.broadcast_to_channel(channel, {
                        "type": "message",
                        "user_id": user_id,
                        "username": username,
                        "content": content,
                        "timestamp": datetime.now().isoformat()
                    })

    except WebSocketDisconnect:
        await websocket_service.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket 错误: {e}")
        await websocket_service.disconnect(user_id)
