"""
Message Models - Database models for messaging system
Includes Message and Conversation models for private messaging.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class Conversation(Base):
    """
    Conversation model for private messaging between two users.
    """

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id_1 = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_id_2 = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(255), nullable=True)
    last_message = Column(Text, nullable=True)
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_by_user_1 = Column(Boolean, default=False, nullable=False)
    deleted_by_user_2 = Column(Boolean, default=False, nullable=False)

    # Relationships
    user1 = relationship("User", foreign_keys=[user_id_1], back_populates="conversations_as_user1")
    user2 = relationship("User", foreign_keys=[user_id_2], back_populates="conversations_as_user2")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    # Indexes for efficient queries
    __table_args__ = (
        Index('idx_conversation_users', 'user_id_1', 'user_id_2'),
        Index('idx_conversation_last_message', 'last_message_at'),
    )

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id_1={self.user_id_1}, user_id_2={self.user_id_2})>"


class Message(Base):
    """
    Message model for individual messages in a conversation.
    """

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    message_type = Column(String(50), default="text", nullable=False)  # text, image, file, etc.
    attachment_url = Column(String(500), nullable=True)
    attachment_name = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")

    # Indexes for efficient queries
    __table_args__ = (
        Index('idx_message_conversation', 'conversation_id', 'created_at'),
        Index('idx_message_sender', 'sender_id'),
        Index('idx_message_read', 'is_read'),
    )

    def __repr__(self):
        return f"<Message(id={self.id}, conversation_id={self.conversation_id}, sender_id={self.sender_id})>"

    @property
    def excerpt(self):
        """Get a short excerpt of the message content."""
        if len(self.content) > 100:
            return self.content[:97] + "..."
        return self.content
