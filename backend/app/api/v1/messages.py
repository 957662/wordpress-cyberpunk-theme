"""
Messages API - Private messaging system
Provides endpoints for real-time messaging between users.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from ...core.database import get_db
from ...core.auth import get_current_user
from ...models.user import User
from ...models.message import Message, Conversation
from ...schemas.message import (
    MessageCreate,
    MessageResponse,
    ConversationResponse,
    ConversationListResponse,
    MessageListResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("/conversations", response_model=ConversationListResponse)
async def get_conversations(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all conversations for the current user.

    Args:
        page: Page number for pagination
        per_page: Number of items per page
        search: Optional search term for conversation name
        current_user: Authenticated user
        db: Database session

    Returns:
        Paginated list of conversations
    """
    try:
        # Build query
        query = (
            select(Conversation)
            .where(
                or_(
                    Conversation.user_id_1 == current_user.id,
                    Conversation.user_id_2 == current_user.id
                )
            )
            .order_by(Conversation.last_message_at.desc())
        )

        # Apply search filter
        if search:
            search_pattern = f"%{search}%"
            query = query.where(Conversation.subject.ilike(search_pattern))

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await db.execute(query)
        conversations = result.scalars().all()

        # Get other user info for each conversation
        conversation_data = []
        for conv in conversations:
            other_user_id = conv.user_id_2 if conv.user_id_1 == current_user.id else conv.user_id_1

            # Get other user details
            user_query = select(User).where(User.id == other_user_id)
            user_result = await db.execute(user_query)
            other_user = user_result.scalar_one_or_none()

            # Get unread count
            unread_query = select(func.count(Message.id)).where(
                and_(
                    Message.conversation_id == conv.id,
                    Message.sender_id != current_user.id,
                    Message.is_read == False
                )
            )
            unread_result = await db.execute(unread_query)
            unread_count = unread_result.scalar()

            conversation_data.append({
                **conv.__dict__,
                'other_user': {
                    'id': other_user.id,
                    'username': other_user.username,
                    'avatar': other_user.avatar,
                    'display_name': other_user.display_name,
                } if other_user else None,
                'unread_count': unread_count,
            })

        return {
            'items': conversation_data,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
        }

    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversations"
        )


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific conversation by ID.

    Args:
        conversation_id: ID of the conversation
        current_user: Authenticated user
        db: Database session

    Returns:
        Conversation details
    """
    try:
        query = select(Conversation).where(Conversation.id == conversation_id)
        result = await db.execute(query)
        conversation = result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        # Check if user is part of conversation
        if current_user.id not in [conversation.user_id_1, conversation.user_id_2]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this conversation"
            )

        return conversation

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversation"
        )


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    user_id: int,
    subject: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new conversation with another user.

    Args:
        user_id: ID of the user to start conversation with
        subject: Optional subject for the conversation
        current_user: Authenticated user
        db: Database session

    Returns:
        Created conversation
    """
    try:
        # Check if other user exists
        user_query = select(User).where(User.id == user_id)
        user_result = await db.execute(user_query)
        other_user = user_result.scalar_one_or_none()

        if not other_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if other_user.id == current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot create conversation with yourself"
            )

        # Check if conversation already exists
        existing_query = select(Conversation).where(
            or_(
                and_(
                    Conversation.user_id_1 == current_user.id,
                    Conversation.user_id_2 == user_id
                ),
                and_(
                    Conversation.user_id_1 == user_id,
                    Conversation.user_id_2 == current_user.id
                )
            )
        )
        existing_result = await db.execute(existing_query)
        existing_conversation = existing_result.scalar_one_or_none()

        if existing_conversation:
            return existing_conversation

        # Create new conversation
        conversation = Conversation(
            user_id_1=current_user.id,
            user_id_2=user_id,
            subject=subject or "Private conversation",
            created_by=current_user.id,
        )

        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

        logger.info(f"Created conversation between {current_user.id} and {user_id}")
        return conversation

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating conversation: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create conversation"
        )


