-- ============================================
-- Migration: 003_reading_progress
-- Created: 2026-03-06
-- Description: Add reading progress tracking
-- ============================================

BEGIN;

-- Create reading_progress table
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    progress DECIMAL(5,2) DEFAULT 0,
    last_position INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Create indexes
CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_post ON reading_progress(post_id);
CREATE INDEX idx_reading_progress_completed ON reading_progress(user_id, completed)
    WHERE completed = TRUE;

-- Create trigger to update updated_at
CREATE TRIGGER update_reading_progress_updated_at
    BEFORE UPDATE ON reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
