"""
AI Content Analyzer API Tests

Comprehensive test suite for the AI content analysis endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.models.content_analysis import ContentAnalysis
from app.core.auth import create_access_token


client = TestClient(app)


# Fixtures
@pytest.fixture
def db_session():
    """Create test database session"""
    # Implementation would use test database
    pass


@pytest.fixture
def test_user(db_session: Session):
    """Create test user"""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="hashed_password_here"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user: User):
    """Generate authentication headers"""
    token = create_access_token(data={"sub": test_user.email})
    return {"Authorization": f"Bearer {token}"}


# Test Data
SAMPLE_CONTENT = """
Artificial Intelligence is transforming web development in remarkable ways.
Developers can now use AI tools to generate code, debug applications, and optimize performance.
The future of web development looks incredibly promising with AI integration.
"""

SAMPLE_CONTENT_SHORT = "Short content."

SAMPLE_CONTENT_LONG = """
""" + "This is a test sentence. " * 100  # Long content


# Analyzer Info Tests
def test_get_analyzer_info():
    """Test GET /api/v1/ai/analyzer/info"""
    response = client.get("/api/v1/ai/analyzer/info")
    assert response.status_code == 200

    data = response.json()
    assert "endpoint" in data
    assert "version" in data
    assert "features" in data
    assert "supported_languages" in data
    assert "rate_limits" in data

    assert data["endpoint"] == "/api/v1/ai/analyzer"
    assert isinstance(data["features"], list)
    assert "SEO Score" in data["features"]
    assert "Readability Analysis" in data["features"]


# Content Analysis Tests
def test_analyze_content_success():
    """Test successful content analysis"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={
            "content": SAMPLE_CONTENT,
            "title": "Test Article"
        }
    )

    assert response.status_code == 200
    data = response.json()

    # Verify response structure
    assert "score" in data
    assert "seo_score" in data
    assert "readability_score" in data
    assert "sentiment_score" in data
    assert "keyword_density" in data
    assert "suggestions" in data
    assert "metrics" in data
    assert "analyzed_at" in data

    # Verify score ranges
    assert 0 <= data["score"] <= 100
    assert 0 <= data["seo_score"] <= 100
    assert 0 <= data["readability_score"] <= 100
    assert 0 <= data["sentiment_score"] <= 100

    # Verify metrics
    metrics = data["metrics"]
    assert metrics["word_count"] > 0
    assert metrics["sentence_count"] > 0
    assert metrics["paragraph_count"] > 0
    assert metrics["reading_time"] >= 1


def test_analyze_content_without_title():
    """Test analysis without title"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": SAMPLE_CONTENT}
    )

    assert response.status_code == 200
    data = response.json()
    assert "score" in data


def test_analyze_content_with_short_text():
    """Test analysis with very short content"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={
            "content": SAMPLE_CONTENT_SHORT,
            "title": "Short"
        }
    )

    assert response.status_code == 200
    data = response.json()

    # Should have lower scores for short content
    assert data["metrics"]["word_count"] < 100


def test_analyze_content_with_long_text():
    """Test analysis with long content"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={
            "content": SAMPLE_CONTENT_LONG,
            "title": "Long Article"
        }
    )

    assert response.status_code == 200
    data = response.json()

    # Should have better scores for longer content
    assert data["metrics"]["word_count"] > 100
    assert data["seo_score"] > 50


def test_analyze_content_invalid_input():
    """Test analysis with invalid input"""
    # Empty content
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": ""}
    )
    assert response.status_code == 422  # Validation error

    # Missing content
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={}
    )
    assert response.status_code == 422


def test_analyze_content_whitespace_only():
    """Test analysis with whitespace-only content"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": "   \n\n   "}
    )

    assert response.status_code == 422


# Keyword Analysis Tests
def test_keyword_density_analysis():
    """Test keyword density calculation"""
    content_with_keywords = """
    Python is a great programming language. Python developers love Python.
    Python is versatile and Python is easy to learn.
    """

    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={
            "content": content_with_keywords,
            "title": "Python Programming"
        }
    )

    assert response.status_code == 200
    data = response.json()

    # Check if "python" appears in keywords
    keywords = data["keyword_density"]
    assert len(keywords) > 0

    python_keyword = next((k for k in keywords if k["keyword"] == "python"), None)
    assert python_keyword is not None
    assert python_keyword["count"] >= 4
    assert python_keyword["density"] > 0


def test_keyword_importance_levels():
    """Test keyword importance classification"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": SAMPLE_CONTENT, "title": "Test"}
    )

    assert response.status_code == 200
    data = response.json()

    keywords = data["keyword_density"]
    importance_levels = [k["importance"] for k in keywords]

    # Should have different importance levels
    assert "high" in importance_levels or "medium" in importance_levels


# Suggestion Generation Tests
def test_suggestions_for_short_content():
    """Test suggestions for short content"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={
            "content": "This is short.",
            "title": "Short"
        }
    )

    assert response.status_code == 200
    data = response.json()

    suggestions = data["suggestions"]
    assert len(suggestions) > 0

    # Should suggest adding more content
    content_suggestions = [s for s in suggestions if "short" in s["title"].lower()]
    assert len(content_suggestions) > 0


