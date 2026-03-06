"""add reading progress table

Revision ID: 001_add_reading_progress
Revises:
Create Date: 2026-03-06

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_add_reading_progress'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """创建阅读进度表"""
    op.create_table(
        'reading_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('article_id', sa.String(), nullable=False),
        sa.Column('article_title', sa.String(), nullable=False),
        sa.Column('progress', sa.Float(), nullable=False, server_default='0'),
        sa.Column('last_position', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_time', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=False),
        sa.Column('last_read_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # 创建索引
    op.create_index('ix_reading_progress_user_id', 'reading_progress', ['user_id'])
    op.create_index('ix_reading_progress_article_id', 'reading_progress', ['article_id'])
    op.create_index('ix_reading_progress_completed', 'reading_progress', ['completed'])


def downgrade():
    """删除阅读进度表"""
    op.drop_index('ix_reading_progress_completed', table_name='reading_progress')
    op.drop_index('ix_reading_progress_article_id', table_name='reading_progress')
    op.drop_index('ix_reading_progress_user_id', table_name='reading_progress')
    op.drop_table('reading_progress')
