"""
Content Analysis Schemas

Pydantic models for content analysis API requests and responses.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# Enums
class AnalysisStatus(str, Enum):
    """Analysis status enumeration"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class SuggestionType(str, Enum):
    """Suggestion type enumeration"""
    IMPROVEMENT = "improvement"
    WARNING = "warning"
    INFO = "info"


class SuggestionCategory(str, Enum):
    """Suggestion category enumeration"""
    SEO = "seo"
    READABILITY = "readability"
    ENGAGEMENT = "engagement"
    STRUCTURE = "structure"


class Priority(str, Enum):
    """Priority level enumeration"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Importance(str, Enum):
    """Keyword importance enumeration"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


# Request Schemas
class ContentAnalysisRequest(BaseModel):
    """Request schema for content analysis"""
    content: str = Field(
        ...,
        min_length=1,
        max_length=100000,
        description="Content to analyze (1-100,000 characters)"
    )
    title: Optional[str] = Field(
        None,
        max_length=500,
        description="Content title for SEO analysis"
    )
    language: str = Field(
        "en",
        description="Content language code (ISO 639-1)"
    )
    save_analysis: bool = Field(
        False,
        description="Whether to save analysis to database"
    )
    post_id: Optional[int] = Field(
        None,
        description="Associated post ID if saving"
    )

    @validator('content')
    def validate_content(cls, v):
        """Ensure content is not just whitespace"""
        if not v.strip():
            raise ValueError('Content cannot be empty or whitespace only')
        return v.strip()

    @validator('language')
    def validate_language(cls, v):
        """Validate language code format"""
        if len(v) != 2:
            raise ValueError('Language code must be 2 characters (ISO 639-1)')
        return v.lower()

    class Config:
        schema_extra = {
            "example": {
                "content": "Your blog post content goes here...",
                "title": "Amazing Blog Post Title",
                "language": "en",
                "save_analysis": False
            }
        }


class BulkAnalysisRequest(BaseModel):
    """Request schema for bulk content analysis"""
    contents: List[ContentAnalysisRequest] = Field(
        ...,
        min_items=1,
        max_items=10,
        description="List of content to analyze (max 10)"
    )

    class Config:
        schema_extra = {
            "example": {
                "contents": [
                    {
                        "content": "First content...",
                        "title": "Title 1"
                    },
                    {
                        "content": "Second content...",
                        "title": "Title 2"
                    }
                ]
            }
        }


# Response Schemas
class KeywordMetric(BaseModel):
    """Keyword density metric"""
    keyword: str = Field(..., description="The keyword")
    count: int = Field(..., ge=0, description="Number of occurrences")
    density: float = Field(..., ge=0, description="Density as percentage")
    importance: Importance = Field(..., description="Importance level")

    class Config:
        schema_extra = {
            "example": {
                "keyword": "python",
                "count": 15,
                "density": 2.5,
                "importance": "high"
            }
        }


class Suggestion(BaseModel):
    """Content improvement suggestion"""
    type: SuggestionType = Field(..., description="Type of suggestion")
    category: SuggestionCategory = Field(..., description="Category of suggestion")
    title: str = Field(..., description="Suggestion title")
    description: str = Field(..., description="Detailed description")
    priority: Priority = Field(..., description="Priority level")

    class Config:
        schema_extra = {
            "example": {
                "type": "warning",
                "category": "seo",
                "title": "Content Too Short",
                "description": "Consider adding more detail...",
                "priority": "high"
            }
        }


class ContentIssue(BaseModel):
    """Content issue found during analysis"""
    type: str = Field(..., description="Issue type (error, warning, info)")
    message: str = Field(..., description="Issue description")
    location: Optional[str] = Field(None, description="Location in content")
    fix: Optional[str] = Field(None, description="Suggested fix")

    class Config:
        schema_extra = {
            "example": {
                "type": "warning",
                "message": "Missing meta description",
                "location": "Header",
                "fix": "Add a meta description tag"
            }
        }


class ContentMetrics(BaseModel):
    """Basic content metrics"""
    word_count: int = Field(..., ge=0, description="Total word count")
    sentence_count: int = Field(..., ge=0, description="Total sentence count")
    paragraph_count: int = Field(..., ge=0, description="Total paragraph count")
    avg_sentence_length: float = Field(..., ge=0, description="Average words per sentence")
    avg_word_length: float = Field(..., ge=0, description="Average characters per word")
    reading_time: int = Field(..., ge=1, description="Estimated reading time in minutes")

    class Config:
        schema_extra = {
            "example": {
                "word_count": 500,
                "sentence_count": 25,
                "paragraph_count": 5,
                "avg_sentence_length": 20.0,
                "avg_word_length": 4.5,
                "reading_time": 3
            }
        }