def test_suggestions_structure():
    """Test suggestion structure and types"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": SAMPLE_CONTENT, "title": "Test"}
    )

    assert response.status_code == 200
    data = response.json()

    suggestions = data["suggestions"]
    for suggestion in suggestions:
        # Verify required fields
        assert "type" in suggestion
        assert "category" in suggestion
        assert "title" in suggestion
        assert "description" in suggestion
        assert "priority" in suggestion

        # Verify valid values
        assert suggestion["type"] in ["improvement", "warning", "info"]
        assert suggestion["category"] in ["seo", "readability", "engagement", "structure"]
        assert suggestion["priority"] in ["high", "medium", "low"]


# Sentiment Analysis Tests
def test_sentiment_analysis_positive():
    """Test sentiment analysis with positive content"""
    positive_content = """
    This is amazing and wonderful! I love this great success.
    Everything is perfect and brilliant. Outstanding work!
    """

    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": positive_content}
    )

    assert response.status_code == 200
    data = response.json()

    # Should have higher sentiment score for positive content
    assert data["sentiment_score"] > 50


def test_sentiment_analysis_negative():
    """Test sentiment analysis with negative content"""
    negative_content = """
    This is terrible and awful. I hate this bad failure.
    Everything is wrong and horrible. Poor quality.
    """

    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": negative_content}
    )

    assert response.status_code == 200
    data = response.json()

    # Should have lower sentiment score for negative content
    assert data["sentiment_score"] < 50


def test_sentiment_analysis_neutral():
    """Test sentiment analysis with neutral content"""
    neutral_content = """
    The system processes data and generates reports.
    Users can access the interface through web browsers.
    The application uses a database for storage.
    """

    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": neutral_content}
    )

    assert response.status_code == 200
    data = response.json()

    # Should have neutral sentiment score
    assert 40 <= data["sentiment_score"] <= 60


# Metrics Calculation Tests
def test_word_count_calculation():
    """Test accurate word count calculation"""
    content = "One two three four five."
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": content}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["metrics"]["word_count"] == 5


def test_sentence_count_calculation():
    """Test accurate sentence count calculation"""
    content = "First sentence. Second sentence. Third sentence."
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": content}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["metrics"]["sentence_count"] == 3


def test_reading_time_calculation():
    """Test reading time calculation (200 words per minute)"""
    # Create content with exactly 200 words
    content = "word " * 200
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": content}
    )

    assert response.status_code == 200
    data = response.json()

    # 200 words should be 1 minute reading time
    assert data["metrics"]["reading_time"] >= 1


# Score Calculation Tests
def test_seo_score_calculation():
    """Test SEO score calculation"""
    # Good SEO content
    good_content = " ".join(["python"] * 10) + ". " + " ".join(["programming"] * 10) + "."

    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={
            "content": good_content,
            "title": "Python Programming Guide"
        }
    )

    assert response.status_code == 200
    data = response.json()

    # Should have reasonable SEO score
    assert data["seo_score"] > 0


def test_readability_score_calculation():
    """Test readability score calculation"""
    # Simple, readable content
    simple_content = """
    The cat sat on the mat. It was a nice day.
    The sun was bright. The sky was blue.
    """

    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": simple_content}
    )

    assert response.status_code == 200
    data = response.json()

    # Simple content should have good readability
    assert data["readability_score"] > 50


# Authentication Tests (Optional)
def test_analyze_with_authentication(auth_headers):
    """Test analysis with authenticated user"""
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": SAMPLE_CONTENT, "title": "Test"},
        headers=auth_headers
    )

    assert response.status_code == 200


# Performance Tests
def test_analysis_performance():
    """Test analysis response time"""
    import time

    start_time = time.time()
    response = client.post(
        "/api/v1/ai/analyzer/analyze",
        json={"content": SAMPLE_CONTENT, "title": "Performance Test"}
    )
    end_time = time.time()

    assert response.status_code == 200

    # Should complete in reasonable time (< 5 seconds)
    assert (end_time - start_time) < 5.0


def test_bulk_analysis_performance():
    """Test performance with multiple analyses"""
    import time

    start_time = time.time()

    for i in range(5):
        response = client.post(
            "/api/v1/ai/analyzer/analyze",
            json={"content": SAMPLE_CONTENT, "title": f"Test {i}"}
        )
        assert response.status_code == 200

    end_time = time.time()

    # 5 analyses should complete in reasonable time
    assert (end_time - start_time) < 15.0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
