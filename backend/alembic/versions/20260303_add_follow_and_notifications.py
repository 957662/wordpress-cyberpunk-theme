"""add follow and notifications tables

Revision ID: 20260303_001
Revises:
Create Date: 2026-03-03

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20260303_001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # 创建关注表
    op.create_table(
        'follows',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('follower_id', sa.Integer(), nullable=False),
        sa.Column('following_id', sa.Integer(), nullable=False),
        sa.Column('followed_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['follower_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['following_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('follower_id', 'following_id', name='unique_follow'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_follower', 'follows', ['follower_id'])
    op.create_index('idx_following', 'follows', ['following_id'])

    # 创建关注统计表
    op.create_table(
        'follower_stats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('followers_count', sa.Integer(), nullable=False),
        sa.Column('following_count', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    # 创建通知表
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('recipient_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('actor_id', sa.Integer(), nullable=True),
        sa.Column('entity_type', sa.String(length=50), nullable=True),
        sa.Column('entity_id', sa.Integer(), nullable=True),
        sa.Column('data', postgresql.JSON(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.Column('priority', sa.String(length=20), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('action_url', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['actor_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['recipient_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_notifications_type', 'notifications', ['type'])
    op.create_index('ix_notifications_is_read', 'notifications', ['is_read'])

    # 创建通知偏好设置表
    op.create_table(
        'notification_preferences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('email_follow', sa.Boolean(), nullable=False),
        sa.Column('email_like', sa.Boolean(), nullable=False),
        sa.Column('email_comment', sa.Boolean(), nullable=False),
        sa.Column('email_mention', sa.Boolean(), nullable=False),
        sa.Column('email_system', sa.Boolean(), nullable=False),
        sa.Column('site_follow', sa.Boolean(), nullable=False),
        sa.Column('site_like', sa.Boolean(), nullable=False),
        sa.Column('site_comment', sa.Boolean(), nullable=False),
        sa.Column('site_mention', sa.Boolean(), nullable=False),
        sa.Column('site_system', sa.Boolean(), nullable=False),
        sa.Column('push_follow', sa.Boolean(), nullable=False),
        sa.Column('push_like', sa.Boolean(), nullable=False),
        sa.Column('push_comment', sa.Boolean(), nullable=False),
        sa.Column('push_mention', sa.Boolean(), nullable=False),
        sa.Column('push_system', sa.Boolean(), nullable=False),
        sa.Column('digest_frequency', sa.String(length=20), nullable=False),
        sa.Column('do_not_disturb_start', sa.String(length=5), nullable=True),
        sa.Column('do_not_disturb_end', sa.String(length=5), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    # 创建通知模板表
    op.create_table(
        'notification_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('title_template', sa.String(length=255), nullable=False),
        sa.Column('content_template', sa.Text(), nullable=False),
        sa.Column('default_priority', sa.String(length=20), nullable=False),
        sa.Column('is_enabled', sa.Boolean(), nullable=False),
        sa.Column('channels', postgresql.JSON(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('type')
    )
    op.create_index('ix_notification_templates_type', 'notification_templates', ['type'])


def downgrade():
    op.drop_index('ix_notification_templates_type', table_name='notification_templates')
    op.drop_table('notification_templates')

    op.drop_table('notification_preferences')

    op.drop_index('ix_notifications_is_read', table_name='notifications')
    op.drop_index('ix_notifications_type', table_name='notifications')
    op.drop_table('notifications')

    op.drop_table('follower_stats')

    op.drop_index('idx_following', table_name='follows')
    op.drop_index('idx_follower', table_name='follows')
    op.drop_table('follows')
