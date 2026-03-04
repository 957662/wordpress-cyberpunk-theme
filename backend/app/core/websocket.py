"""
WebSocket Manager - Real-time communication manager
Handles WebSocket connections for real-time features like
notifications, chat, activity streams, etc.
"""

from typing import Dict, Set, Optional, Any
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect
from json import JSONDecodeError
import json
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    WebSocket connection manager for handling real-time connections.
    Manages user connections and broadcasts messages to connected clients.
    """

    def __init__(self):
        # Store active connections by user ID
        self.active_connections: Dict[int, Set[WebSocket]] = {}
        # Store connection metadata
        self.connection_metadata: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """
        Accept and register a new WebSocket connection.

        Args:
            websocket: The WebSocket connection instance
            user_id: The ID of the user connecting
        """
        await websocket.accept()

        # Add to user's connection set
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)

        # Store connection metadata
        self.connection_metadata[websocket] = {
            'user_id': user_id,
            'connected_at': datetime.utcnow().isoformat(),
        }

        logger.info(f"User {user_id} connected via WebSocket")

    def disconnect(self, websocket: WebSocket):
        """
        Remove a WebSocket connection.

        Args:
            websocket: The WebSocket connection to remove
        """
        # Get user ID from metadata
        metadata = self.connection_metadata.get(websocket)
        if metadata:
            user_id = metadata['user_id']

            # Remove from user's connections
            if user_id in self.active_connections:
                self.active_connections[user_id].discard(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]

            # Remove metadata
            del self.connection_metadata[websocket]

            logger.info(f"User {user_id} disconnected from WebSocket")

    async def send_personal_message(self, message: dict, user_id: int):
        """
        Send a message to a specific user.

        Args:
            message: The message dict to send
            user_id: The ID of the user to send to
        """
        if user_id in self.active_connections:
            # Remove closed connections
            closed_connections = [
                ws for ws in self.active_connections[user_id]
                if ws.client_state.name != 'CONNECTED'
            ]
            for ws in closed_connections:
                self.disconnect(ws)

            # Send to remaining connections
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message to user {user_id}: {e}")
                    self.disconnect(connection)

    async def broadcast(self, message: dict, exclude_user_id: Optional[int] = None):
        """
        Broadcast a message to all connected users.

        Args:
            message: The message dict to broadcast
            exclude_user_id: Optional user ID to exclude from broadcast
        """
        # Get all WebSockets
        all_connections = []
        for user_id, connections in self.active_connections.items():
            if exclude_user_id and user_id == exclude_user_id:
                continue
            all_connections.extend(connections)

        # Remove closed connections
        active_connections = [
            ws for ws in all_connections
            if ws.client_state.name == 'CONNECTED'
        ]

        # Send to all
        for connection in active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                self.disconnect(connection)

    async def send_to_users(self, message: dict, user_ids: list[int]):
        """
        Send a message to multiple specific users.

        Args:
            message: The message dict to send
            user_ids: List of user IDs to send to
        """
        for user_id in user_ids:
            await self.send_personal_message(message, user_id)

    def get_connected_users(self) -> list[int]:
        """
        Get list of currently connected user IDs.

        Returns:
            List of user IDs that have active connections
        """
        return list(self.active_connections.keys())

    def get_connection_count(self, user_id: int) -> int:
        """
        Get number of active connections for a user.

        Args:
            user_id: The user ID to check

        Returns:
            Number of active connections
        """
        return len(self.active_connections.get(user_id, set()))

    def is_user_connected(self, user_id: int) -> bool:
        """
        Check if a user has any active connections.

        Args:
            user_id: The user ID to check

        Returns:
            True if user has at least one active connection
        """
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0

    async def ping_all(self):
        """
        Send a ping message to all connected clients to keep connections alive.
        """
        ping_message = {
            'type': 'ping',
            'timestamp': datetime.utcnow().isoformat(),
        }
        await self.broadcast(ping_message)


# Global connection manager instance
manager = ConnectionManager()


class WebSocketMessageHandler:
    """
    Handler for processing incoming WebSocket messages.
    """

    def __init__(self, connection_manager: ConnectionManager):
        self.manager = connection_manager

    async def handle_message(self, websocket: WebSocket, message: str):
        """
        Handle an incoming WebSocket message.

        Args:
            websocket: The WebSocket connection
            message: The message string received
        """
        try:
            data = json.loads(message)
            message_type = data.get('type')

            # Route message to appropriate handler
            if message_type == 'pong':
                await self._handle_pong(websocket, data)
            elif message_type == 'typing':
                await self._handle_typing(websocket, data)
            elif message_type == 'presence':
                await self._handle_presence(websocket, data)
            else:
                logger.warning(f"Unknown message type: {message_type}")

        except JSONDecodeError:
            logger.error("Invalid JSON received")
            await websocket.send_json({
                'type': 'error',
                'message': 'Invalid message format'
            })
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            await websocket.send_json({
                'type': 'error',
                'message': 'Internal error processing message'
            })

    async def _handle_pong(self, websocket: WebSocket, data: dict):
        """Handle pong response (heartbeat)."""
        # Update last activity timestamp
        if websocket in self.manager.connection_metadata:
            self.manager.connection_metadata[websocket]['last_activity'] = datetime.utcnow().isoformat()

    async def _handle_typing(self, websocket: WebSocket, data: dict):
        """
        Handle typing indicator.
        Broadcast typing status to relevant users.
        """
        metadata = self.manager.connection_metadata.get(websocket)
        if not metadata:
            return

        user_id = metadata['user_id']
        conversation_id = data.get('conversation_id')

        # Broadcast typing indicator to conversation participants
        if conversation_id:
            typing_message = {
                'type': 'user_typing',
                'user_id': user_id,
                'conversation_id': conversation_id,
                'timestamp': datetime.utcnow().isoformat(),
            }
            # In a real implementation, you'd get conversation participants
            # await self.manager.send_to_users(typing_message, participant_ids)

    async def _handle_presence(self, websocket: WebSocket, data: dict):
        """
        Handle presence updates (online/offline/away).
        """
        metadata = self.manager.connection_metadata.get(websocket)
        if not metadata:
            return

        user_id = metadata['user_id']
        status = data.get('status', 'online')

        presence_message = {
            'type': 'presence_update',
            'user_id': user_id,
            'status': status,
            'timestamp': datetime.utcnow().isoformat(),
        }

        # Broadcast to all users except sender
        await self.manager.broadcast(presence_message, exclude_user_id=user_id)


# Message handler instance
message_handler = WebSocketMessageHandler(manager)