class ContentAnalysisResponse(BaseModel):
    """Complete content analysis response"""
    # Analysis ID (if saved)
    id: Optional[int] = Field(None, description="Analysis ID if saved to database")

    # Scores (0-100)
    score: int = Field(..., ge=0, le=100, description="Overall quality score")
    seo_score: int = Field(..., ge=0, le=100, description="SEO optimization score")
    readability_score: int = Field(..., ge=0, le=100, description="Readability score")
    sentiment_score: int = Field(..., ge=0, le=100, description="Sentiment analysis score")

    # Analysis details
    keyword_density: List[KeywordMetric] = Field(
        default_factory=list,
        description="Keyword analysis results"
    )
    suggestions: List[Suggestion] = Field(
        default_factory=list,
        description="Improvement suggestions"
    )
    issues: List[ContentIssue] = Field(
        default_factory=list,
        description="Issues found"
    )
    metrics: ContentMetrics = Field(..., description="Content metrics")

    # Metadata
    analyzed_at: datetime = Field(..., description="When analysis was performed")
    analysis_version: str = Field("1.0", description="Analysis algorithm version")

    class Config:
        schema_extra = {
            "example": {
                "score": 75,
                "seo_score": 80,
                "readability_score": 70,
                "sentiment_score": 65,
                "keyword_density": [
                    {
                        "keyword": "python",
                        "count": 15,
                        "density": 2.5,
                        "importance": "high"
                    }
                ],
                "suggestions": [
                    {
                        "type": "improvement",
                        "category": "seo",
                        "title": "Add Meta Description",
                        "description": "Include a meta description for better SEO",
                        "priority": "high"
                    }
                ],
                "issues": [],
                "metrics": {
                    "word_count": 500,
                    "sentence_count": 25,
                    "paragraph_count": 5,
                    "avg_sentence_length": 20.0,
                    "avg_word_length": 4.5,
                    "reading_time": 3
                },
                "analyzed_at": "2026-03-07T12:00:00Z",
                "analysis_version": "1.0"
            }
        }


class BulkAnalysisResponse(BaseModel):
    """Response for bulk analysis"""
    results: List[ContentAnalysisResponse] = Field(
        ...,
        description="List of analysis results"
    )
    total_analyzed: int = Field(..., ge=0, description="Total items analyzed")
    summary: Dict[str, Any] = Field(
        default_factory=dict,
        description="Summary statistics"
    )

    class Config:
        schema_extra = {
            "example": {
                "results": [],
                "total_analyzed": 2,
                "summary": {
                    "avg_score": 75.5,
                    "best_score": 85,
                    "worst_score": 66
                }
            }
        }


class AnalysisHistoryResponse(BaseModel):
    """Response for analysis history"""
    id: int = Field(..., description="Analysis ID")
    overall_score: int = Field(..., description="Overall score")
    seo_score: int = Field(..., description="SEO score")
    readability_score: int = Field(..., description="Readability score")
    created_at: datetime = Field(..., description="When analysis was created")

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "overall_score": 75,
                "seo_score": 80,
                "readability_score": 70,
                "created_at": "2026-03-07T12:00:00Z"
            }
        }


# Utility Schemas
class AnalyzerInfo(BaseModel):
    """Analyzer information and capabilities"""
    endpoint: str = Field(..., description="API endpoint path")
    version: str = Field(..., description="Analyzer version")
    description: str = Field(..., description="Analyzer description")
    features: List[str] = Field(..., description="Available features")
    supported_languages: List[str] = Field(..., description="Supported language codes")
    rate_limits: Dict[str, int] = Field(..., description="Rate limiting info")

    class Config:
        schema_extra = {
            "example": {
                "endpoint": "/api/v1/ai/analyzer",
                "version": "1.0.0",
                "description": "AI-powered content analysis",
                "features": [
                    "SEO Score",
                    "Readability Analysis",
                    "Keyword Density",
                    "Sentiment Analysis"
                ],
                "supported_languages": ["en"],
                "rate_limits": {
                    "requests_per_minute": 60,
                    "requests_per_hour": 1000
                }
            }
        }


# Export all schemas
__all__ = [
    "AnalysisStatus",
    "SuggestionType",
    "SuggestionCategory",
    "Priority",
    "Importance",
    "ContentAnalysisRequest",
    "BulkAnalysisRequest",
    "KeywordMetric",
    "Suggestion",
    "ContentIssue",
    "ContentMetrics",
    "ContentAnalysisResponse",
    "BulkAnalysisResponse",
    "AnalysisHistoryResponse",
    "AnalyzerInfo",
]
