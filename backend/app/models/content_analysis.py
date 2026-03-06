"""
Content Analysis Model

Stores AI-powered content analysis results for tracking and analytics.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
import enum

from ...core.database import Base


class AnalysisStatus(str, enum.Enum):
    """Analysis status enumeration"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class ContentAnalysis(Base):
    """
    Content Analysis Model

    Stores analysis results for content optimization and tracking.
    """

    __tablename__ = "content_analyses"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=True)

    # Content Information
    content_hash = Column(String(64), unique=True, index=True, comment="SHA-256 hash of content")
    title = Column(String(500), nullable=True)
    content_preview = Column(Text, comment="First 500 chars of content")

    # Analysis Scores (0-100)
    overall_score = Column(Integer, comment="Overall quality score")
    seo_score = Column(Integer, comment="SEO optimization score")
    readability_score = Column(Integer, comment="Readability score")
    sentiment_score = Column(Integer, comment="Sentiment analysis score")

    # Content Metrics
    word_count = Column(Integer)
    sentence_count = Column(Integer)
    paragraph_count = Column(Integer)
    avg_sentence_length = Column(Float)
    avg_word_length = Column(Float)
    reading_time_minutes = Column(Integer)

    # Analysis Details (JSON)
    keyword_density = Column(JSON, comment="Keyword analysis results")
    suggestions = Column(JSON, comment="Improvement suggestions")
    issues = Column(JSON, comment="Issues found")

    # Metadata
    status = Column(
        Enum(AnalysisStatus),
        default=AnalysisStatus.COMPLETED,
        comment="Analysis status"
    )
    language_code = Column(String(10), default="en")
    analysis_version = Column(String(20), default="1.0")

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="content_analyses")
    post = relationship("Post", back_populates="content_analyses")

    def __repr__(self):
        return (
            f"<ContentAnalysis(id={self.id}, "
            f"overall_score={self.overall_score}, "
            f"created_at={self.created_at})>"
        )

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "overall_score": self.overall_score,
            "seo_score": self.seo_score,
            "readability_score": self.readability_score,
            "sentiment_score": self.sentiment_score,
            "word_count": self.word_count,
            "sentence_count": self.sentence_count,
            "paragraph_count": self.paragraph_count,
            "reading_time_minutes": self.reading_time_minutes,
            "keyword_density": self.keyword_density,
            "suggestions": self.suggestions,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def grade(self) -> str:
        """Get letter grade based on overall score"""
        if self.overall_score >= 90:
            return "A+"
        elif self.overall_score >= 80:
            return "A"
        elif self.overall_score >= 70:
            return "B"
        elif self.overall_score >= 60:
            return "C"
        elif self.overall_score >= 50:
            return "D"
        else:
            return "F"

    @property
    def grade_color(self) -> str:
        """Get color class for grade"""
        grade = self.grade
        if grade in ["A+", "A"]:
            return "text-green-500"
        elif grade == "B":
            return "text-blue-500"
        elif grade == "C":
            return "text-yellow-500"
        elif grade == "D":
            return "text-orange-500"
        else:
            return "text-red-500"


class AnalysisHistory(Base):
    """
    Analysis History Model

    Tracks historical analysis data for trend analysis.
    """

    __tablename__ = "analysis_history"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key
    analysis_id = Column(Integer, ForeignKey("content_analyses.id", ondelete="CASCADE"))

    # Historical Data (JSON)
    snapshot_data = Column(JSON, comment="Complete analysis snapshot")

    # Change Tracking
    previous_overall_score = Column(Integer, nullable=True)
    score_delta = Column(Integer, comment="Change in overall score")

    # Timestamps
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    analysis = relationship("ContentAnalysis", back_populates="history")

    def __repr__(self):
        return f"<AnalysisHistory(id={self.id}, recorded_at={self.recorded_at})>"


# Add back_populates to User and Post models if they don't exist
# These should be added to the respective model files:

# In models/user.py:
# content_analyses = relationship("ContentAnalysis", back_populates="user", cascade="all, delete-orphan")

# In models/post.py:
# content_analyses = relationship("ContentAnalysis", back_populates="post", cascade="all, delete-orphan")

# Add history relationship to ContentAnalysis
ContentAnalysis.history = relationship(
    "AnalysisHistory",
    back_populates="analysis",
    cascade="all, delete-orphan",
    order_by="AnalysisHistory.recorded_at.desc()"
)
