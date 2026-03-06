"""
AI Content Analyzer API

Provides intelligent content analysis for blog posts and articles.
Features:
- SEO Analysis
- Readability Score
- Keyword Density
- Sentiment Analysis
- Content Suggestions
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import re
from collections import Counter

from ...core.database import get_db
from ...models.user import User
from ...core.auth import get_current_user

router = APIRouter(prefix="/ai/analyzer", tags=["AI Analyzer"])


# Pydantic Models
class KeywordMetric(BaseModel):
    """Keyword density metric"""
    keyword: str
    count: int
    density: float
    importance: str = Field(description="high, medium, or low")


class Suggestion(BaseModel):
    """Content improvement suggestion"""
    type: str = Field(description="improvement, warning, or info")
    category: str = Field(description="seo, readability, engagement, or structure")
    title: str
    description: str
    priority: str = Field(description="high, medium, or low")


class ContentMetrics(BaseModel):
    """Basic content metrics"""
    word_count: int
    sentence_count: int
    paragraph_count: int
    avg_sentence_length: float
    avg_word_length: float
    reading_time: int


class AnalysisRequest(BaseModel):
    """Request for content analysis"""
    content: str = Field(..., min_length=1, description="Content to analyze")
    title: Optional[str] = Field(None, description="Content title for SEO analysis")
    language: str = Field("en", description="Content language code")


class AnalysisResult(BaseModel):
    """Analysis result response"""
    score: int = Field(..., ge=0, le=100, description="Overall content score")
    seo_score: int = Field(..., ge=0, le=100, description="SEO optimization score")
    readability_score: int = Field(..., ge=0, le=100, description="Readability score")
    sentiment_score: int = Field(..., ge=0, le=100, description="Sentiment analysis score")
    keyword_density: List[KeywordMetric] = Field(default_factory=list)
    suggestions: List[Suggestion] = Field(default_factory=list)
    issues: List[dict] = Field(default_factory=list)
    metrics: ContentMetrics
    analyzed_at: datetime = Field(default_factory=datetime.utcnow)


# Utility Functions
class ContentAnalyzer:
    """Content analysis utilities"""

    # Common stop words (English)
    STOP_WORDS = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
        'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
        'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how'
    }

    # Positive and negative words for sentiment analysis
    POSITIVE_WORDS = {
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
        'love', 'happy', 'joy', 'success', 'best', 'perfect', 'awesome',
        'brilliant', 'outstanding', 'positive', 'beautiful', 'incredible',
        'remarkable', 'exceptional', 'superb', 'fabulous', 'terrific'
    }

    NEGATIVE_WORDS = {
        'bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry',
        'worst', 'poor', 'negative', 'ugly', 'fail', 'failure', 'wrong',
        'problem', 'issue', 'difficult', 'hard', 'painful', 'disappointing',
        'frustrating', 'annoying', 'disappointing', 'unsatisfactory'
    }

    @staticmethod
    def calculate_word_count(text: str) -> int:
        """Calculate word count"""
        words = text.strip().split()
        return len([w for w in words if len(w) > 0])

    @staticmethod
    def calculate_sentence_count(text: str) -> int:
        """Calculate sentence count"""
        sentences = re.split(r'[.!?]+', text)
        return len([s for s in sentences if s.strip()])

    @staticmethod
    def calculate_paragraph_count(text: str) -> int:
        """Calculate paragraph count"""
        paragraphs = re.split(r'\n\n+', text)
        return len([p for p in paragraphs if p.strip()])

    @staticmethod
    def calculate_avg_sentence_length(word_count: int, sentence_count: int) -> float:
        """Calculate average sentence length"""
        if sentence_count == 0:
            return 0.0
        return round(word_count / sentence_count, 2)

    @staticmethod
    def calculate_avg_word_length(text: str) -> float:
        """Calculate average word length"""
        words = text.strip().split()
        if not words:
            return 0.0

        total_length = sum(len(word) for word in words)
        return round(total_length / len(words), 2)

    @staticmethod
    def calculate_reading_time(word_count: int) -> int:
        """Calculate reading time (average 200 words per minute)"""
        return max(1, (word_count // 200) + 1)

    @classmethod
    def extract_keywords(cls, text: str, word_count: int) -> List[KeywordMetric]:
        """Extract keywords and calculate density"""
        # Clean and tokenize
        words = re.sub(r'[^\w\s]', '', text.lower()).split()
        words = [w for w in words if len(w) > 3 and w not in cls.STOP_WORDS]

        if not words:
            return []

        # Count frequency
        frequency = Counter(words)

        # Build keyword metrics
        keywords = []
        for word, count in frequency.most_common(15):
            density = (count / word_count) * 100 if word_count > 0 else 0

            # Determine importance
            if count > 3:
                importance = 'high'
            elif count > 1:
                importance = 'medium'
            else:
                importance = 'low'

            keywords.append(KeywordMetric(
                keyword=word,
                count=count,
                density=round(density, 2),
                importance=importance
            ))

        return keywords

    @classmethod
    def calculate_seo_score(
        cls,
        metrics: ContentMetrics,
        keywords: List[KeywordMetric],
        has_title: bool
    ) -> int:
        """Calculate SEO score"""
        score = 0

        # Content length (30 points)
        if metrics.word_count >= 300:
            score += 30
        elif metrics.word_count >= 200:
            score += 20
        elif metrics.word_count >= 100:
            score += 10

        # Title presence (20 points)
        if has_title:
            score += 20

        # Keyword density (25 points)
        has_good_keywords = any(1 <= k.density <= 3 for k in keywords)
        if has_good_keywords:
            score += 25

        # Paragraph structure (15 points)
        if metrics.paragraph_count >= 3:
            score += 15
        elif metrics.paragraph_count >= 2:
            score += 10

        # Sentence length (10 points)
        if 15 <= metrics.avg_sentence_length <= 25:
            score += 10
        elif 10 <= metrics.avg_sentence_length <= 30:
            score += 5

        return min(score, 100)

    @classmethod
    def calculate_readability_score(cls, metrics: ContentMetrics) -> int:
        """Calculate readability score (Flesch Reading Ease)"""
        avg_sentence_length = metrics.avg_sentence_length
        avg_word_length = metrics.avg_word_length

        # Simplified Flesch formula
        score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * (avg_word_length / 100))

        # Convert to 0-100 scale
        return max(0, min(100, int(score)))

    @classmethod
    def calculate_sentiment_score(cls, text: str) -> int:
        """Calculate sentiment score"""
        words = text.lower().split()
        positive_count = sum(1 for w in words if w in cls.POSITIVE_WORDS)
        negative_count = sum(1 for w in words if w in cls.NEGATIVE_WORDS)

        total = positive_count + negative_count
        if total == 0:
            return 50  # Neutral

        return int((positive_count / total) * 100)

    @classmethod
    def generate_suggestions(
        cls,
        metrics: ContentMetrics,
        seo_score: int,
        readability_score: int,
        keywords: List[KeywordMetric]
    ) -> List[Suggestion]:
        """Generate improvement suggestions"""
        suggestions = []

        # Content length
        if metrics.word_count < 300:
            suggestions.append(Suggestion(
                type='warning',
                category='seo',
                title='Content Too Short',
                description='Consider adding more detail. Ideally, aim for at least 300 words for better SEO.',
                priority='high'
            ))

        # Paragraph structure
        if metrics.paragraph_count < 3:
            suggestions.append(Suggestion(
                type='improvement',
                category='structure',
                title='Improve Paragraph Structure',
                description='Break your content into more paragraphs for better readability.',
                priority='medium'
            ))

        # Sentence length
        if metrics.avg_sentence_length > 25:
            suggestions.append(Suggestion(
                type='improvement',
                category='readability',
                title='Long Sentences',
                description='Some sentences are quite long. Consider breaking them down for easier reading.',
                priority='medium'
            ))

        # Keyword density
        high_density = [k for k in keywords if k.density > 3]
        if high_density:
            suggestions.append(Suggestion(
                type='warning',
                category='seo',
                title='Keyword Overuse',
                description=f'"{high_density[0].keyword}" appears too frequently. Aim for 1-3% density.',
                priority='high'
            ))

        # Readability
        if readability_score < 60:
            suggestions.append(Suggestion(
                type='improvement',
                category='readability',
                title='Improve Readability',
                description='Use simpler language and shorter sentences to make content more accessible.',
                priority='medium'
            ))

        # SEO improvements
        if seo_score < 70:
            suggestions.append(Suggestion(
                type='improvement',
                category='seo',
                title='Boost SEO',
                description='Add a compelling title, include relevant keywords, and ensure proper formatting.',
                priority='high'
            ))

        return suggestions


# API Endpoints
@router.post("/analyze", response_model=AnalysisResult, status_code=status.HTTP_200_OK)
async def analyze_content(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Analyze content using AI

    Returns comprehensive analysis including:
    - Overall quality score
    - SEO optimization score
    - Readability assessment
    - Sentiment analysis
    - Keyword density
    - Improvement suggestions
    """
    try:
        # Calculate metrics
        word_count = ContentAnalyzer.calculate_word_count(request.content)
        sentence_count = ContentAnalyzer.calculate_sentence_count(request.content)
        paragraph_count = ContentAnalyzer.calculate_paragraph_count(request.content)
        avg_sentence_length = ContentAnalyzer.calculate_avg_sentence_length(
            word_count, sentence_count
        )
        avg_word_length = ContentAnalyzer.calculate_avg_word_length(request.content)
        reading_time = ContentAnalyzer.calculate_reading_time(word_count)

        metrics = ContentMetrics(
            word_count=word_count,
            sentence_count=sentence_count,
            paragraph_count=paragraph_count,
            avg_sentence_length=avg_sentence_length,
            avg_word_length=avg_word_length,
            reading_time=reading_time
        )

        # Extract keywords
        keyword_density = ContentAnalyzer.extract_keywords(request.content, word_count)

        # Calculate scores
        seo_score = ContentAnalyzer.calculate_seo_score(
            metrics, keyword_density, bool(request.title)
        )
        readability_score = ContentAnalyzer.calculate_readability_score(metrics)
        sentiment_score = ContentAnalyzer.calculate_sentiment_score(request.content)

        # Calculate overall score
        overall_score = int(
            seo_score * 0.3 +
            readability_score * 0.3 +
            sentiment_score * 0.2 +
            min(word_count / 3, 100) * 0.2
        )

        # Generate suggestions
        suggestions = ContentAnalyzer.generate_suggestions(
            metrics, seo_score, readability_score, keyword_density
        )

        # Build result
        result = AnalysisResult(
            score=overall_score,
            seo_score=seo_score,
            readability_score=readability_score,
            sentiment_score=sentiment_score,
            keyword_density=keyword_density,
            suggestions=suggestions,
            issues=[],
            metrics=metrics,
            analyzed_at=datetime.utcnow()
        )

        # In production, save analysis to database for analytics
        # await save_analysis_result(db, current_user, result)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/info", status_code=status.HTTP_200_OK)
async def get_analyzer_info():
    """Get analyzer information and capabilities"""
    return {
        "endpoint": "/api/v1/ai/analyzer",
        "version": "1.0.0",
        "description": "AI-powered content analysis",
        "features": [
            "SEO Score",
            "Readability Analysis",
            "Keyword Density",
            "Sentiment Analysis",
            "Content Suggestions",
            "Reading Time Calculation"
        ],
        "supported_languages": ["en"],
        "rate_limits": {
            "requests_per_minute": 60,
            "requests_per_hour": 1000
        }
    }


# Optional dependency for public access
async def get_current_user_optional():
    """Make authentication optional for analysis endpoint"""
    return None
