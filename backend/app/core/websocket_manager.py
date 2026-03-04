"""
WebSocket 连接管理器
管理所有 WebSocket 连接，支持广播和定向消息
"""

from typing import Dict, Set, Optional, Any
from fastapi import WebSocket
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)


class ConnectionState:
    """连接状态"""

    def __init__(self, websocket: WebSocket, user_id: int):
        self.websocket = websocket
        self.user_id = user_id
        self.connected_at = datetime.utcnow()
        self.last_ping = datetime.utcnow()

    async def send_json(self, data: Dict[str, Any]) -> None:
        """发送 JSON 数据"""
        try:
            await self.websocket.send_json(data)
        except Exception as e:
            logger.error(f"发送消息失败: {e}")
            raise

    async def send_text(self, message: str) -> None:
        """发送文本消息"""
        try:
            await self.websocket.send_text(message)
        except Exception as e:
            logger.error(f"发送文本失败: {e}")
            raise


class WebSocketManager:
    """WebSocket 连接管理器"""

    def __init__(self):
        # 活跃连接: {connection_id: ConnectionState}
        self.active_connections: Dict[str, ConnectionState] = {}

        # 用户连接: {user_id: Set[connection_id]}
        self.user_connections: Dict[int, Set[str]] = {}

        # 房间连接: {room_id: Set[connection_id]}
        self.room_connections: Dict[str, Set[str]] = {}

    def _generate_connection_id(self, user_id: int) -> str:
        """生成连接 ID"""
        timestamp = datetime.utcnow().timestamp()
        return f"{user_id}-{timestamp}"

    async def connect(self, websocket: WebSocket, user_id: int) -> str:
        """
        建立 WebSocket 连接

        Args:
            websocket: WebSocket 连接对象
            user_id: 用户 ID

        Returns:
            连接 ID
        """
        await websocket.accept()

        connection_id = self._generate_connection_id(user_id)
        state = ConnectionState(websocket, user_id)

        self.active_connections[connection_id] = state

        # 添加到用户连接集合
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(connection_id)

        logger.info(f"用户 {user_id} 已连接 (连接ID: {connection_id})")

        # 发送连接成功消息
        await state.send_json({
            "type": "connected",
            "connection_id": connection_id,
            "timestamp": datetime.utcnow().isoformat(),
        })

        return connection_id

    async def disconnect(self, connection_id: str) -> None:
        """
        断开 WebSocket 连接

        Args:
            connection_id: 连接 ID
        """
        if connection_id not in self.active_connections:
            return

        state = self.active_connections[connection_id]
        user_id = state.user_id

        # 从所有房间中移除
        for room_id in list(self.room_connections.keys()):
            if connection_id in self.room_connections[room_id]:
                self.room_connections[room_id].discard(connection_id)

        # 从用户连接中移除
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(connection_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

        # 移除连接
        del self.active_connections[connection_id]

        logger.info(f"用户 {user_id} 已断开连接 (连接ID: {connection_id})")

    async def send_to_connection(
        self,
        connection_id: str,
        message_type: str,
        data: Dict[str, Any],
    ) -> bool:
        """
        向指定连接发送消息

        Args:
            connection_id: 连接 ID
            message_type: 消息类型
            data: 消息数据

        Returns:
            是否发送成功
        """
        if connection_id not in self.active_connections:
            return False

        state = self.active_connections[connection_id]

        try:
            await state.send_json({
                "type": message_type,
                "data": data,
                "timestamp": datetime.utcnow().isoformat(),
            })
            return True
        except Exception as e:
            logger.error(f"发送消息到连接 {connection_id} 失败: {e}")
            await self.disconnect(connection_id)
            return False

    async def send_to_user(
        self,
        user_id: int,
        message_type: str,
        data: Dict[str, Any],
    ) -> int:
        """
        向指定用户的所有连接发送消息

        Args:
            user_id: 用户 ID
            message_type: 消息类型
            data: 消息数据

        Returns:
            成功发送的连接数
        """
        if user_id not in self.user_connections:
            return 0

        success_count = 0
        failed_connections = []

        for connection_id in list(self.user_connections[user_id]):
            success = await self.send_to_connection(connection_id, message_type, data)
            if success:
                success_count += 1
            else:
                failed_connections.append(connection_id)

        # 清理失败的连接
        for connection_id in failed_connections:
            await self.disconnect(connection_id)

        return success_count

    async def broadcast(
        self,
        message_type: str,
        data: Dict[str, Any],
        exclude_user_id: Optional[int] = None,
    ) -> int:
        """
        向所有连接广播消息

        Args:
            message_type: 消息类型
            data: 消息数据
            exclude_user_id: 要排除的用户 ID

        Returns:
            成功发送的连接数
        """
        success_count = 0
        failed_connections = []

        for connection_id, state in self.active_connections.items():
            # 排除指定用户
            if exclude_user_id and state.user_id == exclude_user_id:
                continue

            success = await self.send_to_connection(connection_id, message_type, data)
            if success:
                success_count += 1
            else:
                failed_connections.append(connection_id)

        # 清理失败的连接
        for connection_id in failed_connections:
            await self.disconnect(connection_id)

        return success_count

    async def join_room(
        self,
        connection_id: str,
        room_id: str,
    ) -> bool:
        """
        加入房间

        Args:
            connection_id: 连接 ID
            room_id: 房间 ID

        Returns:
            是否成功加入
        """
        if connection_id not in self.active_connections:
            return False

        if room_id not in self.room_connections:
            self.room_connections[room_id] = set()

        self.room_connections[room_id].add(connection_id)

        state = self.active_connections[connection_id]
        logger.info(f"用户 {state.user_id} 加入房间 {room_id}")

        # 通知房间内其他用户
        await self.send_to_room(
            room_id=room_id,
            message_type="user_joined",
            data={
                "user_id": state.user_id,
                "connection_id": connection_id,
            },
            exclude_connection_id=connection_id,
        )

        return True

    async def leave_room(
        self,
        connection_id: str,
        room_id: str,
    ) -> bool:
        """
        离开房间

        Args:
            connection_id: 连接 ID
            room_id: 房间 ID

        Returns:
            是否成功离开
        """
        if room_id not in self.room_connections:
            return False

        if connection_id not in self.room_connections[room_id]:
            return False

        self.room_connections[room_id].discard(connection_id)

        # 如果房间为空，删除房间
        if not self.room_connections[room_id]:
            del self.room_connections[room_id]

        state = self.active_connections.get(connection_id)
        if state:
            logger.info(f"用户 {state.user_id} 离开房间 {room_id}")

            # 通知房间内其他用户
            await self.send_to_room(
                room_id=room_id,
                message_type="user_left",
                data={
                    "user_id": state.user_id,
                    "connection_id": connection_id,
                },
                exclude_connection_id=connection_id,
            )

        return True

    async def send_to_room(
        self,
        room_id: str,
        message_type: str,
        data: Dict[str, Any],
        exclude_connection_id: Optional[str] = None,
    ) -> int:
        """
        向房间内的所有连接发送消息

        Args:
            room_id: 房间 ID
            message_type: 消息类型
            data: 消息数据
            exclude_connection_id: 要排除的连接 ID

        Returns:
            成功发送的连接数
        """
        if room_id not in self.room_connections:
            return 0

        success_count = 0
        failed_connections = []

        for connection_id in self.room_connections[room_id]:
            # 排除指定连接
            if exclude_connection_id and connection_id == exclude_connection_id:
                continue

            success = await self.send_to_connection(connection_id, message_type, data)
            if success:
                success_count += 1
            else:
                failed_connections.append(connection_id)

        # 清理失败的连接
        for connection_id in failed_connections:
            await self.disconnect(connection_id)

        return success_count

    def get_connection_count(self) -> int:
        """获取活跃连接数"""
        return len(self.active_connections)

    def get_user_connection_count(self, user_id: int) -> int:
        """获取用户的连接数"""
        return len(self.user_connections.get(user_id, set()))

    def get_room_participant_count(self, room_id: str) -> int:
        """获取房间参与者数"""
        return len(self.room_connections.get(room_id, set()))

    def is_user_online(self, user_id: int) -> bool:
        """检查用户是否在线"""
        return user_id in self.user_connections and len(self.user_connections[user_id]) > 0

    def get_online_users(self) -> Set[int]:
        """获取所有在线用户 ID"""
        return set(self.user_connections.keys())

    async def ping_all(self) -> int:
        """向所有连接发送 ping"""
        return await self.broadcast("ping", {})

    async def cleanup_stale_connections(self, timeout_seconds: int = 300) -> int:
        """
        清理超时连接

        Args:
            timeout_seconds: 超时时间（秒）

        Returns:
            清理的连接数
        """
        from datetime import timedelta

        now = datetime.utcnow()
        timeout = timedelta(seconds=timeout_seconds)
        stale_connections = []

        for connection_id, state in self.active_connections.items():
            if now - state.last_ping > timeout:
                stale_connections.append(connection_id)

        for connection_id in stale_connections:
            await self.disconnect(connection_id)

        if stale_connections:
            logger.info(f"清理了 {len(stale_connections)} 个超时连接")

        return len(stale_connections)


# 全局 WebSocket 管理器实例
manager = WebSocketManager()


def get_websocket_manager() -> WebSocketManager:
    """获取 WebSocket 管理器实例"""
    return manager