@router.get("/conversations/{conversation_id}/messages", response_model=MessageListResponse)
async def get_messages(
    conversation_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    before_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get messages in a conversation.

    Args:
        conversation_id: ID of the conversation
        page: Page number for pagination
        per_page: Number of messages per page
        before_id: Get messages before this message ID (for infinite scroll)
        current_user: Authenticated user
        db: Database session

    Returns:
        Paginated list of messages
    """
    try:
        # Verify conversation access
        conv_query = select(Conversation).where(Conversation.id == conversation_id)
        conv_result = await db.execute(conv_query)
        conversation = conv_result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        if current_user.id not in [conversation.user_id_1, conversation.user_id_2]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this conversation"
            )

        # Build query
        query = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
        )

        # Filter by before_id
        if before_id:
            query = query.where(Message.id < before_id)

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await db.execute(query)
        messages = result.scalars().all()

        # Mark messages as read
        unread_query = select(Message).where(
            and_(
                Message.conversation_id == conversation_id,
                Message.sender_id != current_user.id,
                Message.is_read == False
            )
        )
        unread_result = await db.execute(unread_query)
        unread_messages = unread_result.scalars().all()

        for msg in unread_messages:
            msg.is_read = True
            msg.read_at = datetime.utcnow()

        await db.commit()

        return {
            'items': list(reversed(messages)),  # Return in chronological order
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve messages"
        )


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Send a message to a conversation.

    Args:
        conversation_id: ID of the conversation
        message_data: Message content
        current_user: Authenticated user
        db: Database session

    Returns:
        Created message
    """
    try:
        # Verify conversation access
        conv_query = select(Conversation).where(Conversation.id == conversation_id)
        conv_result = await db.execute(conv_query)
        conversation = conv_result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        if current_user.id not in [conversation.user_id_1, conversation.user_id_2]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this conversation"
            )

        # Create message
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user.id,
            content=message_data.content,
            message_type=message_data.message_type or 'text',
        )

        db.add(message)

        # Update conversation
        conversation.last_message_at = datetime.utcnow()
        conversation.last_message = message_data.content[:100]

        await db.commit()
        await db.refresh(message)

        logger.info(f"User {current_user.id} sent message to conversation {conversation_id}")

        # TODO: Send real-time notification via WebSocket
        # from ...core.websocket import manager
        # await manager.send_personal_message({
        #     'type': 'new_message',
        #     'conversation_id': conversation_id,
        #     'message': message,
        # }, recipient_id)

        return message

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message"
        )


@router.put("/messages/{message_id}/read", response_model=MessageResponse)
async def mark_message_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark a message as read.

    Args:
        message_id: ID of the message
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated message
    """
    try:
        query = select(Message).where(Message.id == message_id)
        result = await db.execute(query)
        message = result.scalar_one_or_none()

        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )

        # Only recipient can mark as read
        if message.sender_id == current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot mark own message as read"
            )

        message.is_read = True
        message.read_at = datetime.utcnow()

        await db.commit()
        await db.refresh(message)

        return message

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking message as read: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark message as read"
        )


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a conversation (for current user).

    Args:
        conversation_id: ID of the conversation
        current_user: Authenticated user
        db: Database session
    """
    try:
        query = select(Conversation).where(Conversation.id == conversation_id)
        result = await db.execute(query)
        conversation = result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        # Check if user is part of conversation
        if current_user.id not in [conversation.user_id_1, conversation.user_id_2]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this conversation"
            )

        # Soft delete by marking deleted
        if conversation.user_id_1 == current_user.id:
            conversation.deleted_by_user_1 = True
        else:
            conversation.deleted_by_user_2 = True

        # Hard delete if both users deleted
        if conversation.deleted_by_user_1 and conversation.deleted_by_user_2:
            await db.delete(conversation)

        await db.commit()

        logger.info(f"User {current_user.id} deleted conversation {conversation_id}")
        return None

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete conversation"
        )


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get total unread message count for current user.

    Args:
        current_user: Authenticated user
        db: Database session

    Returns:
        Unread message count
    """
    try:
        # Get user's conversations
        conv_query = select(Conversation).where(
            or_(
                Conversation.user_id_1 == current_user.id,
                Conversation.user_id_2 == current_user.id
            )
        )
        conv_result = await db.execute(conv_query)
        conversations = conv_result.scalars().all()
        conversation_ids = [conv.id for conv in conversations]

        if not conversation_ids:
            return {'count': 0}

        # Count unread messages
        query = select(func.count(Message.id)).where(
            and_(
                Message.conversation_id.in_(conversation_ids),
                Message.sender_id != current_user.id,
                Message.is_read == False
            )
        )
        result = await db.execute(query)
        count = result.scalar()

        return {'count': count}

    except Exception as e:
        logger.error(f"Error getting unread count: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get unread count"
        )
