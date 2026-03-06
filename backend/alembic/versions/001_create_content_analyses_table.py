"""
Create content_analyses table

Revision ID: 001_create_content_analyses
Revises:
Create Date: 2026-03-07

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, JSON


# revision identifiers, used by Alembic
revision = '001_create_content_analyses'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create content_analyses and analysis_history tables"""

    # Create ENUM for analysis status
    analysis_status_enum = ENUM(
        'pending',
        'completed',
        'failed',
        name='analysisstatus',
        create_type=True
    )

    # Create content_analyses table
    op.create_table(
        'content_analyses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('post_id', sa.Integer(), nullable=True),
        sa.Column('content_hash', sa.String(length=64), nullable=True),
        sa.Column('title', sa.String(length=500), nullable=True),
        sa.Column('content_preview', sa.Text(), nullable=True),
        sa.Column('overall_score', sa.Integer(), nullable=True),
        sa.Column('seo_score', sa.Integer(), nullable=True),
        sa.Column('readability_score', sa.Integer(), nullable=True),
        sa.Column('sentiment_score', sa.Integer(), nullable=True),
        sa.Column('word_count', sa.Integer(), nullable=True),
        sa.Column('sentence_count', sa.Integer(), nullable=True),
        sa.Column('paragraph_count', sa.Integer(), nullable=True),
        sa.Column('avg_sentence_length', sa.Float(), nullable=True),
        sa.Column('avg_word_length', sa.Float(), nullable=True),
        sa.Column('reading_time_minutes', sa.Integer(), nullable=True),
        sa.Column('keyword_density', JSON(), nullable=True),
        sa.Column('suggestions', JSON(), nullable=True),
        sa.Column('issues', JSON(), nullable=True),
        sa.Column('status', analysis_status_enum, nullable=True, server_default='completed'),
        sa.Column('language_code', sa.String(length=10), nullable=True, server_default='en'),
        sa.Column('analysis_version', sa.String(length=20), nullable=True, server_default='1.0'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for better query performance
    op.create_index('ix_content_analyses_id', 'content_analyses', ['id'])
    op.create_index('ix_content_analyses_content_hash', 'content_analyses', ['content_hash'], unique=True)
    op.create_index('ix_content_analyses_user_id', 'content_analyses', ['user_id'])
    op.create_index('ix_content_analyses_post_id', 'content_analyses', ['post_id'])
    op.create_index('ix_content_analyses_overall_score', 'content_analyses', ['overall_score'])
    op.create_index('ix_content_analyses_created_at', 'content_analyses', ['created_at'])

    # Create analysis_history table
    op.create_table(
        'analysis_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('analysis_id', sa.Integer(), nullable=True),
        sa.Column('snapshot_data', JSON(), nullable=True),
        sa.Column('previous_overall_score', sa.Integer(), nullable=True),
        sa.Column('score_delta', sa.Integer(), nullable=True),
        sa.Column('recorded_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['analysis_id'], ['content_analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for history table
    op.create_index('ix_analysis_history_id', 'analysis_history', ['id'])
    op.create_index('ix_analysis_history_analysis_id', 'analysis_history', ['analysis_id'])
    op.create_index('ix_analysis_history_recorded_at', 'analysis_history', ['recorded_at'])


def downgrade():
    """Drop content_analyses and analysis_history tables"""

    # Drop tables
    op.drop_table('analysis_history')
    op.drop_table('content_analyses')

    # Drop ENUM type
    op.execute('DROP TYPE IF EXISTS analysisstatus')
