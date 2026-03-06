"""add likes and bookmarks tables

Revision ID: 20260306_add_likes_and_bookmarks
Revises:
Create Date: 2026-03-06 19:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260306_add_likes_and_bookmarks'
down_revision = None  # 设置为上一个迁移的ID
branch_labels = None
depends_on = None


def upgrade():
    """创建 likes 和 bookmarks 表"""

    # 创建 likes 表
    op.create_table(
        'likes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=False),
        sa.Column('target_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'target_type', 'target_id', name='uq_user_target_like')
    )

    # 创建索引
    op.create_index('idx_like_target', 'likes', ['target_type', 'target_id'], unique=False)
    op.create_index('idx_like_user', 'likes', ['user_id'], unique=False)

    # 创建 bookmarks 表
    op.create_table(
        'bookmarks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=False),
        sa.Column('target_id', sa.Integer(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'target_type', 'target_id', name='uq_user_target_bookmark')
    )

    # 创建索引
    op.create_index('idx_bookmark_target', 'bookmarks', ['target_type', 'target_id'], unique=False)
    op.create_index('idx_bookmark_user', 'bookmarks', ['user_id'], unique=False)
    op.create_index('idx_bookmark_created', 'bookmarks', ['created_at'], unique=False)


def downgrade():
    """删除 likes 和 bookmarks 表"""

    # 删除 bookmarks 表
    op.drop_index('idx_bookmark_created', table_name='bookmarks')
    op.drop_index('idx_bookmark_user', table_name='bookmarks')
    op.drop_index('idx_bookmark_target', table_name='bookmarks')
    op.drop_table('bookmarks')

    # 删除 likes 表
    op.drop_index('idx_like_user', table_name='likes')
    op.drop_index('idx_like_target', table_name='likes')
    op.drop_table('likes')
